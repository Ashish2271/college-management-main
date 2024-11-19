"use client";

import { ComboboxDemo } from "@/components/SelectTeacher";
import { Button } from "@/components/ui/button";

import { SelectCourse } from "@/components/SelectCourse";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/providers/AuthProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ChatNotification from "@/components/ChatNotification";
import { ChatNotificationDetails } from "@/lib/data";
import { useSession } from "next-auth/react";
import { getTeacherChats } from "@/actions/teacher";
import { getTeacherTickets } from "@/actions/message";

export default function ChatP() {
 

const { data: session } = useSession()
  const [chats, setChats] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const role = session?.user?.role
  useEffect(() => {
    async function loadChats() {
      try {
        setLoading(true)
        const chatData = await getTeacherTickets()
        console.log("wo",chatData)
        setChats(chatData)
      } catch (err) {
        setError('Failed to load chats')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
   
    if (role==="TEACHER") {
      loadChats()
    }
  }, [session])

  if (!session?.user) {
    return <div>Please sign in to view chats</div>
  }

  if (loading) {
    return <div>Loading chats...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  
  if(role === "TEACHER"){
    return (
      <main className="p-4 pt-12 max-sm:pt-6 max-md:pb-20 max-sm:space-y-6 flex flex-col gap-4 items-center justify-center">
        <div className="flex flex-col items-center gap-12 max-sm:gap-6">
          <h1 className="text-5xl max-sm:text-3xl font-bold text-primary">
            Chat Notifications
          </h1>
          <div className="flex flex-col items-center gap-4 w-full">
            {chats.map((chat) => (

              <ChatNotification key={chat.id} notificationDetails={chat} />
            ))}
            {chats.length === 0 && (
              <p className="text-gray-500">No active chats</p>
            )}
          </div>
        </div>
      </main>
    )
  }}