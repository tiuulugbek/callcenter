import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

const api = axios.create({
  baseURL: API_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authApi = {
  login: async (username: string, password: string) => {
    const response = await api.post('/auth/login', { username, password })
    return response.data
  },
}

export const callsApi = {
  getAll: async (params?: { startDate?: string; endDate?: string }) => {
    const response = await api.get('/calls', { params })
    return response.data
  },
  getById: async (id: string) => {
    const response = await api.get(`/calls/${id}`)
    return response.data
  },
  getRecording: async (id: string) => {
    const response = await api.get(`/calls/${id}/recording`, {
      responseType: 'blob',
    })
    return response.data
  },
  makeOutbound: async (data: { fromNumber: string; toNumber: string; extension?: string }) => {
    const response = await api.post('/calls/outbound', data)
    return response.data
  },
}

export const chatsApi = {
  getAll: async () => {
    const response = await api.get('/chats')
    return response.data
  },
  getMessages: async (id: string) => {
    const response = await api.get(`/chats/${id}/messages`)
    return response.data
  },
  sendMessage: async (id: string, message: string) => {
    const response = await api.post(`/chats/${id}/send`, { message })
    return response.data
  },
}

export const settingsApi = {
  getSettings: async () => {
    const response = await api.get('/settings')
    return response.data
  },
  updateTelegram: async (botToken: string, webhookUrl?: string) => {
    const response = await api.post('/settings/telegram', { botToken, webhookUrl })
    return response.data
  },
  testTelegram: async (botToken: string) => {
    const response = await api.post('/settings/telegram/test', { botToken })
    return response.data
  },
  updateFacebook: async (pageAccessToken: string, appSecret: string, verifyToken: string) => {
    const response = await api.post('/settings/facebook', { pageAccessToken, appSecret, verifyToken })
    return response.data
  },
  getSipExtensions: async () => {
    const response = await api.get('/settings/sip-extensions')
    return response.data
  },
  createSipExtension: async (data: { operatorId: string; extension: string; password: string }) => {
    const response = await api.post('/settings/sip-extensions', data)
    return response.data
  },
  getSipTrunks: async () => {
    const response = await api.get('/settings/sip-trunks')
    return response.data
  },
  createSipTrunk: async (data: {
    name: string
    host: string
    username: string
    password: string
    port?: number
    transport?: 'udp' | 'tcp' | 'tls'
  }) => {
    const response = await api.post('/settings/sip-trunks', data)
    return response.data
  },
}

export const operatorsApi = {
  getAll: async () => {
    const response = await api.get('/operators')
    return response.data
  },
}

export default api

