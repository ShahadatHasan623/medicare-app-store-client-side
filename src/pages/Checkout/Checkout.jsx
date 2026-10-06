import React, { useState, useEffect } from "react";
import {
  FaUser, FaMapMarkerAlt, FaShoppingCart, FaPhoneAlt,
  FaCalendarAlt, FaArrowRight, FaCreditCard, FaLock,
  FaCheck, FaShieldAlt, FaBoxOpen, FaTag, FaArrowLeft, FaTruck,
} from "react-icons/fa";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Swal from "sweetalert2";
import PaymentForm from "./PaymentForm";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router";
import useAxioseSecure from "../../hooks/useAxioseSecure";
import { ReTitle } from "re-title";
import { useTranslation } from "react-i18next";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function Checkout() {
  const axiosSecure = useAxioseSecure();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

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

  const subtotal = cart.reduce((sum, item) => sum + (item.quantity ?? 0) * (item.price ?? 0), 0);

  /* 🏷️ Discount — originalPrice thakle seta, na thakle discount % theke */
  const totalDiscount = cart.reduce((sum, item) => {
    if (item.originalPrice)
      return sum + (item.quantity ?? 0) * ((item.originalPrice ?? 0) - (item.price ?? 0));
    if (item.discount)
      return sum + (item.quantity ?? 0) * ((item.price ?? 0) * (item.discount ?? 0)) / 100;
    return sum;
  }, 0);

  const totalAmount = subtotal * 100;

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleContinueToPayment = (e) => {
    e.preventDefault();
    setShowPayment(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
        Swal.fire({
          icon: "success",
          title: t("orderConfirmed"),
          confirmButtonColor: "#10b981",
          timer: 2000,
          timerProgressBar: true,
          background: document.documentElement.classList.contains("dark") ? "#1f2937" : "#fff",
          color: document.documentElement.classList.contains("dark") ? "#fff" : "#000",
        });
        localStorage.removeItem("cartData");
        navigate(`/invoice/${res.data.insertedId}`);
      }
    } catch {
      Swal.fire("Error", t("paymentFailed"), "error");
    }
  };

  /* 🎨 Shared input class */
  const inputCls =
    "w-full rounded-xl border-2 border-[var(--color-border)] bg-[var(--color-surface)] py-3 pl-11 pr-4 text-sm font-medium text-[var(--color-text)] outline-none transition-all duration-300 placeholder:text-gray-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-900/40";

  const plainInputCls =
    "w-full rounded-xl border-2 border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm font-medium text-[var(--color-text)] outline-none transition-all duration-300 placeholder:text-gray-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-900/40";

  /* 🚫 Empty cart guard */
  if (!cart || cart.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-bg)] px-4 text-center">
        <ReTitle title={t("checkoutDocTitle")} />
        <span className="mb-6 grid h-24 w-24 place-items-center rounded-[28px] bg-gradient-to-br from-emerald-400/40 to-cyan-400/40 p-[2px] shadow-xl">
          <span className="grid h-full w-full place-items-center rounded-[26px] bg-[var(--color-surface)]">
            <FaShoppingCart className="text-4xl text-emerald-500" />
          </span>
        </span>
        <h2 className="text-2xl font-black text-[var(--color-text)]">{t("emptyTitle")}</h2>
        <button
          onClick={() => navigate("/shop")}
          className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 transition hover:shadow-emerald-500/50 active:scale-95"
        >
          {t("goToShop")} <FaArrowRight className="text-xs" />
        </button>
      </div>
    );
  }

  /* 📍 Step indicator data */
  const steps = [
    { id: 1, label: t("stepShipping"), icon: <FaMapMarkerAlt /> },
    { id: 2, label: t("stepPayment"), icon: <FaCreditCard /> },
  ];

  return (
    <>
      <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up { animation: fade-up .5s cubic-bezier(.16,1,.3,1) both; }
      `}</style>

      <div className="min-h-screen bg-[var(--color-bg)] px-4 py-10 transition-colors duration-300 sm:px-6 md:px-8">
        <div className="mx-auto max-w-7xl">
          <ReTitle title={t("checkoutDocTitle")} />

          {/* ================= 📝 Header ================= */}
          <div className="animate-fade-up mb-8 text-center">
            <h2 className="flex flex-wrap items-center justify-center gap-3 text-2xl font-black text-[var(--color-text)] sm:text-3xl md:text-4xl">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30">
                <FaLock className="text-xl" />
              </span>
              {t("secureCheckout")}
            </h2>
            <p className="mt-3 text-sm text-[var(--color-muted)] sm:text-base">
              {t("checkoutSubtitle")}
            </p>
          </div>

          {/* ================= 📍 Step Indicator ================= */}
          <div className="animate-fade-up mx-auto mb-10 flex max-w-md items-center">
            {steps.map((step, i) => {
              const active = showPayment ? step.id === 2 : step.id === 1;
              const done = showPayment && step.id === 1;
              return (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center gap-1.5">
                    <span
                      className={`grid h-11 w-11 place-items-center rounded-full text-sm font-bold transition-all duration-500 ${
                        done
                          ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/40"
                          : active
                          ? "bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/40 ring-4 ring-emerald-500/20"
                          : "bg-[var(--color-surface)] text-[var(--color-muted)] ring-1 ring-[var(--color-border)]"
                      }`}
                    >
                      {done ? <FaCheck /> : step.icon}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider sm:text-xs ${
                        active || done ? "text-emerald-600" : "text-[var(--color-muted)]"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="relative mx-3 mb-5 h-[3px] flex-1 overflow-hidden rounded-full bg-[var(--color-border)]">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-700 ${
                          showPayment ? "w-full" : "w-0"
                        }`}
                      />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {!showPayment ? (
            /* ================= 📦 Step 1: Form ================= */
            <form
              onSubmit={handleContinueToPayment}
              className="animate-fade-up grid grid-cols-1 gap-8 lg:grid-cols-12"
            >
              {/* Left: Form cards */}
              <div className="space-y-6 lg:col-span-8">
                {/* 👤 Personal Details */}
                <div className="overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg shadow-black/5">
                  <div className="flex items-center gap-2.5 bg-gradient-to-r from-emerald-500/10 to-transparent px-6 py-4">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-500/15 text-emerald-600">
                      <FaUser />
                    </span>
                    <h3 className="text-lg font-black text-[var(--color-text)]">
                      {t("personalDetails")}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
                    {/* Full Name */}
                    <label className="block space-y-1.5">
                      <span className="ml-1 text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">
                        {t("fullName")} *
                      </span>
                      <div className="relative">
                        <FaUser className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          placeholder={t("namePlaceholder")}
                          className={inputCls}
                          required
                        />
                      </div>
                    </label>

                    {/* Email — fixed */}
                    <label className="block space-y-1.5">
                      <span className="ml-1 text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">
                        {t("emailFixed")}
                      </span>
                      <input
                        value={formData.email}
                        disabled
                        className="w-full cursor-not-allowed rounded-xl border-2 border-dashed border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3 text-sm font-medium text-[var(--color-muted)]"
                      />
                    </label>

                    {/* Phone */}
                    <label className="block space-y-1.5">
                      <span className="ml-1 text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">
                        {t("phoneLabel")} *
                      </span>
                      <div className="relative">
                        <FaPhoneAlt className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+880 1XXX-XXXXXX"
                          className={inputCls}
                          required
                        />
                      </div>
                    </label>

                    {/* DOB */}
                    <label className="block space-y-1.5">
                      <span className="ml-1 text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">
                        {t("birthDate")} *
                      </span>
                      <div className="relative">
                        <FaCalendarAlt className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          name="dob"
                          type="date"
                          value={formData.dob}
                          onChange={handleChange}
                          className={inputCls}
                          required
                        />
                      </div>
                    </label>
                  </div>
                </div>

                {/* 📍 Shipping Address */}
                <div className="overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg shadow-black/5">
                  <div className="flex items-center gap-2.5 bg-gradient-to-r from-cyan-500/10 to-transparent px-6 py-4">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-cyan-500/15 text-cyan-600">
                      <FaMapMarkerAlt />
                    </span>
                    <h3 className="text-lg font-black text-[var(--color-text)]">
                      {t("shippingAddress")}
                    </h3>
                  </div>

                  <div className="space-y-5 p-6">
                    <div className="relative">
                      <FaMapMarkerAlt className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder={t("streetAddress")}
                        className={inputCls}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <input
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder={t("cityLabel")}
                        className={plainInputCls}
                        required
                      />
                      <input
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder={t("stateLabel")}
                        className={plainInputCls}
                        required
                      />
                      <input
                        name="zip"
                        value={formData.zip}
                        onChange={handleChange}
                        placeholder={t("zipLabel")}
                        className={plainInputCls}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="group flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 py-4 text-lg font-bold text-white shadow-xl shadow-emerald-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/40 active:scale-[0.98]"
                >
                  <FaCreditCard />
                  {t("goToPayment")}
                  <FaArrowRight className="text-sm opacity-70 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>

              {/* Right: Summary */}
              <div className="lg:col-span-4">
                <div className="overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl shadow-emerald-900/10 lg:sticky lg:top-24">
                  {/* Gradient header */}
                  <div className="flex items-center gap-2.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-6 py-4">
                    <FaShoppingCart className="text-white" />
                    <h3 className="text-base font-black tracking-wide text-white sm:text-lg">
                      {t("cartSummary")}
                    </h3>
                    <span className="ml-auto rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-bold text-white">
                      {cart.length}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="custom-scrollbar max-h-60 space-y-4 overflow-y-auto p-5">
                    {cart.map((item) => (
                      <div key={item._id} className="flex items-center gap-3">
                        <div className="shrink-0 rounded-xl bg-gradient-to-tr from-emerald-400/40 to-cyan-400/40 p-[2px]">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-12 w-12 rounded-[10px] bg-white object-contain p-1"
                            loading="lazy"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="truncate text-sm font-bold text-[var(--color-text)]">
                            {item.name}
                          </h4>
                          <div className="mt-0.5 flex justify-between text-xs">
                            <span className="text-[var(--color-muted)]">
                              {t("qty")}: {item.quantity}
                            </span>
                            <span className="font-bold text-emerald-600">
                              ৳{(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="space-y-3 border-t border-dashed border-[var(--color-border)] p-5">
                    <div className="flex justify-between text-sm font-semibold text-[var(--color-muted)]">
                      <span>{t("subtotal")}</span>
                      <span className="tabular-nums">৳{subtotal.toFixed(2)}</span>
                    </div>
                    {totalDiscount > 0 && (
                      <div className="flex justify-between text-sm font-semibold text-emerald-600">
                        <span className="flex items-center gap-1.5">
                          <FaTag className="text-xs" /> {t("discount")}
                        </span>
                        <span className="tabular-nums">- ৳{totalDiscount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-3">
                      <span className="text-base font-black uppercase tracking-wide text-[var(--color-text)]">
                        {t("total")}
                      </span>
                      <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-2xl font-black tabular-nums text-transparent">
                        ৳{subtotal.toFixed(2)}
                      </span>
                    </div>

                    {/* 🚚 Free delivery progress */}
                    <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 px-3 py-2.5 text-[11px] font-bold text-emerald-600 ring-1 ring-emerald-500/20">
                      <FaTruck className="animate-pulse" />
                      {t("freeDeliveryNote")}
                    </div>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            /* ================= 💳 Step 2: Payment ================= */
            <div className="animate-fade-up mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
              {/* Review card */}
              <div className="overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg shadow-black/5">
                <div className="flex items-center gap-2.5 border-b border-[var(--color-border)] bg-gradient-to-r from-emerald-500/10 to-transparent px-6 py-4">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-500/15 text-emerald-600">
                    <FaMapMarkerAlt />
                  </span>
                  <h3 className="text-lg font-black text-[var(--color-text)]">
                    {t("reviewInfo")}
                  </h3>
                </div>

                <div className="p-6">
                  <div className="space-y-2.5 rounded-2xl bg-[var(--color-bg)] p-5 ring-1 ring-[var(--color-border)]">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-muted)]">
                      {t("shippingTo")}
                    </p>
                    <p className="text-base font-black text-[var(--color-text)]">
                      {formData.fullName}
                    </p>
                    <p className="text-sm text-[var(--color-muted)]">
                      {formData.address}, {formData.city}
                    </p>
                    <p className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
                      <FaPhoneAlt className="text-xs text-emerald-500" />
                      {formData.phone}
                    </p>

                    <div className="mt-4 flex items-center justify-between border-t border-dashed border-[var(--color-border)] pt-4">
                      <span className="text-base font-black text-[var(--color-text)]">
                        {t("total")}
                      </span>
                      <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-2xl font-black tabular-nums text-transparent">
                        ৳{subtotal.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowPayment(false)}
                    className="group mt-4 inline-flex items-center gap-2 text-sm font-bold text-emerald-600 transition hover:text-emerald-700"
                  >
                    <FaArrowLeft className="text-xs transition-transform duration-300 group-hover:-translate-x-1" />
                    {t("changeAddress")}
                  </button>
                </div>
              </div>

              {/* Stripe payment card */}
              <div className="rounded-3xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 p-[2px] shadow-2xl shadow-emerald-500/25">
                <div className="rounded-[22px] bg-[var(--color-surface)] p-6 sm:p-8">
                  <h3 className="mb-6 flex items-center gap-2.5 text-lg font-black text-[var(--color-text)]">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-500/15 text-emerald-600">
                      <FaCreditCard />
                    </span>
                    {t("securePayment")}
                  </h3>

                  <div className="mb-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
                    <Elements stripe={stripePromise}>
                      <PaymentForm
                        amount={totalAmount}
                        onPaymentSuccess={handlePaymentSuccess}
                      />
                    </Elements>
                  </div>

                  <p className="flex items-center justify-center gap-1.5 text-center text-[10px] font-bold uppercase tracking-widest text-[var(--color-muted)]">
                    <FaShieldAlt className="text-emerald-500" />
                    {t("encryptedBy")}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}