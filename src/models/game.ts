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
