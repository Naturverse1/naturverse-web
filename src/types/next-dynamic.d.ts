declare module 'next/dynamic' {
  import type { ComponentType } from 'react';
  export default function dynamic<T extends ComponentType<any>>(
    loader: () => Promise<T>,
    options?: { ssr?: boolean }
  ): T;
}
