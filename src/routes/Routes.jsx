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
import AdminRoute from "./AdminRoute";
import ManageUsers from "../pages/dashboard/admin/MangeUsers";
import PaymentManagement from "../pages/dashboard/admin/PayementManagement";
import ManageBanners from "../pages/dashboard/admin/ManageBanners";
import SellerRoute from "./SellerRoute";
import MyMedicines from "../pages/dashboard/seller/MyMedicines";
import PaymentHistory from "../pages/dashboard/seller/PaymentHistory";
import AskForAdvertisement from "../pages/dashboard/seller/AskForAdvertisment";
import MyPaymentHistory from "../pages/dashboard/user/MyPaymentHistory";
import ManageCategories from "../pages/DashBoard/Admin/ManageCategories";
import PrivateRoutes from "../components/PrivateRoutes";
import AdminHome from "../pages/dashboard/admin/AdminHome";
import SalesReport from "../pages/DashBoard/Admin/SalesReport";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayouts />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "shop",
        element: <Shop />,
      },
      {
        path: "categories",
        element: <Categories />,
      },
      {
        path: "category/:name",
        element: <CategoryDetails />,
      },
      {
        path: "cart",
        element: <CartPage />,
      },
      {
        path: "checkout",
        element: <Checkout />,
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
        
        index:true,
        element: (
          <AdminRoute>
            <AdminHome />
          </AdminRoute>
        ),
      },
      {
        path: "manage-users",
        element: (
          <AdminRoute>
            <ManageUsers />
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
            <PaymentManagement />
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
      {
        path:"sales-report",
        element:(
          <AdminRoute>
            <SalesReport></SalesReport>
          </AdminRoute>
        )
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
            <PaymentHistory />
          </SellerRoute>
        ),
      },
      {
        path: "advertise-request",
        element: (
          <SellerRoute>
            <AskForAdvertisement />
          </SellerRoute>
        ),
      },

      // ✅ User Routes
      {
        path: "user-payments",
        element: (
          <PrivateRoutes>
            <MyPaymentHistory />
          </PrivateRoutes>
        ),
      },
    ],
  },
]);
