
import type { CreateFunction, EditFunction } from './types';

export const functionTemplates: Record<CreateFunction, string> = {
    free: '',
    sticker: 'A kawaii-style sticker design with bold, clean outlines, simple cel-shading, and vibrant colors. The background must be white.',
    text: 'Create a modern, clean design with precise text typography. Use a professional font and ensure the text is clearly readable.',
    comic: 'A comic book panel with dramatic lighting and composition. Include speech bubbles or caption boxes as needed.'
};

export const editTemplates: Record<EditFunction, string> = {
    'add-remove': 'Using the provided image,',
    'retouch': 'Using the provided image, change only the specified elements while keeping the rest of the image unchanged.',
    'style': 'Transform the provided image into a different artistic style while preserving the original composition.',
    'compose': 'Create a new composition combining elements from the provided images.'
};
