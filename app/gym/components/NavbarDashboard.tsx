import NavButton from "@/app/components/NavButton";
import Link from "next/link";

interface NavbarDashboardProps {
  gymName: string
  gymSlug: string
}



const NavbarDashboard = ({gymName, gymSlug}: NavbarDashboardProps) => {
  return (
    <nav className="bg-white  border-b-2 border-black flex flex-row items-center justify-between">
      <h1 className="text-black font-semibold text-lg ml-5">{gymName}</h1>
      <div>
        <Link href={`/gym/${gymSlug}/student`}>
        <NavButton className="bg-white text-black">Student Login</NavButton>
        </Link>
        <Link href={`/gym/${gymSlug}/admin`}>
        <NavButton className="bg-black text-white">Admin Login</NavButton>
        </Link>
      </div>
    </nav>
  );
};

export default NavbarDashboard;
