// import React, { useState, useEffect } from "react";

// export interface LeaveRequestData {
//   type: string;
//   duration: string;
//   startDate: string;
//   endDate: string;
//   reason: string;
//   emergencyContact: string;
// }

// interface ApplyLeaveProps {
//   onSubmit: (data: LeaveRequestData) => void;
//   setActiveView: (view: string) => void;
//   initialStartDate?: string;
//   initialEndDate?: string;
// }

// const ApplyLeave: React.FC<ApplyLeaveProps> = ({
//   onSubmit,
//   setActiveView,
//   initialStartDate = "",
//   initialEndDate = "",
// }) => {
//   const [formData, setFormData] = useState<LeaveRequestData>({
//     type: "",
//     duration: "full",
//     startDate: initialStartDate,
//     endDate: initialEndDate,
//     reason: "",
//     emergencyContact: "",
//   });

//   useEffect(() => {
//     setFormData(prev => ({
//       ...prev,
//       startDate: initialStartDate,
//       endDate: initialEndDate,
//     }));
//   }, [initialStartDate, initialEndDate]);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
//   ) => {
//     const { id, value } = e.target;
//     setFormData(prev => ({ ...prev, [id]: value }));
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onSubmit(formData);
//   };

//   return (
//     <div className="max-w-xl mx-auto bg-white p-8 shadow rounded">
//       <h2 className="text-2xl font-semibold mb-6">Apply for Leave</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label htmlFor="type" className="block font-medium mb-1">
//             Leave Type
//           </label>
//           <select
//             id="type"
//             value={formData.type}
//             onChange={handleChange}
//             required
//             className="w-full border rounded p-2"
//           >
//             <option value="">Select leave type</option>
//             <option value="Annual Leave">Annual Leave</option>
//             <option value="Sick Leave">Sick Leave</option>
//             <option value="Emergency Leave">Emergency Leave</option>
//             <option value="Maternity/Paternity">Maternity/Paternity</option>
//           </select>
//         </div>

//         <div>
//           <label htmlFor="duration" className="block font-medium mb-1">
//             Duration
//           </label>
//           <select
//             id="duration"
//             value={formData.duration}
//             onChange={handleChange}
//             required
//             className="w-full border rounded p-2"
//           >
//             <option value="full">Full Day</option>
//             <option value="half">First Half</option>
//             <option value="half">Second Half</option>
//           </select>
//         </div>

//         <div>
//           <label htmlFor="startDate" className="block font-medium mb-1">
//             Start Date
//           </label>
//           <input
//             id="startDate"
//             type="date"
//             value={formData.startDate}
//             onChange={handleChange}
//             required
//             className="w-full border rounded p-2"
//             min={new Date().toISOString().split("T")[0]}
//           />
//         </div>

//         <div>
//           <label htmlFor="endDate" className="block font-medium mb-1">
//             End Date
//           </label>
//           <input
//             id="endDate"
//             type="date"
//             value={formData.endDate}
//             onChange={handleChange}
//             required
//             className="w-full border rounded p-2"
//             min={formData.startDate || new Date().toISOString().split("T")[0]}
//           />
//         </div>

//         <div>
//           <label htmlFor="reason" className="block font-medium mb-1">
//             Reason
//           </label>
//           <textarea
//             id="reason"
//             value={formData.reason}
//             onChange={handleChange}
//             required
//             className="w-full border rounded p-2"
//             rows={4}
//             placeholder="Reason for leave"
//           />
//         </div>

//         <div>
//           <label htmlFor="emergencyContact" className="block font-medium mb-1">
//             Emergency Contact (Optional)
//           </label>
//           <input
//             id="emergencyContact"
//             type="tel"
//             value={formData.emergencyContact}
//             onChange={handleChange}
//             className="w-full border rounded p-2"
//             placeholder="Enter a phone number"
//           />
//         </div>

//         <div className="flex justify-between">
//           <button
//             type="button"
//             onClick={() => setActiveView("dashboard")}
//             className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
//           >
//             ← Back
//           </button>
//           <div className="space-x-4">
//             <button
//               type="reset"
//               onClick={() =>
//                 setFormData({
//                   type: "",
//                   duration: "full",
//                   startDate: initialStartDate,
//                   endDate: initialEndDate,
//                   reason: "",
//                   emergencyContact: "",
//                 })
//               }
//               className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-50"
//             >
//               Reset
//             </button>
//             <button
//               type="submit"
//               className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//             >
//               Submit Request
//             </button>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default ApplyLeave;
