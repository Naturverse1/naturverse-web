type Props = { svg?: string; url?: string; size?: number; alt?: string; className?: string };

export default function NavatarBadge({ svg, url, size = 28, alt = 'Navatar', className }: Props) {
  if (url) return <img src={url} width={size} height={size} alt={alt} className={className} style={{borderRadius:'50%'}} />;
  if (!svg) return <span aria-hidden className={className} style={{display:'inline-block',width:size,height:size,borderRadius:'50%',background:'#eaf1ff',border:'1px solid #cfe0ff'}}/>;
  return (
    <span
      className={className}
      aria-label={alt}
      style={{display:'inline-block',width:size,height:size,borderRadius:'50%',overflow:'hidden'}}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
