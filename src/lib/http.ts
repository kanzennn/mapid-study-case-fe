const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api/v1'
const TOKEN_KEY = 'auth_token'

export const UNAUTHORIZED_EVENT = 'auth:unauthorized'

export class ApiError extends Error {
  readonly status: number
  readonly errors?: Record<string, string[] | undefined>

  constructor(message: string, status: number, errors?: Record<string, string[] | undefined>) {
    super(message)
    this.status = status
    this.errors = errors
  }
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  total_pages: number
}

export interface Paginated<T> {
  data: T
  meta: PaginationMeta | null
}

interface SuccessBody<T> {
  status: 'success'
  data: T
  meta?: PaginationMeta
}

export type QueryParams = Record<string, string | number | boolean | Array<string | number> | null | undefined>

/** `{ role: ['A', 'B'], page: 1, search: '' }` -> `?role=A%2CB&page=1` (empty values are dropped). */
export function toQueryString(params: QueryParams = {}) {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue
    if (Array.isArray(value)) {
      if (value.length > 0) search.set(key, value.join(','))
      continue
    }
    search.set(key, String(value))
  }
  const qs = search.toString()
  return qs ? `?${qs}` : ''
}

interface ErrorBody {
  status: 'fail' | 'error'
  message: string
  errors?: Record<string, string[] | undefined>
}

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
}

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'

async function send<T>(method: HttpMethod, path: string, body?: unknown): Promise<SuccessBody<T>> {
  const headers: Record<string, string> = { Accept: 'application/json' }
  const token = tokenStorage.get()

  if (token) headers.Authorization = `Bearer ${token}`
  if (body !== undefined) headers['Content-Type'] = 'application/json'

  let res: Response
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError('Unable to connect to the server', 0)
  }

  if (res.status === 204) return { status: 'success', data: undefined as T }

  const json = (await res.json().catch(() => null)) as SuccessBody<T> | ErrorBody | null

  if (!res.ok || !json || json.status !== 'success') {
    const error = json as ErrorBody | null
    // Invalid / expired token or deactivated account: force a logout across the app.
    if (res.status === 401 && token) {
      tokenStorage.clear()
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT))
    }
    throw new ApiError(error?.message ?? 'Something went wrong, please try again', res.status, error?.errors)
  }

  return json
}

async function request<T>(method: HttpMethod, path: string, body?: unknown): Promise<T> {
  return (await send<T>(method, path, body)).data
}

export const http = {
  get: <T>(path: string, params?: QueryParams) => request<T>('GET', `${path}${toQueryString(params)}`),
  /** GET that also returns the backend pagination `meta`. */
  getPaginated: async <T>(path: string, params?: QueryParams): Promise<Paginated<T>> => {
    const body = await send<T>('GET', `${path}${toQueryString(params)}`)
    return { data: body.data, meta: body.meta ?? null }
  },
  post: <T>(path: string, body?: unknown) => request<T>('POST', path, body),
  patch: <T>(path: string, body?: unknown) => request<T>('PATCH', path, body),
  delete: <T = void>(path: string) => request<T>('DELETE', path),
}

export function getErrorMessage(error: unknown, fallback = 'Something went wrong, please try again') {
  if (error instanceof ApiError && error.errors) {
    const first = Object.values(error.errors).flat().find(Boolean)
    if (first) return first
  }
  return error instanceof Error ? error.message : fallback
}
