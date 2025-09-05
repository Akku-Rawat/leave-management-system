import React from 'react';

interface EncashmentModalProps {
  visible: boolean;
  onClose: () => void;
  availableLeaves: number;
  onConfirm: () => void;
}

const EncashmentModal: React.FC<EncashmentModalProps> = ({
  visible,
  onClose,
  availableLeaves,
  onConfirm,
}) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
        <h2 className="text-xl font-bold mb-4">Leave Encashment</h2>
        <p>
          You have <strong>{availableLeaves}</strong> leaves available for encashment.
        </p>
        <p>Please confirm if you want to encash your leaves.</p>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default EncashmentModal;
