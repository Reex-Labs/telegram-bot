import { Context, Scenes } from "telegraf";
import { Message, Update } from "telegraf/typings/core/types/typegram";
import { SceneSession, SceneSessionData } from "telegraf/typings/scenes";

type MessageTriple = Update.New & Update.NonChannel & Message;

export interface SessionData extends SceneSession<SceneSessionData> {
  a: string;
  m: string;
  state: boolean;
}

export interface MessageData {
  text: string;
}

export interface BotContext extends Context, Scenes.SceneContext {
  session: SessionData;
  message: MessageTriple & MessageData;
}
