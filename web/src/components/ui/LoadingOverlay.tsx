import React from 'react';

interface Props {
  visible: boolean;
  text?: string;
}

export default function LoadingOverlay({ visible, text }: Props) {
  if (!visible) return null;
  return (
    <div className="overlay">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <div
          className="spinner"
          style={{
            width: 32,
            height: 32,
            border: '3px solid #fff',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
        {text && <div>{text}</div>}
      </div>
    </div>
  );
}
