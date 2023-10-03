package core

import (
	"encoding/hex"
	"net"

	"github.com/awnumar/memguard"
	"github.com/dgraph-io/badger/v4"
	log "github.com/sirupsen/logrus"
)

type App struct {
	db         *badger.DB
	keyEnclave *memguard.Enclave
	listener   net.Listener
}

func (app *App) Init(dbPath string) (*App, error) {
	var err error
	app.db, err = badger.Open(badger.DefaultOptions(dbPath))
	if err != nil {
		return nil, err
	}

	key, err := hex.DecodeString("4348414e47454d454348414e47454d454348414e47454d454348414e47454d45")
	if err != nil {
		log.Panic("Failed to decode key: ", err)
	}
	app.keyEnclave = memguard.NewEnclave(key)
	return app, nil
}

func (app *App) Close() error {
	if err := app.listener.Close(); err != nil {
		return err
	}
	return app.db.Close()
}
