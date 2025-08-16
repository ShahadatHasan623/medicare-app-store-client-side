import React, { useState, useEffect } from "react";

const policySections = [
  {
    title: "Introduction",
    text: `Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information on our website and services.`,
  },
  {
    title: "Information We Collect",
    text: `We may collect personal information such as your name, email address, contact number, payment information, and browsing behavior on our website.`,
  },
  {
    title: "Use of Information",
    text: `The information we collect is used to provide and improve our services, process orders, communicate offers, send newsletters, and comply with legal obligations.`,
  },
  {
    title: "Data Sharing & Security",
    text: `We do not sell your personal data. We may share data with trusted third-party service providers for payment processing, delivery, analytics, and marketing. We employ industry-standard security measures to protect your information.`,
  },
  {
    title: "Cookies & Tracking",
    text: `Our website uses cookies to enhance user experience, track preferences, and provide analytics. You can manage your cookie preferences at any time.`,
  },
  {
    title: "Your Rights",
    text: `You have the right to access, update, or request deletion of your personal data. You may also unsubscribe from promotional communications at any time.`,
  },
  {
    title: "Changes to Privacy Policy",
    text: `We may update this Privacy Policy from time to time. Users will be notified of changes via email or a notice on our website.`,
  },
  {
    title: "Contact Us",
    text: `For questions regarding this Privacy Policy or your data, please contact us at support@yourdomain.com.`,
  },
];

export default function PrivacyPolicy() {
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    const localAccepted = localStorage.getItem("acceptedPrivacyPolicy");
    if (localAccepted === "true") setAccepted(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem("acceptedPrivacyPolicy", "true");
    setAccepted(true);
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
      <div className="max-w-4xl mx-auto px-5 py-16">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-[var(--color-primary)]">
          Privacy Policy
        </h1>

        <div className="space-y-8">
          {policySections.map((section, idx) => (
            <section key={idx}>
              <h2 className="text-2xl font-semibold mb-2">{section.title}</h2>
              <p className="text-[var(--color-muted)] leading-relaxed">{section.text}</p>
            </section>
          ))}
        </div>
      </div>

      {/* Accept Banner */}
      {!accepted && (
        <div className="fixed bottom-0 left-0 w-full bg-[var(--color-surface)] border-t border-[var(--color-border)] shadow-lg p-4 flex flex-col sm:flex-row justify-between items-center gap-3 z-50">
          <p className="text-sm text-[var(--color-text)]">
            We use cookies and personal data to improve your experience. By continuing to use our site, you agree to our Privacy Policy.
          </p>
          <div className="flex gap-2">
            <a
              href="/privacy-policy"
              className="text-[var(--color-primary)] text-sm hover:underline"
            >
              Read Policy
            </a>
            <button
              className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-md shadow hover:bg-[var(--navbar-hover)] transition-colors duration-300"
              onClick={handleAccept}
            >
              Accept
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
