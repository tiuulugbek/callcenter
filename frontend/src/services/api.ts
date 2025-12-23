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

// Response interceptor - 401 xatolikda login sahifasiga redirect
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token eskirgan yoki noto'g'ri
      console.warn('401 Unauthorized - Token eskirgan yoki noto\'g\'ri')
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // Faqat login sahifasida bo'lmasa redirect qilish
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

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
  updateSipTrunk: async (id: string, data: {
    name?: string
    host?: string
    username?: string
    password?: string
    port?: number
    transport?: 'udp' | 'tcp' | 'tls'
  }) => {
    const response = await api.put(`/settings/sip-trunks/${id}`, data)
    return response.data
  },
  deleteSipTrunk: async (id: string) => {
    const response = await api.delete(`/settings/sip-trunks/${id}`)
    return response.data
  },
}

export const operatorsApi = {
  getAll: async () => {
    const response = await api.get('/operators')
    return response.data
  },
}

export const kerioApi = {
  verifyAuth: async () => {
    try {
      console.log('kerioApi.verifyAuth chaqirildi')
      console.log('API URL:', API_URL)
      console.log('Token:', localStorage.getItem('token') ? 'Mavjud' : 'Yo\'q')
      
      const response = await api.get('/kerio/auth/verify')
      console.log('kerioApi.verifyAuth javob:', response.data)
      return response.data
    } catch (error: any) {
      console.error('Kerio verifyAuth error:', error)
      console.error('Error response:', error.response)
      console.error('Error status:', error.response?.status)
      console.error('Error data:', error.response?.data)
      throw error
    }
  },
  syncCalls: async (params?: { startDate?: string; endDate?: string; extension?: string }) => {
    try {
      const response = await api.post('/kerio/sync', null, { params })
      return response.data
    } catch (error: any) {
      console.error('Kerio syncCalls error:', error)
      throw error
    }
  },
  getRecording: async (pbxCallId: string) => {
    try {
      const response = await api.get(`/kerio/calls/${pbxCallId}/recording`)
      return response.data
    } catch (error: any) {
      console.error('Kerio getRecording error:', error)
      throw error
    }
  },
}

export const contactsApi = {
  getAll: async (search?: string) => {
    const response = await api.get('/contacts', { params: { search } })
    return response.data
  },
  getById: async (id: string) => {
    const response = await api.get(`/contacts/${id}`)
    return response.data
  },
  create: async (data: {
    name: string
    phone?: string
    email?: string
    company?: string
    notes?: string
  }) => {
    const response = await api.post('/contacts', data)
    return response.data
  },
  update: async (id: string, data: {
    name?: string
    phone?: string
    email?: string
    company?: string
    notes?: string
  }) => {
    const response = await api.put(`/contacts/${id}`, data)
    return response.data
  },
  delete: async (id: string) => {
    const response = await api.delete(`/contacts/${id}`)
    return response.data
  },
  linkCall: async (contactId: string, callId: string) => {
    const response = await api.post(`/contacts/${contactId}/link-call`, { callId })
    return response.data
  },
  linkChat: async (contactId: string, chatId: string) => {
    const response = await api.post(`/contacts/${contactId}/link-chat`, { chatId })
    return response.data
  },
}

export default api

