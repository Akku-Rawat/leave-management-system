import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaHistory } from "react-icons/fa";
import { getUserList, addUser, updateUser, deleteUser } from "../services/api";

interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  role: "Employee" | "HR" | "Boss";
}

// Separate interface for form data including password
interface UserForm {
  name: string;
  email: string;
  password: string;
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

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [audit, setAudit] = useState<AuditEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showAddUserForm, setShowAddUserForm] = useState(false);

  const [form, setForm] = useState<UserForm>({
    name: "",
    email: "",
    password: "",
    department: "",
    role: "Employee",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentUserName] = useState<string>("Admin"); // Replace as needed

  // Fetch user list from backend on component mount
  useEffect(() => {
    async function fetchUsers() {
      try {
        const token = localStorage.getItem("token") ?? undefined;
        const userList = await getUserList(token);
        // Normalize user data to ensure role is string and id field
        const normalizedUsers = userList.map((u: any) => ({
          id: u.user_id,
          name: u.name,
          email: u.email,
          department: u.department || "",
          role: typeof u.role === "string" ? u.role : u.role.role_name,
        }));
        setUsers(normalizedUsers);
      } catch {
        setError("Failed to fetch users.");
      }
    }
    fetchUsers();
  }, []);

  // Filter users by search term
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add new audit entry
  const addAuditEntry = (action: AuditEntry["action"], userName: string) => {
    const newEntry: AuditEntry = {
      id: `A${(audit.length + 1).toString().padStart(3, "0")}`,
      action,
      userName,
      by: currentUserName,
      date: new Date().toISOString().slice(0, 10),
    };
    setAudit((prev) => [newEntry, ...prev]);
  };

  // Reset form to initial state
  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      password: "",
      department: "",
      role: "Employee",
    });
    setEditingUser(null);
    setError(null);
  };

  // Start to add user form
  const startAddUser = () => {
    resetForm();
    setEditingUser(null);
    setShowAddUserForm(true);
  };

  // Start to edit existing user
  const startEditUser = (user: User) => {
    setEditingUser(user);
    setForm({
      name: user.name,
      email: user.email,
      password: "", // password not editable during edit
      department: user.department,
      role: user.role,
    });
    setShowAddUserForm(true);
    setError(null);
  };

  // Form validation
  const validateForm = () => {
    if (!form.name.trim()) return "Name is required";
    if (!form.email.trim()) return "Email is required";
    if (!form.department.trim()) return "Department is required";
    if (!form.role.trim()) return "Role is required";
    if (!editingUser && !form.password.trim()) return "Password is required for new user";
    return null;
  };

  // Save user (add or update)
  const saveUser = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    const token = localStorage.getItem("token") ?? undefined;
    try {
      if (editingUser) {
        if (editingUser.id) {
          // Update user
          await updateUser(editingUser.id, form.name, form.email, form.department, form.role, token);
          setUsers((prev) =>
            prev.map((u) => (u.id === editingUser.id ? { ...u, ...form, password: undefined } : u))
          );
          addAuditEntry("Updated", form.name);
        }
      } else {
        // Add new user
        const role_id = form.role === "Boss" ? 3 : form.role === "HR" ? 2 : 1;
        await addUser(form.name, form.email, form.password, role_id, token);
        const updatedUsers = await getUserList(token);
        // normalize as before
        const normalizedUsers = updatedUsers.map((u: any) => ({
          id: u.user_id,
          name: u.name,
          email: u.email,
          department: u.department || "",
          role: typeof u.role === "string" ? u.role : u.role.role_name,
        }));
        setUsers(normalizedUsers);
        addAuditEntry("Added", form.name);
      }
      resetForm();
      setShowAddUserForm(false);
    } catch (e: any) {
      setError(e.message || "Failed to save user");
    }
    setLoading(false);
  };

  // Remove user action
  const removeUser = async (id: string) => {
    const userToRemove = users.find((u) => u.id === id);
    if (!userToRemove) return;
    if (!window.confirm(`Remove user ${userToRemove.name}?`)) return;

    setLoading(true);
    const token = localStorage.getItem("token") ?? undefined;
    try {
      await deleteUser(id, token);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      addAuditEntry("Removed", userToRemove.name);
    } catch (e: any) {
      setError(e.message || "Failed to remove user");
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 bg-white rounded shadow-lg relative">
      <h2 className="text-3xl font-bold">User Management</h2>

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search users"
          className="flex-grow border border-gray-300 rounded px-3 py-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={loading}
        />
        <button
          onClick={startAddUser}
          className="flex items-center gap-2 bg-green-600 px-4 py-2 rounded text-white hover:bg-green-700"
          disabled={loading}
        >
          <FaPlus /> Add User
        </button>
      </div>

      {showAddUserForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded shadow-lg p-8 w-full max-w-md relative">
            <h3 className="text-xl font-semibold mb-3">{editingUser ? "Edit User" : "Add User"}</h3>
            {error && <p className="mb-3 text-red-600">{error}</p>}
            <input
              type="text"
              placeholder="Name"
              className="w-full border border-gray-300 rounded px-3 py-2 mb-2"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              disabled={loading}
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full border border-gray-300 rounded px-3 py-2 mb-2"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              disabled={loading || Boolean(editingUser)}
              title={editingUser ? "Cannot edit email" : undefined}
            />
            {!editingUser && (
              <input
                type="password"
                placeholder="Password"
                className="w-full border border-gray-300 rounded px-3 py-2 mb-2"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                disabled={loading}
              />
            )}
            <input
              type="text"
              placeholder="Department"
              className="w-full border border-gray-300 rounded px-3 py-2 mb-2"
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
              disabled={loading}
            />
            <select
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value as User["role"] })}
              disabled={loading}
            >
              <option value="Employee">Employee</option>
              <option value="HR">HR</option>
              <option value="Boss">Boss</option>
            </select>
            <div className="flex gap-4">
              <button
                onClick={saveUser}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => setShowAddUserForm(false)}
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
                disabled={loading}
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
              <th className="border-b border-gray-300 px-4 py-2 text-left">Email</th>
              <th className="border-b border-gray-300 px-4 py-2 text-left">Department</th>
              <th className="border-b border-gray-300 px-4 py-2 text-left">Role</th>
              <th className="border-b border-gray-300 px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-4 text-gray-500">
                  No users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="border-b border-gray-300 px-4 py-2">{user.id}</td>
                  <td className="border-b border-gray-300 px-4 py-2">{user.name}</td>
                  <td className="border-b border-gray-300 px-4 py-2">{user.email}</td>
                  <td className="border-b border-gray-300 px-4 py-2">{user.department}</td>
                  <td className="border-b border-gray-300 px-4 py-2">{user.role}</td>
                  <td className="border-b border-gray-300 px-4 py-2">
                    <button
                      onClick={() => startEditUser(user)}
                      className="text-blue-600 hover:underline mr-4"
                      title="Edit user"
                      disabled={loading}
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => removeUser(user.id)}
                      className="text-red-600 hover:underline"
                      title="Remove user"
                      disabled={loading}
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
            {audit.map((entry) => (
              <li key={entry.id}>
                [{entry.date}] <strong>{entry.by}</strong> {entry.action} <strong>{entry.userName}</strong>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
