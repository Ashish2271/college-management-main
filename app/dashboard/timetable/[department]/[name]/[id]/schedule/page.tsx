'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BookingModal from '@/components/bookingModal';
import { getTeacherSchedule } from '@/actions/timetable';

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const HOURS = Array.from({ length: 9 }, (_, i) => i + 9); // 9 AM to 5 PM

const SlotStatus = {
  FREE: 'FREE',
  BUSY: 'BUSY',
  LECTURE: 'LECTURE',
  OTHER:'OTHER'
};

const getStatusColor = (status) => {
  switch (status) {
    case SlotStatus.FREE:
      return 'bg-green-100 hover:bg-green-200';
    case SlotStatus.BUSY:
      return 'bg-red-100 hover:bg-red-200';
    case SlotStatus.LECTURE:
      return 'bg-blue-100 hover:bg-blue-200';
      case SlotStatus.OTHER:
      return 'bg-black-100 hover:bg-blue-200';
    default:
      return 'bg-gray-100 hover:bg-gray-200';
  }
};


const StudentTeacherSchedule = ({ params }) => {
  const [schedule, setSchedule] = useState({});
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
const teacherId = params.id
const teacherName = params.name
  useEffect(() => {
    const fetchTeacherSchedule = async () => {
      try {
        const timeSlots = await getTeacherSchedule(teacherId);
        console.log(timeSlots)
        // Transform schedule into a structured format
        const formattedSchedule = timeSlots.reduce((acc, slot) => {
          if (!acc[slot.dayOfWeek]) {
            acc[slot.dayOfWeek] = {};
          }
          
          const hour = new Date(slot.startTime).getHours();
          acc[slot.dayOfWeek][hour] = {
            ...slot,
            status: slot.status
          };
          
          return acc;
        }, {});

        setSchedule(formattedSchedule);
      } catch (error) {
        console.error('Error fetching teacher schedule:', error);
      }
    };

    fetchTeacherSchedule();
  }, [teacherId]);

  const handleBooking = (timeSlot) => {
    if (timeSlot?.status === SlotStatus.FREE) {
      setSelectedTimeSlot(timeSlot);
      setShowBookingModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowBookingModal(false);
    setSelectedTimeSlot(null);
  };

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle>Teacher Schedule</CardTitle>
        <CardTitle>{teacherName.replace(/%20/g, ' ')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-2 border text-left">Time</th>
                {DAYS.map(day => (
                  <th key={day} className="p-2 border text-center">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {HOURS.map(hour => (
                <tr key={hour}>
                  <td className="p-2 border font-medium">
                    {`${hour}:00 - ${hour + 1}:00`}
                  </td>
                  {DAYS.map((_, dayIndex) => {
                    const timeSlot = schedule[dayIndex]?.[hour];
                    return (
                      <td key={`${dayIndex}-${hour}`} className="p-2 border">
                        <div 
                          className={`min-h-[60px] p-2 rounded ${getStatusColor(timeSlot?.status || 'FREE')} 
                            ${timeSlot?.status === SlotStatus.FREE ? 'cursor-pointer hover:opacity-80' : ''}`}
                          onClick={() => handleBooking(timeSlot)}
                        >
                          <div className="text-xs font-semibold">
                            {timeSlot ? timeSlot.status : 'FREE'}
                          </div>
                          {timeSlot?.Booking && timeSlot.Booking.length > 0 && (
                            <div className="text-xs mt-1">
                              {/* Booked: {timeSlot.Booking.length} */}
                              {timeSlot.Booking[0].student.name}
                            </div>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>

      {showBookingModal && selectedTimeSlot && (
        <BookingModal
          teacherId={teacherId}
          timeSlot={selectedTimeSlot}
          onClose={handleCloseModal}
          onBooking={handleCloseModal}
        />
      )}
    </Card>
  );
};

export default StudentTeacherSchedule;