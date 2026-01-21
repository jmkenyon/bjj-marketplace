import { authOptions } from "@/app/api/(auth)/auth/[...nextauth]/route";
import NavButton from "@/app/(app)/components/NavButton";
import { generateTenantURL } from "@/app/lib/utils";
import { getServerSession } from "next-auth";
import Link from "next/link";

interface NavbarDashboardProps {
  gymName: string;
  gymSlug: string;
}

const NavbarDashboard = async ({ gymName, gymSlug }: NavbarDashboardProps) => {
  const session = await getServerSession(authOptions);

  const isLoggedIn = !!session;
  const role = session?.user.role;
  const gymSlugLoggedIn = session?.user.gymSlug; // only required for ADMIN

  let dashboardHref: string | null = null;

  if (isLoggedIn) {
    if (role === "ADMIN" && gymSlugLoggedIn) {
      dashboardHref = `${generateTenantURL(gymSlugLoggedIn)}/admin/dashboard`;
    }

    if (role === "VISITOR") {
      dashboardHref = `/student/dashboard`;
    }
  }
  return (
    <nav className="bg-white  border-b-2 border-black flex flex-row items-center justify-between">
      <Link href={`${generateTenantURL(gymSlug)}`}>
        <h1 className="text-black font-semibold sm:text-lg text-base ml-5">
          {gymName}
        </h1>
      </Link>
      <div className="flex">
        {dashboardHref ? (
          <Link href={dashboardHref}>
            <NavButton className="bg-black text-white">Dashboard</NavButton>
          </Link>
        ) : (
          <>
            <Link href={`${generateTenantURL(gymSlug)}/student`}>
              <NavButton className="bg-white text-neutral-900 hover:bg-neutral-100 hover:text-neutral-900">
                <span className="hidden sm:inline">Student login</span>
                <span className="sm:hidden">Student</span>
              </NavButton>
            </Link>

            <Link href={`${generateTenantURL(gymSlug)}/admin`}>
              <NavButton className="bg-black text-white hover:bg-neutral-800">
                <span className="hidden sm:inline">Admin login</span>
                <span className="sm:hidden">Admin</span>
              </NavButton>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavbarDashboard;
