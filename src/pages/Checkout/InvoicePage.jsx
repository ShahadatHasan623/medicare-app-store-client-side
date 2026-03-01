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
import { FaDownload, FaFileInvoiceDollar, FaRegCalendarAlt, FaUserAlt, FaCheckCircle } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import useAxios from "../../hooks/useAxios";
import Loader from "../../components/Loader";
import MedicareLogo from "../../components/logo/MedicareLogo";

// PDF Styles
const pdfStyles = StyleSheet.create({
  page: { padding: 40, fontSize: 11, fontFamily: "Helvetica", color: "#333" },
  header: { fontSize: 24, marginBottom: 20, fontWeight: "bold", color: "#2563eb", textAlign: "right" },
  infoSection: { flexDirection: "row", justifyContent: "space-between", marginBottom: 30 },
  label: { fontWeight: "bold", color: "#666", marginBottom: 2 },
  table: { marginTop: 20 },
  tableRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#eee", paddingVertical: 8, alignItems: "center" },
  tableHeader: { backgroundColor: "#f8fafc", borderBottomWidth: 2, borderBottomColor: "#cbd5e1" },
  col1: { width: "40%" },
  col2: { width: "20%", textAlign: "center" },
  col3: { width: "20%", textAlign: "right" },
  col4: { width: "20%", textAlign: "right" },
  totalSection: { marginTop: 30, borderTopWidth: 2, borderTopColor: "#2563eb", paddingTop: 10, alignItems: "flex-end" },
  totalAmount: { fontSize: 16, fontWeight: "bold", color: "#2563eb" }
});

const InvoiceDocument = ({ invoiceData, user }) => (
  <Document>
    <Page style={pdfStyles.page}>
      <Text style={pdfStyles.header}>INVOICE</Text>
      
      <View style={pdfStyles.infoSection}>
        <View>
          <Text style={pdfStyles.label}>BILLED TO:</Text>
          <Text style={{ fontSize: 14, fontWeight: "bold" }}>{user?.displayName || "Customer"}</Text>
          <Text>{invoiceData.buyerEmail}</Text>
        </View>
        <View style={{ textAlign: "right" }}>
          <Text style={pdfStyles.label}>INVOICE DETAILS:</Text>
          <Text>ID: #{invoiceData._id.slice(-8).toUpperCase()}</Text>
          <Text>Date: {new Date(invoiceData.date).toLocaleDateString()}</Text>
        </View>
      </View>

      <View style={pdfStyles.table}>
        <View style={[pdfStyles.tableRow, pdfStyles.tableHeader]}>
          <Text style={[pdfStyles.col1, { fontWeight: "bold" }]}>Item Description</Text>
          <Text style={[pdfStyles.col2, { fontWeight: "bold" }]}>Qty</Text>
          <Text style={[pdfStyles.col3, { fontWeight: "bold" }]}>Unit Price</Text>
          <Text style={[pdfStyles.col4, { fontWeight: "bold" }]}>Total</Text>
        </View>
        {invoiceData.cartItems.map((item, idx) => (
          <View style={pdfStyles.tableRow} key={idx}>
            <Text style={pdfStyles.col1}>{item.name}</Text>
            <Text style={pdfStyles.col2}>{item.quantity}</Text>
            <Text style={pdfStyles.col3}>${item.unitPrice.toFixed(2)}</Text>
            <Text style={pdfStyles.col4}>${(item.quantity * item.unitPrice).toFixed(2)}</Text>
          </View>
        ))}
      </View>

      <View style={pdfStyles.totalSection}>
        <Text style={pdfStyles.label}>GRAND TOTAL</Text>
        <Text style={pdfStyles.totalAmount}>${invoiceData.totalPrice.toFixed(2)}</Text>
        <Text style={{ marginTop: 20, fontSize: 8, color: "#94a3b8" }}>Transaction ID: {invoiceData.transactionId}</Text>
      </View>
    </Page>
  </Document>
);

export default function InvoicePage() {
  const { id } = useParams();
  const axiosSecure = useAxios();
  const { user } = useAuth();
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await axiosSecure.get(`/payments/${id}`);
        setInvoiceData(res.data);
      } catch (err) {
        setError("Failed to load invoice data");
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [id, axiosSecure]);

  if (loading) return <Loader />;
  if (error) return <div className="text-center py-20 text-red-500 font-bold">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        
        {/* Top Actions */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <MedicareLogo />
          <PDFDownloadLink
            document={<InvoiceDocument invoiceData={invoiceData} user={user} />}
            fileName={`invoice-${invoiceData._id}.pdf`}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl shadow-lg shadow-blue-200 dark:shadow-none transition-all active:scale-95"
          >
            {({ loading }) => (
              loading ? "Processing..." : <><FaDownload /> Download PDF</>
            )}
          </PDFDownloadLink>
        </div>

        {/* Main Invoice Card */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800">
          
          {/* Invoice Header Section */}
          <div className="p-8 border-b dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
            <div className="flex flex-wrap justify-between items-start gap-4">
              <div>
                <span className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 mb-3 w-fit">
                  <FaCheckCircle /> Paid Successfully
                </span>
                <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Invoice</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                  <FaFileInvoiceDollar /> ID: <span className="font-mono text-blue-600">#{invoiceData._id.slice(-10)}</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Issued On</p>
                <p className="text-gray-900 dark:text-white font-semibold flex items-center justify-end gap-2">
                  <FaRegCalendarAlt className="text-blue-500" /> {new Date(invoiceData.date).toLocaleDateString(undefined, { dateStyle: 'long' })}
                </p>
              </div>
            </div>
          </div>

          {/* Billing Info */}
          <div className="grid md:grid-cols-2 gap-8 p-8">
            <div className="space-y-2">
              <h3 className="text-gray-400 text-xs font-black uppercase tracking-widest">Billed To</h3>
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border dark:border-gray-700">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center">
                  <FaUserAlt />
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">{user?.displayName || "Valued Customer"}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{invoiceData.buyerEmail}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="px-8 pb-4">
            <div className="overflow-x-auto rounded-2xl border dark:border-gray-800">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                    <th className="px-6 py-4">Item Details</th>
                    <th className="px-6 py-4 text-center">Qty</th>
                    <th className="px-6 py-4 text-right">Unit Price</th>
                    <th className="px-6 py-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-gray-800">
                  {invoiceData.cartItems.map((item, idx) => (
                    <tr key={idx} className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-800 dark:text-gray-200">{item.name}</td>
                      <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-400 font-medium">{item.quantity}</td>
                      <td className="px-6 py-4 text-right text-gray-600 dark:text-gray-400 font-medium">${item.unitPrice.toFixed(2)}</td>
                      <td className="px-6 py-4 text-right font-bold text-blue-600 dark:text-blue-400">${(item.quantity * item.unitPrice).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Summary */}
          <div className="p-8 bg-gray-50 dark:bg-gray-800/30 flex flex-col items-end">
            <div className="w-full md:w-64 space-y-3">
              <div className="flex justify-between text-gray-500 dark:text-gray-400">
                <span>Subtotal</span>
                <span className="font-semibold">${invoiceData.totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500 dark:text-gray-400">
                <span className="font-semibold">$0.00</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t dark:border-gray-700">
                <span className="text-gray-900 dark:text-white font-bold">Grand Total</span>
                <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
                  ${invoiceData.totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
            
            <div className="mt-8 text-center md:text-right w-full">
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Transaction Verified</p>
              <p className="text-xs font-mono text-gray-500 dark:text-gray-500 mt-1">{invoiceData.transactionId}</p>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-gray-400 dark:text-gray-600 text-xs mt-8">
          Thank you for choosing Medicare. This is a computer-generated invoice. No signature required.
        </p>
      </div>
    </div>
  );
}