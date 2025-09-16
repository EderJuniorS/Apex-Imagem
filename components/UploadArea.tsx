
import React, { useRef, useState, useCallback } from 'react';
import { UploadIcon } from './Icons';

interface UploadAreaProps {
    image: File | null;
    setImage: (file: File | null) => void;
    id: string;
    title?: string;
}

const UploadArea: React.FC<UploadAreaProps> = ({ image, setImage, id, title = "Clique ou arraste uma imagem" }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleFileChange = (files: FileList | null) => {
        if (files && files[0]) {
            const file = files[0];
            setImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const onAreaClick = () => {
        fileInputRef.current?.click();
    };
    
    const onDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);
    
    const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        handleFileChange(e.dataTransfer.files);
    }, []);


    return (
        <div
            onClick={onAreaClick}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDragOver={onDragOver}
            onDrop={onDrop}
            className={`relative w-full p-4 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-300 text-center ${isDragging ? 'border-yellow-400 bg-yellow-400/10' : 'border-white/20 bg-gray-900/30 hover:border-yellow-400/50'}`}
        >
            <input
                type="file"
                id={id}
                ref={fileInputRef}
                accept="image/*"
                onChange={(e) => handleFileChange(e.target.files)}
                className="hidden"
            />
            {previewUrl && image ? (
                <img src={previewUrl} alt="Preview" className="w-full h-32 object-cover rounded-md" />
            ) : (
                <div className="flex flex-col items-center justify-center text-white/60 h-32">
                    <UploadIcon />
                    <p className="mt-2 font-semibold">{title}</p>
                    <p className="text-xs">PNG, JPG, WebP (máx. 10MB)</p>
                </div>
            )}
        </div>
    );
};

export default UploadArea;
