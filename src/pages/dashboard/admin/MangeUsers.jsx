import React, { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import {
  FaUsers, FaSearch, FaTrash, FaExclamationTriangle, FaRedo,
  FaUserShield, FaStore, FaUser, FaCrown, FaEnvelope, FaBoxOpen,
} from "react-icons/fa";
import useAxioseSecure from "../../../hooks/useAxioseSecure";
import { ReTitle } from "re-title";
import { useTranslation } from "react-i18next";

/* 🏅 Role badge config — gradient + icon */
const ROLE_STYLES = {
  admin: {
    icon: <FaCrown className="text-[9px]" />,
    cls: "bg-gradient-to-r from-rose-500 to-red-500 text-white shadow-rose-500/30",
    selectIcon: <FaCrown className="text-rose-500" />,
  },
  seller: {
    icon: <FaStore className="text-[9px]" />,
    cls: "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-500/30",
    selectIcon: <FaStore className="text-emerald-500" />,
  },
  user: {
    icon: <FaUser className="text-[9px]" />,
    cls: "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-blue-500/30",
    selectIcon: <FaUser className="text-blue-500" />,
  },
};

/* 🎨 Avatar initial color by role */
const AVATAR_COLORS = {
  admin: "from-rose-500 to-red-500",
  seller: "from-emerald-500 to-teal-500",
  user: "from-blue-500 to-indigo-500",
};

export default function ManageUsers() {
  const axiosSecure = useAxioseSecure();
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [search, setSearch] = useState("");

  const { data: users = [], isLoading, error, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: async () => (await axiosSecure.get("/users")).data,
  });

  /* 🔍 Search filter — name + email */
  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q)
    );
  }, [users, search]);

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, role }) =>
      axiosSecure.patch(`/users/role/${id}`, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      Swal.fire({
        icon: "success",
        title: t("successTitle") || "✅",
        text: t("roleUpdated"),
        confirmButtonColor: "#10b981",
        timer: 1800,
        timerProgressBar: true,
      });
    },
    onError: () => {
      Swal.fire({
        icon: "error",
        title: t("paymentFailed") || "Error",
        text: t("roleUpdateFailed"),
        confirmButtonColor: "#10b981",
      });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id) => axiosSecure.delete(`/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      Swal.fire({
        icon: "success",
        title: t("userDeleted"),
        confirmButtonColor: "#10b981",
        timer: 1800,
        timerProgressBar: true,
      });
    },
    onError: () => {
      Swal.fire({
        icon: "error",
        text: t("deleteFailed"),
        confirmButtonColor: "#10b981",
      });
    },
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: t("deleteConfirmTitle"),
      text: t("deleteConfirmText"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#94a3b8",
      confirmButtonText: t("yesDelete"),
      cancelButtonText: t("cancel"),
    }).then((result) => {
      if (result.isConfirmed) deleteUserMutation.mutate(id);
    });
  };

  /* 💀 Skeleton */
  if (isLoading)
    return (
      <div className="mx-auto my-10 max-w-7xl px-3 sm:px-6">
        <div className="animate-pulse space-y-4">
          <div className="mx-auto h-9 w-64 rounded-2xl bg-slate-300/40" />
          <div className="h-14 rounded-2xl bg-slate-300/30" />
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-16 rounded-2xl bg-slate-300/25" />
          ))}
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
        .animate-fade-up { animation: fade-up .5s cubic-bezier(.16,1,.3,1) both; }
      `}</style>

      <div className="mx-auto my-10 max-w-7xl px-3 sm:px-6">
        <ReTitle title={t("manageUsersDocTitle")} />

        <div className="overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xl shadow-black/5">
          {/* ================= 📝 Header ================= */}
          <div className="relative overflow-hidden border-b border-[var(--color-border)] bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent px-5 py-6 sm:px-7">
            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-400/15 blur-2xl" />

            <div className="relative flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30">
                  <FaUsers className="text-xl" />
                </span>
                <div>
                  <h2 className="text-xl font-black tracking-tight text-[var(--color-text)] sm:text-2xl">
                    {t("manageUsersHeading")}
                  </h2>
                  <p className="mt-0.5 text-xs text-[var(--color-muted)] sm:text-sm">
                    {t("manageUsersSubtitle")}
                  </p>
                </div>
              </div>

              {/* Count chip */}
              <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-600 ring-1 ring-emerald-500/25 sm:text-sm">
                <FaBoxOpen className="text-xs" />
                {t("totalUsers")}: {users.length}
              </span>
            </div>

            {/* 🔍 Search bar */}
            <div className="relative mt-5 max-w-md">
              <FaSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("searchUser")}
                className="w-full rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-bg)] py-2.5 pl-11 pr-4 text-sm font-medium text-[var(--color-text)] outline-none transition-all duration-300 placeholder:text-gray-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-900/40"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 transition hover:text-rose-500"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* ================= 📋 Users list ================= */}
          {users.length === 0 ? (
            <div className="flex flex-col items-center gap-3 p-14 text-center">
              <span className="grid h-16 w-16 place-items-center rounded-3xl bg-emerald-500/10 text-emerald-500">
                <FaUsers className="text-2xl" />
              </span>
              <p className="text-lg font-semibold text-[var(--color-muted)]">
                {t("noUsersFound")}
              </p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center gap-3 p-14 text-center">
              <span className="grid h-16 w-16 place-items-center rounded-3xl bg-slate-500/10 text-slate-400">
                <FaSearch className="text-2xl" />
              </span>
              <p className="text-lg font-semibold text-[var(--color-muted)]">
                {t("noUsersMatch")}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[var(--color-border)]">
              {filteredUsers.map((u, index) => {
                const roleStyle = ROLE_STYLES[u.role] || ROLE_STYLES.user;
                const avatarCls = AVATAR_COLORS[u.role] || AVATAR_COLORS.user;
                return (
                  <div
                    key={u._id}
                    className="animate-fade-up group flex flex-col gap-4 p-4 transition-colors duration-200 hover:bg-emerald-500/5 sm:px-6 md:flex-row md:items-center md:justify-between"
                    style={{ animationDelay: `${index * 40}ms` }}
                  >
                    {/* 👤 User info */}
                    <div className="flex min-w-0 flex-1 items-center gap-3.5">
                      {/* Avatar — initial with role gradient */}
                      <div
                        className={`grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br ${avatarCls} text-sm font-black text-white shadow-md transition-transform duration-300 group-hover:scale-105`}
                      >
                        {u.name?.[0]?.toUpperCase() || u.email?.[0]?.toUpperCase() || "U"}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-[var(--color-text)] sm:text-base">
                          {u.name || "—"}
                        </p>
                        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-[var(--color-muted)] sm:text-sm">
                          <FaEnvelope className="shrink-0 text-[10px] opacity-60" />
                          <span className="truncate">{u.email}</span>
                        </p>
                      </div>
                    </div>

                    {/* 🏅 Role badge — mobile e alada line, md te inline */}
                    <div className="flex items-center gap-3 md:w-40">
                      <span
                        className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-wider shadow-md sm:text-[11px] ${roleStyle.cls}`}
                      >
                        {roleStyle.icon}
                        {u.role}
                      </span>
                    </div>

                    {/* 🔄 Role selector */}
                    <div className="flex items-center gap-3 md:w-44">
                      <div className="relative flex-1 md:flex-none">
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs">
                          {roleStyle.selectIcon}
                        </span>
                        <select
                          value={u.role}
                          onChange={(e) =>
                            updateRoleMutation.mutate({ id: u._id, role: e.target.value })
                          }
                          disabled={updateRoleMutation.isLoading}
                          className="w-full cursor-pointer appearance-none rounded-xl border-2 border-[var(--color-border)] bg-[var(--color-bg)] py-2 pl-9 pr-8 text-xs font-bold capitalize text-[var(--color-text)] outline-none transition-all duration-300 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 dark:focus:ring-emerald-900/40 disabled:opacity-50 sm:text-sm"
                          aria-label={`${t("changeRole")} — ${u.name || u.email}`}
                        >
                          <option value="user">User</option>
                          <option value="seller">Seller</option>
                          <option value="admin">Admin</option>
                        </select>
                        {/* Chevron */}
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-gray-400">
                          ▼
                        </span>
                      </div>
                    </div>

                    {/* 🗑️ Delete */}
                    <div className="flex md:w-auto">
                      <button
                        onClick={() => handleDelete(u._id)}
                        disabled={deleteUserMutation.isLoading}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-rose-500/10 px-4 py-2.5 text-xs font-bold text-rose-600 ring-1 ring-rose-500/25 transition-all duration-300 hover:bg-rose-500 hover:text-white hover:shadow-lg hover:shadow-rose-500/30 active:scale-95 disabled:opacity-50 sm:flex-none sm:text-sm md:px-5"
                        aria-label={`Delete ${u.name || u.email}`}
                      >
                        <FaTrash className="text-xs" />
                        {t("actionCol") === "Actions" ? "Delete" : "মুছুন"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}