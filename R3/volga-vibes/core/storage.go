package core

import "github.com/dgraph-io/badger/v4"

func (app *App) saveEnvelope(id []byte, encryptedEnvelope []byte) error {
	return app.db.Update(func(txn *badger.Txn) error {
		if err := txn.Set(id[:4], id); err != nil {
			return err
		}
		return txn.Set(id, encryptedEnvelope)
	})
}

func (app *App) getEnvelope(round []byte) (id []byte, encryptedEnvelope []byte, err error) {
	err = app.db.View(func(txn *badger.Txn) error {
		item, err := txn.Get(round)
		if err != nil {
			return err
		}
		id, err = item.ValueCopy(nil)
		if err != nil {
			return err
		}

		item, err = txn.Get(id)
		if err != nil {
			return err
		}
		encryptedEnvelope, err = item.ValueCopy(nil)
		return err
	})
	return
}
