package core

import (
	"net"

	log "github.com/sirupsen/logrus"
)

type App struct {
}

func (app *App) HandleConnection(conn net.Conn) {
	defer conn.Close()
	log.WithField("address", conn.RemoteAddr().String()).Info("New connection")
}
