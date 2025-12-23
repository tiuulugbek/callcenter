import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { settingsApi } from '../services/api'
import './Settings.css'

const Settings = () => {
  const [activeTab, setActiveTab] = useState<'telegram' | 'sip'>('telegram')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'warning'; text: string } | null>(null)

  // Telegram Settings
  const [telegramToken, setTelegramToken] = useState('')
  const [telegramWebhook, setTelegramWebhook] = useState('')

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
      await settingsApi.createSipTrunk(newTrunk)
      await loadSipTrunks()
      
      setMessage({
        type: 'success',
        text: 'SIP trunk ma\'lumotlari database ga saqlandi va Asterisk ga avtomatik sozlandi.',
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
                SIP provayder ma'lumotlarini kiriting. Ma'lumotlar database ga saqlanadi va Asterisk ga avtomatik sozlanadi.
              </p>

              <div className="info-box" style={{ backgroundColor: '#d1ecf1', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #bee5eb' }}>
                <h4>ℹ️ Ma'lumot</h4>
                <p><strong>Asterisk PBX</strong> orqali barcha qo'ng'iroqlar boshqariladi.</p>
                <p>Ma'lumotlarni kiriting va "Ma'lumotlarni Saqlash" tugmasini bosing. Trunk avtomatik Asterisk ga sozlanadi.</p>
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
                <h4>📋 Asterisk Sozlash</h4>
                <p>Ma'lumotlar saqlangandan keyin Asterisk avtomatik sozlanadi. Tekshirish:</p>
                <pre>
                  <code>
                    sudo asterisk -rvvv<br/>
                    pjsip show endpoints<br/>
                    pjsip show registrations
                  </code>
                </pre>
                <p>Agar trunk ulanmagan bo'lsa, Asterisk ni reload qiling:</p>
                <pre><code>sudo asterisk -rx "pjsip reload"</code></pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default Settings
