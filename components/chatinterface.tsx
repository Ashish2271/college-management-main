import React, { useEffect, useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MessageSquare, Send, XCircle } from 'lucide-react'
import { getTicketMessages, sendMessage, updateTicketStatus } from '@/actions/message'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import ChatP from './teachernoti'

interface ChatInterfaceProps {
  ticketId: string
  currentUserId: string
  userRole: 'STUDENT' | 'TEACHER'
  initialStatus?: 'OPEN' | 'CLOSED'
}

export function ChatInterface({
  ticketId,
  currentUserId,
  userRole,
  initialStatus,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [status, setStatus] = useState(initialStatus)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadMessages = async () => {
      try {
        setError(null)
        if (!ticketId) {
          throw new Error('No ticketId provided')
        }
        const fetchedMessages = await getTicketMessages(ticketId)
        setMessages(fetchedMessages)
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to load messages')
      } finally {
        setLoading(false)
      }
    }
    loadMessages()
  }, [ticketId])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    try {
      const message = await sendMessage(
        ticketId,
        newMessage,
        currentUserId,
        userRole
      )
      setMessages((prev) => [...prev, message])
      setNewMessage('')
    } catch (error) {
      setError('Failed to send message')
    }
  }

  const handleCloseTicket = async () => {
    try {
     const response = await updateTicketStatus(ticketId, 'CLOSED')
     console.log("saff",response)
      setStatus('CLOSED')
    } catch (error) {
      setError('Failed to close ticket')
    }
  }

  if (error) {
    return (
      <div className="flex flex-col h-[600px] w-full max-w-2xl border rounded-lg bg-white shadow-sm p-4">
        <div className="text-red-500">Error: {error}</div>
        <Button onClick={() => window.location.reload()} className="mt-2">
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div>
    <div className="flex flex-col h-[600px] w-full max-w-2xl border rounded-lg bg-white shadow-sm">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Chat Session</h2>
          <span className={`text-sm px-2 py-1 rounded ${
            status === 'CLOSED' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}>
            {status}
          </span>
        </div>
        {userRole === 'TEACHER' && status !== 'CLOSED' && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <XCircle className="h-4 w-4 mr-2" />
                Close Ticket
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Close Support Ticket</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to close this ticket? This action cannot be undone,
                  and no further messages can be sent once the ticket is closed.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleCloseTicket}>
                  Close Ticket
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {/* Messages Area */}
      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-pulse">Loading messages...</div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-full text-gray-500">
            No messages yet
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isCurrentUser={message.senderId === currentUserId}
              />
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={status === 'CLOSED'}
          />
          <Button type="submit" disabled={status === 'CLOSED'}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
      
    </div>
    {/* <ChatP/> */}
    </div>
    
  )
}

function MessageBubble({ message, isCurrentUser }: { message: any, isCurrentUser: boolean }) {
  const senderName = message.sender.teacher?.username || message.sender.student?.name 

  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[70%] rounded-lg p-3 ${
          isCurrentUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted'
        }`}
      >
        <div className="text-xs opacity-75 mb-1">{senderName}</div>
        <div>{message.content}</div>
      </div>
    </div>
  )
}

export default ChatInterface;