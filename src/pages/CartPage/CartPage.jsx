import React from "react";
import {
  FaTrash,
  FaPlus,
  FaMinus,
  FaArrowLeft,
  FaTrashRestoreAlt,
} from "react-icons/fa";
import { useLocalStorageCart } from "../../utils/useLocalStorageCart";
import { useNavigate } from "react-router";

export default function CartPage() {
  const { cart, addToCart, removeItem, clearCart, updateQuantity } =
    useLocalStorageCart();

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

  const handleProceedToCheckout = () => {
    localStorage.setItem("cartData", JSON.stringify(cart));
    navigate("/checkout");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 my-10">
      <h2 className="text-4xl font-extrabold mb-3 text-slate-800">🛒 Shopping Cart</h2>
      <p className="mb-8 text-gray-500 text-lg">
        Review your selected medicines before checkout
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-5">
          {cart.length === 0 ? (
            <p className="text-gray-500 text-lg">Your cart is empty.</p>
          ) : (
            cart.map((item) => (
              <div
                key={item._id}
                className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-white rounded-2xl shadow-md gap-4 border border-gray-100"
              >
                <div className="flex items-center gap-4 w-full md:w-1/2">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-contain border rounded-lg"
                  />
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold text-slate-800">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.generic}</p>
                    <p className="text-xs text-gray-400">
                      {item.company} | {item.type} | {item.strength}
                    </p>
                    <span className="text-xs mt-1 inline-block bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full capitalize">
                      {item.type}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-end md:items-center justify-between w-full md:w-1/2">
                  <div className="text-right md:text-left md:mr-6">
                    <p className="line-through text-sm text-gray-400">
                      ${(item.originalPrice ?? 0).toFixed(2)}
                    </p>
                    <p className="text-green-600 text-lg font-bold">
                      ${(item.price ?? 0).toFixed(2)}
                    </p>
                    <p className="text-xs text-red-500 font-medium">
                      {item.originalPrice && item.price
                        ? Math.round(
                            ((item.originalPrice - item.price) / item.originalPrice) *
                              100
                          )
                        : 0}
                      % OFF
                    </p>
                    <p className="text-sm text-gray-500 mt-2">Stock: {item.stock ?? 0}</p>
                    <p className="font-semibold text-slate-700">
                      Total: ${((item.quantity ?? 0) * (item.price ?? 0)).toFixed(2)}
                    </p>
                  </div>

                  <div className="flex flex-col items-center gap-2 mt-3">
                    <span className="text-xs text-gray-500 font-medium">Quantity</span>
                    <div className="flex items-center">
                      <button
                        onClick={() => updateQuantity(item._id, -1)}
                        className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded-l text-sm"
                      >
                        <FaMinus />
                      </button>
                      <span className="px-4 border-y text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, 1)}
                        className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded-r text-sm"
                      >
                        <FaPlus />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item._id)}
                      className="text-red-500 hover:text-white hover:bg-red-500 border border-red-500 rounded-full p-2 transition"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}

          {cart.length > 0 && (
            <div className="flex justify-between items-center pt-6 border-t">
              <button
                onClick={clearCart}
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
          )}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow-md p-6 space-y-4 h-fit">
          <h3 className="text-2xl font-bold text-slate-700 flex items-center gap-2">
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
          <div className="flex justify-between text-lg font-bold text-slate-900 border-t pt-3">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <button
            onClick={handleProceedToCheckout}
            className="bg-blue-600 btn hover:bg-blue-700 transition text-white w-full py-2 rounded-lg text-lg font-medium"
          >
            🛒 Proceed to Checkout
          </button>
          <button
            onClick={clearCart}
            className="bg-red-600 hover:bg-red-700 transition text-white w-full py-2 rounded-lg text-lg font-medium"
          >
            🗑️ Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
}
