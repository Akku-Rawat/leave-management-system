import { useState } from "react";
import { FaPlus, FaEdit, FaTrash,FaHistory } from "react-icons/fa";

interface User {
  id: string;
  name: string;
  department: string;
  role: "Employee" | "HR" | "Boss";
}

interface AuditEntry {
  id: string;
  action: "Added" | "Updated" | "Removed";
  userName: string;
  by: string;
  date: string;
}

const initialUsers: User[] = [
  { id: "E001", name: "Ramesh Kumar", department: "Engineering", role: "Employee" },
  { id: "E002", name: "Suresh Patel", department: "Finance", role: "Employee" },
];

const initialAudit: AuditEntry[] = [
  { id: "A001", action: "Added", userName: "Aman Singh", by: "Boss", date: "2025-08-28" },
];

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [audit, setAudit] = useState<AuditEntry[]>(initialAudit);

  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form, setForm] = useState({ name: "", department: "", role: "Employee" as User["role"] });
  const [error, setError] = useState<string | null>(null);

  // Filtered users by search term
  const filteredUsers = users.filter(
    u =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addAuditEntry = (action: AuditEntry["action"], userName: string) => {
    const newEntry: AuditEntry = {
      id: `A${(audit.length + 1).toString().padStart(3, "0")}`,
      action,
      userName,
      by: "Admin", // Hardcoded for demo, replace with current user
      date: new Date().toISOString().slice(0, 10),
    };
    setAudit([newEntry, ...audit]);
  };

  const resetForm = () => {
    setForm({ name: "", department: "", role: "Employee" });
    setEditingUser(null);
    setError(null);
  };

  const startAddUser = () => {
    resetForm();
    setEditingUser({ id: "", name: "", department: "", role: "Employee" });
  };

  const startEditUser = (user: User) => {
    setEditingUser(user);
    setForm({ name: user.name, department: user.department, role: user.role });
    setError(null);
  };

  const validateForm = () => {
    if (!form.name.trim()) return "Name is required";
    if (!form.department.trim()) return "Department is required";
    if (!form.role.trim()) return "Role is required";
    return null;
  };

  const saveUser = () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (editingUser) {
      if (editingUser.id) {
        // Update existing user
        setUsers(users.map(u => u.id === editingUser.id ? {...u, ...form} : u));
        addAuditEntry("Updated", form.name);
      } else {
        // Add new user, generate id
        const newUser = { id: `E${(users.length + 1).toString().padStart(3, "0")}`, ...form };
        setUsers([newUser, ...users]);
        addAuditEntry("Added", form.name);
      }
      resetForm();
    }
  };

  const removeUser = (id: string) => {
    const userToRemove = users.find(u => u.id === id);
    if (!userToRemove) return;
    if (!window.confirm(`Remove user ${userToRemove.name}?`)) return;
    setUsers(users.filter(u => u.id !== id));
    addAuditEntry("Removed", userToRemove.name);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 bg-white rounded shadow-lg">
      <h2 className="text-3xl font-bold">User Management</h2>

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search users"
          className="flex-grow border border-gray-300 rounded px-3 py-2"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <button
          onClick={startAddUser}
          className="flex items-center gap-2 bg-green-600 px-4 py-2 rounded text-white hover:bg-green-700"
        >
          <FaPlus /> Add User
        </button>
      </div>

      {(editingUser) && (
        <div className="mb-6 p-4 border border-gray-300 rounded shadow">
          <h3 className="text-xl font-semibold mb-3">{editingUser.id ? "Edit User" : "Add User"}</h3>
          {error && <p className="mb-3 text-red-600">{error}</p>}
          <div className="space-y-3 max-w-md">
            <input
              type="text"
              placeholder="Name"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
            />
            <input
              type="text"
              placeholder="Department"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={form.department}
              onChange={e => setForm({...form, department: e.target.value})}
            />
            <select
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={form.role}
              onChange={e => setForm({...form, role: e.target.value as User["role"]})}
            >
              <option value="Employee">Employee</option>
              <option value="HR">HR</option>
              <option value="Boss">Boss</option>
            </select>
            <div className="flex gap-4">
              <button
                onClick={saveUser}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
              >
                Save
              </button>
              <button
                onClick={resetForm}
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-auto max-h-[300px] border border-gray-300 rounded shadow-inner">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="border-b border-gray-300 px-4 py-2 text-left">ID</th>
              <th className="border-b border-gray-300 px-4 py-2 text-left">Name</th>
              <th className="border-b border-gray-300 px-4 py-2 text-left">Department</th>
              <th className="border-b border-gray-300 px-4 py-2 text-left">Role</th>
              <th className="border-b border-gray-300 px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-4 text-gray-500">
                  No users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="border-b border-gray-300 px-4 py-2">{user.id}</td>
                  <td className="border-b border-gray-300 px-4 py-2">{user.name}</td>
                  <td className="border-b border-gray-300 px-4 py-2">{user.department}</td>
                  <td className="border-b border-gray-300 px-4 py-2">{user.role}</td>
                  <td className="border-b border-gray-300 px-4 py-2">
                    <button
                      onClick={() => startEditUser(user)}
                      className="text-blue-600 hover:underline mr-4"
                      title="Edit user"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => removeUser(user.id)}
                      className="text-red-600 hover:underline"
                      title="Remove user"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="overflow-auto max-h-[200px] border border-gray-300 rounded shadow-inner mt-8 p-4">
        <h3 className="flex items-center gap-2 font-semibold mb-2">
          <FaHistory /> Audit Trail
        </h3>
        {audit.length === 0 ? (
          <p className="text-gray-500">No audit entries.</p>
        ) : (
          <ul className="space-y-1 max-h-[160px] overflow-auto text-sm text-gray-700">
            {audit.map(entry => (
              <li key={entry.id}>
                [{entry.date}] <strong>{entry.by}</strong> {entry.action} <strong>{entry.userName}</strong>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}