package core

import (
	"encoding/hex"
	"fmt"

	"github.com/dgraph-io/badger/v4"
	"github.com/pkg/errors"
)

func (app *App) saveEnvelope(id []byte, encryptedEnvelope []byte) error {
	return app.db.Update(func(txn *badger.Txn) error {
		if err := txn.Set(id[:4], id); err != nil {
			return err
		}
		return txn.Set(id, encryptedEnvelope)
	})
}

func (app *App) getEnvelope(round uint16) (id []byte, encryptedEnvelope []byte, err error) {
	err = app.db.View(func(txn *badger.Txn) error {
		item, err := txn.Get([]byte(fmt.Sprintf("%04d", round)))
		if err != nil {
			return errors.Wrapf(err, "failed to get envelope id for round %d", round)
		}
		id, err = item.ValueCopy(nil)
		if err != nil {
			return err
		}

		item, err = txn.Get(id)
		if err != nil {
			return errors.Wrapf(err, "failed to get envelope with id %s", hex.EncodeToString(id))
		}
		encryptedEnvelope, err = item.ValueCopy(nil)
		return err
	})
	return
}
