import React, { useState, useCallback, useEffect } from 'react';
import LeftPanel from './components/LeftPanel';
import RightPanel from './components/RightPanel';
import MobileModal from './components/MobileModal';
import Toast from './components/Toast';
import { useWindowSize } from './hooks/useWindowSize';
import { generateImage as generateImageService } from './services/geminiService';
import type { Mode, CreateFunction, EditFunction, ToastMessage } from './types';
import { functionTemplates, editTemplates } from './constants';

const App: React.FC = () => {
    const [prompt, setPrompt] = useState<string>('');
    const [mode, setMode] = useState<Mode>('create');
    const [createFunction, setCreateFunction] = useState<CreateFunction>('free');
    const [editFunction, setEditFunction] = useState<EditFunction>('add-remove');
    
    const [image1, setImage1] = useState<File | null>(null);
    const [image2, setImage2] = useState<File | null>(null);
    
    const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadingMessage, setLoadingMessage] = useState<string>('Gerando sua imagem...');

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [toast, setToast] = useState<ToastMessage | null>(null);

    const { width } = useWindowSize();
    const isMobile = width <= 768;

    const loadingMessages = [
        'Gerando sua imagem...',
        'Criando arte incrível...',
        'Processando criatividade...',
        'Quase pronto...',
        'Aplicando magia IA...'
    ];

    useEffect(() => {
        // Fix: Replace NodeJS.Timeout with ReturnType<typeof setInterval> for browser compatibility.
        let interval: ReturnType<typeof setInterval> | null = null;
        if (isLoading) {
            interval = setInterval(() => {
                setLoadingMessage(prev => {
                    const currentIndex = loadingMessages.indexOf(prev);
                    const nextIndex = (currentIndex + 1) % loadingMessages.length;
                    return loadingMessages[nextIndex];
                });
            }, 2000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading]);
    
    const showToast = (message: string, type: 'success' | 'error' | 'info') => {
        setToast({ message, type, id: Date.now() });
    };

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve((reader.result as string).split(',')[1]);
            reader.onerror = error => reject(error);
        });
    };

    const handleGenerate = useCallback(async () => {
        if (!prompt) {
            showToast('Por favor, insira um prompt.', 'error');
            return;
        }

        const activeFunction = mode === 'create' ? createFunction : editFunction;
        const requiresTwoImages = activeFunction === 'compose';
        const requiresOneImage = mode === 'edit' && !requiresTwoImages;

        if (requiresTwoImages && (!image1 || !image2)) {
            showToast('Esta função requer duas imagens.', 'error');
            return;
        }
        if (requiresOneImage && !image1) {
            showToast('Esta função requer uma imagem.', 'error');
            return;
        }

        setIsLoading(true);
        setGeneratedImageUrl(null);

        try {
            let fullPrompt = prompt;
            if (mode === 'create' && functionTemplates[createFunction]) {
                fullPrompt = `${functionTemplates[createFunction]} ${prompt}`;
            } else if (mode === 'edit' && editTemplates[editFunction]) {
                fullPrompt = `${editTemplates[editFunction]} ${prompt}`;
            }

            const images: { data: string; mimeType: string }[] = [];
            if (image1) {
                images.push({ data: await fileToBase64(image1), mimeType: image1.type });
            }
            if (image2) {
                images.push({ data: await fileToBase64(image2), mimeType: image2.type });
            }

            const resultBase64 = await generateImageService(fullPrompt, images);
            const imageUrl = `data:image/png;base64,${resultBase64}`;
            setGeneratedImageUrl(imageUrl);
            
            if (isMobile) {
                setIsModalOpen(true);
            }
            showToast('Imagem gerada com sucesso!', 'success');
        } catch (error) {
            console.error('Generation Error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.';
            showToast(`Erro: ${errorMessage}`, 'error');
        } finally {
            setIsLoading(false);
        }
    }, [prompt, mode, createFunction, editFunction, image1, image2, isMobile]);
    
    const handleEditCurrentImage = () => {
        if (!generatedImageUrl) return;

        fetch(generatedImageUrl)
            .then(res => res.blob())
            .then(blob => {
                const file = new File([blob], 'generated-image.png', { type: 'image/png' });
                setMode('edit');
                setEditFunction('add-remove');
                setImage1(file);
                setImage2(null);
                setPrompt('');
                setGeneratedImageUrl(null);
                if(isMobile) setIsModalOpen(false);
                showToast('Imagem carregada para edição!', 'success');
            });
    };

    const handleDownloadImage = () => {
        if (!generatedImageUrl) return;
        const link = document.createElement('a');
        link.href = generatedImageUrl;
        link.download = `ai-studio-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('Download iniciado!', 'success');
    };

    const handleNewImage = () => {
        setPrompt('');
        setMode('create');
        setCreateFunction('free');
        setImage1(null);
        setImage2(null);
        setGeneratedImageUrl(null);
        setIsModalOpen(false);
    };

    return (
        <div className="relative min-h-screen text-gray-200 font-sans" style={{ backgroundImage: `
            radial-gradient(ellipse 40% 50% at 20% 20%, rgba(240, 219, 79, 0.1), transparent),
            radial-gradient(ellipse 40% 50% at 80% 90%, rgba(80, 120, 255, 0.1), transparent)` }}>
            <div className="container mx-auto flex min-h-screen">
                <LeftPanel
                    prompt={prompt}
                    setPrompt={setPrompt}
                    mode={mode}
                    setMode={setMode}
                    createFunction={createFunction}
                    setCreateFunction={setCreateFunction}
                    editFunction={editFunction}
                    setEditFunction={setEditFunction}
                    image1={image1}
                    setImage1={setImage1}
                    image2={image2}
                    setImage2={setImage2}
                    onGenerate={handleGenerate}
                    isLoading={isLoading}
                />
                {!isMobile && (
                    <RightPanel
                        isLoading={isLoading}
                        loadingMessage={loadingMessage}
                        generatedImageUrl={generatedImageUrl}
                        onEdit={handleEditCurrentImage}
                        onDownload={handleDownloadImage}
                    />
                )}
            </div>
            {isMobile && (
                <MobileModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    imageUrl={generatedImageUrl}
                    onEdit={handleEditCurrentImage}
                    onDownload={handleDownloadImage}
                    onNew={handleNewImage}
                />
            )}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onDismiss={() => setToast(null)}
                />
            )}
        </div>
    );
};

export default App;