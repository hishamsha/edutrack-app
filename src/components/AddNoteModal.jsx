import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  FileText,
  Mic,
  MicOff,
  CheckCircle,
  Tag,
  Pin,
} from 'lucide-react';

export default function AddNoteModal({ isOpen, onClose }) {
  const { schools, addNote } = useApp();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedSchoolId, setSelectedSchoolId] = useState(schools[0]?.id || '');
  const [category, setCategory] = useState('High Priority Lead');
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);

  if (!isOpen) return null;

  const handleVoiceToggle = () => {
    if (!isRecordingVoice) {
      setIsRecordingVoice(true);
      // Simulate real-time speech-to-text
      setTimeout(() => {
        setContent((prev) =>
          prev
            ? `${prev} [Voice Note]: Principal expressed strong interest in expanding robotics program to Class 6 and 7.`
            : 'Principal expressed strong interest in expanding robotics program to Class 6 and 7 next term.'
        );
        setIsRecordingVoice(false);
      }, 2000);
    } else {
      setIsRecordingVoice(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !content) return;

    const school = schools.find((s) => s.id === selectedSchoolId);

    addNote({
      title,
      content,
      schoolId: school?.id || null,
      schoolName: school?.name || 'General Field Note',
      category,
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Record Field Observation</h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Notes, feedback & critical follow-ups</p>
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
            <label className="form-label">Associated School</label>
            <select
              className="form-select"
              value={selectedSchoolId}
              onChange={(e) => setSelectedSchoolId(e.target.value)}
            >
              <option value="">General Field Observation</option>
              {schools.map((sch) => (
                <option key={sch.id} value={sch.id}>
                  {sch.name} ({sch.city})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Note Title</label>
              <input
                type="text"
                className="form-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Principal feedback regarding kits"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="High Priority Lead">High Priority Lead</option>
                <option value="Teacher Feedback">Teacher Feedback</option>
                <option value="Maintenance & Repair">Maintenance & Repair</option>
                <option value="Payment Follow-up">Payment Follow-up</option>
                <option value="General Observation">General Observation</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label className="form-label" style={{ margin: 0 }}>Observation Details</label>
              <button
                type="button"
                className={`btn btn-sm ${isRecordingVoice ? 'btn-danger' : 'btn-secondary'}`}
                onClick={handleVoiceToggle}
                style={{ fontSize: '0.72rem', padding: '3px 8px' }}
              >
                {isRecordingVoice ? (
                  <>
                    <MicOff size={12} /> Recording...
                  </>
                ) : (
                  <>
                    <Mic size={12} color="#38bdf8" /> Tap Voice Memo
                  </>
                )}
              </button>
            </div>
            <textarea
              className="form-textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Record your field observations, school requirements, teacher feedback..."
              rows={4}
              required
            />
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 2 }} id="btn-save-note">
              <CheckCircle size={16} /> Save Field Note
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
