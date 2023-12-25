import { Space } from "./space";
import { User } from "./user";

export type CreateOrJoinSpaceResponse = {
  space: Space;
  user: User;
};
