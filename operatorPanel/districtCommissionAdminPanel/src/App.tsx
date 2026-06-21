import { createBrowserRouter, RouterProvider } from "react-router";
import NotFound from "./pages/NotFound";
import RootLayout from "./Layout/RootLayout";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import ManageOperator from "./pages/ManageOperator";
import ManageMachine from "./pages/ManageMachine";

const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: Home },
      {
        path: "operators",
        Component: ManageOperator,
      },
      {
        path: "machines",
        Component: ManageMachine,
      },
    ],
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
  return <RouterProvider router={router} />;
};

export default App;
