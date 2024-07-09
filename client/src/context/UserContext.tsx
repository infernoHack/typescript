import { createContext, useContext, useState } from "react";

export type AuthUserType = {
  id: string;
  username: string;
};

type UserContextType = {
  user: AuthUserType | null;
  setUser: React.Dispatch<React.SetStateAction<AuthUserType | null>>;
};

type UserProviderProps = {
  children: React.ReactNode;
};

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<AuthUserType | null>({
    id: "1",
    username: "xyz",
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error("Can't access user context outside of its scope");
  }

  return context;
}
