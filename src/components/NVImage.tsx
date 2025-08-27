type Props = React.ImgHTMLAttributes<HTMLImageElement> & { w?: number[] }
const toCdn = (src: string, w: number) => `${src}?nf_resize=fit&w=${w}`

export default function NVImage({ src = '', alt = '', w = [320, 640, 960, 1280], loading = 'lazy', ...rest }: Props) {
  if (!src) return null
  const sizes = '(max-width: 768px) 90vw, 1200px'
  const srcset = w.map(px => `${toCdn(src, px)} ${px}w`).join(', ')
  const webp = src.replace(/\.(png|jpe?g)$/i, '.webp')
  const webpSet = srcset.replaceAll(src, webp)
  return (
    <picture>
      <source type="image/webp" srcSet={webpSet} sizes={sizes} />
      <img
        src={toCdn(src, w[1] || 640)}
        srcSet={srcset}
        sizes={sizes}
        alt={alt}
        loading={loading}
        decoding="async"
        {...rest}
      />
    </picture>
  )
}
