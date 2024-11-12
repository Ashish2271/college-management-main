'use client'



import { ChatInterface } from '@/components/chatinterface';
import { useSession } from 'next-auth/react';



export default  function ChatPage({
  params,
}: {
  params: { ticketId: string }
}) {
    const { data: session, status } = useSession();

  return (
    <div className="container mx-auto py-8">
      <ChatInterface
        ticketId={params.ticketId}
        currentUserId={session?.user.id}
        userRole={session?.user.role}
      />
    </div>
  )
}
