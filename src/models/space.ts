import { User } from "./user";

export type Space = {
  id: number;
  name: string;
  channel: string;
  isSessionInPlay?: boolean;
  users: User[];
};
