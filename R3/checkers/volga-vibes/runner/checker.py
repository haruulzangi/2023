import os
import struct
import sqlite3
import logging
import requests
from .socket import Socket

db = sqlite3.connect("volga-vibes-checker.sqlite3", check_same_thread=False)
db.execute(
    "CREATE TABLE IF NOT EXISTS flags (round INT, flag TEXT, flag_id BLOB, ciphertext BLOB, box_id TEXT)"
)

tag_size = 16
timeout = 5


def pull(socket: Socket, game_round: int, box_id: str) -> bool:
    logging.info(f"Pulling flag for round {game_round} for {box_id}")
    try:
        socket.send_message(b"PULL")
        struct.pack(">H", game_round)
        socket.send_message(struct.pack(">H", game_round))
        flag_id = socket.read_message()
        logging.debug(f"Flag ID received from {box_id}: {flag_id}")
        if len(flag_id) != 16:
            logging.info(f"Invalid ID received from {box_id}")
            return False
        encrypted_envelope = socket.read_message()

        flag_data = db.execute(
            "SELECT flag, flag_id, ciphertext FROM flags WHERE round = ? AND box_id = ?",
            (game_round, box_id),
        ).fetchone()
        if not flag_data:
            logging.warn(f"Flag not found for {box_id}, skipping PULL check")
            return True

        (flag, flag_id, ciphertext) = flag_data
        auth_tag = ciphertext[-tag_size:]
        if encrypted_envelope != ciphertext[:-tag_size]:
            logging.error(f"Invalid ciphertext received from {box_id}")
            return False

        socket.send_message(auth_tag)
        plaintext = socket.read_message().decode()
        logging.debug(f"Flag received from {box_id}: {plaintext}")
        if plaintext != flag:
            logging.error(f"Invalid flag received from {box_id}")
            logging.debug(f"Expected: {flag}")
            return False
        logging.info(
            f"Flag for round {game_round} was successfully pulled from {box_id}"
        )
        return True
    except:
        return False


def push(socket: Socket, game_round: int, flag: str, box_id: str) -> bool:
    logging.info(f"Pushing flag for round {game_round} for {box_id}")
    try:
        count = db.execute(
            "SELECT COUNT(*) FROM flags WHERE round = ? AND box_id = ?",
            (game_round, box_id),
        ).fetchone()
        if count[0] > 0:
            logging.warn(f"Flag already pushed for {box_id}, skipping PUSH check")
            return True

        socket.send_message(b"PUSH")
        socket.send_message(struct.pack(">H", game_round))
        socket.send_message(flag.encode())
        encrypted_envelope = socket.read_message()
        flag_id = socket.read_message()
        if len(flag_id) != 16:
            logging.error(f"Invalid ID received from {box_id}")
            return False
        if socket.read_message() != b"+":
            logging.error(f"Invalid response received from {box_id}")
            return False

        db.execute(
            "INSERT INTO flags (round, flag, flag_id, ciphertext, box_id) VALUES (?, ?, ?, ?, ?)",
            (
                game_round,
                flag,
                flag_id,
                encrypted_envelope,
                box_id,
            ),
        )
        db.commit()

        logging.info(f"Flag for round {game_round} pushed for {box_id}")
        return True
    except Exception as e:
        logging.error(f"An error occurred: {str(e)}")
        return False


def _run_check(host: str, port: int, game_round: int, box_id: str, flag: str):
    try:
        with Socket(host, port, role="checker") as push_socket:
            if not push(push_socket, game_round, flag, box_id):
                return False
            push_socket.send_message(b"EXIT")
            if push_socket.read_message() != b"+":
                return False
        with Socket(host, port, role="host") as pull_socket:
            if game_round > 1 and not pull(pull_socket, game_round - 1, box_id):
                return False
            if not pull(pull_socket, game_round, box_id):
                return False
    except Exception as e:
        logging.error("An error occurred: %s", str(e))
        return False


def run_checker(
    host: str,
    port: int,
    game_round: int,
    box_id: str,
    challenge_id: str,
    flag: str,
    auth_token: str,
):
    logging.info(f"Starting Round {game_round}")
    try:
        status = _run_check(host, port, game_round, box_id, flag)
        if status:
            logging.info(f"Box {box_id} is UP")
        else:
            logging.info(f"Box {box_id} is DOWN")
        resp = requests.post(
            f"{os.getenv('API_BASE_URL')}/down",
            headers={"Authorization": auth_token, "Content-Type": "application/json"},
            json={
                "gamebox_id": box_id,
                "challenge_id": challenge_id,
                # Send False if box is up, True if box is down, API quirks ¯\_(ツ)_/¯
                "status": not status,
            },
            timeout=timeout,
        )
        if resp.status_code != 200:
            logging.error(f"API returned {resp.status_code} status code")
    except Exception as e:
        logging.error(f"An error occurred: {str(e)}")
