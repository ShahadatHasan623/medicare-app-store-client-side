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
import { ReTitle } from "re-title";

export default function CartPage() {
  const { cart, removeItem, clearCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  if (!cart || cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center bg-[var(--color-bg)] text-[var(--color-text)]">
        <ReTitle title="Cart" />
        <h2 className="text-5xl font-extrabold mb-4">🛒 Your cart is empty</h2>
        <p className="mb-8 text-lg max-w-md text-[var(--color-muted)]">
          Looks like you haven't added any medicines yet. Start shopping now!
        </p>
        <button
          onClick={() => navigate("/shop")}
          className="bg-[var(--color-primary)] hover:bg-emerald-600 transition text-white px-8 py-3 rounded-xl font-semibold shadow-lg"
        >
          🛍️ Go to Shop
        </button>
      </div>
    );
  }

  const totalItems = cart.reduce((sum, item) => sum + (item.quantity ?? 0), 0);
  const totalPrice = cart.reduce((sum, item) => {
    const discountAmount = (item.price * (item.discount ?? 0)) / 100;
    const discountedPrice = item.price - discountAmount;
    return sum + discountedPrice * (item.quantity ?? 0);
  }, 0);

  const totalDiscount = cart.reduce((sum, item) => {
    const discountAmount = (item.price * (item.discount ?? 0)) / 100;
    return sum + discountAmount * (item.quantity ?? 0);
  }, 0);

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

  return (
    <div className="max-w-7xl mx-auto px-6 my-12 bg-[var(--body-bg)] min-h-screen py-10 rounded-2xl shadow-xl transition-colors duration-300">
      <h2 className="text-4xl font-extrabold mb-8 text-[var(--color-primary)] tracking-wide">
        🛒 Shopping Cart
      </h2>
      <p className="mb-12 text-[var(--color-muted)] text-lg max-w-xl">
        Review your selected medicines before checkout
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {cart.map((item) => {
            const discountAmount = (item.price * (item.discount ?? 0)) / 100;
            const discountedPrice = item.price - discountAmount;
            return (
              <div
                key={item._id}
                className="flex flex-col md:flex-row md:items-center justify-between bg-[var(--color-surface)] p-6 rounded-2xl shadow-lg border border-[var(--color-border)] hover:shadow-2xl transition"
              >
                <div className="flex items-center gap-5 w-full md:w-1/2">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-28 h-28 object-contain rounded-xl border border-[var(--color-border)]"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-[var(--color-text)]">
                      {item.name}
                    </h3>
                    <p className="text-[var(--color-muted)]">{item.genericName}</p>
                    <p className="text-sm text-[var(--color-muted)] mt-1">
                      {item.company} | {item.unit}
                    </p>
                    <span className="inline-block mt-2 bg-yellow-500/20 text-yellow-500 text-xs font-semibold px-3 py-1 rounded-full capitalize">
                      {item.category}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-end md:items-center justify-between w-full md:w-1/2 mt-6 md:mt-0">
                  <div className="text-right md:text-left md:mr-8">
                    <p className="line-through text-sm text-[var(--color-muted)]">
                      ${item.price.toFixed(2)}
                    </p>
                    <p className="text-green-600 text-2xl font-bold">
                      ${discountedPrice.toFixed(2)}
                    </p>
                    <p className="text-xs text-red-500 font-semibold mt-1">
                      {item.discount}% OFF
                    </p>
                    <p className="text-sm text-[var(--color-muted)] mt-3">
                      Stock: {item.stock ?? 0}
                    </p>
                    <p className="font-semibold text-[var(--color-text)] mt-3 text-lg">
                      Total: ${(discountedPrice * (item.quantity ?? 0)).toFixed(2)}
                    </p>
                  </div>

                  <div className="flex flex-col items-center gap-3 mt-4 md:mt-0">
                    <span className="text-sm text-[var(--color-muted)] font-medium">
                      Quantity
                    </span>
                    <div className="flex items-center rounded-lg overflow-hidden border border-[var(--color-border)]">
                      <button
                        onClick={() => updateQuantity(item._id, -1)}
                        className="bg-[var(--color-primary)]/10 hover:bg-[var(--color-primary)]/20 transition px-3 py-2 text-[var(--color-primary)]"
                      >
                        <FaMinus size={18} />
                      </button>
                      <span className="px-6 py-2 bg-[var(--color-surface)] text-[var(--color-text)] font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item._id, 1)}
                        className="bg-[var(--color-primary)]/10 hover:bg-[var(--color-primary)]/20 transition px-3 py-2 text-[var(--color-primary)]"
                      >
                        <FaPlus size={18} />
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item._id, item.name)}
                      className="text-[var(--color-error)] hover:text-white hover:bg-[var(--color-error)] rounded-full p-2 transition border border-[var(--color-error)]"
                      aria-label={`Remove ${item.name} from cart`}
                      title="Remove item"
                    >
                      <FaTrash size={18} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Cart Actions */}
          {cart.length > 0 && (
            <div className="flex justify-between items-center pt-6 border-t border-[var(--color-border)]">
              <button
                onClick={handleClearCart}
                className="flex items-center gap-2 bg-red-100 text-red-600 hover:bg-red-200 px-5 py-3 rounded-lg font-semibold transition shadow-sm"
              >
                <FaTrashRestoreAlt /> Clear All
              </button>

              <button
                onClick={() => navigate("/shop")}
                className="flex items-center gap-2 bg-[var(--color-surface)] text-[var(--color-text)] hover:bg-[var(--color-border)] px-5 py-3 rounded-lg font-semibold transition shadow-sm"
              >
                <FaArrowLeft /> Continue Shopping
              </button>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="bg-[var(--color-surface)] rounded-2xl shadow-lg p-8 space-y-6 h-fit sticky top-20 border border-[var(--color-border)]">
          <h3 className="text-3xl font-extrabold text-[var(--color-text)] flex items-center gap-2">
            🧾 Order Summary
          </h3>
          <div className="flex justify-between text-[var(--color-text)] font-semibold text-lg">
            <span>Items ({totalItems})</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-green-600 font-semibold">
            <span>Discount</span>
            <span>-${totalDiscount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t border-[var(--color-border)] pt-4 text-[var(--color-text)] font-semibold text-lg">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-[var(--color-text)] font-semibold text-lg">
            <span>Tax (8%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-2xl font-extrabold text-[var(--color-primary)] border-t border-[var(--color-border)] pt-5">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <button
            onClick={handleProceedToCheckout}
            className="bg-[var(--color-primary)] hover:bg-emerald-600 transition text-white w-full py-3 rounded-xl text-xl font-semibold shadow-md"
          >
            🛒 Proceed to Checkout
          </button>
          <button
            onClick={handleClearCart}
            className="bg-[var(--color-secondary)] hover:bg-blue-600 transition text-white w-full py-3 rounded-xl text-xl font-semibold shadow-md"
          >
            🗑️ Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
}
