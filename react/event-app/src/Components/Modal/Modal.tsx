import { ReactNode, useEffect } from 'react';
import ReactDOM from 'react-dom';

type ModalProps = {
  isOpen: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
};

export const Modal = ({
  isOpen,
  title,
  children,
  onClose,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className='fixed inset-0 z-50 flex items-center justify-center'
      aria-labelledby='modal-title'
      role='dialog'
      aria-modal='true'>
      <div
        className='fixed inset-0 bg-gray-900 opacity-50 transition-opacity'
        onClick={onClose}
      />

      <div className='relative z-10 w-full max-w-2xl mx-4 overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-xl'>
        <div className='flex items-center justify-between border-b border-gray-200 dark:border-gray-600 px-4 py-3'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
            {title}
          </h3>
          <button
            type='button'
            className='text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
            onClick={onClose}
            aria-label='Close modal'>
            <svg
              className='h-5 w-5'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth={2}>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        </div>

        <div className='px-4 py-4 overflow-y-auto max-h-[60vh] text-gray-700 dark:text-gray-300'>
          {children}
        </div>

        <div className='flex justify-end gap-2 border-t border-gray-200 dark:border-gray-600 px-4 py-3'>
          <button
            type='button'
            className='rounded bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            onClick={onClose}>
            {cancelText}
          </button>

          {onConfirm && (
            <button
              type='button'
              className='rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
              onClick={onConfirm}>
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
