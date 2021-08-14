import { Scenes } from 'telegraf'
import { backKeyboard, backButtonText, getMainKeyboard } from '../keyboards.js'
import * as messages from '../messages.js'
import { isValidMnemonic } from '../address.js'
import { logout } from '../users.js'

const { leave } = Scenes.Stage
const authScene = new Scenes.BaseScene<Scenes.SceneContext>('authScene')

authScene.enter(async (ctx) => {
    // await ctx.deleteMessage()

    ctx.replyWithMarkdown(messages.AUTH_ENTER, backKeyboard)
})

authScene.hears(backButtonText, leave<Scenes.SceneContext>())

authScene.on('message', async (ctx: any) => {
    // if (!ctx.session.m) {
        const mnemonic = ctx.message.text
        await ctx.deleteMessage()
        if (isValidMnemonic(mnemonic)) {
            ctx.session.m = mnemonic

            // ToDo: Удалить, если используется пароль
            ctx.session.state = true
            await ctx.deleteMessage()
            ctx.replyWithMarkdown(messages.AUTH_SUCCESS, backKeyboard)
            
            // ctx.replyWithMarkdown('Теперь задайте какой-нибудь пароль. Это дополнительно защитит вас.', backKeyboard)
        }
        else {
            ctx.replyWithMarkdown(
                'Похоже вы где-то ошиблись. Или кол-во слов неверно, или присутствуют грамматические ошибки. Попробуйте еще раз.', backKeyboard
            )
        }
    // }
    // else {
    //     ctx.session.pass = ctx.message.text
        // ctx.session.state = true
        // await ctx.deleteMessage()
        // ctx.replyWithMarkdown(messages.AUTH_SUCCESS, backKeyboard)
    // }
})

authScene.leave(async (ctx: any) => {
    // await ctx.deleteMessage()
    if (!ctx.session.state) {
        logout(ctx)
    }
    await ctx.reply(messages.WELCOME, getMainKeyboard(ctx))
})

export default authScene;