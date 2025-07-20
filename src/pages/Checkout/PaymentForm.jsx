import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxioseSecure";

export default function PaymentForm({ amount, onPaymentSuccess }) {
  const axiosSecure = useAxiosSecure();
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
      // Backend এ payment intent create করার request
      const { data } = await axiosSecure.post("/create-payment-intent", {
        amount,
      });
      const clientSecret = data.clientSecret;

      const cardElement = elements.getElement(CardElement);

      // Stripe এ payment confirm করা
      const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (confirmError) {
        setError(confirmError.message);
        Swal.fire("Payment Failed", confirmError.message, "error");
      } else if (paymentIntent.status === "succeeded") {
        Swal.fire({
          icon: "success",
          title: "Payment Successful",
          text: `Payment of $${(amount / 100).toFixed(2)} completed!`,
          timer: 2500,
          showConfirmButton: false,
        });
        onPaymentSuccess(paymentIntent.id);
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Payment failed";
      setError(message);
      Swal.fire("Payment Failed", message, "error");
    } finally {
      setLoading(false);
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
      {error && <p className="text-red-600">{error}</p>}
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
