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

type DepartmentCardType = {
  name:string,
  code:string,

}

export default function DepartmentCard({name,code}:DepartmentCardType) {
  return (
    <Link href={`/dashboard/timetable/${code}`}>
      <Card className="w-[300px] max-lg:w-[240px] max-md:w-[300px] max-sm:w-full  border-2  hover:border-primary  hover:shadow-md hover:-translate-y-1 transition-all duration-[3000]  flex-1 text-wrap break-words min-h-40 h-full  ">
        <CardHeader  >
          <CardTitle className="text-xl"> <Badge>{code}</Badge></CardTitle>
          <CardDescription className="text-xl font-semibold text-primary ">
          {name}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center ">
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
    </Link>
  );
}
