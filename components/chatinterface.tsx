"use client"

import React, { useEffect, useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MessageSquare, Send, Clock, CheckCircle } from 'lucide-react'
import { getTicketMessages, sendMessage, updateTicketStatus } from '@/actions/message'

interface ChatInterfaceProps {
  ticketId: string
  currentUserId: string
  userRole: 'STUDENT' | 'TEACHER'
  initialStatus?: any
}

export function ChatInterface({
  ticketId,
  currentUserId,
  userRole,
  initialStatus = 'OPEN',
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<any>([])
  const [newMessage, setNewMessage] = useState('')
  const [status, setStatus] = useState<any>(initialStatus)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  
  // Debug mount tracking
  useEffect(() => {
    console.log('Component mounted with props:', {
      ticketId,
      currentUserId,
      userRole,
      initialStatus
    })
    
    return () => {
      console.log('Component unmounting')
    }
  }, [])

  // Fetch messages with error handling and debug logs
  useEffect(() => {
    console.log('Messages fetch effect triggered. TicketId:', ticketId)
    
    const loadMessages = async () => {
      try {
        console.log('Starting to fetch messages...')
        setError(null)
        
        if (!ticketId) {
          throw new Error('No ticketId provided')
        }

        const fetchedMessages = await getTicketMessages(ticketId)
        console.log('Fetched messages:', fetchedMessages)
        
        setMessages(fetchedMessages)
      } catch (error) {
        console.error('Error loading messages:', error)
        setError(error instanceof Error ? error.message : 'Failed to load messages')
      } finally {
        setLoading(false)
        console.log('Finished loading attempt')
      }
    }

    loadMessages()
  }, [ticketId])

  // Debug render tracking
  console.log('Rendering with state:', {
    messagesCount: messages.length,
    status,
    loading,
    error
  })

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    console.log('Attempting to send message:', newMessage)
    try {
      const message = await sendMessage(
        ticketId,
        newMessage,
        currentUserId,
        userRole
      )
      console.log('Message sent successfully:', message)
      setMessages((prev) => [...prev, message])
      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
      setError('Failed to send message')
    }
  }

  const handleStatusChange = async (newStatus: any) => {
    console.log('Attempting to change status to:', newStatus)
    try {
      await updateTicketStatus(ticketId, newStatus)
      setStatus(newStatus)
      console.log('Status updated successfully')
    } catch (error) {
      console.error('Error updating status:', error)
      setError('Failed to update status')
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
    <div className="flex flex-col h-[600px] w-full max-w-2xl border rounded-lg bg-white shadow-sm">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Chat Session</h2>
        </div>
        {userRole === 'TEACHER' && (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={status === 'IN_PROGRESS' ? 'default' : 'outline'}
              onClick={() => handleStatusChange('IN_PROGRESS')}
            >
              <Clock className="h-4 w-4 mr-1" />
              In Progress
            </Button>
            <Button
              size="sm"
              variant={status === 'CLOSED' ? 'default' : 'outline'}
              onClick={() => handleStatusChange('CLOSED')}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Close
            </Button>
          </div>
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
  )
}

// Message Bubble Component remains the same...
// Message Bubble Component
interface MessageBubbleProps {
  message: any
  isCurrentUser: boolean
}

function MessageBubble({ message, isCurrentUser }: MessageBubbleProps) {
  const senderName = message.sender.teacher?.username || message.sender.student?.rollno || message.sender.email

  return (
    <div
      className={`flex ${
        isCurrentUser ? 'justify-end' : 'justify-start'
      }`}
    >
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