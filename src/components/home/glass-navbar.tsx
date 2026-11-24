"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";


export function GlassNavbar() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <nav className="pointer-events-auto flex h-12 w-full max-w-3xl items-center justify-between rounded-full border border-border/50 bg-background/70 px-4 shadow-sm backdrop-blur-xl supports-backdrop-filter:bg-background/50">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/icon.png" alt="Oryn" width={24} height={24} className="rounded-md" />
          <span className="text-sm font-semibold">Oryn</span>
        </Link>
        <UserButton />
      </nav>
    </header>
  );
}