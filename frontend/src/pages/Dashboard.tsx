import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { wsService } from '../services/websocket'
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

  useEffect(() => {
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

