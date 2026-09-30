import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Compass,
  Users,
  Smartphone,
  Monitor,
  Wifi,
  WifiOff,
  ChevronDown,
  RotateCcw,
  Shield,
  UserCheck,
  Edit,
} from 'lucide-react';
import EditUserModal from './EditUserModal';

export default function Navbar() {
  const {
    currentUser,
    users,
    switchUser,
    isMobileFrame,
    setIsMobileFrame,
    isOnline,
    resetToDefaultData,
  } = useApp();

  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);

  return (
    <header className="app-navbar">
      <div className="brand-section">
        <div className="brand-logo-icon">
          <Compass size={22} />
        </div>
        <div>
          <div className="brand-name">EduTrack Pro</div>
          <div className="brand-sub">Field Visit & Operations</div>
        </div>
      </div>

      <div className="nav-actions">
        {/* Online / Offline status badge */}
        <div
          className={`badge ${isOnline ? 'badge-green' : 'badge-amber'}`}
          title={isOnline ? 'Connected to Cloud' : 'Offline Mode (Local Storage)'}
          style={{ display: 'none', md: 'inline-flex' }}
        >
          {isOnline ? <Wifi size={12} /> : <WifiOff size={12} />}
          <span>{isOnline ? 'Online' : 'Offline'}</span>
        </div>

        {/* Toggle Mobile Phone Frame vs Desktop Expanded Mode */}
        <button
          className="mode-toggle-btn"
          onClick={() => setIsMobileFrame(!isMobileFrame)}
          title={isMobileFrame ? 'Switch to Full-Screen View' : 'Preview in Mobile Phone Frame'}
          id="btn-toggle-device-view"
        >
          {isMobileFrame ? <Monitor size={17} /> : <Smartphone size={17} />}
        </button>

        {/* Reset Demo Data button */}
        <button
          className="mode-toggle-btn"
          onClick={resetToDefaultData}
          title="Reset to Initial Sample Data"
          id="btn-reset-demo"
        >
          <RotateCcw size={16} />
        </button>

        {/* User Profile & Role Switcher */}
        <div style={{ position: 'relative' }}>
          <button
            className="user-pill"
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            id="user-profile-menu-btn"
          >
            <div className="user-avatar-circle">
              {currentUser.role === 'admin' ? (
                <Shield size={14} />
              ) : (
                currentUser.name.charAt(0)
              )}
            </div>
            <div style={{ textAlign: 'left', lineHeight: 1.1 }}>
              <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#fff' }}>
                {currentUser.name}
              </div>
              <div style={{ fontSize: '0.65rem', color: currentUser.role === 'admin' ? '#fbbf24' : '#38bdf8' }}>
                {currentUser.role === 'admin' ? '🛡️ Admin' : '🚗 Field Staff'}
              </div>
            </div>
            <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
          </button>

          {/* User Switcher Dropdown */}
          {showUserDropdown && (
            <div className="user-menu-dropdown">
              <div className="user-menu-header">Switch Logged-in Colleague</div>
              {users.map((user) => (
                <div
                  key={user.id}
                  className={`user-option-item ${currentUser.id === user.id ? 'active' : ''}`}
                  onClick={() => {
                    switchUser(user.id);
                    setShowUserDropdown(false);
                  }}
                  id={`switch-user-${user.id}`}
                >
                  <div className="user-avatar-circle" style={{ background: user.role === 'admin' ? '#f59e0b' : '#2563eb' }}>
                    {user.avatar || user.name.charAt(0)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.84rem' }}>{user.name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                      {user.designation} • {user.zone}
                    </div>
                  </div>
                  {currentUser.id === user.id && (
                    <UserCheck size={16} color="#38bdf8" />
                  )}
                </div>
              ))}
              <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: 8, paddingTop: 8 }}>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ width: '100%', fontSize: '0.74rem', padding: '6px' }}
                  onClick={() => {
                    setUserToEdit(currentUser);
                    setShowUserDropdown(false);
                  }}
                  id="btn-edit-my-profile"
                >
                  <Edit size={13} color="#38bdf8" /> Edit Profile ({currentUser.name.split(' ')[0]})
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <EditUserModal
        isOpen={Boolean(userToEdit)}
        onClose={() => setUserToEdit(null)}
        user={userToEdit}
      />
    </header>
  );
}
