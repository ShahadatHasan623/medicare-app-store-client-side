import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../hooks/useAxios";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function FAQAccordionMUI() {
  const axios = useAxios();

  const { data: faqs = [], isLoading, isError } = useQuery({
    queryKey: ["faqs"],
    queryFn: async () => {
      const res = await axios.get("/faqs");
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading)
    return (
      <p className="text-center py-10 text-lg text-[var(--color-muted)] animate-pulse">
        Loading FAQs...
      </p>
    );

  if (isError)
    return (
      <p className="text-center py-10 text-lg text-[var(--color-error)]">
        Failed to load FAQs.
      </p>
    );

  return (
    <section className="max-w-5xl mx-auto my-16 px-5">
      <h2 className="text-4xl font-extrabold mb-12 text-center text-[var(--color-primary)]">
        Frequently Asked Questions
      </h2>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <Accordion
            key={faq._id || index}
            sx={{
              borderRadius: "1rem",
              border: `1px solid var(--color-border)`,
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              "&.Mui-expanded": {
                margin: "0",
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: "var(--color-primary)" }} />}
              aria-controls={`panel${index}-content`}
              id={`panel${index}-header`}
              sx={{
                backgroundColor: "var(--color-surface)",
                "&:hover": { backgroundColor: "var(--color-bg)" },
              }}
            >
              <Typography className="font-semibold text-[var(--color-text)]">
                Q{index + 1}: {faq.question}
              </Typography>
            </AccordionSummary>

            <AccordionDetails
              sx={{
                backgroundColor: "var(--color-bg)",
                px: 3,
                py: 2,
              }}
            >
              <Typography className="text-[var(--color-muted)]">{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </section>
  );
}
