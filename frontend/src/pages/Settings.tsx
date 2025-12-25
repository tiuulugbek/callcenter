import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { settingsApi, extensionsApi } from '../services/api'
import './Settings.css'

const Settings = () => {
  const [activeTab, setActiveTab] = useState<'telegram' | 'extensions'>('extensions')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'warning'; text: string } | null>(null)

  // Telegram Settings
  const [telegramToken, setTelegramToken] = useState('')
  const [telegramWebhook, setTelegramWebhook] = useState('')

  // Extensions Settings
  const [extensions, setExtensions] = useState<any[]>([])
  const [showExtensionForm, setShowExtensionForm] = useState(false)
  const [editingExtension, setEditingExtension] = useState<any>(null)
  const [extensionForm, setExtensionForm] = useState({
    extension: '',
    password: '',
    displayName: '',
    context: 'from-internal',
    transport: 'transport-udp',
    codecs: 'ulaw,alaw,g729',
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
    if (activeTab === 'extensions') {
      loadExtensions()
    }
  }, [activeTab])

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

  const loadExtensions = async () => {
    try {
      const data = await extensionsApi.getAll()
      setExtensions(data)
    } catch (error: any) {
      console.error('Extensions yuklashda xatolik:', error)
      if (error.response?.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
    }
  }

  const handleCreateExtension = async () => {
    if (!extensionForm.extension || !extensionForm.password) {
      setMessage({ type: 'error', text: 'Extension va Password kiriting' })
      return
    }

    setLoading(true)
    setMessage(null)
    try {
      await extensionsApi.create(extensionForm)
      setMessage({ type: 'success', text: 'Extension muvaffaqiyatli yaratildi va Asterisk ga qo\'shildi!' })
      setShowExtensionForm(false)
      setExtensionForm({
        extension: '',
        password: '',
        displayName: '',
        context: 'from-internal',
        transport: 'transport-udp',
        codecs: 'ulaw,alaw,g729',
      })
      loadExtensions()
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || error.message || 'Extension yaratishda xatolik' 
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateExtension = async () => {
    if (!editingExtension) return

    setLoading(true)
    setMessage(null)
    try {
      await extensionsApi.update(editingExtension.id, {
        password: extensionForm.password,
        displayName: extensionForm.displayName,
        context: extensionForm.context,
        transport: extensionForm.transport,
        codecs: extensionForm.codecs,
      })
      setMessage({ type: 'success', text: 'Extension muvaffaqiyatli yangilandi!' })
      setShowExtensionForm(false)
      setEditingExtension(null)
      setExtensionForm({
        extension: '',
        password: '',
        displayName: '',
        context: 'from-internal',
        transport: 'transport-udp',
        codecs: 'ulaw,alaw,g729',
      })
      loadExtensions()
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || error.message || 'Extension yangilashda xatolik' 
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteExtension = async (id: string) => {
    if (!confirm('Extension ni o\'chirishni tasdiqlaysizmi?')) return

    setLoading(true)
    setMessage(null)
    try {
      await extensionsApi.delete(id)
      setMessage({ type: 'success', text: 'Extension muvaffaqiyatli o\'chirildi!' })
      loadExtensions()
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || error.message || 'Extension o\'chirishda xatolik' 
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEditExtension = (ext: any) => {
    setEditingExtension(ext)
    setExtensionForm({
      extension: ext.extension,
      password: ext.password,
      displayName: ext.displayName || '',
      context: ext.context || 'from-internal',
      transport: ext.transport || 'transport-udp',
      codecs: ext.codecs || 'ulaw,alaw,g729',
    })
    setShowExtensionForm(true)
  }

  const handleCheckStatus = async (id: string) => {
    setLoading(true)
    try {
      const status = await extensionsApi.getStatus(id)
      const statusText = status.status === 'available' ? 'Mavjud' : 
                        status.status === 'registered' ? 'Ro\'yxatdan o\'tgan' : 
                        status.status === 'unavailable' ? 'Mavjud emas' : 'Xatolik'
      setMessage({ type: 'success', text: `Extension holati: ${statusText}` })
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || error.message || 'Holatni tekshirishda xatolik' 
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
            className={activeTab === 'extensions' ? 'active' : ''}
            onClick={() => setActiveTab('extensions')}
          >
            SIP Extensions
          </button>
          <button
            className={activeTab === 'telegram' ? 'active' : ''}
            onClick={() => setActiveTab('telegram')}
          >
            Telegram
          </button>
        </div>

        <div className="settings-content">
          {activeTab === 'extensions' && (
            <div className="settings-section">
              <h2>SIP Extensions Boshqarish</h2>
              <p className="settings-description">
                SIP Extension lar yaratish, tahrirlash va o'chirish. Extension yaratilgandan keyin avtomatik ravishda Asterisk ga qo'shiladi.
              </p>

              <div className="button-group" style={{ marginBottom: '20px' }}>
                <button 
                  onClick={() => {
                    setShowExtensionForm(true)
                    setEditingExtension(null)
                    setExtensionForm({
                      extension: '',
                      password: '',
                      displayName: '',
                      context: 'from-internal',
                      transport: 'transport-udp',
                      codecs: 'ulaw,alaw,g729',
                    })
                  }}
                  className="btn-primary"
                >
                  + Yangi Extension
                </button>
              </div>

              {showExtensionForm && (
                <div className="form-section" style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
                  <h3>{editingExtension ? 'Extension ni Tahrirlash' : 'Yangi Extension Yaratish'}</h3>
                  <div className="form-group">
                    <label>Extension Raqami *</label>
                    <input
                      type="text"
                      value={extensionForm.extension}
                      onChange={(e) => setExtensionForm({ ...extensionForm, extension: e.target.value })}
                      placeholder="1001"
                      disabled={!!editingExtension}
                    />
                  </div>
                  <div className="form-group">
                    <label>Password *</label>
                    <input
                      type="password"
                      value={extensionForm.password}
                      onChange={(e) => setExtensionForm({ ...extensionForm, password: e.target.value })}
                      placeholder="Parol"
                    />
                  </div>
                  <div className="form-group">
                    <label>Display Name</label>
                    <input
                      type="text"
                      value={extensionForm.displayName}
                      onChange={(e) => setExtensionForm({ ...extensionForm, displayName: e.target.value })}
                      placeholder="Ko'rinadigan nom"
                    />
                  </div>
                  <div className="form-group">
                    <label>Context</label>
                    <select
                      value={extensionForm.context}
                      onChange={(e) => setExtensionForm({ ...extensionForm, context: e.target.value })}
                    >
                      <option value="from-internal">from-internal</option>
                      <option value="from-external">from-external</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Transport</label>
                    <select
                      value={extensionForm.transport}
                      onChange={(e) => setExtensionForm({ ...extensionForm, transport: e.target.value })}
                    >
                      <option value="transport-udp">transport-udp</option>
                      <option value="transport-tcp">transport-tcp</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Codecs (vergul bilan ajratilgan)</label>
                    <input
                      type="text"
                      value={extensionForm.codecs}
                      onChange={(e) => setExtensionForm({ ...extensionForm, codecs: e.target.value })}
                      placeholder="ulaw,alaw,g729"
                    />
                  </div>
                  <div className="button-group">
                    <button 
                      onClick={editingExtension ? handleUpdateExtension : handleCreateExtension}
                      disabled={loading}
                      className="btn-primary"
                    >
                      {loading ? 'Saqlanmoqda...' : editingExtension ? 'Yangilash' : 'Yaratish'}
                    </button>
                    <button 
                      onClick={() => {
                        setShowExtensionForm(false)
                        setEditingExtension(null)
                      }}
                      disabled={loading}
                    >
                      Bekor qilish
                    </button>
                  </div>
                </div>
              )}

              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Extension</th>
                      <th>Display Name</th>
                      <th>Context</th>
                      <th>Transport</th>
                      <th>Status</th>
                      <th>Amallar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {extensions.map((ext) => (
                      <tr key={ext.id}>
                        <td>{ext.extension}</td>
                        <td>{ext.displayName || ext.extension}</td>
                        <td>{ext.context}</td>
                        <td>{ext.transport}</td>
                        <td>
                          <span className={`status-badge status-${ext.status}`}>
                            {ext.status === 'available' ? 'Mavjud' : 
                             ext.status === 'registered' ? 'Ro\'yxatdan o\'tgan' : 'Mavjud emas'}
                          </span>
                        </td>
                        <td>
                          <button 
                            onClick={() => handleCheckStatus(ext.id)}
                            className="btn-small"
                            disabled={loading}
                          >
                            Holat
                          </button>
                          <button 
                            onClick={() => handleEditExtension(ext)}
                            className="btn-small"
                            disabled={loading}
                          >
                            Tahrirlash
                          </button>
                          <button 
                            onClick={() => handleDeleteExtension(ext.id)}
                            className="btn-small btn-danger"
                            disabled={loading}
                          >
                            O'chirish
                          </button>
                        </td>
                      </tr>
                    ))}
                    {extensions.length === 0 && (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>
                          Hozircha extension lar yo'q. Yangi extension yarating.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="info-box" style={{ marginTop: '20px' }}>
                <h4>PortSIP orqali Ulanish:</h4>
                <ol>
                  <li>Yangi extension yarating (masalan, 1001)</li>
                  <li>PortSIP da quyidagi sozlamalarni kiriting:
                    <ul>
                      <li>SIP Server: 152.53.229.176</li>
                      <li>Port: 5060</li>
                      <li>Transport: UDP</li>
                      <li>Username: Extension raqami (masalan, 1001)</li>
                      <li>Password: Extension paroli</li>
                      <li>Auth Username: Extension raqami (Username bilan bir xil)</li>
                    </ul>
                  </li>
                  <li>PortSIP da "Register" tugmasini bosing</li>
                  <li>"Holat" tugmasini bosib extension holatini tekshiring</li>
                </ol>
              </div>
            </div>
          )}

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
          )}
        </div>
      </div>
    </Layout>
  )
}

export default Settings
