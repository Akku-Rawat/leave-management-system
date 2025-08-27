import React, { useState } from "react";
import { FaUser, FaUserTie, FaUserShield } from "react-icons/fa";
import type { User } from "../Types";

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<"employee" | "hr" | "boss" | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const roles = [
    {
      id: "employee",
      title: "Employee",
      subtitle: "Engineering",
      description: "Apply for leaves and view your history",
      icon: <FaUser className="text-4xl text-blue-600" />,
      bgColor: "bg-blue-50",
      hoverColor: "hover:bg-blue-100",
      borderColor: "border-blue-200",
      sampleId: "emp123",
    },
    {
      id: "hr",
      title: "HR Manager",
      subtitle: "Human Resources", 
      description: "Manage leave requests and employee data",
      icon: <FaUserTie className="text-4xl text-green-600" />,
      bgColor: "bg-green-50",
      hoverColor: "hover:bg-green-100", 
      borderColor: "border-green-200",
      sampleId: "hr456",
    },
    {
      id: "boss",
      title: "Executive",
      subtitle: "Executive",
      description: "View analytics and workforce planning",
      icon: <FaUserShield className="text-4xl text-purple-600" />,
      bgColor: "bg-purple-50",
      hoverColor: "hover:bg-purple-100",
      borderColor: "border-purple-200", 
      sampleId: "boss789",
    },
  ];

  const handleRoleSelect = (roleId: "employee" | "hr" | "boss") => {
    setSelectedRole(roleId);
    setIsLoading(true);

    // Simulate login process
    setTimeout(() => {
      const selectedRoleData = roles.find(r => r.id === roleId);
      const user: User = {
        role: roleId,
        name: selectedRoleData?.title || roleId,
        id: selectedRoleData?.sampleId || roleId,
        department: selectedRoleData?.subtitle || "",
      };

      onLogin(user);
      setIsLoading(false);
    }, 1500);
  };

  if (isLoading && selectedRole) {
    const loadingRole = roles.find(r => r.id === selectedRole);
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-700">
            Loading {loadingRole?.title}...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Leave Management System
          </h1>
          <p className="text-xl text-gray-600">
            Professional. Efficient. Reliable.
          </p>
        </div>

        {/* Role Selection */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-center text-gray-700 mb-8">
            Select your role to access the appropriate dashboard
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {roles.map((role) => (
              <div
                key={role.id}
                onClick={() => handleRoleSelect(role.id as "employee" | "hr" | "boss")}
                className={`${role.bgColor} ${role.hoverColor} ${role.borderColor} 
                  border-2 rounded-xl p-8 text-center cursor-pointer 
                  transition-all duration-200 transform hover:scale-105 hover:shadow-lg`}
              >
                <div className="mb-6">{role.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {role.title}
                </h3>
                <p className="text-sm font-medium text-gray-600 mb-3">
                  {role.subtitle}
                </p>
                <p className="text-gray-600 mb-4">{role.description}</p>
                <p className="text-xs text-gray-500">ID: {role.sampleId}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16">
          <p className="text-gray-500 text-sm">
            © 2025 ROLAFACE Leave Management System
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;