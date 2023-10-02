package core

import (
	"crypto/tls"
	"io"

	log "github.com/sirupsen/logrus"
)

type App struct {
}

func (app *App) HandleConnection(conn *tls.Conn) {
	defer conn.Close()
	err := conn.Handshake()
	if err != nil {
		log.Error("Failed to perform TLS handshake with ", conn.RemoteAddr().String(), ": ", err)
		return
	}

	session := &Session{conn: conn}
	log.WithField("address", conn.RemoteAddr().String()).Info("New connection")
	for {
		cmd, err := session.readMessage()
		if err != nil {
			if err != io.EOF {
				log.WithField("address", conn.RemoteAddr().String()).Error("Failed to read message: ", err)
			}
			return
		}

		log.Trace("Received command: ", string(cmd))
		switch string(cmd) {
		case "PING":
			err = session.sendMessage([]byte("PONG"))
			if err != nil {
				log.WithField("address", conn.RemoteAddr().String()).Error("Failed to send message: ", err)
				return
			}
			break
		default:
			log.WithField("address", conn.RemoteAddr().String()).Error("Unknown command: ", string(cmd))
			return
		}
	}
}
