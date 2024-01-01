export type CreateOrJoinSpaceRequest = {
  amandaId: string;
  name: string;
  color: string;
};

export type StartSessionRequest = {
  spaceId: number;
  userId: number;
  questionTypeId?: number;
};
