import { Space } from "./space";
import { User } from "./user";

export type CreateOrJoinSpaceResponse = {
  space: Space;
  user: User;
};

export type QuestionTypeResponse = {
  id: number;
  name: string;
  description: string;
  picture: string;
  isSubscriptionBased: boolean;
};
