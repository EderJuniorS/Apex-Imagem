
import React, { useEffect } from 'react';

interface ToastProps {
    message: string;
    type: 'success' | 'error' | 'info';
    onDismiss: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onDismiss }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onDismiss();
        }, 3000);

        return () => {
            clearTimeout(timer);
        };
    }, [onDismiss]);

    const baseClasses = 'fixed top-5 right-5 p-4 rounded-lg shadow-lg text-white font-semibold z-50 animate-slide-in';
    const typeClasses = {
        success: 'bg-green-600',
        error: 'bg-red-600',
        info: 'bg-blue-600',
    };

    return (
        <div className={`${baseClasses} ${typeClasses[type]}`}>
            {message}
        </div>
    );
};

export default Toast;
