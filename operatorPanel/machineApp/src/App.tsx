import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import { ToastContainer } from "react-toastify";
import RootLayout from "./layout/RootLayout";
import NotFound from "./pages/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [{ index: true, Component: Home }],
  },
  {
    path: "login",
    Component: LoginPage,
  },
  {
    path: "*",
    Component: NotFound,
  },
]);

const App: React.FC = () => {
  return (
    <>
      <ToastContainer />
      <RouterProvider router={router} />
    </>
  );
};

export default App;
