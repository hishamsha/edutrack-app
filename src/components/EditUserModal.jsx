import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  UserCheck,
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Briefcase,
  CheckCircle,
  Trash2,
  AlertTriangle,
} from 'lucide-react';

export default function EditUserModal({ isOpen, onClose, user }) {
  const { updateUser, deleteUser, currentUser } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('field_agent');
  const [designation, setDesignation] = useState('');
  const [phone, setPhone] = useState('');
  const [zone, setZone] = useState('');
  const [avatar, setAvatar] = useState('🎒');
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setRole(user.role || 'field_agent');
      setDesignation(user.designation || 'Field Representative / Trainer');
      setPhone(user.phone || '');
      setZone(user.zone || '');
      setAvatar(user.avatar || '🚗');
      setConfirmDelete(false);
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!name || !email) return;

    updateUser(user.id, {
      name,
      email,
      role,
      designation,
      phone,
      zone,
      avatar,
    });

    onClose();
  };

  const handleDelete = () => {
    deleteUser(user.id);
    onClose();
  };

  const isCurrentActive = currentUser?.id === user.id;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UserCheck size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Edit Colleague / Trainer</h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Manage profile, territory, role & contact info</p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleUpdate} style={{ padding: '16px 20px' }}>
          {/* Avatar & Name */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: 10 }}>
            <div className="form-group">
              <label className="form-label">Avatar Emoji</label>
              <select
                className="form-select"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                style={{ fontSize: '1.2rem', textAlign: 'center' }}
              >
                <option value="👨‍💼">👨‍💼</option>
                <option value="👩‍🏫">👩‍🏫</option>
                <option value="🚗">🚗</option>
                <option value="🎒">🎒</option>
                <option value="🎯">🎯</option>
                <option value="⚡">⚡</option>
                <option value="🔬">🔬</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Email & Phone */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Company Email</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98..."
              />
            </div>
          </div>

          {/* Role & Designation */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">System Role</label>
              <select
                className="form-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="field_agent">Field Representative / Trainer</option>
                <option value="admin">Operations Admin</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Designation</label>
              <input
                type="text"
                className="form-input"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                placeholder="e.g. Senior STEM Trainer"
              />
            </div>
          </div>

          {/* Territory / Zone */}
          <div className="form-group">
            <label className="form-label">Assigned Zone / Territory</label>
            <input
              type="text"
              className="form-input"
              value={zone}
              onChange={(e) => setZone(e.target.value)}
              placeholder="e.g. North Zone (Delhi NCR)"
            />
          </div>

          {/* Delete Option (only if not current active user) */}
          {!isCurrentActive ? (
            confirmDelete ? (
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: 12, borderRadius: 10, marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#f87171', fontSize: '0.82rem', fontWeight: 700 }}>
                  <AlertTriangle size={16} /> Remove Colleague Account?
                </div>
                <p style={{ fontSize: '0.72rem', color: '#cbd5e1', margin: '4px 0 10px' }}>
                  Are you sure you want to remove <strong>{user.name}</strong> from the team list?
                </p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setConfirmDelete(false)}
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={handleDelete}
                    style={{ flex: 1 }}
                    id="btn-confirm-delete-user"
                  >
                    Yes, Remove
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'right', marginBottom: 16 }}>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  style={{ background: 'none', border: 'none', color: '#f87171', fontSize: '0.75rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                >
                  <Trash2 size={13} /> Remove this colleague
                </button>
              </div>
            )
          ) : (
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginBottom: 16, fontStyle: 'italic' }}>
              ℹ️ Currently logged in as this user. (Cannot delete active session).
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 2 }} id="btn-save-edit-user">
              <CheckCircle size={16} /> Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
