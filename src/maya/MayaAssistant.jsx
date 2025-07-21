import React, { useState } from "react";

const MayaAssistant = () => {
  const [messages, setMessages] = useState([
    { role: "maya", text: "Hi! I’m Maya — your Amaya assistant. How can I help today?" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: "user", text: input }];
    setMessages(newMessages);

    // Simulated AI response logic (expandable later)
    const response = {
      text: input.toLowerCase().includes("brand")
        ? "To onboard a new brand, navigate to the Admin panel → Add Brand."
        : "I’ll handle that soon. Stay tuned as I grow smarter."
    };

    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "maya", text: response.text }]);
    }, 800);

    setInput("");
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-white shadow rounded-lg">
      <div className="mb-4 text-lg font-bold text-purple-700">🤖 Maya Assistant</div>
      <div className="h-64 overflow-y-auto border p-2 mb-4 rounded bg-gray-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`mb-2 ${msg.role === "maya" ? "text-purple-600" : "text-gray-800 text-right"}`}>
            <span>{msg.text}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 p-2 border rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Maya something..."
        />
        <button onClick={handleSend} className="bg-purple-600 text-white px-4 py-2 rounded">Send</button>
      </div>
    </div>
  );
};

export default MayaAssistant;
