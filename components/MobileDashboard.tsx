import {  CalendarClock, MessageCircleQuestion, School  } from 'lucide-react';
import DashboardLink from "./DashboardLink";

export default function MobileDashboard() {
  return (
   <nav className='fixed bottom-2 w-full flex justify-center z-10 md:hidden '>
      <div className="mt-4 flex  gap-12 max-sm:gap-8 bg-primary py-2 px-8 rounded-2xl max-w-full z-20 ">
          <DashboardLink href="/dashboard/timetable"><CalendarClock /></DashboardLink>
          <DashboardLink href="/dashboard/chat"> <MessageCircleQuestion /></DashboardLink>
          <DashboardLink href="/dashboard/leacturetheater">
          <School />
          </DashboardLink>
          
        </div>
   </nav>
  );
}
