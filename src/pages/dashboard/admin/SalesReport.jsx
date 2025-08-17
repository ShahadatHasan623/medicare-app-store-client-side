import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DataTable from "react-data-table-component";
import { CSVLink } from "react-csv";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import useAxioseSecure from "../../../hooks/useAxioseSecure";
import Loader from "../../../components/Loader";

export default function SalesReport() {
  const axiosSecure = useAxioseSecure();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6;

  // Fetch sales report
  const { data: sales = [], isLoading } = useQuery({
    queryKey: ["salesReport", startDate, endDate],
    queryFn: async () => {
      let url = "/payments/report";
      if (startDate && endDate) url += `?startDate=${startDate}&endDate=${endDate}`;
      const res = await axiosSecure.get(url);
      return res.data;
    },
  });

  // Table columns
  const columns = [
    { name: "Medicine", selector: (row) => row.medicineName, sortable: true, wrap: true },
    { name: "Seller", selector: (row) => row.sellerEmail, sortable: true, wrap: true },
    { name: "Buyer", selector: (row) => row.buyerEmail, sortable: true, wrap: true },
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
  const handleNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const handlePrev = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  // Export Functions
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(sales);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Report");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), "sales_report.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    doc.text("Sales Report", 14, 16);
    const tableData = sales.map((s) => [
      s.medicineName,
      s.sellerEmail,
      s.buyerEmail,
      s.quantity,
      `$${s.unitPrice}`,
      `$${s.totalPrice}`,
      s.status,
      new Date(s.date).toLocaleDateString(),
    ]);
    autoTable(doc, {
      head: [["Medicine","Seller","Buyer","Qty","Unit Price","Total","Status","Date"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [16, 185, 129] },
    });
    doc.save("sales_report.pdf");
  };

  if (isLoading) return <Loader />;

  return (
    <div className="min-h-screen bg-[var(--color-bg)] px-4 md:px-10 py-6 md:py-10">
      {/* Header */}
      <h2 className="text-[2.618rem] md:text-[3.618rem] font-extrabold text-[var(--color-primary)] mb-[1.618rem] md:mb-[2.618rem] text-center">
        Sales Report
      </h2>

      {/* Filter & Export Buttons */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-[1.618rem] mb-[1.618rem] flex-wrap">
        <div className="flex flex-wrap gap-[1rem]">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[var(--color-primary)]"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-[var(--color-primary)]"
          />
        </div>
        <div className="flex flex-wrap gap-[1rem] justify-start md:justify-end">
          <CSVLink
            data={sales}
            filename="sales_report.csv"
            className="px-4 py-2 bg-[var(--color-secondary)] text-white rounded hover:bg-blue-700 transition"
          >
            Export CSV
          </CSVLink>
          <button
            onClick={exportToExcel}
            className="px-4 py-2 bg-[var(--color-primary)] text-white rounded hover:bg-green-700 transition"
          >
            Export Excel
          </button>
          <button
            onClick={exportToPDF}
            className="px-4 py-2 bg-[var(--color-error)] text-white rounded hover:bg-red-700 transition"
          >
            Export PDF
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto rounded-lg shadow-lg mb-[1.618rem]">
        <DataTable
          columns={columns}
          data={currentRows}
          highlightOnHover
          striped
          responsive
          pagination={false}
          dense
          customStyles={{
            header: { style: { fontSize: '1.618rem', fontWeight: 'bold', color: 'var(--color-text)' } },
            rows: { style: { minHeight: '3.618rem', fontSize: '1rem', color: 'var(--color-text)' } },
            headCells: { style: { backgroundColor: 'var(--color-primary)', color: '#fff', fontWeight: 'bold' } },
          }}
        />
      </div>

      {/* Pagination */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-[1.618rem]">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 transition"
        >
          Prev
        </button>
        <span className="font-medium text-[var(--color-text)] text-lg">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
}
