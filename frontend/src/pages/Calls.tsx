import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { callsApi } from '../services/api'
import { format } from 'date-fns'
import './Calls.css'

interface Contact {
  id: string
  name: string
  phone: string | null
  company: string | null
}

interface Call {
  id: string
  direction: string
  fromNumber: string
  toNumber: string
  startTime: string
  endTime: string | null
  duration: number
  status: string
  recordingPath: string | null
  contact?: Contact | null
  operator?: {
    id: string
    name: string
    extension: string
  } | null
}

const Calls = () => {
  const [calls, setCalls] = useState<Call[]>([])
  const [loading, setLoading] = useState(true)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [activeAudio, setActiveAudio] = useState<{ url: string; title: string } | null>(null)

  useEffect(() => {
    loadCalls()
  }, [startDate, endDate])

  const loadCalls = async () => {
    try {
      setLoading(true)
      const data = await callsApi.getAll({ startDate, endDate })
      if (data && Array.isArray(data)) {
        setCalls(data)
      } else {
        setCalls([])
      }
    } catch (error) {
      console.error('Error loading calls:', error)
      setCalls([])
    } finally {
      setLoading(false)
    }
  }

  const handlePlayRecording = async (call: Call) => {
    try {
      const blob = await callsApi.getRecording(call.id)
      const url = window.URL.createObjectURL(blob)
      setActiveAudio({
        url,
        title: `${call.contact?.name ? call.contact.name + ' - ' : ''}${call.fromNumber} ➔ ${call.toNumber} (${format(new Date(call.startTime), 'dd.MM.yyyy HH:mm')})`
      })
    } catch (error) {
      alert('Yozuvni yuklab bo\'lmadi')
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      yakunlandi: 'Yakunlandi',
      javobsiz: 'Javobsiz',
      suhbatda: 'Suhbatda',
      kelyapti: 'Kelyapti',
    }
    return labels[status] || status
  }

  const getDirectionLabel = (direction: string) => {
    const labels: Record<string, string> = {
      kiruvchi: 'Kiruvchi',
      chiquvchi: 'Chiquvchi',
    }
    return labels[direction] || direction
  }

  return (
    <Layout>
      <div className="calls-page">
        <h1>Qo'ng'iroqlar tarixi</h1>

        <div className="filters">
          <div className="filter-group">
            <label>Boshlanish sanasi</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label>Tugash sanasi</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <button onClick={loadCalls}>Filtrlash</button>
        </div>

        {loading ? (
          <div>Yuklanmoqda...</div>
        ) : (
          <div className="calls-table">
            <table>
              <thead>
                <tr>
                  <th>Yo'nalish</th>
                  <th>Mijoz (CRM)</th>
                  <th>Kimdan</th>
                  <th>Kimga</th>
                  <th>Operator</th>
                  <th>Boshlanish vaqti</th>
                  <th>Davomiyligi</th>
                  <th>Holat</th>
                  <th>Audio Yozuv</th>
                </tr>
              </thead>
              <tbody>
                {calls.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: 'center', padding: '2rem' }}>
                      Qo'ng'iroqlar topilmadi
                    </td>
                  </tr>
                ) : (
                  calls.map((call) => (
                    <tr key={call.id}>
                      <td>
                        <span className={`direction-badge direction-${call.direction}`}>
                          {getDirectionLabel(call.direction)}
                        </span>
                      </td>
                      <td>
                        {call.contact ? (
                          <div>
                            <div style={{ fontWeight: 600, color: '#1e293b' }}>
                              {call.contact.name}
                            </div>
                            {call.contact.company && (
                              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                {call.contact.company}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span style={{ color: '#94a3b8' }}>-</span>
                        )}
                      </td>
                      <td>{call.fromNumber}</td>
                      <td>{call.toNumber}</td>
                      <td>
                        {call.operator ? (
                          <span>{call.operator.name} ({call.operator.extension})</span>
                        ) : (
                          <span style={{ color: '#94a3b8' }}>-</span>
                        )}
                      </td>
                      <td>{format(new Date(call.startTime), 'dd.MM.yyyy HH:mm')}</td>
                      <td>{call.duration} sek</td>
                      <td>
                        <span className={`status-badge status-${call.status}`}>
                          {getStatusLabel(call.status)}
                        </span>
                      </td>
                      <td>
                        {call.recordingPath ? (
                          <button
                            className="btn-play"
                            onClick={() => handlePlayRecording(call)}
                          >
                            ▶ Eshitish
                          </button>
                        ) : (
                          <span style={{ color: '#94a3b8' }}>-</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Audio Player Bar */}
        {activeAudio && (
          <div className="audio-player-modal">
            <div className="audio-player-card">
              <div className="audio-player-header">
                <span className="audio-player-title">🎵 {activeAudio.title}</span>
                <button
                  className="btn-close-audio"
                  onClick={() => setActiveAudio(null)}
                >
                  ✕
                </button>
              </div>
              <audio controls autoPlay src={activeAudio.url} style={{ width: '100%', marginTop: '0.5rem' }}>
                Brauzeringiz audio elementini qo'llab-quvvatlamaydi.
              </audio>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Calls
