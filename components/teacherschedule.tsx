// components/TeacherSchedule.tsx

import { getTeacherSchedule } from "@/actions/teacher";


interface TeacherScheduleProps {
  teacherId: string;
}

interface TimeSlotGroup {
  [key: number]: {
    startTime: string;
    endTime: string;
    bookings: any[];
  }[];
}

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default async function TeacherSchedule({ teacherId }: TeacherScheduleProps) {
  const timeSlots = await getTeacherSchedule(teacherId);

  // Group time slots by day
  const groupedSlots: TimeSlotGroup = timeSlots.reduce((acc: TimeSlotGroup, slot) => {
    if (!acc[slot.dayOfWeek]) {
      acc[slot.dayOfWeek] = [];
    }

    acc[slot.dayOfWeek].push({
      startTime: new Date(slot.startTime).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      endTime: new Date(slot.endTime).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      bookings: slot.Booking,
    });

    return acc;
  }, {});

  return (
    <div className="grid gap-6">
      {DAYS.map((day, index) => (
        <div key={day} className="border rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">{day}</h2>
          {groupedSlots[index]?.length ? (
            <div className="grid gap-4">
              {groupedSlots[index].map((slot, slotIndex) => (
                <div
                  key={slotIndex}
                  className="bg-gray-50 p-3 rounded-md flex justify-between items-center"
                >
                  <div>
                    <span className="font-medium">
                      {slot.startTime} - {slot.endTime}
                    </span>
                    <div className="text-sm text-gray-600 mt-1">
                      {slot.bookings.length} bookings
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {slot.bookings.map((booking: any) => (
                      <span
                        key={booking.id}
                        className={`px-2 py-1 rounded text-xs ${
                          booking.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : booking.status === "APPROVED"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {booking.status}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No time slots scheduled</p>
          )}
        </div>
      ))}
    </div>
  );
}