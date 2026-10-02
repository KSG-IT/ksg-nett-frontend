import type { Area } from 'react-easy-crop'

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = src
  })
}

/**
 * Crops the image to `area` and scales it down so the width is at most
 * `maxWidth`. Returns a JPEG.
 */
export async function cropImage(src: string, area: Area, maxWidth: number) {
  const image = await loadImage(src)
  const scale = Math.min(1, maxWidth / area.width)
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(area.width * scale)
  canvas.height = Math.round(area.height * scale)

  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas is not supported')
  context.drawImage(
    image,
    area.x,
    area.y,
    area.width,
    area.height,
    0,
    0,
    canvas.width,
    canvas.height
  )

  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      blob => (blob ? resolve(blob) : reject(new Error('Could not crop'))),
      'image/jpeg',
      0.9
    )
  )
}
