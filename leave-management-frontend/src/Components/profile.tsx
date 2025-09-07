import React, { useState, useEffect } from "react";
import type { User } from "../Types";
import { FaUpload } from "react-icons/fa";
import { changePassword } from "../services/api";

interface ProfileProps {
  currentUser: User;
}

const Profile: React.FC<ProfileProps> = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState<"profile" | "privacy" | "documents">("profile");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [, setAvatarFile] = useState<File | null>(null);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarPreview]);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all required fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token") ?? undefined;
      await changePassword(oldPassword, newPassword, token);
      setMessage("Password updated successfully.");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err.message || "Failed to update password.");
    }
    setLoading(false);
  };

  const roleName =
    typeof currentUser.role === "string" ? currentUser.role : currentUser.role.role_name;

  return (
    <div className="max-w-6xl mx-auto mt-12 bg-white rounded-2xl shadow-lg overflow-hidden">
      <h1 className="text-3xl font-semibold text-gray-900 px-8 py-5 border-b border-gray-300">
        Your Profile
      </h1>

      {/* Tabs */}
      <div className="flex border-b border-gray-300 text-gray-700 font-semibold text-sm">
        {["profile", "privacy", "documents"].map((tab) => (
          <button
            key={tab}
            className={`flex-1 py-3 text-center transition-colors ${
              activeTab === tab
                ? "text-blue-600 border-b-4 border-blue-600"
                : "hover:text-blue-600 border-b-4 border-transparent"
            }`}
            onClick={() => setActiveTab(tab as any)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Profile tab */}
      {activeTab === "profile" && (
        <div className="flex flex-col md:flex-row gap-12 p-10">
          <div className="flex flex-col items-center md:items-start min-w-[220px]">
            <div className="relative w-48 h-48 rounded-full border border-gray-200 shadow-lg overflow-hidden">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Profile Preview" className="object-cover w-full h-full" />
              ) : (
                <div className="bg-gradient-to-tr from-blue-600 to-indigo-700 flex items-center justify-center w-full h-full text-white text-7xl font-extrabold uppercase select-none">
                  {currentUser.name.charAt(0)}
                </div>
              )}
            </div>

            <label
              htmlFor="avatar-upload"
              className="mt-5 flex cursor-pointer items-center gap-2 rounded-md border border-blue-600 px-4 py-2 text-blue-600 font-semibold hover:bg-blue-50"
              title="Upload Profile Photo"
            >
              <FaUpload />
              <span>Upload Photo</span>
            </label>
            <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />

            <p className="mt-6 text-3xl font-bold text-gray-900">{currentUser.name}</p>
            <p className="capitalize text-gray-600">{roleName}</p>
          </div>

          <section className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-10 text-gray-700 text-lg">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 border-b border-gray-300 pb-2">
                Personal Information
              </h2>
              <dl className="space-y-6">
                <div className="flex justify-between">
                  <dt className="font-semibold text-gray-800">Email</dt>
                  <dd className="text-right">{currentUser.email || "N/A"}</dd>
                </div>

                <div className="flex justify-between">
                  <dt className="font-semibold text-gray-800">User ID</dt>
                  <dd className="text-right">{currentUser.id}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-semibold text-gray-800">Joined On</dt>
                  <dd className="text-right">1 Jan 2023</dd>
                </div>
              </dl>
            </div>
          </section>
        </div>
      )}

      {/* Privacy tab (Change Password) */}
      {activeTab === "privacy" && (
        <section className="max-w-lg mx-auto mt-6 p-8 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center border-b border-gray-300 pb-3">
            Change Password
          </h2>
          <form onSubmit={handleChangePassword} className="space-y-6">
            <div>
             <label htmlFor="oldPassword" className="block text-gray-700 font-semibold mb-2">
               Current Password
             </label>
             <input
               id="oldPassword"
               type="password"
               value={oldPassword}
               onChange={(e) => setOldPassword(e.target.value)}
               placeholder="Enter current password"
               required
               className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-600 focus:outline-none"
             />
           </div>
            <div>
              <label htmlFor="newPassword" className="block text-gray-700 font-semibold mb-2">
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-gray-700 font-semibold mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
            </div>
            {error && <p className="text-red-600 font-semibold">{error}</p>}
            {message && <p className="text-green-600 font-semibold">{message}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </section>
      )}

      {/* Documents tab */}
      {activeTab === "documents" && (
        <section className="max-w-4xl mx-auto mt-10 p-10 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center border-b border-gray-300 pb-3">
            Documents
          </h2>
          <p className="text-gray-700 text-lg text-center">Your uploaded documents will appear here.</p>
        </section>
      )}
    </div>
  );
};

export default Profile;
