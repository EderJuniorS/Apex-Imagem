
import React from 'react';
import FunctionCard from './FunctionCard';
import UploadArea from './UploadArea';
import type { Mode, CreateFunction, EditFunction } from '../types';
import { SpinnerIcon, GenerateIcon } from './Icons';

interface LeftPanelProps {
    prompt: string;
    setPrompt: (value: string) => void;
    mode: Mode;
    setMode: (mode: Mode) => void;
    createFunction: CreateFunction;
    setCreateFunction: (fn: CreateFunction) => void;
    editFunction: EditFunction;
    setEditFunction: (fn: EditFunction) => void;
    image1: File | null;
    setImage1: (file: File | null) => void;
    image2: File | null;
    setImage2: (file: File | null) => void;
    onGenerate: () => void;
    isLoading: boolean;
}

const LeftPanel: React.FC<LeftPanelProps> = ({
    prompt, setPrompt, mode, setMode, createFunction, setCreateFunction,
    editFunction, setEditFunction, image1, setImage1, image2, setImage2, onGenerate, isLoading
}) => {
    const isTwoImageMode = mode === 'edit' && editFunction === 'compose';

    const handleFunctionSelect = (fn: CreateFunction | EditFunction) => {
        if (mode === 'create') {
            setCreateFunction(fn as CreateFunction);
        } else {
            setEditFunction(fn as EditFunction);
        }
    };

    const createFunctions: { name: string; icon: string; id: CreateFunction }[] = [
        { name: 'Prompt', icon: '✨', id: 'free' },
        { name: 'Adesivos', icon: '🏷️', id: 'sticker' },
        { name: 'Logo', icon: '📝', id: 'text' },
        { name: 'HQ', icon: '💭', id: 'comic' },
    ];
    
    const editFunctions: { name: string; icon: string; id: EditFunction }[] = [
        { name: 'Adicionar', icon: '➕', id: 'add-remove' },
        { name: 'Retoque', icon: '🎯', id: 'retouch' },
        { name: 'Estilo', icon: '🎨', id: 'style' },
        { name: 'Unir', icon: '🖼️', id: 'compose' },
    ];

    const showSingleUpload = mode === 'edit' && !isTwoImageMode;

    return (
        <div className="w-full md:w-[420px] md:flex-shrink-0 bg-black/30 backdrop-blur-xl border-r border-white/10 p-6 flex flex-col min-h-screen">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-white bg-clip-text text-transparent">🎨 AI Image Studio</h1>
                <p className="text-white/60 mt-2">Gerador profissional de imagens</p>
            </div>

            <div className="mb-6">
                <label className="block text-lg font-semibold mb-3">💭 Descreva sua ideia</label>
                <textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full h-40 p-4 bg-gray-900/50 border border-white/20 rounded-lg text-white/90 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300 resize-none"
                    placeholder="Descreva a imagem que você deseja criar..."
                />
            </div>

            <div className="grid grid-cols-2 gap-2 p-1 bg-gray-900/50 rounded-lg border border-white/20 mb-6">
                <button onClick={() => setMode('create')} className={`px-4 py-2 rounded-md transition-colors text-sm font-medium ${mode === 'create' ? 'bg-yellow-400 text-black' : 'hover:bg-white/10'}`}>
                    Criar
                </button>
                <button onClick={() => setMode('edit')} className={`px-4 py-2 rounded-md transition-colors text-sm font-medium ${mode === 'edit' ? 'bg-yellow-400 text-black' : 'hover:bg-white/10'}`}>
                    Editar
                </button>
            </div>

            {mode === 'create' && (
                <div className="grid grid-cols-4 gap-3 mb-6">
                    {createFunctions.map(fn => (
                        <FunctionCard key={fn.id} name={fn.name} icon={fn.icon} isActive={createFunction === fn.id} onClick={() => handleFunctionSelect(fn.id)} />
                    ))}
                </div>
            )}

            {mode === 'edit' && (
                 <div className="grid grid-cols-4 gap-3 mb-6">
                    {editFunctions.map(fn => (
                        <FunctionCard key={fn.id} name={fn.name} icon={fn.icon} isActive={editFunction === fn.id} onClick={() => handleFunctionSelect(fn.id)} />
                    ))}
                </div>
            )}
            
            <div className="flex-grow">
                {isTwoImageMode && (
                    <div className="space-y-4">
                         <h3 className="text-lg font-semibold mb-2 text-center">📸 Duas Imagens Necessárias</h3>
                        <UploadArea image={image1} setImage={setImage1} id="imageUpload1" title="Primeira Imagem" />
                        <UploadArea image={image2} setImage={setImage2} id="imageUpload2" title="Segunda Imagem" />
                    </div>
                )}
                {showSingleUpload && (
                     <UploadArea image={image1} setImage={setImage1} id="imageUpload1" />
                )}
            </div>

            <button
                id="generateBtn"
                onClick={onGenerate}
                disabled={isLoading}
                className="w-full mt-auto bg-yellow-400 text-black font-bold py-4 px-4 rounded-lg flex items-center justify-center gap-2 text-lg hover:bg-yellow-300 transition-all duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed transform hover:scale-105"
            >
                {isLoading ? <SpinnerIcon /> : <GenerateIcon />}
                <span className="btn-text">{isLoading ? 'Gerando...' : 'Gerar Imagem'}</span>
            </button>
        </div>
    );
};

export default LeftPanel;
