import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { callsApi } from '../services/api'
import { format } from 'date-fns'
import './Calls.css'

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
}

const Calls = () => {
  const [calls, setCalls] = useState<Call[]>([])
  const [loading, setLoading] = useState(true)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  useEffect(() => {
    loadCalls()
  }, [startDate, endDate])

  const loadCalls = async () => {
    try {
      setLoading(true)
      const data = await callsApi.getAll({ startDate, endDate })
      // Array tekshiruvi
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

  const handlePlayRecording = async (callId: string) => {
    try {
      const blob = await callsApi.getRecording(callId)
      const url = window.URL.createObjectURL(blob)
      const audio = new Audio(url)
      audio.play()
    } catch (error) {
      alert('Yozuvni yuklab bo\'lmadi')
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      yakunlandi: 'Yakunlandi',
      javobsiz: 'Javobsiz',
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
        <h1>Qo'ng'iroqlar</h1>

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
          <button onClick={loadCalls}>Qidirish</button>
        </div>

        {loading ? (
          <div>Yuklanmoqda...</div>
        ) : (
          <div className="calls-table">
            <table>
              <thead>
                <tr>
                  <th>Yo'nalish</th>
                  <th>Qayerdan</th>
                  <th>Qayerga</th>
                  <th>Boshlanish vaqti</th>
                  <th>Davomiyligi</th>
                  <th>Holat</th>
                  <th>Yozuv</th>
                </tr>
              </thead>
              <tbody>
                {calls.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center' }}>
                      Qo'ng'iroqlar topilmadi
                    </td>
                  </tr>
                ) : (
                  calls.map((call) => (
                    <tr key={call.id}>
                      <td>{getDirectionLabel(call.direction)}</td>
                      <td>{call.fromNumber}</td>
                      <td>{call.toNumber}</td>
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
                            onClick={() => handlePlayRecording(call.id)}
                          >
                            Eshitish
                          </button>
                        ) : (
                          <span>-</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Calls

