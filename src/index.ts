import { Scenes, session, Telegraf } from 'telegraf'
import * as dotenv from 'dotenv'
import { getMainKeyboard, mainButtonText, backButtonText } from './keyboards.js'

import * as messages from './messages.js'
import * as users from './users.js'
import { goMain, parseFloatWithComma } from './utils.js'

import getReexScene from './scenes/getReexScene.js'
import createWalletScene from './scenes/createWalletScene.js'
import getBalanceScene from './scenes/getBalanceScene.js'
import transferScene from './scenes/transferScene.js'
import authScene from './scenes/authScene.js'

const evnStatus = dotenv.config()
if (evnStatus.error) throw evnStatus.error

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.use(async (ctx: any, next) => {
    if (ctx?.message) {
        const user = ctx.message.from

        if (user.is_bot) return
        if (!users.isUser(String(user.id))) {
            users.addUser(user)
        }
    }

    const start = Date.now()
    await next()
    const ms = Date.now() - start
    console.log('response time %sms', ms)
})

const { enter, leave } = Scenes.Stage
const stage = new Scenes.Stage<Scenes.SceneContext>([
    getReexScene,
    createWalletScene,
    getBalanceScene,
    transferScene,
    authScene], {
//   ttl: 10,
})

bot.use(session())
bot.use(stage.middleware())

bot.start((ctx) => {
    goMain(ctx)
})

bot.hears(mainButtonText.getReex, (ctx: any) => {
    ctx.scene.enter('getReexScene')
})

bot.hears(mainButtonText.createWallet, (ctx: any) => {
    ctx.scene.enter('createWalletScene')
})

bot.hears(mainButtonText.getBalance, (ctx: any) => {
    ctx.scene.enter('getBalanceScene')
})

bot.hears(mainButtonText.transfer, (ctx: any) => {
    ctx.scene.enter('transferScene')
})

bot.hears(mainButtonText.auth, (ctx: any) => {
    ctx.scene.enter('authScene')
})

bot.hears(mainButtonText.logout, (ctx: any) => {
    users.logout(ctx)
    ctx.replyWithMarkdown(messages.AUTH_RESET, getMainKeyboard(ctx))
})

bot.action('back', ctx => goMain(ctx))

bot.hears(backButtonText, (ctx) => goMain(ctx))

bot.on('message', (ctx: any) => {
    const mess = ctx.message.text
    ctx.replyWithMarkdown('Вы вернулись главное меню. Выберите нужный раздел.', getMainKeyboard(ctx))
})
bot.help(ctx => ctx.reply(messages.HELP))
bot.catch((error) => {
    leave<Scenes.SceneContext>()
    console.log('[BOT_ERROR]:', error)
})
bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

console.log('Reex-tg-bot started. Version: 1.0.0')