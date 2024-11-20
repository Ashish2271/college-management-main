"use client";

import { FC, useState, useEffect } from 'react'
import { Calendar, dateFnsLocalizer, Event, View, SlotInfo } from 'react-big-calendar'
import withDragAndDrop, { withDragAndDropProps } from 'react-big-calendar/lib/addons/dragAndDrop'
import {format} from 'date-fns/format'
import {parse} from 'date-fns/parse'
import {startOfWeek} from 'date-fns/startOfWeek'
import {getDay} from 'date-fns/getDay'
import { enUS } from 'date-fns/locale/en-US'
import {setHours} from 'date-fns/setHours'
import {setMinutes} from 'date-fns/setMinutes'
import {startOfDay} from 'date-fns/startOfDay'
import { getHallBookingsForDay, createHallBooking } from '@/actions/theater'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { BookingDialog } from './dialog';

interface Props {
  theaterId: string;
}

interface CalendarEvent extends Event {
  id?: string;
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';
}

const TheaterAvailability: FC<Props> = ({ theaterId }) => {
  const { data: session } = useSession()
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<{start: Date; end: Date} | null>(null)

  // Convert hall bookings to calendar events
  const convertBookingsToEvents = (bookings: any[]) => {
    return bookings.map(booking => ({
      id: booking.id,
      title: booking.User?.email || 'Reserved',
      start: new Date(booking.date.setHours(booking.start)),
      end: new Date(booking.date.setHours(booking.end)),
      status: booking.status,
    }))
  }

  // Fetch bookings for the selected date
  const fetchBookings = async (date: Date) => {
    const result = await getHallBookingsForDay(theaterId, date)
    if (result.success) {
      setEvents(convertBookingsToEvents(result.data))
    } else {
      toast.error("Failed to fetch bookings")
    }
  }

  useEffect(() => {
    fetchBookings(selectedDate)
  }, [selectedDate, theaterId])

  const handleCreateBooking = async (reason: string) => {
    if (!session?.user?.id || !selectedSlot) {
      toast.error("Please sign in to make bookings")
      return
    }

    const { start, end } = selectedSlot
    const startHour = start.getHours()
    const endHour = end.getHours()

    // Validate booking hours (5 PM to 11 PM)
    if (startHour < 17 || endHour > 23) {
      toast.error("Bookings are only available between 5 PM and 11 PM")
      return
    }

    try {
      const bookingDate = startOfDay(start)
      
      const result = await createHallBooking({
        theaterId,
        userId: session.user.id,
        start: startHour,
        end: endHour,
        date: bookingDate,
        reason
      })

      if (result.success) {
        toast.success("Booking requested")
        fetchBookings(selectedDate)
      } else {
        toast.error(result.error || "Failed to create booking")
      }
    } catch (error) {
      toast.error("Failed to create booking")
    }
  }

  const handleSelectSlot = (slotInfo: SlotInfo) => {
    if (!session?.user?.id) {
      toast.error("Please sign in to make bookings")
      return
    }

    setSelectedSlot({
      start: new Date(slotInfo.start),
      end: new Date(slotInfo.end)
    })
    setIsBookingDialogOpen(true)
  }

  // Set the time boundaries for the calendar
  const minTime = setHours(setMinutes(new Date(), 0), 17) // 5 PM
  const maxTime = setHours(setMinutes(new Date(), 0), 23) // 11 PM

  return (
    <main className='overflow-x-auto p-4 max-sm:pb-20'>
      <div className='min-w-[600px] w-full'>
        <DnDCalendar
          defaultView="day"
          views={['day']}
          events={events}
          localizer={localizer}
          resizable={false}
          style={{ height: '100vh' }}
          min={minTime}
          max={maxTime}
          selectable
          onSelectSlot={handleSelectSlot}
          onNavigate={(date: Date) => setSelectedDate(date)}
          eventPropGetter={(event: CalendarEvent) => ({
            className: `status-${event.status?.toLowerCase()}`,
            style: {
              backgroundColor: event.status === 'PENDING' ? '#FFA500' : 
                             event.status === 'APPROVED' ? '#4CAF50' : 
                             event.status === 'REJECTED' ? '#F44336' : '#2196F3'
            }
          })}
        />
        
        {selectedSlot && (
          <BookingDialog
            isOpen={isBookingDialogOpen}
            onClose={() => {
              setIsBookingDialogOpen(false)
              setSelectedSlot(null)
            }}
            onConfirm={handleCreateBooking}
            startTime={selectedSlot.start}
            endTime={selectedSlot.end}
          />
        )}
      </div>
    </main>
  )
}

const locales = {
  'en-US': enUS,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

//@ts-ignore
const DnDCalendar = withDragAndDrop(Calendar)

export default TheaterAvailability