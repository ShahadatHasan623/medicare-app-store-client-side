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
  const axiosSecure =useAxioseSecure();
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
  const [paymentDone, setPaymentDone] = useState(false);
  console.log(cart)
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
  const totalAmount = subtotal * 100; // Stripe needs amount in cents

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
          sellerEmail: item.sellerEmail,
        })),
      };

      const res = await axiosSecure.post("/payments", paymentInfo);

      if (res.data.insertedId || res.data.acknowledged) {
        Swal.fire("Order Confirmed", "Your order is successfully placed!", "success");
        localStorage.removeItem("cartData");
        // Invoice  Navigate
        navigate(`/invoice/${res.data.insertedId}`);
      }
    } catch {
      Swal.fire("Error", "Failed to save payment info", "error");
    }
  };

  if (paymentDone) {
    return (
      <div className="max-w-xl mx-auto p-8 bg-green-50 rounded-xl text-center mt-10 shadow-md">
        <h2 className="text-3xl font-bold mb-4 text-green-700">Thank you! 🎉</h2>
        <p className="text-gray-700 text-lg">
          Your payment of <strong>${subtotal.toFixed(2)}</strong> was successful.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">
        🧾 Checkout
      </h2>

      {!showPayment ? (
        <form
          onSubmit={handleContinueToPayment}
          className="grid grid-cols-1 md:grid-cols-2 gap-10"
        >
          {/* Customer Info */}
          <div className="bg-white p-8 rounded-xl shadow-lg space-y-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <FaUser className="text-blue-600" /> Customer Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["fullName", "email", "phone", "dob"].map((field) => (
                <label key={field} className="text-sm font-medium text-gray-600">
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
                    className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 input input-bordered"
                    required
                    disabled={field === "email"}
                  />
                </label>
              ))}
            </div>

            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 mt-6">
              <FaMapMarkerAlt className="text-green-600" /> Shipping Address
            </h3>
            <label className="text-sm font-medium text-gray-600">
              Street Address
              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                type="text"
                className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 input input-bordered"
                required
              />
            </label>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {["city", "state", "zip"].map((field) => (
                <label key={field} className="text-sm font-medium text-gray-600">
                  {field.toUpperCase()}
                  <input
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    type="text"
                    className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 input input-bordered"
                    required
                  />
                </label>
              ))}
            </div>

            <button
              type="submit"
              className="btn bg-blue-600 text-white hover:bg-blue-700 w-full mt-6 py-2 rounded-lg text-lg font-semibold transition"
            >
              Continue to Payment
            </button>
          </div>

          {/* Order Summary */}
          <div className="bg-white p-8 rounded-xl shadow-lg space-y-6 h-fit border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <FaShoppingCart className="text-orange-500" /> Order Summary
            </h3>
            <div className="divide-y divide-gray-200">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between items-start py-4 hover:bg-gray-50 rounded-lg px-2"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-contain rounded border"
                    />
                    <div>
                      <h4 className="font-semibold text-sm text-gray-800">{item.name}</h4>
                      <p className="text-xs text-gray-500">
                        {item.company} • {item.strength}
                      </p>
                      <p className="text-xs text-gray-600">Qty: {item.quantity ?? 0}</p>
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
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md mx-auto">
          <h3 className="text-2xl font-bold mb-4 text-gray-800">💳 Payment Summary</h3>
          <p><strong>Name:</strong> {formData.fullName}</p>
          <p><strong>Email:</strong> {formData.email}</p>
          <p><strong>Phone:</strong> {formData.phone}</p>
          <p className="mb-4">
            <strong>Shipping Address:</strong> {formData.address}, {formData.city}, {formData.state} - {formData.zip}
          </p>
          <p className="mt-4 text-lg font-bold text-blue-600">
            Total Payment: ${subtotal.toFixed(2)}
          </p>

          <Elements stripe={stripePromise}>
            <PaymentForm amount={totalAmount} onPaymentSuccess={handlePaymentSuccess} />
          </Elements>
        </div>
      )}
    </div>
  );
}
