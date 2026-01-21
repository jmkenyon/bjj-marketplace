"use client";

import NavButton from "@/app/(app)/components/NavButton";
import { generateTenantURL } from "@/app/lib/utils";
import { signOut } from "next-auth/react";
import Link from "next/link";

interface NavbarAdminProps {
  gymName: string;
  gymSlug: string;
}

const NavbarAdmin = ({ gymName, gymSlug }: NavbarAdminProps) => {
  return (
    <nav className="bg-white  border-b-2 border-black flex flex-row items-center justify-between">
      <Link href={`${generateTenantURL(gymSlug)}`}>
        <h1 className="text-black text-lg ml-5">{gymName}</h1>
      </Link>
      <div>
        <NavButton
          className="bg-black text-white"
          onClick={() =>
            signOut({
              callbackUrl: `${generateTenantURL(gymSlug)}`,
            })
          }
        >
          Log out
        </NavButton>
      </div>
    </nav>
  );
};

export default NavbarAdmin;
