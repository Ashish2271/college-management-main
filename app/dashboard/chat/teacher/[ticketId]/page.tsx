'use client'

import { ChatInterface } from '@/components/chatinterface';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { getTicketStatus } from '@/actions/message';

export default function ChatPage({
  params,
}: {
  params: { ticketId: string }
}) {
  const { data: session, status: sessionStatus } = useSession();
  const [ticketStatus, setTicketStatus] = useState<'OPEN' | 'CLOSED' | undefined>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTicketStatus = async () => {
      try {
        const status = await getTicketStatus(params.ticketId);
        setTicketStatus(status as 'OPEN' | 'CLOSED');
      } catch (error) {
        setError('Failed to fetch ticket status');
        console.error('Error:', error);
      }
    };

    if (params.ticketId) {
      fetchTicketStatus();
    }
  }, [params.ticketId]);

  if (sessionStatus === 'loading' || !ticketStatus) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <ChatInterface
        ticketId={params.ticketId}
        currentUserId={session?.user.id}
        userRole={session?.user.role}
        initialStatus={ticketStatus}
      />
    </div>
  );
}