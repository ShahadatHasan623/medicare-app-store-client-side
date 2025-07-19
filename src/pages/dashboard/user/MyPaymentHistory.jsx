import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { useState } from "react";
import useAxioseSecure from "../../../hooks/useAxioseSecure";
import useAuth from "../../../hooks/useAuth";


export default function MyPaymentHistory() {
  const { user } = useAuth();
  console.log(user)
  const axiosSecure = useAxioseSecure();

  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [selectedPayment, setSelectedPayment] = useState(null);

  const {
    data: payments = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user-payments", user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const res = await axiosSecure.get(
        `/payments/user/${user.email}`
      );
      console.log("API response data:", res.data);
      return res.data;
    },
    enabled: !!user?.email,
  });
  console.log(payments);

  const filteredPayments =
    filter === "all"
      ? payments
      : payments.filter((item) => item.status === filter);

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPayments = filteredPayments.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("My Payment History", 14, 10);
    autoTable(doc, {
      startY: 20,
      head: [["#", "Amount", "Status", "Transaction ID", "Date"]],
      body: filteredPayments.map((p, i) => [
        i + 1,
        `$${p.amount}`,
        p.status,
        p.transactionId || "N/A",
        new Date(p.date).toLocaleDateString(),
      ]),
    });
    doc.save("payment-history.pdf");
  };

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredPayments.map((p) => ({
        Amount: `$${p.amount}`,
        Status: p.status,
        TransactionID: p.transactionId || "N/A",
        Date: new Date(p.date).toLocaleDateString(),
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Payments");
    XLSX.writeFile(workbook, "payment-history.xlsx");
  };

  if (isLoading)
    return <p className="text-center">Loading payment history...</p>;
  if (error)
    return <p className="text-red-500 text-center">Failed to fetch data</p>;

  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <h2 className="text-xl font-bold">My Payment History</h2>
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="select select-sm border-gray-300"
          >
            <option value="all">All</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>
          <button
            onClick={handleExportPDF}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
          >
            PDF
          </button>
          <button
            onClick={handleExportExcel}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
          >
            Excel
          </button>
        </div>
      </div>

      {filteredPayments.length === 0 ? (
        <p>No payment found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr className="bg-gray-100">
                <th>#</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Transaction ID</th>
                <th>Date</th>
                <th>Invoice</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPayments.map((item, idx) => (
                <tr key={item._id}>
                  <td>{startIndex + idx + 1}</td>
                  <td>${item.amount}</td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded text-white ${
                        item.status === "paid" ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td>{item.transactionId || "N/A"}</td>
                  <td>{new Date(item.date).toLocaleDateString()}</td>
                  <td>
                    <button
                      onClick={() => setSelectedPayment(item)}
                      className="btn btn-sm btn-outline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="mt-4 flex justify-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="btn btn-sm"
            >
              Prev
            </button>
            <span className="px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="btn btn-sm"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Invoice Details</h3>
            <p>
              <strong>Amount:</strong> ${selectedPayment.amount}
            </p>
            <p>
              <strong>Status:</strong> {selectedPayment.status}
            </p>
            <p>
              <strong>Transaction ID:</strong>{" "}
              {selectedPayment.transactionId || "N/A"}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(selectedPayment.date).toLocaleDateString()}
            </p>
            <div className="mt-4 text-right">
              <button
                onClick={() => setSelectedPayment(null)}
                className="btn btn-sm btn-error"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
