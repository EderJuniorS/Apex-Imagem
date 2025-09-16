
import React from 'react';
import { EditIcon, DownloadIcon, NewImageIcon } from './Icons';

interface MobileModalProps {
    isOpen: boolean;
    onClose: () => void;
    imageUrl: string | null;
    onEdit: () => void;
    onDownload: () => void;
    onNew: () => void;
}

const MobileModal: React.FC<MobileModalProps> = ({ isOpen, onClose, imageUrl, onEdit, onDownload, onNew }) => {
    if (!isOpen) return null;

    return (
        <div 
            id="mobileModal" 
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4"
            onClick={onClose}
        >
            <div 
                className="bg-[#1f1f1f] border border-white/20 rounded-2xl p-4 w-full max-w-lg flex flex-col gap-4 shadow-2xl shadow-black/50 animate-fade-in"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex-grow flex items-center justify-center">
                    {imageUrl ? (
                        <img id="modalImage" src={imageUrl} alt="Generated Art" className="max-w-full max-h-[60vh] object-contain rounded-lg" />
                    ) : (
                        <div className="text-white/50">Carregando imagem...</div>
                    )}
                </div>
                <div id="modal-actions" className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button onClick={onEdit} className="py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-semibold flex items-center justify-center gap-2 transition-colors">
                        <EditIcon /> Editar
                    </button>
                    <button onClick={onDownload} className="py-3 px-4 bg-green-600 hover:bg-green-500 rounded-lg text-white font-semibold flex items-center justify-center gap-2 transition-colors">
                        <DownloadIcon /> Salvar
                    </button>
                    <button onClick={onNew} className="py-3 px-4 bg-yellow-400 hover:bg-yellow-300 rounded-lg text-black font-semibold flex items-center justify-center gap-2 transition-colors">
                        <NewImageIcon /> Nova Imagem
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MobileModal;
