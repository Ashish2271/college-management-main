import TheaterAvailability from "@/components/TheaterAvailability";
import Image from "next/image";

interface Props {
  params: {
    theaterid: string;
  }
}

export default function TheaterInfoPage({ params }: Props) {
  return (
    <main className="p-4 max-sm:pb-20 space-y-12 max-sm:space-y-6 min-h-screen flex flex-col">
      <h1 className="text-5xl max-sm:text-4xl max-sm:text-center text-primary">
        {params.theaterid.toUpperCase()}
      </h1>

      <div className="flex max-xl:flex-col-reverse gap-6 items-center flex-1">
        <div className="flex-[2] bg-muted rounded-2xl max-xl:w-full">
          <TheaterAvailability theaterId={params.theaterid} />
        </div>
        <div className="flex-[1.5]">
          <Image
            src="/theater.jpg"
            alt="theater"
            width={600}
            height={600}
            className="rounded-2xl"
          />
        </div>
      </div>
    </main>
  )
}