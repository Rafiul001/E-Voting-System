import type { PropsWithChildren } from "react";

const NavMenu: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <nav className="flex flex-col lg:flex-row text-base font-medium gap-6">{children}</nav>
  );
};

export default NavMenu;
