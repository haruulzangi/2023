import ssl
import socket
import struct


class Socket:
    _socket: socket.socket
    connection: ssl.SSLSocket

    def __init__(self, host: str, port: int):
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.connect((host, port))

        ctx = ssl.SSLContext(ssl.PROTOCOL_TLSv1_2)
        ctx.verify_mode = ssl.CERT_REQUIRED
        ctx.load_verify_locations("certs/ca.crt")
        ctx.load_cert_chain(certfile="certs/checker.crt", keyfile="certs/checker.key")

        tls_sock = ctx.wrap_socket(sock, server_side=False)
        peer_cert = tls_sock.getpeercert()
        if not peer_cert:
            raise Exception("No peer certificate found")

        self._socket = sock
        self.connection = tls_sock

    def close(self):
        self.connection.close()
        self._socket.close()

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        self.close()

    def send_message(self, data: bytes):
        size = len(data)
        self.connection.sendall(struct.pack(">I", size))
        self.connection.sendall(data)

    def read_message(self) -> bytes:
        size = struct.unpack(">I", self.connection.recv(4))[0]
        return self.connection.recv(size)
