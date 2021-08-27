import { Scenes } from 'telegraf'
import { backKeyboard, backButtonText, getMainKeyboard } from '../keyboards.js'
import * as messages from '../messages.js'
import { isValidMnemonic } from '../address.js'
import { logout } from '../users.js'
import { goMain } from '../utils.js'
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing'

const { leave } = Scenes.Stage
const authScene = new Scenes.BaseScene<Scenes.SceneContext>('authScene')

authScene.enter(async (ctx) => {
    ctx.replyWithMarkdown(messages.AUTH_ENTER, backKeyboard)
})

authScene.hears(backButtonText, leave<Scenes.SceneContext>())

authScene.on('message', async (ctx: any) => {
    const mnemonic = ctx.message.text
    await ctx.deleteMessage()
    if (isValidMnemonic(mnemonic)) {
        ctx.session.m = mnemonic

        const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, { prefix: 'reex' })
        const [{ address }] = await wallet.getAccounts();
        ctx.session.a = address;

        // ToDo: Удалить, если используется пароль
        ctx.session.state = true
        ctx.replyWithMarkdown(messages.AUTH_SUCCESS, backKeyboard)
        
        // ctx.replyWithMarkdown('Теперь задайте какой-нибудь пароль. Это дополнительно защитит вас.', backKeyboard)
    }
    else {
        ctx.replyWithMarkdown(messages.AUTH_FAIL, backKeyboard)
    }
})

authScene.leave(async (ctx: any) => {
    if (!ctx.session.state) {
        logout(ctx)
    }
    await goMain(ctx)
})

export default authScene;