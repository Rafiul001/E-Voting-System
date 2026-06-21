import { createBrowserRouter, RouterProvider } from "react-router";
import RootLayout from "./Layout/RootLayout";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";
import { ToastContainer } from "react-toastify";

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
    Component: NotFoundPage,
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
