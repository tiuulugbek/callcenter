import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { contactsApi } from '../services/api'
import { format } from 'date-fns'
import './Contacts.css'

interface Contact {
  id: string
  name: string
  phone: string | null
  email: string | null
  company: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
  _count?: {
    calls: number
    chats: number
  }
}

const Contacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    notes: '',
  })

  useEffect(() => {
    loadContacts()
  }, [search])

  const loadContacts = async () => {
    try {
      setLoading(true)
      const data = await contactsApi.getAll(search || undefined)
      setContacts(data)
    } catch (error) {
      console.error('Error loading contacts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingContact(null)
    setFormData({
      name: '',
      phone: '',
      email: '',
      company: '',
      notes: '',
    })
    setShowModal(true)
  }

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact)
    setFormData({
      name: contact.name,
      phone: contact.phone || '',
      email: contact.email || '',
      company: contact.company || '',
      notes: contact.notes || '',
    })
    setShowModal(true)
  }

  const handleSave = async () => {
    try {
      if (editingContact) {
        await contactsApi.update(editingContact.id, formData)
      } else {
        await contactsApi.create(formData)
      }
      setShowModal(false)
      loadContacts()
    } catch (error) {
      console.error('Error saving contact:', error)
      alert('Xatolik yuz berdi')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Mijozni o\'chirishni tasdiqlaysizmi?')) {
      return
    }
    try {
      await contactsApi.delete(id)
      loadContacts()
    } catch (error) {
      console.error('Error deleting contact:', error)
      alert('Xatolik yuz berdi')
    }
  }

  return (
    <Layout>
      <div className="contacts-page">
        <div className="page-header">
          <h1>Mijozlar</h1>
          <button onClick={handleCreate} className="btn-primary">
            + Yangi Mijoz
          </button>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Qidirish (ism, telefon, email, kompaniya)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="loading">Yuklanmoqda...</div>
        ) : (
          <div className="contacts-list">
            {contacts.length === 0 ? (
              <div className="empty-state">Mijozlar topilmadi</div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Ism</th>
                    <th>Telefon</th>
                    <th>Email</th>
                    <th>Kompaniya</th>
                    <th>Qo'ng'iroqlar</th>
                    <th>Chatlar</th>
                    <th>Oxirgi yangilanish</th>
                    <th>Amallar</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((contact) => (
                    <tr key={contact.id}>
                      <td>{contact.name}</td>
                      <td>{contact.phone || '-'}</td>
                      <td>{contact.email || '-'}</td>
                      <td>{contact.company || '-'}</td>
                      <td>{contact._count?.calls || 0}</td>
                      <td>{contact._count?.chats || 0}</td>
                      <td>
                        {format(new Date(contact.updatedAt), 'dd.MM.yyyy HH:mm')}
                      </td>
                      <td>
                        <button
                          onClick={() => handleEdit(contact)}
                          className="btn-edit"
                        >
                          Tahrirlash
                        </button>
                        <button
                          onClick={() => handleDelete(contact.id)}
                          className="btn-delete"
                        >
                          O'chirish
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>{editingContact ? 'Mijozni Tahrirlash' : 'Yangi Mijoz'}</h2>
              <div className="form-group">
                <label>Ism *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Telefon</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Kompaniya</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Eslatmalar</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="modal-actions">
                <button onClick={() => setShowModal(false)} className="btn-cancel">
                  Bekor qilish
                </button>
                <button onClick={handleSave} className="btn-primary">
                  Saqlash
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Contacts

