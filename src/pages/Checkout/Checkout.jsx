import React, { useState, useEffect } from "react";
import { FaUser, FaMapMarkerAlt, FaShoppingCart } from "react-icons/fa";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Swal from "sweetalert2";
import useAxioseSecure from "../../hooks/useAxioseSecure";
import PaymentForm from "./PaymentForm";
import useAuth from "../../hooks/useAuth";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function Checkout() {
  const axiosSecure = useAxioseSecure();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: user?.email || "",  // Optional: prefill with user email
    phone: "",
    dob: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  const [cart, setCart] = useState([]);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);

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
  const totalAmount = subtotal * 100; // Stripe expects cents

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
          sellerEmail: item.sellerEmail || "unknown",
        })),
      };

      console.log("Sending paymentInfo:", paymentInfo); // ডিবাগের জন্য

      const res = await axiosSecure.post("/payments", paymentInfo);

      if (res.data.insertedId || res.data.acknowledged) {
        Swal.fire("Order Confirmed", "Your order is successfully placed!", "success");
        setPaymentDone(true);
        localStorage.removeItem("cartData");
      }
    } catch (err) {
      console.error("Payment save error:", err);
      Swal.fire("Error", "Failed to save payment info", "error");
    }
  };

  if (paymentDone) {
    return (
      <div className="max-w-xl mx-auto p-6 bg-green-100 rounded text-center">
        <h2 className="text-2xl font-bold mb-4">Thank you for your order!</h2>
        <p>Your payment of ${subtotal.toFixed(2)} was successful.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {!showPayment ? (
        <form onSubmit={handleContinueToPayment} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Customer Info Form */}
          <div className="bg-white p-6 rounded-xl shadow space-y-6">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <FaUser /> Customer Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["fullName", "email", "phone", "dob"].map((field, index) => (
                <label key={index} className="form-control">
                  <span className="label-text">
                    {field === "fullName"
                      ? "Full Name"
                      : field === "dob"
                      ? "Date of Birth"
                      : field.charAt(0).toUpperCase() + field.slice(1)}
                  </span>
                  <input
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    type={field === "dob" ? "date" : field === "email" ? "email" : "text"}
                    placeholder={field}
                    className="input input-bordered w-full"
                    required
                    disabled={field === "email"} // user email disable editing for safety
                  />
                </label>
              ))}
            </div>

            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 mt-6">
              <FaMapMarkerAlt /> Shipping Address
            </h3>
            <label className="form-control">
              <span className="label-text">Street Address</span>
              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                type="text"
                placeholder="Street Address"
                className="input input-bordered w-full"
                required
              />
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {["city", "state", "zip"].map((field, index) => (
                <label key={index} className="form-control">
                  <span className="label-text">{field.toUpperCase()}</span>
                  <input
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    type="text"
                    placeholder={field}
                    className="input input-bordered w-full"
                    required
                  />
                </label>
              ))}
            </div>

            <button type="submit" className="btn btn-primary mt-6 w-full">
              Continue to Payment
            </button>
          </div>

          {/* Order Summary */}
          <div className="bg-white p-6 rounded-xl shadow space-y-6 h-fit">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <FaShoppingCart /> Order Summary
            </h3>
            <div className="divide-y divide-gray-200">
              {cart.map((item) => (
                <div key={item._id} className="flex justify-between items-start py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-contain rounded border"
                    />
                    <div>
                      <h4 className="font-semibold text-sm">{item.name}</h4>
                      <p className="text-xs text-gray-500">
                        {item.company} • {item.strength}
                      </p>
                      <p className="text-xs">Qty: {item.quantity ?? 0}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="line-through text-xs text-gray-400">
                      ${(item.originalPrice ?? 0).toFixed(2)}
                    </p>
                    <p className="text-green-600 font-bold">
                      ${(item.price ?? 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal ({totalItems} items)</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-green-600 font-medium">
                <span>Discount</span>
                <span>-${totalDiscount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow max-w-md mx-auto">
          <h3 className="text-xl font-bold mb-4">Payment Summary</h3>
          <p><strong>Name:</strong> {formData.fullName}</p>
          <p><strong>Email:</strong> {formData.email}</p>
          <p><strong>Phone:</strong> {formData.phone}</p>
          <p>
            <strong>Shipping Address:</strong> {formData.address}, {formData.city}, {formData.state} - {formData.zip}
          </p>
          <p className="mt-4 text-lg font-bold">Total Payment: ${subtotal.toFixed(2)}</p>

          <Elements stripe={stripePromise}>
            <PaymentForm amount={totalAmount} onPaymentSuccess={handlePaymentSuccess} />
          </Elements>
        </div>
      )}
    </div>
  );
}
