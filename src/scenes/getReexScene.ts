import { Scenes } from 'telegraf'
import { backKeyboard, backButtonText, mainKeyboard } from '../keyboards.js'
import * as messages from '../messages.js'
import * as users from '../users.js'
import { isValidAddress } from '../address.js'
import { getReex } from '../api.js'

const { leave } = Scenes.Stage
const getReexScene = new Scenes.BaseScene<Scenes.SceneContext>('getReexScene')

getReexScene.enter(async (ctx) => {
    await ctx.deleteMessage()
    await ctx.reply(messages.FAUCET_MESSAGE, backKeyboard)
})

getReexScene.leave(async (ctx) => {
    await ctx.reply(messages.WELCOME, mainKeyboard)
    ctx.deleteMessage()
})
getReexScene.hears(backButtonText, leave<Scenes.SceneContext>())
getReexScene.on('message', async (ctx: any) => {
    const user = ctx.message.from
    if (user.is_bot) return
    if (!users.isUser(String(user.id))) return

    let message = ''
    const text = ctx.message.text

    console.log('faucet to address', text)

    if (users.isLocked(String(user.id))) {
        message = messages.TIMELEFT + users.getTimeLeft(String(user.id))
    }
    else {
        if (isValidAddress(text)) {
            const result = await getReex(text)
            if (result) {
                users.lockUser(String(user.id))
                message = messages.SUCCESS
            }
            else {
                message = messages.NOT_SUCCESS
            }
        }
        else {
            console.log('address invalid', text)
            message = messages.NOT_ADDRESS
        }
    }

    ctx.reply(message)

})

export default getReexScene;