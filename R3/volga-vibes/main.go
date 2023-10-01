package main

import (
	"fmt"
	"net"
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

	listener, err := net.Listen("tcp", fmt.Sprintf("%s:%s", host, port))
	if err != nil {
		panic(err)
	}
	log.Info("Server listening on ", listener.Addr().String())

	app := new(core.App)
	for {
		conn, err := listener.Accept()
		if err != nil {
			continue
		}
		go app.HandleConnection(conn)
	}
}
