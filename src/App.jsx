import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import RekamMedis from "./pages/RekamMedis";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import Navigation from "./components/Navigation";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import Garansi from "./pages/Garansi";

function App() {
  const cookies = new Cookies();
  const [user, setUser] = useState({});
  useEffect(() => {
    const token = cookies.get("rm-ma-token");
    if (token) {
      const decode = jwtDecode(token);
      setUser(decode.user);
    }
  }, []);

  const router = createBrowserRouter([
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      element: <ProtectedRoutes />,
      children: [
        {
          element: <Navigation user={user} />,
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
            {
              path: "/garansi",
              element: <Garansi />,
            },
          ],
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
