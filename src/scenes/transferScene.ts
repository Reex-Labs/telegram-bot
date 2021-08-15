import { Scenes } from 'telegraf'
import { isValidAddress } from '../address.js'
import { backKeyboard, backButtonText, inlineSendConfirm } from '../keyboards.js'
import * as messages from '../messages.js'
import { sendTransaction } from '../api.js'
import { goMain, parseFloatWithComma } from '../utils.js'
import { isValidAmount } from '../reex.js'

const { enter, leave } = Scenes.Stage
const transferScene = new Scenes.BaseScene<Scenes.SceneContext>('transferScene')

let amount: string
let to: string

transferScene.enter(async (ctx: any) => {
    const auth = ctx.session.m
    if (!auth) {
        ctx.replyWithMarkdown(messages.NEED_AUTH, backKeyboard)
    }
    else {
        ctx.replyWithMarkdown(messages.SEND_REEX_AMOUNT, backKeyboard)
    }
})

transferScene.hears(backButtonText, leave<Scenes.SceneContext>())

transferScene.on('message', async (ctx: any) => {
    if (!amount) {
        const number = parseFloatWithComma(ctx.message.text)

        if (isValidAmount(number)) {
            amount = String(number)
            ctx.replyWithMarkdown(messages.SEND_REEX_ADDRESS, backKeyboard)
        }
        else {
            ctx.replyWithMarkdown('С цифрой что-то не так: либо это не цифра, либо она меньше 0.000001. Введите еще раз.', backKeyboard)
        }
        return
    }

    if (!to) {
        let address = ctx.message.text

        if (isValidAddress(address)) {
            to = address
            ctx.replyWithMarkdown(messages.CONFIRM_SEND(to, amount), inlineSendConfirm)
        }
        else {
            ctx.replyWithMarkdown(messages.NOT_ADDRESS, backKeyboard)
        }

        return
    }

    if (false) {

    }
})

transferScene.action('confirm_send', async (ctx: any) => {
    if (!to || !amount) {
        return
    }
    try {
        const result = await sendTransaction(ctx.session.m, to, amount)
        ctx.replyWithMarkdown(messages.SEND_SUCCESS, backKeyboard)
        clearPaymentData()

    }
    catch (e) {
        ctx.replyWithMarkdown(messages.SEND_ERROR, backKeyboard)
        console.log('Transaction error')
        console.log(e)
    }
})

transferScene.action('abort_send', ctx => {
    ctx.replyWithMarkdown(messages.SEND_ABORTED, backKeyboard)
    clearPaymentData()
})

transferScene.leave(async (ctx) => {
    await goMain(ctx)
})

export default transferScene;

function clearPaymentData() {
    amount = null
    to = null
}