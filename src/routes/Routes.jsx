import { createBrowserRouter } from "react-router";
import MainLayouts from "../layouts/MainLayouts";
import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/SignUp";
import Home from "../pages/Home/Home";
import Shop from "../pages/Shop/Shop";
import Categories from "../pages/Categories/Categories";
import CategoryDetails from "../pages/CategoryDetails/CategoryDetails";
import CartPage from "../pages/CartPage/CartPage";
import Checkout from "../pages/Checkout/Checkout";
import DashboardLayouts from "../layouts/DashBoardLayouts";
import SellerRoute from "./SellerRoute";
import AdminRoute from "./AdminRoute";
import MyPaymentHistory from "../pages/dashboard/user/MyPaymentHistory";
import MyMedicines from "../pages/dashboard/seller/MyMedicines";
import PaymentHistory from "../pages/dashboard/seller/PaymentHistory";
import AskForAdvertisment from "../pages/dashboard/seller/AskForAdvertisment";
import ManageCategories from "../pages/DashBoard/Admin/ManageCategories";
import PayementManagement from "../pages/dashboard/admin/PayementManagement";
import ManageBanners from "../pages/dashboard/admin/ManageBanners";
import PrivateRoutes from "../components/PrivateRoutes";
import MangeUsers from "../pages/dashboard/admin/MangeUsers";

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
        path: "Categories",
        Component: Categories,
      },
      {
        path: "/category/:name",
        element: <CategoryDetails />,
      },
      {
        path: "cart",
        Component: CartPage,
      },
      {
        path: "checkout",
        Component: Checkout,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoutes>
        <DashboardLayouts />
      </PrivateRoutes>
    ),
    children: [
      // ✅ Admin Routes
      {
        path: "manage-users",
        element: (
          <AdminRoute>
            <MangeUsers></MangeUsers>
          </AdminRoute>
        ),
      },
      {
        path: "manage-category",
        element: (
          <AdminRoute>
            <ManageCategories />
          </AdminRoute>
        ),
      },
      {
        path: "payments",
        element: (
          <AdminRoute>
            <PayementManagement />
          </AdminRoute>
        ),
      },
      {
        path: "manage-banner",
        element: (
          <AdminRoute>
            <ManageBanners />
          </AdminRoute>
        ),
      },

      // ✅ Seller Routes
      {
        path: "my-medicines",
        element: (
          <SellerRoute>
            <MyMedicines />
          </SellerRoute>
        ),
      },
      {
        path: "payment-history",
        element: (
          <SellerRoute>
            <PaymentHistory></PaymentHistory>
          </SellerRoute>
        ),
      },
      {
        path: "advertise-request",
        element: (
          <SellerRoute>
            <AskForAdvertisment></AskForAdvertisment>
          </SellerRoute>
        ),
      },

      // ✅ User Routes
      {
        path: "user-payments",
        element: <PrivateRoutes><MyPaymentHistory></MyPaymentHistory></PrivateRoutes>,
      },
    ],
  },
]);
