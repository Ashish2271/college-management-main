import TheaterCard from "@/components/TheaterCard";
import { LT_INFO } from "@/lib/data";

export default function LeactureTheaturesPage(){


  return (
    <main className="p-4 max-md:pb-20 space-y-12 max-sm:space-y-6 ">
      <h1 className="text-5xl max-sm:text-4xl text-primary  font-bold max-sm:text-center ">Lecture Theaters</h1>
      <div className="flex flex-wrap gap-12">
        {LT_INFO.map((ltobj)=>{
          return (

            <TheaterCard name={ltobj.name} location={ltobj.location} key={ltobj.id} />
          )
        })}

      </div>
    </main>
  )
}