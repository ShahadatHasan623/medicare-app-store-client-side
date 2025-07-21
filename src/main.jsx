import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { RouterProvider } from "react-router";
import { router } from "./routes/Routes.jsx";
import AuthProvider from "./context/AuthProvider.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import { CartProvider } from "./utils/CartContext.jsx";
import { ReTitleProvider } from "re-title";

const queryClient = new QueryClient();
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <ReTitleProvider defaultTitle="Medicare">
            <RouterProvider router={router}></RouterProvider>
          </ReTitleProvider>
        </CartProvider>
      </AuthProvider>
      <ToastContainer />
    </QueryClientProvider>
  </StrictMode>
);
