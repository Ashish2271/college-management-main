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

type AccountCardProps = {
  accountType: string;
  accountTypeDescription: string;
  accountTypeImage: string;
  accountSignupLink: string;
};

export default function AccountCard({
  accountType,
  accountTypeDescription,
  accountTypeImage,
  accountSignupLink,
}: AccountCardProps) {
  return (
    <Link href={accountSignupLink} >
      <Card className="w-[300px] max-md:w-[220px] border-2  hover:border-primary  hover:shadow-md hover:-translate-y-1 transition-all duration-[3000]">
        <CardHeader >
          <CardTitle className="text-xl text-primary">{accountType}</CardTitle>
          <CardDescription className="text-muted-foreground">{accountTypeDescription}</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Image
            src={accountTypeImage}
            alt="Teacher Account"
            width={260}
            height={260}

            className="max-md:w-[200px]"
          />
        </CardContent>
        {/* <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter> */}
      </Card>
    </Link>
  );
}
