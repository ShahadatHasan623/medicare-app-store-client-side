import React, { useState } from "react";
import useAxios from "../../../hooks/useAxios";
import Swal from "sweetalert2";
import { FaQuestionCircle, FaEdit, FaPaperPlane } from "react-icons/fa";

export default function FAQForm() {
  const axios = useAxios();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/faqs", { question, answer });

      Swal.fire({
        icon: "success",
        title: "FAQ Published!",
        text: "The medical query has been added to the database.",
        confirmButtonColor: "#10B981", // Emerald color
        buttonsStyling: true,
      });

      setQuestion("");
      setAnswer("");
    } catch (err) {
      console.error("Error submitting FAQ:", err);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "Could not save the FAQ. Please try again.",
        confirmButtonColor: "#EF4444",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-12 px-4">
      <div className="bg-white rounded-3xl shadow-xl border border-emerald-50 overflow-hidden">
        {/* Header Section */}
        <div className="bg-emerald-600 p-6 text-white flex items-center gap-3">
          <div className="bg-white/20 p-3 rounded-xl">
            <FaQuestionCircle className="text-2xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Manage Medicine FAQs</h2>
            <p className="text-emerald-100 text-sm">Add common questions to help your customers.</p>
          </div>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Question Input */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 ml-1">
              <FaEdit className="text-emerald-500 text-xs" />
              Customer Question
            </label>
            <input
              type="text"
              placeholder="e.g., How should I store Insulin?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-800"
              required
            />
          </div>

          {/* Answer Input */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 ml-1">
              <FaPaperPlane className="text-emerald-500 text-xs" />
              Pharmacist's Answer
            </label>
            <textarea
              placeholder="Provide a detailed medical instruction..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={5}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-slate-800 resize-none"
              required
            />
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-100 transition-all active:scale-[0.98] disabled:opacity-70 flex justify-center items-center gap-2"
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <>
                  <span>Add to FAQ Bank</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Helper Footer */}
      <p className="text-center text-slate-400 text-sm mt-6">
        Tip: Keep answers concise and follow medical guidelines.
      </p>
    </div>
  );
}