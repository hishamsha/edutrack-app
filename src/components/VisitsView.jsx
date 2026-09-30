import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MapPin,
  Clock,
  CheckCircle,
  Plus,
  Navigation,
  Calendar,
  Layers,
  ChevronDown,
  ChevronUp,
  Image,
  Award,
  Filter,
} from 'lucide-react';
import AttendanceCheckInModal from './AttendanceCheckInModal';
import ActivityModal from './ActivityModal';

export default function VisitsView() {
  const { visits, currentUser, activeVisit } = useApp();
  const [filter, setFilter] = useState('ALL'); // 'ALL', 'MINE', 'ACTIVE'
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [activeLogVisitId, setActiveLogVisitId] = useState(null);

  const filteredVisits = visits.filter((v) => {
    if (filter === 'MINE') return v.userId === currentUser.id;
    if (filter === 'ACTIVE') return v.status === 'CHECKED_IN';
    return true;
  });

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>School Visits & Attendance</h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            Digital log replacing manual Google attendance forms
          </p>
        </div>

        <button
          className="btn btn-primary btn-sm"
          onClick={() => setShowCheckInModal(true)}
          id="btn-new-visit"
        >
          <Plus size={16} /> New Check-In
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {[
          { id: 'ALL', label: 'All Team Visits' },
          { id: 'MINE', label: 'My Visits Only' },
          { id: 'ACTIVE', label: 'Active Live' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`btn btn-sm ${filter === f.id ? 'btn-primary' : 'btn-secondary'}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Visits List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {filteredVisits.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-dim)' }}>
            No school visits match this filter.
          </div>
        ) : (
          filteredVisits.map((visit) => {
            const isActive = visit.status === 'CHECKED_IN';

            return (
              <div
                key={visit.id}
                className="visit-card"
                style={{
                  borderLeft: isActive ? '4px solid #10b981' : '1px solid var(--border-subtle)',
                }}
              >
                <div className="visit-card-header">
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="visit-school-name">{visit.schoolName}</span>
                      <span className={`badge ${isActive ? 'badge-green' : 'badge-blue'}`}>
                        {isActive ? '● Live In-Progress' : '✓ Completed'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: 2 }}>
                      📍 {visit.schoolAddress}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span className="badge badge-purple" style={{ fontSize: '0.68rem' }}>
                      {visit.userName}
                    </span>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: 4 }}>
                      {visit.date}
                    </div>
                  </div>
                </div>

                {/* Visit timing & GPS Details */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 12,
                    padding: '8px 12px',
                    background: 'rgba(15, 23, 42, 0.4)',
                    borderRadius: 8,
                    fontSize: '0.75rem',
                    color: '#94a3b8',
                    marginBottom: 12,
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={13} color="#38bdf8" /> Check-in: {visit.checkInTime}
                  </span>
                  {visit.checkOutTime && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <CheckCircle size={13} color="#10b981" /> Check-out: {visit.checkOutTime}
                    </span>
                  )}
                  {visit.durationHours && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#38bdf8' }}>
                      ⏱️ Duration: {visit.durationHours}
                    </span>
                  )}
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Navigation size={13} color="#34d399" /> {visit.checkInLocation?.accuracy || 'GPS Geotagged'}
                  </span>
                </div>

                {/* Purpose */}
                <div style={{ fontSize: '0.82rem', marginBottom: 10 }}>
                  <span style={{ color: 'var(--text-dim)', fontWeight: 600 }}>Purpose: </span>
                  <span style={{ color: '#f8fafc' }}>{visit.purpose}</span>
                </div>

                {/* Activities logged in this visit */}
                {(visit.activities || []).length > 0 && (
                  <div style={{ marginTop: 10, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 10 }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Layers size={13} /> Activities Conducted ({visit.activities.length})
                    </div>

                    {visit.activities.map((act) => (
                      <div
                        key={act.id}
                        style={{
                          background: 'rgba(30, 41, 59, 0.5)',
                          padding: 10,
                          borderRadius: 8,
                          marginBottom: 8,
                          fontSize: '0.78rem',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, color: '#fff' }}>
                          <span>{act.title}</span>
                          <span style={{ color: '#fbbf24', fontSize: '0.7rem' }}>{act.category}</span>
                        </div>
                        <div style={{ color: '#94a3b8', fontSize: '0.72rem', marginTop: 2 }}>
                          Participants: {act.participantsCount} • Met: {act.staffMet}
                        </div>
                        <div style={{ color: '#cbd5e1', marginTop: 4 }}>{act.description}</div>

                        {/* Stamped photos */}
                        {(act.photos || []).length > 0 && (
                          <div style={{ display: 'flex', gap: 8, marginTop: 8, overflowX: 'auto', paddingBottom: 4 }}>
                            {act.photos.map((p, pIdx) => (
                              <div
                                key={pIdx}
                                style={{ position: 'relative', cursor: 'pointer', flexShrink: 0 }}
                                onClick={() => setSelectedPhoto(p.url)}
                                title="Click to view full geo-stamped photo"
                              >
                                <img
                                  src={p.url}
                                  alt={p.caption}
                                  style={{ width: 110, height: 75, objectFit: 'cover', borderRadius: 6, border: '1px solid rgba(56, 189, 248, 0.3)' }}
                                />
                                <div
                                  style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    background: 'rgba(0,0,0,0.7)',
                                    color: '#38bdf8',
                                    fontSize: '0.55rem',
                                    padding: '2px 4px',
                                    borderBottomLeftRadius: 6,
                                    borderBottomRightRadius: 6,
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                  }}
                                >
                                  ✓ Geo-Tagged
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Notes & Summary */}
                {visit.notes && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 8, fontStyle: 'italic', background: 'rgba(15, 23, 42, 0.3)', padding: 8, borderRadius: 6 }}>
                    💬 "{visit.notes}"
                  </div>
                )}

                {/* If active, provide quick log activity button */}
                {isActive && visit.userId === currentUser.id && (
                  <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setActiveLogVisitId(visit.id)}
                      style={{ fontSize: '0.75rem' }}
                    >
                      <Plus size={13} /> Add Workshop Activity & Photo
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Full Photo Modal Viewer */}
      {selectedPhoto && (
        <div className="modal-overlay" onClick={() => setSelectedPhoto(null)}>
          <div
            className="modal-content"
            style={{ maxWidth: 700, padding: 10, background: '#090d16', textAlign: 'center' }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedPhoto}
              alt="Geo-stamped attendance proof"
              style={{ width: '100%', maxHeight: '75vh', objectFit: 'contain', borderRadius: 12 }}
            />
            <div style={{ marginTop: 10 }}>
              <button className="btn btn-secondary btn-sm" onClick={() => setSelectedPhoto(null)}>
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      <AttendanceCheckInModal
        isOpen={showCheckInModal}
        onClose={() => setShowCheckInModal(false)}
      />

      {activeLogVisitId && (
        <ActivityModal
          isOpen={Boolean(activeLogVisitId)}
          onClose={() => setActiveLogVisitId(null)}
          visitId={activeLogVisitId}
          schoolName={visits.find((v) => v.id === activeLogVisitId)?.schoolName}
        />
      )}
    </div>
  );
}
