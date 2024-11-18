'use client'

import * as React from "react"
import { CarrotIcon, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useContext, useEffect, useState } from "react"
import { ChatContext } from "@/providers/ChatProvider"
import { v4 as uuid } from "uuid"
import { getTeachersByDepartment } from "@/actions/teacher"

type Teacher = {
  id: string
  username: string
  email: string
  department: string
  userId: string
}

export function Combo({ department }: any) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)
  const { setSessionId, setChatName,setSelectedTeacherId } = useContext(ChatContext)

  useEffect(() => {
    const loadTeachers = async () => {
      try {
        // You can modify this to allow department selection or pass it as a prop
        
        const teacherData = await getTeachersByDepartment(department)
       
        console.log(teacherData)
         //@ts-ignore
        setTeachers(teacherData)
      } catch (error) {
        console.error("Failed to load teachers:", error)
      } finally {
        setLoading(false)
      }
    }

    loadTeachers()
  }, [])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="text-primary hover:text-primary">
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="min-w-[400px] max-w-[500px] max-sm:min-w-[300px] justify-between"
        >
          {value
            ? teachers.find((teacher) => teacher.username.toLowerCase() === value)
                ?.username
            : "Select teacher..."}
          <CarrotIcon className="ml-2 h-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="min-w-[400px] max-w-[500px] max-sm:min-w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search Teacher..." className="h-9" />
          <CommandList>
            <CommandEmpty>No teachers found.</CommandEmpty>
            <CommandGroup className="text-primary">
              {loading ? (
                <CommandItem className="text-muted">Loading teachers...</CommandItem>
              ) : (
                teachers?.map((teacher) => (
                  <CommandItem
                    key={teacher?.id}
                    value={teacher?.username?.toLowerCase()}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue)
                      setChatName(currentValue)
                      setSessionId(uuid())
                      setSelectedTeacherId(teacher?.id);
                      setOpen(false)
                    }}
                    className="hover:bg-muted" 
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === teacher?.username?.toLowerCase()
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {teacher.username}
                  </CommandItem>
                ))
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}