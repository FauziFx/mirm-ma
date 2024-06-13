import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import RekamMedis from "./pages/RekamMedis";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import Navigation from "./components/Navigation";

function App() {
  const router = createBrowserRouter([
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      element: <ProtectedRoutes />,
      children: [
        {
          element: <Navigation />,
          children: [
            {
              path: "/",
              element: <Dashboard />,
            },
            {
              path: "/dashboard",
              element: <Dashboard />,
            },
            {
              path: "/rekam-medis",
              element: <RekamMedis />,
            },
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
