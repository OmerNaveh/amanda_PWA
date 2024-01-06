import { Space } from "./space";
import { User } from "./user";

export type CreateOrJoinSpaceResponse = {
  space: Space;
  user: User;
};

export type QuestionType = {
  id: number;
  name: string;
  description: string;
  picture: string;
  isSubscriptionBased?: boolean;
};

export type QuestionTypeResponse = {
  id: number;
  name: string;
  questionTypes: QuestionType[];
};
