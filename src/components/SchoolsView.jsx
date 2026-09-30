import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  Search,
  Plus,
  Phone,
  MessageSquare,
  Navigation,
  MapPin,
  Users,
  CheckCircle,
  ExternalLink,
  Edit,
} from 'lucide-react';
import AddSchoolModal from './AddSchoolModal';
import EditSchoolModal from './EditSchoolModal';
import AttendanceCheckInModal from './AttendanceCheckInModal';

export default function SchoolsView() {
  const { schools } = useApp();
  const [search, setSearch] = useState('');
  const [boardFilter, setBoardFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [selectedSchoolForEdit, setSelectedSchoolForEdit] = useState(null);

  const filteredSchools = schools.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.city.toLowerCase().includes(search.toLowerCase()) ||
      s.code.toLowerCase().includes(search.toLowerCase());

    const matchesBoard = boardFilter === 'ALL' || s.board === boardFilter;
    return matchesSearch && matchesBoard;
  });

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Schools Directory & CRM</h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            Contacts, addresses, navigation & campus profiles
          </p>
        </div>

        <button
          className="btn btn-primary btn-sm"
          onClick={() => setShowAddModal(true)}
          id="btn-add-school-directory"
        >
          <Plus size={16} /> Add School
        </button>
      </div>

      {/* Search Input */}
      <div style={{ position: 'relative', marginBottom: 12 }}>
        <Search
          size={18}
          style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }}
        />
        <input
          type="text"
          className="form-input"
          style={{ paddingLeft: 38 }}
          placeholder="Search school name, city, or school code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          id="search-schools-input"
        />
      </div>

      {/* Board Filter Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, overflowX: 'auto', paddingBottom: 4 }}>
        {['ALL', 'CBSE', 'ICSE', 'State'].map((b) => (
          <button
            key={b}
            onClick={() => setBoardFilter(b)}
            className={`btn btn-sm ${boardFilter === b ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '0.75rem', padding: '4px 12px' }}
          >
            {b === 'ALL' ? 'All Boards' : b}
          </button>
        ))}
      </div>

      {/* Schools Cards Grid */}
      <div className="school-grid">
        {filteredSchools.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-dim)', gridColumn: '1 / -1' }}>
            No schools found matching your search.
          </div>
        ) : (
          filteredSchools.map((sch) => {
            const cleanPhone = (sch.principalPhone || '').replace(/[^0-9]/g, '');
            const coordPhone = (sch.coordinatorPhone || sch.principalPhone || '').replace(/[^0-9]/g, '');
            const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${sch.lat},${sch.lng}`;

            return (
              <div key={sch.id} className="school-card">
                <img
                  src={sch.imageUrl || '/images/campus_sample.jpg'}
                  alt={sch.name}
                  className="school-card-media"
                />

                <div className="school-card-body">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span className="badge badge-blue">{sch.board}</span>
                      <span style={{ fontSize: '0.7rem', color: '#38bdf8', fontWeight: 600 }}>{sch.code}</span>
                    </div>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setSelectedSchoolForEdit(sch)}
                      style={{ padding: '2px 8px', fontSize: '0.7rem' }}
                      title="Edit School Details"
                    >
                      <Edit size={12} color="#38bdf8" /> Edit
                    </button>
                  </div>

                  <h3 style={{ fontSize: '1.02rem', fontWeight: 700, margin: '8px 0 4px', color: '#ffffff' }}>
                    {sch.name}
                  </h3>

                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'flex-start', gap: 4 }}>
                    <MapPin size={14} style={{ flexShrink: 0, marginTop: 2, color: '#38bdf8' }} />
                    <span>{sch.address}</span>
                  </div>

                  {/* Principal & Coordinator Info */}
                  <div style={{ marginTop: 10, padding: 8, background: 'rgba(15, 23, 42, 0.4)', borderRadius: 8, fontSize: '0.75rem' }}>
                    <div style={{ fontWeight: 600, color: '#e2e8f0' }}>
                      Principal: {sch.principalName}
                    </div>
                    {sch.coordinatorName && (
                      <div style={{ color: '#94a3b8', fontSize: '0.7rem', marginTop: 2 }}>
                        Coordinator: {sch.coordinatorName}
                      </div>
                    )}
                  </div>

                  {/* Interactive Action Buttons: Call, WhatsApp, Maps Direction */}
                  <div className="school-card-actions">
                    <a
                      href={`tel:${cleanPhone}`}
                      className="btn btn-secondary btn-sm"
                      style={{ flex: 1, fontSize: '0.72rem', padding: '6px 4px' }}
                      title={`Call ${sch.principalPhone}`}
                    >
                      <Phone size={13} color="#38bdf8" /> Call
                    </a>

                    <a
                      href={`https://wa.me/${coordPhone}?text=Hello%20${encodeURIComponent(sch.name)},%20I%20am%20visiting%20today.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary btn-sm"
                      style={{ flex: 1, fontSize: '0.72rem', padding: '6px 4px' }}
                      title="Open WhatsApp chat"
                    >
                      <MessageSquare size={13} color="#34d399" /> WhatsApp
                    </a>

                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary btn-sm"
                      style={{ flex: 1, fontSize: '0.72rem', padding: '6px 4px' }}
                      title="Open Navigation in Google Maps"
                    >
                      <Navigation size={13} color="#f59e0b" /> Directions
                    </a>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <AddSchoolModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />

      <EditSchoolModal
        isOpen={Boolean(selectedSchoolForEdit)}
        onClose={() => setSelectedSchoolForEdit(null)}
        school={selectedSchoolForEdit}
      />

      <AttendanceCheckInModal
        isOpen={showCheckInModal}
        onClose={() => setShowCheckInModal(false)}
      />
    </div>
  );
}
