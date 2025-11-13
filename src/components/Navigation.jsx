import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { signOut } from '../services/supabase';

const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Events', path: '/events' },
  { label: 'Profile', path: '/profile' },
  { label: 'Share', path: '/share' }
];

function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar">
      <div className="container">
        <div className="navbar__inner">
          <Link to="/" className="navbar__brand">
            EventBuddy
          </Link>

          <nav className="navbar__links" aria-label="Primary navigation">
            {NAV_LINKS.map(({ label, path }) => (
              <Link
                key={path}
                to={path}
                className={`navbar__link ${isActive(path) ? 'is-active' : ''}`}
              >
                {label}
              </Link>
            ))}
            <button
              type="button"
              onClick={handleSignOut}
              className="button button--ghost navbar__signout"
            >
              Sign Out
            </button>
          </nav>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="navbar__toggle"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              {mobileMenuOpen ? (
                <path
                  d="M15.5 5.5L4.5 14.5M4.5 5.5L15.5 14.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M3.5 5h13M3.5 10h13M3.5 15h13"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="navbar__mobile" aria-label="Mobile navigation">
            <div className="navbar__mobile-menu">
              {NAV_LINKS.map(({ label, path }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`navbar__mobile-link ${isActive(path) ? 'is-active' : ''}`}
                >
                  <span>{label}</span>
                  <span aria-hidden="true">→</span>
                </Link>
              ))}
              <button
                type="button"
                onClick={() => {
                  handleSignOut();
                  setMobileMenuOpen(false);
                }}
                className="button button--ghost navbar__signout"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navigation;
