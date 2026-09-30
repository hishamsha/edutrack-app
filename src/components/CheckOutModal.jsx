import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  LogOut,
  Clock,
  CheckCircle,
  Star,
  Users,
  Award,
  FileText,
} from 'lucide-react';

export default function CheckOutModal({ isOpen, onClose, visit }) {
  const { checkOut } = useApp();

  const [notes, setNotes] = useState('');
  const [stakeholdersMet, setStakeholdersMet] = useState('Principal & 40+ Students');
  const [rating, setRating] = useState(5);
  const [durationHours, setDurationHours] = useState('3h 30m');

  if (!isOpen || !visit) return null;

  const handleConfirmCheckOut = () => {
    checkOut(visit.id, {
      notes: notes || 'Visit concluded successfully with high stakeholder satisfaction.',
      stakeholdersMet,
      rating,
      durationHours,
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LogOut size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Conclude Visit & Check-Out</h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Submit Final Attendance & Activity Report</p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '16px 20px' }}>
          {/* School & Duration Card */}
          <div style={{ background: 'rgba(30, 41, 59, 0.6)', padding: '14px', borderRadius: 12, border: '1px solid var(--border-subtle)', marginBottom: 16 }}>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>
              {visit.schoolName}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 8, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Clock size={14} color="#38bdf8" /> Checked In: {visit.checkInTime}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <CheckCircle size={14} color="#10b981" /> Activities: {visit.activities?.length || 0} Logged
              </span>
            </div>
          </div>

          {/* Time Duration Field */}
          <div className="form-group">
            <label className="form-label">Total Time Spent on Campus</label>
            <input
              type="text"
              className="form-input"
              value={durationHours}
              onChange={(e) => setDurationHours(e.target.value)}
              placeholder="e.g. 3h 45m"
            />
          </div>

          {/* Key Stakeholders Met */}
          <div className="form-group">
            <label className="form-label">Key People & Participants Met</label>
            <input
              type="text"
              className="form-input"
              value={stakeholdersMet}
              onChange={(e) => setStakeholdersMet(e.target.value)}
              placeholder="e.g. Principal Dr. Saxena, 2 Science Teachers, 48 Students"
            />
          </div>

          {/* Satisfaction / School Experience Rating */}
          <div className="form-group">
            <label className="form-label">School Administration & Student Engagement Rating</label>
            <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1.4rem',
                    color: star <= rating ? '#fbbf24' : '#475569',
                    transition: 'transform 0.15s ease',
                  }}
                  title={`${star} Star`}
                >
                  ★
                </button>
              ))}
              <span style={{ fontSize: '0.85rem', color: '#fbbf24', alignSelf: 'center', marginLeft: 8, fontWeight: 700 }}>
                {rating} / 5 Stars
              </span>
            </div>
          </div>

          {/* Visit Outcomes / Remarks */}
          <div className="form-group">
            <label className="form-label">Summary of Outcomes / Remarks</label>
            <textarea
              className="form-textarea"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Summary of session completed, student responses, any pending follow-up items or kit requests..."
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <button className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>
              Keep Checked In
            </button>
            <button
              className="btn btn-danger"
              onClick={handleConfirmCheckOut}
              style={{ flex: 2 }}
              id="btn-confirm-checkout"
            >
              <LogOut size={16} /> Submit & Check-Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
