// pages/UserManagement.tsx
import React, { useState } from "react";
import { FaUserPlus, FaUserMinus, FaHistory } from "react-icons/fa";

interface AuditEntry {
  id: string;
  action: "Added" | "Removed";
  userName: string;
  by: string;
  date: string;
}

const sampleUsers = [
  { id: "E001", name: "Ramesh Kumar", department: "Engineering" },
  { id: "E002", name: "Suresh Patel", department: "Finance" },
];

const sampleAudit: AuditEntry[] = [
  { id: "A001", action: "Added", userName: "Aman Singh", by: "Boss", date: "2025-08-28" },
];

export default function UserManagement() {
  const [users, setUsers] = useState(sampleUsers);
  const [audit, setAudit] = useState(sampleAudit);

  const addUser = () => {
    const newUser = { id: `E00${users.length + 1}`, name: "New User", department: "HR" };
    setUsers([...users, newUser]);
    setAudit([
      {
        id: `A00${audit.length + 1}`,
        action: "Added",
        userName: newUser.name,
        by: "Boss",
        date: new Date().toISOString().slice(0, 10),
      },
      ...audit,
    ]);
  };

  const removeUser = (id: string) => {
    const removed = users.find((u) => u.id === id)!;
    setUsers(users.filter((u) => u.id !== id));
    setAudit([
      {
        id: `A00${audit.length + 1}`,
        action: "Removed",
        userName: removed.name,
        by: "Boss",
        date: new Date().toISOString().slice(0, 10),
      },
      ...audit,
    ]);
  };

  return (
    <div className="p-6 space-y-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold">User Management</h2>

      <div className="flex gap-4">
        <button
          onClick={addUser}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          <FaUserPlus className="mr-2" />
          Add User
        </button>
      </div>

      <div className="bg-gray-50 rounded-md p-4 shadow-inner max-h-60 overflow-y-auto">
        <h3 className="font-semibold mb-2">Current Users</h3>
        {users.length === 0 ? (
          <p className="text-gray-500">No users.</p>
        ) : (
          <ul className="space-y-2">
            {users.map((u) => (
              <li key={u.id} className="flex justify-between items-center px-2 py-1 bg-white rounded-md shadow-sm">
                <span>
                  {u.name} — <span className="text-sm text-gray-600">{u.department}</span>
                </span>
                <button
                  onClick={() => removeUser(u.id)}
                  className="text-red-600 hover:underline flex items-center"
                >
                  <FaUserMinus className="mr-1" />
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-gray-50 rounded-md p-4 shadow-inner max-h-60 overflow-y-auto">
        <h3 className="font-semibold flex items-center gap-2 mb-2">
          <FaHistory /> Audit Trail
        </h3>
        {audit.length === 0 ? (
          <p className="text-gray-500">No audit entries.</p>
        ) : (
          <ul className="space-y-1 text-sm text-gray-700 max-h-48 overflow-y-auto">
            {audit.map((a) => (
              <li key={a.id}>
                [{a.date}] <span className="font-semibold">{a.by}</span> {a.action}{" "}
                <span className="font-semibold">{a.userName}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
