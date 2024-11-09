import DashboardLink from "@/components/DashboardLink";
import { CalendarClock, MessageCircleQuestion, School } from "lucide-react";
import MobileDashboard from "@/components/MobileDashboard";

interface Props {
  children: React.ReactNode;
}

export default async function DashboardLayout({ children }: Props) {
  return (
    <main className="h-screen w-screen  flex flex-col">
      <div className="flex-1 h-full flex">
        <nav className="w-60 p-4 pt-12  h-full bg-primary max-md:hidden ">
          <div className="mt-12 flex flex-col gap-2">
            <DashboardLink href="/dashboard/timetable">
              <CalendarClock /> <p>Time Table</p>
            </DashboardLink>
            <DashboardLink href="/dashboard/chat">
              <MessageCircleQuestion /> <p>Chat</p>
            </DashboardLink>
            <DashboardLink href="/dashboard/leacturetheater">
              <School /> <p>LT Availability</p>
            </DashboardLink>
          </div>
        </nav>
        <MobileDashboard />
        <div className="flex-1  flex flex-col overflow-x-hidden h-full">
          <div className="flex-1  overflow-auto  ">
            <div className="w-full h-full z-10 pt-20">{children}</div>
          </div>
        </div>
      </div>

      {/* <div className="flex h-screen items-start  ">
      <nav className="sticky bottom-0 h-screen p-4 w-60 bg-muted max-md:hidden">
        <div className="h-32 bg-primary rounded-sm flex items-center justify-center">
          <p className="text-6xl font-bold text-muted">SDS </p>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <DashboardLink href="/dashboard">Time Table</DashboardLink>
          <DashboardLink href="/dashboard/chat">Chat</DashboardLink>
          <DashboardLink href="/dashboard/createuser">
            LT Availability
          </DashboardLink>
        </div>
      </nav>

      <MobileDashboard />

      <div className="flex-1 flex flex-col">
        <div className="sticky top-0 flex gap-6 items-center h-12 bg-muted z-10"></div>
        <div className=" flex-1  my-4 mx-4   ">
        
        {children}
      </div>
      </div>
     
      </div> */}
      <div className="dark:bg-black bg-white  dark:bg-dot-white/[0.2] bg-dot-black/[0.2] absolute w-full h-full top-0 z-[-1] ">
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] z-[-1]"></div>
      </div>
    </main>
  );
}
