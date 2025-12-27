import Link from "next/link";
import NavButton from "./NavButton";


const Navbar = () => {
  return (
    <nav className="bg-white  border-b-2 border-black flex flex-row items-center justify-between">
      <h1 className="text-black font-semibold text-lg ml-5">BJJ Desk</h1>
      <div>
        <Link href="/login">
        <NavButton className="bg-white text-black">Login</NavButton>
        </Link>
        <Link href="/free-trial">
        <NavButton className="bg-black text-white">Free Trial</NavButton>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
