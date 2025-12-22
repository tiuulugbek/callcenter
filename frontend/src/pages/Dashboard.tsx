import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { wsService } from '../services/websocket'
import Phone from '../components/Phone'
import { api } from '../services/api'
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
    // SIP sozlamalarini yuklash
    const loadSipConfig = async () => {
      try {
        // Operator ma'lumotlarini olish (hozirgi foydalanuvchi)
        const token = localStorage.getItem('token')
        if (!token) return

        // Settings dan SIP extension ma'lumotlarini olish
        const response = await api.get('/settings/sip-extensions')
        if (response.data && response.data.length > 0) {
          const extension = response.data[0]
          // Password ni localStorage dan olish yoki so'ralishi kerak
          const storedPassword = localStorage.getItem('sip_password')
          if (extension.extension && storedPassword) {
            setSipConfig({
              server: '152.53.229.176', // Kerio Control server
              username: extension.extension,
              password: storedPassword,
              domain: '152.53.229.176',
            })
          }
        }
      } catch (error) {
        console.error('SIP config yuklashda xatolik:', error)
      }
    }

    loadSipConfig()

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
        
        {sipConfig && (
          <div className="phone-section">
            <h2>Telefon</h2>
            <Phone config={sipConfig} />
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

