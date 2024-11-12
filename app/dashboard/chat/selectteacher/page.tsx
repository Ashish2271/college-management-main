import { ComboboxDemo } from "@/components/SelectTeacher"
import { Button } from "@/components/ui/button"
import StartChatButton from "../StartChatButton"

export default function SelectTeacherPage() {
  return (
    <main className="p-4 max-md:pb-20 space-y-12 max-sm:space-y-6 flex justify-center pt-24">
      <div className="flex flex-col items-center gap-12">
        <h1 className="text-5xl max-sm:text-3xl font-bold text-primary">
          Select Teacher
        </h1>
        <ComboboxDemo />
        <StartChatButton />
      </div>
    </main>
  )
}