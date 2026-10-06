import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxioseSecure from "../../../hooks/useAxioseSecure";
import {
  FaPlus, FaTrash, FaEdit, FaPills, FaBoxOpen, FaTag, FaIndustry,
  FaImage, FaTimes, FaChevronLeft, FaChevronRight, FaExclamationTriangle, FaRedo,
} from "react-icons/fa";
import Swal from "sweetalert2";
import { ReTitle } from "re-title";
import { useTranslation } from "react-i18next";

export default function MyMedicines() {
  const { user } = useAuth();
  const axiosSecure = useAxioseSecure();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const [page, setPage] = useState(1);
  const limit = 8;

  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    genericName: "",
    description: "",
    image: "",
    category: "",
    company: "",
    unit: "",
    price: "",
    stock: "",
    discount: 0,
  });

  const categories = ["Tablet", "Capsule", "Syrup", "Injection", "Cream", "Drops"];

  /* ================= ✅ LOGIC — preserved ================= */
  const { data: medicinesResponse, isLoading, isError, refetch } = useQuery({
    queryKey: ["medicines", user?.email, page],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/medicines?sellerEmail=${user?.email}&page=${page}&limit=${limit}`
      );
      return res.data;
    },
    enabled: !!user?.email,
  });

  const medicines = Array.isArray(medicinesResponse?.data) ? medicinesResponse.data : [];
  const currentPage = medicinesResponse?.currentPage || 1;
  const totalPages = medicinesResponse?.totalPages || 1;

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["medicines", user.email] });

  const swalDark = () => ({
    background: document.documentElement.classList.contains("dark") ? "#1e293b" : "#fff",
    color: document.documentElement.classList.contains("dark") ? "#f1f5f9" : "#0f172a",
  });

  const addMedicineMutation = useMutation({
    mutationFn: async (newMedicine) => {
      const res = await axiosSecure.post("/medicines", newMedicine);
      return res.data;
    },
    onSuccess: () => {
      invalidate();
      Swal.fire({ icon: "success", text: t("medAdded"), timer: 1800, showConfirmButton: false, timerProgressBar: true, ...swalDark() });
      setShowModal(false);
      resetForm();
      setIsEditMode(false);
      setEditingId(null);
    },
    onError: () => {
      Swal.fire({ icon: "error", text: t("medAddFailed"), ...swalDark() });
    },
  });

  const updateMedicineMutation = useMutation({
    mutationFn: async ({ id, updatedMedicine }) => {
      const res = await axiosSecure.patch(`/medicines/${id}`, updatedMedicine);
      return res.data;
    },
    onSuccess: () => {
      invalidate();
      Swal.fire({ icon: "success", text: t("medUpdated"), timer: 1800, showConfirmButton: false, timerProgressBar: true, ...swalDark() });
      setShowModal(false);
      resetForm();
      setIsEditMode(false);
      setEditingId(null);
    },
    onError: () => {
      Swal.fire({ icon: "error", text: t("medUpdateFailed"), ...swalDark() });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "", genericName: "", description: "", image: "",
      category: "", company: "", unit: "", price: "", stock: "", discount: 0,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const medicineData = {
      ...formData,
      price: parseFloat(formData.price),
      discount: parseFloat(formData.discount),
      stock: parseInt(formData.stock, 10),
      sellerEmail: user?.email,
      status: "available",
      date: new Date(),
    };

    if (isEditMode && editingId) {
      updateMedicineMutation.mutate({ id: editingId, updatedMedicine: medicineData });
    } else {
      addMedicineMutation.mutate(medicineData);
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: t("deleteConfirmTitle"),
      text: t("deleteConfirmText"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: t("yesDelete"),
      cancelButtonText: t("cancel"),
      ...swalDark(),
    });

    if (confirm.isConfirmed) {
      await axiosSecure.delete(`/medicines/${id}`);
      invalidate();
      Swal.fire({ icon: "success", text: t("medDeleted"), timer: 1800, showConfirmButton: false, ...swalDark() });
    }
  };

  const handleEdit = (medicine) => {
    setFormData({
      name: medicine.name || "",
      genericName: medicine.genericName || "",
      description: medicine.description || "",
      image: medicine.image || "",
      category: medicine.category || "",
      company: medicine.company || "",
      unit: medicine.unit || "",
      price: medicine.price || "",
      stock: medicine.stock || "",
      discount: medicine.discount || 0,
    });
    setIsEditMode(true);
    setEditingId(medicine._id);
    setShowModal(true);
  };

  const openAddModal = () => {
    resetForm();
    setIsEditMode(false);
    setEditingId(null);
    setShowModal(true);
  };

  /* 🏷️ Stock info */
  const getStockInfo = (stock) => {
    const s = stock ?? 0;
    if (s === 0) return { label: t("outOfStockBadge"), cls: "bg-rose-500 text-white" };
    if (s <= 10) return { label: t("lowStockBadge"), cls: "bg-amber-500 text-white" };
    return null;
  };

  /* 🎨 Modal input classes */
  const inputCls =
    "w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition-all duration-300 placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100 dark:focus:ring-emerald-900/40";

  /* ================= 🎨 UI ================= */
  return (
    <>
      <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes modal-pop {
          0%   { transform: scale(.92) translateY(12px); opacity: 0; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        .animate-fade-up   { animation: fade-up .5s cubic-bezier(.16,1,.3,1) both; }
        .animate-modal-pop { animation: modal-pop .25s cubic-bezier(.16,1,.3,1); }
        .animate-fade-in   { animation: fade-up .2s ease-out; }
      `}</style>

      <div className="min-h-screen bg-[var(--color-bg)] p-4 transition-colors duration-300 sm:p-6 lg:p-8">
        <ReTitle title={t("myMedsDocTitle")} />

        <div className="mx-auto max-w-6xl">
          {/* ================= 📝 Header ================= */}
          <div className="animate-fade-up mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="flex items-center gap-3 text-2xl font-black tracking-tight text-[var(--color-text)] sm:text-3xl">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30">
                  <FaPills className="text-xl" />
                </span>
                {t("myMedsHeading")}
              </h2>
              <p className="mt-2 text-sm text-[var(--color-muted)] sm:text-base">
                {t("myMedsSubtitle")}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-600 ring-1 ring-emerald-500/25 sm:text-sm">
                <FaBoxOpen className="text-xs" />
                {t("totalMeds")}: {medicinesResponse?.total || medicines.length}
              </span>
              <button
                onClick={openAddModal}
                className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/40 active:scale-95"
              >
                <FaPlus className="text-xs transition-transform duration-300 group-hover:rotate-90" />
                {t("addMedicine")}
              </button>
            </div>
          </div>

          {/* ================= 💀 Loading skeleton ================= */}
          {isLoading ? (
            <div className="animate-pulse">
              <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-64 rounded-3xl bg-slate-300/25" />
                ))}
              </div>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center gap-4 rounded-3xl border border-rose-200 bg-rose-50/60 p-10 text-center dark:border-rose-500/20 dark:bg-rose-500/10">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-rose-500/15 text-rose-500">
                <FaExclamationTriangle className="text-xl" />
              </span>
              <button
                onClick={() => refetch()}
                className="inline-flex items-center gap-2 rounded-xl bg-rose-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-rose-500/30 transition hover:bg-rose-600 active:scale-95"
              >
                <FaRedo className="text-xs" /> {t("retry")}
              </button>
            </div>
          ) : medicines.length === 0 ? (
            /* ================= 📭 Empty state ================= */
            <div className="animate-fade-up flex flex-col items-center gap-4 rounded-3xl border-2 border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-16 text-center">
              <span className="grid h-16 w-16 place-items-center rounded-3xl bg-emerald-500/10 text-emerald-500">
                <FaPills className="text-2xl" />
              </span>
              <p className="font-semibold text-[var(--color-muted)]">{t("noMedsFound")}</p>
              <button
                onClick={openAddModal}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 transition active:scale-95"
              >
                <FaPlus /> {t("addMedicine")}
              </button>
            </div>
          ) : (
            <>
              {/* ================= 🃏 Medicine cards grid ================= */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5">
                {medicines.map((med, index) => {
                  const stockBadge = getStockInfo(med.stock);
                  return (
                    <div
                      key={med._id}
                      className="animate-fade-up group relative flex flex-col overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg shadow-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-900/15"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      {/* Top gradient line */}
                      <div className="absolute inset-x-0 top-0 z-10 h-1 origin-left scale-x-0 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 transition-transform duration-500 group-hover:scale-x-100" />

                      {/* 🖼️ Image */}
                      <div className="relative aspect-square overflow-hidden bg-[var(--color-bg)]">
                        {med.image ? (
                          <img
                            src={med.image}
                            alt={med.name}
                            className="h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-110"
                            loading="lazy"
                          />
                        ) : (
                          <div className="grid h-full w-full place-items-center text-slate-300">
                            <FaImage className="text-4xl" />
                          </div>
                        )}

                        {/* Stock badge */}
                        {stockBadge && (
                          <span className={`absolute left-2 top-2 z-10 rounded-full px-2 py-1 text-[9px] font-black uppercase tracking-wider shadow-lg ${stockBadge.cls}`}>
                            {stockBadge.label}
                          </span>
                        )}

                        {/* Discount badge */}
                        {med.discount > 0 && (
                          <span className="absolute right-2 top-2 z-10 rounded-full bg-gradient-to-r from-rose-500 to-red-500 px-2 py-1 text-[9px] font-black text-white shadow-lg">
                            {med.discount}% {t("off")}
                          </span>
                        )}

                        {/* Hover overlay — edit/delete */}
                        <div className="absolute inset-0 flex items-center justify-center gap-3 bg-slate-950/50 opacity-0 backdrop-blur-[2px] transition-all duration-300 group-hover:opacity-100">
                          <button
                            onClick={() => handleEdit(med)}
                            className="grid h-11 w-11 place-items-center rounded-full bg-white/90 text-emerald-600 shadow-lg transition-all duration-300 hover:scale-110 hover:bg-emerald-500 hover:text-white active:scale-95"
                            title={t("editMedicine")}
                            aria-label={`${t("editMedicine")} — ${med.name}`}
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(med._id)}
                            className="grid h-11 w-11 place-items-center rounded-full bg-white/90 text-rose-600 shadow-lg transition-all duration-300 hover:scale-110 hover:bg-rose-500 hover:text-white active:scale-95"
                            title={t("deleteConfirmTitle")}
                            aria-label={`Delete — ${med.name}`}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>

                      {/* 📝 Info */}
                      <div className="flex flex-1 flex-col p-3 sm:p-3.5">
                        <h3 className="line-clamp-1 text-sm font-black text-[var(--color-text)]" title={med.name}>
                          {med.name}
                        </h3>
                        <p className="mt-0.5 flex items-center gap-1 text-[10px] text-[var(--color-muted)]">
                          <FaIndustry className="shrink-0 text-[8px] opacity-60" />
                          <span className="truncate">{med.company} · {med.unit}</span>
                        </p>

                        {/* Category chip */}
                        {med.category && (
                          <span className="mt-1.5 inline-flex w-fit items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold capitalize text-emerald-600 ring-1 ring-emerald-500/20">
                            <FaTag className="text-[7px]" />
                            {med.category}
                          </span>
                        )}

                        {/* Price + stock */}
                        <div className="mt-auto flex items-center justify-between pt-2.5">
                          <span className="text-base font-black text-emerald-600 sm:text-lg">
                            ৳{med.price}
                          </span>
                          <span className="rounded-full bg-slate-500/10 px-2 py-0.5 text-[10px] font-bold text-[var(--color-muted)]">
                            {t("stock")}: {med.stock ?? 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ================= 📄 Pagination ================= */}
              {totalPages > 1 && (
                <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--color-surface)] px-4 py-2.5 text-xs font-bold text-[var(--color-text)] ring-1 ring-[var(--color-border)] transition-all duration-300 hover:ring-emerald-400 disabled:opacity-30"
                  >
                    <FaChevronLeft className="text-[10px]" />
                    <span className="hidden sm:inline">{t("previous")}</span>
                  </button>

                  {[...Array(totalPages)].map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setPage(idx + 1)}
                      className={`grid h-10 w-10 place-items-center rounded-xl text-sm font-black transition-all duration-300 ${
                        currentPage === idx + 1
                          ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30"
                          : "bg-[var(--color-surface)] text-[var(--color-text)] ring-1 ring-[var(--color-border)] hover:ring-emerald-400"
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--color-surface)] px-4 py-2.5 text-xs font-bold text-[var(--color-text)] ring-1 ring-[var(--color-border)] transition-all duration-300 hover:ring-emerald-400 disabled:opacity-30"
                  >
                    <span className="hidden sm:inline">{t("next")}</span>
                    <FaChevronRight className="text-[10px]" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ================= 🪟 Add/Edit Modal ================= */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div
            className="animate-fade-in absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => { setShowModal(false); resetForm(); }}
          />

          <form
            onSubmit={handleSubmit}
            className="animate-modal-pop relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl dark:bg-slate-900"
          >
            {/* Gradient header */}
            <div className="sticky top-0 z-10 flex items-center justify-between bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-6 py-4">
              <h2 className="flex items-center gap-2.5 text-lg font-black text-white sm:text-xl">
                <FaPills />
                {isEditMode ? t("editMedicine") : t("addNewMedicine")}
              </h2>
              <button
                type="button"
                onClick={() => { setShowModal(false); setIsEditMode(false); setEditingId(null); resetForm(); }}
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/15 text-white transition duration-300 hover:rotate-90 hover:bg-white/25"
                aria-label={t("close")}
              >
                <FaTimes className="text-sm" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 md:gap-5">
              {/* Text inputs */}
              {[
                { label: t("itemName"), name: "name", type: "text", required: true, icon: <FaPills /> },
                { label: t("genericNameLabel"), name: "genericName", type: "text", icon: <FaPills /> },
                { label: t("companyLabel"), name: "company", type: "text", icon: <FaIndustry /> },
                { label: t("unitLabel"), name: "unit", type: "text", icon: <FaTag /> },
                { label: t("priceLabel"), name: "price", type: "number", required: true, icon: <FaTag /> },
                { label: t("stockLabel"), name: "stock", type: "number", required: true, icon: <FaBoxOpen /> },
                { label: t("discountLabel"), name: "discount", type: "number", icon: <FaTag /> },
              ].map((field) => (
                <label key={field.name} className="block">
                  <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {field.label} {field.required && "*"}
                  </span>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                      {field.icon}
                    </span>
                    <input
                      name={field.name}
                      type={field.type}
                      required={field.required}
                      value={formData[field.name]}
                      onChange={handleInputChange}
                      className={`${inputCls} pl-10`}
                      placeholder={field.label}
                    />
                  </div>
                </label>
              ))}

              {/* Category select */}
              <label className="block">
                <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {t("categoryLabel")} *
                </span>
                <select
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`${inputCls} cursor-pointer`}
                >
                  <option value="" disabled>{t("selectCategory")}</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </label>

              {/* Image URL — full width + live preview */}
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {t("imageUrlLabel")}
                </span>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                      <FaImage />
                    </span>
                    <input
                      name="image"
                      type="url"
                      value={formData.image}
                      onChange={handleInputChange}
                      className={`${inputCls} pl-10`}
                      placeholder="https://..."
                    />
                  </div>
                  {/* 🖼️ Live preview */}
                  <div className="hidden h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700 sm:block">
                    {formData.image ? (
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="h-full w-full object-contain"
                        onError={(e) => (e.target.style.display = "none")}
                        onLoad={(e) => (e.target.style.display = "block")}
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center text-slate-300">
                        <FaImage />
                      </div>
                    )}
                  </div>
                </div>
              </label>

              {/* Description — full width */}
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {t("descriptionLabel")}
                </span>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className={`${inputCls} resize-none`}
                  placeholder={t("descriptionLabel")}
                />
              </label>
            </div>

            {/* Footer buttons */}
            <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t border-[var(--color-border)] bg-white/95 p-4 backdrop-blur dark:bg-slate-900/95 sm:px-6">
              <button
                type="button"
                onClick={() => { setShowModal(false); setIsEditMode(false); setEditingId(null); resetForm(); }}
                className="rounded-xl bg-slate-100 px-5 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-200 active:scale-95 dark:bg-white/10 dark:text-white/70 dark:hover:bg-white/20"
              >
                {t("cancel")}
              </button>
              <button
                type="submit"
                disabled={addMedicineMutation.isLoading || updateMedicineMutation.isLoading}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 transition hover:shadow-emerald-500/50 active:scale-95 disabled:opacity-60"
              >
                {addMedicineMutation.isLoading || updateMedicineMutation.isLoading
                  ? isEditMode ? t("updating") : t("adding")
                  : isEditMode ? t("updateBtn") : t("submitBtn")}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}