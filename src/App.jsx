import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";

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
              element: (
                <>
                  <Dashboard />
                  <Footer />
                </>
              ),
            },
            {
              path: "/dashboard",
              element: (
                <>
                  <Dashboard />
                  <Footer />
                </>
              ),
            },
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
