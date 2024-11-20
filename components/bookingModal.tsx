'use client'
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createBooking } from '@/actions/booking';

interface TimeSlot {
  id: string;
  teacherId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  status: string;
  isRecurring: boolean;
  Booking: any[];
}

interface BookingModalProps {
  timeSlot: TimeSlot;
  teacherId: string;
  onClose: () => void;
  onBooking: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ teacherId, timeSlot, onClose, onBooking }) => {
  const [reason, setReason] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [error, setError] = useState('');

  // Format the time for input field
  const formatTimeForInput = (dateString: string) => {
    const date = new Date(dateString);
    return date.toTimeString().slice(0, 5); // Returns HH:mm format
  };

  const slotStartTime = formatTimeForInput(timeSlot.startTime);
  const slotEndTime = formatTimeForInput(timeSlot.endTime);

  // Validate and set start time
  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartTime = e.target.value;
    
    // Check if time is within slot bounds
    if (newStartTime >= slotStartTime && newStartTime < slotEndTime) {
      setStartTime(newStartTime);
      setError('');
      
      // Clear end time if it's before new start time
      if (endTime && endTime <= newStartTime) {
        setEndTime('');
      }
    } else {
      setError(`Start time must be between ${slotStartTime} and ${slotEndTime}`);
    }
  };

  // Validate and set end time
  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndTime = e.target.value;
    
    // Check if time is within slot bounds and after start time
    if (newEndTime > startTime && newEndTime <= slotEndTime) {
      setEndTime(newEndTime);
      setError('');
    } else {
      setError(`End time must be between your start time and ${slotEndTime}`);
    }
  };

  const handleBooking = async () => {
    try {
      // Convert selected times to DateTime objects
      const slotDate = new Date(timeSlot.startTime);
      const [startHour, startMinute] = startTime.split(':');
      const [endHour, endMinute] = endTime.split(':');
      
      const requestedStartTime = new Date(slotDate);
      requestedStartTime.setHours(parseInt(startHour), parseInt(startMinute));
      
      const requestedEndTime = new Date(slotDate);
      requestedEndTime.setHours(parseInt(endHour), parseInt(endMinute));

      const response = await createBooking({
        teacherId,
        timeSlotId: timeSlot.id,
        reason,
        requestedStartTime,
        requestedEndTime,
      });

      if (response) {
        onBooking();
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
    }
  };

  const isButtonDisabled = !startTime || !endTime || !reason || error !== '';

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Book Appointment</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <div className="space-y-4">
            <div>
              <p>Day: {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date(timeSlot.startTime).getDay()]}</p>
              <p>Available Slot: {formatTimeForInput(timeSlot.startTime)} - {formatTimeForInput(timeSlot.endTime)}</p>
            </div>
            <div className="space-y-2">
              <div>
                <label htmlFor="startTime" className="block text-sm font-medium">
                  Preferred Start Time
                </label>
                <Input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={handleStartTimeChange}
                  min={slotStartTime}
                  max={slotEndTime}
                  step="300"
                />
              </div>
              <div>
                <label htmlFor="endTime" className="block text-sm font-medium">
                  Preferred End Time
                </label>
                <Input
                  id="endTime"
                  type="time"
                  value={endTime}
                  onChange={handleEndTimeChange}
                  min={startTime || slotStartTime}
                  max={slotEndTime}
                  step="300"
                />
              </div>
              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}
              <div>
                <label htmlFor="reason" className="block text-sm font-medium">
                  Reason for booking:
                </label>
                <Input
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter reason for booking"
                />
              </div>
            </div>
          </div>
        </DialogDescription>
        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleBooking} disabled={isButtonDisabled}>
            Book
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;