import { Telegraf, Markup } from 'telegraf';
import axios from 'axios';
import * as dotenv from 'dotenv';
import * as messages from './messages.js';
import * as users from './users.js';
import genAddress, { isValidAddress } from './address.js';
const evnStatus = dotenv.config();
if (evnStatus.error)
    throw evnStatus.error;
const bot = new Telegraf(process.env.BOT_TOKEN);
bot.use((ctx, next) => {
    const start = Date.now();
    return next().then(() => {
        const ms = Date.now() - start;
        console.log('response time %sms', ms);
    });
});
bot.start(ctx => {
    const user = ctx.message.from;
    if (user.is_bot)
        return;
    if (!users.isUser(String(user.id))) {
        users.addUser(user);
    }
    ctx.reply(messages.WELCOME, Markup.inlineKeyboard([
        [
            Markup.button.callback('Получить REEX', 'faucetMessage'),
        ],
        [
            Markup.button.callback('Проверить баланс', 'checkBalance'),
            Markup.button.callback('Создать кошелек', 'createWallet'),
        ],
    ]));
});
bot.help(ctx => ctx.reply(messages.HELP));
bot.on('text', async (ctx) => {
    const user = ctx.message.from;
    if (user.is_bot)
        return;
    if (!users.isUser(String(user.id)))
        return;
    let message = '';
    const text = ctx.message.text;
    console.log('faucet to address', text);
    if (isValidAddress(text)) {
        if (users.isLocked(String(user.id))) {
            message = messages.TIMELEFT + users.getTimeLeft(String(user.id));
        }
        else {
            const result = await getReex(text);
            if (result) {
                users.lockUser(String(user.id));
                message = messages.SUCCESS;
            }
            else {
                message = messages.NOT_SUCCESS;
            }
        }
        ctx.reply(message);
    }
    else {
        console.log('address invalid', text);
        ctx.reply(messages.NOT_ADDRESS);
    }
});
bot.action('checkBalance', (ctx) => {
});
bot.action('createWallet', async (ctx) => {
    const { address, mnemonic } = await genAddress();
    ctx.replyWithMarkdown(messages.YOUR_ADDRESS(address, mnemonic));
});
bot.action('faucetMessage', (ctx) => {
    ctx.reply(messages.FAUCET_MESSAGE);
});
bot.action('next', (ctx) => {
    ctx.deleteMessage();
    ctx.reply('Wow');
});
bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
async function getReex(address) {
    const url = `${process.env.NODE_FAUCET_API}${address}/${process.env.NODE_FAUCET_TOKEN}`;
    try {
        const response = await axios.get(url);
        if (response.data === true)
            return true;
        else
            return false;
    }
    catch (error) {
        console.error('error ', error);
        return false;
    }
}
//# sourceMappingURL=index.js.map