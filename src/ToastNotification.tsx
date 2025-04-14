import React, { useEffect, useState } from 'react';
import './ToastNotification.css'; // We'll create this CSS file next

interface ToastProps {
  id: number;
  message: string;
  timestamp: string; // Add timestamp prop
  duration?: number; // Duration in ms before starting fade out
  onRemove: (id: number) => void;
}

const ToastNotification: React.FC<ToastProps> = ({ 
  id, 
  message, 
  timestamp, // Receive timestamp
  duration = 2000, // Keep the longer duration from previous change
  onRemove 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Timer to start fade out
    const fadeTimer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    // Timer to actually remove the component after fade out animation
    const removeTimer = setTimeout(() => {
      onRemove(id);
    }, duration + 500); // duration + fadeOut animation time (0.5s)

    // Cleanup timers on unmount
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [id, duration, onRemove]);

  return (
    <div className={`toast-notification ${isVisible ? 'toast-visible' : 'toast-hidden'}`}>
      <div className="toast-message">{message}</div>
      <div className="toast-timestamp">{timestamp}</div>
    </div>
  );
};

export default ToastNotification; 