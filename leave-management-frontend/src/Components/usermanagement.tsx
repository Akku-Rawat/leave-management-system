import React, { useState } from "react";
import { 
  FaUsers, 
  FaSearch, 
  FaEdit, 
  FaTrash, 
  FaPlus, 
  FaDownload,
  FaCog,
  FaCheck,
  FaTimes,
  FaEye,
  FaUserPlus
} from "react-icons/fa";

interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  status: 'Active' | 'Inactive';
  joinDate: string;
  totalLeaves: number;
  usedLeaves: number;
  manager: string;
}

interface UserManagementProps {
  onClose: () => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: 'emp123',
      name: 'Dixant Negi',
      email: 'Dixant@rolaface.com',
      department: 'Engineering',
      role: 'Software Developer',
      status: 'Active',
      joinDate: '2023-06-15',
      totalLeaves: 32,
      usedLeaves: 8,
      manager: 'Tech Lead'
    },
    {
      id: 'emp124',
      name: 'Priya Sharma',
      email: 'priya@rolaface.com',
      department: 'Marketing',
      role: 'Marketing Manager',
      status: 'Active',
      joinDate: '2022-03-10',
      totalLeaves: 32,
      usedLeaves: 15,
      manager: 'Marketing Director'
    },
    {
      id: 'emp125',
      name: 'Rohit Kumar',
      email: 'rohit@rolaface.com',
      department: 'Finance',
      role: 'Financial Analyst',
      status: 'Active',
      joinDate: '2023-01-20',
      totalLeaves: 32,
      usedLeaves: 5,
      manager: 'Finance Manager'
    },
    {
      id: 'hr456',
      name: 'Bhatt Sir',
      email: 'bhatt@rolaface.com',
      department: 'Human Resources',
      role: 'HR Manager',
      status: 'Active',
      joinDate: '2021-09-05',
      totalLeaves: 32,
      usedLeaves: 12,
      manager: 'Director HR'
    },
    {
      id: 'emp126',
      name: 'Sarah Wilson',
      email: 'sarah@rolaface.com',
      department: 'Engineering',
      role: 'QA Engineer',
      status: 'Inactive',
      joinDate: '2023-08-01',
      totalLeaves: 32,
      usedLeaves: 3,
      manager: 'QA Lead'
    }
  ]);

  const departments = ['All', 'Engineering', 'Marketing', 'Finance', 'Human Resources'];

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === 'All' || emp.department === departmentFilter;
    const matchesStatus = statusFilter === 'All' || emp.status === statusFilter;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const handleAddEmployee = (newEmployee: Partial<Employee>) => {
    const employee: Employee = {
      id: `emp${Date.now()}`,
      name: newEmployee.name || '',
      email: newEmployee.email || '',
      department: newEmployee.department || '',
      role: newEmployee.role || '',
      status: 'Active',
      joinDate: new Date().toISOString().split('T')[0],
      totalLeaves: 32,
      usedLeaves: 0,
      manager: newEmployee.manager || ''
    };

    setEmployees([...employees, employee]);
    setShowAddModal(false);
    alert('Employee added successfully!');
  };

  const handleEditEmployee = (updatedEmployee: Employee) => {
    setEmployees(employees.map(emp => 
      emp.id === updatedEmployee.id ? updatedEmployee : emp
    ));
    setShowEditModal(false);
    setSelectedEmployee(null);
    alert('Employee updated successfully!');
  };

  const handleDeleteEmployee = (id: string) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      setEmployees(employees.filter(emp => emp.id !== id));
      alert('Employee deleted successfully!');
    }
  };

  const handleToggleStatus = (id: string) => {
    setEmployees(employees.map(emp => 
      emp.id === id ? { ...emp, status: emp.status === 'Active' ? 'Inactive' : 'Active' } : emp
    ));
  };

  const handleExportData = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "ID,Name,Email,Department,Role,Status,Join Date,Total Leaves,Used Leaves,Manager
" +
      filteredEmployees.map(emp => 
        `${emp.id},${emp.name},${emp.email},${emp.department},${emp.role},${emp.status},${emp.joinDate},${emp.totalLeaves},${emp.usedLeaves},${emp.manager}`
      ).join("
");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "employees_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col">

        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 rounded-t-3xl">
          <div className="flex items-center justify-between text-white">
            <div>
              <h2 className="text-2xl font-bold flex items-center">
                <FaUsers className="mr-3" />
                User Management System
              </h2>
              <p className="text-purple-100 mt-1">Manage all employees and their access</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-purple-800 rounded-full transition-colors"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

            {/* Search and Filters */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 w-64"
                />
              </div>

              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleExportData}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors flex items-center font-medium"
              >
                <FaDownload className="mr-2" />
                Export CSV
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors flex items-center font-medium"
              >
                <FaUserPlus className="mr-2" />
                Add Employee
              </button>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredEmployees.length} of {employees.length} employees
          </div>
        </div>

        {/* Employee Table */}
        <div className="flex-1 overflow-auto p-6">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leave Usage</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEmployees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                          <div className="text-sm text-gray-500">{employee.email}</div>
                          <div className="text-xs text-gray-400">ID: {employee.id}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{employee.department}</div>
                        <div className="text-xs text-gray-500">Since {new Date(employee.joinDate).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{employee.role}</div>
                        <div className="text-xs text-gray-500">{employee.manager}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          employee.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {employee.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{employee.usedLeaves} / {employee.totalLeaves}</div>
                        <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{width: `${(employee.usedLeaves / employee.totalLeaves) * 100}%`}}
                          ></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedEmployee(employee);
                              setShowEditModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded"
                            title="Edit Employee"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(employee.id)}
                            className={`p-1 rounded ${
                              employee.status === 'Active' 
                                ? 'text-orange-600 hover:text-orange-900' 
                                : 'text-green-600 hover:text-green-900'
                            }`}
                            title={employee.status === 'Active' ? 'Deactivate' : 'Activate'}
                          >
                            {employee.status === 'Active' ? <FaTimes /> : <FaCheck />}
                          </button>
                          <button
                            onClick={() => alert(`Viewing ${employee.name}'s detailed profile`)}
                            className="text-purple-600 hover:text-purple-900 p-1 rounded"
                            title="View Details"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => handleDeleteEmployee(employee.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded"
                            title="Delete Employee"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filteredEmployees.length === 0 && (
            <div className="text-center py-12">
              <FaUsers className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No employees found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          )}
        </div>

        {/* Add Employee Modal */}
        {showAddModal && (
          <AddEmployeeModal
            onClose={() => setShowAddModal(false)}
            onSave={handleAddEmployee}
            departments={departments.filter(d => d !== 'All')}
          />
        )}

        {/* Edit Employee Modal */}
        {showEditModal && selectedEmployee && (
          <EditEmployeeModal
            employee={selectedEmployee}
            onClose={() => {
              setShowEditModal(false);
              setSelectedEmployee(null);
            }}
            onSave={handleEditEmployee}
            departments={departments.filter(d => d !== 'All')}
          />
        )}
      </div>
    </div>
  );
};

// Add Employee Modal Component
const AddEmployeeModal: React.FC<{
  onClose: () => void;
  onSave: (employee: Partial<Employee>) => void;
  departments: string[];
}> = ({ onClose, onSave, departments }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    role: '',
    manager: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.department && formData.role) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Add New Employee</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                required
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Manager</label>
              <input
                type="text"
                value={formData.manager}
                onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Add Employee
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Edit Employee Modal Component
const EditEmployeeModal: React.FC<{
  employee: Employee;
  onClose: () => void;
  onSave: (employee: Employee) => void;
  departments: string[];
}> = ({ employee, onClose, onSave, departments }) => {
  const [formData, setFormData] = useState(employee);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Edit Employee</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                required
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Manager</label>
              <input
                type="text"
                value={formData.manager}
                onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Leave Allocation</label>
              <input
                type="number"
                value={formData.totalLeaves}
                onChange={(e) => setFormData({ ...formData, totalLeaves: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                min="0"
                max="50"
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Update Employee
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;