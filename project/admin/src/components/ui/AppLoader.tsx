import { ClipLoader } from 'react-spinners'

export function AppLoader({
  size = 36,
}: {
  size?: number
}) {
  return (
    <ClipLoader
      size={size}
      color="#e4e4e7" 
      speedMultiplier={0.8}
    />
  )
}
