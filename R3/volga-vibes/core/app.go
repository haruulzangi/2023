package core

import (
	"crypto/tls"

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

	log.WithField("address", conn.RemoteAddr().String()).Info("New connection")
}
