import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { settingsApi, operatorsApi, kerioApi } from '../services/api'
import './Settings.css'

const Settings = () => {
  const [activeTab, setActiveTab] = useState<'sip' | 'trunk' | 'telegram' | 'facebook' | 'kerio'>('sip')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'warning'; text: string } | null>(null)

  // SIP Settings
  const [sipExtensions, setSipExtensions] = useState<any[]>([])
  const [newExtension, setNewExtension] = useState({ operatorId: '', extension: '', password: '' })

  // SIP Trunk Settings
  const [sipTrunks, setSipTrunks] = useState<any[]>([])
  const [newTrunk, setNewTrunk] = useState({
    name: '',
    host: '',
    username: '',
    password: '',
    port: 5060,
    transport: 'udp' as 'udp' | 'tcp' | 'tls',
  })

  // Telegram Settings
  const [telegramToken, setTelegramToken] = useState('')
  const [telegramWebhook, setTelegramWebhook] = useState('')

  // Facebook Settings
  const [facebookToken, setFacebookToken] = useState('')
  const [facebookSecret, setFacebookSecret] = useState('')
  const [facebookVerifyToken, setFacebookVerifyToken] = useState('')

  // Kerio Operator Settings
  const [kerioConnected, setKerioConnected] = useState(false)
  const [kerioSyncing, setKerioSyncing] = useState(false)

  useEffect(() => {
    loadSettings()
    loadSipExtensions()
    loadSipTrunks()
    checkKerioConnection()
  }, [])

  const checkKerioConnection = async () => {
    try {
      const result = await kerioApi.verifyAuth()
      setKerioConnected(result.authenticated)
      if (!result.authenticated) {
        setMessage({
          type: 'warning',
          text: 'Kerio Operator ga ulanib bo\'lmadi. Backend .env faylida KERIO_API_USERNAME va KERIO_API_PASSWORD ni tekshiring.',
        })
      }
    } catch (error: any) {
      console.error('Kerio connection check error:', error)
      setKerioConnected(false)
      setMessage({
        type: 'error',
        text: `Kerio Operator ga ulanib bo'lmadi: ${error.message || 'Noma\'lum xatolik'}`,
      })
    }
  }

  const handleSyncKerio = async () => {
    setKerioSyncing(true)
    setMessage(null)
    try {
      const result = await kerioApi.syncCalls()
      setMessage({
        type: 'success',
        text: result.message || 'Qo\'ng\'iroqlar muvaffaqiyatli yangilandi',
      })
      // Calls ro'yxatini yangilash uchun page reload yoki calls API chaqirish
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'Sync qilishda xatolik yuz berdi',
      })
    } finally {
      setKerioSyncing(false)
    }
  }

  const loadSettings = async () => {
    try {
      const settings = await settingsApi.getSettings()
      setTelegramToken(settings.telegram.botToken)
      setTelegramWebhook(settings.telegram.webhookUrl)
      setFacebookToken(settings.facebook.pageAccessToken)
      setFacebookSecret(settings.facebook.appSecret)
      setFacebookVerifyToken(settings.facebook.verifyToken)
    } catch (error) {
      console.error('Settings yuklashda xatolik:', error)
    }
  }

  const loadSipExtensions = async () => {
    try {
      const extensions = await settingsApi.getSipExtensions()
      // Array tekshiruvi
      if (extensions && Array.isArray(extensions)) {
        setSipExtensions(extensions)
        // Agar operatorlar bo'sh bo'lsa, operatorlar ro'yxatini yuklash
        if (extensions.length === 0) {
          try {
            const operators = await operatorsApi.getAll()
            if (operators && Array.isArray(operators)) {
              setSipExtensions(operators)
            }
          } catch (err) {
            console.error('Operatorlar yuklashda xatolik:', err)
          }
        }
      } else {
        setSipExtensions([])
      }
    } catch (error) {
      console.error('SIP extensionlar yuklashda xatolik:', error)
      // Xatolik bo'lsa ham operatorlarni yuklashga harakat qilish
      try {
        const operators = await operatorsApi.getAll()
        if (operators && Array.isArray(operators)) {
          setSipExtensions(operators)
        } else {
          setSipExtensions([])
        }
      } catch (err) {
        console.error('Operatorlar yuklashda xatolik:', err)
        setSipExtensions([])
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
      
      // Webhook URL ni yangilash (agar avtomatik yaratilgan bo'lsa)
      if (result.webhookUrl && !telegramWebhook) {
        setTelegramWebhook(result.webhookUrl)
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Xatolik yuz berdi' })
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
      setMessage({ type: 'success', text: `Bot ulandi: ${result.bot.first_name} (@${result.bot.username})` })
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Telegram ulanishi xatosi' })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveFacebook = async () => {
    setLoading(true)
    setMessage(null)
    try {
      await settingsApi.updateFacebook(facebookToken, facebookSecret, facebookVerifyToken)
      setMessage({ type: 'success', text: 'Facebook sozlamalari saqlandi. .env faylini ham yangilang.' })
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Xatolik yuz berdi' })
    } finally {
      setLoading(false)
    }
  }

  const loadSipTrunks = async () => {
    try {
      const trunks = await settingsApi.getSipTrunks()
      // Array tekshiruvi
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

  const handleCreateSipExtension = async () => {
    if (!newExtension.operatorId || !newExtension.extension || !newExtension.password) {
      setMessage({ type: 'error', text: 'Barcha maydonlarni to\'ldiring' })
      return
    }
    setLoading(true)
    setMessage(null)
    try {
      await settingsApi.createSipExtension(newExtension)
      setMessage({ type: 'success', text: 'SIP extension yaratildi' })
      setNewExtension({ operatorId: '', extension: '', password: '' })
      loadSipExtensions()
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Xatolik yuz berdi' })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSipTrunk = async () => {
    if (!newTrunk.name || !newTrunk.host || !newTrunk.username || !newTrunk.password) {
      setMessage({ type: 'error', text: 'Barcha maydonlarni to\'ldiring (Nomi, Server IP, Username, Password)' })
      return
    }
    setLoading(true)
    setMessage(null)
    try {
      const result = await settingsApi.createSipTrunk(newTrunk)
      
      // Trunklar ro'yxatini yangilash
      await loadSipTrunks()
      
      if (result.manual) {
        // Agar manual bo'lsa, konfiguratsiyani ko'rsatish
        const configText = result.config ? `\n\nQuyidagi konfiguratsiyani /etc/asterisk/pjsip.conf fayliga qo'shing:\n\n${result.config}` : '';
        const errorText = result.error ? `\n\nXatolik: ${result.error}` : '';
        setMessage({
          type: 'warning',
          text: `${result.message}${configText}${errorText}\n\nYoki serverda permissions fix scriptni ishga tushiring:\nssh root@152.53.229.176\ncd /var/www/call-center\n./fix_sip_trunk_permissions.sh`,
        })
      } else {
        setMessage({
          type: 'success',
          text: result.message || 'SIP trunk muvaffaqiyatli yaratildi, saqlandi va Asterisk ga ulanadi',
        })
      }
      
      setNewTrunk({
        name: '',
        host: '',
        username: '',
        password: '',
        port: 5060,
        transport: 'udp',
      })
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Xatolik yuz berdi' })
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
            className={activeTab === 'sip' ? 'active' : ''}
            onClick={() => setActiveTab('sip')}
          >
            SIP Extensionlar
          </button>
          <button
            className={activeTab === 'trunk' ? 'active' : ''}
            onClick={() => setActiveTab('trunk')}
          >
            SIP Trunk (Provayder)
          </button>
          <button
            className={activeTab === 'telegram' ? 'active' : ''}
            onClick={() => setActiveTab('telegram')}
          >
            Telegram
          </button>
          <button
            className={activeTab === 'facebook' ? 'active' : ''}
            onClick={() => setActiveTab('facebook')}
          >
            Facebook/Instagram
          </button>
          <button
            className={activeTab === 'kerio' ? 'active' : ''}
            onClick={() => setActiveTab('kerio')}
          >
            Kerio Operator
          </button>
        </div>

        <div className="settings-content">
          {activeTab === 'sip' && (
            <div className="settings-section">
              <h2>SIP Extensionlar (MicroSIP uchun)</h2>
              <p className="settings-description">
                Operatorlar uchun SIP extensionlar yarating. Har bir operator MicroSIP yoki boshqa SIP client orqali ulanib, telefon qilish va qabul qilish mumkin.
              </p>
              <div className="info-box">
                <strong>📱 MicroSIP da Ulanish:</strong>
                <ul>
                  <li><strong>SIP Server:</strong> <code>152.53.229.176</code> yoki <code>crm24.soundz.uz</code></li>
                  <li><strong>Username:</strong> Extension raqami (masalan: <code>1001</code>)</li>
                  <li><strong>Password:</strong> Yaratilgan parol</li>
                  <li><strong>Domain:</strong> <code>152.53.229.176</code> yoki <code>crm24.soundz.uz</code></li>
                </ul>
                <p><strong>✅ Bu bo'lim MicroSIP uchun kerak!</strong></p>
              </div>

              <div className="form-section">
                <h3>Yangi Extension Yaratish</h3>
                <div className="form-group">
                  <label>Operator</label>
                  <select
                    value={newExtension.operatorId}
                    onChange={(e) => setNewExtension({ ...newExtension, operatorId: e.target.value })}
                  >
                    <option value="">Tanlang...</option>
                    {sipExtensions.map((op) => (
                      <option key={op.id} value={op.id}>
                        {op.name} ({op.extension || 'Extension yo\'q'})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Extension Raqami</label>
                  <input
                    type="text"
                    value={newExtension.extension}
                    onChange={(e) => setNewExtension({ ...newExtension, extension: e.target.value })}
                    placeholder="Masalan: 1001"
                  />
                </div>
                <div className="form-group">
                  <label>Parol</label>
                  <input
                    type="password"
                    value={newExtension.password}
                    onChange={(e) => setNewExtension({ ...newExtension, password: e.target.value })}
                    placeholder="SIP parol"
                  />
                </div>
                <button onClick={handleCreateSipExtension} disabled={loading}>
                  {loading ? 'Yaratilmoqda...' : 'Yaratish'}
                </button>
              </div>

              <div className="extensions-list">
                <h3>Mavjud Extensionlar</h3>
                {sipExtensions.length === 0 ? (
                  <p>Extensionlar mavjud emas</p>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Operator</th>
                        <th>Extension</th>
                        <th>Holat</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sipExtensions.map((ext) => (
                        <tr key={ext.id}>
                          <td>{ext.name}</td>
                          <td>{ext.extension || '-'}</td>
                          <td>
                            <span className={`status-badge status-${ext.status}`}>
                              {ext.status === 'onlayn' ? 'Onlayn' : 'Oflayn'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              <div className="info-box">
                <h4>📱 Telefon Sozlash (SIP Client)</h4>
                <p><strong>Bu ma'lumotlar telefoningizdagi SIP client ilovasida kiritiladi!</strong></p>
                
                <div className="phone-setup-guide">
                  <h5>Qadamlari:</h5>
                  <ol>
                    <li>Telefoningizga SIP client ilovasini o'rnating:
                      <ul>
                        <li><strong>iOS:</strong> Linphone, Zoiper, Groundwire</li>
                        <li><strong>Android:</strong> Linphone, Zoiper, CSipSimple</li>
                        <li><strong>Windows/Mac:</strong> X-Lite, Zoiper, Linphone</li>
                      </ul>
                    </li>
                    <li>Ilovada "Yangi Account" yoki "Add Account" tugmasini bosing</li>
                    <li>Quyidagi ma'lumotlarni kiriting:</li>
                  </ol>

                  <div className="sip-credentials">
                    <div className="credential-item">
                      <strong>SIP Server / Proxy:</strong>
                      <code id="sip-server">152.53.229.176</code>
                      <small>Asterisk server IP manzili</small>
                    </div>
                    <div className="credential-item">
                      <strong>Domain:</strong>
                      <code id="sip-domain">152.53.229.176</code>
                      <small>Asterisk server IP yoki domain (crm24.soundz.uz)</small>
                    </div>
                    <div className="credential-item">
                      <strong>Username / User ID:</strong>
                      <code id="sip-username">{newExtension.extension || '1001'}</code>
                      <small>Extension raqami</small>
                    </div>
                    <div className="credential-item">
                      <strong>Password:</strong>
                      <code id="sip-password">••••••••</code>
                      <small>Yaratilgan parol</small>
                    </div>
                    <div className="credential-item">
                      <strong>Port:</strong>
                      <code>5060</code>
                      <small>Default SIP port</small>
                    </div>
                  </div>

                  <div className="sip-example">
                    <h5>Misol (MicroSIP - Windows):</h5>
                    <ol>
                      <li>MicroSIP ni oching</li>
                      <li>Account → Add</li>
                      <li>Domain: <code>152.53.229.176</code></li>
                      <li>Username: <code>{newExtension.extension || '1001'}</code></li>
                      <li>Password: <code>your_password</code></li>
                      <li>Proxy: <code>152.53.229.176</code></li>
                      <li>Port: <code>5060</code></li>
                      <li>Transport: UDP</li>
                      <li>Register: ✅ Enable</li>
                    </ol>
                  </div>

                  <div className="sip-example">
                    <h5>Misol (Linphone):</h5>
                    <ol>
                      <li>Settings → SIP Accounts → Add Account</li>
                      <li>Username: <code>{newExtension.extension || '1001'}</code></li>
                      <li>Password: <code>your_password</code></li>
                      <li>Domain: <code>152.53.229.176</code></li>
                      <li>Transport: UDP</li>
                      <li>Port: 5060</li>
                    </ol>
                  </div>

                  <div className="sip-example">
                    <h5>Misol (Zoiper):</h5>
                    <ol>
                      <li>Add Account → SIP Account</li>
                      <li>Username: <code>{newExtension.extension || '1001'}</code></li>
                      <li>Password: <code>your_password</code></li>
                      <li>Domain: <code>152.53.229.176</code></li>
                      <li>Save</li>
                    </ol>
                  </div>

                  <div className="warning-box">
                    <strong>⚠️ Muhim:</strong>
                    <ul>
                      <li>Server IP: <code>152.53.229.176</code> yoki <code>crm24.soundz.uz</code></li>
                      <li>Firewall da 5060 port ochiq bo'lishi kerak</li>
                      <li>Extension yaratgandan keyin Asterisk avtomatik reload qilinadi</li>
                      <li>Agar ulanmayotgan bo'lsa, Asterisk loglarini tekshiring</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'trunk' && (
            <div className="settings-section">
              <h2>SIP Trunk (Tashqi Provayder) Sozlash</h2>
              <p className="settings-description">
                SIP provayderlarni (Kerio Control, boshqa SIP provayderlar) Asterisk ga ulash uchun sozlang.
                Bu orqali tashqi telefon raqamlariga qo'ng'iroq qilish va qabul qilish mumkin.
              </p>
              <div className="warning-box">
                <strong>⚠️ Muhim:</strong>
                <ul>
                  <li><strong>SIP Trunk MicroSIP uchun emas!</strong></li>
                  <li>SIP Trunk faqat Asterisk server uchun tashqi provayderga ulanish uchun</li>
                  <li>MicroSIP uchun "SIP Extensionlar" bo'limidan foydalaning</li>
                  <li>SIP Trunk kerak bo'lsa: tashqi telefon raqamlariga qo'ng'iroq qilish yoki tashqidan kelgan qo'ng'iroqlarni qabul qilish</li>
                </ul>
              </div>

              <div className="form-section">
                <h3>Yangi SIP Trunk Yaratish</h3>
                <p className="form-description">
                  SIP provayderni ulash uchun quyidagi ma'lumotlarni kiriting. Trunk avtomatik ravishda yaratiladi va Asterisk ga ulanadi.
                </p>
                <div className="form-group">
                  <label>Nomi *</label>
                  <input
                    type="text"
                    value={newTrunk.name}
                    onChange={(e) => setNewTrunk({ ...newTrunk, name: e.target.value })}
                    placeholder="Masalan: Kerio yoki SIP-Provider"
                    required
                  />
                  <small>Trunk identifikatori (lotin harflar, tire, raqamlar)</small>
                </div>
                <div className="form-group">
                  <label>Server IP yoki Domain *</label>
                  <input
                    type="text"
                    value={newTrunk.host}
                    onChange={(e) => setNewTrunk({ ...newTrunk, host: e.target.value })}
                    placeholder="Masalan: 90.156.199.92 yoki sip.provider.com"
                    required
                  />
                  <small>SIP provayder server manzili</small>
                </div>
                <div className="form-group">
                  <label>Login *</label>
                  <input
                    type="text"
                    value={newTrunk.username}
                    onChange={(e) => setNewTrunk({ ...newTrunk, username: e.target.value })}
                    placeholder="SIP username"
                    required
                  />
                  <small>Provayder bergan login</small>
                </div>
                <div className="form-group">
                  <label>Password *</label>
                  <input
                    type="password"
                    value={newTrunk.password}
                    onChange={(e) => setNewTrunk({ ...newTrunk, password: e.target.value })}
                    placeholder="SIP parol"
                    required
                  />
                  <small>Provayder bergan parol</small>
                </div>
                <div className="form-group">
                  <label>Port</label>
                  <input
                    type="number"
                    value={newTrunk.port}
                    onChange={(e) => setNewTrunk({ ...newTrunk, port: parseInt(e.target.value) || 5060 })}
                    placeholder="5060"
                  />
                  <small>Default: 5060</small>
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
                  <small>Default: UDP</small>
                </div>
                <button onClick={handleCreateSipTrunk} disabled={loading} className="btn-primary">
                  {loading ? 'Yaratilmoqda...' : 'Trunk Yaratish'}
                </button>
              </div>

              <div className="trunks-list">
                <h3>Mavjud Trunklar</h3>
                {sipTrunks.length === 0 ? (
                  <p>Trunklar mavjud emas</p>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Nomi</th>
                        <th>Server</th>
                        <th>Username</th>
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
                )}
              </div>

              <div className="info-box">
                <h4>📞 Kerio Control Sozlash</h4>
                <p>Kerio Control ga ulanish uchun:</p>
                <ol>
                  <li><strong>Server IP:</strong> Kerio Control server IP manzili</li>
                  <li><strong>Username:</strong> Kerio Control da yaratilgan SIP foydalanuvchi nomi</li>
                  <li><strong>Password:</strong> SIP foydalanuvchi paroli</li>
                  <li><strong>Port:</strong> Kerio Control SIP porti (odatda 5060)</li>
                </ol>
              </div>

              <div className="info-box">
                <h4>⚠️ Muhim Eslatmalar</h4>
                <ul>
                  <li>Trunk yaratgandan keyin Asterisk ni qayta ishga tushiring: <code>sudo systemctl restart asterisk</code></li>
                  <li>Trunk holatini tekshirish: <code>sudo asterisk -rvvv</code> → <code>pjsip show endpoints</code></li>
                  <li>Agar konfiguratsiya avtomatik yozilmagan bo'lsa, <code>/etc/asterisk/pjsip.conf</code> faylini qo'lda yangilang</li>
                  <li>Chiquvchi qo'ng'iroqlar uchun dialplan da trunk nomini ishlating</li>
                </ul>
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
                    placeholder="https://your-domain.com/chats/webhook/telegram"
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

          {activeTab === 'facebook' && (
            <div className="settings-section">
              <h2>Facebook/Instagram Sozlash</h2>
              <p className="settings-description">
                Facebook Messenger va Instagram Messaging API ni sozlash uchun quyidagi qadamlarni bajaring:
              </p>

              <div className="info-box">
                <h4>1. Facebook App Yaratish</h4>
                <ol>
                  <li>Facebook Developers (developers.facebook.com) ga kirish</li>
                  <li>Yangi app yaratish</li>
                  <li>Messenger va Instagram Messaging API ni qo'shish</li>
                  <li>Page Access Token olish</li>
                  <li>Webhook URL: <code>https://your-domain.com/api/chats/webhook/facebook</code></li>
                </ol>
              </div>

              <div className="form-section">
                <div className="form-group">
                  <label>Page Access Token</label>
                  <input
                    type="text"
                    value={facebookToken}
                    onChange={(e) => setFacebookToken(e.target.value)}
                    placeholder="EAA..."
                  />
                </div>
                <div className="form-group">
                  <label>App Secret</label>
                  <input
                    type="password"
                    value={facebookSecret}
                    onChange={(e) => setFacebookSecret(e.target.value)}
                    placeholder="App Secret"
                  />
                </div>
                <div className="form-group">
                  <label>Verify Token</label>
                  <input
                    type="text"
                    value={facebookVerifyToken}
                    onChange={(e) => setFacebookVerifyToken(e.target.value)}
                    placeholder="verify_token"
                  />
                  <small>Webhook verification uchun</small>
                </div>
                <button onClick={handleSaveFacebook} disabled={loading} className="btn-primary">
                  {loading ? 'Saqlanmoqda...' : 'Saqlash'}
                </button>
              </div>

              <div className="info-box">
                <h4>Eslatma</h4>
                <p>Facebook sozlamalarini saqlagandan keyin, backend .env faylini ham yangilang va serverni qayta ishga tushiring.</p>
              </div>
            </div>
          )}

          {activeTab === 'kerio' && (
            <div className="settings-section">
              <h2>Kerio Operator Integratsiyasi</h2>
              <p className="settings-description">
                Kerio Operator PBX bilan integratsiya qilish. Qo'ng'iroq ma'lumotlarini avtomatik ravishda olish va saqlash.
              </p>

              <div className="form-section">
                <h3>Ulanish Holati</h3>
                <div className="kerio-status">
                  <div className={`status-indicator ${kerioConnected ? 'connected' : 'disconnected'}`}></div>
                  <span>{kerioConnected ? 'Kerio Operator ga ulanadi' : 'Kerio Operator ga ulanmagan'}</span>
                  <button 
                    onClick={checkKerioConnection} 
                    disabled={loading}
                    style={{ marginLeft: '1rem' }}
                  >
                    Tekshirish
                  </button>
                </div>
              </div>

              <div className="form-section">
                <h3>Qo'ng'iroqlarni Sync Qilish</h3>
                <p className="settings-description">
                  Kerio Operator dan qo'ng'iroq ma'lumotlarini olish va database ga saqlash.
                </p>
                <button 
                  onClick={handleSyncKerio} 
                  disabled={kerioSyncing || !kerioConnected}
                  className="btn-primary"
                >
                  {kerioSyncing ? 'Sync qilinmoqda...' : 'Qo\'ng\'iroqlarni Sync Qilish'}
                </button>
              </div>

              <div className="info-box">
                <h4>📋 Kerio Operator Sozlash</h4>
                <p>Backend .env faylida quyidagi o'zgaruvchilarni sozlang:</p>
                <pre>
{`KERIO_PBX_HOST=90.156.199.92
KERIO_API_USERNAME=your_api_username
KERIO_API_PASSWORD=your_api_password
KERIO_SYNC_INTERVAL=5`}
                </pre>
                <p><strong>Eslatma:</strong> Kerio Operator API endpoint lari haqiqiy API ga moslashtirish kerak.</p>
              </div>

              <div className="info-box">
                <h4>🔄 Avtomatik Sync</h4>
                <p>Backend ishga tushganda avtomatik ravishda har 5 minutda sync qiladi.</p>
                <p>Sync interval ni o'zgartirish uchun <code>KERIO_SYNC_INTERVAL</code> o'zgaruvchisini sozlang.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default Settings

