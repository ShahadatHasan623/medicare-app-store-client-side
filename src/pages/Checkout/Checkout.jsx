import React, { useState, useEffect } from "react";
import { FaUser, FaMapMarkerAlt, FaShoppingCart } from "react-icons/fa";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import Swal from "sweetalert2";
import useAxioseSecure from "../../hooks/useAxioseSecure";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function PaymentForm({ amount, onPaymentSuccess }) {
  const axioseSecure = useAxioseSecure();
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements) {
      setLoading(false);
      return;
    }

    try {
      const response = await axioseSecure.post("/create-payment-intent", {
        amount,
      });
      const clientSecret = response.data.clientSecret;

      const cardElement = elements.getElement(CardElement);
      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (paymentResult.error) {
        setError(paymentResult.error.message);
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Payment Failed",
          text: paymentResult.error.message,
        });
      } else {
        if (paymentResult.paymentIntent.status === "succeeded") {
          Swal.fire({
            icon: "success",
            title: "Payment Successful",
            text: `Your payment of $${(amount / 100).toFixed(2)} was successful!`,
            timer: 3000,
            showConfirmButton: false,
          });
          onPaymentSuccess(paymentResult.paymentIntent.id);
          setLoading(false);
        }
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Payment failed";
      setError(errorMessage);
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Payment Failed",
        text: errorMessage,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <CardElement
        options={{
          style: {
            base: {
              fontSize: "16px",
              color: "#424770",
              "::placeholder": { color: "#aab7c4" },
            },
            invalid: { color: "#9e2146" },
          },
        }}
      />
      {error && <div className="text-red-600">{error}</div>}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="btn btn-primary w-full"
      >
        {loading ? "Processing..." : `Pay $${(amount / 100).toFixed(2)}`}
      </button>
    </form>
  );
}

export default function Checkout() {
  const axioseSecure = useAxioseSecure();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
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
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
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
        buyerEmail: formData.email,
        transactionId: paymentIntentId,
        totalPrice: subtotal,
        status: "pending",
        date: new Date(),
        cartItems: cart.map((item) => ({
          medicineId: item._id,
          name: item.name,
          quantity: item.quantity,
          unitPrice: item.price,
          sellerEmail: item.sellerEmail || "unknown",
        })),
      };

      const res = await axioseSecure.post("/payments", paymentInfo);
      if (res.data.insertedId || res.data.acknowledged) {
        Swal.fire({
          icon: "success",
          title: "Order Confirmed",
          text: `Your order has been placed successfully.`,
        });
        setPaymentDone(true);
        localStorage.removeItem("cartData");
        localStorage.removeItem("cartTotal");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to save payment info", "error");
    }
  };

  if (paymentDone) {
    return (
      <div className="max-w-xl mx-auto p-6 bg-green-100 rounded">
        <h2 className="text-2xl font-bold mb-4">Thank you for your order!</h2>
        <p>Your payment of ${(subtotal).toFixed(2)} was successful.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {!showPayment ? (
        <form
          onSubmit={handleContinueToPayment}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <div className="bg-white p-6 rounded-xl shadow space-y-6">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <FaUser /> Customer Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="form-control">
                <span className="label-text">Full Name</span>
                <input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  type="text"
                  placeholder="Full Name"
                  className="input input-bordered w-full"
                  required
                />
              </label>
              <label className="form-control">
                <span className="label-text">Email Address</span>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                  placeholder="Email Address"
                  className="input input-bordered w-full"
                  required
                />
              </label>
              <label className="form-control">
                <span className="label-text">Phone Number</span>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  type="tel"
                  placeholder="Phone Number"
                  className="input input-bordered w-full"
                  required
                />
              </label>
              <label className="form-control">
                <span className="label-text">Date of Birth</span>
                <input
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  type="date"
                  className="input input-bordered w-full"
                  required
                />
              </label>
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
              <label className="form-control">
                <span className="label-text">City</span>
                <input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  type="text"
                  placeholder="City"
                  className="input input-bordered w-full"
                  required
                />
              </label>
              <label className="form-control">
                <span className="label-text">State</span>
                <input
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  type="text"
                  placeholder="State"
                  className="input input-bordered w-full"
                  required
                />
              </label>
              <label className="form-control">
                <span className="label-text">ZIP Code</span>
                <input
                  name="zip"
                  value={formData.zip}
                  onChange={handleChange}
                  type="text"
                  placeholder="ZIP Code"
                  className="input input-bordered w-full"
                  required
                />
              </label>
            </div>

            <button type="submit" className="btn btn-primary mt-6 w-full">
              Continue to Payment
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl shadow space-y-6 h-fit">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <FaShoppingCart /> Order Summary
            </h3>
            <div className="divide-y divide-gray-200">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between items-start py-4"
                >
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
          <p>
            <strong>Name:</strong> {formData.fullName}
          </p>
          <p>
            <strong>Email:</strong> {formData.email}
          </p>
          <p>
            <strong>Phone:</strong> {formData.phone}
          </p>
          <p>
            <strong>Shipping Address:</strong> {formData.address},{" "}
            {formData.city}, {formData.state} - {formData.zip}
          </p>
          <p className="mt-4 text-lg font-bold">
            Total Payment: ${subtotal.toFixed(2)}
          </p>

          <Elements stripe={stripePromise}>
            <PaymentForm
              amount={totalAmount}
              onPaymentSuccess={handlePaymentSuccess}
            />
          </Elements>
        </div>
      )}
    </div>
  );
}
