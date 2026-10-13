import { tokenStorage } from '@/lib/http'

/** Persistence for the signed-in session (the access token). */
export const sessionRepository = {
  hasToken: () => Boolean(tokenStorage.get()),
  saveToken: (token: string) => tokenStorage.set(token),
  clear: () => tokenStorage.clear(),
}
