"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { ChatContext } from "@/providers/ChatProvider";
import { createChatTicket } from "@/actions/message";
import { useSession } from "next-auth/react";
import { toast } from "@/hooks/use-toast";

export default function StartButton({ department }: any) {
  const { selectedTeacherId,chatName } = useContext(ChatContext);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();

  const handleStartChat = async () => {
    if (!session?.user?.id) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to start a chat",
        variant: "destructive",
      });
      return;
    }

    if (!selectedTeacherId) {
      toast({
        title: "Selection Error",
        description: "Please select a teacher first",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      console.log(selectedTeacherId)


      router.push(`/dashboard/timetable/${department}/${chatName}/${selectedTeacherId}/schedule`);
    } catch (error) {
      console.error("Error creating chat:", error);
      toast({
        title: "Chat Creation Failed",
        description: error instanceof Error ? error.message : "Failed to start chat. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleStartChat} 
      disabled={isLoading || !selectedTeacherId}
      className="w-full md:w-auto"
    >
      {isLoading ? "booking" : "book"}
    </Button>
  );
}