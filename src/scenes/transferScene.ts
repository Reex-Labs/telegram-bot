import { Scenes } from 'telegraf'
import { isValidAddress } from '../address.js'
import { backKeyboard, backButtonText, getMainKeyboard } from '../keyboards.js'
import * as messages from '../messages.js'
import { sendTransaction } from '../api.js'

const { enter, leave } = Scenes.Stage
const transferScene = new Scenes.BaseScene<Scenes.SceneContext>('transferScene')

let ammount: string
let to: string

transferScene.enter(async (ctx: any) => {
    // await ctx.deleteMessage()
    const auth = ctx.session.m
    if (!auth) {
        ctx.reply('Для того, что бы пользоваться оплатой, вам необходимо авторизоваться. Это можно сделать с помощью кнопки Авторизация.', backKeyboard)
    }
    else {
        ctx.reply('Вы попали в режим перевода. Введите кол-во REEX, которые хотите перевести.', backKeyboard)
    }
})

transferScene.hears(backButtonText, leave<Scenes.SceneContext>())

transferScene.on('message', async (ctx: any) => {
    if (!ammount) {
        const number = Number(ctx.message.text)
        if (number > 0 && number < 1000000000000) {
            ammount = String(number)
            ctx.replyWithMarkdown('Отлично! Теперь введите адрес.', backKeyboard)
        }
        else {
            ctx.replyWithMarkdown('С цифрой что-то не так: либо это не цифра, либо она больше миллиона. Введите еще раз.', backKeyboard)
        }
    }
    else {
        if (!to) {
            to = ctx.message.text

            if (isValidAddress(to)) {
                try {
                    const result = await sendTransaction(ctx.session.m, to, ammount)
                    console.log(result)
                    ctx.replyWithMarkdown(messages.SEND_SUCCESS, backKeyboard)
                }
                catch (e) {
                    ctx.replyWithMarkdown(messages.SEND_ERROR, backKeyboard)
                    console.log('Transaction error')
                    console.log(e)
                }
            }
            else {
                ctx.replyWithMarkdown(messages.NOT_ADDRESS, backKeyboard)
            }
        }
    }
})

transferScene.leave(async (ctx) => {
    ammount = null
    to = null
    await ctx.reply(messages.WELCOME, getMainKeyboard(ctx))
    // ctx.deleteMessage()
})

export default transferScene;