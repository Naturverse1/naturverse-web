import React, { lazy, Suspense } from 'react';

export function safeLazy<T extends React.ComponentType<any>>(
  importer: () => Promise<{ default: T }>,
  Fallback: React.ReactNode = null
): React.FC<React.ComponentProps<T>> {
  const Lazy = lazy(async () => {
    try {
      return await importer();
    } catch (e) {
      console.error('[naturverse] safeLazy failed', e);
      return { default: (() => null) as unknown as T };
    }
  });
  return (props: React.ComponentProps<T>) => (
    <Suspense fallback={Fallback}>
      <Lazy {...props} />
    </Suspense>
  );
}
