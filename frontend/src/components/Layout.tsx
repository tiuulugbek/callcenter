import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './Layout.css'

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth()
  const location = useLocation()

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="navbar-brand">Call Center</div>
        <div className="navbar-menu">
          <Link
            to="/dashboard"
            className={location.pathname === '/dashboard' ? 'active' : ''}
          >
            Dashboard
          </Link>
          <Link
            to="/calls"
            className={location.pathname === '/calls' ? 'active' : ''}
          >
            Qo'ng'iroqlar
          </Link>
          <Link
            to="/chats"
            className={location.pathname === '/chats' ? 'active' : ''}
          >
            Chatlar
          </Link>
          <Link
            to="/settings"
            className={location.pathname === '/settings' ? 'active' : ''}
          >
            Sozlamalar
          </Link>
        </div>
        <div className="navbar-user">
          <span>{user?.name}</span>
          <button onClick={logout}>Chiqish</button>
        </div>
      </nav>
      <main className="main-content">{children}</main>
    </div>
  )
}

export default Layout

