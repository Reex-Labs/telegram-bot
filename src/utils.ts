import { WELCOME } from './messages.js'
import { getMainKeyboard } from './keyboards.js'

export async function goMain(ctx: any) {
    await ctx.replyWithMarkdown(WELCOME, getMainKeyboard(ctx))
}