import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const LeaveCustomMessagePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  if (!token) return <div style={{ color: "red" }}>Invalid or expired link.</div>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setError("Message required.");
      return;
    }
    setSending(true);
    setError("");
    try {
      // POST to your backend endpoint for custom messages
      await axios.post("/api/leaves/custom-message", { token, message });
      alert("Message sent!");
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to send.");
    }
    setSending(false);
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 rounded bg-white shadow">
      <h2 className="text-xl font-bold mb-4">Send Custom Message</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full border rounded p-2 mb-3"
          rows={4}
          placeholder="Type your message to the employee..."
          value={message}
          onChange={e => setMessage(e.target.value)}
          disabled={sending}
        />
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={sending}
        >
          {sending ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
};

export default LeaveCustomMessagePage;
