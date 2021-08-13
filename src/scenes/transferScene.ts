import { Scenes } from 'telegraf'
import { backKeyboard, backButtonText, mainKeyboard } from '../keyboards.js'
import * as messages from '../messages.js'

const { enter, leave } = Scenes.Stage
const transferScene = new Scenes.BaseScene<Scenes.SceneContext>('transferScene')

transferScene.enter(async (ctx) => {
    await ctx.deleteMessage()
    ctx.reply('transferScene', backKeyboard)
})

transferScene.leave(async (ctx) => {
    await ctx.reply(messages.WELCOME, mainKeyboard)
    ctx.deleteMessage()
})
transferScene.hears(backButtonText, leave<Scenes.SceneContext>())
transferScene.on('message', (ctx) => ctx.replyWithMarkdown('Send `hi...`'))

export default transferScene;