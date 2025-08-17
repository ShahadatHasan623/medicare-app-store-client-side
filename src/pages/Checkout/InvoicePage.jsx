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
import useAuth from "../../hooks/useAuth";
import useAxios from "../../hooks/useAxios";
import Loader from "../../components/Loader";
import MedicareLogo from "../../components/logo/MedicareLogo";

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 12,
    fontFamily: "Helvetica",
  },
  section: {
    marginBottom: 10,
  },
  header: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableColHeader: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: "#eee",
    padding: 4,
    fontWeight: "bold",
  },
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 4,
  },
});

const InvoiceDocument = ({ invoiceData, user }) => (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.header}>INVOICE</Text>
      <View style={styles.section}>
        <Text>Invoice ID: {invoiceData._id}</Text>
        <Text>Date: {new Date(invoiceData.date).toLocaleDateString()}</Text>
      </View>
      <View style={styles.section}>
        <Text>Billed To: {user?.displayName || "Customer"}</Text>
        <Text>Email: {invoiceData.buyerEmail}</Text>
      </View>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.tableColHeader}>Item</Text>
          <Text style={styles.tableColHeader}>Qty</Text>
          <Text style={styles.tableColHeader}>Price</Text>
          <Text style={styles.tableColHeader}>Total</Text>
        </View>
        {invoiceData.cartItems.map((item, idx) => (
          <View style={styles.tableRow} key={idx}>
            <Text style={styles.tableCol}>{item.name}</Text>
            <Text style={styles.tableCol}>{item.quantity}</Text>
            <Text style={styles.tableCol}>${item.unitPrice.toFixed(2)}</Text>
            <Text style={styles.tableCol}>
              ${(item.quantity * item.unitPrice).toFixed(2)}
            </Text>
          </View>
        ))}
      </View>
      <View style={[styles.section, { marginTop: 10, alignItems: "flex-end" }]}>
        <Text>Total: ${invoiceData.totalPrice.toFixed(2)}</Text>
        <Text style={{ fontSize: 10, color: "#555" }}>
          Transaction ID: {invoiceData.transactionId}
        </Text>
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
      setLoading(true);
      setError(null);
      try {
        const res = await axiosSecure.get(`/payments/${id}`);
        setInvoiceData(res.data);
      } catch (err) {
        setError("Failed to load invoice data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [id, axiosSecure]);

  if (loading) return <Loader />;
  if (error)
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400 text-lg">{error}</p>
      </div>
    );

  if (!invoiceData) return null;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg mt-10 transition-colors">
      <MedicareLogo />

      {/* Download PDF Button */}
      <div className="mb-6 text-center sm:text-right">
        <PDFDownloadLink
          document={<InvoiceDocument invoiceData={invoiceData} user={user} />}
          fileName={`invoice-${invoiceData._id}.pdf`}
          className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2 rounded-lg shadow hover:from-blue-700 hover:to-blue-800 transition text-sm sm:text-base"
        >
          {({ loading }) =>
            loading ? "Preparing document..." : "Download Invoice PDF"
          }
        </PDFDownloadLink>
      </div>

      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">
        Invoice Preview
      </h1>

      <div className="text-sm sm:text-base text-gray-800 dark:text-gray-200">
        <p>
          <strong>Invoice ID:</strong> {invoiceData._id}
        </p>
        <p>
          <strong>Date:</strong>{" "}
          {new Date(invoiceData.date).toLocaleDateString()}
        </p>

        <div className="mt-4">
          <h2 className="font-semibold mb-2">Billed To:</h2>
          <p>{user?.displayName || "Customer"}</p>
          <p>{invoiceData.buyerEmail}</p>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="mt-6 overflow-x-auto">
        <table className="w-full border border-gray-300 dark:border-gray-700 text-sm sm:text-base">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
              <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left">
                Item
              </th>
              <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-right">
                Qty
              </th>
              <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-right">
                Price
              </th>
              <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-right">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.cartItems.map((item, idx) => (
              <tr
                key={idx}
                className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2">
                  {item.name}
                </td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-right">
                  {item.quantity}
                </td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-right">
                  ${item.unitPrice.toFixed(2)}
                </td>
                <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-right">
                  ${(item.quantity * item.unitPrice).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Total Section */}
      <div className="mt-6 text-right">
        <p className="font-semibold text-xl text-gray-900 dark:text-gray-100">
          Total: ${invoiceData.totalPrice.toFixed(2)}
        </p>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
          Transaction ID: {invoiceData.transactionId}
        </p>
      </div>
    </div>
  );
}
