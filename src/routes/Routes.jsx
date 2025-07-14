import { createBrowserRouter } from "react-router";
import MainLayouts from "../layouts/MainLayouts";
import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/SignUp";
import Home from "../pages/Home/Home";
import Shop from "../pages/Shop/Shop";
import Categories from "../pages/Categories/Categories";
import CategoryDetails from "../pages/CategoryDetails/CategoryDetails";
import CartPage from "../pages/CartPage/CartPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayouts,
    children: [
      {
        index: true,
        path: "/",
        Component: Home,
      },
      {
        path: "login",
        Component: Login,
      },
      {
        path: "signup",
        Component: Signup,
      },
      {
        path:'shop',
        Component:Shop
      },
      {
        path:'Categories',
        Component:Categories
      },
      {
        path:"/category/:name",
        element:<CategoryDetails/>
      },
      {
        path:'cart',
        Component:CartPage
      }
    ],
  }
]);
