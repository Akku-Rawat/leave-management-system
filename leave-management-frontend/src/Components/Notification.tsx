import React, { useEffect } from "react";

interface NotificationProps {
  title: string;
  message: string;
  type: "success" | "error" | "warning";
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ title, message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  let iconClass = "fas fa-check-circle text-green-500";
  if (type === "error") iconClass = "fas fa-exclamation-circle text-red-500";
  else if (type === "warning") iconClass = "fas fa-exclamation-triangle text-yellow-500";

  return (
    <div className="fixed top-4 right-4 max-w-sm bg-white border border-gray-200 rounded-lg shadow-lg z-50">
      <div className="p-4 flex items-start">
        <div className="flex-shrink-0">
          <i className={iconClass}></i>
        </div>
        <div className="ml-3 w-0 flex-1">
          <p className="text-sm font-medium text-gray-900">{title}</p>
          <p className="mt-1 text-sm text-gray-500">{message}</p>
        </div>
        <button onClick={onClose} className="ml-4 text-gray-400 hover:text-gray-600">
          <i className="fas fa-times"></i>
        </button>
      </div>
    </div>
  );
};

export default Notification;