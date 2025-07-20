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

  const addToCart = (medicine) => {
    setCart((prev) => {
      const exist = prev.find((item) => item._id === medicine._id);
      if (exist) {
        return prev.map((item) =>
          item._id === medicine._id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }
      return [...prev, { ...medicine, quantity: 1 }];
    });
  };

  const removeItem = (id) => setCart((prev) => prev.filter((item) => item._id !== id));
  const clearCart = () => setCart([]);
  const updateQuantity = (id, delta) => {
    setCart((prev) =>
      prev.map((item) =>
        item._id === id
          ? { ...item, quantity: Math.max(1, (item.quantity || 1) + delta) }
          : item
      )
    );
  };

  return { cart, addToCart, removeItem, clearCart, updateQuantity };
};
