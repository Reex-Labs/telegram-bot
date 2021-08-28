import { Context, Scenes, session, Telegraf } from "telegraf";
import { BotContext } from "./types/botContext";
import * as dotenv from "dotenv";
import {
  getMainKeyboard,
  mainButtonText,
  backButtonText,
} from "./keyboards.js";

import * as messages from "./messages.js";
import * as users from "./users.js";
import { goMain } from "./utils.js";

import getReexScene from "./scenes/getReexScene.js";
import createWalletScene from "./scenes/createWalletScene.js";
import getBalanceScene from "./scenes/getBalanceScene.js";
import transferScene from "./scenes/transferScene.js";
import authScene from "./scenes/authScene.js";
import { SceneSession, SceneSessionData } from "telegraf/typings/scenes";

const evnStatus = dotenv.config();
if (evnStatus.error) throw evnStatus.error;

const bot = new Telegraf<BotContext>(process.env.BOT_TOKEN);

const { enter, leave } = Scenes.Stage;
const stage = new Scenes.Stage<Scenes.SceneContext>(
  [getReexScene, createWalletScene, getBalanceScene, transferScene, authScene],
  {
    //   ttl: 10,
  }
);

bot.use(async (ctx, next) => {
  const start = Date.now();

  if (ctx?.message) {
    const user = ctx.message.from;

    if (user.is_bot) return;
    if (!users.isUser(String(user.id))) {
      users.addUser(user);
    }
  }

  await next();
  const ms = Date.now() - start;
  console.log("response time %sms", ms);
});

bot.use(session());
bot.use(stage.middleware());

bot.start((ctx) => {
  console.log("start main");
  goMain(ctx);
});

bot.command("start", (ctx) => {
  console.log("start");
  leave<Scenes.SceneContext>();
  goMain(ctx);
});

bot.command("quit", (ctx) => {
  leave<Scenes.SceneContext>();
  ctx.telegram.leaveChat(ctx.message.chat.id);
  ctx.leaveChat();
});

bot.hears(mainButtonText.getReex, (ctx) => {
  ctx.scene.enter("getReexScene");
});

bot.hears(mainButtonText.createWallet, (ctx) => {
  ctx.scene.enter("createWalletScene");
});

bot.hears(mainButtonText.getBalance, (ctx) => {
  ctx.scene.enter("getBalanceScene");
});

bot.hears(mainButtonText.transfer, (ctx) => {
  ctx.scene.enter("transferScene");
});

bot.hears(mainButtonText.myAddress, (ctx) => {
  ctx.replyWithMarkdown(
    messages.YOUR_AUTH_ADDRESS + ctx.session.a,
    getMainKeyboard(ctx)
  );
});

bot.hears(mainButtonText.auth, (ctx) => {
  ctx.scene.enter("authScene");
});

bot.hears(mainButtonText.logout, (ctx) => {
  users.logout(ctx);
  ctx.replyWithMarkdown(messages.AUTH_RESET, getMainKeyboard(ctx));
});

bot.hears(backButtonText, (ctx) => goMain(ctx));

bot.action("back", (ctx) => goMain(ctx));

bot.on("message", (ctx) => {
  ctx.replyWithMarkdown(
    "Вы вернулись главное меню. Выберите нужный раздел.",
    getMainKeyboard(ctx)
  );
});
bot.help((ctx) => ctx.reply(messages.HELP));

bot.catch((error) => {
  leave<Scenes.SceneContext>();
  console.log("[BOT_ERROR]:", error);
});
bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

console.log("Reex-tg-bot started. Version: 1.0.0");
