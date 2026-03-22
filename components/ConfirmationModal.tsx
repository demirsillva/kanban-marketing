'use client';

import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from './ui/Button';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger'
}: ConfirmationModalProps) {
  const variantColors = {
    danger: 'bg-red-600 hover:bg-red-700 shadow-red-100 text-white',
    warning: 'bg-amber-500 hover:bg-amber-600 shadow-amber-100 text-white',
    info: 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100 text-white',
  };

  const iconColors = {
    danger: 'text-red-600 bg-red-50 dark:bg-red-500/10 dark:text-red-400',
    warning: 'text-amber-600 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400',
    info: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 dark:text-indigo-400',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
             className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm z-[100] transition-colors"
          />
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl pointer-events-auto overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${iconColors[variant]}`}>
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                     <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">{title}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{message}</p>
                  </div>
                   <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  <X className="w-5 h-5" />
                </Button>
                </div>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 transition-colors">
                <Button
                  variant="secondary"
                  onClick={onClose}
                >
                  Cancelar
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className="px-6"
                >
                  Confirmar
                </Button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
