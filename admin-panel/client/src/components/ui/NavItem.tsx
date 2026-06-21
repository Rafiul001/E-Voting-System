import type { PropsWithChildren } from "react";
import { NavLink } from "react-router";

const NavItem: React.FC<
  PropsWithChildren & { url: string; className?: string }
> = ({ children, url, className }) => {
  return (
    <li className={className}>
      <NavLink to={url}>{children}</NavLink>
    </li>
  );
};

export default NavItem;
