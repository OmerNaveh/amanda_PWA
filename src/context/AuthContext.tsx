import { AuthContext, User } from "models/user";
import { createContext, PropsWithChildren, useContext, useState } from "react";

export const GlobalAuthContext = createContext<AuthContext>(null!);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  return (
    <GlobalAuthContext.Provider value={{ user, setUser }}>
      {children}
    </GlobalAuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(GlobalAuthContext);
