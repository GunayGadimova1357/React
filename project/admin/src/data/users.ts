export type UserStatus = 'active' | 'blocked'

export type AppUser = {
  id: string
  email: string
  status: UserStatus
  createdAt: string
}

export const usersData: AppUser[] = [
  {
    id: '1',
    email: 'user1@mail.com',
    status: 'active',
    createdAt: '2024-02-10',
  },
  {
    id: '2',
    email: 'user2@mail.com',
    status: 'active',
    createdAt: '2024-01-22',
  },
  {
    id: '3',
    email: 'blocked@mail.com',
    status: 'blocked',
    createdAt: '2024-03-01',
  },
]