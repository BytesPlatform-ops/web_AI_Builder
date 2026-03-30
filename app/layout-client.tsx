'use client';

import { useGA } from '@/hooks/useGA';

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  // Track page views across all pages
  useGA();

  return <>{children}</>;
}
