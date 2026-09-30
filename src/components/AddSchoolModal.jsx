import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  User,
  CheckCircle,
  Navigation,
} from 'lucide-react';

export default function AddSchoolModal({ isOpen, onClose }) {
  const { addSchool } = useApp();

  const [name, setName] = useState('');
  const [board, setBoard] = useState('CBSE');
  const [category, setCategory] = useState('Private Senior Secondary');
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
  const [detectingGps, setDetectingGps] = useState(false);

  if (!isOpen) return null;

  const handleDetectGPS = () => {
    setDetectingGps(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(Number(pos.coords.latitude.toFixed(5)));
          setLng(Number(pos.coords.longitude.toFixed(5)));
          setDetectingGps(false);
        },
        () => {
          setDetectingGps(false);
        }
      );
    } else {
      setDetectingGps(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !city) return;

    addSchool({
      name,
      code: `SCH-${Math.floor(1000 + Math.random() * 9000)}`,
      board,
      category,
      address: address || `${city}, ${state || 'State'}`,
      city,
      state: state || 'State',
      principalName: principalName || 'Principal',
      principalPhone: principalPhone || '+91 98000 00000',
      coordinatorName: coordinatorName || 'Academic Coordinator',
      coordinatorPhone: coordinatorPhone || principalPhone,
      email: email || `contact@${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.edu`,
      lat: Number(lat),
      lng: Number(lng),
      studentStrength: 1200,
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GraduationCap size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Add New School</h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Register school in operations directory</p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '16px 20px' }}>
          <div className="form-group">
            <label className="form-label">School Full Name</label>
            <input
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Cambridge Court World School"
              required
            />
          </div>

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
              <label className="form-label">City</label>
              <input
                type="text"
                className="form-input"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Gurugram"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Complete Campus Address</label>
            <textarea
              className="form-textarea"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Street, Sector, Landmark, Pincode"
              rows={2}
            />
          </div>

          {/* GPS Coordinates & Auto detect */}
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Principal Name</label>
              <input
                type="text"
                className="form-input"
                value={principalName}
                onChange={(e) => setPrincipalName(e.target.value)}
                placeholder="e.g. Dr. A. Sharma"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Principal Phone</label>
              <input
                type="tel"
                className="form-input"
                value={principalPhone}
                onChange={(e) => setPrincipalPhone(e.target.value)}
                placeholder="+91 98..."
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Science / Lab Coordinator</label>
              <input
                type="text"
                className="form-input"
                value={coordinatorName}
                onChange={(e) => setCoordinatorName(e.target.value)}
                placeholder="e.g. Ms. Ritu Verma"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Coordinator Phone</label>
              <input
                type="tel"
                className="form-input"
                value={coordinatorPhone}
                onChange={(e) => setCoordinatorPhone(e.target.value)}
                placeholder="+91 98..."
              />
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 2 }} id="btn-save-school">
              <CheckCircle size={16} /> Save School to Directory
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
