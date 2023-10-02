package main

import (
	"crypto/tls"
	"crypto/x509"
	"fmt"
	"os"

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
	listener, err := tls.Listen("tcp", fmt.Sprintf("%s:%s", host, port), tlsConfig)
	if err != nil {
		log.Panic("Failed to listen: ", err)
	}
	log.Info("Server listening on ", listener.Addr().String())

	app := new(core.App)
	for {
		conn, err := listener.Accept()
		if err != nil {
			continue
		}
		go app.HandleConnection(conn.(*tls.Conn))
	}
}
