export type Moderator = {
  id: string
  email: string
  role: 'admin' | 'moderator'
}

export const moderatorsData: Moderator[] = [
  {
    id: '1',
    email: 'admin@music.com',
    role: 'admin',
  },
]
