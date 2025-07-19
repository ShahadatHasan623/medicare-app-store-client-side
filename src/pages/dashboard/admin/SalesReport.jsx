import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";
import useAxioseSecure from "../../../hooks/useAxioseSecure";

export default function SalesReport() {
  const axiosSecure = useAxioseSecure();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10; // প্রতি পেজে কত ডাটা দেখাবে

  // Fetch sales report
  const { data: sales = [], isLoading } = useQuery({
    queryKey: ["salesReport", startDate, endDate],
    queryFn: async () => {
      let url = "/payments/report";
      if (startDate && endDate) {
        url += `?startDate=${startDate}&endDate=${endDate}`;
      }
      const res = await axiosSecure.get(url);
      return res.data;
    },
  });

  // Table columns
  const columns = [
    { name: "Medicine", selector: (row) => row.medicineName, sortable: true },
    { name: "Seller", selector: (row) => row.sellerEmail, sortable: true },
    { name: "Buyer", selector: (row) => row.buyerEmail, sortable: true },
    { name: "Qty", selector: (row) => row.quantity, sortable: true },
    { name: "Unit Price", selector: (row) => `$${row.unitPrice}`, sortable: true },
    { name: "Total", selector: (row) => `$${row.totalPrice}`, sortable: true },
    { name: "Status", selector: (row) => row.status, sortable: true },
    { name: "Date", selector: (row) => new Date(row.date).toLocaleDateString(), sortable: true },
  ];

  // Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = sales.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(sales.length / rowsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Export to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(sales);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Report");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "sales_report.xlsx");
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Sales Report", 14, 16);
    const tableData = sales.map((s) => [
      s.medicineName,
      s.sellerEmail,
      s.buyerEmail,
      s.quantity,
      s.unitPrice,
      s.totalPrice,
      s.status,
      new Date(s.date).toLocaleDateString(),
    ]);
    doc.autoTable({
      head: [["Medicine", "Seller", "Buyer", "Qty", "Unit Price", "Total", "Status", "Date"]],
      body: tableData,
    });
    doc.save("sales_report.pdf");
  };

  if (isLoading) return <p className="text-center">Loading sales report...</p>;

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4">Sales Report</h2>

      {/* Filter & Export Buttons */}
      <div className="flex flex-wrap gap-4 mb-4 items-center">
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border p-2 rounded" />
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border p-2 rounded" />
        <CSVLink data={sales} filename="sales_report.csv" className="btn btn-primary">
          Export CSV
        </CSVLink>
        <button onClick={exportToExcel} className="btn btn-success">Export Excel</button>
        <button onClick={exportToPDF} className="btn btn-error">Export PDF</button>
      </div>

      {/* Data Table */}
      <DataTable columns={columns} data={currentRows} highlightOnHover striped />

      {/* Custom Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button onClick={handlePrev} disabled={currentPage === 1} className="btn btn-outline btn-sm">
          Prev
        </button>
        <span className="text-sm font-semibold">
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={handleNext} disabled={currentPage === totalPages} className="btn btn-outline btn-sm">
          Next
        </button>
      </div>
    </div>
  );
}
