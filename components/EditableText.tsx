'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface EditableTextProps {
  value: string;
  onSave: (newValue: string) => void;
  className?: string;
  inputClassName?: string;
  multiline?: boolean;
  autoFocus?: boolean;
}

export function EditableText({ value, onSave, className, inputClassName, multiline = false, autoFocus = false }: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(autoFocus);
  const [tempValue, setTempValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus) {
      const handle = requestAnimationFrame(() => {
        setIsEditing(true);
      });
      return () => cancelAnimationFrame(handle);
    }
  }, [autoFocus]);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      // Select all text on focus
      if (inputRef.current instanceof HTMLInputElement) {
        inputRef.current.select();
      }
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    if (tempValue !== value) {
      onSave(tempValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      handleBlur();
    }
    if (e.key === 'Escape') {
      setTempValue(value);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return multiline ? (
      <textarea
        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={cn(
          "w-full bg-white dark:bg-slate-900 border border-indigo-300 rounded px-1 py-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm resize-none",
          inputClassName
        )}
        rows={3}
      />
    ) : (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={cn(
          "w-full bg-white dark:bg-slate-900 border border-indigo-300 rounded px-1 py-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-semibold",
          inputClassName
        )}
      />
    );
  }

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        setIsEditing(true);
      }}
      className={cn(
        "cursor-text hover:bg-slate-50 dark:bg-slate-800/50 rounded px-1 -mx-1 transition-colors min-h-[1.25rem]",
        className
      )}
    >
      {value || <span className="text-slate-300 italic">Clique para editar...</span>}
    </div>
  );
}
