import clsx from 'clsx';
import * as Dialog from '@radix-ui/react-dialog';
import type { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  // eslint-disable-next-line react/require-default-props
  className?: string;
}

const Modal = ({ isOpen, onClose, title, children, className }: ModalProps) => (
  <Dialog.Root open={isOpen} onOpenChange={(open) => (!open ? onClose() : undefined)}>
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm" />
      <Dialog.Content
        className={clsx(
          'fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-h-[90vh] max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl bg-white p-6 shadow-xl',
          className
        )}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <Dialog.Title className="text-h3 font-bold text-slate-900">{title}</Dialog.Title>
          <Dialog.Close asChild>
            <button
              type="button"
              aria-label="Close modal"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
            >
              <span aria-hidden="true" className="text-2xl leading-none">
                ×
              </span>
            </button>
          </Dialog.Close>
        </div>
        <div>{children}</div>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);

export default Modal;
