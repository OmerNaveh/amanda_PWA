import React from "react";
import logo from "assets/amanda_logo.png";

const Header = () => {
  return (
    <nav className="flex items-center justify-center px-4 py-2">
      <img src={logo} alt="logo" className="h-12 w-12 text-primary" />
    </nav>
  );
};

export default Header;
