import { type Conversation, type ConversationFlavor } from '@grammyjs/conversations';

import { Context, SessionFlavor } from 'grammy';
import { UserFromGetMe } from 'grammy/types';

export interface SessionData {
  botInfo: UserFromGetMe;
}
export type MyContext = Context & ConversationFlavor & SessionFlavor<SessionData>;
export type MyConversation = Conversation<MyContext>;
