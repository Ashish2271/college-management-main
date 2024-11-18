// app/page.tsx
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/utils/auth'


export default async function Home() {
  const session = await getServerSession(authOptions)
  
  if (session) {
    redirect('/dashboard/timetable')
  } else {
    redirect('/signin')
  }

  // This won't be reached due to redirects, but Next.js expects a return
  return null
}