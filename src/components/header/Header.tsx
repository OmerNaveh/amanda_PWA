import React from "react";
import { PartyPopper } from "lucide-react";

const Header = () => {
  return (
    <nav className="flex items-center justify-between px-4 py-2">
      <PartyPopper className="h-8 w-8 text-primary" />
      <h1 className="text-2xl font-bold">Amanda</h1>
    </nav>
  );
};

export default Header;
