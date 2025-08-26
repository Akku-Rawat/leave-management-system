import React, { useState } from "react";

interface User {
  role: 'employee' | 'hr' | 'boss';
  name: string;
  id: string;
  department: string;
  email: string;
}

interface LoginPageProps {
  onLogin: (user: User) => void;
}

// PROFESSIONAL VERSION - Normal size, not zoomed out
const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>('');

  const users: User[] = [
    {
      role: 'employee',
      name: 'Dixant Negi',
      id: 'emp123',
      department: 'Engineering',
      email: 'Dixant@rolaface.com'
    },
    {
      role: 'hr',
      name: 'Bhatt Sir',
      id: 'hr456',
      department: 'Human Resources',
      email: 'bhatt@rolaface.com'
    },
    {
      role: 'boss',
      name: 'Boss',
      id: 'boss789',
      department: 'Executive',
      email: 'boss@rolaface.com'
    }
  ];

  const handleLogin = (user: User) => {
    setSelectedRole(user.role);
    setIsLoading(true);
    setTimeout(() => {
      onLogin(user);
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-briefcase text-white text-xl"></i>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-3">ROLAFACE</h2>
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-3"></div>
          <p className="text-gray-600 text-sm">Loading {selectedRole}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-gray-100 flex flex-col items-center justify-center p-4">

      {/* Header - Proper size */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-briefcase text-white text-xl"></i>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-1">
          ROL<span className="text-blue-600">A</span>FACE
        </h1>
        <p className="text-lg text-gray-600 mb-1">Leave Management System</p>
        <p className="text-gray-500 text-sm">Professional. Efficient. Reliable.</p>
      </div>

      {/* Main Card - Normal size */}
      <div className="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-3xl">

        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <h2 className="text-lg font-bold text-white text-center flex items-center justify-center">
            <i className="fas fa-sign-in-alt mr-2"></i>
            Choose Your Access Level
          </h2>
          <p className="text-blue-100 text-center mt-1 text-sm">
            Select your role to access the appropriate dashboard
          </p>
        </div>

        {/* User Cards - Normal size */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Employee Card */}
            <div 
              onClick={() => handleLogin(users[0])}
              className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 text-center cursor-pointer hover:bg-blue-100 hover:border-blue-300 transition-all duration-200"
            >
              <div className="w-14 h-14 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-user text-white text-lg"></i>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Dixant Negi</h3>
              <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium inline-block mb-3">
                Employee Portal
              </div>
              <p className="text-gray-600 text-sm mb-1">Engineering</p>
              <p className="text-gray-500 text-xs mb-4">ID: emp123</p>
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                <i className="fas fa-arrow-right mr-1"></i>
                Login
              </button>
            </div>

            {/* HR Card */}
            <div 
              onClick={() => handleLogin(users[1])}
              className="bg-green-50 border-2 border-green-200 rounded-lg p-6 text-center cursor-pointer hover:bg-green-100 hover:border-green-300 transition-all duration-200"
            >
              <div className="w-14 h-14 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-building text-white text-lg"></i>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Bhatt Sir</h3>
              <div className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium inline-block mb-3">
                HR Manager
              </div>
              <p className="text-gray-600 text-sm mb-1">Human Resources</p>
              <p className="text-gray-500 text-xs mb-4">ID: hr456</p>
              <button className="w-full bg-green-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                <i className="fas fa-arrow-right mr-1"></i>
                Login
              </button>
            </div>

            {/* Boss Card */}
            <div 
              onClick={() => handleLogin(users[2])}
              className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6 text-center cursor-pointer hover:bg-purple-100 hover:border-purple-300 transition-all duration-200"
            >
              <div className="w-14 h-14 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-crown text-white text-lg"></i>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Boss</h3>
              <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium inline-block mb-3">
                Executive Dashboard
              </div>
              <p className="text-gray-600 text-sm mb-1">Executive</p>
              <p className="text-gray-500 text-xs mb-4">ID: boss789</p>
              <button className="w-full bg-purple-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                <i className="fas fa-arrow-right mr-1"></i>
                Login
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-6">
        <p className="text-gray-500 text-xs">
          © 2025 ROLAFACE Leave Management System
        </p>
      </div>
    </div>
  );
};

export default LoginPage;