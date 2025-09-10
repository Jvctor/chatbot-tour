import React from 'react';

interface NotificationProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose?: () => void;
}

const typeStyles = {
  success: 'bg-green-100 text-green-800 border-green-300',
  error: 'bg-red-100 text-red-800 border-red-300',
  info: 'bg-blue-100 text-blue-800 border-blue-300',
};

const Notification: React.FC<NotificationProps> = ({ message, type = 'info', onClose }) => {
  return (
    <div
      className={`fixed top-6 right-6 z-50 border px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 transition-all duration-300 ${typeStyles[type]}`}
      role="alert"
    >
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-4 text-sm text-gray-500 hover:text-gray-800 focus:outline-none"
          aria-label="Fechar notificação"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default Notification;
