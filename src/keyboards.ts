import { Markup } from 'telegraf'

export const mainButtonText = {
  getReex: "💰 Получить Reex",
  createWallet: "💼 Создать кошелек",
  getBalance: "💼 Проверить баланс",
  transfer: "➡️ Перевод",
  myAddress: "👜 Мой кошелек",
  auth: "👤 Авторизация для выполнения переводов",
  logout: "👤 Отменить авторизацию",
};

export const backButtonText = 'Назад'

export function getMainKeyboard(ctx: any) {
    const auth = ctx.session.m

    const keyboards = [
        [mainButtonText.getReex, mainButtonText.createWallet],
        [mainButtonText.getBalance, mainButtonText.transfer],
    ]

    if (!auth) {
        keyboards.push([mainButtonText.auth]);
    }
    else {
        keyboards.push([mainButtonText.myAddress, mainButtonText.logout]);
    }

    return Markup.keyboard(keyboards)
}

export const backKeyboard: any = Markup.keyboard([backButtonText])
export const inlineBackKeyboard: any = Markup.inlineKeyboard([
  Markup.button.callback("⬅️ В главное меню", "back"),
]);

export const inlineSendConfirm = Markup.inlineKeyboard([
    [
        Markup.button.callback('✅ Подтвердить перевод', 'confirm_send'),
        Markup.button.callback('🚫 Отменить', 'abort_send'),
    ],
])

export const getBalanceKeyboard = Markup.inlineKeyboard([
  [
    Markup.button.callback("👜 Баланс моего кошелька", "get_my_balance"),
    Markup.button.callback("📡 Баланс другого кошелька", "get_other_balance"),
  ],
]);