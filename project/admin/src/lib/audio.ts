export async function getAudioDuration(file: File): Promise<number> {
  return await new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const audio = document.createElement('audio')
    audio.preload = 'metadata'
    audio.src = url

    const cleanup = () => {
      URL.revokeObjectURL(url)
      audio.removeAttribute('src')
      audio.load()
    }

    audio.addEventListener('loadedmetadata', () => {
      const duration = Number.isFinite(audio.duration) ? audio.duration : 0
      cleanup()
      resolve(Math.max(0, Math.floor(duration)))
    })

    audio.addEventListener('error', () => {
      cleanup()
      reject(new Error('Failed to read audio metadata'))
    })
  })
}
