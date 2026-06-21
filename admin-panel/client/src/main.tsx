import { StrictMode, type JSX } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router";
import VoterList from "./pages/VoterList.tsx";
import ElectionList from "./pages/ElectionList.tsx";
import NotFound from "./pages/NotFound.tsx";
import Home from "./pages/Home.tsx";
import Login from "./pages/Login.tsx";
import ConstituencyList from "./pages/ConstituencyList.tsx";
import EditConstituency from "./pages/EditConstituency.tsx";
import { useAuthStore } from "./store/authStore";
import ViewElection from "./pages/ViewElection.tsx";
import ViewResult from "./pages/ViewResult.tsx";

// Create a wrapper for protected routes
// eslint-disable-next-line react-refresh/only-export-components
const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { admin, token } = useAuthStore.getState();

  if (!admin || !token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Create a wrapper for login route
// eslint-disable-next-line react-refresh/only-export-components
const LoginRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { admin, token } = useAuthStore.getState();

  if (admin && token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        Component: () => (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: "voter-records",
        Component: () => (
          <ProtectedRoute>
            <VoterList />
          </ProtectedRoute>
        ),
      },
      {
        path: "constituency-records",
        Component: () => (
          <ProtectedRoute>
            <ConstituencyList />
          </ProtectedRoute>
        ),
      },
      {
        path: "constituency-records/:constituencyNumber",
        Component: () => (
          <ProtectedRoute>
            <EditConstituency />
          </ProtectedRoute>
        ),
      },
      {
        path: "election-records",
        Component: () => (
          <ProtectedRoute>
            <ElectionList />
          </ProtectedRoute>
        ),
      },
      {
        path: "election-records/:electionId",
        Component: () => (
          <ProtectedRoute>
            <ViewElection />
          </ProtectedRoute>
        ),
      },
      {
        path: "election-records/:electionId/view-result",
        Component: () => (
          <ProtectedRoute>
            <ViewResult />
          </ProtectedRoute>
        ),
      },
      {
        path: "*",
        Component: NotFound,
      },
    ],
  },
  {
    path: "/login",
    Component: () => (
      <LoginRoute>
        <Login />
      </LoginRoute>
    ),
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
