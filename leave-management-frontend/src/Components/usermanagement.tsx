// src/components/UserManagement.tsx

import React, { useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  role: "employee" | "hr" | "boss";
  department: string;
  email: string;
  status: "active" | "inactive";
}

const initialUsers: User[] = [
  {
    id: "dixant",
    name: "Dixant Sharma",
    role: "employee",
    department: "Engineering",
    email: "dixant@rolaface.com",
    status: "active",
  },
  {
    id: "manoj",
    name: "Manoj Singh",
    role: "hr",
    department: "Human Resources",
    email: "manoj@rolaface.com",
    status: "active",
  },
  {
    id: "shivangi",
    name: "Shivangi Patil",
    role: "boss",
    department: "Executive",
    email: "shivangi@rolaface.com",
    status: "active",
  },
];

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<Omit<User, "id" | "status"> & { id?: string }>({
    id: "",
    name: "",
    role: "employee",
    department: "",
    email: "",
  });

  // Filtered users list by search
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.id.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase()) ||
      u.department.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  // Handle form changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Start editing existing user
  const startEditing = (user: User) => {
    setEditingUser(user);
    setFormData({
      id: user.id,
      name: user.name,
      role: user.role,
      department: user.department,
      email: user.email,
    });
  };

  const resetForm = () => {
    setEditingUser(null);
    setFormData({ id: "", name: "", role: "employee", department: "", email: "" });
  };

  // Add new or update existing user
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      // update
      setUsers((u) =>
        u.map((usr) =>
          usr.id === editingUser.id
            ? {
                ...usr,
                name: formData.name,
                role: formData.role,
                department: formData.department,
                email: formData.email,
              }
            : usr
        )
      );
    } else {
      if (!(formData.id ?? "").trim()) {
        alert("Please enter unique employee ID.");
        return;
      }
      if (users.some((u) => u.id === (formData.id ?? "").trim())) {
        alert("User ID already exists.");
        return;
      }
      // add
      setUsers((u) => [
        ...u,
        {
          id: formData.id.trim(),
          name: formData.name,
          role: formData.role,
          department: formData.department,
          email: formData.email,
          status: "active",
        },
      ]);
    }
    resetForm();
  };

  // Soft delete user (toggle active/inactive)
  const toggleStatus = (id: string) => {
    setUsers((u) =>
      u.map((usr) => (usr.id === id ? { ...usr, status: usr.status === "active" ? "inactive" : "active" } : usr))
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name, ID, role, department, email..."
        className="w-full max-w-md px-4 py-2 mb-6 border rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* User Table */}
      <div className="overflow-x-auto border rounded">
        <table className="w-full table-auto border-collapse">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3 border-b">Employee ID</th>
              <th className="p-3 border-b">Name</th>
              <th className="p-3 border-b">Role</th>
              <th className="p-3 border-b">Department</th>
              <th className="p-3 border-b">Email</th>
              <th className="p-3 border-b">Status</th>
              <th className="p-3 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center p-4 text-gray-500">
                  No users found.
                </td>
              </tr>
            )}

            {filteredUsers.map((user) => (
              <tr key={user.id} className={user.status === "inactive" ? "bg-red-50" : ""}>
                <td className="p-3 border-b">{user.id}</td>
                <td className="p-3 border-b">{user.name}</td>
                <td className="p-3 border-b capitalize">{user.role}</td>
                <td className="p-3 border-b">{user.department}</td>
                <td className="p-3 border-b">{user.email}</td>
                <td className="p-3 border-b">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      user.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="p-3 border-b space-x-2">
                  <button
                    onClick={() => startEditing(user)}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => toggleStatus(user.id)}
                    className={`px-3 py-1 text-sm rounded hover:${
                      user.status === "active" ? "bg-red-600 text-white" : "bg-green-600 text-white"
                    } ${
                      user.status === "active" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                    }`}
                  >
                    {user.status === "active" ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit User Form */}
      <div className="mt-8 max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">{editingUser ? "Edit User" : "Add New User"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!editingUser && (
            <div>
              <label htmlFor="id" className="block font-medium mb-1">
                Employee ID
              </label>
              <input
                type="text"
                name="id"
                id="id"
                value={formData.id}
                onChange={handleInputChange}
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>
          )}

          <div>
            <label htmlFor="name" className="block font-medium mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="role" className="block font-medium mb-1">
              Role
            </label>
            <select
              name="role"
              id="role"
              value={formData.role}
              onChange={handleInputChange}
              required
              className="w-full border rounded px-3 py-2"
            >
              <option value="employee">Employee</option>
              <option value="hr">HR Manager</option>
              <option value="boss">Executive</option>
            </select>
          </div>

          <div>
            <label htmlFor="department" className="block font-medium mb-1">
              Department
            </label>
            <input
              type="text"
              name="department"
              id="department"
              value={formData.department}
              onChange={handleInputChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="email" className="block font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
            >
              {editingUser ? "Update User" : "Add User"}
            </button>
            {editingUser && (
              <button
                type="button"
                onClick={() => {
                  setEditingUser(null);
                  setFormData({ id: "", name: "", role: "employee", department: "", email: "" });
                }}
                className="bg-gray-200 rounded px-4 py-2 hover:bg-gray-300"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserManagement;
