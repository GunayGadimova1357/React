export type Release = {
  id: string
  title: string
  type: "album" | "ep" | "single"
  primaryGenre: string
  coverUrl?: string
  info: string 
}
export const releasesData: Release[] = [
  {
    id: "r1",
    title: "After Hours",
    type: "album",
    primaryGenre: "Pop",
    coverUrl:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=300&q=60",
    info: "Published · Mar 20, 2020",
  },
  {
    id: "r2",
    title: "Dawn FM",
    type: "album",
    primaryGenre: "Synthwave",
    coverUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=300&q=60",
    info: "Scheduled · Feb 10, 2025",
  },
  {
    id: "r3",
    title: "Starboy",
    type: "single",
    primaryGenre: "R&B",
    coverUrl:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=300&q=60",
    info: "Draft",
  },
]
