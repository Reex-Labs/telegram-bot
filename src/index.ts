import { Scenes, session, Telegraf } from 'telegraf'
import * as dotenv from 'dotenv'
import { mainKeyboard, mainButtonText, backButtonText } from './keyboards.js'

import * as messages from './messages.js'
import * as users from './users.js'

import start from './scenes/start.js'
import getReexScene from './scenes/getReexScene.js'
import createWalletScene from './scenes/createWalletScene.js'
import getBalanceScene from './scenes/getBalanceScene.js'
import transferScene from './scenes/transferScene.js'

const evnStatus = dotenv.config()
if (evnStatus.error) throw evnStatus.error

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.use(async (ctx, next) => {
    const user = ctx.message.from

    if (user.is_bot) return

    if (!users.isUser(String(user.id))) {
        users.addUser(user)
    }

    const start = Date.now()
    await next()
    const ms = Date.now() - start
    console.log('response time %sms', ms)
})

const { enter, leave } = Scenes.Stage
const stage = new Scenes.Stage<Scenes.SceneContext>([start, getReexScene, createWalletScene, getBalanceScene, transferScene], {
  ttl: 10,
})
bot.use(stage.middleware())

bot.start(ctx => {
    const image = `iVBORw0KGgoAAAANSUhEUgA
AAAoAAAAKCAYAAACNMs+9AAAABmJLR0QA/wD/AP+gvaeTAAAAB3RJ
TUUH1ggDCwMADQ4NnwAAAFVJREFUGJWNkMEJADEIBEcbSDkXUnfSg
nBVeZ8LSAjiwjyEQXSFEIcHGP9oAi+H0Bymgx9MhxbFdZE2a0s9kT
Zdw01ZhhYkABSwgmf1Z6r1SNyfFf4BZ+ZUExcNUQUAAAAASUVORK5
CYII=`
    ctx.reply(messages.WELCOME, mainKeyboard)
    ctx.replyWithPhoto({ source: Buffer.from(image, 'base64') })
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

bot.hears(backButtonText, (ctx) => ctx.reply(messages.WELCOME, mainKeyboard))

bot.on('message', (ctx) => ctx.reply('Вы в главном меню. Выберите нужный раздел.', mainKeyboard))
bot.help(ctx => ctx.reply(messages.HELP))
bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

console.log('Reex-tg-bot started. Version: 1.0.0')