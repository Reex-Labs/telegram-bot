import { Scenes } from 'telegraf'
import { backKeyboard, backButtonText, mainKeyboard } from '../keyboards.js'
import * as messages from '../messages.js'
import { genAddress } from '../address.js'

const { leave } = Scenes.Stage
const createWalletScene = new Scenes.BaseScene<Scenes.SceneContext>('createWalletScene')

createWalletScene.enter(async (ctx) => {
    await ctx.deleteMessage()

    const { address, mnemonic } = await genAddress()
    ctx.replyWithMarkdown(messages.YOUR_ADDRESS(address, mnemonic), backKeyboard)
})

createWalletScene.leave(async (ctx) => {
    await ctx.reply(messages.WELCOME, mainKeyboard)
    ctx.deleteMessage()
})
createWalletScene.hears(backButtonText, leave<Scenes.SceneContext>())
createWalletScene.on('message', (ctx) => ctx.replyWithMarkdown('Send `hi...`'))

export default createWalletScene;