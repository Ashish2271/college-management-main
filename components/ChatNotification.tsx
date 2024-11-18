import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useContext } from "react";
import { ChatContext } from "@/providers/ChatProvider";
import Link from "next/link";

interface ChatNotificationProps {
  notificationDetails: {
    id: string;
    name: string;
    image?: string;
    message: string;
  };
}

export default function ChatNotification({ notificationDetails }: ChatNotificationProps) {
  const { setChatName } = useContext(ChatContext);
console.log("woow",notificationDetails)
  const handleStartChat = () => {
    setChatName(notificationDetails?.name);
  };

  return (
    <div className="flex bg-primary text-white py-4 px-6 justify-center rounded-2xl gap-6 items-center max-sm:flex-col max-sm:px-4">
      <div className="flex gap-4">
        <Avatar className="w-12 h-12 max-lg:w-10 max-lg:h-10">
          {/* {notificationDetails.image && <AvatarImage src={notificationDetails.image} />} */}
          <AvatarFallback>SU</AvatarFallback>
        </Avatar>
        <div className="space-y-2">
          <p className="text-lg font-semibold">{notificationDetails?.name}</p>
          <p className="max-w-[600px] max-xl:max-w-[400px] max-lg:max-w-[280px] max-sm:max-w-[240px] overflow-hidden text-ellipsis whitespace-nowrap text-accent text-sm">
            {notificationDetails?.message}
          </p>
        </div>
      </div>
      <Link href={`/dashboard/chat/teacher/${notificationDetails?.id}`} className="w-full">
        <Button className="bg-primary-foreground text-primary hover:bg-primary-foreground max-sm:w-full" onClick={handleStartChat}>
          Start Chat
        </Button>
      </Link>
    </div>
  );
}