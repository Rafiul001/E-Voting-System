import { Link } from "react-router";
import Container from "./ui/Container";
import Flex from "./ui/Flex";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 shadow-sm">
      <Container>
        <Flex className="py-3 flex-col md:flex-row items-center justify-between text-sm text-gray-600">
          {/* Left side */}
          <p>
            © {new Date().getFullYear()} Election Admin Panel. All rights
            reserved.
          </p>

          {/* Right side */}
          <Flex className="gap-4 mt-2 md:mt-0">
            <Link
              to="/privacy-policy"
              className="hover:text-blue-600 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-blue-600 transition-colors">
              Terms of Use
            </Link>
            <Link
              to="/support"
              className="hover:text-blue-600 transition-colors"
            >
              Support
            </Link>
          </Flex>
        </Flex>
      </Container>
    </footer>
  );
};

export default Footer;
