import { createBrowserRouter as Router } from "react-router-dom";
import LoginForm from "../pages/auth/Login";
import RegisterForm from "../pages/auth/Register";
import ProfilePage from "../pages/auth/Profile";
import EditProfilePage from "../pages/auth/EditProfile";
import CreateRestaurant from "../pages/Restuarant/Create";
import FoodDetails from "../pages/Restuarant/FoodDetails";
import FoodList from "../pages/Restuarant/FoodList";

import CartPage from "../pages/Restuarant/CartPage";
import UpdateFood from "../pages/Restuarant/UpdateFood";
import Layout from "../components/Layout";
import ContactForm from "../pages/Restuarant/Contact";
import AboutUs from "../pages/Restuarant/About";

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
        path: "home", 
        element: <FoodList />, 
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "edit-profile",
        element: <EditProfilePage />,
      },
      {
        path: "create-food",
        element: <CreateRestaurant />,
      },
     
      {
        path: "/app/restaurant/:id",
        element: <FoodDetails />,
      },
       {
        path: "cart",
        element: <CartPage />,
      },
      {
        path: "about",
        element: <AboutUs />,
      },
      {
        path: "contact",
        element: <ContactForm />,
      },
      {
        path: "update/:id",
        element: <UpdateFood/>,
      },
    ],
  },
]);
