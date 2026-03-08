'use client';

import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface BackButtonProps {
  onClick?: () => void;
  className?: string;
}

export default function BackButton({ onClick, className }: BackButtonProps) {
  const router = useRouter();
  return (
    <button
      onClick={onClick ?? (() => router.back())}
      className={[
        'flex items-center justify-center h-10 w-10 rounded-xl',
        'bg-white/6 border border-white/10 text-white/80',
        'transition-colors hover:bg-white/10 shrink-0',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label="뒤로가기"
    >
      <ChevronLeft size={20} />
    </button>
  );
}
