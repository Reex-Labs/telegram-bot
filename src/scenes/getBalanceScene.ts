import { Scenes } from "telegraf";
import {
  backKeyboard,
  backButtonText,
  getBalanceKeyboard,
} from "../keyboards.js";
import * as messages from "../messages.js";
import { getBalance } from "../api.js";
import { isValidAddress } from "../address.js";
import { goMain } from "../utils.js";

const { leave } = Scenes.Stage;
const getBalanceScene = new Scenes.BaseScene<Scenes.SceneContext>(
  "getBalanceScene"
);

getBalanceScene.enter(async (ctx: any) => {
  if (ctx.session.a) {
    ctx.replyWithMarkdown("❔ Чей баланс вы хотите узнать?", getBalanceKeyboard);
  } else {
    ctx.replyWithMarkdown(messages.FETCH_BALANCE, backKeyboard);
  }
});

getBalanceScene.leave(async (ctx) => {
  await goMain(ctx);
});
getBalanceScene.hears(backButtonText, leave<Scenes.SceneContext>());
getBalanceScene.on("message", async (ctx: any) => {
  let address = ctx.message.text;

  if (!isValidAddress(address)) {
    ctx.replyWithMarkdown(messages.NOT_ADDRESS);
    return;
  }
    getBalanceOnScene(ctx, address);
    return;
});

getBalanceScene.action("get_my_balance", (ctx: any) => {
  getBalanceOnScene(ctx, ctx.session.a);
});

getBalanceScene.action("get_other_balance", (ctx) =>
  ctx.replyWithMarkdown(messages.FETCH_BALANCE, backKeyboard)
);

async function getBalanceOnScene(ctx: any, address: string) {
  const balance = await getBalance(address);
  if (balance !== null) {
    ctx.replyWithMarkdown("✅ Баланс: " + balance + " REEX");
  } else {
    ctx.replyWithMarkdown(messages.ERROR_FETCH_BALANCE);
  }
}

export default getBalanceScene;
