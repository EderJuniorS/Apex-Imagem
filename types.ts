
export type Mode = 'create' | 'edit';

export type CreateFunction = 'free' | 'sticker' | 'text' | 'comic';
export type EditFunction = 'add-remove' | 'retouch' | 'style' | 'compose';

export type ToastMessage = {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
};
