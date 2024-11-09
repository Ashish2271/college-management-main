'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BookingModal from '@/components/bookingModal';
import { getTeacherSchedule } from '@/actions/teacher';


const TeacherSchedule = ({ params }) => {
  const [timeSlots, setTimeSlots] = useState([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  useEffect(() => {
    const fetchTeacherSchedule = async () => {
      try {
        const data:any = await getTeacherSchedule(params.id)
        
       
        setTimeSlots(data);
      } catch (error) {
        console.error('Error fetching teacher schedule:', error);
      }
    };

    fetchTeacherSchedule();
  }, [params.id]);

  const handleBooking = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
    setShowBookingModal(true);
  };

  const handleCloseModal = () => {
    setShowBookingModal(false);
    setSelectedTimeSlot(null);
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Teacher Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-2 border text-left">Day</th>
                <th className="p-2 border text-left">Time</th>
                <th className="p-2 border text-left">Bookings</th>
                <th className="p-2 border text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((timeSlot) => (
                <tr key={timeSlot.id}>
                  <td className="p-2 border">
                    {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][timeSlot.dayOfWeek]}
                  </td>
                  <td className="p-2 border">{timeSlot.startTime.toLocaleString()} - {timeSlot.endTime.toLocaleString()}</td>
                  <td className="p-2 border">
                    {timeSlot.bookings.length} / {timeSlot.isRecurring ? 'Recurring' : 'One-time'}
                  </td>
                  <td className="p-2 border">
                    <Button onClick={() => handleBooking(timeSlot)}>Book</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>

      {showBookingModal && selectedTimeSlot && (
       <BookingModal
       teacherId={params.id}
       timeSlot={selectedTimeSlot}
       onClose={handleCloseModal}
       onBooking={handleCloseModal}
     />
      )}
    </Card>
  );
};

export default TeacherSchedule;