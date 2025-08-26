type Props = React.ImgHTMLAttributes<HTMLImageElement> & {w?:number[]}

const toOptimized = (src:string, w:number)=>{
  // if you pass /assets/foo.png, it will try /optimized/assets/foo-640.webp
  return src.replace(/^\/?/, '/optimized/').replace(/\.(png|jpe?g)$/i, `-${w}.webp`)
}

export default function NVImage({src='', alt='', w=[320,640,960,1280], loading='lazy', ...rest}:Props){
  if(!src) return null
  const srcset = w.map(px=>`${toOptimized(src,px)} ${px}w`).join(', ')
  const sizes = '(max-width: 768px) 90vw, 1200px'
  return (
    <picture>
      <img src={toOptimized(src, w[1]||640)} srcSet={srcset} sizes={sizes} alt={alt} loading={loading} decoding="async" {...rest}/>
    </picture>
  )
}
