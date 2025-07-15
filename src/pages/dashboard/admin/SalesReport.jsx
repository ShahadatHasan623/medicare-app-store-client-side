import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxioseSecure from "../../../hooks/useAxioseSecure";


export default function SalesReport() {
  const axiosSecure = useAxioseSecure();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const { data: sales = [], isLoading, error, refetch } = useQuery(
    ["sales-report", startDate, endDate],
    async () => {
      const params = new URLSearchParams();
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const res = await axiosSecure.get(`/sales-report?${params.toString()}`);
      return res.data;
    },
    {
      enabled: false, // auto fetch off, manual refetch with button
    }
  );

  const handleFilter = () => {
    if (!startDate || !endDate) return alert("Both start and end dates are required");
    refetch();
  };

  return (
    <div>
      <h2>Sales Report</h2>

      <div style={{ marginBottom: "1rem" }}>
        <label>
          Start Date:{" "}
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label style={{ marginLeft: "1rem" }}>
          End Date:{" "}
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
        <button onClick={handleFilter} style={{ marginLeft: "1rem" }}>
          Filter
        </button>
      </div>

      {isLoading && <p>Loading sales report...</p>}
      {error && <p>Error loading sales report</p>}

      <table border="1" cellPadding="8" cellSpacing="0" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Payment ID</th>
            <th>Seller Email</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {sales.length === 0 && (
            <tr>
              <td colSpan={5} style={{ textAlign: "center" }}>
                No sales found.
              </td>
            </tr>
          )}
          {sales.map(({ _id, sellerEmail, amount, status, date }) => (
            <tr key={_id}>
              <td>{_id}</td>
              <td>{sellerEmail}</td>
              <td>${amount}</td>
              <td>{status}</td>
              <td>{new Date(date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
