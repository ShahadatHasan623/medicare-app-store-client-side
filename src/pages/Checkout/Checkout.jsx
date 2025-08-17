import React, { useState, useEffect } from "react";
import { FaUser, FaMapMarkerAlt, FaShoppingCart } from "react-icons/fa";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Swal from "sweetalert2";
import PaymentForm from "./PaymentForm";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router";
import useAxioseSecure from "../../hooks/useAxioseSecure";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function Checkout() {
  const axiosSecure = useAxioseSecure();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: user?.email,
    phone: "",
    dob: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  const [cart, setCart] = useState([]);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem("cartData");
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  const totalItems = cart.reduce((sum, item) => sum + (item.quantity ?? 0), 0);
  const subtotal = cart.reduce(
    (sum, item) => sum + (item.quantity ?? 0) * (item.price ?? 0),
    0
  );
  const totalDiscount = cart.reduce(
    (sum, item) =>
      sum +
      (item.quantity ?? 0) * ((item.originalPrice ?? 0) - (item.price ?? 0)),
    0
  );
  const totalAmount = subtotal * 100;

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleContinueToPayment = (e) => {
    e.preventDefault();
    setShowPayment(true);
  };

  const handlePaymentSuccess = async (paymentIntentId) => {
    try {
      const paymentInfo = {
        buyerEmail: user.email.toLowerCase(),
        transactionId: paymentIntentId,
        totalPrice: subtotal,
        status: "unpaid",
        date: new Date(),
        cartItems: cart.map((item) => ({
          medicineId: item._id,
          name: item.name,
          quantity: item.quantity,
          unitPrice: item.price,
          sellerEmail: item.sellerEmail,
        })),
      };

      const res = await axiosSecure.post("/payments", paymentInfo);

      if (res.data.insertedId || res.data.acknowledged) {
        Swal.fire("Order Confirmed", "Your order is successfully placed!", "success");
        localStorage.removeItem("cartData");
        navigate(`/invoice/${res.data.insertedId}`);
      }
    } catch {
      Swal.fire("Error", "Failed to save payment info", "error");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 bg-[var(--body-bg)] text-[var(--color-text)]">
      <h2 className="text-4xl font-extrabold mb-12 text-center tracking-tight">
        🧾 Secure Checkout
      </h2>

      {!showPayment ? (
        <form
          onSubmit={handleContinueToPayment}
          className="grid grid-cols-1 lg:grid-cols-3 gap-12"
        >
          {/* Left Side */}
          <div className="lg:col-span-2 space-y-10">
            {/* Customer Info */}
            <div className="bg-[var(--color-surface)] p-8 rounded-2xl shadow-md border border-[var(--color-border)]">
              <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <FaUser className="text-[var(--color-primary)]" /> Customer Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {["fullName", "email", "phone", "dob"].map((field) => (
                  <label key={field} className="text-sm font-medium text-[var(--color-muted)]">
                    {field === "fullName"
                      ? "Full Name"
                      : field === "dob"
                      ? "Date of Birth"
                      : field.charAt(0).toUpperCase() + field.slice(1)}
                    <input
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      type={field === "dob" ? "date" : field === "email" ? "email" : "text"}
                      className="mt-2 block w-full border border-[var(--color-border)] rounded-lg px-4 py-2 text-[var(--color-text)] bg-[var(--color-bg)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                      required
                      disabled={field === "email"}
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-[var(--color-surface)] p-8 rounded-2xl shadow-md border border-[var(--color-border)]">
              <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <FaMapMarkerAlt className="text-[var(--color-secondary)]" /> Shipping Address
              </h3>
              <label className="text-sm font-medium text-[var(--color-muted)] block mb-4">
                Street Address
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  type="text"
                  className="mt-2 block w-full border border-[var(--color-border)] rounded-lg px-4 py-2 text-[var(--color-text)] bg-[var(--color-bg)] focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-[var(--color-secondary)]"
                  required
                />
              </label>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {["city", "state", "zip"].map((field) => (
                  <label key={field} className="text-sm font-medium text-[var(--color-muted)]">
                    {field.toUpperCase()}
                    <input
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      type="text"
                      className="mt-2 block w-full border border-[var(--color-border)] rounded-lg px-4 py-2 text-[var(--color-text)] bg-[var(--color-bg)] focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-[var(--color-secondary)]"
                      required
                    />
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full text-lg font-semibold py-3 px-6 rounded-xl shadow-md bg-[var(--color-primary)] text-white hover:opacity-90 transition"
            >
              Continue to Payment →
            </button>
          </div>

          {/* Right Side */}
          <div className="bg-[var(--color-surface)] p-8 rounded-2xl shadow-md border border-[var(--color-border)] h-fit sticky top-24">
            <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <FaShoppingCart className="text-orange-500" /> Order Summary
            </h3>

            <div className="divide-y divide-[var(--color-border)] mb-6">
              {cart.map((item) => (
                <div key={item._id} className="flex justify-between items-start py-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 object-contain rounded border border-[var(--color-border)]"
                    />
                    <div>
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-xs text-[var(--color-muted)]">
                        {item.company} • {item.strength}
                      </p>
                      <p className="text-xs">Qty: {item.quantity ?? 0}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="line-through text-xs text-gray-400">
                      ${(item.originalPrice ?? 0).toFixed(2)}
                    </p>
                    <p className="text-[var(--color-success)] font-bold">
                      ${(item.price ?? 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-[var(--color-border)] pt-4 space-y-3 text-base">
              <div className="flex justify-between">
                <span>Subtotal ({totalItems} items)</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[var(--color-success)] font-semibold">
                <span>Discount</span>
                <span>- ${totalDiscount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-[var(--color-border)]">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-[var(--color-surface)] p-10 rounded-2xl shadow-md max-w-lg mx-auto">
          <h3 className="text-3xl font-bold mb-6">💳 Payment Summary</h3>
          <p><strong>Name:</strong> {formData.fullName}</p>
          <p><strong>Email:</strong> {formData.email}</p>
          <p><strong>Phone:</strong> {formData.phone}</p>
          <p className="mb-4">
            <strong>Shipping Address:</strong> {formData.address}, {formData.city}, {formData.state} - {formData.zip}
          </p>
          <p className="mt-6 text-2xl font-bold text-[var(--color-primary)]">
            Total Payment: ${subtotal.toFixed(2)}
          </p>

          <div className="mt-6">
            <Elements stripe={stripePromise}>
              <PaymentForm amount={totalAmount} onPaymentSuccess={handlePaymentSuccess} />
            </Elements>
          </div>
        </div>
      )}
    </div>
  );
}
