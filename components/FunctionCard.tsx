
import React from 'react';

interface FunctionCardProps {
    name: string;
    icon: string;
    isActive: boolean;
    onClick: () => void;
}

const FunctionCard: React.FC<FunctionCardProps> = ({ name, icon, isActive, onClick }) => {
    const activeClasses = 'border-yellow-400 bg-yellow-400/10 scale-105';
    const inactiveClasses = 'border-white/20 bg-gray-900/50 hover:border-yellow-400/50';

    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center justify-center p-2 rounded-lg border text-center transition-all duration-200 ${isActive ? activeClasses : inactiveClasses}`}
        >
            <div className="text-2xl">{icon}</div>
            <div className="text-xs mt-1 font-medium text-white/80">{name}</div>
        </button>
    );
};

export default FunctionCard;
