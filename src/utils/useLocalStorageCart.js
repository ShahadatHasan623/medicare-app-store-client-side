import { useState, useEffect } from "react";

const CART_KEY = "medicine_cart";

export const useLocalStorageCart = () => {
  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart]);

  // Add medicine to cart with sellerEmail check
  const addToCart = (medicine) => {
    setCart((prevCart) => {
      const exist = prevCart.find((item) => item._id === medicine._id);
      if (exist) {
        return prevCart.map((item) =>
          item._id === medicine._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [
          ...prevCart,
          {
            ...medicine,
            quantity: 1,
            sellerEmail: medicine.sellerEmail || "unknown@seller.com",
          },
        ];
      }
    });
  };

  const removeItem = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const updateQuantity = (id, delta) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  return { cart, addToCart, removeItem, clearCart, updateQuantity };
};
