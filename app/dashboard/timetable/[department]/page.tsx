import TeacherCard from "@/components/TeacherCard"
import { getTeachersByDepartment } from "@/actions/teacher"
import { Suspense } from "react"
import { notFound } from "next/navigation"
import { Combo } from "./combo"
import StartButton from "./bookbutton"

interface TeachersListProps {
  department: string
}

async function TeachersList({ department }: TeachersListProps) {
  const teachers = await getTeachersByDepartment(department)
  
  if (teachers.length === 0) {
    return (
      <div className="text-center py-8">
        <h1 className="text-xl font-semibold text-gray-600">
          No teachers found in {department} department
        </h1>
      </div>
    )
  }
  
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">{department} Department Teachers</h1>
      {/* <div className="flex flex-wrap max-md:justify-center items-stretch gap-12 max-lg:gap-8 w-full max-sm:flex-col">
        {teachers.map((teacherObj) => (
          <TeacherCard
            key={teacherObj.id}
            id ={teacherObj.id}
            name={teacherObj.username}
            email={teacherObj.user.email}
            department={teacherObj.department}
          />
        ))}
      </div> */}
    </div>
  )
}

interface PageProps {
  params: {
    department: string
  }
}

export default function DepartmentTeachersPage({ params }: PageProps) {
  // Validate department parameter
  const validDepartments = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL','HSS','MTH','PHY','ME'] // Add your valid departments
  if (!validDepartments.includes(params.department)) {
    notFound()
  }
 

  return (
    <main className="p-4 max-sm:pb-20">
      <Suspense fallback={
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      }>
           {/* <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md space-y-6 text-center"> */}
      <main className="p-4 max-md:pb-20 space-y-12 max-sm:space-y-6 flex justify-center pt-24">
        <div className="flex flex-col items-center justify-center gap-12">
        <TeachersList department={params.department} />
        <Combo department={params.department} />
        <StartButton department={params.department} />
      </div>
    {/* </div> */}
    </main>
      </Suspense>
    </main>
  )
}