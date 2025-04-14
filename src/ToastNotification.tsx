import React, { useEffect, useState } from 'react';
import './ToastNotification.css'; // We'll create this CSS file next

interface ToastProps {
  id: number;
  message: string;
  duration?: number; // Duration in ms before starting fade out
  onRemove: (id: number) => void;
}

const ToastNotification: React.FC<ToastProps> = ({ 
  id, 
  message, 
  duration = 1000, // Default display duration before fade out
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
      {message}
    </div>
  );
};

export default ToastNotification; 