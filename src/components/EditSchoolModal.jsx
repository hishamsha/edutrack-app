import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Edit,
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  User,
  CheckCircle,
  Trash2,
  Navigation,
  AlertTriangle,
} from 'lucide-react';

export default function EditSchoolModal({ isOpen, onClose, school }) {
  const { updateSchool, deleteSchool } = useApp();

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [board, setBoard] = useState('CBSE');
  const [category, setCategory] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [principalName, setPrincipalName] = useState('');
  const [principalPhone, setPrincipalPhone] = useState('');
  const [coordinatorName, setCoordinatorName] = useState('');
  const [coordinatorPhone, setCoordinatorPhone] = useState('');
  const [email, setEmail] = useState('');
  const [lat, setLat] = useState(28.4595);
  const [lng, setLng] = useState(77.0266);
  const [studentStrength, setStudentStrength] = useState(1200);
  const [detectingGps, setDetectingGps] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Sync state whenever selected school changes
  useEffect(() => {
    if (school) {
      setName(school.name || '');
      setCode(school.code || '');
      setBoard(school.board || 'CBSE');
      setCategory(school.category || 'Private Senior Secondary');
      setAddress(school.address || '');
      setCity(school.city || '');
      setState(school.state || '');
      setPrincipalName(school.principalName || '');
      setPrincipalPhone(school.principalPhone || '');
      setCoordinatorName(school.coordinatorName || '');
      setCoordinatorPhone(school.coordinatorPhone || '');
      setEmail(school.email || '');
      setLat(school.lat || 28.4595);
      setLng(school.lng || 77.0266);
      setStudentStrength(school.studentStrength || 1200);
      setConfirmDelete(false);
    }
  }, [school]);

  if (!isOpen || !school) return null;

  const handleDetectGPS = () => {
    setDetectingGps(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(Number(pos.coords.latitude.toFixed(5)));
          setLng(Number(pos.coords.longitude.toFixed(5)));
          setDetectingGps(false);
        },
        () => setDetectingGps(false)
      );
    } else {
      setDetectingGps(false);
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!name || !city) return;

    updateSchool(school.id, {
      name,
      code,
      board,
      category,
      address,
      city,
      state,
      principalName,
      principalPhone,
      coordinatorName,
      coordinatorPhone,
      email,
      lat: Number(lat),
      lng: Number(lng),
      studentStrength: Number(studentStrength),
    });

    onClose();
  };

  const handleDelete = () => {
    deleteSchool(school.id);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Edit size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Edit School Profile</h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Update campus info, GPS, and contacts</p>
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
          {/* School Name & Code */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 10 }}>
            <div className="form-group">
              <label className="form-label">School Name</label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">School Code</label>
              <input
                type="text"
                className="form-input"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="IVM-1029"
              />
            </div>
          </div>

          {/* Board & Category */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Affiliation Board</label>
              <select className="form-select" value={board} onChange={(e) => setBoard(e.target.value)}>
                <option value="CBSE">CBSE</option>
                <option value="ICSE">ICSE</option>
                <option value="State Board">State Board</option>
                <option value="IB / Cambridge">IB / Cambridge</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <input
                type="text"
                className="form-input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Private Senior Secondary"
              />
            </div>
          </div>

          {/* Address & City */}
          <div className="form-group">
            <label className="form-label">Campus Address</label>
            <textarea
              className="form-textarea"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={2}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">City</label>
              <input
                type="text"
                className="form-input"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">State</label>
              <input
                type="text"
                className="form-input"
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
            </div>
          </div>

          {/* GPS Coordinates */}
          <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: 12, borderRadius: 10, border: '1px solid var(--border-subtle)', marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#38bdf8' }}>GPS Geofence Location</span>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleDetectGPS}
                style={{ fontSize: '0.7rem', padding: '3px 8px' }}
              >
                <Navigation size={12} /> {detectingGps ? 'Detecting...' : 'Auto-Capture My GPS'}
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>Latitude</label>
                <input
                  type="number"
                  step="0.0001"
                  className="form-input"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>Longitude</label>
                <input
                  type="number"
                  step="0.0001"
                  className="form-input"
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Principal Contact */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Principal Name</label>
              <input
                type="text"
                className="form-input"
                value={principalName}
                onChange={(e) => setPrincipalName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Principal Phone</label>
              <input
                type="tel"
                className="form-input"
                value={principalPhone}
                onChange={(e) => setPrincipalPhone(e.target.value)}
              />
            </div>
          </div>

          {/* Coordinator Contact */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Coordinator Name</label>
              <input
                type="text"
                className="form-input"
                value={coordinatorName}
                onChange={(e) => setCoordinatorName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Coordinator Phone</label>
              <input
                type="tel"
                className="form-input"
                value={coordinatorPhone}
                onChange={(e) => setCoordinatorPhone(e.target.value)}
              />
            </div>
          </div>

          {/* Email & Student Count */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">School Email</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Students Count</label>
              <input
                type="number"
                className="form-input"
                value={studentStrength}
                onChange={(e) => setStudentStrength(e.target.value)}
              />
            </div>
          </div>

          {/* Danger zone: Delete School */}
          {confirmDelete ? (
            <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: 12, borderRadius: 10, marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#f87171', fontSize: '0.82rem', fontWeight: 700 }}>
                <AlertTriangle size={16} /> Confirm Deletion?
              </div>
              <p style={{ fontSize: '0.72rem', color: '#cbd5e1', margin: '4px 0 10px' }}>
                This will remove <strong>{school.name}</strong> from your active directory.
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
                  id="btn-confirm-delete-school"
                >
                  Yes, Delete School
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
                <Trash2 size={13} /> Delete this school
              </button>
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 2 }} id="btn-save-edit-school">
              <CheckCircle size={16} /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
