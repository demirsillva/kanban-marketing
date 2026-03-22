'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'motion/react';

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof HTMLMotionProps<"button">> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'glass';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps & HTMLMotionProps<"button">>(
  ({ className, variant = 'primary', size = 'md', leftIcon, rightIcon, isLoading, children, disabled, ...props }, ref) => {
    const variants = {
      primary: 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20 hover:bg-indigo-700 dark:hover:bg-indigo-400 border-t border-white/20',
      secondary: 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm',
      ghost: 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100',
      danger: 'bg-rose-500 text-white shadow-lg shadow-rose-200 dark:shadow-rose-900/20 hover:bg-rose-600 border-t border-white/20',
      glass: 'bg-white/10 dark:bg-slate-900/40 backdrop-blur-md border border-white/20 dark:border-slate-800/50 text-slate-900 dark:text-slate-100 hover:bg-white/20 dark:hover:bg-slate-800/60 shadow-xl',
    };

    const sizes = {
      sm: 'h-8 px-3 text-xs gap-1.5',
      md: 'h-10 px-4 text-sm gap-2',
      lg: 'h-12 px-6 text-base gap-2.5',
      icon: 'h-9 w-9 p-0 items-center justify-center',
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'inline-flex items-center justify-center font-bold rounded-xl transition-all disabled:opacity-50 disabled:pointer-events-none active:scale-95',
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            {leftIcon && <span className="flex items-center shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="flex items-center shrink-0">{rightIcon}</span>}
          </>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
