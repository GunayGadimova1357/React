export type Track = {
  id: string
  title: string
  genre?: string 
  releaseId: string
  duration: number
  audioUrl?: string
}

export const tracksData: Track[] = [
  {
    id: "t1",
    title: "Blinding Lights",
    genre: "Synthwave",
    releaseId: "r1",
    duration: 200,
  },
  {
    id: "t2",
    title: "Save Your Tears",
    genre: "Pop",
    releaseId: "r1",
    duration: 215,
  },
]


