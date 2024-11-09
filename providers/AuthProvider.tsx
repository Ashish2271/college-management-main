"use client";

import { Dispatch, SetStateAction, createContext, useState } from "react";

type StateType = {
  role: string;
  id: string;
  setId: Dispatch<SetStateAction<string>>;
  setRole: Dispatch<SetStateAction<string>>;
};
const initState: StateType = {
  role: "",
  id: "",
  setId: () => {},
  setRole: () => {},
};

export const AuthContext = createContext<StateType>(initState);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [role, setRole] = useState("");
  const [id, setId] = useState("");

  return (
    <AuthContext.Provider value={{ role, setRole, id, setId }}>
      {children}
    </AuthContext.Provider>
  );
}
