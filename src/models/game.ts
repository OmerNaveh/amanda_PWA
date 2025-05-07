import { QuestionType } from "./responses";
import { Space } from "./space";
import { User } from "./user";

export type Question = {
  id: number;
  content: string;
};

export type Session = {
  id: number;
  adminId: number;
};

export enum GAME_STATUS {
  WELCOME,
  PRE_GAME,
  SHOWING_QUESTION,
  WAITING_FOR_ANSWERS,
  SHOWING_RESULT,
  GAME_OVER,
}

export type GameContext = {
  space: Space | null;
  setSpace: React.Dispatch<React.SetStateAction<Space | null>>;
  session: Session | null;
  setSession: React.Dispatch<React.SetStateAction<Session | null>>;
  participents: User[];
  setParticipents: React.Dispatch<React.SetStateAction<User[]>>;
  selectedGameType: QuestionType | null;
  setSelectedGameType: React.Dispatch<
    React.SetStateAction<QuestionType | null>
  >;
  gameStatus: GAME_STATUS;
  setGameStatus: React.Dispatch<React.SetStateAction<GAME_STATUS>>;
  gameSummary: User[];
  setGameSummary: React.Dispatch<React.SetStateAction<User[]>>;
  questionCounter: number;
  setQuestionCounter: React.Dispatch<React.SetStateAction<number>>;

  hasEveryoneAnswered: boolean;
  setHasEveryoneAnswered: React.Dispatch<React.SetStateAction<boolean>>;

  resetGame: () => void;
  resetAll: () => void;
};
