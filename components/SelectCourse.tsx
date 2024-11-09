"use client";

import * as React from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check } from "lucide-react";
import { TEACHERS, TeachersDepartment } from "@/lib/data";
import { useContext } from "react";
import { ChatContext } from "@/providers/ChatProvider";
import { v4 as uuid } from "uuid";


export function SelectCourse() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  // const { setSessionId, setChatName } = useContext(ChatContext);

  return (
    <Popover open={open} onOpenChange={setOpen} >
      <PopoverTrigger asChild className="text-primary hover:text-primary">
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="min-w-[400px] max-w-[500px] max-sm:min-w-[300px] justify-between"
        >
          {value
            ? TeachersDepartment.find(
                (teacher) => teacher.name.toLowerCase() === value
              )?.name
            : "Select teacher..."}
          <CaretSortIcon className="ml-2 h-4  shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="min-w-[400px] max-w-[500px] max-sm:min-w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search Teacher ..." className="h-9" />
          <CommandList>
            <CommandEmpty>No selectValues found.</CommandEmpty>

            <CommandGroup className="text-primary ">
              {TeachersDepartment.map((teacher, index) => (
                <CommandItem
                  key={index}
                  value={teacher.name.toLowerCase()}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    // setChatName(currentValue);
                    // setSessionId(uuid());

                    setOpen(false);
                  }}

                  className="hover:text-muted hover:bg-muted "
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === teacher.name.toLowerCase()
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {teacher.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
