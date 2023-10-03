package core

import (
	"context"
	"crypto/tls"
	"io"

	log "github.com/sirupsen/logrus"
)

func (app *App) listen(address string, tlsConfig *tls.Config) (chan *tls.Conn, error) {
	var err error
	app.listener, err = tls.Listen("tcp", address, tlsConfig)
	if err != nil {
		return nil, err
	}
	log.Info("Server listening on ", app.listener.Addr().String())

	ch := make(chan *tls.Conn)
	go func() {
		for {
			conn, err := app.listener.Accept()
			if err != nil {
				continue
			}
			ch <- conn.(*tls.Conn)
		}
	}()
	return ch, nil
}

func (app *App) ListenAndServe(ctx context.Context, address string, tlsConfig *tls.Config) error {
	incomingChan, err := app.listen(address, tlsConfig)
	if err != nil {
		return err
	}
	for {
		select {
		case conn := <-incomingChan:
			go app.handleConnection(conn)
		case <-ctx.Done():
			return nil
		}
	}
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
