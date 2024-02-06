import { Question, Session } from "./game";
import { QuestionType } from "./responses";
import { Space } from "./space";
import { User } from "./user";

export enum PUBNUB_MESSAGE_TYPE {
  JOIN = "add-user",
  LEAVE = "remove-user",
  UPDATE_SPACE = "update",
  START_GAME = "new-session",
  NEXT_QUESTION = "next-question",
  NEXT_RESULT = "next-result",
  END_GAME = "session-summary",
  BACK_TO_OPTIONS = "return-to-options",
}
export type PUBNUB_MESSAGE =
  | { type: PUBNUB_MESSAGE_TYPE.JOIN; user: User }
  | { type: PUBNUB_MESSAGE_TYPE.LEAVE; user: User }
  | { type: PUBNUB_MESSAGE_TYPE.UPDATE_SPACE; space: Space }
  | {
      type: PUBNUB_MESSAGE_TYPE.START_GAME;
      question: Question;
      questionType: QuestionType;
      session: Session;
    }
  | { type: PUBNUB_MESSAGE_TYPE.NEXT_QUESTION; question: Question }
  | { type: PUBNUB_MESSAGE_TYPE.NEXT_RESULT; users: User[] }
  | { type: PUBNUB_MESSAGE_TYPE.END_GAME; users: User[] }
  | { type: PUBNUB_MESSAGE_TYPE.BACK_TO_OPTIONS; users: User[] };
