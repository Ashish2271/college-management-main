"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  href: string;
  children:React.ReactNode
}
export default function DashboardLink({ href,children }: Props) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={clsx("p-2 flex gap-4    rounded-sm font-medium  ", {
        "bg-muted text-primary hover:bg-muted": pathname.includes(href),
        "hover:bg-muted/20  text-muted ": pathname !== href,
      })}
    >
      {children}
    </Link>
  );
}
