
import React, { useState, useEffect } from "react";

const termsContent = [
  {
    title: "Introduction",
    text: "Welcome to our website. By using our services, you agree to the following terms and conditions..."
  },
  {
    title: "Use of Content",
    text: "All content on this site is for informational purposes only and should not replace professional medical advice..."
  },
  {
    title: "Privacy",
    text: "We respect your privacy and handle your data according to our privacy policy..."
  },
  {
    title: "Purchases & Payments",
    text: "Any purchase made on this site is subject to our payment and refund policies..."
  },
  {
    title: "Changes to Terms",
    text: "We may update these terms from time to time. Users will be notified of changes on this page..."
  },
];

export default function Terms() {
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // ✅ Check LocalStorage if user already accepted
  useEffect(() => {
    const accepted = localStorage.getItem("acceptedTerms");
    if (accepted === "true") setAcceptedTerms(true);
  }, []);

  const handleAcceptTerms = () => {
    localStorage.setItem("acceptedTerms", "true");
    setAcceptedTerms(true);
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
      {/* Page Title */}
      <div className="max-w-4xl mx-auto px-5 py-16">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-[var(--color-primary)]">
          Terms & Conditions
        </h1>

        <div className="space-y-8">
          {termsContent.map((section, idx) => (
            <section key={idx}>
              <h2 className="text-2xl font-semibold mb-2">{section.title}</h2>
              <p className="text-[var(--color-muted)] leading-relaxed">{section.text}</p>
            </section>
          ))}
        </div>
      </div>

      {/* ✅ Accept Banner */}
      {!acceptedTerms && (
        <div className="fixed bottom-0 left-0 w-full bg-[var(--color-surface)] border-t border-[var(--color-border)] shadow-lg p-4 flex flex-col sm:flex-row justify-between items-center gap-3 z-50">
          <p className="text-sm text-[var(--color-text)]">
            Please accept our Terms & Conditions to continue using this site.
          </p>
          <div className="flex gap-2">
            <a
              href="/terms"
              className="text-[var(--color-primary)] text-sm hover:underline"
            >
              Read Terms
            </a>
            <button
              className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-md shadow hover:bg-[var(--navbar-hover)] transition-colors duration-300"
              onClick={handleAcceptTerms}
            >
              Accept
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
