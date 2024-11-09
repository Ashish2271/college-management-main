"use client";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { useContext } from "react";
import { ChatContext } from "@/providers/ChatProvider";
import { v4 as uuid } from "uuid";
import { useRouter } from "next/navigation";

export default function ChatNotification({notificationDetails}:{

  notificationDetails:{
    id:number,
  name:string,
  image:string,
  message:string
  }
}) {


  const {setSessionId,setChatName} = useContext(ChatContext);
  const router = useRouter();
  return (
    <div className="flex  bg-primary text-white py-4 px-6 justify-center rounded-2xl gap-6 items-center max-sm:flex-col max-sm:px-4">

      <div className="flex gap-4">

     
      <Avatar className="w-12 h-12 max-lg:w-10 max-lg:h-10">
        <AvatarImage src={notificationDetails.image} />
        <AvatarFallback>SU</AvatarFallback>
      </Avatar>
      <div className="space-y-2">
        <p className="text-lg font-semibold">{notificationDetails.name}</p>
        <p className="max-w-[600px] max-xl:max-w-[400px] max-lg:max-w-[280px] max-sm:max-w-[240px] overflow-hidden text-ellipsis whitespace-nowrap text-accent text-sm">
          {notificationDetails.message}
        </p>
      </div>
      </div>
      <Button className="bg-primary-foreground text-primary hover:bg-primary-foreground max-sm:w-full" onClick={()=>{
        setSessionId(uuid());
        setChatName(notificationDetails.name);
      
         
    
            router.push(`chat/${uuid()}`)
          
      

      }}>Start Chat</Button>
    </div>
  );
}
