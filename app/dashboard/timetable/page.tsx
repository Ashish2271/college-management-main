import DepartmentCard from "@/components/DepartmentCard";
import { TeachersDepartment } from "@/lib/data";



export default function Dashboard() {




  
  return (
    <main className="p-4 max-sm:pb-20">
     
      <div className="flex flex-wrap  items-stretch gap-12 max-lg:gap-8 w-full max-sm:flex-col  ">
        {TeachersDepartment.map((departmentObj) => (
          <DepartmentCard
            key={departmentObj.id}
            name={departmentObj.name}
            code={departmentObj.selectId}
          />
        ))}
      </div>
    </main>
  );
}
