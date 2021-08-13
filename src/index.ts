import { Scenes, session, Telegraf } from 'telegraf'
import * as dotenv from 'dotenv'

import { mainKeyboard, mainButtonText, backButtonText } from './keyboards.js'

// import { getBalance } from './api.js'
import * as messages from './messages.js'
import * as users from './users.js'
// import genAddress, { isValidAddress } from './address.js'

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
bot.use(session())
bot.use(stage.middleware())

bot.start(ctx => {
    ctx.reply(messages.WELCOME, mainKeyboard)
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

// bot.action('getReexScene', (ctx: any) => { ctx.scene.enter('getReexScene') })
// bot.action('createWalletScene', (ctx) => { enter<Scenes.SceneContext>('createWalletScene') })
// bot.action('getBalanceScene', (ctx) => { enter<Scenes.SceneContext>('getBalanceScene') })
// bot.action('transferScene', (ctx) => { enter<Scenes.SceneContext>('transferScene') })

bot.on('message', (ctx) => ctx.reply('Вы в главном меню. Выберите нужный раздел.', mainKeyboard))
bot.help(ctx => ctx.reply(messages.HELP))
bot.launch()

// bot.action('createWallet', async (ctx) => {
//     const { address, mnemonic } = await genAddress()
//     ctx.replyWithMarkdown(messages.YOUR_ADDRESS(address, mnemonic))
// })

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))