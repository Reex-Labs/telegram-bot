import { Scenes } from 'telegraf'
import { backKeyboard, backButtonText } from '../keyboards.js'
import * as messages from '../messages.js'
import * as users from '../users.js'
import { isValidAddress } from '../address.js'
import { getReex } from '../api.js'
import { goMain, timeLeft } from '../utils.js'
import Captcha from '../captcha.js'

let generatedCaptchaText: string
let address: string

const { leave } = Scenes.Stage
const getReexScene = new Scenes.BaseScene<Scenes.SceneContext>('getReexScene')

getReexScene.enter(async (ctx) => {
    await ctx.replyWithMarkdown(messages.FAUCET_MESSAGE, backKeyboard)
})

getReexScene.leave(async (ctx) => {
    await goMain(ctx)
    generatedCaptchaText = null
    address = null
})
getReexScene.hears(backButtonText, leave<Scenes.SceneContext>())
getReexScene.on('message', async (ctx: any) => {
    const user = ctx.message.from
    if (user.is_bot) return
    if (!users.isUser(String(user.id))) return

    const text = ctx.message.text

    if (users.isLocked(String(user.id))) {
        const timeLeftInMs = users.getTimeLeftInMs(String(user.id))
        const timeLeftFull = timeLeft(timeLeftInMs)
        const timeLeftText = `${timeLeftFull.hours}:${timeLeftFull.minutes}:${timeLeftFull.seconds} часов.`
        const message = messages.TIMELEFT + timeLeftText
        ctx.replyWithMarkdown(message)
        return
    }

    if (!address) {
        if (isValidAddress(text)) {
            address = text
        }
        else {
            console.log('address invalid', text)
            ctx.replyWithMarkdown(messages.NOT_ADDRESS)
            return
        }
    }

    if (!generatedCaptchaText) {
        ctx.replyWithMarkdown(messages.NEED_CAPTCHA)
        generatedCaptchaText = generateCaptcha(ctx)
        return
    }
    else {
        const captcha = text.substring(0, 6)
        if (generatedCaptchaText !== captcha) {
            ctx.replyWithMarkdown(messages.WRONG_CAPTCHA)
            generatedCaptchaText = generateCaptcha(ctx)
            return
        }
    }

    const result = await getReex(address)
    if (result) {
        users.lockUser(String(user.id))
        ctx.replyWithMarkdown(messages.SUCCESS)
        console.log('faucet to address', address)
    }
    else {
        ctx.replyWithMarkdown(messages.NOT_SUCCESS)
        console.log('not faucet to address', address)
    }

    generatedCaptchaText = null
    address = null
})

export default getReexScene;

function generateCaptcha(ctx: any) {
    const captcha = new Captcha()
    ctx.replyWithPhoto({ source: captcha.image })
    return captcha.text
}