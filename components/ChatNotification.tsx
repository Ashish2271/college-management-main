import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useContext } from "react";
import { ChatContext } from "@/providers/ChatProvider";
import Link from "next/link";

interface ChatNotificationProps {
  notificationDetails: {
    id: string;
    student: {
      student: {
        name: string;
        image?: string;
      };
    };
    message: string;
  };
}

export default function ChatNotification({ notificationDetails }: ChatNotificationProps) {
  const { setChatName } = useContext(ChatContext);

  const handleStartChat = () => {
    setChatName(notificationDetails?.student?.student?.name || '');
  };

  return (
    <div className="flex bg-primary text-white py-3 px-4 rounded-2xl gap-4 items-center w-full max-w-full">
      {notificationDetails?.student?.student?.image && (
        <Avatar className="w-10 h-10">
          {/* <AvatarImage src={notificationDetails.student.student.image} alt={notificationDetails.student.student.name} /> */}
          <AvatarFallback>{notificationDetails.student.student.name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      )}
      
      <div className="flex-1 min-w-0">
        <p className="text-base font-semibold truncate">
          {notificationDetails?.student?.student?.name}
        </p>
        <p className="text-accent text-sm truncate">
          {notificationDetails?.message}
        </p>
      </div>
      
      <Link 
        href={`/dashboard/chat/teacher/${notificationDetails?.id}`} 
        className="ml-auto"
      >
        <Button 
          className="bg-primary-foreground text-primary hover:bg-opacity-90 whitespace-nowrap"
          onClick={handleStartChat}
        >
          Start Chat
        </Button>
      </Link>
    </div>
  );
}