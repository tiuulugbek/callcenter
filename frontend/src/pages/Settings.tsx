import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { settingsApi } from '../services/api'
import './Settings.css'

const Settings = () => {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'warning'; text: string } | null>(null)

  // Telegram Settings
  const [telegramToken, setTelegramToken] = useState('')
  const [telegramWebhook, setTelegramWebhook] = useState('')

  useEffect(() => {
    // Token mavjudligini tekshirish
    const token = localStorage.getItem('token')
    if (!token) {
      // Token yo'q bo'lsa, login sahifasiga redirect
      window.location.href = '/login'
      return
    }
    
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const settings = await settingsApi.getSettings()
      setTelegramToken(settings.telegram?.botToken || '')
      setTelegramWebhook(settings.telegram?.webhookUrl || '')
    } catch (error: any) {
      console.error('Settings yuklashda xatolik:', error)
      // 401 xatolik bo'lsa, login sahifasiga redirect
      if (error.response?.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
    }
  }

  const handleSaveTelegram = async () => {
    if (!telegramToken) {
      setMessage({ type: 'error', text: 'Bot token kiriting' })
      return
    }

    setLoading(true)
    setMessage(null)
    try {
      const result = await settingsApi.updateTelegram(telegramToken, telegramWebhook)
      const messageText = result.message || 'Telegram sozlamalari saqlandi'
      const note = result.note ? `\n\n${result.note}` : ''
      setMessage({
        type: 'success',
        text: messageText + note
      })

      if (result.webhookUrl && !telegramWebhook) {
        setTelegramWebhook(result.webhookUrl)
      }
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || error.message || 'Xatolik yuz berdi' 
      })
    } finally {
      setLoading(false)
    }
  }

  const handleTestTelegram = async () => {
    if (!telegramToken) {
      setMessage({ type: 'error', text: 'Bot token kiriting' })
      return
    }
    setLoading(true)
    setMessage(null)
    try {
      const result = await settingsApi.testTelegram(telegramToken)
      setMessage({ 
        type: 'success', 
        text: `Bot ulandi: ${result.bot?.first_name} (@${result.bot?.username})` 
      })
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || error.message || 'Telegram ulanishi xatosi' 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="settings-page">
        <h1>Sozlamalar</h1>

        {message && (
          <div className={`alert alert-${message.type === 'warning' ? 'warning' : message.type}`}>
            {message.text.split('\n').map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        )}

        <div className="settings-content">
          <div className="settings-section">
            <h2>Telegram Bot Sozlash</h2>
            <p className="settings-description">
              Telegram bot yaratish va webhook o'rnatish uchun quyidagi qadamlarni bajaring:
            </p>

            <div className="info-box">
              <h4>1. Bot Yaratish</h4>
              <ol>
                <li>Telegram da @BotFather ga murojaat qiling</li>
                <li><code>/newbot</code> buyrug'ini yuboring</li>
                <li>Bot nomini va username ni kiriting</li>
                <li>Bot tokenini oling va quyida kiriting</li>
              </ol>
            </div>

            <div className="form-section">
              <div className="form-group">
                <label>Bot Token</label>
                <input
                  type="text"
                  value={telegramToken}
                  onChange={(e) => setTelegramToken(e.target.value)}
                  placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
                />
              </div>
              <div className="form-group">
                <label>Webhook URL</label>
                <input
                  type="text"
                  value={telegramWebhook}
                  onChange={(e) => setTelegramWebhook(e.target.value)}
                  placeholder="https://crm24.soundz.uz/api/chats/webhook/telegram"
                />
                <small>
                  Production uchun to'liq HTTPS URL kiriting.
                  Development uchun ngrok ishlating yoki bo'sh qoldiring (avtomatik yaratiladi).
                </small>
              </div>
              <div className="button-group">
                <button onClick={handleTestTelegram} disabled={loading}>
                  {loading ? 'Tekshirilmoqda...' : 'Ulanishni Tekshirish'}
                </button>
                <button onClick={handleSaveTelegram} disabled={loading} className="btn-primary">
                  {loading ? 'Saqlanmoqda...' : 'Saqlash'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Settings
