"use client"
import { TeacherChatList } from '@/components/teacherlist';
import { useSession } from 'next-auth/react';

export default  function TeacherChatsPage() {
    const { data: session, status } = useSession();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Chat Sessions</h1>
      <TeacherChatList teacherId={session?.user.id} />
    </div>
  )
}