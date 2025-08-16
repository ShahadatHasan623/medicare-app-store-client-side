import { useState, useEffect } from "react";

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [analyticsAllowed, setAnalyticsAllowed] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) setShowBanner(true);
    else {
      if (consent === "accepted") enableAnalytics();
    }
  }, []);

  const enableAnalytics = () => {
    console.log("✅ Analytics enabled");
    // এখানে তুমি Google Analytics / Pixel init করতে পারো
  };

  const disableAnalytics = () => {
    console.log("❌ Analytics disabled");
    // সমস্ত tracking stop করো
  };

  const handleAcceptAll = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setShowBanner(false);
    enableAnalytics();
  };

  const handleRejectAll = () => {
    localStorage.setItem("cookieConsent", "rejected");
    setShowBanner(false);
    disableAnalytics();
  };

  const handleSaveCustomize = () => {
    localStorage.setItem(
      "cookieConsent",
      analyticsAllowed ? "accepted" : "rejected"
    );
    setShowBanner(false);
    analyticsAllowed ? enableAnalytics() : disableAnalytics();
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-0 right-0 bg-gray-900 text-white p-4 mx-4 rounded-lg shadow-lg z-50">
      {!customizeOpen ? (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-sm sm:text-base">
            This website uses cookies to enhance your experience. By continuing,
            you agree to our cookie policy.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleRejectAll}
              className="bg-gray-700 px-3 py-1 rounded hover:bg-gray-600 transition"
            >
              Reject All
            </button>
            <button
              onClick={handleAcceptAll}
              className="bg-green-600 px-3 py-1 rounded hover:bg-green-500 transition"
            >
              Accept All
            </button>
            <button
              onClick={() => setCustomizeOpen(true)}
              className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-500 transition"
            >
              Customize
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <p className="text-sm sm:text-base">
            Choose which cookies you want to allow:
          </p>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="analytics"
              checked={analyticsAllowed}
              onChange={(e) => setAnalyticsAllowed(e.target.checked)}
            />
            <label htmlFor="analytics" className="text-sm">
              Analytics & Tracking Cookies
            </label>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSaveCustomize}
              className="bg-green-600 px-3 py-1 rounded hover:bg-green-500 transition"
            >
              Save & Accept
            </button>
            <button
              onClick={handleRejectAll}
              className="bg-gray-700 px-3 py-1 rounded hover:bg-gray-600 transition"
            >
              Reject All
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
