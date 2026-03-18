export type CharacterStatus = 'Alive' | 'Dead' | 'unknown'

export type Character = {
  id: number
  name: string
  status: CharacterStatus
  species: string
  image: string
  origin: {
    name: string
  }
  location: {
    name: string
  }
}

export type CharacterResponse = {
  info: {
    count: number
    pages: number
  }
  results: Character[]
}
