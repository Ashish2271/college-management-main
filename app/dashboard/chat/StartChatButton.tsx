"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { ChatContext } from "@/providers/ChatProvider";


export default function StartChatButton(){

  const {sessionId} = useContext(ChatContext);
const router = useRouter();
  return (
    <Button onClick={()=>{
      if(sessionId !== ""){

        router.push(`${sessionId}`)
      }
    }}>
      Start Chat
    </Button>
  )
}