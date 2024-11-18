"use client"

import { getTeacherTickets } from "@/actions/message"
import { useEffect, useState } from "react"

interface TeacherChatListProps {
    teacherId: string
  }
  
  export function TeacherChatList({ teacherId }: TeacherChatListProps) {
    const [tickets, setTickets] = useState<any>([])
    const [loading, setLoading] = useState(true)
  
    useEffect(() => {
      const loadTickets = async () => {
        try {
          const fetchedTickets = await getTeacherTickets()
          setTickets(fetchedTickets)
        } catch (error) {
          console.error('Error loading tickets:', error)
        } finally {
          setLoading(false)
        }
      }
  
      loadTickets()
    }, [teacherId])
  
    if (loading) {
      return <div>Loading tickets...</div>
    }
  
    return (
      <div className="space-y-4">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">
                  Student: {ticket.student.student?.rollno || ticket.student.email}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Last message:{' '}
                  {ticket.messages[0]?.content || 'No messages yet'}
                </p>
              </div>
              <div
                className={`px-2 py-1 rounded-full text-xs ${
                  ticket.status === 'OPEN'
                    ? 'bg-yellow-100 text-yellow-800'
                    : ticket.status === 'IN_PROGRESS'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-green-100 text-green-800'
                }`}
              >
                {ticket.status}
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }