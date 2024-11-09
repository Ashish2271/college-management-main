"use client";

import { ComboboxDemo } from "@/components/SelectTeacher";
import { Button } from "@/components/ui/button";
import StartChatButton from "./StartChatButton";
import { SelectCourse } from "@/components/SelectCourse";
import Link from "next/link";
import { useContext } from "react";
import { AuthContext } from "@/providers/AuthProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ChatNotification from "@/components/ChatNotification";
import { ChatNotificationDetails } from "@/lib/data";

export default function ChatPage() {
  const { role } = useContext(AuthContext);

  if(role === "TEACHER"){
  return (
    <main className="p-4 pt-12 max-sm:pt-6 max-md:pb-20 max-sm:space-y-6 flex flex-col gap-4 items-center justify-center ">
      <div className="flex flex-col items-center gap-12 max-sm:gap-6">
        <h1 className="text-5xl max-sm:text-3xl font-bold text-primary">
         Chat Notifications
        </h1>

        <div className="flex flex-col items-center gap-4">

        {ChatNotificationDetails.map((notificationObj, index) => (
          <ChatNotification notificationDetails={notificationObj} key={index} />
        ))}
        </div>
      </div>
    </main>
  );
  }

  return (
    <main className="p-4 max-md:pb-20 space-y-12 max-sm:space-y-6 flex justify-center pt-24 ">
      <div className="flex flex-col items-center gap-12">
        <h1 className="text-5xl max-sm:text-3xl font-bold text-primary">
          Select Department
        </h1>

        <SelectCourse />
        <Button>
          <Link href="chat/selectteacher">Select Teacher</Link>
        </Button>
      </div>
    </main>
  );
}
