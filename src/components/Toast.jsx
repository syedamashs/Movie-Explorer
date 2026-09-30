import React from 'react';
import { usePersonalization } from '../context/PersonalizationContext';
import { FaCheckCircle, FaInfoCircle, FaExclamationCircle } from 'react-icons/fa';

export default function Toast() {
  const { toastMessage } = usePersonalization();

  if (!toastMessage) return null;

  const getIcon = () => {
    switch (toastMessage.type) {
      case 'success':
        return <FaCheckCircle className="text-success fs-5" />;
      case 'error':
        return <FaExclamationCircle className="text-danger fs-5" />;
      default:
        return <FaInfoCircle className="text-info fs-5" />;
    }
  };

  return (
    <div className="floating-toast" role="alert">
      {getIcon()}
      <span>{toastMessage.message}</span>
    </div>
  );
}
