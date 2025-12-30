import TelegramBot from "node-telegram-bot-api";

const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
const MamiServerBot = new TelegramBot(telegramBotToken as string, {
    polling: {
        params: {
            allowed_updates: [
                "update_id",
                "inline_query",
                "chosen_inline_result",
                "chat_member",
            ],
        },
    },
});

export default MamiServerBot;