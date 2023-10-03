package core

import (
	"crypto/aes"
	"crypto/cipher"
	"encoding/hex"
	"fmt"
)

func (app *App) encryptData(plaintext []byte, round int) (ciphertext []byte, id []byte, err error) {
	keyBuffer, err := app.keyEnclave.Open()
	if err != nil {
		return nil, nil, err
	}
	defer keyBuffer.Destroy()

	block, err := aes.NewCipher(keyBuffer.Bytes())
	if err != nil {
		return nil, nil, err
	}

	nonce, err := hex.DecodeString("3a687a3230323366696e616c")
	if err != nil {
		return nil, nil, err
	}

	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return nil, nil, err
	}

	ciphertext = gcm.Seal(nil, nonce, plaintext, nil)
	id = make([]byte, 16)
	copy(id, []byte(fmt.Sprintf("%04d", round)))
	copy(id[4:], nonce)
	return
}

func (app *App) decryptData(ciphertext []byte, id []byte) (plaintext []byte, err error) {
	keyBuffer, err := app.keyEnclave.Open()
	if err != nil {
		return nil, err
	}
	defer keyBuffer.Destroy()

	block, err := aes.NewCipher(keyBuffer.Bytes())
	if err != nil {
		return nil, err
	}

	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return nil, err
	}

	nonce := id[4:]
	plaintext, err = gcm.Open(nil, nonce, ciphertext, nil)
	return
}
