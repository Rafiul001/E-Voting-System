import { Outlet } from "react-router";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Flex from "./components/ui/Flex";
import { useEffect } from "react";
import { useConstituencyStore } from "./store/constituencyStore";

const App: React.FC = () => {
  const { setDivisionList } = useConstituencyStore();
  useEffect(() => {
    setDivisionList();
  }, [setDivisionList]);
  return (
    <Flex className="flex-col w-full h-screen relative">
      <Header />
      <div className="flex-auto">
        <Outlet />
      </div>
      <Footer />
    </Flex>
  );
};

export default App;
