import React, { useState } from "react";
import useAxios from "../../../hooks/useAxios";
import Swal from "sweetalert2";

export default function FAQForm() {
  const axios = useAxios();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/faqs", { question, answer });

      // ✅ SweetAlert success message
      Swal.fire({
        icon: "success",
        title: "FAQ Added!",
        text: "Your FAQ has been added successfully.",
        confirmButtonColor: "#4f46e5", // Tailwind color example
      });

      setQuestion("");
      setAnswer("");
    } catch (err) {
      console.error("Error submitting FAQ:", err);

      // ✅ SweetAlert error message
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong while adding FAQ!",
        confirmButtonColor: "#dc2626", // Tailwind red
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg my-10">
      <h2 className="text-2xl font-bold mb-4">Add FAQ</h2>

      <label className="block mb-2 font-semibold">Question:</label>
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="w-full p-2 border rounded mb-4"
        required
      />

      <label className="block mb-2 font-semibold">Answer:</label>
      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        className="w-full p-2 border rounded mb-4"
        rows={4}
        required
      />

      <button
        type="submit"
        className="bg-[var(--color-primary)] text-white px-4 py-2 rounded hover:bg-[var(--navbar-hover)] transition"
      >
        Submit
      </button>
    </form>
  );
}
