'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { getPendingBookings, approveBooking, rejectBooking } from '@/actions/booking'

export default function TeacherBookingRequests({ params }: { params: { id: string } }) {
  const [bookings, setBookings] = useState([])
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [approvedStartTime, setApprovedStartTime] = useState('')
  const [approvedEndTime, setApprovedEndTime] = useState('')

  useEffect(() => {
    loadBookings()
  }, [params.id])

  const loadBookings = async () => {
    const result = await getPendingBookings(params.id)
    //@ts-ignore
    if (!result.error) {
    //@ts-ignore

      setBookings(result)
    }
  }

  const handleApprove = async (bookingId: string) => {
    // Get today's date
    const today = new Date()
    const [startHours, startMinutes] = approvedStartTime.split(':')
    const [endHours, endMinutes] = approvedEndTime.split(':')
    
    // Create new Date objects for start and end times
    const startDate = new Date(today)
    startDate.setHours(parseInt(startHours, 10), parseInt(startMinutes, 10), 0)
    
    const endDate = new Date(today)
    endDate.setHours(parseInt(endHours, 10), parseInt(endMinutes, 10), 0)

    const result = await approveBooking(bookingId, {
      startTime: startDate.toISOString(),
      endTime: endDate.toISOString()
    })
    console.log(result)
    //@ts-ignore

    if (!result.error) {
      setBookings(bookings.filter(b => b.id !== bookingId))
      setSelectedBooking(null)
    }
  }

  const handleReject = async (bookingId: string) => {
    const result = await rejectBooking(bookingId)
    //@ts-ignore

    if (!result.error) {
      setBookings(bookings.filter(b => b.id !== bookingId))
    }
  }

  const handleBookingSelect = (booking: any) => {
    setSelectedBooking(booking)
    const startDate = new Date(booking.requestedStartTime)
    const endDate = new Date(booking.requestedEndTime)
    
    // Format times as HH:mm
    setApprovedStartTime(
      `${startDate.getHours().toString().padStart(2, '0')}:${startDate.getMinutes().toString().padStart(2, '0')}`
    )
    setApprovedEndTime(
      `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Pending Booking Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bookings.length === 0 ? (
              <p className="text-center text-gray-500">No pending booking requests</p>
            ) : (
              bookings.map((booking: any) => (
                <div 
                  key={booking.id} 
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">
                        {booking.student.name} ({booking.student.rollno})
                      </h3>
                      <p className="text-sm text-gray-600">
                        Requested Time: {new Date(booking.requestedStartTime).toLocaleTimeString()} - {' '}
                        {new Date(booking.requestedEndTime).toLocaleTimeString()}
                      </p>
                      <p className="text-sm mt-1">
                        Reason: {booking.reason}
                      </p>
                    </div>
                    <div className="space-x-2">
                      <Button
                        onClick={() => handleBookingSelect(booking)}
                        className="bg-green-500 hover:bg-green-600"
                      >
                        Review & Approve
                      </Button>
                      <Button
                        onClick={() => handleReject(booking.id)}
                        variant="destructive"
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {selectedBooking && (
        <Dialog open onOpenChange={() => setSelectedBooking(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Approve Booking Request</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <p className="font-medium">{selectedBooking.student.name}</p>
                <p className="text-sm">
                  Requested: {new Date(selectedBooking.requestedStartTime).toLocaleTimeString()} - {' '}
                  {new Date(selectedBooking.requestedEndTime).toLocaleTimeString()}
                </p>
              </div>
              <div className="space-y-3">
                <div>
                  <label htmlFor="approvedStartTime" className="block text-sm font-medium">
                    Approved Start Time
                  </label>
                  <Input
                    id="approvedStartTime"
                    type="time"
                    value={approvedStartTime}
                    onChange={(e) => setApprovedStartTime(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="approvedEndTime" className="block text-sm font-medium">
                    Approved End Time
                  </label>
                  <Input
                    id="approvedEndTime"
                    type="time"
                    value={approvedEndTime}
                    onChange={(e) => setApprovedEndTime(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setSelectedBooking(null)}>
                Cancel
              </Button>
              <Button 
                onClick={() => handleApprove(selectedBooking.id)}
                disabled={!approvedStartTime || !approvedEndTime}
              >
                Approve
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}