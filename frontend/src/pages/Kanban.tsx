import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import {
  pipelinesApi,
  dealsApi,
  contactsApi,
  operatorsApi,
  Pipeline,
  Stage,
  Deal,
} from '../services/api'
import './Kanban.css'

interface ContactItem {
  id: string
  name: string
  phone: string
  company?: string
}

interface OperatorItem {
  id: string
  name: string
  extension?: string
}

const Kanban: React.FC = () => {
  const [pipelines, setPipelines] = useState<Pipeline[]>([])
  const [activePipelineId, setActivePipelineId] = useState<string>('')
  const [currentPipeline, setCurrentPipeline] = useState<Pipeline | null>(null)
  const [contacts, setContacts] = useState<ContactItem[]>([])
  const [operators, setOperators] = useState<OperatorItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [searchFilter, setSearchFilter] = useState<string>('')

  // Drag & drop state
  const [draggedDealId, setDraggedDealId] = useState<string | null>(null)
  const [dragOverStageId, setDragOverStageId] = useState<string | null>(null)

  // Pipeline modal
  const [showPipelineModal, setShowPipelineModal] = useState<boolean>(false)
  const [pipelineForm, setPipelineForm] = useState({ name: '', description: '' })

  // Deal modal
  const [showDealModal, setShowDealModal] = useState<boolean>(false)
  const [editingDealId, setEditingDealId] = useState<string | null>(null)
  const [dealForm, setDealForm] = useState({
    title: '',
    amount: 0,
    stageId: '',
    contactId: '',
    operatorId: '',
    notes: '',
  })

  // Stage modal
  const [showStageModal, setShowStageModal] = useState<boolean>(false)
  const [stageForm, setStageForm] = useState({
    name: '',
    color: '#3b82f6',
  })

  // Initial load
  useEffect(() => {
    loadPipelines()
    loadContactsAndOperators()
  }, [])

  const loadContactsAndOperators = async () => {
    try {
      const [contactsData, operatorsData] = await Promise.all([
        contactsApi.getAll(),
        operatorsApi.getAll(),
      ])
      setContacts(contactsData)
      setOperators(operatorsData)
    } catch (err) {
      console.error('Mijozlar yoki operatorlarni yuklashda xatolik:', err)
    }
  }

  const loadPipelines = async (selectId?: string) => {
    try {
      setLoading(true)
      const data = await pipelinesApi.getAll()
      setPipelines(data)

      if (data.length > 0) {
        const targetId = selectId || activePipelineId || data[0].id
        setActivePipelineId(targetId)
        await loadPipelineDetails(targetId)
      } else {
        setCurrentPipeline(null)
      }
    } catch (err) {
      console.error('Voronkalarni yuklashda xatolik:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadPipelineDetails = async (id: string) => {
    try {
      const details = await pipelinesApi.getById(id)
      setCurrentPipeline(details)
    } catch (err) {
      console.error('Voronka tafsilotlarini yuklashda xatolik:', err)
    }
  }

  const handlePipelineChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value
    setActivePipelineId(id)
    loadPipelineDetails(id)
  }

  // Pipeline Create
  const handleCreatePipeline = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!pipelineForm.name.trim()) return

    try {
      const created = await pipelinesApi.create(pipelineForm)
      setPipelineForm({ name: '', description: '' })
      setShowPipelineModal(false)
      await loadPipelines(created.id)
    } catch (err) {
      alert('Voronka yaratishda xatolik yuz berdi')
    }
  }

  // Pipeline Delete
  const handleDeletePipeline = async () => {
    if (!currentPipeline) return
    if (pipelines.length <= 1) {
      alert('Oxirgi voronkani o\'chirib bo\'lmaydi!')
      return
    }
    if (!window.confirm(`"${currentPipeline.name}" voronkasini o'chirishga ishonchingiz komilmi?`)) {
      return
    }

    try {
      await pipelinesApi.delete(currentPipeline.id)
      await loadPipelines()
    } catch (err) {
      alert('Voronkani o\'chirishda xatolik yuz berdi')
    }
  }

  // Stage Create
  const handleCreateStage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stageForm.name.trim() || !activePipelineId) return

    try {
      await pipelinesApi.addStage(activePipelineId, stageForm)
      setStageForm({ name: '', color: '#3b82f6' })
      setShowStageModal(false)
      await loadPipelineDetails(activePipelineId)
    } catch (err) {
      alert('Bosqich qo\'shishda xatolik yuz berdi')
    }
  }

  // Stage Delete
  const handleDeleteStage = async (stageId: string, stageName: string) => {
    if (!window.confirm(`"${stageName}" bosqichini o'chirmoqchimisiz? Undagi barcha bitimlar ham o'chiriladi.`)) {
      return
    }

    try {
      await pipelinesApi.deleteStage(stageId)
      await loadPipelineDetails(activePipelineId)
    } catch (err) {
      alert('Bosqichni o\'chirishda xatolik yuz berdi')
    }
  }

  // Open deal modal for new
  const handleOpenNewDeal = (stageId?: string) => {
    const defaultStageId = stageId || currentPipeline?.stages[0]?.id || ''
    setEditingDealId(null)
    setDealForm({
      title: '',
      amount: 0,
      stageId: defaultStageId,
      contactId: '',
      operatorId: '',
      notes: '',
    })
    setShowDealModal(true)
  }

  // Open deal modal for edit
  const handleOpenEditDeal = (deal: Deal) => {
    setEditingDealId(deal.id)
    setDealForm({
      title: deal.title,
      amount: deal.amount || 0,
      stageId: deal.stageId,
      contactId: deal.contactId || '',
      operatorId: deal.operatorId || '',
      notes: deal.notes || '',
    })
    setShowDealModal(true)
  }

  // Deal Save (Create / Update)
  const handleSaveDeal = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!dealForm.title.trim() || !dealForm.stageId) {
      alert('Bitim nomi va bosqichini tanlang')
      return
    }

    try {
      if (editingDealId) {
        await dealsApi.update(editingDealId, {
          title: dealForm.title,
          amount: Number(dealForm.amount),
          stageId: dealForm.stageId,
          contactId: dealForm.contactId || null,
          operatorId: dealForm.operatorId || null,
          notes: dealForm.notes || null,
        })
      } else {
        await dealsApi.create({
          title: dealForm.title,
          amount: Number(dealForm.amount),
          pipelineId: activePipelineId,
          stageId: dealForm.stageId,
          contactId: dealForm.contactId || undefined,
          operatorId: dealForm.operatorId || undefined,
          notes: dealForm.notes || undefined,
        })
      }

      setShowDealModal(false)
      await loadPipelineDetails(activePipelineId)
    } catch (err) {
      alert('Bitimni saqlashda xatolik yuz berdi')
    }
  }

  // Deal Delete
  const handleDeleteDeal = async (dealId: string) => {
    if (!window.confirm('Bu bitimni o\'chirishga ishonchingiz komilmi?')) return

    try {
      await dealsApi.delete(dealId)
      await loadPipelineDetails(activePipelineId)
    } catch (err) {
      alert('Bitimni o\'chirishda xatolik yuz berdi')
    }
  }

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, dealId: string) => {
    e.dataTransfer.setData('text/plain', dealId)
    setDraggedDealId(dealId)
  }

  const handleDragOver = (e: React.DragEvent, stageId: string) => {
    e.preventDefault()
    if (dragOverStageId !== stageId) {
      setDragOverStageId(stageId)
    }
  }

  const handleDragLeave = () => {
    setDragOverStageId(null)
  }

  const handleDrop = async (e: React.DragEvent, targetStageId: string) => {
    e.preventDefault()
    const dealId = e.dataTransfer.getData('text/plain') || draggedDealId
    setDragOverStageId(null)
    setDraggedDealId(null)

    if (!dealId || !currentPipeline) return

    // Find the deal to verify stage changed
    let currentDeal: Deal | undefined
    for (const stage of currentPipeline.stages) {
      const found = stage.deals?.find((d: Deal) => d.id === dealId)
      if (found) {
        currentDeal = found
        break
      }
    }

    if (!currentDeal || currentDeal.stageId === targetStageId) {
      return
    }

    // Optimistic UI update
    const updatedStages = currentPipeline.stages.map((stage: Stage) => {
      if (stage.id === currentDeal?.stageId) {
        return {
          ...stage,
          deals: stage.deals?.filter((d: Deal) => d.id !== dealId) || [],
        }
      }
      if (stage.id === targetStageId) {
        const movedDeal = { ...currentDeal!, stageId: targetStageId }
        return {
          ...stage,
          deals: [movedDeal, ...(stage.deals || [])],
        }
      }
      return stage
    })

    setCurrentPipeline({ ...currentPipeline, stages: updatedStages })

    // Call API
    try {
      await dealsApi.updateStage(dealId, targetStageId)
    } catch (err) {
      console.error('Bosqichni yangilashda xatolik:', err)
      // Revert if error
      await loadPipelineDetails(activePipelineId)
    }
  }

  // Format currency
  const formatMoney = (val: number) => {
    return new Intl.NumberFormat('uz-UZ').format(val || 0) + ' so\'m'
  }

  // Total pipeline calculations
  const totalPipelineSum = currentPipeline?.stages.reduce((acc: number, st: Stage) => {
    const stageSum = st.deals?.reduce((dAcc: number, d: Deal) => dAcc + (d.amount || 0), 0) || 0
    return acc + stageSum
  }, 0) || 0

  const totalPipelineDealsCount = currentPipeline?.stages.reduce((acc: number, st: Stage) => {
    return acc + (st.deals?.length || 0)
  }, 0) || 0

  // Filter deals based on search
  const filterDeals = (deals: Deal[] = []) => {
    if (!searchFilter.trim()) return deals
    const q = searchFilter.toLowerCase()
    return deals.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.contact?.name?.toLowerCase().includes(q) ||
        d.contact?.phone?.includes(q),
    )
  }

  return (
    <Layout>
      <div className="kanban-page">
        {/* Header */}
        <div className="kanban-header">
          <div className="kanban-header-left">
            <h1 className="kanban-title">Bitimlar</h1>

            {/* Pipeline Selector */}
            <div className="pipeline-selector-group">
              <select
                className="pipeline-select"
                value={activePipelineId}
                onChange={handlePipelineChange}
                disabled={loading || pipelines.length === 0}
              >
                {pipelines.map((p) => (
                  <option key={p.id} value={p.id}>
                    📊 {p.name}
                  </option>
                ))}
              </select>

              <button
                className="btn-secondary"
                onClick={() => setShowPipelineModal(true)}
                title="Yangi voronka qo'shish"
              >
                + Yangi voronka
              </button>

              {currentPipeline && (
                <button
                  className="btn-danger"
                  onClick={handleDeletePipeline}
                  title="Ushbu voronkani o'chirish"
                >
                  O'chirish
                </button>
              )}
            </div>

            {/* Pipeline Stats */}
            <div className="pipeline-stats">
              <span className="stat-item">
                Bitimlar: <strong>{totalPipelineDealsCount} ta</strong>
              </span>
              <span>•</span>
              <span className="stat-item">
                Jami summa: <strong>{formatMoney(totalPipelineSum)}</strong>
              </span>
            </div>
          </div>

          <div className="kanban-header-actions">
            <input
              type="text"
              className="kanban-search"
              placeholder="Qidirish (nomi, mijoz)..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
            />

            <button
              className="btn-primary"
              onClick={() => handleOpenNewDeal()}
              disabled={!currentPipeline || currentPipeline.stages.length === 0}
            >
              + Bitim qo'shish
            </button>
          </div>
        </div>

        {/* Board */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
            Yuklanmoqda...
          </div>
        ) : !currentPipeline ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
            Hozircha hech qanday voronka mavjud emas. Yangi voronka yarating.
          </div>
        ) : (
          <div className="kanban-board-container">
            {currentPipeline.stages.map((stage: Stage) => {
              const stageDeals = filterDeals(stage.deals)
              const stageSum = stage.deals?.reduce((acc: number, d: Deal) => acc + (d.amount || 0), 0) || 0

              return (
                <div
                  key={stage.id}
                  className={`kanban-column ${dragOverStageId === stage.id ? 'drag-over' : ''}`}
                  onDragOver={(e) => handleDragOver(e, stage.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, stage.id)}
                >
                  {/* Column Header */}
                  <div className="column-header" style={{ borderTopColor: stage.color || '#3b82f6' }}>
                    <div className="column-title-row">
                      <div className="column-title">
                        <span>{stage.name}</span>
                        <span className="deal-count-badge">{stageDeals.length}</span>
                      </div>
                      <button
                        className="deal-btn-icon delete"
                        onClick={() => handleDeleteStage(stage.id, stage.name)}
                        title="Bosqichni o'chirish"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="column-total-sum">{formatMoney(stageSum)}</div>
                    <button
                      className="column-quick-add"
                      onClick={() => handleOpenNewDeal(stage.id)}
                    >
                      + Bitim
                    </button>
                  </div>

                  {/* Deals Cards */}
                  <div className="column-cards">
                    {stageDeals.length === 0 ? (
                      <div className="empty-deals">Bu bosqichda bitimlar yo'q</div>
                    ) : (
                      stageDeals.map((deal) => (
                        <div
                          key={deal.id}
                          className={`deal-card ${draggedDealId === deal.id ? 'is-dragging' : ''}`}
                          draggable
                          onDragStart={(e) => handleDragStart(e, deal.id)}
                        >
                          <div className="deal-card-header">
                            <span className="deal-title">{deal.title}</span>
                            <div className="deal-actions">
                              <button
                                className="deal-btn-icon"
                                onClick={() => handleOpenEditDeal(deal)}
                                title="Tahrirlash"
                              >
                                ✏️
                              </button>
                              <button
                                className="deal-btn-icon delete"
                                onClick={() => handleDeleteDeal(deal.id)}
                                title="O'chirish"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>

                          <div className="deal-amount">{formatMoney(deal.amount)}</div>

                          {deal.contact && (
                            <div className="deal-contact">
                              <span className="deal-contact-icon">👤</span>
                              <div>
                                <div>{deal.contact.name}</div>
                                {deal.contact.phone && (
                                  <div className="deal-contact-phone">{deal.contact.phone}</div>
                                )}
                              </div>
                            </div>
                          )}

                          {deal.notes && <div className="deal-notes">{deal.notes}</div>}

                          <div className="deal-card-footer">
                            <span>
                              {new Date(deal.createdAt).toLocaleDateString('uz-UZ', {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                            {deal.operator && (
                              <span className="deal-operator-badge">
                                🎧 {deal.operator.name}
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )
            })}

            {/* Add Stage Column */}
            <div className="add-stage-column">
              <button
                className="btn-add-stage"
                onClick={() => setShowStageModal(true)}
              >
                + Yangi bosqich
              </button>
            </div>
          </div>
        )}

        {/* Modal: New Pipeline */}
        {showPipelineModal && (
          <div className="modal-overlay" onClick={() => setShowPipelineModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Yangi voronka yaratish</h2>
                <button
                  className="modal-close-btn"
                  onClick={() => setShowPipelineModal(false)}
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleCreatePipeline}>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Voronka nomi *</label>
                    <input
                      type="text"
                      required
                      placeholder="Masalan: B2B Savdo yoki VIP mijozlar"
                      value={pipelineForm.name}
                      onChange={(e) =>
                        setPipelineForm({ ...pipelineForm, name: e.target.value })
                      }
                      autoFocus
                    />
                  </div>
                  <div className="form-group">
                    <label>Tavsif (ixtiyoriy)</label>
                    <textarea
                      rows={3}
                      placeholder="Ushbu voronka maqsadi..."
                      value={pipelineForm.description}
                      onChange={(e) =>
                        setPipelineForm({ ...pipelineForm, description: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setShowPipelineModal(false)}
                  >
                    Bekor qilish
                  </button>
                  <button type="submit" className="btn-primary">
                    Yaratish
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Add Stage */}
        {showStageModal && (
          <div className="modal-overlay" onClick={() => setShowStageModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Yangi bosqich qo'shish</h2>
                <button
                  className="modal-close-btn"
                  onClick={() => setShowStageModal(false)}
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleCreateStage}>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Bosqich nomi *</label>
                    <input
                      type="text"
                      required
                      placeholder="Masalan: Qayta qo'ng'iroq"
                      value={stageForm.name}
                      onChange={(e) =>
                        setStageForm({ ...stageForm, name: e.target.value })
                      }
                      autoFocus
                    />
                  </div>
                  <div className="form-group">
                    <label>Rangi</label>
                    <input
                      type="color"
                      value={stageForm.color}
                      onChange={(e) =>
                        setStageForm({ ...stageForm, color: e.target.value })
                      }
                      style={{ height: '42px', padding: '2px', cursor: 'pointer' }}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setShowStageModal(false)}
                  >
                    Bekor qilish
                  </button>
                  <button type="submit" className="btn-primary">
                    Qo'shish
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: New / Edit Deal */}
        {showDealModal && (
          <div className="modal-overlay" onClick={() => setShowDealModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingDealId ? 'Bitimni tahrirlash' : 'Yangi bitim yaratish'}</h2>
                <button
                  className="modal-close-btn"
                  onClick={() => setShowDealModal(false)}
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleSaveDeal}>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Bitim nomi *</label>
                    <input
                      type="text"
                      required
                      placeholder="Masalan: Korporativ paket sotuvi"
                      value={dealForm.title}
                      onChange={(e) =>
                        setDealForm({ ...dealForm, title: e.target.value })
                      }
                      autoFocus
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Summa (so'mda)</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={dealForm.amount}
                        onChange={(e) =>
                          setDealForm({ ...dealForm, amount: Number(e.target.value) })
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label>Bosqich *</label>
                      <select
                        required
                        value={dealForm.stageId}
                        onChange={(e) =>
                          setDealForm({ ...dealForm, stageId: e.target.value })
                        }
                      >
                        {currentPipeline?.stages.map((st: Stage) => (
                          <option key={st.id} value={st.id}>
                            {st.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Mijoz</label>
                      <select
                        value={dealForm.contactId}
                        onChange={(e) =>
                          setDealForm({ ...dealForm, contactId: e.target.value })
                        }
                      >
                        <option value="">-- Mijoz tanlanmagan --</option>
                        {contacts.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name} {c.phone ? `(${c.phone})` : ''}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Mas'ul operator</label>
                      <select
                        value={dealForm.operatorId}
                        onChange={(e) =>
                          setDealForm({ ...dealForm, operatorId: e.target.value })
                        }
                      >
                        <option value="">-- Avtomatik (joriy operator) --</option>
                        {operators.map((op) => (
                          <option key={op.id} value={op.id}>
                            {op.name} {op.extension ? `(Ichki: ${op.extension})` : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Izoh / Eslatma</label>
                    <textarea
                      rows={3}
                      placeholder="Mijoz talablari, suhbat natijasi..."
                      value={dealForm.notes}
                      onChange={(e) =>
                        setDealForm({ ...dealForm, notes: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setShowDealModal(false)}
                  >
                    Bekor qilish
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingDealId ? 'Saqlash' : 'Yaratish'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Kanban
