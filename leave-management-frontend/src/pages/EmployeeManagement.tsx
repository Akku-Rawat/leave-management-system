import React, { useState, useEffect } from "react";
import {
  FaUsers,
  FaProjectDiagram,
  FaCommentDots,

} from "react-icons/fa";

import "react-calendar/dist/Calendar.css";

interface LeaveRecord {
  from: string;
  to: string;
  status: string;
}

interface Employee {
  id: string;
  name: string;
  department: string;
  email: string;
  role: string;
  leaveHistory: LeaveRecord[];
}

interface Delegation {
  id: string;
  employeeName: string;
  delegatedTo: string;
  status: "Pending" | "Approved" | "Rejected";
  date: string;
}

// CSV export helper
const exportToCsv = (filename: string, rows: any[]) => {
  const processRow = (row: any) =>
    Object.values(row)
      .map((val) => `"${val}"`)
      .join(",");
  const csvFile = rows.map(processRow).join("\n");
  const blob = new Blob([csvFile], { type: "text/csv;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", filename);
  link.click();
};

const HoverCard: React.FC<{
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  onClick: () => void;
}> = ({ title, subtitle, icon, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-white rounded-lg p-6 shadow-md transform transition-transform duration-300 hover:scale-[1.03] hover:shadow-lg hover:border-4 hover:border-indigo-500 relative"
      style={{
        boxShadow: "0 0 15px 3px rgba(99,102,241,0.3)",
      }}
    >
      <div className="text-indigo-600 mb-4">{icon}</div>
      <h3 className="text-2xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{subtitle}</p>
      <span
        className="absolute top-4 right-4 w-3 h-3 rounded-full bg-indigo-400 opacity-70"
        aria-hidden="true"
      />
    </div>
  );
};

const EmployeeManagement: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [delegations, setDelegations] = useState<Delegation[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDelegationModalOpen, setIsDelegationModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [delegateTo, setDelegateTo] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const empRes = await fetch("/api/employees");
        if (!empRes.ok) throw new Error("Failed to fetch employees");
        const empData: Employee[] = await empRes.json();
        setEmployees(empData);
        setFilteredEmployees(empData);

        const delRes = await fetch("/api/delegations");
        if (!delRes.ok) throw new Error("Failed to fetch delegations");
        const delData: Delegation[] = await delRes.json();
        setDelegations(delData);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = employees.filter(
      (emp) =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEmployees(filtered);
  }, [searchTerm, employees]);

  const exportToCsvHelper = (filename: string, rows: any[]) => {
    exportToCsv(filename, rows);
  };

  const exportEmployee = (emp: Employee) => {
    const rows = [
      ["ID", emp.id],
      ["Name", emp.name],
      ["Department", emp.department],
      ["Email", emp.email],
      ["Role", emp.role],
      ["Leave History", ""],
      ...emp.leaveHistory.flatMap((lh, idx) => [
        [`Leave ${idx + 1} From`, lh.from],
        [`Leave ${idx + 1} To`, lh.to],
        [`Leave ${idx + 1} Status`, lh.status],
      ]),
    ];
    exportToCsvHelper(`${emp.name}_data.csv`, rows);
  };

  const exportAll = () => {
    const data = employees.flatMap(emp => {
      const base = {
        ID: emp.id,
        Name: emp.name,
        Department: emp.department,
        Email: emp.email,
        Role: emp.role,
      };
      if (emp.leaveHistory.length === 0) {
        return [base];
      }
      return emp.leaveHistory.map(leave => ({
        ...base,
        LeaveFrom: leave.from,
        LeaveTo: leave.to,
        LeaveStatus: leave.status,
      }));
    });
    exportToCsvHelper("all_employees.csv", data);
  };

  const addDelegation = () => {
    if (!selectedEmployee || !delegateTo) {
      alert("Please select both employee and delegatee");
      return;
    }
    const newDel: Delegation = {
      id: `D${delegations.length + 1}`,
      employeeName: selectedEmployee,
      delegatedTo: delegateTo,
      status: "Pending",
      date: new Date().toISOString().slice(0, 10),
    };
    setDelegations((prev) => [...prev, newDel]);
    setSelectedEmployee("");
    setDelegateTo("");
  };

  const updateDelegationStatus = (id: string, status: "Approved" | "Rejected") => {
    setDelegations((prev) =>
      prev.map((del) => (del.id === id ? { ...del, status } : del))
    );
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Employee Management Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <HoverCard
          title="Employees"
          subtitle="Search employees, view records, download"
          icon={<FaUsers size={48} />}
          onClick={() => setIsEmployeeModalOpen(true)}
        />
        <HoverCard
          title="Delegations"
          subtitle="Manage delegation requests"
          icon={<FaProjectDiagram size={48} />}
          onClick={() => setIsDelegationModalOpen(true)}
        />
        <HoverCard
          title="Feedback & Suggestions"
          subtitle="Coming soon"
          icon={<FaCommentDots size={48} />}
          onClick={() => alert("Coming soon")}
        />
      </div>

      {isEmployeeModalOpen && (
        <Modal title="Employee List" onClose={() => setIsEmployeeModalOpen(false)}>
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-100 text-blue-900 rounded p-3 text-center">
              <p className="font-semibold text-sm">Total Employees</p>
              <p className="text-2xl font-bold">{employees.length}</p>
            </div>
            <div className="bg-green-100 text-green-900 rounded p-3 text-center">
              <p className="font-semibold text-sm">Working on Project</p>
              <p className="text-2xl font-bold">{employees.filter(e => e.department === "Engineering").length}</p>
            </div>
            <div className="bg-yellow-100 text-yellow-900 rounded p-3 text-center">
              <p className="font-semibold text-sm">Departments</p>
              <p className="text-2xl font-bold">{new Set(employees.map(e => e.department)).size}</p>
            </div>
          </div>

          <div className="flex justify-between mb-4">
            <input
              type="text"
              placeholder="Search by ID or Name"
              className="border rounded px-3 py-2 w-2/3"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <button onClick={exportAll} className="bg-indigo-600 text-white px-4 rounded hover:bg-indigo-700">Export All</button>
          </div>

          <table className="table-auto w-full border border-gray-300 rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2 text-left">ID</th>
                <th className="border p-2 text-left">Name</th>
                <th className="border p-2 text-left">Department</th>
                <th className="border p-2 text-left">Role</th>
                <th className="border p-2 text-left">Leave History</th>
                <th className="border p-2 text-center">Download</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={6} className="border p-4 text-center text-gray-500">
                    No employees found.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map(emp => (
                  <tr key={emp.id} className="hover:bg-gray-50 cursor-pointer">
                    <td className="border p-2">{emp.id}</td>
                    <td className="border p-2">{emp.name}</td>
                    <td className="border p-2">{emp.department}</td>
                    <td className="border p-2">{emp.role}</td>
                    <td className="border p-2">
                      {emp.leaveHistory.length === 0 ? (
                        <span className="text-gray-400">No leave history</span>
                      ) : (
                        emp.leaveHistory.map((lh, idx) => (
                          <div key={idx}>{lh.from} to {lh.to} - {lh.status}</div>
                        ))
                      )}
                    </td>
                    <td className="border p-2 text-center">
                      <button onClick={() => exportEmployee(emp)} className="bg-blue-600 text-white px-3 rounded hover:bg-blue-700">
                        Download
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Modal>
      )}

      {isDelegationModalOpen && (
        <Modal title="Delegations" onClose={() => setIsDelegationModalOpen(false)}>
          <div className="mb-4 flex flex-col md:flex-row gap-4">
            <select value={selectedEmployee} onChange={e => setSelectedEmployee(e.target.value)} className="border rounded px-3 py-2 w-full md:w-auto">
              <option value="">Select Employee</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.name}>{emp.name}</option>
              ))}
            </select>
            <select value={delegateTo} onChange={e => setDelegateTo(e.target.value)} className="border rounded px-3 py-2 w-full md:w-auto">
              <option value="">Delegate To</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.name}>{emp.name}</option>
              ))}
            </select>
            <button onClick={addDelegation} className="bg-indigo-600 px-4 rounded text-white md:self-center hover:bg-indigo-700">Delegate</button>
          </div>
          <table className="table-auto w-full border border-gray-300 rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">Employee</th>
                <th className="border p-2">Delegated To</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Date</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {delegations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="border p-4 text-center text-gray-500">No delegations found.</td>
                </tr>
              ) : (
                delegations.map(del => (
                  <tr key={del.id} className="hover:bg-gray-50">
                    <td className="border p-2">{del.employeeName}</td>
                    <td className="border p-2">{del.delegatedTo}</td>
                    <td className="border p-2">{del.status}</td>
                    <td className="border p-2">{del.date}</td>
                    <td className="border p-2 text-center">
                      {del.status === "Pending" ? (
                        <>
                          <button onClick={() => updateDelegationStatus(del.id, "Approved")} className="bg-green-600 text-white px-2 rounded hover:bg-green-700 mr-1">Approve</button>
                          <button onClick={() => updateDelegationStatus(del.id, "Rejected")} className="bg-red-600 text-white px-2 rounded hover:bg-red-700">Reject</button>
                        </>
                      ) : del.status}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Modal>
      )}
    </div>
  );
};

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ title, onClose, children }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-6xl max-h-[80vh] overflow-y-auto rounded bg-white p-6 shadow-lg">
        <button onClick={onClose} className="absolute right-4 top-4 rounded bg-gray-200 p-2 hover:bg-gray-300" aria-label="Close modal">&times;</button>
        <h2 className="mb-6 text-3xl font-semibold">{title}</h2>
        {children}
      </div>
    </div>
  );
};

export default EmployeeManagement;
