import useSWR from 'swr'
import type { CharacterResponse } from '../types/api'

const FALLBACK_CHARACTERS: CharacterResponse = {
  info: {
    count: 4,
    pages: 1,
  },
  results: [
    {
      id: 1,
      name: 'Rick Sanchez',
      status: 'Alive',
      species: 'Human',
      image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
      origin: { name: 'Earth (C-137)' },
      location: { name: 'Citadel of Ricks' },
    },
    {
      id: 2,
      name: 'Morty Smith',
      status: 'Alive',
      species: 'Human',
      image: 'https://rickandmortyapi.com/api/character/avatar/2.jpeg',
      origin: { name: 'unknown' },
      location: { name: 'Citadel of Ricks' },
    },
    {
      id: 3,
      name: 'Summer Smith',
      status: 'Alive',
      species: 'Human',
      image: 'https://rickandmortyapi.com/api/character/avatar/3.jpeg',
      origin: { name: 'Earth (Replacement Dimension)' },
      location: { name: 'Earth (Replacement Dimension)' },
    },
    {
      id: 4,
      name: 'Beth Smith',
      status: 'Alive',
      species: 'Human',
      image: 'https://rickandmortyapi.com/api/character/avatar/4.jpeg',
      origin: { name: 'Earth (Replacement Dimension)' },
      location: { name: 'Earth (Replacement Dimension)' },
    },
  ],
}

const fetcher = async (url: string): Promise<CharacterResponse> => {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Failed to load characters')
  }

  return response.json() as Promise<CharacterResponse>
}

function useCharacters() {
  const swr = useSWR<CharacterResponse>(
    'https://rickandmortyapi.com/api/character',
    fetcher,
    {
      fallbackData: FALLBACK_CHARACTERS,
      revalidateOnFocus: true,
      keepPreviousData: true,
    },
  )

  return {
    ...swr,
    characters: swr.data?.results ?? [],
    total: swr.data?.info?.count ?? 0,
  }
}

export default useCharacters
