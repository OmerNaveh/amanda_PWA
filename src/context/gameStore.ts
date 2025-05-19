import { create } from "zustand";
import { GAME_STATUS, Session } from "models/game";
import { QuestionType } from "models/responses";
import { Space } from "models/space";
import { User } from "models/user";

interface GameState {
  // State
  space: Space | null;
  participents: User[];
  session: Session | null;
  questionCounter: number;
  selectedGameType: QuestionType | null;
  gameStatus: GAME_STATUS;
  gameSummary: User[];
  hasEveryoneAnswered: boolean;

  // Actions
  setSpace: (space: Space | null) => void;
  setParticipents: (setter: User[] | ((prev: User[]) => User[])) => void;
  setSession: (session: Session | null) => void;
  setQuestionCounter: (setter: number | ((prev: number) => number)) => void;
  setSelectedGameType: (type: QuestionType | null) => void;
  setGameStatus: (status: GAME_STATUS) => void;
  setGameSummary: (summary: User[] | ((prev: User[]) => User[])) => void;
  setHasEveryoneAnswered: (value: boolean) => void;
  resetGame: () => void;
  resetAll: () => void;

  // Computed
  getIsSessionAdmin: (userId?: string | number) => boolean;
}

export const useGameStore = create<GameState>((set, get) => ({
  // Initial state
  space: null,
  participents: [],
  session: null,
  questionCounter: 0,
  selectedGameType: null,
  gameStatus: GAME_STATUS.WELCOME,
  gameSummary: [],
  hasEveryoneAnswered: false,

  // Actions
  setSpace: (space) => set({ space }),
  setParticipents: (setter) =>
    set((state) => ({
      participents:
        typeof setter === "function" ? setter(state.participents) : setter,
    })),
  setSession: (session) => set({ session }),
  setQuestionCounter: (setter) =>
    set((state) => ({
      questionCounter:
        typeof setter === "function" ? setter(state.questionCounter) : setter,
    })),
  setSelectedGameType: (type) => set({ selectedGameType: type }),
  setGameStatus: (status) => set({ gameStatus: status }),
  setGameSummary: (summary) =>
    set((state) => ({
      gameSummary:
        typeof summary === "function" ? summary(state.gameSummary) : summary,
    })),
  setHasEveryoneAnswered: (value) => set({ hasEveryoneAnswered: value }),

  resetGame: () =>
    set({
      session: null,
      selectedGameType: null,
      gameStatus: GAME_STATUS.PRE_GAME,
      gameSummary: [],
      questionCounter: 0,
      hasEveryoneAnswered: false,
    }),

  resetAll: () =>
    set({
      space: null,
      participents: [],
      session: null,
      selectedGameType: null,
      gameStatus: GAME_STATUS.WELCOME,
      gameSummary: [],
      questionCounter: 0,
      hasEveryoneAnswered: false,
    }),

  // Computed values
  getIsSessionAdmin: (userId) => {
    const { session } = get();
    return (
      !!session?.adminId &&
      !!userId &&
      String(session.adminId) === String(userId)
    );
  },
}));
