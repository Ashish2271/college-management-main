'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from 'lucide-react';
import { getTeacherSchedule, updateTeacherSlot } from '@/actions/timetable';
import { toast } from '@/hooks/use-toast';

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const HOURS = Array.from({ length: 9 }, (_, i) => i + 9); // 9 AM to 5 PM

const SlotStatus = {
  FREE: 'FREE',
  BUSY: 'BUSY',
  LECTURE: 'LECTURE',
  OTHER: 'OTHER'
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
      return 'bg-gray-100 hover:bg-gray-200';
    default:
      return 'bg-gray-100 hover:bg-gray-200';
  }
};

const TeacherSchedule = ({ teacherId, initialSchedule = {} }) => {

  const [schedule, setSchedule] = useState({});
  const [isPending, setIsPending] = useState(false);

  const handleUpdateSlot = async (dayIndex, hour, newStatus) => {
    setIsPending(true);
    try {
      // Optimistically update the UI
      const updatedSchedule = { ...schedule };
      if (!updatedSchedule[dayIndex]) {
        updatedSchedule[dayIndex] = {};
      }
      updatedSchedule[dayIndex][hour] = {
        ...updatedSchedule[dayIndex][hour],
        status: newStatus
      };
      
      setSchedule(updatedSchedule);

      // Update in database
      await updateTeacherSlot(teacherId, {
        dayOfWeek: dayIndex,
        hour,
        status: newStatus
      });

      toast({
        title: "Success",
        description: "Schedule updated successfully"
      });
    } catch (error) {
      // Revert the optimistic update on error
      setSchedule(initialSchedule);
      
      toast({
        title: "Error",
        description: "Failed to update schedule",
        variant: "destructive"
      });
    } finally {
      setIsPending(false);
    }
  };
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
console.log("weooooo",formattedSchedule)
        setSchedule(formattedSchedule);
      } catch (error) {
        console.error('Error fetching teacher schedule:', error);
      }
    };

    fetchTeacherSchedule();
  }, [teacherId]);
  const getSlotStatus = (dayIndex, hour) => {
    return schedule[dayIndex]?.[hour]?.status || SlotStatus.FREE;
  };

  const getSlotBookings = (dayIndex, hour) => {
    return schedule[dayIndex]?.[hour]?.bookings || [];
  };

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calendar className="w-6 h-6" />
          <CardTitle>Weekly Schedule</CardTitle>
        </div>
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
                  {DAYS.map((_, dayIndex) => (
                    <td key={`${dayIndex}-${hour}`} className="p-2 border">
                      <div className="min-h-[60px]">
                        <Select
                          value={getSlotStatus(dayIndex, hour)}
                          onValueChange={(value) => handleUpdateSlot(dayIndex, hour, value)}
                          disabled={isPending}
                        >
                          <SelectTrigger 
                            className={`w-full ${getStatusColor(getSlotStatus(dayIndex, hour))} 
                            ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={SlotStatus.FREE}>Free</SelectItem>
                            <SelectItem value={SlotStatus.BUSY}>Busy</SelectItem>
                            <SelectItem value={SlotStatus.LECTURE}>Lecture</SelectItem>
                            <SelectItem value={SlotStatus.OTHER}>Other</SelectItem>
                          </SelectContent>
                        </Select>
                        {getSlotBookings(dayIndex, hour).map(booking => (
                          <div
                            key={booking.id}
                            className="mt-1 text-xs p-1 rounded bg-yellow-100 text-yellow-800"
                          >
                            {booking.student.name}
                          </div>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeacherSchedule;