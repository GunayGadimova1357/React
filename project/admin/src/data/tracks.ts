export type Track = {
  id: string
  title: string
  artist: string
  genre: string

  albumId: string | null
  albumTitle?: string
  albumCoverUrl?: string

  duration: number 

  audioFile?: File
  audioUrl?: string

  coverFile?: File
  coverUrl?: string
}

export const tracksData: Track[] = [
  {
    id: 't1',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    genre: 'Synthwave',
    albumId: 'al1',
    albumTitle: 'After Hours',
    albumCoverUrl:
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=300&q=60',
    duration: 200,
  },
    {
    id: 't2',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    genre: 'punk',
    albumId: 'al1',
    albumTitle: 'After Hours',
    albumCoverUrl:
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=300&q=60',
    duration: 200,
  },
]

