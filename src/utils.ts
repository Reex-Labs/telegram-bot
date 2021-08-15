import { WELCOME } from './messages.js'
import { getMainKeyboard } from './keyboards.js'

export async function goMain(ctx: any) {
    await ctx.replyWithMarkdown(WELCOME, getMainKeyboard(ctx))
}

export function timeLeft(t: number) {
    var seconds = Math.floor((t / 1000) % 60)
    var minutes = Math.floor((t / 1000 / 60) % 60)
    var hours = Math.floor((t / (1000 * 60 * 60)) % 24)
    var days = Math.floor(t / (1000 * 60 * 60 * 24))
    return {
        'total': t,
        'days': days,
        'hours': hours,
        'minutes': minutes,
        'seconds': seconds
    }
}

export function parseFloatWithComma(float: string) {
    const parsedFloat = float.replace(/,/gi, '.');
    console.log('parsedFloat', parsedFloat)
    if (Number(parsedFloat) > 0) return parsedFloat
    else return null
}