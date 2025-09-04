import React, { useState, useEffect } from "react";
import { FaUsers, FaCheckCircle, FaTimesCircle, FaClipboardList } from "react-icons/fa";
import type { LeaveRequestType } from "../Types";
import { formatISODate } from "../utils/dateFormatter";





const HRView: React.FC = () => {
  const [showMessageBox, setShowMessageBox] = useState<string | null>(null);
const [customMessage, setCustomMessage] = useState("");
  const [requests, setRequests] = useState<LeaveRequestType[]>([]);


  useEffect(() => {
    async function fetchRequests() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/leaves/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch leave requests");
        const data = await res.json();
        setRequests(data);
      } catch (error) {
        console.error("Error fetching leave requests:", error);
      }
    }
    fetchRequests();
  }, []);


  const handleAction = async (leave_id: string, action: "approved" | "rejected") => {
    try {
      let url = "";
      let method = "POST"; // backend expects POST


      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in");
        return;
      }


      if (action === "approved") {
        url = `/api/leaves/approve/${leave_id}`;
      } else if (action === "rejected") {
        url = `/api/leaves/reject/${leave_id}`;
      } else {
        throw new Error("Invalid action");
      }


      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });


      if (!res.ok) throw new Error("Failed to update status");


      setRequests((prev) =>
        prev.map((req) =>
          req.leave_id === leave_id
            ? { ...req, status: action }
            : req
        )
      );
    } catch (error) {
      alert("Failed to update status: " + error);
    }
  };
const handleSendMessage = async (leave_id: string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in");
      return;
    }
    if (!customMessage.trim()) {
      alert("Message cannot be empty");
      return;
    }


    const res = await fetch(`/api/leaves/requests/${leave_id}/message`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: customMessage }),
    });


    if (!res.ok) throw new Error("Failed to send message");


    alert("Message sent successfully");


    setShowMessageBox(null);
    setCustomMessage("");
  } catch (error) {
    alert("Error sending message: " + error);
  }
};


return (
  <div className="h-full overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50 to-white p-6">
    <div className="max-w-7xl mx-auto ">
      {/* PURE CARD */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden flex" style={{ height: '600px' }}>
         <div className="flex w-full">
          {/* LEFT PANEL */}
          <div className="lg:w-2/5 bg-gradient-to-br from-blue-100 via-blue-50 to-indigo-50 p-8">
            <div className="text-gray-800 space-y-6">
              <h2 className="text-2xl font-bold flex items-center mb-4 text-blue-700">
                <FaUsers className="mr-3" /> HR Dashboard
              </h2>


              <p className="text-gray-600 text-lg">Manage employee leave requests</p>


              <div className="grid grid-cols-2 gap-6">
                {/* Stat boxes */}
                <div className="bg-white rounded-xl p-4 shadow border border-gray-100">
                  <div className="text-3xl font-bold text-blue-700">{requests.length}</div>
                  <div className="text-gray-600">Total Requests</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow border border-gray-100">
                  <div className="text-3xl font-bold text-emerald-600">
                    {requests.filter(r => r.status === "approved").length}
                  </div>
                  <div className="text-gray-600">Approved</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow border border-gray-100">
                  <div className="text-3xl font-bold text-amber-600">
                    {requests.filter(r => r.status === "pending").length}
                  </div>
                  <div className="text-gray-600">Pending</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow border border-gray-100">
                  <div className="text-3xl font-bold text-rose-600">
                    {requests.filter(r => r.status === "rejected").length}
                  </div>
                  <div className="text-gray-600">Rejected</div>
                </div>
              </div>
            </div>
          </div>


          {/* RIGHT PANEL */}
          <div className="lg:w-3/5 p-8 bg-gradient-to-br from-gray-50 to-white flex flex-col">
            <h3 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
              <FaClipboardList className="mr-3 text-blue-500" /> Leave Requests
            </h3>


            <div
              className="space-y-6 flex-grow overflow-auto"
              style={{ maxHeight: "600px" }}
            >
              {requests.map(req => (
                <div key={req.id} className="bg-white p-6 rounded-xl shadow border border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                     <h4 className="text-sm text-gray-600"><strong>{req.user?.name}</strong></h4>


                      <p className="text-gray-700">{req.type} • {formatISODate(req.start_date)} → {formatISODate(req.end_date)}</p>

                      <p className="mt-2 text-gray-600">{req.reason}</p>
                    </div>
                    <span className={`px-3 py-1 text-sm rounded-full ${
                      req.status === "approved" ? "bg-green-100 text-green-800"
                      : req.status === "rejected" ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                    }`}>{req.status}</span>
                  </div>


                  {req.status === "pending" && (
                    <div className="mt-4 flex space-x-4">
                      <button
                        onClick={() => handleAction(req.leave_id, "approved")}
                        className="flex items-center px-5 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition"
                      >
                        <FaCheckCircle className="mr-2" /> Approve
                      </button>
                      <button
                        onClick={() => handleAction(req.leave_id, "rejected")}
                        className="flex items-center px-5 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition"
                      >
                        <FaTimesCircle className="mr-2" /> Reject
                      </button>
                      <button
                        onClick={() => setShowMessageBox(req.leave_id)}
                        className="flex items-center px-5 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition"
                      >
                        <FaUsers className="mr-2" /> Send Message
                      </button>
                    </div>
                  )}


                  {showMessageBox === req.leave_id && (
                    <div className="mt-4">
                      <textarea
                        value={customMessage}
                        onChange={(e) => setCustomMessage(e.target.value)}
                        placeholder="Enter your message to employee"
                        rows={3}
                        className="border rounded p-2 w-full"
                      />
                      <div className="mt-2 flex space-x-2">
                        <button
                          onClick={() => handleSendMessage(req.leave_id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded"
                        >
                          Send
                        </button>
                        <button
                          onClick={() => {
                            setShowMessageBox(null);
                            setCustomMessage("");
                          }}
                          className="px-4 py-2 border rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}


              {requests.length === 0 && (
                <p className="text-center text-gray-500">No leave requests found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);


};


export default HRView;