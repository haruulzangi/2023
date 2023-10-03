package core

import (
	"encoding/binary"
	"net"
)

type Session struct{ conn net.Conn }

func (s *Session) sendMessage(data []byte) error {
	size := len(data)
	if err := binary.Write(s.conn, binary.BigEndian, uint32(size)); err != nil {
		return err
	}

	written := 0
	for written < size {
		n, err := s.conn.Write(data[written:])
		if err != nil {
			return err
		}
		written += n
	}

	return nil
}

func (s *Session) readMessage() ([]byte, error) {
	var size uint32
	if err := binary.Read(s.conn, binary.BigEndian, &size); err != nil {
		return nil, err
	}

	data := make([]byte, size)
	read := 0
	for read < int(size) {
		n, err := s.conn.Read(data[read:])
		if err != nil {
			return nil, err
		}
		read += n
	}

	return data, nil
}
