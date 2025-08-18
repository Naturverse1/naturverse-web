import React from 'react';

const errorLog: string[] = [];
const originalError = console.error;
console.error = (...args: any[]) => {
  try {
    const msg = args
      .map(a => (a instanceof Error ? `${a.message}\n${a.stack}` : typeof a === 'string' ? a : JSON.stringify(a)))
      .join(' ');
    errorLog.push(msg);
    if (errorLog.length > 10) errorLog.shift();
  } catch {}
  originalError(...args);
};

export function getErrorLog() {
  return errorLog;
}

export default function ErrorOverlay({ error }: { error: Error }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.85)',
        color: '#fff',
        padding: '20px',
        overflow: 'auto',
        zIndex: 9999,
        fontFamily: 'monospace',
      }}
    >
      <h1 style={{ marginTop: 0 }}>Runtime Error</h1>
      <pre style={{ whiteSpace: 'pre-wrap' }}>
        {error.message}
        {'\n'}
        {error.stack}
      </pre>
      <h2>Recent console errors</h2>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{getErrorLog().slice(-10).join('\n')}</pre>
    </div>
  );
}
