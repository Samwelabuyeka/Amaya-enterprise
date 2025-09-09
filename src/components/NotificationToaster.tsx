import React, { useState, useEffect } from "react";

const NotificationToaster = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, message: "Welcome to the new Amaya Admin!", type: "success" },
    { id: 2, message: "AI-powered analytics coming soon.", type: "info" },
  ]);

  useEffect(() => {
    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        setNotifications((prev) => prev.slice(1));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notifications]);

  return (
    <div className="fixed top-6 right-6 z-50 space-y-3">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`px-6 py-3 rounded-lg shadow-lg text-white font-semibold transition-all duration-300 animate-fade-in-up ${
            n.type === "success"
              ? "bg-emerald-600"
              : n.type === "info"
              ? "bg-indigo-600"
              : "bg-gray-800"
          }`}
        >
          {n.message}
        </div>
      ))}
    </div>
  );
};

export default NotificationToaster;
