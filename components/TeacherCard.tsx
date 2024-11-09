import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


type TeacherCardType = {
  id : string,
  name:string,
  
  email: string,
  department: string,

}

export default function TeacherCard({id,name ,email, department}:TeacherCardType) {
  return (
    <Link href={`/dashboard/timetable/${department}/${name}/${id}/schedule`}>
      <Card className="w-[300px] max-lg:w-[240px] max-md:w-[300px] max-sm:w-full   border-2  hover:border-primary  hover:shadow-md hover:-translate-y-1 transition-all duration-[3000] h-full flex-1">
        <CardHeader>
          <CardTitle className="text-xl text-primary max-sm:text-sm text-center"> {name}</CardTitle>
         
        </CardHeader>
        <CardContent className="flex justify-center">
          <Avatar className="w-20 h-20">
            {/* <AvatarImage src={image}    /> */}
            <AvatarFallback>{name.slice(0,2).toUpperCase()}</AvatarFallback>
          </Avatar>
          {/* <Image
            src={accountTypeImage}
            alt="Teacher Account"
            width={260}
            height={260}
            className="max-md:w-[200px]"
          /> */}
        </CardContent>
        {/* <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter> */}
      </Card>
      <h3 className="text-xl font-semibold">{name}</h3>
      <p className="text-gray-600">{email}</p>
      <p className="text-sm text-gray-500">Department: {department}</p>
    </Link>
  );
}
