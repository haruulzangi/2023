package core

import (
	"crypto/tls"
	"io"

	"github.com/dgraph-io/badger/v4"
	log "github.com/sirupsen/logrus"
)

type App struct {
	db *badger.DB
}

func (app *App) Init(dbPath string) (*App, error) {
	var err error
	app.db, err = badger.Open(badger.DefaultOptions(dbPath))
	if err != nil {
		return nil, err
	}
	return app, nil
}

func (app *App) ListenAndServe(address string, tlsConfig *tls.Config) error {
	listener, err := tls.Listen("tcp", address, tlsConfig)
	if err != nil {
		return err
	}

	log.Info("Server listening on ", listener.Addr().String())
	for {
		conn, err := listener.Accept()
		if err != nil {
			continue
		}
		go app.handleConnection(conn.(*tls.Conn))
	}
}

func (app *App) Close() {
	app.db.Close()
}

func (app *App) handleConnection(conn *tls.Conn) {
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
		default:
			log.WithField("address", conn.RemoteAddr().String()).Error("Unknown command: ", string(cmd))
			return
		}
	}
}
