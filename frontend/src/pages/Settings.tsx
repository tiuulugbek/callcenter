import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { settingsApi, kerioApi } from '../services/api'
import Phone from '../components/Phone'
import './Settings.css'

const Settings = () => {
  const [activeTab, setActiveTab] = useState<'telegram' | 'sip' | 'kerio' | 'webrtc'>('telegram')
  
  // WebRTC/SIP Settings
  const [sipConfig, setSipConfig] = useState<{
    server: string;
    username: string;
    password: string;
    domain: string;
  } | null>(null)
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
  const [editingTrunk, setEditingTrunk] = useState<any | null>(null)

  // Kerio Operator Settings
  const [kerioAuthenticated, setKerioAuthenticated] = useState(false)
  const [kerioSyncing, setKerioSyncing] = useState(false)
  const [kerioSyncMessage, setKerioSyncMessage] = useState<string | null>(null)
  const [kerioStartDate, setKerioStartDate] = useState('')
  const [kerioEndDate, setKerioEndDate] = useState('')
  const [kerioExtension, setKerioExtension] = useState('')

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
    checkKerioAuth()
  }, [])

  const checkKerioAuth = async () => {
    try {
      const result = await kerioApi.verifyAuth()
      setKerioAuthenticated(result.authenticated || false)
    } catch (error) {
      console.error('Kerio auth tekshirishda xatolik:', error)
      setKerioAuthenticated(false)
    }
  }

  const handleKerioSync = async () => {
    setKerioSyncing(true)
    setKerioSyncMessage(null)
    try {
      const params: any = {}
      if (kerioStartDate) params.startDate = kerioStartDate
      if (kerioEndDate) params.endDate = kerioEndDate
      if (kerioExtension) params.extension = kerioExtension

      const result = await kerioApi.syncCalls(params)
      setKerioSyncMessage(`Muvaffaqiyatli: ${result.message || `${result.syncedCount} ta qo'ng'iroq yangilandi`}`)
    } catch (error: any) {
      setKerioSyncMessage(`Xatolik: ${error.response?.data?.message || error.message || "Noma'lum xatolik"}`)
    } finally {
      setKerioSyncing(false)
    }
  }

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

  const handleEditTrunk = (trunk: any) => {
    setEditingTrunk({ ...trunk })
    setNewTrunk({
      name: trunk.name,
      host: trunk.host,
      username: trunk.username,
      password: '', // Password yashirilgan, bo'sh qoldiramiz
      port: trunk.port || 5060,
      transport: trunk.transport || 'udp',
    })
  }

  const handleUpdateTrunk = async () => {
    if (!editingTrunk || !newTrunk.name || !newTrunk.host || !newTrunk.username) {
      setMessage({ type: 'error', text: 'Barcha maydonlarni to\'ldiring (Nomi, Server, Login)' })
      return
    }
    setLoading(true)
    setMessage(null)
    try {
      // Password bo'sh bo'lsa, o'zgartirmaslik
      const updateData: any = {
        name: newTrunk.name,
        host: newTrunk.host,
        username: newTrunk.username,
        port: newTrunk.port,
        transport: newTrunk.transport,
      }
      // Password faqat yangi kiritilgan bo'lsa qo'shish
      if (newTrunk.password && newTrunk.password.trim() !== '') {
        updateData.password = newTrunk.password
      }
      
      await settingsApi.updateSipTrunk(editingTrunk.id, updateData)
      await loadSipTrunks()
      setEditingTrunk(null)
      setMessage({
        type: 'success',
        text: 'SIP trunk muvaffaqiyatli yangilandi va Asterisk ga avtomatik sozlandi.',
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

  const handleDeleteTrunk = async (id: string) => {
    if (!confirm('Haqiqatan ham bu trunkni o\'chirmoqchimisiz?')) {
      return
    }
    setLoading(true)
    setMessage(null)
    try {
      await settingsApi.deleteSipTrunk(id)
      await loadSipTrunks()
      setMessage({
        type: 'success',
        text: 'SIP trunk muvaffaqiyatli o\'chirildi.',
      })
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || error.message || 'Xatolik yuz berdi' })
    } finally {
      setLoading(false)
    }
  }

  const handleCancelEdit = () => {
    setEditingTrunk(null)
    setNewTrunk({
      name: 'BellUZ',
      host: 'bell.uz',
      username: '',
      password: '',
      port: 5060,
      transport: 'udp',
    })
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
          <button
            className={activeTab === 'webrtc' ? 'active' : ''}
            onClick={() => setActiveTab('webrtc')}
          >
            WebRTC Telefon
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
                <p>Bell.uz SIP provayder ma'lumotlarini kiriting va "Ma'lumotlarni Saqlash" tugmasini bosing. Trunk avtomatik Asterisk ga sozlanadi.</p>
                <p><strong>Muhim:</strong> Login, Password va SIP-server ma'lumotlarini to'g'ri kiriting. Bu ma'lumotlar Bell.uz dan olingan bo'lishi kerak.</p>
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
                <div className="button-group">
                  {editingTrunk ? (
                    <>
                      <button onClick={handleUpdateTrunk} disabled={loading} className="btn-primary">
                        {loading ? 'Yangilanmoqda...' : 'Yangilash'}
                      </button>
                      <button onClick={handleCancelEdit} disabled={loading} className="btn-secondary">
                        Bekor qilish
                      </button>
                    </>
                  ) : (
                    <button onClick={handleCreateSipTrunk} disabled={loading} className="btn-primary">
                      {loading ? 'Saqlanmoqda...' : 'Ma\'lumotlarni Saqlash'}
                    </button>
                  )}
                </div>
              </div>

              {sipTrunks.length > 0 && (
                <div className="form-section">
                  <h3>Mavjud SIP Trunklar</h3>
                  <table style={{ width: '100%', marginTop: '1rem' }}>
                    <thead>
                      <tr>
                        <th>Nomi</th>
                        <th>Server</th>
                        <th>Login</th>
                        <th>Port</th>
                        <th>Transport</th>
                        <th style={{ width: '200px', minWidth: '180px' }}>Amallar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sipTrunks.map((trunk) => (
                        <tr key={trunk.id || trunk.name}>
                          <td>{trunk.name}</td>
                          <td>{trunk.host}</td>
                          <td>{trunk.username}</td>
                          <td>{trunk.port || 5060}</td>
                          <td>{trunk.transport || 'udp'}</td>
                          <td>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                              <button
                                onClick={() => handleEditTrunk(trunk)}
                                disabled={loading}
                                className="btn-secondary"
                                style={{ 
                                  padding: '0.5rem 1rem', 
                                  fontSize: '0.875rem',
                                  minWidth: '80px',
                                  cursor: loading ? 'not-allowed' : 'pointer'
                                }}
                              >
                                Tahrirlash
                              </button>
                              <button
                                onClick={() => handleDeleteTrunk(trunk.id)}
                                disabled={loading || !trunk.id}
                                style={{ 
                                  padding: '0.5rem 1rem', 
                                  fontSize: '0.875rem', 
                                  backgroundColor: '#dc3545', 
                                  color: 'white', 
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: loading || !trunk.id ? 'not-allowed' : 'pointer',
                                  minWidth: '80px'
                                }}
                              >
                                O'chirish
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="info-box" style={{ backgroundColor: '#fff3cd', padding: '1rem', borderRadius: '8px', marginTop: '1.5rem', border: '1px solid #ffc107' }}>
                <h4>📋 Muhim Eslatmalar</h4>
                <p><strong>Trunk yaratgandan keyin Asterisk ni qayta ishga tushiring:</strong></p>
                <pre style={{ backgroundColor: '#fff', padding: '0.5rem', borderRadius: '4px', margin: '0.5rem 0' }}>
                  <code>sudo systemctl restart asterisk</code>
                </pre>
                <p><strong>Trunk holatini tekshirish:</strong></p>
                <pre style={{ backgroundColor: '#fff', padding: '0.5rem', borderRadius: '4px', margin: '0.5rem 0' }}>
                  <code>sudo asterisk -rvvv → pjsip show endpoints</code>
                </pre>
                <p><strong>Agar konfiguratsiya avtomatik yozilmagan bo'lsa:</strong></p>
                <p style={{ marginTop: '0.5rem' }}>Manually <code>/etc/asterisk/pjsip.conf</code> faylini yangilang</p>
                <p style={{ marginTop: '0.5rem' }}><strong>Chiquvchi qo'ng'iroqlar uchun dialplan da trunk nomini ishlating</strong></p>
              </div>
            </div>
          )}

          {activeTab === 'kerio' && (
            <div className="settings-section">
              <h2>Kerio Operator</h2>
              <p className="settings-description">
                Kerio Operator PBX dan qo'ng'iroq ma'lumotlarini sinxronlashtirish.
              </p>

              <div className="info-box" style={{ backgroundColor: '#d1ecf1', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #bee5eb' }}>
                <h4>ℹ️ Ma'lumot</h4>
                <p><strong>Kerio Operator</strong> logikasi faqat bu tabda ishlatiladi.</p>
                <p>Avtomatik sinxronlashtirish o'chirilgan. Qo'ng'iroqlarni qo'lda sinxronlashtirish mumkin.</p>
              </div>

              <div className="form-section">
                <h3>Ulanishni Tekshirish</h3>
                <div style={{ marginBottom: '1rem' }}>
                  <p>Holat: <strong style={{ color: kerioAuthenticated ? '#28a745' : '#dc3545' }}>
                    {kerioAuthenticated ? '✅ Ulangan' : '❌ Ulanmagan'}
                  </strong></p>
                  <button onClick={checkKerioAuth} disabled={loading} className="btn-secondary" style={{ marginTop: '0.5rem' }}>
                    Qayta Tekshirish
                  </button>
                </div>

                <h3>Qo'ng'iroqlarni Sinxronlashtirish</h3>
                <div className="form-group">
                  <label>Boshlanish sanasi</label>
                  <input
                    type="date"
                    value={kerioStartDate}
                    onChange={(e) => setKerioStartDate(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Tugash sanasi</label>
                  <input
                    type="date"
                    value={kerioEndDate}
                    onChange={(e) => setKerioEndDate(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Extension (ixtiyoriy)</label>
                  <input
                    type="text"
                    value={kerioExtension}
                    onChange={(e) => setKerioExtension(e.target.value)}
                    placeholder="Masalan: 1001"
                  />
                </div>
                <div className="button-group">
                  <button 
                    onClick={handleKerioSync} 
                    disabled={kerioSyncing || loading} 
                    className="btn-primary"
                  >
                    {kerioSyncing ? 'Sinxronlashtirilmoqda...' : 'Sinxronlashtirish'}
                  </button>
                </div>
                {kerioSyncMessage && (
                  <div className={`alert alert-${kerioSyncMessage.includes('Muvaffaqiyatli') ? 'success' : 'error'}`} style={{ marginTop: '1rem' }}>
                    {kerioSyncMessage}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'webrtc' && (
            <div className="settings-section">
              <h2>WebRTC Telefon (bell.uz)</h2>
              <p className="settings-description">
                WebRTC orqali to'g'ridan-to'g'ri bell.uz SIP server ga ulanish va qo'ng'iroq qilish.
              </p>

              <div className="info-box" style={{ backgroundColor: '#d1ecf1', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #bee5eb' }}>
                <h4>ℹ️ Ma'lumot</h4>
                <p><strong>WebRTC</strong> orqali browser dan to'g'ridan-to'g'ri SIP server ga qo'ng'iroq qilish mumkin.</p>
                <p>Quyidagi ma'lumotlarni kiriting va "Ulanish" tugmasini bosing.</p>
                <p><strong>Muhim:</strong> Browser microphone ruxsati kerak. HTTPS bo'lishi kerak (production).</p>
              </div>

              <div className="form-section">
                <h3>WebRTC Sozlamalari</h3>
                <div className="form-group">
                  <label>SIP Server *</label>
                  <input
                    type="text"
                    value={sipConfig?.server || ''}
                    onChange={(e) => setSipConfig({ ...sipConfig || { server: '', username: '', password: '', domain: '' }, server: e.target.value })}
                    placeholder="bell.uz"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Login (SIP Username) *</label>
                  <input
                    type="text"
                    value={sipConfig?.username || ''}
                    onChange={(e) => setSipConfig({ ...sipConfig || { server: '', username: '', password: '', domain: '' }, username: e.target.value })}
                    placeholder="998785553322"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Password (SIP Password) *</label>
                  <input
                    type="password"
                    value={sipConfig?.password || ''}
                    onChange={(e) => setSipConfig({ ...sipConfig || { server: '', username: '', password: '', domain: '' }, password: e.target.value })}
                    placeholder="SIP password"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Domain</label>
                  <input
                    type="text"
                    value={sipConfig?.domain || ''}
                    onChange={(e) => setSipConfig({ ...sipConfig || { server: '', username: '', password: '', domain: '' }, domain: e.target.value })}
                    placeholder="bell.uz (avtomatik server dan olinadi)"
                  />
                  <small>Domain bo'sh bo'lsa, server dan avtomatik olinadi</small>
                </div>
              </div>

              {sipConfig && sipConfig.server && sipConfig.username && sipConfig.password && (
                <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
                  <h3>Telefon</h3>
                  <Phone config={{
                    server: sipConfig.server,
                    username: sipConfig.username,
                    password: sipConfig.password,
                    domain: sipConfig.domain || sipConfig.server,
                  }} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default Settings
