import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { AuthSession } from '../services/auth';
import logo from '../assets/logo.png';

type NavbarProps = {
  authSession: AuthSession | null
  onLogout: () => void
}

const getBreadcrumb = (pathname: string) => {
  if (pathname === '/') {
    return ['Dashboard']
  }

  if (pathname.startsWith('/profile')) {
    return ['Dashboard', 'My Profile']
  }

  if (pathname.startsWith('/applicant')) {
    return ['Dashboard', 'Applicant Info']
  }

  if (pathname.startsWith('/editor')) {
    return ['Dashboard', 'Applicant Info', 'Editor']
  }

  return ['Dashboard']
}

const Navbar = ({ authSession, onLogout }: NavbarProps) => {
  const location = useLocation()
  const breadcrumb = getBreadcrumb(location.pathname)

  const getInitials = () => {
    if (!authSession) return ''
    if (authSession.user.name) {
      return authSession.user.name.charAt(0).toUpperCase()
    }
    return authSession.user.email.charAt(0).toUpperCase()
  }

  const displayName = authSession?.user.name || authSession?.user.email.split('@')[0]

  return (
    <nav className="global-navbar">
      <div className="navbar-brand">
        <Link to="/" className="brand-link">
          <img src={logo} alt="Applyr Logo" className="logo" />
        </Link>
      </div>

      <div className="navbar-middle">
        <div className="navbar-links" aria-label="Primary">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
            Dashboard
          </Link>
          <Link to="/profile" className={`nav-link ${location.pathname.startsWith('/profile') ? 'active' : ''}`}>
            My Profile
          </Link>
          <Link to="/applicant" className={`nav-link ${location.pathname.startsWith('/applicant') || location.pathname.startsWith('/editor') ? 'active' : ''}`}>
            Applicant Info
          </Link>
        </div>
        {/* <p className="navbar-breadcrumb" aria-live="polite">
          {breadcrumb.join(' / ')}
        </p> */}
      </div>

      <div className="navbar-actions">
        {authSession ? (
          <div className="navbar-account">
            <div className="profile-chip" aria-hidden="true">
              {getInitials()}
            </div>
            <div className="account-meta">
              <p className="account-name">{displayName}</p>
              <p className="account-email">{authSession.user.email}</p>
            </div>
            <button type="button" className="logout-button" onClick={onLogout}>
              Log out
            </button>
          </div>
        ) : (
          <div className="navbar-auth-links">
            <span className="navbar-greeting">Welcome</span>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar