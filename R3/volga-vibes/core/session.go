package core

import (
	"io"

	log "github.com/sirupsen/logrus"
)

func (app *App) handleSession(session *Session) {
	remoteAddr := session.conn.RemoteAddr().String()

	log.WithField("address", remoteAddr).Info("New connection")
	for {
		cmd, err := session.readMessage()
		if err != nil {
			if err != io.EOF {
				log.WithField("address", remoteAddr).Error("Failed to read message: ", err)
			}
			return
		}

		log.Trace("Received command: ", string(cmd))
		switch string(cmd) {
		case "PING":
			err = session.sendMessage([]byte("PONG"))
			if err != nil {
				log.WithField("address", remoteAddr).Error("Failed to send message: ", err)
				return
			}
		default:
			log.WithField("address", remoteAddr).Error("Unknown command: ", string(cmd))
			return
		}
	}
}
