type Props = { value: number; size?: number; onChange?: (v:number)=>void; };
export default function Stars({ value, size=18, onChange }: Props) {
  return (
    <div role={onChange?'radiogroup':undefined} style={{display:'inline-flex', gap:4}}>
      {[1,2,3,4,5].map(n=>(
        <button
          key={n}
          aria-label={`${n} star`}
          aria-pressed={value===n}
          onClick={()=> onChange?.(n)}
          style={{
            width:size, height:size, lineHeight:0, border:'none', background:'none', cursor:onChange?'pointer':'default',
            filter: n<=value ? 'none' : 'grayscale(1) brightness(.7)'
          }}>
          <svg viewBox="0 0 24 24" width={size} height={size} fill={n<=value?'#ffd76b':'#999'}><path d="M12 2l3.09 6.3L22 9.3l-5 4.9L18.2 22 12 18.6 5.8 22 7 14.2 2 9.3l6.9-1L12 2z"/></svg>
        </button>
      ))}
    </div>
  );
}
