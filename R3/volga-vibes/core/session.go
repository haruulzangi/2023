package core

import (
	"crypto/subtle"
	"encoding/binary"
	"encoding/hex"
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
			commandLogger := logger.WithField("command", "PUSH")

			roundBytes, err := session.readMessage()
			if err != nil {
				commandLogger.Error("Failed to read message: ", err)
				return
			}
			round := binary.BigEndian.Uint16(roundBytes)
			envelope, err := session.readMessage()
			if err != nil {
				commandLogger.Error("Failed to read message: ", err)
				return
			}

			encryptedEnvelope, id, err := app.encryptData(envelope, round)
			if err != nil {
				commandLogger.Error("Failed to encrypt data: ", err)
				session.sendMessage([]byte("-"))
				return
			}
			if err = session.sendMessage(encryptedEnvelope); err != nil {
				commandLogger.Error("Failed to send message: ", err)
				return
			}
			if err = session.sendMessage(id); err != nil {
				commandLogger.Error("Failed to send message: ", err)
				return
			}

			peerCert := session.conn.ConnectionState().PeerCertificates[0]
			if len(peerCert.EmailAddresses) == 0 || peerCert.EmailAddresses[0] != "checker@final.haruulzangi.mn" {
				session.sendMessage([]byte("-"))
				return
			}
			if err = app.saveEnvelope(id, encryptedEnvelope); err != nil {
				commandLogger.Error("Failed to save envelope: ", err)
				session.sendMessage([]byte("ERROR"))
				return
			}

			if err = session.sendMessage([]byte("+")); err != nil {
				commandLogger.Error("Failed to send message: ", err)
				return
			}
			commandLogger.Info("Data saved for round ", round)
		case "PULL":
			log.Trace("Received PULL command")
			commandLogger := logger.WithField("command", "PULL")

			roundBytes, err := session.readMessage()
			if err != nil {
				commandLogger.Error("Failed to read message: ", err)
				return
			}
			round := binary.BigEndian.Uint16(roundBytes)

			id, encryptedEnvelope, err := app.getEnvelope(round)
			if err != nil {
				commandLogger.Error("Failed to get envelope: ", err)
				session.sendMessage([]byte("ERROR"))
				return
			}

			if err = session.sendMessage(id); err != nil {
				commandLogger.Error("Failed to send message: ", err)
				return
			}

			expectedAuthTag := encryptedEnvelope[len(encryptedEnvelope)-tagSize:]
			encryptedEnvelopeData := encryptedEnvelope[:len(encryptedEnvelope)-tagSize]
			if err = session.sendMessage(encryptedEnvelopeData); err != nil {
				commandLogger.Error("Failed to send message: ", err)
				return
			}
			plaintext, err := app.decryptData(encryptedEnvelope, id)
			if err != nil {
				commandLogger.Error("Failed to decrypt data: ", err)
				session.sendMessage([]byte("ERROR"))
				return
			}

			receivedAuthTag, err := session.readMessage()
			if err != nil {
				commandLogger.Error("Failed to read message: ", err)
				return
			}
			commandLogger.Tracef("Received authentication tag %s, expected %s", hex.EncodeToString(receivedAuthTag), hex.EncodeToString(expectedAuthTag))
			if subtle.ConstantTimeCompare(receivedAuthTag, expectedAuthTag) != 1 {
				commandLogger.Error("Invalid authentication tag")
				session.sendMessage([]byte("-"))
				return
			}

			if err = session.sendMessage(plaintext); err != nil {
				commandLogger.Error("Failed to send message: ", err)
				return
			}
		case "EXIT":
			log.Trace("Received EXIT command")
			if err = session.sendMessage([]byte("+")); err != nil {
				logger.Error("Failed to send message: ", err)
			}
			return
		default:
			logger.Error("Unknown command: ", string(cmd))
			return
		}
	}
}
