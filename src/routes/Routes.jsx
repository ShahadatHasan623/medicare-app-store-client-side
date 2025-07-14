import { createBrowserRouter } from "react-router";
import MainLayouts from "../layouts/MainLayouts";
import Home from "../pages/Home/Home";
import DashBoard from "../layouts/DashBoard";
import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/SignUp";
import Shop from "../pages/Shop/Shop";
import ManageUsers from "../pages/DashBoard/Admin/ManageUsers";
import ManageMedicines from "../pages/DashBoard/Seller/ManageMedicines";
import MyOrder from "../pages/DashBoard/user/MyOrder";
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
        path: "shop",
        Component: Shop,
      },
      {
        path:'cart',
        Component:CartPage
      }
    ],
  },
  {
    path: "/dashboard",
    Component: DashBoard,
    children: [
      { path: "admin/users", element: <ManageUsers /> },
      { path: "seller/medicines", element: <ManageMedicines /> },
      { path: "user/orders", element: <MyOrder /> },
    ],
  },
]);
