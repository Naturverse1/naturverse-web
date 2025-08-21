import React, { useRef, useState } from 'react';

type Props = {
  onFiles: (files: File[]) => void;
  accept?: string;
  label?: string;
};

export default function PhotoUploader({ onFiles, accept = 'image/*', label = 'Upload photos' }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [hover, setHover] = useState(false);

  const pick = () => inputRef.current?.click();
  const handle = (fl: FileList | null) => {
    if (!fl) return;
    onFiles(Array.from(fl).filter((f) => f.type.startsWith('image/')));
  };

  return (
    <div
      className={'dropzone' + (hover ? ' hover' : '')}
      onDragOver={(e) => {
        e.preventDefault();
        setHover(true);
      }}
      onDragLeave={() => setHover(false)}
      onDrop={(e) => {
        e.preventDefault();
        setHover(false);
        handle(e.dataTransfer.files);
      }}
      onClick={pick}
      role="button"
      aria-label={label}
    >
      <div className="dz-inner">
        <div className="dz-emoji">📷</div>
        <div className="dz-title">{label}</div>
        <div className="dz-sub">Drag & drop or tap to choose</div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        hidden
        onChange={(e) => handle(e.target.files)}
      />
    </div>
  );
}
