package main

import (
	"context"
	"crypto/tls"
	"crypto/x509"
	"fmt"
	"os"
	"os/signal"

	"github.com/haruulzangi/2023/R3/volga-vibes/core"
	log "github.com/sirupsen/logrus"
)

func main() {
	host := os.Getenv("HOST")
	if host == "" {
		host = "0.0.0.0"
	}
	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}
	if level, err := log.ParseLevel(os.Getenv("LOG_LEVEL")); err == nil {
		log.SetLevel(level)
	}

	app, err := new(core.App).Init("./data/app.badger")
	if err != nil {
		log.Panic("Failed to open database: ", err)
	}
	defer app.Close()

	caCertPool := x509.NewCertPool()
	caCertFile, err := os.ReadFile("./certs/ca.crt")
	if err != nil {
		log.Panic("Failed to load CA cert file: ", err)
	}
	caCertPool.AppendCertsFromPEM(caCertFile)

	cert, err := tls.LoadX509KeyPair("./certs/host.crt", "./certs/host.key")
	if err != nil {
		log.Panic("Failed to load host certificate or private key: ", err)
	}

	tlsConfig := &tls.Config{
		ClientCAs:    caCertPool,
		ClientAuth:   tls.RequireAndVerifyClientCert,
		MinVersion:   tls.VersionTLS12,
		Certificates: []tls.Certificate{cert},
	}

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt)
	defer stop()

	err = app.ListenAndServe(ctx, fmt.Sprintf("%s:%s", host, port), tlsConfig)
	if err != nil {
		log.Panic("Failed to listen: ", err)
	}
}
