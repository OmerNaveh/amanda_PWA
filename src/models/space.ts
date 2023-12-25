import { User } from "./user";

export type Space = {
  id: number;
  name: string;
  channel: string;
  users: User[];
};
