import React from "react";

const features = [
  {
    title: "AI-Powered Search",
    desc: "Instantly find brands, users, and products with smart, typo-tolerant, and semantic search.",
    icon: "🔍"
  },
  {
    title: "Real-Time Orders",
    desc: "Track, manage, and fulfill orders as they happen. Get notified of new sales instantly.",
    icon: "📦"
  },
  {
    title: "Role-Based Access",
    desc: "Granular permissions for admins, staff, brands, and users. Secure and flexible.",
    icon: "🛡️"
  },
  {
    title: "Live Chat & Support",
    desc: "Integrated Maya AI and live chat for customer and brand support.",
    icon: "💬"
  },
  {
    title: "Product & Inventory Management",
    desc: "Add, edit, and track products and stock in real time.",
    icon: "📊"
  },
  {
    title: "Advanced Reviews & Ratings",
    desc: "AI-moderated reviews, verified ratings, and social proof widgets.",
    icon: "⭐"
  },
  {
    title: "Automated Fraud Detection",
    desc: "AI-driven monitoring for suspicious activity and fraud prevention.",
    icon: "🕵️"
  },
  {
    title: "Customizable Dashboards",
    desc: "Personalize your admin view with drag-and-drop widgets and themes.",
    icon: "🎛️"
  },
  {
    title: "Mobile-First & PWA",
    desc: "Manage your business on any device, anywhere, with offline support.",
    icon: "📱"
  },
  {
    title: "Automated Marketing",
    desc: "AI-powered campaigns, recommendations, and customer segmentation.",
    icon: "📈"
  }
];

const AdminDashboardFeatures = () => (
  <section className="my-16">
    <h2 className="text-3xl font-bold mb-8 text-center">Next-Gen Admin Features</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {features.map((f, i) => (
        <div key={i} className="bg-zinc-900 rounded-xl p-6 shadow-lg flex flex-col items-center text-center hover:scale-105 transition-transform duration-300">
          <div className="text-4xl mb-4">{f.icon}</div>
          <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
          <p className="text-zinc-400">{f.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

export default AdminDashboardFeatures;
