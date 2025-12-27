import NavButton from "./NavButton";


const Navbar = () => {
  return (
    <nav className="bg-white  border-b-2 border-black flex flex-row items-center justify-between">
      <h1 className="text-black font-semibold text-lg ml-5">BJJ Desk</h1>
      <div>
        <NavButton className="bg-white text-black">Login</NavButton>
        <NavButton className="bg-black text-white">Free Trial</NavButton>
      </div>
    </nav>
  );
};

export default Navbar;
