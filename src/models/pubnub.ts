import { Question, Session } from "./game";
import { Space } from "./space";
import { User } from "./user";

export enum PUBNUB_MESSAGE_TYPE {
  JOIN = "add-user",
  UPDATE_SPACE = "update",
  START_GAME = "new-session",
  NEXT_QUESTION = "next-question",
  NEXT_RESULT = "next-result",
  END_GAME = "session-summary",
}
export type PUBNUB_MESSAGE =
  | { type: PUBNUB_MESSAGE_TYPE.JOIN; user: User }
  | { type: PUBNUB_MESSAGE_TYPE.UPDATE_SPACE; space: Space }
  | {
      type: PUBNUB_MESSAGE_TYPE.START_GAME;
      question: Question;
      session: Session;
    }
  | { type: PUBNUB_MESSAGE_TYPE.NEXT_QUESTION; question: Question }
  | { type: PUBNUB_MESSAGE_TYPE.NEXT_RESULT; users: User[] }
  | { type: PUBNUB_MESSAGE_TYPE.END_GAME; users: User[] };
