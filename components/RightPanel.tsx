
import React from 'react';
import { EditIcon, DownloadIcon } from './Icons';

interface RightPanelProps {
    isLoading: boolean;
    loadingMessage: string;
    generatedImageUrl: string | null;
    onEdit: () => void;
    onDownload: () => void;
}

const RightPanel: React.FC<RightPanelProps> = ({ isLoading, loadingMessage, generatedImageUrl, onEdit, onDownload }) => {
    return (
        <div className="hidden md:flex flex-1 flex-col items-center justify-center p-6 bg-black/10">
            {isLoading && (
                <div id="loadingContainer" className="text-center">
                    <div className="w-16 h-16 border-4 border-t-yellow-400 border-gray-600 rounded-full animate-spin mx-auto"></div>
                    <p id="loadingText" className="text-white/70 mt-4 text-lg">{loadingMessage}</p>
                </div>
            )}

            {!isLoading && !generatedImageUrl && (
                <div id="resultPlaceholder" className="text-center text-white/40">
                    <div className="text-7xl mb-4">🎨</div>
                    <p className="text-xl">Sua obra de arte aparecerá aqui</p>
                </div>
            )}

            {!isLoading && generatedImageUrl && (
                <div id="imageContainer" className="relative w-full h-full flex items-center justify-center">
                    <img id="generatedImage" src={generatedImageUrl} alt="Generated Art" className="max-w-full max-h-full object-contain rounded-lg shadow-2xl shadow-black/50" />
                    <div className="absolute top-4 right-4 flex gap-3">
                        <button onClick={onEdit} title="Editar" className="w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-yellow-400 hover:text-black transition-all">
                            <EditIcon />
                        </button>
                        <button onClick={onDownload} title="Download" className="w-10 h-10 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-yellow-400 hover:text-black transition-all">
                            <DownloadIcon />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RightPanel;
