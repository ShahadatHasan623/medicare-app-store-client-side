import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import {
  FaDownload, FaFileInvoiceDollar, FaRegCalendarAlt, FaUserAlt,
  FaCheckCircle, FaBoxOpen, FaTag, FaShieldAlt, FaPrint,
} from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import useAxios from "../../hooks/useAxios";
import MedicareLogo from "../../components/logo/MedicareLogo";
import { ReTitle } from "re-title";
import { useTranslation } from "react-i18next";

/* ================= 📄 PDF Document — emerald branded ================= */
const pdfStyles = StyleSheet.create({
  page: { padding: 40, fontSize: 11, fontFamily: "Helvetica", color: "#334155" },
  topStrip: { height: 6, backgroundColor: "#10b981", marginBottom: 24, borderRadius: 3 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 },
  brandName: { fontSize: 22, fontWeight: "bold", color: "#10b981" },
  brandSub: { fontSize: 9, color: "#94a3b8", marginTop: 2 },
  invoiceTag: { fontSize: 26, fontWeight: "bold", color: "#0f172a", textAlign: "right" },
  paidBadge: { fontSize: 9, color: "#059669", backgroundColor: "#d1fae5", paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12, alignSelf: "flex-end", marginTop: 6 },
  infoSection: { flexDirection: "row", justifyContent: "space-between", marginBottom: 24 },
  label: { fontSize: 8, fontWeight: "bold", color: "#94a3b8", marginBottom: 3, letterSpacing: 1 },
  table: { marginTop: 8 },
  tableRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#f1f5f9", paddingVertical: 9, alignItems: "center" },
  tableHeader: { backgroundColor: "#ecfdf5", borderBottomWidth: 2, borderBottomColor: "#10b981", borderRadius: 4 },
  col1: { width: "40%", fontWeight: "bold", color: "#0f172a" },
  col2: { width: "15%", textAlign: "center" },
  col3: { width: "22%", textAlign: "right" },
  col4: { width: "23%", textAlign: "right", fontWeight: "bold" },
  totalSection: { marginTop: 24, alignItems: "flex-end" },
  totalBox: { width: 220, backgroundColor: "#ecfdf5", borderRadius: 8, padding: 14, borderWidth: 1, borderColor: "#a7f3d0" },
  totalRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  grandTotal: { fontSize: 17, fontWeight: "bold", color: "#059669" },
  footer: { marginTop: "auto", textAlign: "center", fontSize: 8, color: "#94a3b8", paddingTop: 20, borderTopWidth: 1, borderTopColor: "#f1f5f9" },
});

const InvoiceDocument = ({ invoiceData, user, labels }) => (
  <Document>
    <Page style={pdfStyles.page}>
      {/* Top gradient strip */}
      <View style={pdfStyles.topStrip} />

      {/* Header */}
      <View style={pdfStyles.headerRow}>
        <View>
          <Text style={pdfStyles.brandName}>MediCare</Text>
          <Text style={pdfStyles.brandSub}>{labels.footerShort}</Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={pdfStyles.invoiceTag}>{labels.invoiceTitle}</Text>
          <Text style={pdfStyles.paidBadge}>✓ {labels.paidSuccessfully}</Text>
        </View>
      </View>

      {/* Info */}
      <View style={pdfStyles.infoSection}>
        <View>
          <Text style={pdfStyles.label}>{labels.billedTo}</Text>
          <Text style={{ fontSize: 13, fontWeight: "bold" }}>
            {user?.displayName || labels.valuedCustomer}
          </Text>
          <Text style={{ color: "#64748b" }}>{invoiceData.buyerEmail}</Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={pdfStyles.label}>{labels.invoiceId}</Text>
          <Text style={{ fontWeight: "bold", color: "#059669" }}>
            #{invoiceData._id.slice(-8).toUpperCase()}
          </Text>
          <Text style={{ color: "#64748b", marginTop: 3 }}>
            {labels.issuedOn}: {new Date(invoiceData.date).toLocaleDateString()}
          </Text>
        </View>
      </View>

      {/* Table */}
      <View style={pdfStyles.table}>
        <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]}>
          <Text style={[pdfStyles.col1, { color: "#065f46", fontSize: 9, letterSpacing: 1 }]}>{labels.itemDetails}</Text>
          <Text style={[pdfStyles.col2, { color: "#065f46", fontSize: 9, letterSpacing: 1 }]}>QTY</Text>
          <Text style={[pdfStyles.col3, { color: "#065f46", fontSize: 9, letterSpacing: 1 }]}>{labels.unitPrice}</Text>
          <Text style={[pdfStyles.col4, { color: "#065f46", fontSize: 9, letterSpacing: 1 }]}>{labels.total}</Text>
        </View>
        {invoiceData.cartItems.map((item, idx) => (
          <View style={pdfStyles.tableRow} key={idx}>
            <Text style={pdfStyles.col1}>{item.name}</Text>
            <Text style={pdfStyles.col2}>{item.quantity}</Text>
            <Text style={pdfStyles.col3}>৳{item.unitPrice.toFixed(2)}</Text>
            <Text style={[pdfStyles.col4, { color: "#059669" }]}>
              ৳{(item.quantity * item.unitPrice).toFixed(2)}
            </Text>
          </View>
        ))}
      </View>

      {/* Total */}
      <View style={pdfStyles.totalSection}>
        <View style={pdfStyles.totalBox}>
          <View style={pdfStyles.totalRow}>
            <Text style={{ fontSize: 9, color: "#64748b", fontWeight: "bold" }}>{labels.grandTotal}</Text>
            <Text style={pdfStyles.grandTotal}>৳{invoiceData.totalPrice.toFixed(2)}</Text>
          </View>
          <Text style={{ fontSize: 7, color: "#94a3b8", marginTop: 6 }}>
            TXN: {invoiceData.transactionId}
          </Text>
        </View>
      </View>

      {/* Footer */}
      <Text style={pdfStyles.footer}>{labels.invoiceFooter}</Text>
    </Page>
  </Document>
);

/* ================= 🖥️ UI Page ================= */
export default function InvoicePage() {
  const { id } = useParams();
  const axiosSecure = useAxios();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await axiosSecure.get(`/payments/${id}`);
        setInvoiceData(res.data);
      } catch {
        setError(t("failedToLoadInvoice"));
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [id, axiosSecure]);

  /* ⏳ Loading skeleton — invoice shape */
  if (loading)
    return (
      <div className="min-h-screen bg-[var(--color-bg)] px-4 py-12">
        <div className="mx-auto max-w-4xl animate-pulse space-y-6">
          <div className="h-12 w-48 rounded-2xl bg-slate-300/40" />
          <div className="h-40 rounded-3xl bg-slate-300/40" />
          <div className="h-64 rounded-3xl bg-slate-300/30" />
          <div className="h-24 rounded-3xl bg-slate-300/30" />
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-4">
        <div className="flex max-w-md flex-col items-center gap-4 rounded-3xl border border-rose-200 bg-rose-50/60 p-10 text-center dark:border-rose-500/20 dark:bg-rose-500/10">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-rose-500/15 text-rose-500">
            <FaFileInvoiceDollar className="text-xl" />
          </span>
          <p className="text-lg font-bold text-rose-600">{error}</p>
        </div>
      </div>
    );

  /* 📄 PDF labels — translated */
  const pdfLabels = {
    invoiceTitle: t("invoiceTitle").toUpperCase(),
    paidSuccessfully: t("paidSuccessfully"),
    billedTo: t("billedTo").toUpperCase(),
    invoiceId: t("invoiceId").toUpperCase(),
    issuedOn: t("issuedOn"),
    itemDetails: t("itemDetails").toUpperCase(),
    unitPrice: t("unitPrice").toUpperCase(),
    total: t("total").toUpperCase(),
    grandTotal: t("grandTotal"),
    footerShort: t("tagline"),
    invoiceFooter: t("invoiceFooter"),
  };

  return (
    <>
      <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pop-badge {
          0% { transform: scale(0); opacity: 0; }
          70% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-fade-up   { animation: fade-up .5s cubic-bezier(.16,1,.3,1) both; }
        .animate-pop-badge { animation: pop-badge .5s cubic-bezier(.16,1,.3,1) .2s both; }
      `}</style>

      <div className="min-h-screen bg-[var(--color-bg)] px-4 py-10 transition-colors duration-300 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <ReTitle title={t("invoiceDocTitle")} />

          {/* ================= 🔝 Top actions ================= */}
          <div className="animate-fade-up mb-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <MedicareLogo />
            <div className="flex w-full items-center gap-3 sm:w-auto">
              {/* Print — browser print dialog */}
              <button
                onClick={() => window.print()}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[var(--color-surface)] px-5 py-2.5 text-sm font-bold text-[var(--color-text)] ring-1 ring-[var(--color-border)] shadow-sm transition-all duration-300 hover:ring-emerald-400 active:scale-95 sm:flex-none"
              >
                <FaPrint className="text-xs" />
                Print
              </button>

              {/* PDF download */}
              <PDFDownloadLink
                document={
                  <InvoiceDocument
                    invoiceData={invoiceData}
                    user={user}
                    labels={pdfLabels}
                  />
                }
                fileName={`invoice-${invoiceData._id}.pdf`}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:shadow-emerald-500/50 active:scale-95 sm:flex-none"
              >
                {({ loading }) =>
                  loading ? (
                    <span className="animate-pulse">{t("processing")}</span>
                  ) : (
                    <>
                      <FaDownload /> {t("downloadPdf")}
                    </>
                  )
                }
              </PDFDownloadLink>
            </div>
          </div>

          {/* ================= 🧾 Main Invoice Card ================= */}
          <div className="animate-fade-up overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl shadow-emerald-900/10">
            {/* 🌈 Gradient header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-6 py-7 sm:px-8">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute -left-6 -top-10 h-32 w-32 rounded-full bg-white/30 blur-2xl" />
                <div className="absolute bottom-0 right-10 h-24 w-24 rounded-full bg-white/20 blur-xl" />
              </div>

              <div className="relative flex flex-wrap items-start justify-between gap-4">
                <div>
                  {/* ✅ Paid badge — pop animation */}
                  <span className="animate-pop-badge mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white ring-1 ring-white/30 backdrop-blur">
                    <FaCheckCircle /> {t("paidSuccessfully")}
                  </span>
                  <h1 className="text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
                    {t("invoiceTitle")}
                  </h1>
                  <p className="mt-1.5 flex items-center gap-2 text-sm text-white/75">
                    <FaFileInvoiceDollar className="text-xs" />
                    {t("invoiceId")}:
                    <span className="rounded-md bg-white/15 px-2 py-0.5 font-mono text-xs font-bold text-white">
                      #{invoiceData._id.slice(-10)}
                    </span>
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
                    {t("issuedOn")}
                  </p>
                  <p className="mt-1 flex items-center gap-2 font-bold text-white">
                    <FaRegCalendarAlt className="text-white/70" />
                    {new Date(invoiceData.date).toLocaleDateString(undefined, {
                      dateStyle: "long",
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* 👤 Billed to */}
            <div className="p-6 sm:p-8">
              <h3 className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-muted)]">
                {t("billedTo")}
              </h3>
              <div className="flex items-center gap-4 rounded-2xl bg-emerald-500/5 p-4 ring-1 ring-emerald-500/15">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25">
                  <FaUserAlt className="text-sm" />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-black text-[var(--color-text)]">
                    {user?.displayName || t("valuedCustomer")}
                  </p>
                  <p className="truncate text-sm text-[var(--color-muted)]">
                    {invoiceData.buyerEmail}
                  </p>
                </div>
                {/* Items count chip */}
                <span className="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-600 ring-1 ring-emerald-500/20">
                  <FaBoxOpen className="text-[10px]" />
                  {invoiceData.cartItems?.length ?? 0}
                </span>
              </div>
            </div>

            {/* 📋 Items table */}
            <div className="px-4 pb-4 sm:px-8">
              <div className="overflow-x-auto rounded-2xl border border-[var(--color-border)]">
                <table className="w-full min-w-[520px] border-collapse text-left">
                  <thead>
                    <tr className="bg-emerald-500/10 text-[10px] font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
                      <th className="px-4 py-3.5 sm:px-6">{t("itemDetails")}</th>
                      <th className="px-4 py-3.5 text-center sm:px-6">{t("qty")}</th>
                      <th className="px-4 py-3.5 text-right sm:px-6">{t("unitPrice")}</th>
                      <th className="px-4 py-3.5 text-right sm:px-6">{t("total")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)]">
                    {invoiceData.cartItems.map((item, idx) => (
                      <tr
                        key={idx}
                        className="transition-colors hover:bg-emerald-500/5"
                      >
                        <td className="px-4 py-3.5 font-bold text-[var(--color-text)] sm:px-6">
                          <span className="flex items-center gap-2">
                            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-emerald-500/10 text-[10px] text-emerald-600">
                              {idx + 1}
                            </span>
                            <span className="truncate">{item.name}</span>
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-center font-semibold text-[var(--color-muted)] sm:px-6">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-3.5 text-right font-medium text-[var(--color-muted)] sm:px-6">
                          ৳{item.unitPrice.toFixed(2)}
                        </td>
                        <td className="px-4 py-3.5 text-right font-black text-emerald-600 sm:px-6">
                          ৳{(item.quantity * item.unitPrice).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 💰 Bottom summary */}
            <div className="flex flex-col items-stretch border-t border-[var(--color-border)] bg-[var(--color-bg)] p-6 sm:flex-row sm:items-start sm:justify-between sm:p-8">
              {/* Transaction verified */}
              <div className="mb-5 sm:mb-0">
                <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[var(--color-muted)]">
                  <FaShieldAlt className="text-emerald-500" />
                  {t("transactionVerified")}
                </p>
                <p className="mt-1.5 break-all font-mono text-xs text-[var(--color-muted)]">
                  {invoiceData.transactionId}
                </p>
              </div>

              {/* Total box */}
              <div className="w-full rounded-2xl bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 p-5 ring-1 ring-emerald-500/20 sm:w-64">
                <div className="flex items-center justify-between text-sm font-semibold text-[var(--color-muted)]">
                  <span className="flex items-center gap-1.5">
                    <FaTag className="text-xs text-emerald-500" />
                    {t("subtotal")}
                  </span>
                  <span className="tabular-nums">৳{invoiceData.totalPrice.toFixed(2)}</span>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-dashed border-emerald-500/25 pt-3">
                  <span className="text-sm font-black uppercase tracking-wide text-[var(--color-text)]">
                    {t("grandTotal")}
                  </span>
                  <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-2xl font-black tabular-nums text-transparent">
                    ৳{invoiceData.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 📝 Footer note */}
          <p className="mx-auto mt-8 max-w-md text-center text-xs leading-relaxed text-[var(--color-muted)]">
            {t("invoiceFooter")}
          </p>
        </div>
      </div>
    </>
  );
}