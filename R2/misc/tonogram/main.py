from os import getenv
from app.bot import start_bot

if __name__ == "__main__":
    token = getenv("BOT_TOKEN")
    if token is None:
        token_file = getenv("BOT_TOKEN_FILE")
        if token_file is None:
            raise Exception(
                "Missing Telegram bot token file. Please set BOT_TOKEN_FILE environment variable."
            )
        token = open(token_file, "r").read().strip()
    start_bot(token)
