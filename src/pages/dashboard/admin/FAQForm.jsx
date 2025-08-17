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

      Swal.fire({
        icon: "success",
        title: "FAQ Added!",
        text: "Your FAQ has been added successfully.",
        confirmButtonColor: "var(--color-primary)",
      });

      setQuestion("");
      setAnswer("");
    } catch (err) {
      console.error("Error submitting FAQ:", err);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong while adding FAQ!",
        confirmButtonColor: "var(--color-primary)",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto p-6 rounded-lg shadow-md my-10"
      style={{
        backgroundColor: "var(--color-surface)",
        color: "var(--color-text)",
      }}
    >
      <h2 className="text-2xl font-bold mb-4 text-[var(--color-primary)]">Add FAQ</h2>

      <label className="block mb-2 font-semibold">Question:</label>
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="w-full p-2 mb-4 rounded"
        style={{
          border: "1px solid var(--color-border)",
          backgroundColor: "var(--color-bg)",
          color: "var(--color-text)",
        }}
        required
      />

      <label className="block mb-2 font-semibold">Answer:</label>
      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        rows={4}
        className="w-full p-2 mb-4 rounded"
        style={{
          border: "1px solid var(--color-border)",
          backgroundColor: "var(--color-bg)",
          color: "var(--color-text)",
        }}
        required
      />

      <button
        type="submit"
        className="px-4 py-2 rounded transition"
        style={{
          backgroundColor: "var(--color-primary)",
          color: "#fff",
        }}
        onMouseOver={(e) =>
          (e.currentTarget.style.backgroundColor = "var(--color-hover)")
        }
        onMouseOut={(e) =>
          (e.currentTarget.style.backgroundColor = "var(--color-primary)")
        }
      >
        Submit
      </button>
    </form>
  );
}
