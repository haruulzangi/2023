from dotenv import load_dotenv

load_dotenv()

import logging

logging.basicConfig(
    filename="./logs/log_volga_vibes.log",
    filemode="a",
    format="%(asctime)s,%(msecs)d %(name)s %(levelname)s %(message)s",
    datefmt="%H:%M:%S",
    level=logging.DEBUG,
)

from enum import Enum
from runner.socket import Socket


class ServiceStatus(Enum):
    UP = 0
    DOWN = 3


def check(host: str, port: int) -> ServiceStatus:
    try:
        with Socket(host, port) as sock:
            sock.send_message(b"PING")
            response = sock.read_message()
            if response != b"PONG":
                return ServiceStatus.DOWN
            return ServiceStatus.DOWN
    except Exception:
        return ServiceStatus.DOWN


def main():
    raise Exception("Not implemented yet")


if __name__ == "__main__":
    main()
