import { http, type Paginated } from '@/lib/http'
import type { CreateUserPayload, UpdateUserPayload, User, UserListParams } from '../types'

export function getUsers(params: UserListParams = {}): Promise<Paginated<User[]>> {
  return http.getPaginated<User[]>('/users', { ...params })
}

export function createUser(payload: CreateUserPayload): Promise<User> {
  return http.post<User>('/users', payload)
}

export function updateUser(id: string, payload: UpdateUserPayload): Promise<User> {
  return http.patch<User>(`/users/${id}`, payload)
}

export function setUserActive(id: string, active: boolean): Promise<User> {
  return http.patch<User>(`/users/${id}/${active ? 'activate' : 'deactivate'}`)
}

export function deleteUser(id: string): Promise<void> {
  return http.delete(`/users/${id}`)
}
