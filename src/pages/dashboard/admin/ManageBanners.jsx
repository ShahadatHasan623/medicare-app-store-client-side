import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxioseSecure from "../../../hooks/useAxioseSecure";
import Loader from "../../../components/Loader";
import { FaImages, FaToggleOn, FaToggleOff, FaUserEdit, FaInfoCircle } from "react-icons/fa";

export default function ManageBanner() {
  const axiosSecure = useAxioseSecure();
  const queryClient = useQueryClient();

  const { data: ads = [], isLoading } = useQuery({
    queryKey: ["allAdvertisements"],
    queryFn: async () => {
      const res = await axiosSecure.get("/advertisements/admin/all");
      return res.data || [];
    },
  });

  const toggleSliderMutation = useMutation({
    mutationFn: (adId) =>
      axiosSecure.patch(`/advertisements/admin/toggle-slider/${adId}`),
    onSuccess: (data) => {
      Swal.fire({
        icon: "success",
        title: "Status Updated",
        text: data.data.message,
        confirmButtonColor: "#10B981",
      });
      queryClient.invalidateQueries(["allAdvertisements"]);
    },
    onError: () => {
      Swal.fire("Error", "Failed to update slider status", "error");
    },
  });

  if (isLoading) return <Loader />;

  return (
    <div className="p-4 md:p-8 min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 rounded-2xl">
            <FaImages className="text-emerald-500 text-3xl" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white tracking-tight">
              Banner Management
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm italic">
              Control which advertisements appear on the homepage slider.
            </p>
          </div>
        </div>
        <div className="px-5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm text-sm font-bold text-slate-600 dark:text-slate-300">
          Total Ads: <span className="text-emerald-500">{ads.length}</span>
        </div>
      </div>

      {ads.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
          <p className="text-slate-400 font-medium">No medical advertisements found in the database.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-bottom border-slate-100 dark:border-slate-800">
                  <th className="p-5 text-xs font-black uppercase tracking-wider">Preview</th>
                  <th className="p-5 text-xs font-black uppercase tracking-wider">Medicine & Description</th>
                  <th className="p-5 text-xs font-black uppercase tracking-wider">Seller Contact</th>
                  <th className="p-5 text-xs font-black uppercase tracking-wider text-center">Status</th>
                  <th className="p-5 text-xs font-black uppercase tracking-wider text-right">Visibility Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {ads.map((ad) => (
                  <tr
                    key={ad._id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all group"
                  >
                    <td className="p-5">
                      <div className="relative w-24 h-16 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                        <img
                          src={ad.medicineImage}
                          alt={ad.medicineName}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    </td>
                    <td className="p-5">
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                        {ad.medicineName}
                      </h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1 max-w-xs mt-1">
                        <FaInfoCircle className="inline mr-1 text-xs opacity-50" />
                        {ad.description}
                      </p>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <FaUserEdit className="text-emerald-500/70" />
                        {ad.sellerEmail}
                      </div>
                    </td>
                    <td className="p-5 text-center">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        ad.isOnSlider 
                        ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" 
                        : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-500"
                      }`}>
                        {ad.isOnSlider ? "Live on Slider" : "Inactive"}
                      </div>
                    </td>
                    <td className="p-5 text-right">
                      <button
                        onClick={() => toggleSliderMutation.mutate(ad._id)}
                        disabled={toggleSliderMutation.isLoading}
                        className={`inline-flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-sm transition-all active:scale-95 disabled:opacity-50 ${
                          ad.isOnSlider
                            ? "bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white border border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20"
                            : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200 dark:shadow-none"
                        }`}
                      >
                        {ad.isOnSlider ? (
                          <><FaToggleOff /> Remove</>
                        ) : (
                          <><FaToggleOn /> Show on Slider</>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      <p className="mt-6 text-center text-slate-400 dark:text-slate-600 text-xs">
        * Banners are sorted by recent updates. Ensure high-quality images for better customer engagement.
      </p>
    </div>
  );
}