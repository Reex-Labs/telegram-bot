import { Scenes } from 'telegraf'
import { backKeyboard, backButtonText, getMainKeyboard } from '../keyboards.js'
import * as messages from '../messages.js'
import { genAddress } from '../address.js'
import { goMain } from '../utils.js'

const { leave } = Scenes.Stage
const createWalletScene = new Scenes.BaseScene<Scenes.SceneContext>('createWalletScene')

createWalletScene.enter(async (ctx) => {
    const { address, mnemonic } = await genAddress()
    ctx.replyWithMarkdown(messages.YOUR_ADDRESS(address, mnemonic), backKeyboard)
})

createWalletScene.leave(async (ctx) => {
    await goMain(ctx)
})
createWalletScene.hears(backButtonText, leave<Scenes.SceneContext>())

export default createWalletScene;