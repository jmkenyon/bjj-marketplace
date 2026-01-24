"use client";

import NavButton from "@/app/(app)/components/NavButton";
import Link from "next/link";
import { signOut } from "next-auth/react";

const NavbarStudent = () => {
  return (
    <nav className="bg-white border-b-2 border-black flex items-center justify-between pl-5 h-16">
      {/* Brand */}
      <Link href="/">
        <h1 className="text-lg font-semibold text-black">
          BJJ Mat
        </h1>
      </Link>

      {/* Actions */}

        <NavButton
          className="bg-black text-white"
          onClick={() =>
            signOut({
              callbackUrl: "/",
            })
          }
        >
          Log out
        </NavButton>

    </nav>
  );
};

export default NavbarStudent;