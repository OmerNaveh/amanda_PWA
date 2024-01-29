import logo from "assets/amanda_logo.png";

const Header = () => {
  return (
    <nav className="flex flex-col items-center justify-center px-4 py-2">
      <img src={logo} alt="logo" className="h-12 w-12 text-primary" />
      <div className="text-center">
        <h1 className="text-2xl leading-6 font-bold">Amanda</h1>
        <h3 className="text-lg leading-6">Light up the Night</h3>
      </div>
    </nav>
  );
};

export default Header;
