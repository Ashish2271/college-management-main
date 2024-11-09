import SigninForm from "@/components/SigninForm";
import { Button } from "@/components/ui/button";

import Image from "next/image";
import Link from "next/link";

export default function SignIn() {
  return (
    <main className=" min-h-screen flex items-center justify-center  p-6 max-lg:p-2  m-auto ">
      <section className="max-w-[1400px] w-full   flex max-md:flex-col-reverse max-md:gap-12 items-center justify-center  p-6 max-sm:pt-20  max-lg:p-2 rounded-2xl">
        <div className="flex-[2]  flex justify-center  ">
          <Image
            src="/homeIllustration.png"
            alt="Worker"
            className="rounded-2xl "
            height={1200}
            width={1200}

            
          />
        </div>

        <div className="flex-[1]  min-w-[500px] max-lg:min-w-[340px] max-sm:min-w-[352px] p-12 max-lg:p-6  rounded-2xl space-y-6">
          <div className="flex flex-col items-center gap-4 justify-center ">
            <h2 className="text-4xl max-sm:text-3xl font-semibold  text-center text-primary">
              🔐 Login
            </h2>
          </div>
          <div className="px-4  py-12 bg-muted rounded-2xl">
            <SigninForm />
          </div>
          <Button asChild className="w-full">
            <Link href="/signup">
            Sign up
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
