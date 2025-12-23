import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { settingsApi, kerioApi } from '../services/api'
import './Settings.css'

const Settings = () => {
  const [activeTab, setActiveTab] = useState<'telegram' | 'kerio'>('telegram')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'warning'; text: string } | null>(null)

  // Telegram Settings
  const [telegramToken, setTelegramToken] = useState('')
  const [telegramWebhook, setTelegramWebhook] = useState('')

  // Kerio Operator Settings
  const [kerioConnected, setKerioConnected] = useState(false)
  const [kerioSyncing, setKerioSyncing] = useState(false)
  const [kerioChecking, setKerioChecking] = useState(false)

  useEffect(() => {
    loadSettings()
    checkKerioConnection()
  }, [])

  const checkKerioConnection = async () => {
    setKerioChecking(true)
    setMessage(null)
    try {
      console.log('Kerio Operator ulanishini tekshirish...')
      const result = await kerioApi.verifyAuth()
      console.log('Kerio Operator javob:', result)
      setKerioConnected(result.authenticated)
      if (result.authenticated) {
        setMessage({
          type: 'success',
          text: 'Kerio Operator ga muvaffaqiyatli ulandi',
        })
      } else {
        setMessage({
          type: 'warning',
          text: result.message || 'Kerio Operator ga ulanib bo\'lmadi. Backend .env faylida KERIO_API_USERNAME va KERIO_API_PASSWORD ni tekshiring.',
        })
      }
    } catch (error: any) {
      console.error('Kerio connection check error:', error)
      setKerioConnected(false)
      setMessage({
        type: 'error',
        text: `Kerio Operator ga ulanib bo'lmadi: ${error.response?.data?.message || error.message || 'Noma\'lum xatolik'}`,
      })
    } finally {
      setKerioChecking(false)
    }
  }

  const handleSyncKerio = async () => {
    setKerioSyncing(true)
    setMessage(null)
    try {
      console.log('Kerio Operator qo\'ng\'iroqlarni sync qilish...')
      const result = await kerioApi.syncCalls()
      console.log('Sync javob:', result)
      setMessage({
        type: 'success',
        text: result.message || 'Qo\'ng\'iroqlar muvaffaqiyatli yangilandi',
      })
    } catch (error: any) {
      console.error('Sync error:', error)
      setMessage({
        type: 'error',
        text: error.response?.data?.message || error.message || 'Sync qilishda xatolik yuz berdi',
      })
    } finally {
      setKerioSyncing(false)
    }
  }

  const loadSettings = async () => {
    try {
      const settings = await settingsApi.getSettings()
      setTelegramToken(settings.telegram?.botToken || '')
      setTelegramWebhook(settings.telegram?.webhookUrl || '')
    } catch (error) {
      console.error('Settings yuklashda xatolik:', error)
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

        <div className="settings-tabs">
          <button
            className={activeTab === 'telegram' ? 'active' : ''}
            onClick={() => setActiveTab('telegram')}
          >
            Telegram
          </button>
          <button
            className={activeTab === 'kerio' ? 'active' : ''}
            onClick={() => setActiveTab('kerio')}
          >
            Kerio Operator
          </button>
        </div>

        <div className="settings-content">
          {activeTab === 'telegram' && (
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
          )}

          {activeTab === 'kerio' && (
            <div className="settings-section">
              <h2>Kerio Operator Integratsiyasi</h2>
              <p className="settings-description">
                Kerio Operator PBX dan qo'ng'iroq ma'lumotlarini olish va boshqarish uchun sozlang.
              </p>

              <div className={`info-box kerio-status ${kerioConnected ? 'connected' : 'disconnected'}`}>
                <h4>Ulanish holati: {kerioConnected ? '✅ Ulandi' : '❌ Ulanmadi'}</h4>
                {!kerioConnected && (
                  <p>Kerio Operator ga ulanib bo'lmadi. Iltimos, sozlamalarni tekshiring va backend .env faylini yangilang.</p>
                )}
                <button
                  onClick={checkKerioConnection}
                  disabled={kerioChecking || loading}
                  className="btn-secondary"
                  style={{ marginTop: '1rem' }}
                >
                  {kerioChecking ? 'Tekshirilmoqda...' : 'Tekshirish'}
                </button>
              </div>

              <div className="form-section">
                <h3>Qo'ng'iroqlarni Sync Qilish</h3>
                <p>Kerio Operator dan qo'ng'iroq ma'lumotlarini hozir sync qilish:</p>
                <button
                  onClick={handleSyncKerio}
                  disabled={kerioSyncing || !kerioConnected}
                  className="btn-primary"
                >
                  {kerioSyncing ? 'Sync qilinmoqda...' : 'Qo\'ng\'iroqlarni Sync Qilish'}
                </button>
              </div>

              <div className="info-box">
                <h4>⚠️ Muhim Eslatma</h4>
                <p>Kerio Operator sozlamalarini backend <code>.env</code> faylida quyidagilarni o'rnating:</p>
                <pre>
                  <code>
                    KERIO_PBX_HOST=90.156.199.92<br/>
                    KERIO_API_USERNAME=your_kerio_api_username<br/>
                    KERIO_API_PASSWORD=your_kerio_api_password<br/>
                    KERIO_SYNC_INTERVAL=5<br/>
                    KERIO_POLL_INTERVAL=2
                  </code>
                </pre>
                <p>Sozlamalarni o'zgartirgandan keyin backend ni qayta ishga tushiring:</p>
                <pre><code>pm2 restart call-center-backend</code></pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default Settings
