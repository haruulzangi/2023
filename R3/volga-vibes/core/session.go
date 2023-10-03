package core

import (
	"io"

	log "github.com/sirupsen/logrus"
)

func (app *App) handleSession(session *Session) {
	logger := log.WithField("address", session.conn.RemoteAddr().String())
	logger.Info("New connection")
	for {
		cmd, err := session.readMessage()
		if err != nil {
			if err != io.EOF {
				logger.Error("Failed to read message: ", err)
			}
			return
		}

		log.Trace("Received command: ", string(cmd))
		switch string(cmd) {
		case "PING":
			log.Trace("Received PING command")
			err = session.sendMessage([]byte("PONG"))
			if err != nil {
				logger.Error("Failed to send message: ", err)
				return
			}
		case "PUSH":
			log.Trace("Received PUSH command")
		case "PULL":
			log.Trace("Received PULL command")
		default:
			logger.Error("Unknown command: ", string(cmd))
			return
		}
	}
}
