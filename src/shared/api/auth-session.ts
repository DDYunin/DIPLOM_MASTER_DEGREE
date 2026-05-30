type SessionExpiredHandler = () => void

let sessionExpiredHandler: SessionExpiredHandler | null = null

export const setSessionExpiredHandler = (handler: SessionExpiredHandler | null) => {
  sessionExpiredHandler = handler
}

export const notifySessionExpired = () => {
  sessionExpiredHandler?.()
}
