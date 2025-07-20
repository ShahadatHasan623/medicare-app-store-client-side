import React from "react";
import {
  FaTrash,
  FaPlus,
  FaMinus,
  FaArrowLeft,
  FaTrashRestoreAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useCart } from "../../utils/CartContext";

export default function CartPage() {
  const { cart, removeItem, clearCart, updateQuantity } = useCart(); 
  const navigate = useNavigate();

  const totalItems = cart.reduce((sum, item) => sum + (item.quantity ?? 0), 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + (item.quantity ?? 0) * (item.price ?? 0),
    0
  );
  const totalDiscount = cart.reduce(
    (sum, item) =>
      sum +
      (item.quantity ?? 0) * ((item.originalPrice ?? 0) - (item.price ?? 0)),
    0
  );
  const subtotal = totalPrice;
  const tax = parseFloat((subtotal * 0.08).toFixed(2));
  const total = parseFloat((subtotal + tax).toFixed(2));

  const handleRemoveItem = (id, name) => {
    removeItem(id);
    toast.success(`${name} removed from cart!`);
  };

  const handleClearCart = () => {
    clearCart();
    toast.success("All items cleared from cart!");
  };

  const handleProceedToCheckout = () => {
    localStorage.setItem("cartData", JSON.stringify(cart));
    localStorage.setItem("cartTotal", JSON.stringify(total));
    navigate("/checkout");
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <h2 className="text-4xl font-extrabold mb-3 text-[var(--color-text)]">
          🛒 Your Cart is Empty
        </h2>
        <p className="mb-6 text-gray-500 text-lg">
          Looks like you haven't added any medicines yet.
        </p>
        <button
          onClick={() => navigate("/shop")}
          className="bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] text-white px-8 py-3 rounded-lg font-semibold transition"
        >
          🛍️ Go to Shop
        </button>
      </div>
    );
  }
  return (
    <div className="max-w-7xl mx-auto px-4 my-10">
      <h2 className="text-4xl font-extrabold mb-3 text-[var(--color-text)]">
        🛒 Shopping Cart
      </h2>
      <p className="mb-8 text-gray-500 text-lg">
        Review your selected medicines before checkout
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-5">
          {cart.map((item) => (
            <div
              key={item._id}
              className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-white rounded-xl shadow-md gap-4 border border-gray-100 hover:shadow-lg transition"
            >
              <div className="flex items-center gap-4 w-full md:w-1/2">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-contain border rounded-lg"
                />
                <div>
                  <h3 className="text-lg md:text-xl font-semibold text-[var(--color-text)]">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-500">{item.generic}</p>
                  <p className="text-xs text-gray-400">
                    {item.company} | {item.type} | {item.strength}
                  </p>
                  <span className="text-xs mt-1 inline-block bg-[var(--color-primary)] text-white px-2 py-0.5 rounded-full capitalize">
                    {item.type}
                  </span>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-end md:items-center justify-between w-full md:w-1/2">
                <div className="text-right md:text-left md:mr-6">
                  {item.originalPrice && item.originalPrice > item.price && (
                    <p className="line-through text-sm text-gray-400">
                      ${(item.originalPrice ?? 0).toFixed(2)}
                    </p>
                  )}
                  <p className="text-[var(--color-secondary)] text-lg font-bold">
                    ${(item.price ?? 0).toFixed(2)}
                  </p>
                  {item.originalPrice && (
                    <p className="text-xs text-red-500 font-medium">
                      {item.originalPrice && item.price
                        ? Math.round(
                            ((item.originalPrice - item.price) /
                              item.originalPrice) *
                              100
                          )
                        : 0}
                      % OFF
                    </p>
                  )}
                  <p className="text-sm text-gray-500 mt-2">
                    Stock: {item.stock ?? 0}
                  </p>
                  <p className="font-semibold text-slate-700">
                    Total: $
                    {((item.quantity ?? 0) * (item.price ?? 0)).toFixed(2)}
                  </p>
                </div>

                <div className="flex flex-col items-center gap-2 mt-3">
                  <span className="text-xs text-gray-500 font-medium">
                    Quantity
                  </span>
                  <div className="flex items-center border rounded overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item._id, -1)}
                      className="bg-[var(--color-primary)] text-white hover:opacity-80 px-2 py-1"
                    >
                      <FaMinus />
                    </button>
                    <span className="px-4">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, 1)}
                      className="bg-[var(--color-primary)] text-white hover:opacity-80 px-2 py-1"
                    >
                      <FaPlus />
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item._id, item.name)}
                    className="flex items-center gap-1 text-red-500 hover:bg-red-500 hover:text-white border border-red-500 rounded-full p-2 transition"
                  >
                    <FaTrash /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center pt-6 border-t">
            <button
              onClick={handleClearCart}
              className="flex items-center gap-2 bg-red-100 text-red-600 hover:bg-red-200 px-4 py-2 rounded-lg font-medium transition"
            >
              <FaTrashRestoreAlt /> Clear All
            </button>

            <a
              href="/shop"
              className="flex items-center gap-2 bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-lg font-medium transition"
            >
              <FaArrowLeft /> Continue Shopping
            </a>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow-md p-6 space-y-4 h-fit border border-gray-100">
          <h3 className="text-2xl font-bold text-[var(--color-text)] flex items-center gap-2">
            🧾 Order Summary
          </h3>
          <div className="flex justify-between text-gray-700">
            <span>Items ({totalItems})</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-green-600 font-medium">
            <span>Discount</span>
            <span>-${totalDiscount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t pt-2 text-gray-700">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax (8%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-[var(--color-text)] border-t pt-3">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <button
            onClick={handleProceedToCheckout}
            className="bg-[var(--color-primary)] hover:opacity-90 transition text-white w-full py-2 rounded-lg text-lg font-medium"
          >
            🛒 Proceed to Checkout
          </button>
          <button
            onClick={handleClearCart}
            className="bg-[var(--color-secondary)] hover:opacity-90 transition text-white w-full py-2 rounded-lg text-lg font-medium"
          >
            🗑️ Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
}
