import SigninForm from "@/components/SigninForm";
import TeacherSignupForm from "@/components/TeacherSignupForm";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function TeacherSignup() {
  return (
    <main className=" min-h-screen flex items-center justify-center  p-6 max-sm:p-2  m-auto ">
      <section className="max-w-[1400px] w-full   flex max-md:flex-col-reverse max-md:gap-12 items-center justify-center  p-6 max-sm:pt-20 rounded-2xl">
        <div className="flex-[2] flex justify-center  ">
          <Image
            src="/teachersignup.png"
            alt="Worker"
            className="rounded-2xl"
            height={600}
            width={600}
          />
        </div>

        <div className="flex-[1]  min-w-[500px] max-lg:min-w-[400px] max-sm:min-w-[352px] p-12 max-lg:p-6  rounded-2xl space-y-6">
          <div className="flex flex-col items-center gap-4 justify-center ">
            <h2 className="text-4xl max-sm:text-3xl font-semibold  text-center text-primary">
              👩‍🏫 Teacher Signup
            </h2>
          </div>
          <div className="px-4 py-12 bg-muted rounded-2xl">
            <TeacherSignupForm />
            
          </div>
          <Button asChild className="w-full">
              <Link href="/signin">Back to login</Link>
            </Button>
        </div>
      </section>
    </main>
  );
}
