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
import { FaFileCsv, FaFileExcel, FaFilePdf, FaCalendarAlt, FaSearch } from "react-icons/fa";

export default function SalesReport() {
  const axiosSecure = useAxioseSecure();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10; // প্রফেশনাল রিপোর্টের জন্য ১০টি রো ভালো

  const { data: sales = [], isLoading } = useQuery({
    queryKey: ["salesReport", startDate, endDate],
    queryFn: async () => {
      let url = "/payments/report";
      if (startDate && endDate) url += `?startDate=${startDate}&endDate=${endDate}`;
      const res = await axiosSecure.get(url);
      return res.data;
    },
  });

  const columns = [
    {
      name: "Medicine",
      selector: (row) => row.medicineName,
      sortable: true,
      cell: (row) => (
        <div className="font-bold text-slate-700 py-2">{row.medicineName}</div>
      ),
    },
    { name: "Seller", selector: (row) => row.sellerEmail, sortable: true, hide: 'sm' },
    { name: "Buyer", selector: (row) => row.buyerEmail, sortable: true },
    { name: "Qty", selector: (row) => row.quantity, sortable: true, center: true },
    {
      name: "Total Price",
      selector: (row) => row.totalPrice,
      sortable: true,
      cell: (row) => <span className="text-emerald-600 font-bold">${row.totalPrice.toFixed(2)}</span>
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => (
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
          row.status === 'paid' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
        }`}>
          {row.status}
        </span>
      )
    },
    {
      name: "Date",
      selector: (row) => new Date(row.date).toLocaleDateString(),
      sortable: true,
      right: true 
    },
  ];

  // Pagination Logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = sales.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(sales.length / rowsPerPage);

  // Export Functions
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(sales);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sales");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), "Medicare_Sales_Report.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    doc.setFontSize(18);
    doc.text("Medicare Sales Report", 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);
    
    const tableData = sales.map((s) => [
      s.medicineName, s.sellerEmail, s.buyerEmail, s.quantity, `$${s.unitPrice}`, `$${s.totalPrice}`, s.status, new Date(s.date).toLocaleDateString(),
    ]);
    
    autoTable(doc, {
      head: [["Medicine", "Seller", "Buyer", "Qty", "Unit", "Total", "Status", "Date"]],
      body: tableData,
      startY: 28,
      theme: "striped",
      headStyles: { fillColor: [16, 185, 129], fontSize: 10 },
      styles: { fontSize: 9 }
    });
    doc.save("Sales_Report.pdf");
  };

  if (isLoading) return <Loader />;

  return (
    <div className="min-h-screen  p-4 md:p-8">
      {/* Header Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Sales Analytics</h2>
            <p className="text-slate-500 text-sm mt-1">Review and export your pharmacy transaction data</p>
          </div>

          {/* Date Filter */}
          <div className="flex flex-col sm:flex-row items-center gap-3 bg-slate-100 p-2 rounded-2xl">
            <div className="relative">
              <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="pl-9 pr-3 py-2 dark:text-gray-700 bg-white border-none rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <span className="text-slate-400 text-xs font-bold">TO</span>
            <div className="relative">
              <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="pl-9 pr-3 py-2 dark:text-gray-700 bg-white border-none rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center md:justify-end gap-3 mt-8">
          <CSVLink
            data={sales}
            filename="sales_report.csv"
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 text-white rounded-xl text-sm font-bold hover:bg-slate-900 transition-all shadow-lg shadow-slate-200"
          >
            <FaFileCsv /> CSV
          </CSVLink>
          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
          >
            <FaFileExcel /> Excel
          </button>
          <button
            onClick={exportToPDF}
            className="flex items-center gap-2 px-5 py-2.5 bg-rose-500 text-white rounded-xl text-sm font-bold hover:bg-rose-600 transition-all shadow-lg shadow-rose-100"
          >
            <FaFilePdf /> PDF
          </button>
        </div>
      </div>

      {/* Report Table */}
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <DataTable
          columns={columns}
          data={currentRows}
          highlightOnHover
          responsive
          customStyles={{
            headCells: {
              style: {
                backgroundColor: "#f8fafc",
                color: "#64748b",
                fontWeight: "800",
                textTransform: "uppercase",
                fontSize: "0.75rem",
                letterSpacing: "0.05em",
                paddingTop: "20px",
                paddingBottom: "20px",
              },
            },
            cells: {
              style: {
                paddingTop: "15px",
                paddingBottom: "15px",
                fontSize: "0.9rem",
              },
            },
          }}
        />
        
        {/* Organic Pagination */}
        <div className="flex justify-between items-center px-8 py-6 bg-slate-50 border-t border-slate-100">
          <p className="text-sm text-slate-500 font-medium">
            Showing <span className="text-slate-800 font-bold">{indexOfFirstRow + 1}</span> to <span className="text-slate-800 font-bold">{Math.min(indexOfLastRow, sales.length)}</span> of {sales.length} records
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => { setCurrentPage(currentPage - 1); window.scrollTo(0,0); }}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition-all shadow-sm"
            >
              Previous
            </button>
            <button
              onClick={() => { setCurrentPage(currentPage + 1); window.scrollTo(0,0); }}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 disabled:opacity-30 transition-all shadow-md shadow-emerald-100"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}