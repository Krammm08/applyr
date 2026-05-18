export type AuthUser = {
  id: string
  email: string
  name?: string
}

export type AuthSession = {
  token: string
  user: AuthUser
}

type AuthResponse = {
  success: boolean
  data?: {
    token: string
    user: AuthUser
  }
  message?: string
}

const API_BASE_URL = 'http://localhost:8000'
  // import.meta.env.VITE_API_BASE_URL ?? 'https://eliazar.heliohost.us/backend'

const endpoints = {
  login: '/api/auth/login.php',
  register: '/api/auth/register.php',
}

const requestJson = async <T>(url: string, body: Record<string, unknown>) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const payload = (await response.json()) as T

  if (!response.ok || !(payload as AuthResponse).success) {
    const message = (payload as AuthResponse).message || 'Request failed'
    throw new Error(message)
  }

  return payload
}

export const loginUser = async (email: string, password: string) => {
  const payload = await requestJson<AuthResponse>(`${API_BASE_URL}${endpoints.login}`, {
    email,
    password,
  })

  if (!payload.data?.token || !payload.data?.user) {
    throw new Error(payload.message || 'Login failed')
  }

  return payload.data
}

export const registerUser = async (name: string, email: string, password: string) => {
  const payload = await requestJson<AuthResponse>(`${API_BASE_URL}${endpoints.register}`, {
    name,
    email,
    password,
  })

  if (!payload.data?.token || !payload.data?.user) {
    throw new Error(payload.message || 'Signup failed')
  }

  return payload.data
}
