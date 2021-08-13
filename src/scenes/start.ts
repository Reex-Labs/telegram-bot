// import { ContextMessageUpdate } from 'telegraf';
// import Stage from 'telegraf/stage';
import { Scenes, session, Telegraf } from 'telegraf'
import { mainKeyboard } from '../keyboards.js'
import * as users from '../users.js'
// import { languageChangeAction } from './actions';
// import { getLanguageKeyboard } from './helpers';
// import logger from '../../util/logger';
// import User from '../../models/User';
// import { getMainKeyboard } from '../../util/keyboards';

const { enter, leave } = Scenes.Stage
const start = new Scenes.BaseScene<Scenes.SceneContext>('start')

start.enter((ctx) => {
    ctx.reply('Привет, я Reex Bot')
    ctx.reply(mainKeyboard)

    const user = ctx.message.from

    if (user.is_bot) return
    if (!users.isUser(String(user.id))) {
        users.addUser(user)
    }
})
start.leave((ctx) => ctx.reply('Bye'))
start.command('back', leave<Scenes.SceneContext>())
start.hears('hi', enter<Scenes.SceneContext>('start'))
start.on('message', (ctx) => ctx.replyWithMarkdown('Send `hi`'))

export default start;