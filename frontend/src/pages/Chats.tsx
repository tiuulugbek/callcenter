import { useEffect, useState, useRef } from 'react'
import Layout from '../components/Layout'
import { chatsApi, contactsApi } from '../services/api'
import { wsService } from '../services/websocket'
import { format } from 'date-fns'
import './Chats.css'

interface ContactInfo {
  id: string
  name: string
  phone: string | null
  company: string | null
  notes: string | null
}

interface Message {
  id: string
  sender: string
  message: string
  createdAt: string
}

interface Chat {
  id: string
  channel: string
  externalUserId: string
  userName: string | null
  contactId: string | null
  contact?: ContactInfo | null
  updatedAt: string
  messages: Message[]
}

const QUICK_TEMPLATES = [
  'Assalomu alaykum! Sizga qanday yordam bera olamiz?',
  'Iltimos, bog\'lanish uchun telefon raqamingizni qoldiring.',
  'Ma\'lumotingiz qabul qilindi. Mutaxassisimiz tez orada bog\'lanadi.',
  'Buyurtmangiz qabul qilindi, rahmat!',
  'Savolingiz bormi? Yordam berishdan mamnunmiz.',
]

const Chats = () => {
  const [chats, setChats] = useState<Chat[]>([])
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [creatingContact, setCreatingContact] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    loadChats()
  }, [])

  useEffect(() => {
    if (selectedChat) {
      loadChatMessages(selectedChat.id)
    }
  }, [selectedChat?.id])

  useEffect(() => {
    scrollToBottom()
  }, [selectedChat?.messages])

  useEffect(() => {
    const socket = wsService.connect()

    socket.on('new_message', (data: any) => {
      if (selectedChat && data.chatId === selectedChat.id) {
        loadChatMessages(selectedChat.id)
      }
      loadChats()
    })

    return () => {
      wsService.disconnect()
    }
  }, [selectedChat])

  const loadChats = async () => {
    try {
      setLoading(true)
      const data = await chatsApi.getAll()
      setChats(data)
      if (!selectedChat && data.length > 0) {
        setSelectedChat(data[0])
      }
    } catch (error) {
      console.error('Error loading chats:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadChatMessages = async (chatId: string) => {
    try {
      const data = await chatsApi.getMessages(chatId)
      setSelectedChat(data)
    } catch (error) {
      console.error('Error loading messages:', error)
    }
  }

  const handleSendMessage = async (textToSend?: string) => {
    const content = (textToSend || message).trim()
    if (!content || !selectedChat || sending) return

    try {
      setSending(true)
      await chatsApi.sendMessage(selectedChat.id, content)
      setMessage('')
      await loadChatMessages(selectedChat.id)
      await loadChats()
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Xabar yuborishda xatolik yuz berdi')
    } finally {
      setSending(false)
    }
  }

  const handleUseTemplate = (tmpl: string) => {
    setMessage(tmpl)
  }

  const handleCreateContact = async () => {
    if (!selectedChat) return
    const name = prompt('Mijoz ismi:', selectedChat.userName || 'Mijoz')
    if (!name) return

    const phone = prompt('Mijoz telefoni (ixtiyoriy):', '') || ''

    try {
      setCreatingContact(true)
      await contactsApi.create({
        name,
        phone,
        notes: `Telegram orqali qo'shilgan: @${selectedChat.userName || selectedChat.externalUserId}`,
      })
      alert('Mijoz muvaffaqiyatli saqlandi!')
      loadChatMessages(selectedChat.id)
      loadChats()
    } catch (err) {
      console.error('Error creating contact:', err)
      alert('Mijoz yaratishda xatolik')
    } finally {
      setCreatingContact(false)
    }
  }

  const getChannelLabel = (channel: string) => {
    const labels: Record<string, string> = {
      telegram: 'Telegram',
      instagram: 'Instagram',
      facebook: 'Facebook',
    }
    return labels[channel] || channel
  }

  if (loading) {
    return (
      <Layout>
        <div style={{ padding: '2rem' }}>Yuklanmoqda...</div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="chats-page">
        <div className="page-header">
          <h1>Chatlar (Mijozlar bilan muloqot)</h1>
        </div>

        <div className="chats-container">
          {/* Chatlar ro'yxati */}
          <div className="chats-list">
            <div className="chats-list-header">
              <h2>Muloqotlar ({chats.length})</h2>
            </div>
            <div className="chats-list-items">
              {chats.length === 0 ? (
                <div className="empty-state">Hozircha chatlar mavjud emas</div>
              ) : (
                chats.map((chat) => (
                  <div
                    key={chat.id}
                    className={`chat-item ${selectedChat?.id === chat.id ? 'active' : ''}`}
                    onClick={() => setSelectedChat(chat)}
                  >
                    <div className="chat-item-header">
                      <span className={`channel-badge channel-${chat.channel}`}>
                        {getChannelLabel(chat.channel)}
                      </span>
                      {chat.updatedAt && (
                        <span className="chat-item-time">
                          {format(new Date(chat.updatedAt), 'HH:mm')}
                        </span>
                      )}
                    </div>
                    <div className="chat-item-name">
                      {chat.contact?.name || chat.userName || chat.externalUserId}
                    </div>
                    {chat.contact?.company && (
                      <div className="chat-item-company">{chat.contact.company}</div>
                    )}
                    {chat.messages && chat.messages.length > 0 && (
                      <div className="chat-item-preview">
                        {chat.messages[0].message.substring(0, 45)}...
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* O'ng tomon: Chat xabarlari */}
          <div className="chat-messages">
            {selectedChat ? (
              <>
                <div className="chat-header">
                  <div className="chat-header-info">
                    <h2>
                      {selectedChat.contact?.name || selectedChat.userName || selectedChat.externalUserId}
                    </h2>
                    <div className="chat-header-meta">
                      <span className={`channel-badge channel-${selectedChat.channel}`}>
                        {getChannelLabel(selectedChat.channel)}
                      </span>
                      {selectedChat.contact?.phone && (
                        <span className="contact-phone">📞 {selectedChat.contact.phone}</span>
                      )}
                      {selectedChat.contact?.company && (
                        <span className="contact-company">🏢 {selectedChat.contact.company}</span>
                      )}
                    </div>
                  </div>
                  {!selectedChat.contact && (
                    <button
                      className="btn-create-contact"
                      onClick={handleCreateContact}
                      disabled={creatingContact}
                    >
                      + Kontakt yaratish
                    </button>
                  )}
                </div>

                <div className="messages-list">
                  {selectedChat.messages && selectedChat.messages.length > 0 ? (
                    selectedChat.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`message ${msg.sender === 'operator' ? 'message-sent' : 'message-received'}`}
                      >
                        <div className="message-sender-name">
                          {msg.sender === 'operator' ? 'Siz (Operator)' : (selectedChat.userName || 'Mijoz')}
                        </div>
                        <div className="message-content">{msg.message}</div>
                        <div className="message-time">
                          {format(new Date(msg.createdAt), 'HH:mm')}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-messages">Xabarlar tarixi bo'sh</div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Tezkor javob shablonlari */}
                <div className="quick-templates-bar">
                  <div className="quick-templates-scroll">
                    {QUICK_TEMPLATES.map((tmpl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className="btn-template"
                        onClick={() => handleUseTemplate(tmpl)}
                        title="Shablonni matnga qo'yish"
                      >
                        {tmpl}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Xabar yozish qismi */}
                <div className="message-input-container">
                  <textarea
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                    placeholder="Xabar yozing... (Yuborish uchun Enter, yangi qator uchun Shift+Enter)"
                  />
                  <button
                    className="btn-send"
                    onClick={() => handleSendMessage()}
                    disabled={sending || !message.trim()}
                  >
                    {sending ? 'Yuborilmoqda...' : 'Yuborish'}
                  </button>
                </div>
              </>
            ) : (
              <div className="no-chat-selected">
                <div>
                  <h3>Muloqotni tanlang</h3>
                  <p>Chap tarafdagi ro'yxatdan mijozni tanlang</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Chats
