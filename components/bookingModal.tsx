'use client'
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createBooking } from '@/actions/teacher';

interface BookingModalProps {
  timeSlot: any,
   

  onClose: () => void;
  onBooking: () => void;
}

const BookingModal: React.FC<any> = ({ teacherId,timeSlot, onClose, onBooking}) => {
  const [reason, setReason] = useState('');

  const handleBooking = async () => {
    try {
      const response = await createBooking({
        teacherId: teacherId,

        timeSlotId:timeSlot.id,
        
        reason: reason,
      });

      if (response) {
        onBooking();
      } else {
        console.error('Error booking appointment:', response);
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Book Appointment</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <div className="space-y-4">
            <div>
              <p>Day: {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][timeSlot.startTime.getDay()]}</p>
              <p>Time: {timeSlot.startTime.toLocaleString()} - {timeSlot.endTime.toLocaleString()}</p>
              <p>Recurring: {timeSlot.isRecurring ? 'Yes' : 'No'}</p>
              <p>Bookings: {timeSlot.bookings.length} / {timeSlot.isRecurring ? 'Recurring' : 'One-time'}</p>
            </div>
            <div>
              <label htmlFor="reason" className="block font-medium">
                Reason for booking:
              </label>
              <Input
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="mt-1"
                placeholder="Enter reason for booking"
              />
            </div>
          </div>
        </DialogDescription>
        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleBooking}>Book</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;