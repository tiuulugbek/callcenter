import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { settingsApi, kerioApi } from '../services/api'
import './Settings.css'

const Settings = () => {
  const [activeTab, setActiveTab] = useState<'telegram' | 'kerio' | 'sip'>('telegram')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'warning'; text: string } | null>(null)

  // Telegram Settings
  const [telegramToken, setTelegramToken] = useState('')
  const [telegramWebhook, setTelegramWebhook] = useState('')

  // Kerio Operator Settings
  const [kerioConnected, setKerioConnected] = useState(false)
  const [kerioSyncing, setKerioSyncing] = useState(false)
  const [kerioChecking, setKerioChecking] = useState(false)

  // SIP Trunk Settings
  const [sipTrunks, setSipTrunks] = useState<any[]>([])
  const [newTrunk, setNewTrunk] = useState({
    name: 'BellUZ',
    host: 'bell.uz',
    username: '',
    password: '',
    port: 5060,
    transport: 'udp' as 'udp' | 'tcp' | 'tls',
  })

  useEffect(() => {
    // Token mavjudligini tekshirish
    const token = localStorage.getItem('token')
    if (!token) {
      // Token yo'q bo'lsa, login sahifasiga redirect
      window.location.href = '/login'
      return
    }
    
    loadSettings()
    loadSipTrunks()
    checkKerioConnection()
  }, [])

  const loadSipTrunks = async () => {
    try {
      const trunks = await settingsApi.getSipTrunks()
      if (trunks && Array.isArray(trunks)) {
        setSipTrunks(trunks)
      } else {
        setSipTrunks([])
      }
    } catch (error) {
      console.error('SIP trunklar yuklashda xatolik:', error)
      setSipTrunks([])
    }
  }

  const handleCreateSipTrunk = async () => {
    if (!newTrunk.name || !newTrunk.host || !newTrunk.username || !newTrunk.password) {
      setMessage({ type: 'error', text: 'Barcha maydonlarni to\'ldiring (Nomi, Server, Login, Password)' })
      return
    }
    setLoading(true)
    setMessage(null)
    try {
      const result = await settingsApi.createSipTrunk(newTrunk)
      await loadSipTrunks()
      
      setMessage({
        type: 'success',
        text: 'SIP trunk ma\'lumotlari database ga saqlandi. Asosiy sozlash Kerio Operator da bo\'ladi.',
      })
      
      setNewTrunk({
        name: 'BellUZ',
        host: 'bell.uz',
        username: '',
        password: '',
        port: 5060,
        transport: 'udp',
      })
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || error.message || 'Xatolik yuz berdi' })
    } finally {
      setLoading(false)
    }
  }

  const checkKerioConnection = async () => {
    console.log('checkKerioConnection chaqirildi')
    setKerioChecking(true)
    setMessage(null)
    
    try {
      console.log('Kerio Operator ulanishini tekshirish...')
      console.log('API URL:', import.meta.env.VITE_API_URL || 'http://localhost:4000')
      
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
      console.error('Error details:', {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data,
      })
      
      setKerioConnected(false)
      
      let errorMessage = 'Kerio Operator ga ulanib bo\'lmadi'
      if (error.response?.data?.message) {
        errorMessage += `: ${error.response.data.message}`
      } else if (error.message) {
        errorMessage += `: ${error.message}`
      } else {
        errorMessage += ': Noma\'lum xatolik'
      }
      
      setMessage({
        type: 'error',
        text: errorMessage,
      })
    } finally {
      setKerioChecking(false)
      console.log('checkKerioConnection tugadi')
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

        <div className="settings-tabs">
          <button
            className={activeTab === 'telegram' ? 'active' : ''}
            onClick={() => setActiveTab('telegram')}
          >
            Telegram
          </button>
          <button
            className={activeTab === 'sip' ? 'active' : ''}
            onClick={() => setActiveTab('sip')}
          >
            SIP Provayder
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

          {activeTab === 'sip' && (
            <div className="settings-section">
              <h2>SIP Provayder Sozlash (bell.uz)</h2>
              <p className="settings-description">
                SIP provayder ma'lumotlarini saqlash. <strong>Asosiy sozlash Kerio Operator da bo'ladi.</strong>
              </p>

              <div className="warning-box" style={{ backgroundColor: '#fff3cd', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #ffc107' }}>
                <h4>⚠️ Muhim Eslatma</h4>
                <p><strong>Bu sistema faqat ma'lumotlarni saqlash uchun!</strong></p>
                <p>Telefonlar <strong>Kerio Operator PBX</strong> ga tushadi. Bizning sistema faqat call events ni olish va ko'rsatish uchun.</p>
                <p>Asosiy sozlash Kerio Operator Admin Panel da bo'ladi:</p>
                <ol>
                  <li>Kerio Operator Admin Panel ga kiring</li>
                  <li>SIP Trunks bo'limiga o'ting</li>
                  <li>Yangi Trunk yarating (bell.uz ma'lumotlari bilan)</li>
                  <li>Inbound Routes sozlang</li>
                </ol>
              </div>

              <div className="form-section">
                <h3>SIP Provayder Ma'lumotlari</h3>
                <p>Quyidagi ma'lumotlarni kiriting (faqat saqlash uchun):</p>
                <div className="form-group">
                  <label>Nomi *</label>
                  <input
                    type="text"
                    value={newTrunk.name}
                    onChange={(e) => setNewTrunk({ ...newTrunk, name: e.target.value })}
                    placeholder="BellUZ"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>SIP Server *</label>
                  <input
                    type="text"
                    value={newTrunk.host}
                    onChange={(e) => setNewTrunk({ ...newTrunk, host: e.target.value })}
                    placeholder="bell.uz"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Login *</label>
                  <input
                    type="text"
                    value={newTrunk.username}
                    onChange={(e) => setNewTrunk({ ...newTrunk, username: e.target.value })}
                    placeholder="Sizning login"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Password *</label>
                  <input
                    type="password"
                    value={newTrunk.password}
                    onChange={(e) => setNewTrunk({ ...newTrunk, password: e.target.value })}
                    placeholder="Sizning parol"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Port</label>
                  <input
                    type="number"
                    value={newTrunk.port}
                    onChange={(e) => setNewTrunk({ ...newTrunk, port: parseInt(e.target.value) || 5060 })}
                    placeholder="5060"
                  />
                </div>
                <div className="form-group">
                  <label>Transport</label>
                  <select
                    value={newTrunk.transport}
                    onChange={(e) => setNewTrunk({ ...newTrunk, transport: e.target.value as 'udp' | 'tcp' | 'tls' })}
                  >
                    <option value="udp">UDP</option>
                    <option value="tcp">TCP</option>
                    <option value="tls">TLS</option>
                  </select>
                </div>
                <button onClick={handleCreateSipTrunk} disabled={loading} className="btn-primary">
                  {loading ? 'Saqlanmoqda...' : 'Ma\'lumotlarni Saqlash'}
                </button>
              </div>

              {sipTrunks.length > 0 && (
                <div className="form-section">
                  <h3>Saqlangan SIP Trunklar</h3>
                  <table>
                    <thead>
                      <tr>
                        <th>Nomi</th>
                        <th>Server</th>
                        <th>Login</th>
                        <th>Port</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sipTrunks.map((trunk, index) => (
                        <tr key={index}>
                          <td>{trunk.name}</td>
                          <td>{trunk.host}</td>
                          <td>{trunk.username}</td>
                          <td>{trunk.port || 5060}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="info-box">
                <h4>📋 Kerio Operator da Sozlash</h4>
                <p>Kerio Operator Admin Panel da quyidagilarni qiling:</p>
                <ol>
                  <li><strong>SIP Trunks</strong> bo'limiga kiring</li>
                  <li><strong>Yangi Trunk</strong> yarating:
                    <ul>
                      <li>Name: <code>BellUZ</code></li>
                      <li>Host: <code>bell.uz</code></li>
                      <li>Username: <code>(Sizning login)</code></li>
                      <li>Password: <code>(Sizning parol)</code></li>
                      <li>Port: <code>5060</code></li>
                      <li>Transport: <code>UDP</code></li>
                    </ul>
                  </li>
                  <li><strong>Inbound Routes</strong> sozlang:
                    <ul>
                      <li>Trunk: <code>BellUZ</code></li>
                      <li>Destination: Extension yoki Queue</li>
                    </ul>
                  </li>
                </ol>
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
                  onClick={(e) => {
                    e.preventDefault()
                    console.log('Tekshirish tugmasi bosildi')
                    checkKerioConnection()
                  }}
                  disabled={kerioChecking || loading}
                  className="btn-secondary"
                  style={{ marginTop: '1rem', cursor: kerioChecking || loading ? 'not-allowed' : 'pointer' }}
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
