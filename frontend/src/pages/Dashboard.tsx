import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { wsService } from '../services/websocket'
import Phone from '../components/Phone'
import SipSettings from '../components/SipSettings'
import { settingsApi } from '../services/api'
import './Dashboard.css'

interface IncomingCall {
  callId: string
  fromNumber: string
  toNumber: string
  direction: string
  startTime: string
}

const Dashboard = () => {
  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null)
  const [showPopup, setShowPopup] = useState(false)
  const [sipConfig, setSipConfig] = useState<{
    server: string;
    username: string;
    password: string;
    domain: string;
  } | null>(null)

  useEffect(() => {
    // SIP sozlamalarini yuklash (faqat agar localStorage da bor bo'lsa)
    const loadSipConfig = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) return

        // SIP ma'lumotlarini localStorage dan olish
        const sipUsername = localStorage.getItem('sip_username')
        const sipPassword = localStorage.getItem('sip_password')
        const sipServer = localStorage.getItem('sip_server') || '152.53.229.176'
        const sipDomain = localStorage.getItem('sip_domain') || '152.53.229.176'

        if (sipUsername && sipPassword) {
          setSipConfig({
            server: sipServer,
            username: sipUsername,
            password: sipPassword,
            domain: sipDomain,
          })
        } else {
          // Agar localStorage da yo'q bo'lsa, settings dan yuklashga harakat qilish
          try {
            const extensions = await settingsApi.getSipExtensions()
            if (extensions && Array.isArray(extensions) && extensions.length > 0) {
              const extension = extensions[0]
              if (extension.extension) {
                // Password so'ralishi kerak yoki localStorage dan olish
                const storedPassword = localStorage.getItem('sip_password')
                if (storedPassword) {
                  setSipConfig({
                    server: sipServer,
                    username: extension.extension,
                    password: storedPassword,
                    domain: sipDomain,
                  })
                }
              }
            }
          } catch (error) {
            console.error('SIP extensions yuklashda xatolik:', error)
          }
        }
      } catch (error) {
        console.error('SIP config yuklashda xatolik:', error)
      }
    }

    loadSipConfig()

    // WebSocket orqali kiruvchi qo'ng'iroqlarni qabul qilish
    const socket = wsService.connect()

    socket.on('incoming_call', (data: IncomingCall) => {
      setIncomingCall(data)
      setShowPopup(true)
    })

    return () => {
      wsService.disconnect()
    }
  }, [])

  const handleClosePopup = () => {
    setShowPopup(false)
    setIncomingCall(null)
  }

  return (
    <Layout>
      <div className="dashboard">
        <h1>Dashboard</h1>
        
        {!sipConfig && (
          <div className="phone-section">
            <SipSettings onSave={(config) => setSipConfig(config)} />
          </div>
        )}
        
        {sipConfig && (
          <div className="phone-section">
            <h2>Telefon</h2>
            <Phone config={sipConfig} />
            <button 
              onClick={() => setSipConfig(null)} 
              className="btn-secondary"
              style={{ marginTop: '1rem' }}
            >
              Sozlamalarni o'zgartirish
            </button>
          </div>
        )}

        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Bugungi qo'ng'iroqlar</h3>
            <p className="stat-number">0</p>
          </div>
          <div className="stat-card">
            <h3>Faol chatlar</h3>
            <p className="stat-number">0</p>
          </div>
          <div className="stat-card">
            <h3>Onlayn operatorlar</h3>
            <p className="stat-number">0</p>
          </div>
        </div>

        {showPopup && incomingCall && (
          <div className="call-popup">
            <div className="call-popup-content">
              <h2>Kiruvchi qo'ng'iroq</h2>
              <div className="call-info">
                <p><strong>Qayerdan:</strong> {incomingCall.fromNumber}</p>
                <p><strong>Qayerga:</strong> {incomingCall.toNumber}</p>
                <p><strong>Vaqt:</strong> {new Date(incomingCall.startTime).toLocaleString('uz-UZ')}</p>
              </div>
              <div className="call-popup-actions">
                <button className="btn-accept">Qabul qilish</button>
                <button className="btn-reject" onClick={handleClosePopup}>Rad etish</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Dashboard

