import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { chatsApi } from '../services/api'
import { wsService } from '../services/websocket'
import { format } from 'date-fns'
import './Chats.css'

interface Chat {
  id: string
  channel: string
  externalUserId: string
  userName: string | null
  messages: Message[]
}

interface Message {
  id: string
  sender: string
  message: string
  createdAt: string
}

const Chats = () => {
  const [chats, setChats] = useState<Chat[]>([])
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadChats()
  }, [])

  useEffect(() => {
    if (selectedChat) {
      loadChatMessages(selectedChat.id)
    }
  }, [selectedChat])

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

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedChat) return

    try {
      await chatsApi.sendMessage(selectedChat.id, message)
      setMessage('')
      await loadChatMessages(selectedChat.id)
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Xabar yuborishda xatolik yuz berdi')
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
        <div>Yuklanmoqda...</div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="chats-page">
        <h1>Chatlar</h1>
        <div className="chats-container">
          <div className="chats-list">
            <h2>Chatlar ro'yxati</h2>
            {chats.length === 0 ? (
              <div className="empty-state">Chatlar mavjud emas</div>
            ) : (
              chats.map((chat) => (
                <div
                  key={chat.id}
                  className={`chat-item ${selectedChat?.id === chat.id ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedChat(chat)
                  }}
                >
                  <div className="chat-item-header">
                    <span className={`channel-badge channel-${chat.channel}`}>
                      {getChannelLabel(chat.channel)}
                    </span>
                  </div>
                  <div className="chat-item-name">
                    {chat.userName || chat.externalUserId}
                  </div>
                  {chat.messages && chat.messages.length > 0 && (
                    <div className="chat-item-preview">
                      {chat.messages[0].message.substring(0, 50)}...
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="chat-messages">
            {selectedChat ? (
              <>
                <div className="chat-header">
                  <h2>
                    {getChannelLabel(selectedChat.channel)} - {selectedChat.userName || selectedChat.externalUserId}
                  </h2>
                </div>
                <div className="messages-list">
                  {selectedChat.messages && selectedChat.messages.length > 0 ? (
                    selectedChat.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`message ${msg.sender === 'operator' ? 'message-sent' : 'message-received'}`}
                      >
                        <div className="message-content">{msg.message}</div>
                        <div className="message-time">
                          {format(new Date(msg.createdAt), 'HH:mm')}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-messages">Xabarlar yo'q</div>
                  )}
                </div>
                <div className="message-input">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Xabar yozing..."
                  />
                  <button onClick={handleSendMessage}>Yuborish</button>
                </div>
              </>
            ) : (
              <div className="no-chat-selected">Chatni tanlang</div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Chats
