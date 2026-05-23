"use client";

import { SignOutButton } from "@clerk/nextjs";

export default function SignOutBtn() {
  return (
    <SignOutButton redirectUrl="/">
      <button className="font-dm text-sm text-white/50 hover:text-white transition-colors w-full text-left px-3 py-2">
        Cerrar sesión →
      </button>
    </SignOutButton>
  );
}