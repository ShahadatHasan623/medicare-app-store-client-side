import React, { useState, useEffect } from "react";

const DigitalClock = () => {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [is24Hour, setIs24Hour] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      const dayName = days[now.getDay()];
      const monthName = months[now.getMonth()];
      const year = now.getFullYear();
      const day = now.getDate();

      let hours = now.getHours();
      const ampm = hours >= 12 ? "PM" : "AM";
      let displayHours = hours;
      if (!is24Hour) {
        displayHours = hours % 12 || 12;
      }
      const strHours = displayHours.toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const seconds = now.getSeconds().toString().padStart(2, "0");

      setTime(`${strHours}:${minutes}:${seconds} ${is24Hour ? "" : ampm}`);
      setDate(`${dayName}, ${monthName} ${day}, ${year}`);
    };

    updateTime();
    const intervalId = setInterval(updateTime, 1000);

    return () => clearInterval(intervalId);
  }, [is24Hour]);

  return (
    <div
      className="flex items-center justify-between rounded-md px-6 py-2 shadow-md max-w-3xl mx-auto select-none font-mono text-white"
      style={{ minWidth: "350px", backgroundColor: "#4B5563" }}  // এখানে কালার পরিবর্তন
    >
      {/* Left: Time */}
      <div className="text-lg font-semibold tracking-wide flex-1 text-left">
        {time}
      </div>

      {/* Center: Date */}
      <div className="text-xs opacity-80 text-center flex-1">
        {date}
      </div>

      {/* Right: Toggle Button */}
      <div className="flex-1 flex justify-end">
        <button
          onClick={() => setIs24Hour(!is24Hour)}
          className="text-[var(--color-primary)] border border-[var(--color-primary)] px-3 py-1 rounded hover:bg-[var(--color-primary)] hover:text-white transition whitespace-nowrap"
          type="button"
        >
          Toggle {is24Hour ? "12-hour" : "24-hour"}
        </button>
      </div>
    </div>
  );
};

export default DigitalClock;
