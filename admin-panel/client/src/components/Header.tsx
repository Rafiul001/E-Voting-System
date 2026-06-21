import { Link, NavLink, useNavigate } from "react-router";
import Container from "./ui/Container";
import Flex from "./ui/Flex";
import { CiLogout } from "react-icons/ci";
import { FaUser } from "react-icons/fa";
import Text from "./ui/Text";
import { fontWeight } from "./utils/utils";
import NavMenu from "./ui/NavMenu";
import { useAuthStore } from "../store/authStore";

const navItems = [
  { name: "Home", url: "/" },
  { name: "Constituency Records", url: "/constituency-records" },
  { name: "Voter Records", url: "/voter-records" },
  { name: "Election Records", url: "/election-records" },
];

const Header: React.FC = () => {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="shrink sticky top-0 bg-white shadow-md z-30">
      <Container>
        <Flex className="justify-between items-center">
          {/* Logo / Title */}
          <Link to="/">
            <Text size={3} weight={fontWeight.bold} color={"blue"}>
              Election Admin Panel
            </Text>
          </Link>

          {/* Navigation */}
          <NavMenu>
            {navItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.url}
                className={({ isActive }) =>
                  isActive
                    ? "text-indigo-600 font-semibold"
                    : "text-black hover:text-indigo-600 transition-colors"
                }
              >
                {item.name}
              </NavLink>
            ))}
          </NavMenu>

          {/* Right Actions */}
          <Flex className="gap-4 items-center">
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition-all shadow-sm"
            >
              <span className="font-medium">Logout</span>
              <CiLogout size={22} />
            </button>
            <div className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition">
              <FaUser size={22} className="text-gray-700" />
            </div>
          </Flex>
        </Flex>
      </Container>
    </header>
  );
};

export default Header;
