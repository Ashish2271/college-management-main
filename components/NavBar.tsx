"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { useSession, signOut } from "next-auth/react";

export default function NavBar() {
  const { data: session, status } = useSession();

  return (
    <nav className="flex justify-between px-12 max-sm:px-6 py-1 bg-muted fixed w-full top-0 z-[99]">
      <Image src="/logo.svg" alt="Logo" width={60} height={60} />

      <ul className="flex items-center gap-4">
        {status === "authenticated" && (
          <li>
            <Link href="/dashboard/timetable" className="font-semibold text-lg text-primary max-sm:text-base max-sm:font-medium ">
              Home
            </Link>
          </li>
        )}
        {status === "unauthenticated" && (
          <li>
            <Button asChild>
              <Link href="/signin">Sign in</Link>
            </Button>
          </li>
        )}
        {status === "authenticated" && (
          <li>
            <Button asChild>
              <Link href="/signin" onClick={() => signOut()}>
                Sign out
              </Link>
            </Button>
          </li>
        )}
      </ul>
    </nav>
  );
}