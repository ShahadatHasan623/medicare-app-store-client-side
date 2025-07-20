import React, { createContext, useContext } from "react";
import { useLocalStorageCart } from "../utils/useLocalStorageCart";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const cartHook = useLocalStorageCart();
  return (
    <CartContext.Provider value={cartHook}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
