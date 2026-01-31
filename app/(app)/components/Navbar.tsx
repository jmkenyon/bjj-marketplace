import Link from "next/link";
import NavButton from "./NavButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/(auth)/auth/[...nextauth]/route";
import { generateTenantURL } from "@/app/lib/utils";

const Navbar = async () => {
  const session = await getServerSession(authOptions);

  const isLoggedIn = !!session;
  const role = session?.user.role;
  const gymSlug = session?.user.gymSlug; // only required for ADMIN



  let dashboardHref: string | null = null;

  if (isLoggedIn) {
    if (role === "ADMIN" && gymSlug) {
      dashboardHref = `${generateTenantURL(gymSlug)}/admin/dashboard/information`;
    }

    if (role === "VISITOR") {
      dashboardHref = `/student/dashboard`;
    }
  }

  return (
    <nav className="bg-white border-b border-black flex items-center justify-between pl-6 sm:pl-20">
      {/* Brand */}
      <Link href="/" className="text-base font-semibold sm:text-lg">
        BJJ Mat
      </Link>

      {/* Explore */}
      <div className="hidden md:flex">
        <Link
          href="/explore"
          className="rounded-full border border-black px-5 py-2 text-sm font-medium transition hover:bg-black hover:text-white"
        >
          Explore gyms
        </Link>
      </div>

      {/* Actions */}
      <div className="flex items-center ">
        {dashboardHref ? (
          <Link href={dashboardHref}>
            <NavButton className="bg-black text-white">
              Dashboard
            </NavButton>
          </Link>
        ) : (
          <>
            <Link href={`${process.env.NEXT_PUBLIC_APP_URL}/login`}>
              <NavButton className="bg-white text-black">
                Login
              </NavButton>
            </Link>

            <Link href="/list-your-gym">
              <NavButton className="bg-black text-white">
                List your gym
              </NavButton>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;