"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import clsx from "clsx";
import {
  Send,
  SquareGanttChart,
  BookCheck,
  MessageCircleQuestion,
  LandPlot,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useContext } from "react";
import { ChatContext } from "@/providers/ChatProvider";

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: string; message: string }[]>(
    []
  );
  const {chatName} = useContext(ChatContext);

  return (
    <main className="h-full  flex flex-col bg-white ">
      <div className="flex-1 flex flex-col overflow-x-hidden z-8">
        <div className="flex-1 h-full  flex overflow-hidden relative ">
         
          <div 
            id="infinite-scroll"
            className="overflow-y-scroll h-full w-full bg-muted mx-4 max-sm:mx-0  mt-4 max-sm:mt-0 rounded-2xl flex flex-col items-center justify-start  "
          >
            <div className="sticky top-0 w-full px-6 max-sm:px-4 max-sm:text-sm max-sm:py-2 py-4 bg-primary text-primary-foreground text-end">
              {chatName.toLocaleUpperCase()}
            </div>
            <div
              className={clsx(
                "max-w-[800px] w-full flex flex-col p-8 max-sm:p-4 gap-12 max-sm:gap-8",
                {
                  hidden: messages.length !== 0,
                }
              )}
            >
              <h1 className="text-7xl max-md:text-6xl max-sm:text-5xl font-semibold text-primary">
                Ask your,
                <br /> Doubts{" "}
              </h1>
              <div className="flex gap-4 justify-center max-sm:flex-wrap z-10 ">
                <Card className="flex flex-col justify-between max-w-xs w-full text-primary">
                  <CardContent className="text-sm p-2">
                    When is the project submission deadline?
                  </CardContent>
                  <CardFooter className="p-2 text-right">
                    <SquareGanttChart />
                  </CardFooter>
                </Card>
                <Card className="flex flex-col justify-between max-w-xs w-full text-primary">
                  <CardContent className="text-sm p-2">
                    When will be the exams?
                  </CardContent>
                  <CardFooter className="p-2 text-right">
                    <BookCheck />
                  </CardFooter>
                </Card>
                <Card className="flex flex-col justify-between max-w-xs w-full text-primary">
                  <CardContent className="text-sm p-2">
                    How to solve this question?
                  </CardContent>
                  <CardFooter className="p-2 text-right">
                    <MessageCircleQuestion />
                  </CardFooter>
                </Card>
                <Card className="flex flex-col justify-between max-w-xs w-full text-primary">
                  <CardContent className="text-sm p-2">
                    How to apply for the placements?
                  </CardContent>
                  <CardFooter className="p-2 text-right">
                    <LandPlot />
                  </CardFooter>
                </Card>
              </div>
            </div>

            <div
              className={clsx(
                "max-w-[800px] w-full flex-1 flex flex-col p-8 gap-6 justify-end "
              )}
            >
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className="bg-primary w-fit py-1 px-4 rounded-md text-muted rounded-br-none self-end max-w-[70%] max-sm:max-w-[90%] overflow-wrap break-words text-left"
                >
                  {msg.message}
                </div>
              ))}
            </div>

            <Image
              src="/chat.svg"
              className={clsx("absolute bottom-0 right-0 opacity-60 ", {
                hidden: messages.length !== 0,
              })}
              width={800}
              height={800}
              alt="chat"
            />
          </div>
        </div>
        <div className="w-full flex justify-center p-8 max-sm:py-6 max-sm:px-4 max-md:mb-12   z-2 self-end">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const formData = new FormData(form);
              const formObject = {};
              formData.forEach((value, key) => {
                formObject[key] = value;
              });

              const message = formObject["message"];
              // console.log(message);

              setMessages((prev) => {
                return [...prev, { role: "student", message }];
              });
            }}
            className="max-w-[800px] w-full flex gap-2"
          >
            <Input
              id="message"
              name="message"
              type="text"
              placeholder="Enter a doubt"
              className="text-lg max-sm:text-base"
            />
            <Button size="icon">
              <Send />
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
