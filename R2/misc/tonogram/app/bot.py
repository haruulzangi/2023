from telegram import Update
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes


usage = "Usage: /calculate <expression>"


async def _calculate(update: Update, _: ContextTypes.DEFAULT_TYPE) -> None:
    if update.message is None or update.message.text is None:
        return
    command_payload = update.message.text[len("/calculate ") :]
    try:
        result = eval(command_payload)
    except:
        result = "Some error ocurred :("
    await update.message.reply_text(result)


async def _start(update: Update, _: ContextTypes.DEFAULT_TYPE) -> None:
    if update.message is None or update.message.text is None:
        return
    await update.message.reply_text(usage)


def start_bot(token: str):
    app = ApplicationBuilder().token(token).build()
    app.add_handler(CommandHandler("calculate", _calculate))
    app.add_handler(CommandHandler("start", _start))
    print("Bot is ready to run!")
    app.run_webhook(
        listen="0.0.0.0",
        port="8080",
        webhook_url="https://tonogram.challenge.haruulzangi.mn",
    )


__all__ = ["start_bot"]
