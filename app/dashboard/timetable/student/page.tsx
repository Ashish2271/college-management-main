// app/student/bookings/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getStudentBookings } from '@/actions/booking'

const formatTime = (date: Date) => {
  return new Date(date).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit'
  })
}

export default function StudentBookingsPage() {
  const [bookings, setBookings] = useState([])

  useEffect(() => {
    const loadBookings = async () => {
      const result = await getStudentBookings()
      //@ts-ignore
      if (!result.error) {
      //@ts-ignore
      
        setBookings(result)
      }
    }
    loadBookings()
  }, [])

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { class: 'bg-yellow-500 hover:bg-yellow-600', text: 'Pending' },
      APPROVED: { class: 'bg-green-500 hover:bg-green-600', text: 'Approved' },
      REJECTED: { class: 'bg-red-500 hover:bg-red-600', text: 'Rejected' }
    }

    const config = statusConfig[status]
    return (
      <Badge className={config.class}>
        {config.text}
      </Badge>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>My Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bookings.length === 0 ? (
              <p className="text-center text-gray-500">No bookings found</p>
            ) : (
              bookings.map((booking: any) => (
                <div 
                  key={booking.id} 
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">
                        {booking.teacher.username}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {booking.teacher.department}
                      </p>
                    </div>
                    {getStatusBadge(booking.status)}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Requested Time:</p>
                      <p className="text-sm">
                        {formatTime(booking.requestedStartTime)} - {formatTime(booking.requestedEndTime)}
                      </p>
                    </div>

                    {booking.approvedStartTime && (
                      <div>
                        <p className="text-sm font-medium">Approved Time:</p>
                        <p className="text-sm">
                          {formatTime(booking.approvedStartTime)} - {formatTime(booking.approvedEndTime)}
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-medium">Reason:</p>
                    <p className="text-sm text-gray-600">{booking.reason}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}