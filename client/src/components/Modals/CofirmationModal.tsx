import React from 'react';

interface ConfirmationModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  caution?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ show, onClose, onConfirm, title, message, caution }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <p>{message}</p>
        {caution && <p className="text-error-800 ">{caution}</p>}
        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2">Cancel</button>
          <button onClick={onConfirm} className="bg-error-800 hover:bg-error-800 text-white font-bold py-2 px-4 rounded">Delete</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
