import React from "react";
import { useQuery } from "@tanstack/react-query";
import { FaDollarSign, FaMoneyBillWave, FaChartPie, FaChartBar } from "react-icons/fa";
import useAxioseSecure from "../../../hooks/useAxioseSecure";
import Loader from "../../../components/Loader";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

export default function AdminHome() {
  const axiosSecure = useAxioseSecure();

  const {
    data: summary,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["adminSummary"],
    queryFn: async () => {
      const res = await axiosSecure.get("/payments/summary/admin");
      return res.data;
    },
  });

  if (isLoading) return <Loader />;
  if (isError) return (
    <div className="p-6 text-center text-red-500 font-semibold">
      Error fetching summary: {error.message}
    </div>
  );

  // চার্টের জন্য ডাটা ফরম্যাট করা
  const chartData = [
    { name: 'Paid', value: summary?.paidTotal || 0, color: '#10B981' }, // Emerald-500
    { name: 'Pending', value: summary?.pendingTotal || 0, color: '#F59E0B' }, // Amber-500
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-4 lg:px-12 py-10">
      <h2 className="text-3xl font-bold text-slate-800 mb-10 text-center tracking-tight">
        Admin Revenue Analytics
      </h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto mb-12">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 flex items-center gap-5">
          <div className="p-4 bg-emerald-100 rounded-xl text-emerald-600">
            <FaMoneyBillWave size={30} />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">Total Paid</p>
            <h3 className="text-2xl font-bold text-slate-800">${summary?.paidTotal?.toFixed(2) || "0.00"}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-amber-100 flex items-center gap-5">
          <div className="p-4 bg-amber-100 rounded-xl text-amber-600">
            <FaDollarSign size={30} />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">Total Pending</p>
            <h3 className="text-2xl font-bold text-slate-800">${summary?.pendingTotal?.toFixed(2) || "0.00"}</h3>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        
        {/* Pie Chart Card */}
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <FaChartPie className="text-emerald-500" />
            <h3 className="font-bold text-slate-700">Revenue Distribution</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart Card */}
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <FaChartBar className="text-blue-500" />
            <h3 className="font-bold text-slate-700">Financial Comparison</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip cursor={{fill: '#F8FAFC'}} />
                <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} opacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}