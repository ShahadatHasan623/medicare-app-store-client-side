import React, { useState } from "react";
import useAxios from "../../../hooks/useAxios"; 

export default function NewsletterSubscription() {
  const axios = useAxios();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(""); // success / error / loading
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();

    // Simple validation
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await axios.post("/newsletter/subscribe", { email }); // ✅ useAxios handles baseURL
      if (res.data?.success) {
        setStatus("success");
        setMessage("Subscribed successfully! Check your email for offers.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(res.data?.message || "Subscription failed. Try again.");
      }
    } catch (err) {
      setStatus("error");
      setMessage(err.response?.data?.message || "Server error. Try again.");
    }
  };

  return (
    <section>
      <div className="max-w-3xl mx-auto my-20 px-5 lg:px-0 text-center">
        <h2 className="text-3xl font-bold mb-4 text-[var(--color-primary)]">
          Subscribe for Health Tips & Offers
        </h2>
        <p className="text-[var(--color-muted)] mb-8">
          Get the latest updates, health guides, and special discounts directly to your inbox.
        </p>

        <form
          onSubmit={handleSubscribe}
          className="flex flex-col sm:flex-row justify-center items-center gap-4"
        >
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full sm:w-auto px-4 py-3 rounded-lg border border-[var(--color-border)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-[var(--color-primary)] text-[var(--navbar-text)] font-semibold rounded-lg hover:bg-[var(--navbar-hover)] transition-colors duration-300"
          >
            {status === "loading" ? "Subscribing..." : "Subscribe Now"}
          </button>
        </form>

        {message && (
          <p
            className={`mt-4 font-medium ${
              status === "success"
                ? "text-green-600"
                : status === "error"
                ? "text-red-600"
                : "text-[var(--color-muted)]"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </section>
  );
}
