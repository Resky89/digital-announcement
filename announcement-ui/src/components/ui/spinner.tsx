'use client';

import { cn } from '@/lib/utils';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

function Spinner({ size = 'md', className }: SpinnerProps) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-slate-200 dark:border-slate-700',
          'border-t-indigo-600 dark:border-t-indigo-500',
          sizes[size]
        )}
      />
    </div>
  );
}

function LoadingScreen({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900">
      <Spinner size="lg" />
      <p className="mt-4 text-slate-600 dark:text-slate-400 animate-pulse">{message}</p>
    </div>
  );
}

function LoadingOverlay({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-50 rounded-2xl">
      <Spinner size="lg" />
      <p className="mt-4 text-slate-600 dark:text-slate-400 animate-pulse">{message}</p>
    </div>
  );
}

export { Spinner, LoadingScreen, LoadingOverlay };
