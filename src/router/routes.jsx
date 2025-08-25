import { createBrowserRouter as Router } from "react-router-dom";
import LoginForm from "../pages/Login";
import RegisterForm from "../pages/Register";
import ProfilePage from "../pages/Profile";
import EditProfilePage from "../pages/EditProfile";
import Layout from "../components/Layout";

export const Routes = Router([
  {
    path: "*",
    element: <div>Page not found</div>,
  },
  {
    path: "/",
    element: <RegisterForm />,   
  },
  {
    path: "/login",
    element: <LoginForm />,
  },
  {
    path: "/app",  
    element: <Layout />,
    children: [
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "edit-profile",
        element: <EditProfilePage />,
      },
    ],
  },
]);
