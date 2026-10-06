import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import {
  FaThLarge, FaPlus, FaEdit, FaTrash, FaImage,
  FaExclamationTriangle, FaRedo, FaBoxOpen, FaTimes, FaTag,
} from "react-icons/fa";
import { toast } from "react-toastify";
import useAxioseSecure from "../../../hooks/useAxioseSecure";
import { ReTitle } from "re-title";
import { useTranslation } from "react-i18next";

const ManageCategories = () => {
  const axiosSecure = useAxioseSecure();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({ categoryName: "", image: "" });
  const [imgError, setImgError] = useState(false); // 🐛 fix #2

  const { data: categories = [], isLoading, error, refetch } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => (await axiosSecure.get("/categories")).data,
  });

  const addCategoryMutation = useMutation({
    mutationFn: (newCategory) => axiosSecure.post("/categories", newCategory),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] }); // 🐛 fix #5
      Swal.fire({
        icon: "success",
        text: t("categoryAdded"),
        confirmButtonColor: "#10b981",
        timer: 1500,
        showConfirmButton: false,
        timerProgressBar: true,
      });
      handleClose();
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, updatedCategory }) =>
      axiosSecure.patch(`/categories/${id}`, updatedCategory),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] }); // 🐛 fix #5
      Swal.fire({
        icon: "success",
        text: t("categoryUpdated"),
        confirmButtonColor: "#10b981",
        timer: 1500,
        showConfirmButton: false,
        timerProgressBar: true,
      });
      handleClose();
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id) => axiosSecure.delete(`/categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] }); // 🐛 fix #5
      Swal.fire({
        icon: "success",
        text: t("categoryDeleted"),
        confirmButtonColor: "#10b981",
        timer: 1500,
        showConfirmButton: false,
        timerProgressBar: true,
      });
    },
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: t("deleteCategoryTitle"),
      text: t("deleteCategoryText"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: t("yesDelete"),
      cancelButtonText: t("cancel"),
    }).then((result) => {
      if (result.isConfirmed) deleteCategoryMutation.mutate(id);
    });
  };

  const handleOpenAdd = () => {
    setIsEdit(false);
    setCurrentId(null);
    setFormData({ categoryName: "", image: "" });
    setImgError(false); // 🐛 fix #2
    setOpen(true);
  };

  const handleOpenEdit = (category) => {
    setIsEdit(true);
    setCurrentId(category._id);
    setFormData({ categoryName: category.categoryName, image: category.image });
    setImgError(false); // 🐛 fix #2
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // 🐛 fix #3 — empty name hole toast feedback
    if (!formData.categoryName.trim()) {
      toast.error(t("categoryName") + " required!");
      return;
    }
    if (isEdit) {
      updateCategoryMutation.mutate({ id: currentId, updatedCategory: formData });
    } else {
      addCategoryMutation.mutate(formData);
    }
  };

  /* ⌨️ Modal open thakle ESC close + body scroll lock */
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    if (open) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const isMutating =
    addCategoryMutation.isLoading || updateCategoryMutation.isLoading;

  /* 💀 Skeleton */
  if (isLoading)
    return (
      <div className="min-h-screen bg-[var(--color-bg)] p-4 md:p-8">
        <div className="mx-auto max-w-6xl animate-pulse">
          <div className="mb-8 h-20 rounded-3xl bg-slate-300/40" />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-64 rounded-3xl bg-slate-300/25" />
            ))}
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="flex max-w-md flex-col items-center gap-4 rounded-3xl border border-rose-200 bg-rose-50/60 p-10 text-center dark:border-rose-500/20 dark:bg-rose-500/10">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-rose-500/15 text-rose-500">
            <FaExclamationTriangle className="text-xl" />
          </span>
          <p className="text-lg font-bold text-rose-600">{t("errorLoadingUsers")}</p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 rounded-xl bg-rose-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-rose-500/30 transition hover:bg-rose-600 active:scale-95"
          >
            <FaRedo className="text-xs" /> {t("retry")}
          </button>
        </div>
      </div>
    );

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

      <div className="min-h-screen bg-[var(--color-bg)] p-4 transition-colors duration-300 md:p-8">
        <ReTitle title={t("manageCategoriesDocTitle")} />

        <div className="mx-auto max-w-6xl">
          {/* ================= 📝 Header ================= */}
          <div className="animate-fade-up mb-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* 🐛 fix #1 + #4 — h-14 w-14, valid icon */}
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30">
                <FaThLarge className="text-xl" />
              </span>
              <div>
                <h2 className="text-2xl font-black tracking-tight text-[var(--color-text)] md:text-3xl">
                  {t("categoryHeading")}
                </h2>
                <p className="mt-0.5 text-sm text-[var(--color-muted)]">
                  {t("categorySubtitle")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-600 ring-1 ring-emerald-500/25 sm:text-sm">
                <FaBoxOpen className="text-xs" />
                {t("totalCategories")}: {categories.length}
              </span>

              <button
                onClick={handleOpenAdd}
                className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/40 active:scale-95"
              >
                <FaPlus className="text-xs transition-transform duration-300 group-hover:rotate-90" />
                {t("addCategory")}
              </button>
            </div>
          </div>

          {/* ================= 📭 Empty state ================= */}
          {categories.length === 0 ? (
            <div className="flex flex-col items-center gap-4 rounded-3xl border-2 border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-16 text-center">
              <span className="grid h-16 w-16 place-items-center rounded-3xl bg-emerald-500/10 text-emerald-500">
                <FaThLarge className="text-2xl" />
              </span>
              <p className="font-semibold text-[var(--color-muted)]">
                {t("noCategoriesFound")}
              </p>
              <button
                onClick={handleOpenAdd}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 transition active:scale-95"
              >
                <FaPlus /> {t("addCategory")}
              </button>
            </div>
          ) : (
            /* ================= 🃏 Category cards grid ================= */
            <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
              {categories.map((cat, index) => (
                <div
                  key={cat._id}
                  className="animate-fade-up group relative overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg shadow-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-900/15"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="absolute inset-x-0 top-0 z-10 h-1 origin-left scale-x-0 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 transition-transform duration-500 group-hover:scale-x-100" />

                  {/* 🖼️ Image */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-bg)]">
                    {cat.image ? (
                      <img
                        src={cat.image}
                        alt={cat.categoryName}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                        onLoad={(e) => {
                          e.currentTarget.style.display = "block";
                        }}
                      />
                    ) : null}
                    {/* 🐛 fix #2 — image fail/success dutoi placeholder logic */}
                    {!cat.image && (
                      <div className="grid h-full w-full place-items-center text-slate-300">
                        <FaImage className="text-4xl" />
                      </div>
                    )}

                    {/* Hover overlay + actions */}
                    <div className="absolute inset-0 flex items-center justify-center gap-3 bg-slate-950/50 opacity-0 backdrop-blur-[2px] transition-all duration-300 group-hover:opacity-100">
                      <button
                        onClick={() => handleOpenEdit(cat)}
                        className="grid h-11 w-11 place-items-center rounded-full bg-white/90 text-emerald-600 shadow-lg transition-all duration-300 hover:scale-110 hover:bg-emerald-500 hover:text-white active:scale-95"
                        title={t("editCategory")}
                        aria-label={`${t("editCategory")} — ${cat.categoryName}`}
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(cat._id)}
                        className="grid h-11 w-11 place-items-center rounded-full bg-white/90 text-rose-600 shadow-lg transition-all duration-300 hover:scale-110 hover:bg-rose-500 hover:text-white active:scale-95"
                        title={t("deleteCategory")}
                        aria-label={`${t("deleteCategory")} — ${cat.categoryName}`}
                      >
                        <FaTrash />
                      </button>
                    </div>

                    {/* SL badge */}
                    <span className="absolute left-2.5 top-2.5 grid h-6 w-6 place-items-center rounded-lg bg-slate-950/60 text-[10px] font-black text-white backdrop-blur">
                      {index + 1}
                    </span>
                  </div>

                  {/* 📝 Name */}
                  <div className="flex items-center gap-2 p-3.5 sm:p-4">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-emerald-500/10 text-[10px] text-emerald-600">
                      <FaTag />
                    </span>
                    <h3 className="truncate text-sm font-bold capitalize text-[var(--color-text)] sm:text-base">
                      {cat.categoryName}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ================= 🪟 Add/Edit Modal ================= */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div
            className="animate-fade-in absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={handleClose}
          />

          <div className="animate-modal-pop relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-[var(--color-surface)]">
            <div className="flex items-start justify-between gap-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-6 py-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/70">
                  {isEdit ? t("updateCategory") : t("createCategory")}
                </p>
                <h3 className="text-lg font-black text-white">
                  {isEdit ? t("updateCategory") : t("addCategory")}
                </h3>
              </div>
              <button
                onClick={handleClose}
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/15 text-white transition duration-300 hover:rotate-90 hover:bg-white/25"
                aria-label={t("close")}
              >
                <FaTimes className="text-sm" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-6">
              {/* 🖼️ Live preview — 🐛 fix #2: error hole placeholder dekhabe */}
              <div className="flex items-center gap-4 rounded-2xl bg-[var(--color-bg)] p-3.5 ring-1 ring-[var(--color-border)]">
                <div className="rounded-xl bg-gradient-to-tr from-emerald-400/50 to-cyan-400/50 p-[2px]">
                  <div className="h-16 w-24 overflow-hidden rounded-[10px] bg-white">
                    {formData.image && !imgError ? (
                      <img
                        src={formData.image}
                        alt={t("previewLabel")}
                        className="h-full w-full object-cover"
                        onError={() => setImgError(true)}
                        onLoad={() => setImgError(false)}
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center text-slate-300">
                        <FaImage className="text-xl" />
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-xs font-semibold text-[var(--color-muted)]">
                  {t("previewLabel")}
                </p>
              </div>

              {/* Category name */}
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">
                  {t("categoryName")} *
                </span>
                <div className="flex items-center gap-3 rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 transition-all duration-300 focus-within:border-emerald-400 focus-within:ring-4 focus-within:ring-emerald-100 dark:focus-within:ring-emerald-900/40">
                  <FaTag className="shrink-0 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={formData.categoryName}
                    onChange={(e) =>
                      setFormData({ ...formData, categoryName: e.target.value })
                    }
                    className="w-full bg-transparent text-sm font-medium text-[var(--color-text)] outline-none placeholder:text-gray-400"
                    placeholder={t("categoryNamePlaceholder")}
                  />
                </div>
              </label>

              {/* Image URL */}
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[var(--color-muted)]">
                  {t("imageLabel")}
                </span>
                <div className="flex items-center gap-3 rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 transition-all duration-300 focus-within:border-emerald-400 focus-within:ring-4 focus-within:ring-emerald-100 dark:focus-within:ring-emerald-900/40">
                  <FaImage className="shrink-0 text-gray-400" />
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => {
                      setFormData({ ...formData, image: e.target.value });
                      setImgError(false); // notun URL dile reset
                    }}
                    className="w-full bg-transparent text-sm font-medium text-[var(--color-text)] outline-none placeholder:text-gray-400"
                    placeholder={t("imagePlaceholder")}
                  />
                </div>
              </label>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-xl bg-slate-100 px-5 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-200 active:scale-95 dark:bg-white/10 dark:text-white/70 dark:hover:bg-white/20"
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  disabled={isMutating}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 transition hover:shadow-emerald-500/50 active:scale-95 disabled:opacity-60"
                >
                  {isEdit ? t("saveChanges") : t("addCategory")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ManageCategories;