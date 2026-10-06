import React from "react";
import {
  FaTrash, FaPlus, FaMinus, FaArrowLeft, FaTrashRestoreAlt,
  FaShoppingCart, FaShoppingBag, FaTag, FaReceipt, FaLock,
  FaTruck, FaUndo, FaChevronRight, FaBoxOpen, FaPills, FaIndustry,
} from "react-icons/fa";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useCart } from "../../utils/CartContext";
import { ReTitle } from "re-title";
import { useTranslation } from "react-i18next";

export default function CartPage() {
  const { cart, removeItem, clearCart, updateQuantity } = useCart();
  const navigate = useNavigate();
  const { t } = useTranslation();

  /* 🛒 Empty state — animated + responsive */
  if (!cart || cart.length === 0) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[var(--color-bg)] px-4 py-10 text-center">
        <ReTitle title={t("docTitle")} />

        {/* Background blobs */}
        <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-emerald-300/20 blur-3xl sm:h-80 sm:w-80" />
        <div className="pointer-events-none absolute -bottom-24 -right-20 h-72 w-72 rounded-full bg-teal-300/20 blur-3xl sm:h-96 sm:w-96" />

        <style>{`
          @keyframes cart-float {
            0%, 100% { transform: translateY(0) rotate(-3deg); }
            50%      { transform: translateY(-14px) rotate(3deg); }
          }
          @keyframes fade-up {
            from { opacity: 0; transform: translateY(20px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .animate-cart-float { animation: cart-float 4s ease-in-out infinite; }
          .animate-fade-up    { animation: fade-up .6s cubic-bezier(.16,1,.3,1) both; }
        `}</style>

        {/* Floating cart icon */}
        <div className="animate-cart-float relative mb-6 grid h-24 w-24 place-items-center rounded-[28px] bg-gradient-to-br from-emerald-400/40 via-teal-400/20 to-cyan-400/40 p-[2px] shadow-2xl shadow-emerald-500/20 sm:mb-8 sm:h-32 sm:w-32 sm:rounded-[36px]">
          <div className="grid h-full w-full place-items-center rounded-[26px] bg-[var(--color-surface)] sm:rounded-[34px]">
            <FaShoppingCart className="text-4xl text-emerald-500 sm:text-5xl" />
          </div>
          <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center sm:h-7 sm:w-7">
            <span className="absolute h-full w-full animate-ping rounded-full bg-rose-400 opacity-60" />
            <span className="relative grid h-full w-full place-items-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-4 ring-[var(--color-bg)] sm:text-xs">
              0
            </span>
          </span>
        </div>

        <div className="animate-fade-up">
          <h2 className="text-2xl font-black text-[var(--color-text)] sm:text-3xl md:text-4xl">
            {t("emptyTitle")}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-[var(--color-muted)] sm:text-base">
            {t("emptyText")}
          </p>
          <button
            onClick={() => navigate("/shop")}
            className="group mt-7 inline-flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-emerald-500/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-emerald-500/50 active:scale-95 sm:mt-8 sm:w-auto sm:text-base"
          >
            <FaShoppingBag className="transition-transform duration-300 group-hover:-translate-y-0.5" />
            {t("goToShop")}
            <FaChevronRight className="text-xs opacity-70 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    );
  }

  /* 🧮 Price calculations */
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
    toast.success(t("removedFromCart", { name }));
  };

  const handleClearCart = () => {
    clearCart();
    toast.success(t("clearedCart"));
  };

  const handleProceedToCheckout = () => {
    localStorage.setItem("cartData", JSON.stringify(cart));
    localStorage.setItem("cartTotal", JSON.stringify(total));
    navigate("/checkout");
  };

  const trustBadges = [
    { icon: <FaLock />, label: t("secureCheckout"), color: "text-emerald-500 bg-emerald-500/10" },
    { icon: <FaTruck />, label: t("fastDelivery"), color: "text-cyan-500 bg-cyan-500/10" },
    { icon: <FaUndo />, label: t("easyReturns"), color: "text-teal-500 bg-teal-500/10" },
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

      <div className="mx-auto min-h-screen max-w-7xl bg-[var(--body-bg)] px-3 pb-32 pt-8 sm:px-6 sm:pb-10 sm:pt-10">
        <ReTitle title={t("docTitle")} />

        {/* 📝 Header */}
        <div className="animate-fade-up mb-8 flex flex-wrap items-center justify-between gap-3 sm:items-end sm:gap-4 sm:mb-10">
          <div className="min-w-0">
            <h2 className="flex items-center gap-2.5 text-2xl font-black tracking-tight text-[var(--color-text)] sm:gap-3 sm:text-3xl md:text-4xl">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30 sm:h-12 sm:w-12 sm:rounded-2xl">
                <FaShoppingCart className="text-base sm:text-xl" />
              </span>
              <span className="truncate">{t("title")}</span>
            </h2>
            <p className="mt-2 max-w-xl text-sm text-[var(--color-muted)] sm:text-base">
              {t("subtitle")}
            </p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-emerald-500/10 px-3.5 py-2 text-xs font-bold text-emerald-600 ring-1 ring-emerald-500/25 sm:px-4 sm:text-sm">
            <FaBoxOpen className="text-sm" />
            {t("items", { count: totalItems })}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          {/* ================= Cart Items ================= */}
          <div className="space-y-4 sm:space-y-5 lg:col-span-2">
            {cart.map((item, index) => {
              const discountAmount = (item.price * (item.discount ?? 0)) / 100;
              const discountedPrice = item.price - discountAmount;
              return (
                <div
                  key={item._id}
                  className="animate-fade-up group relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-lg shadow-black/5 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-900/10 sm:rounded-3xl sm:p-5 md:p-6"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  {/* Left accent */}
                  <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-emerald-400 to-cyan-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between md:gap-5">
                    {/* 🖼️ Product info */}
                    <div className="flex w-full items-start gap-3 sm:items-center sm:gap-4 md:w-1/2">
                      <div className="shrink-0 rounded-2xl bg-gradient-to-tr from-emerald-400/60 to-cyan-400/60 p-[2px] shadow-md">
                        <div className="h-20 w-20 overflow-hidden rounded-[12px] bg-white sm:h-24 sm:w-24 sm:rounded-[14px] lg:h-28 lg:w-28">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
                            loading="lazy"
                          />
                        </div>
                      </div>

                      <div className="min-w-0">
                        <h3 className="line-clamp-2 text-base font-bold leading-snug text-[var(--color-text)] sm:truncate sm:text-lg lg:text-xl">
                          {item.name}
                        </h3>
                        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-[var(--color-muted)] sm:text-sm">
                          <FaPills className="shrink-0 text-xs text-emerald-500" />
                          <span className="truncate">{item.genericName}</span>
                        </p>
                        <p className="mt-1 flex items-center gap-1.5 text-[11px] text-[var(--color-muted)] sm:text-xs">
                          <FaIndustry className="shrink-0 text-[10px]" />
                          <span className="truncate">{item.company} · {item.unit}</span>
                        </p>
                        <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-yellow-500/15 px-2.5 py-1 text-[10px] font-bold capitalize text-yellow-600 ring-1 ring-yellow-500/25 sm:text-[11px]">
                          <FaTag className="text-[9px]" />
                          {item.category}
                        </span>
                      </div>
                    </div>

                    {/* 💰 Price + controls */}
                    <div className="flex w-full flex-col gap-4 md:w-1/2 md:flex-row md:items-center md:justify-between">
                      <div className="md:mr-4 lg:mr-6">
                        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                          <span className="text-xl font-black text-emerald-600 sm:text-2xl">
                            ${discountedPrice.toFixed(2)}
                          </span>
                          <span className="text-xs text-[var(--color-muted)] line-through sm:text-sm">
                            ${item.price.toFixed(2)}
                          </span>
                          {item.discount > 0 && (
                            <span className="rounded-md bg-rose-500/15 px-1.5 py-0.5 text-[10px] font-black text-rose-500">
                              {item.discount}% {t("off")}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-[var(--color-muted)] sm:text-[11px]">
                          {t("perUnit")}
                        </p>

                        <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                          <span className="inline-flex shrink-0 items-center rounded-full bg-slate-500/10 px-2.5 py-1 text-[10px] font-semibold text-[var(--color-muted)] sm:text-[11px]">
                            {t("stock")}: {item.stock ?? 0}
                          </span>
                          <span className="text-base font-bold text-[var(--color-text)] sm:text-lg">
                            {t("itemTotal")}: ${(discountedPrice * (item.quantity ?? 0)).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* 🔢 Stepper + remove */}
                      <div className="flex w-full items-center justify-between gap-3 sm:w-auto sm:justify-end md:w-auto md:flex-col md:items-center md:justify-start">
                        <div className="flex items-center overflow-hidden rounded-full border-2 border-[var(--color-border)] bg-[var(--color-surface)] transition-colors duration-300 focus-within:border-emerald-400">
                          <button
                            onClick={() => updateQuantity(item._id, -1)}
                            className="px-4 py-3 text-emerald-600 transition hover:bg-emerald-500 hover:text-white active:scale-90 sm:px-3.5 sm:py-2.5"
                            aria-label="Decrease quantity"
                          >
                            <FaMinus size={14} />
                          </button>
                          <span className="w-10 py-3 text-center font-bold tabular-nums text-[var(--color-text)] sm:w-11 sm:py-2.5">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item._id, 1)}
                            className="px-4 py-3 text-emerald-600 transition hover:bg-emerald-500 hover:text-white active:scale-90 sm:px-3.5 sm:py-2.5"
                            aria-label="Increase quantity"
                          >
                            <FaPlus size={14} />
                          </button>
                        </div>

                        <button
                          onClick={() => handleRemoveItem(item._id, item.name)}
                          className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-[var(--color-error)] text-[var(--color-error)] transition-all duration-300 hover:scale-110 hover:bg-[var(--color-error)] hover:text-white active:scale-95 sm:h-10 sm:w-10"
                          aria-label={`Remove ${item.name} from cart`}
                          title="Remove item"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Cart actions */}
            <div className="animate-fade-up flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-border)] pt-5 sm:pt-6">
              <button
                onClick={handleClearCart}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-rose-500/10 px-4 py-3 text-sm font-bold text-rose-600 ring-1 ring-rose-500/25 transition-all duration-300 hover:bg-rose-500 hover:text-white hover:shadow-lg hover:shadow-rose-500/30 active:scale-95 sm:flex-none sm:px-5"
              >
                <FaTrashRestoreAlt /> {t("clearAll")}
              </button>

              <button
                onClick={() => navigate("/shop")}
                className="group inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--color-surface)] px-4 py-3 text-sm font-bold text-[var(--color-text)] ring-1 ring-[var(--color-border)] transition-all duration-300 hover:ring-emerald-400 active:scale-95 sm:flex-none sm:px-5"
              >
                <FaArrowLeft className="shrink-0 transition-transform duration-300 group-hover:-translate-x-1" />
                <span className="truncate">{t("continueShopping")}</span>
              </button>
            </div>
          </div>

          {/* ================= Order Summary ================= */}
          <div className="animate-fade-up lg:sticky lg:top-24 lg:h-fit" style={{ animationDelay: "150ms" }}>
            <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl shadow-emerald-900/10 sm:rounded-3xl">
              {/* Gradient header */}
              <div className="flex items-center gap-2.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-4 py-3.5 sm:px-6 sm:py-4">
                <FaReceipt className="text-base text-white sm:text-lg" />
                <h3 className="text-base font-black tracking-wide text-white sm:text-lg">
                  {t("orderSummary")}
                </h3>
              </div>

              <div className="space-y-4 p-4 sm:p-6">
                {/* Items */}
                <div className="flex items-center justify-between font-semibold text-[var(--color-text)]">
                  <span className="flex items-center gap-2 text-xs sm:text-sm">
                    <FaBoxOpen className="shrink-0 text-emerald-500" />
                    {t("items", { count: totalItems })}
                  </span>
                  <span className="shrink-0 tabular-nums">${totalPrice.toFixed(2)}</span>
                </div>

                {/* Discount */}
                <div className="flex items-center justify-between font-semibold text-emerald-600">
                  <span className="flex items-center gap-2 text-xs sm:text-sm">
                    <FaTag className="shrink-0 text-emerald-500" />
                    {t("discount")}
                  </span>
                  <span className="shrink-0 tabular-nums">-${totalDiscount.toFixed(2)}</span>
                </div>

                {/* Subtotal */}
                <div className="flex items-center justify-between border-t border-dashed border-[var(--color-border)] pt-4 font-bold text-[var(--color-text)]">
                  <span className="text-xs sm:text-sm">{t("subtotal")}</span>
                  <span className="shrink-0 tabular-nums">${subtotal.toFixed(2)}</span>
                </div>

                {/* Tax */}
                <div className="flex items-center justify-between font-bold text-[var(--color-text)]">
                  <span className="text-xs sm:text-sm">{t("tax")}</span>
                  <span className="shrink-0 tabular-nums">${tax.toFixed(2)}</span>
                </div>

                {/* Total */}
                <div className="mt-2 flex items-center justify-between rounded-2xl bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 px-3.5 py-3 ring-1 ring-emerald-500/20 sm:px-4 sm:py-3.5">
                  <span className="text-sm font-black uppercase tracking-wide text-[var(--color-text)] sm:text-base">
                    {t("total")}
                  </span>
                  <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-xl font-black tabular-nums text-transparent sm:text-2xl">
                    ${total.toFixed(2)}
                  </span>
                </div>

                {/* Desktop checkout */}
                <button
                  onClick={handleProceedToCheckout}
                  className="group mt-2 hidden w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 py-4 text-lg font-bold text-white shadow-xl shadow-emerald-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/40 active:scale-[0.98] lg:flex"
                >
                  <FaLock className="text-sm opacity-80" />
                  {t("proceedCheckout")}
                  <FaChevronRight className="text-sm opacity-70 transition-transform duration-300 group-hover:translate-x-1" />
                </button>

                <button
                  onClick={handleClearCart}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-rose-500/10 py-3 text-sm font-bold text-rose-600 ring-1 ring-rose-500/25 transition-all duration-300 hover:bg-rose-500 hover:text-white active:scale-[0.98]"
                >
                  <FaTrashRestoreAlt />
                  {t("clearCart")}
                </button>
              </div>

              {/* 🛡️ Trust badges */}
              <div className="grid grid-cols-3 gap-2 border-t border-[var(--color-border)] bg-[var(--color-bg)] p-3 sm:gap-3 sm:p-4">
                {trustBadges.map(({ icon, label, color }) => (
                  <div key={label} className="flex flex-col items-center gap-1.5 text-center">
                    <span className={`grid h-8 w-8 place-items-center rounded-full text-xs sm:text-sm ${color}`}>
                      {icon}
                    </span>
                    <span className="text-[9px] font-semibold leading-tight text-[var(--color-muted)] sm:text-[10px]">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 📱 Mobile Sticky Checkout Bar ================= */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-border)] bg-[var(--color-surface)]/95 backdrop-blur-lg lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
          <div className="shrink-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted)]">
              {t("total")}
            </p>
            <p className="text-xl font-black tabular-nums text-emerald-600">
              ${total.toFixed(2)}
            </p>
          </div>
          <button
            onClick={handleProceedToCheckout}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 active:scale-[0.98] sm:text-base"
          >
            <FaLock className="text-xs opacity-80" />
            <span className="truncate">{t("proceedCheckout")}</span>
          </button>
        </div>
      </div>
    </>
  );
}