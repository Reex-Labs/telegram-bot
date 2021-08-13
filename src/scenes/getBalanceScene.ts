import { Scenes } from 'telegraf'
import { backKeyboard, backButtonText, mainKeyboard } from '../keyboards.js'
import * as messages from '../messages.js'
import { getBalance } from '../api.js'
import { isValidAddress } from '../address.js'

const { leave } = Scenes.Stage
const getBalanceScene = new Scenes.BaseScene<Scenes.SceneContext>('getBalanceScene')

getBalanceScene.enter(async (ctx) => {
    await ctx.deleteMessage()
    ctx.reply(messages.FETCH_BALANCE, backKeyboard)
})

getBalanceScene.leave(async (ctx) => {
    await ctx.reply(messages.WELCOME, mainKeyboard)
    ctx.deleteMessage()
})
getBalanceScene.hears(backButtonText, leave<Scenes.SceneContext>())
getBalanceScene.on('message', async (ctx: any) => {
    let address: string = ''
    if (ctx.message) {
        address = ctx.message.text ?? ''
    }
    if (!isValidAddress(address)) {
        ctx.reply(messages.NOT_ADDRESS)
        return
    }
    const balance = await getBalance(address)
    if (balance !== null) {
        ctx.reply('Баланс: ' + balance + 'reex')
    }
    else {
        ctx.reply(messages.ERROR_FETCH_BALANCE)
    }
})

export default getBalanceScene;