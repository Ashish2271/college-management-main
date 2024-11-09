"use client";

import { Dispatch, SetStateAction, createContext, useState } from "react";

type StateType = {
  sessionId: string;
  name: string;
  setSessionId: Dispatch<SetStateAction<string>>;
  setChatName: Dispatch<SetStateAction<string>>;
};
const initState: StateType = {
  sessionId: "",
  name: "",
  setChatName: () => {},
  setSessionId: () => {},
};

export const ChatContext = createContext<StateType>(initState);

export function ChatProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [name, setChatName] = useState("");
  const [sessionId, setSessionId] = useState("");

  return (
    <ChatContext.Provider value={{ name, sessionId, setChatName, setSessionId }}>
      {children}
    </ChatContext.Provider>
  );
}
