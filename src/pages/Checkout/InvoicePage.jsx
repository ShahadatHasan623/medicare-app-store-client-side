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
  logoText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0077cc",
    textAlign: "right",
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

  if (loading) {
    return <Loader></Loader>;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }

  if (!invoiceData) return null;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
       <MedicareLogo></MedicareLogo>
      <div className="mb-6 text-right">
        <PDFDownloadLink
          document={<InvoiceDocument invoiceData={invoiceData} user={user} />}
          fileName={`invoice-${invoiceData._id}.pdf`}
          className="inline-block bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
        >
          {({ loading }) =>
            loading ? "Preparing document..." : "Download Invoice PDF"
          }
        </PDFDownloadLink>
      </div>
      <h1 className="text-3xl font-bold mb-4 text-center">Invoice Preview</h1>
      <p>
        <strong>Invoice ID:</strong> {invoiceData._id}
      </p>
      <p>
        <strong>Date:</strong> {new Date(invoiceData.date).toLocaleDateString()}
      </p>

      <div className="mt-4">
        <h2 className="font-semibold mb-2">Billed To:</h2>
        <p>{user?.displayName || "Customer"}</p>
        <p>{invoiceData.buyerEmail}</p>
      </div>

      <table className="w-full border border-gray-300 mt-6">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left">Item</th>
            <th className="border border-gray-300 px-4 py-2 text-right">Qty</th>
            <th className="border border-gray-300 px-4 py-2 text-right">
              Price
            </th>
            <th className="border border-gray-300 px-4 py-2 text-right">
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {invoiceData.cartItems.map((item, idx) => (
            <tr key={idx}>
              <td className="border border-gray-300 px-4 py-2">{item.name}</td>
              <td className="border border-gray-300 px-4 py-2 text-right">
                {item.quantity}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-right">
                ${item.unitPrice.toFixed(2)}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-right">
                ${(item.quantity * item.unitPrice).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 text-right">
        <p className="font-semibold text-lg">
          Total: ${invoiceData.totalPrice.toFixed(2)}
        </p>
        <p className="text-sm text-gray-600">
          Transaction ID: {invoiceData.transactionId}
        </p>
      </div>
    </div>
  );
}
