export type User = {
  id: number;
  name: string;
  color: string;
  score?: number;
};

export type AuthContext = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};
