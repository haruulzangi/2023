package core

import (
	"crypto/aes"
	"crypto/cipher"
	"fmt"
)

const tagSize = 16

var encryptionNonce = []byte{0x3a, 0x68, 0x7a, 0x32, 0x30, 0x32, 0x33, 0x66, 0x69, 0x6e, 0x61, 0x6c}

func (app *App) encryptData(plaintext []byte, round uint16) (ciphertext []byte, id []byte, err error) {
	keyBuffer, err := app.keyEnclave.Open()
	if err != nil {
		return nil, nil, err
	}
	defer keyBuffer.Destroy()

	block, err := aes.NewCipher(keyBuffer.Bytes())
	if err != nil {
		return nil, nil, err
	}

	gcm, err := cipher.NewGCMWithTagSize(block, tagSize)
	if err != nil {
		return nil, nil, err
	}

	ciphertext = gcm.Seal(nil, encryptionNonce, plaintext, nil)
	id = make([]byte, 16)
	copy(id, []byte(fmt.Sprintf("%04d", round)))
	copy(id[4:], encryptionNonce)
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
