// components/TeacherBookingRequests.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getPendingBookings, approveBooking, rejectBooking } from '@/actions/booking'

interface Booking {
  id: string
  student: {
    name: string
    rollno: string
  }
  timeSlot: {
    dayOfWeek: number
    startTime: Date
    endTime: Date
  }
  reason: string
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

const TeacherBookingRequests = ({params}) => {
  const [bookings, setBookings] = useState<Booking[]>([])
  const teacherId = params.id
  useEffect(() => {
    const fetchPendingBookings = async () => {
      const result = await getPendingBookings(teacherId)
      //@ts-ignore
      if (!result.error) {
         //@ts-ignore
        setBookings(result)
      }
    }
    fetchPendingBookings()
  }, [teacherId])

  const handleApprove = async (bookingId: string) => {
    await approveBooking(bookingId)
    setBookings(bookings.filter(booking => booking.id !== bookingId))
  }

  const handleReject = async (bookingId: string) => {
    await rejectBooking(bookingId)
    setBookings(bookings.filter(booking => booking.id !== bookingId))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking Requests</CardTitle>
      </CardHeader>
      <CardContent>
        {bookings.length === 0 ? (
          <p>No pending booking requests</p>
        ) : (
          <div className="space-y-4">
            {bookings.map(booking => (
              <div 
                key={booking.id} 
                className="border p-4 rounded-lg flex justify-between items-center"
              >
                <div>
                  <p><strong>Student:</strong> {booking.student.name} (Roll No: {booking.student.rollno})</p>
                  <p><strong>Day:</strong> {DAYS[booking.timeSlot.dayOfWeek]}</p>
                  <p><strong>Time:</strong> {new Date(booking.timeSlot.startTime).toLocaleTimeString()} - {new Date(booking.timeSlot.endTime).toLocaleTimeString()}</p>
                  <p><strong>Reason:</strong> {booking.reason}</p>
                </div>
                <div className="space-x-2">
                  <Button 
                    onClick={() => handleApprove(booking.id)}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    Approve
                  </Button>
                  <Button 
                    onClick={() => handleReject(booking.id)}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default TeacherBookingRequests