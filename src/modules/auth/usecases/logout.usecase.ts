import { sessionRepository } from '../repositories/session.repository'

export function logoutUseCase() {
  sessionRepository.clear()
}
