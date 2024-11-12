// providers/ChatProvider.tsx
"use client";

import { createContext, useState, ReactNode } from "react";

interface ChatContextType {
  sessionId: string;
  selectedTeacherId: string | null;
  chatName: string;
  setSessionId: (id: string) => void;
  setSelectedTeacherId: (id: string | null) => void;
  setChatName: (name: string) => void;
}

export const ChatContext = createContext<ChatContextType>({
  sessionId: "",
  selectedTeacherId: null,
  chatName: "",
  setSessionId: () => {},
  setSelectedTeacherId: () => {},
  setChatName: () => {},
});

interface ChatProviderProps {
  children: ReactNode;
}

export function ChatProvider({ children }: ChatProviderProps) {
  const [sessionId, setSessionId] = useState("");
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);
  const [chatName, setChatName] = useState("");

  return (
    <ChatContext.Provider
      value={{
        sessionId,
        selectedTeacherId,
        chatName,
        setSessionId,
        setSelectedTeacherId,
        setChatName,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}