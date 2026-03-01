import { useEffect, useState } from 'react'
import { AppLoader } from './components/ui/AppLoader'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'

export default function App() {
  const [booting, setBooting] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setBooting(false), 600)
    return () => clearTimeout(t)
  }, [])

  if (booting) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <AppLoader size={48} />
      </div>
    )
  }

  return <RouterProvider router={router} />
}

