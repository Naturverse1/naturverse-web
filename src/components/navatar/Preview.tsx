type Props = { svg: string };

export default function Preview({ svg }: Props) {
  return (
    <div className="preview">
      <div dangerouslySetInnerHTML={{ __html: svg }} />
      <style>{`
        .preview { padding: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; }
        .preview svg { width: 260px; height: 260px; display:block; margin:auto; }
      `}</style>
    </div>
  );
}
