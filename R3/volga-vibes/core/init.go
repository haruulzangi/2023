package core

import (
	"net"

	"github.com/dgraph-io/badger/v4"
)

type App struct {
	db       *badger.DB
	listener net.Listener
}

func (app *App) Init(dbPath string) (*App, error) {
	var err error
	app.db, err = badger.Open(badger.DefaultOptions(dbPath))
	if err != nil {
		return nil, err
	}
	return app, nil
}

func (app *App) Close() error {
	if err := app.listener.Close(); err != nil {
		return err
	}
	return app.db.Close()
}
