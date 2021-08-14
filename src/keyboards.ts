import { Markup } from 'telegraf'

export const mainButtonText = {
    getReex: '💰 Получить Reex',
    createWallet: '💼 Создать кошелек',
    getBalance: '💼 Проверить баланс',
    transfer: '➡️ Перевод',
    auth: '👤 Авторизация для выполнения переводов',
    logout: '👤 Отменить авторизацию'
}

export const backButtonText = 'Назад'

export function getMainKeyboard(ctx: any) {
    const auth = ctx.session.m

    const keyboards = [
        [mainButtonText.getReex, mainButtonText.createWallet],
        [mainButtonText.getBalance, mainButtonText.transfer],
    ]

    if (!auth) {
        keyboards.push([mainButtonText.auth])
    }
    else {
        keyboards.push([mainButtonText.logout])
    }

    return Markup.keyboard(keyboards)
}

export const mainKeyboard: any = Markup.keyboard([
    [mainButtonText.getReex, mainButtonText.createWallet],
    [mainButtonText.getBalance, mainButtonText.transfer],
    [mainButtonText.auth],
])

export const backKeyboard: any = Markup.keyboard([backButtonText])
export const inlineBackKeyboard: any = Markup.inlineKeyboard([
    Markup.button.callback('В главное меню', 'back'),
])

export const mainInlineKeyboard = Markup.inlineKeyboard([
    [
        // Markup.button.url('❤️', 'http://telegraf.js.org'),
        // Markup.button.callback('➡️ Next', 'next'),
        Markup.button.callback('Получить REEX', 'getReexScene'),
        Markup.button.callback('Создать кошелек', 'createWalletScene'),
    ],
    [
        Markup.button.callback('Проверить баланс', 'getBalanceScene'),
        Markup.button.callback('Перевод (скоро)', 'transferScene'),
    ],
    // [
    //     Markup.button.callback('Отправить (скоро)', 'createWallet'),
    // ]
])

export const inlineSendConfirm = Markup.inlineKeyboard([
    [
        Markup.button.callback('✅ Подтвердить перевод', 'confirm_send'),
        Markup.button.callback('🚫 Отменить', 'abort_send'),
    ],
])