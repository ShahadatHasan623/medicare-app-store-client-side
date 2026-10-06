import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; 
import useAxioseSecure from "../../../hooks/useAxioseSecure";
import {
  FaFileCsv, FaFileExcel, FaFilePdf, FaCalendarAlt, FaSearch,
  FaShoppingBag, FaMoneyBillWave, FaChartLine, FaTimes, FaChartBar, FaDownload,
} from "react-icons/fa";
import { ReTitle } from "re-title";
import { useTranslation } from "react-i18next";

export default function SalesReport() {
  const axiosSecure = useAxioseSecure();
  const { t } = useTranslation();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const { data: sales = [], isLoading } = useQuery({
    queryKey: ["salesReport", startDate, endDate],
    queryFn: async () => {
      let url = "/payments/report";
      if (startDate && endDate)
        url += `?startDate=${startDate}&endDate=${endDate}`;
      const res = await axiosSecure.get(url);
      return res.data;
    },
  });

  /* 🔁 filter change hole page 1 e reset */
  const changeDate = (setter) => (e) => {
    setter(e.target.value);
    setCurrentPage(1);
  };

  const clearFilter = () => {
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
  };

  /* 🧮 Summary stats */
  const stats = useMemo(() => {
    const totalRevenue = sales.reduce((s, r) => s + (r.totalPrice ?? 0), 0);
    const avgOrder = sales.length ? totalRevenue / sales.length : 0;
    const totalQty = sales.reduce((s, r) => s + (r.quantity ?? 0), 0);
    return { totalRevenue, avgOrder, totalQty };
  }, [sales]);

  const columns = [
    {
      name: t("medicineCol"),
      selector: (row) => row.medicineName,
      sortable: true,
      cell: (row) => (
        <div className="py-2 font-bold text-[var(--color-text)]">
          {row.medicineName}
        </div>
      ),
    },
    {
      name: t("sellerCol"),
      selector: (row) => row.sellerEmail,
      sortable: true,
      hide: "sm",
      cell: (row) => <span className="text-sm text-[var(--color-muted)]">{row.sellerEmail}</span>,
    },
    {
      name: t("buyerCol"),
      selector: (row) => row.buyerEmail,
      sortable: true,
      hide: "md",
      cell: (row) => <span className="text-sm text-[var(--color-muted)]">{row.buyerEmail}</span>,
    },
    {
      name: t("qtyCol"),
      selector: (row) => row.quantity,
      sortable: true,
      center: true,
      cell: (row) => (
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-xs font-black text-emerald-600">
          {row.quantity}
        </span>
      ),
    },
    {
      name: t("totalPriceCol"),
      selector: (row) => row.totalPrice,
      sortable: true,
      cell: (row) => (
        <span className="font-black tabular-nums text-emerald-600">
          ৳{row.totalPrice?.toFixed(2)}
        </span>
      ),
    },
    {
      name: t("statusCol"),
      selector: (row) => row.status,
      sortable: true,
      center: true,
      cell: (row) => (
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ring-1 ${
            row.status === "paid"
              ? "bg-emerald-500/15 text-emerald-600 ring-emerald-500/25"
              : "bg-amber-500/15 text-amber-600 ring-amber-500/25"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      name: t("dateCol"),
      selector: (row) => new Date(row.date).toLocaleDateString(),
      sortable: true,
      right: true,
      cell: (row) => (
        <span className="text-sm italic text-[var(--color-muted)]">
          {new Date(row.date).toLocaleDateString("en-GB")}
        </span>
      ),
    },
  ];

  /* 📄 Pagination */
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = sales.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(sales.length / rowsPerPage);

  /* 📤 Export functions */
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(sales);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sales");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([excelBuffer], { type: "application/octet-stream" }),
      "Medicare_Sales_Report.xlsx"
    );
  };

  const exportToPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    doc.setFontSize(18);
    doc.text("Medicare Sales Report", 14, 15);
    doc.setFontSize(10);
    doc.text(`${t("generatedOn")}: ${new Date().toLocaleString()}`, 14, 22);

    const tableData = sales.map((s) => [
      s.medicineName,
      s.sellerEmail,
      s.buyerEmail,
      s.quantity,
      `৳${s.unitPrice}`,
      `৳${s.totalPrice}`,
      s.status,
      new Date(s.date).toLocaleDateString(),
    ]);

    autoTable(doc, {
      head: [
        [
          t("medicineCol"), t("sellerCol"), t("buyerCol"), t("qtyCol"),
          t("unitCol"), t("totalPriceCol"), t("statusCol"), t("dateCol"),
        ],
      ],
      body: tableData,
      startY: 28,
      theme: "striped",
      headStyles: { fillColor: [16, 185, 129], fontSize: 10 },
      styles: { fontSize: 9 },
    });
    doc.save("Sales_Report.pdf");
  };

  /* 💀 Skeleton */
  if (isLoading)
    return (
      <div className="min-h-screen bg-[var(--color-bg)] p-4 md:p-8">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="mb-6 h-40 rounded-3xl bg-slate-300/40" />
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-28 rounded-3xl bg-slate-300/30" />
            ))}
          </div>
          <div className="h-96 rounded-3xl bg-slate-300/25" />
        </div>
      </div>
    );

  const summaryCards = [
    {
      label: t("totalOrders"),
      value: sales.length,
      icon: <FaShoppingBag />,
      gradient: "from-emerald-500 to-teal-500",
      shadow: "shadow-emerald-500/30",
      bg: "from-emerald-500/10 to-teal-500/5",
      border: "border-emerald-500/20",
    },
    {
      label: t("totalRevenue2"),
      value: `৳${stats.totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      icon: <FaMoneyBillWave />,
      gradient: "from-cyan-500 to-blue-500",
      shadow: "shadow-cyan-500/30",
      bg: "from-cyan-500/10 to-blue-500/5",
      border: "border-cyan-500/20",
    },
    {
      label: t("avgOrder"),
      value: `৳${stats.avgOrder.toFixed(2)}`,
      icon: <FaChartLine />,
      gradient: "from-violet-500 to-purple-500",
      shadow: "shadow-violet-500/30",
      bg: "from-violet-500/10 to-purple-500/5",
      border: "border-violet-500/20",
    },
  ];

  const exportButtons = [
    {
      key: "csv",
      label: t("exportCsv"),
      icon: <FaFileCsv />,
      cls: "bg-slate-800 hover:bg-slate-900 shadow-slate-800/25",
    },
    {
      key: "excel",
      label: t("exportExcel"),
      icon: <FaFileExcel />,
      cls: "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/25",
    },
    {
      key: "pdf",
      label: t("exportPdf"),
      icon: <FaFilePdf />,
      cls: "bg-rose-500 hover:bg-rose-600 shadow-rose-500/25",
    },
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

      <div className="min-h-screen bg-[var(--color-bg)] p-4 transition-colors duration-300 md:p-8">
        <ReTitle title={t("salesDocTitle")} />

        <div className="mx-auto max-w-7xl">
          {/* ================= 📝 Header ================= */}
          <div className="animate-fade-up mb-8 flex flex-wrap items-center gap-4">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30">
              <FaChartBar className="text-xl" />
            </span>
            <div>
              <h2 className="text-2xl font-black tracking-tight text-[var(--color-text)] md:text-3xl">
                {t("salesHeading")}
              </h2>
              <p className="mt-0.5 text-sm text-[var(--color-muted)]">
                {t("salesSubtitle")}
              </p>
            </div>
          </div>

          {/* ================= 📊 Summary cards ================= */}
          <div className="animate-fade-up mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {summaryCards.map((s) => (
              <div
                key={s.label}
                className={`group relative overflow-hidden rounded-3xl border bg-gradient-to-br p-5 shadow-lg shadow-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${s.bg} ${s.border}`}
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${s.gradient} text-white shadow-lg ${s.shadow} transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3`}
                  >
                    {s.icon}
                  </span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted)] sm:text-xs">
                      {s.label}
                    </p>
                    <h3 className="mt-0.5 text-xl font-black tabular-nums text-[var(--color-text)] sm:text-2xl">
                      {s.value}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ================= 🎛️ Toolbar card ================= */}
          <div className="animate-fade-up mb-8 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-lg shadow-black/5 sm:p-6">
            <div className="flex flex-col items-stretch justify-between gap-5 lg:flex-row lg:items-center">
              {/* 📅 Date range filter */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[var(--color-muted)]">
                  <FaCalendarAlt className="text-emerald-500" />
                  {t("dateRange")}
                </span>

                <div className="flex items-center gap-2 rounded-2xl bg-[var(--color-bg)] p-1.5 ring-1 ring-[var(--color-border)]">
                  <div className="relative">
                    <FaCalendarAlt className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400" />
                    <input
                      type="date"
                      value={startDate}
                      onChange={changeDate(setStartDate)}
                      className="rounded-xl border-none bg-[var(--color-surface)] py-2 pl-9 pr-3 text-xs font-semibold text-[var(--color-text)] outline-none ring-emerald-500 transition focus:ring-2"
                    />
                  </div>
                  <span className="text-xs font-black text-gray-400">→</span>
                  <div className="relative">
                    <FaCalendarAlt className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400" />
                    <input
                      type="date"
                      value={endDate}
                      onChange={changeDate(setEndDate)}
                      className="rounded-xl border-none bg-[var(--color-surface)] py-2 pl-9 pr-3 text-xs font-semibold text-[var(--color-text)] outline-none ring-emerald-500 transition focus:ring-2"
                    />
                  </div>

                  {(startDate || endDate) && (
                    <button
                      onClick={clearFilter}
                      className="inline-flex items-center gap-1 rounded-xl bg-rose-500/10 px-3 py-2 text-[11px] font-bold text-rose-600 ring-1 ring-rose-500/25 transition hover:bg-rose-500 hover:text-white active:scale-95"
                    >
                      <FaTimes className="text-[9px]" />
                      {t("clearFilter")}
                    </button>
                  )}
                </div>
              </div>

              {/* 📤 Export buttons */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="hidden items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[var(--color-muted)] sm:flex">
                  <FaDownload className="text-emerald-500" />
                  {t("exportAs")}
                </span>

                {exportButtons.map((btn) =>
                  btn.key === "csv" ? (
                    <CSVLink
                      key={btn.key}
                      data={sales}
                      filename="sales_report.csv"
                      className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-all duration-300 active:scale-95 ${btn.cls}`}
                    >
                      {btn.icon} {btn.label}
                    </CSVLink>
                  ) : (
                    <button
                      key={btn.key}
                      onClick={btn.key === "excel" ? exportToExcel : exportToPDF}
                      className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-all duration-300 active:scale-95 ${btn.cls}`}
                    >
                      {btn.icon} {btn.label}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>

          {/* ================= 📋 Report table ================= */}
          <div className="animate-fade-up overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-xl shadow-black/5">
            <DataTable
              columns={columns}
              data={currentRows}
              highlightOnHover
              responsive
              noDataComponent={
                <div className="flex flex-col items-center gap-3 p-12 text-center">
                  <span className="grid h-14 w-14 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-500">
                    <FaSearch className="text-xl" />
                  </span>
                  <p className="font-semibold text-[var(--color-muted)]">
                    {t("noSalesData")}
                  </p>
                </div>
              }
              customStyles={{
                headRow: {
                  style: {
                    background: "linear-gradient(90deg,#10b981,#14b8a6,#22d3ee)",
                    borderRadius: "0",
                  },
                },
                headCells: {
                  style: {
                    color: "#fff",
                    fontWeight: "900",
                    textTransform: "uppercase",
                    fontSize: "0.7rem",
                    letterSpacing: "0.08em",
                    paddingTop: "18px",
                    paddingBottom: "18px",
                  },
                },
                rows: {
                  style: {
                    backgroundColor: "var(--color-surface)",
                    color: "var(--color-text)",
                    "&:hover": {
                      backgroundColor: "rgba(16,185,129,.06) !important",
                    },
                  },
                  highlightOnHoverStyle: {
                    backgroundColor: "rgba(16,185,129,.08)",
                    borderBottomColor: "var(--color-border)",
                  },
                },
                cells: {
                  style: {
                    paddingTop: "14px",
                    paddingBottom: "14px",
                    fontSize: "0.875rem",
                    borderBottomColor: "var(--color-border)",
                  },
                },
                pagination: { display: "none" }, // custom pagination niche
              }}
            />

            {/* 📄 Custom pagination */}
            {sales.length > 0 && (
              <div className="flex flex-col items-center justify-between gap-3 border-t border-[var(--color-border)] bg-[var(--color-bg)] px-5 py-4 sm:flex-row sm:px-8">
                <p className="text-xs font-medium text-[var(--color-muted)] sm:text-sm">
                  {t("showing")}{" "}
                  <span className="font-black text-[var(--color-text)]">
                    {indexOfFirstRow + 1}
                  </span>{" "}
                  –{" "}
                  <span className="font-black text-[var(--color-text)]">
                    {Math.min(indexOfLastRow, sales.length)}
                  </span>{" "}
                  {t("of")} {sales.length} {t("records")}
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setCurrentPage(currentPage - 1);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    disabled={currentPage === 1}
                    className="rounded-xl bg-[var(--color-surface)] px-4 py-2 text-xs font-bold text-[var(--color-text)] ring-1 ring-[var(--color-border)] transition-all duration-300 hover:ring-emerald-400 disabled:opacity-30 sm:text-sm"
                  >
                    ← {t("previous")}
                  </button>

                  {/* Page indicator */}
                  <span className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 text-xs font-black text-white shadow-md shadow-emerald-500/25 sm:text-sm">
                    {currentPage} / {totalPages || 1}
                  </span>

                  <button
                    onClick={() => {
                      setCurrentPage(currentPage + 1);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    disabled={currentPage === totalPages}
                    className="rounded-xl bg-[var(--color-surface)] px-4 py-2 text-xs font-bold text-[var(--color-text)] ring-1 ring-[var(--color-border)] transition-all duration-300 hover:ring-emerald-400 disabled:opacity-30 sm:text-sm"
                  >
                    {t("next")} →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}