import { Markup } from 'telegraf'

export const mainButtonText = {
    getReex: 'Получить Reex',
    createWallet: 'Создать кошелек',
    getBalance: 'Проверить баланс',
    transfer: 'Перевод (скоро)',
}

export const backButtonText = 'Назад'

export const mainKeyboard: any = Markup.keyboard([
    [mainButtonText.getReex, mainButtonText.createWallet],
    [mainButtonText.getBalance, mainButtonText.transfer],
]).resize()

export const backKeyboard: any = Markup.keyboard([backButtonText]).resize()

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