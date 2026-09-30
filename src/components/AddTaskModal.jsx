import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  CalendarCheck,
  Building,
  User,
  Clock,
  CheckCircle,
} from 'lucide-react';

export default function AddTaskModal({ isOpen, onClose }) {
  const { schools, users, addTask, currentUser } = useApp();

  const [title, setTitle] = useState('');
  const [selectedSchoolId, setSelectedSchoolId] = useState(schools[0]?.id || '');
  const [assignedUserId, setAssignedUserId] = useState(currentUser?.id || '');
  const [priority, setPriority] = useState('HIGH');
  const [time, setTime] = useState('10:00 AM');
  const [instructions, setInstructions] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !selectedSchoolId) return;

    const school = schools.find((s) => s.id === selectedSchoolId);

    addTask({
      title,
      schoolId: school.id,
      schoolName: school.name,
      userId: assignedUserId,
      priority,
      time,
      instructions: instructions || 'Conduct scheduled agenda and submit report.',
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CalendarCheck size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Schedule School Visit / Task</h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Add to Daily Tour Plan & Route</p>
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
          {/* Target Colleague (Admin can assign to anyone) */}
          {currentUser.role === 'admin' ? (
            <div className="form-group">
              <label className="form-label">Assign to Field Colleague</label>
              <select
                className="form-select"
                value={assignedUserId}
                onChange={(e) => setAssignedUserId(e.target.value)}
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.designation} • {u.zone})
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          {/* School Selector */}
          <div className="form-group">
            <label className="form-label">Target School</label>
            <select
              className="form-select"
              value={selectedSchoolId}
              onChange={(e) => setSelectedSchoolId(e.target.value)}
            >
              {schools.map((sch) => (
                <option key={sch.id} value={sch.id}>
                  {sch.name} ({sch.city})
                </option>
              ))}
            </select>
          </div>

          {/* Task Title */}
          <div className="form-group">
            <label className="form-label">Visit Agenda / Task Title</label>
            <input
              type="text"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Conduct Robotics Lab Session & Collect Signed MoU"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Scheduled Time</label>
              <input
                type="text"
                className="form-input"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g. 11:30 AM"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select className="form-select" value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="HIGH">High Priority</option>
                <option value="MEDIUM">Medium</option>
                <option value="NORMAL">Normal</option>
              </select>
            </div>
          </div>

          {/* Special Instructions */}
          <div className="form-group">
            <label className="form-label">Special Instructions / Checkpoints</label>
            <textarea
              className="form-textarea"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Carry 4 spare battery packs and collect signature from Principal"
              rows={2}
            />
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 2 }} id="btn-save-task">
              <CheckCircle size={16} /> Add to Tour Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
