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

from runner.checker import run_checker

import os
import requests
import threading


def main():
    auth_token = os.getenv("API_AUTH_TOKEN")
    if not auth_token:
        raise Exception("API_AUTH_TOKEN is not set")
    flags_response = requests.get(
        f"{os.getenv('API_BASE_URL')}/getFlags",
        headers={"Authorization": auth_token},
    )
    try:
        game_boxes = filter(
            lambda data: data["challenge"]["port"] == os.getenv("CHALLENGE_PORT"),
            flags_response.json()["flags"],
        )
        threads = []
        for box in game_boxes:
            host = box["gamebox_id"]["ip"]
            port = int(box["challenge"]["port"])
            game_round = box["round"]
            box_id = box["gamebox_id"]["_id"]
            challenge_id = box["challenge"]["_id"]
            flag = box["flag"]
            thread = threading.Thread(
                target=run_checker,
                args=(host, port, game_round, box_id, challenge_id, flag),
            )
            thread.start()
            threads.append(thread)
        for thread in threads:
            thread.join()
    except:
        logging.error("Can't get flags, probably game was not started")


if __name__ == "__main__":
    main()
