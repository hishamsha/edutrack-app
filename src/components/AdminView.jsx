import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { exportVisitsToCSV, exportExpensesToCSV } from '../utils/exportUtils';
import {
  Shield,
  Download,
  Printer,
  Users,
  CheckCircle,
  XCircle,
  MapPin,
  Clock,
  Receipt,
  FileSpreadsheet,
  Search,
  Filter,
  Calendar,
  Layers,
  UserPlus,
  Edit,
} from 'lucide-react';
import AddTaskModal from './AddTaskModal';
import EditUserModal from './EditUserModal';

export default function AdminView() {
  const {
    users,
    visits,
    expenses,
    tasks,
    schools,
    updateExpenseStatus,
    addUser,
    currentUser,
    showToast,
  } = useApp();

  const [selectedUserFilter, setSelectedUserFilter] = useState('ALL');
  const [selectedSchoolFilter, setSelectedSchoolFilter] = useState('ALL');
  const [tableSearch, setTableSearch] = useState('');
  const [showTaskDispatchModal, setShowTaskDispatchModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState(null);

  // New Colleague Form State
  const [newColleagueName, setNewColleagueName] = useState('');
  const [newColleagueEmail, setNewColleagueEmail] = useState('');
  const [newColleagueRole, setNewColleagueRole] = useState('field_agent');
  const [newColleagueZone, setNewColleagueZone] = useState('East Zone (Kolkata)');

  // Filtered visits for master data table
  const filteredVisits = visits.filter((v) => {
    const matchesUser = selectedUserFilter === 'ALL' || v.userId === selectedUserFilter;
    const matchesSchool = selectedSchoolFilter === 'ALL' || v.schoolId === selectedSchoolFilter;
    const matchesSearch =
      v.schoolName.toLowerCase().includes(tableSearch.toLowerCase()) ||
      v.userName.toLowerCase().includes(tableSearch.toLowerCase()) ||
      (v.purpose || '').toLowerCase().includes(tableSearch.toLowerCase());
    return matchesUser && matchesSchool && matchesSearch;
  });

  const pendingExpenses = expenses.filter((e) => e.status === 'PENDING');
  const fieldAgents = users.filter((u) => u.role === 'field_agent');

  const handleCreateColleague = (e) => {
    e.preventDefault();
    if (!newColleagueName || !newColleagueEmail) return;

    addUser({
      name: newColleagueName,
      email: newColleagueEmail,
      role: newColleagueRole,
      designation: newColleagueRole === 'admin' ? 'Regional Coordinator' : 'Field Operations Officer',
      phone: '+91 98000 11223',
      zone: newColleagueZone,
    });

    setNewColleagueName('');
    setNewColleagueEmail('');
    setShowAddUserModal(false);
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div>
      {/* Header Banner */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="badge badge-amber">
              <Shield size={12} /> Executive Operations Cockpit
            </span>
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: 4 }}>
            Admin Field Control & Central Data Hub
          </h2>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
            Real-time colleague attendance, expense approvals, task dispatch & master export
          </p>
        </div>

        {/* Export & Actions Row */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => exportVisitsToCSV(visits)}
            title="Download CSV formatted for Microsoft Excel / Google Sheets"
            id="btn-export-visits-csv"
          >
            <FileSpreadsheet size={15} color="#34d399" /> Export Visits CSV
          </button>

          <button
            className="btn btn-secondary btn-sm"
            onClick={() => exportExpensesToCSV(expenses)}
            title="Download full expense ledger"
            id="btn-export-expenses-csv"
          >
            <Receipt size={15} color="#38bdf8" /> Export Expenses CSV
          </button>

          <button
            className="btn btn-secondary btn-sm"
            onClick={handlePrintReport}
            title="Print or Save PDF report"
            id="btn-print-audit-report"
          >
            <Printer size={15} color="#f59e0b" /> Print / PDF
          </button>

          <button
            className="btn btn-primary btn-sm"
            onClick={() => setShowAddUserModal(true)}
            id="btn-add-colleague-admin"
          >
            <UserPlus size={15} /> Add Colleague
          </button>
        </div>
      </div>

      {/* 1. LIVE TEAM FIELD TRACKER */}
      <div style={{ marginBottom: 24 }}>
        <div className="section-header">
          <h3 className="section-title">
            <Users size={18} color="#38bdf8" /> Live Colleague Field Status ({fieldAgents.length} Reps)
          </h3>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setShowTaskDispatchModal(true)}
            style={{ fontSize: '0.72rem' }}
          >
            + Dispatch Visit Task
          </button>
        </div>

        <div className="admin-team-grid">
          {fieldAgents.map((agent) => {
            const activeSession = visits.find(
              (v) => v.userId === agent.id && v.status === 'CHECKED_IN'
            );
            const agentTodayVisits = visits.filter(
              (v) => v.userId === agent.id && v.date === new Date().toISOString().split('T')[0]
            );
            const agentTasks = tasks.filter((t) => t.userId === agent.id);

            return (
              <div key={agent.id} className="team-officer-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="user-avatar-circle" style={{ width: 34, height: 34, fontSize: '1rem' }}>
                      {agent.avatar || agent.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>
                        {agent.name}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                        {agent.zone}
                      </div>
                    </div>
                  </div>

                  <span className={`badge ${activeSession ? 'badge-green' : 'badge-blue'}`}>
                    {activeSession ? '● Active In Field' : 'Idle / Off Duty'}
                  </span>
                </div>

                {activeSession ? (
                  <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)', padding: 10, borderRadius: 8, fontSize: '0.75rem', marginBottom: 10 }}>
                    <div style={{ fontWeight: 700, color: '#34d399' }}>
                      📍 {activeSession.schoolName}
                    </div>
                    <div style={{ color: '#cbd5e1', marginTop: 2, display: 'flex', justifyContent: 'space-between' }}>
                      <span>Since {activeSession.checkInTime}</span>
                      <span>{activeSession.activities?.length || 0} Activities</span>
                    </div>
                  </div>
                ) : (
                  <div style={{ background: 'rgba(30, 41, 59, 0.4)', padding: 10, borderRadius: 8, fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: 10 }}>
                    Not currently checked in. {agentTodayVisits.length} visits logged today.
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  <span>Tasks Today: {agentTasks.filter((t) => t.status === 'COMPLETED').length}/{agentTasks.length}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ color: '#38bdf8' }}>{agent.phone}</span>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setSelectedUserForEdit(agent)}
                      style={{ padding: '2px 6px', fontSize: '0.65rem' }}
                      title="Edit Trainer Profile"
                    >
                      <Edit size={11} color="#38bdf8" /> Edit
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. PENDING EXPENSE APPROVALS AUDIT QUEUE */}
      {pendingExpenses.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <div className="section-header">
            <h3 className="section-title">
              <Receipt size={18} color="#fbbf24" /> Expense Approval Queue ({pendingExpenses.length} Pending)
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {pendingExpenses.map((exp) => (
              <div key={exp.id} className="glass-card" style={{ padding: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ flex: 1, minWidth: 240 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>
                      {exp.category}
                    </span>
                    <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>
                      {exp.userName}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: 2 }}>
                    📍 {exp.schoolName || 'General Travel'} • {exp.date} • {exp.notes}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#38bdf8' }}>
                      ₹{exp.amount}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>{exp.paymentMode}</div>
                  </div>

                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => updateExpenseStatus(exp.id, 'APPROVED')}
                      id={`btn-approve-expense-${exp.id}`}
                    >
                      <CheckCircle size={14} /> Approve
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => updateExpenseStatus(exp.id, 'REJECTED', 'Need original bill receipt')}
                      id={`btn-reject-expense-${exp.id}`}
                    >
                      <XCircle size={14} /> Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. MASTER DATA TABLE & FILTER (REPLACES GOOGLE SHEETS) */}
      <div style={{ marginBottom: 30 }}>
        <div className="section-header">
          <div>
            <h3 className="section-title">
              <FileSpreadsheet size={18} color="#34d399" /> Central Master Attendance & Visits Database
            </h3>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
              Complete record of all field visits across all colleagues (Excel ready)
            </p>
          </div>
        </div>

        {/* Filter controls */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10, marginBottom: 14 }}>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: 34, fontSize: '0.82rem' }}
              placeholder="Filter by school or officer..."
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
            />
          </div>

          {/* Colleague Filter */}
          <select
            className="form-select"
            style={{ fontSize: '0.82rem' }}
            value={selectedUserFilter}
            onChange={(e) => setSelectedUserFilter(e.target.value)}
          >
            <option value="ALL">All Colleagues ({users.length})</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.role === 'admin' ? 'Admin' : 'Field Staff'})
              </option>
            ))}
          </select>

          {/* School Filter */}
          <select
            className="form-select"
            style={{ fontSize: '0.82rem' }}
            value={selectedSchoolFilter}
            onChange={(e) => setSelectedSchoolFilter(e.target.value)}
          >
            <option value="ALL">All Schools ({schools.length})</option>
            {schools.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.city})
              </option>
            ))}
          </select>
        </div>

        {/* Responsive Data Table */}
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Colleague / Officer</th>
                <th>School Name</th>
                <th>Timing & Duration</th>
                <th>Status</th>
                <th>Purpose & Activities</th>
                <th>GPS Geotag</th>
              </tr>
            </thead>
            <tbody>
              {filteredVisits.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: 30, color: 'var(--text-dim)' }}>
                    No visit records found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredVisits.map((v) => (
                  <tr key={v.id}>
                    <td style={{ whiteSpace: 'nowrap', fontWeight: 600 }}>{v.date}</td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#38bdf8' }}>{v.userName}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{v.schoolName}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{v.schoolAddress}</div>
                    </td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <div>In: {v.checkInTime}</div>
                      {v.checkOutTime ? (
                        <div style={{ color: '#10b981' }}>Out: {v.checkOutTime} ({v.durationHours})</div>
                      ) : (
                        <div style={{ color: '#fbbf24' }}>Ongoing</div>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${v.status === 'CHECKED_IN' ? 'badge-green' : 'badge-blue'}`}>
                        {v.status === 'CHECKED_IN' ? 'In Progress' : 'Completed'}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{v.purpose}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                        {(v.activities || []).length} activities recorded
                      </div>
                    </td>
                    <td style={{ fontSize: '0.72rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                      {v.checkInLocation?.lat ? `${v.checkInLocation.lat}°N, ${v.checkInLocation.lng}°E` : 'Verified'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. TEAM & TRAINER PROFILES MANAGEMENT */}
      <div style={{ marginBottom: 30 }}>
        <div className="section-header">
          <div>
            <h3 className="section-title">
              <Users size={18} color="#38bdf8" /> Team & Trainer Directory ({users.length} Members)
            </h3>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
              Edit colleague profiles, designation, phone numbers, and regional zones
            </p>
          </div>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setShowAddUserModal(true)}
            id="btn-add-colleague-section"
          >
            <UserPlus size={15} /> Add Colleague
          </button>
        </div>

        <div className="admin-team-grid">
          {users.map((user) => (
            <div key={user.id} className="glass-card" style={{ padding: 14, border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div className="user-avatar-circle" style={{ width: 36, height: 36, fontSize: '1.1rem', background: user.role === 'admin' ? '#f59e0b' : '#2563eb' }}>
                    {user.avatar || user.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#fff' }}>
                      {user.name}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                      {user.designation}
                    </div>
                  </div>
                </div>

                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setSelectedUserForEdit(user)}
                  style={{ padding: '3px 8px', fontSize: '0.7rem' }}
                  title="Edit Colleague / Trainer Profile"
                >
                  <Edit size={12} color="#38bdf8" /> Edit
                </button>
              </div>

              <div style={{ padding: 8, background: 'rgba(15, 23, 42, 0.4)', borderRadius: 8, fontSize: '0.75rem', marginBottom: 8 }}>
                <div style={{ color: '#38bdf8', fontWeight: 600 }}>
                  🌐 {user.zone}
                </div>
                <div style={{ color: '#cbd5e1', marginTop: 2, display: 'flex', justifyContent: 'space-between' }}>
                  <span>📞 {user.phone}</span>
                  <span className={`badge ${user.role === 'admin' ? 'badge-amber' : 'badge-blue'}`} style={{ fontSize: '0.62rem', padding: '1px 5px' }}>
                    {user.role === 'admin' ? 'Admin' : 'Field Staff'}
                  </span>
                </div>
              </div>

              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                ✉️ {user.email}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add New Colleague Modal */}
      {showAddUserModal && (
        <div className="modal-overlay" onClick={() => setShowAddUserModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <UserPlus size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Add Colleague Account</h3>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Grant individual login access</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddUserModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateColleague} style={{ padding: '16px 20px' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={newColleagueName}
                  onChange={(e) => setNewColleagueName(e.target.value)}
                  placeholder="e.g. Vikramaditya Singh"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Company Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={newColleagueEmail}
                  onChange={(e) => setNewColleagueEmail(e.target.value)}
                  placeholder="vikram@edutrack.org"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Role</label>
                  <select
                    className="form-select"
                    value={newColleagueRole}
                    onChange={(e) => setNewColleagueRole(e.target.value)}
                  >
                    <option value="field_agent">Field Representative</option>
                    <option value="admin">Operations Admin</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Territory / Zone</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newColleagueZone}
                    onChange={(e) => setNewColleagueZone(e.target.value)}
                    placeholder="e.g. North Zone (Delhi)"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddUserModal(false)} style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2 }} id="btn-save-new-user">
                  <CheckCircle size={16} /> Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AddTaskModal
        isOpen={showTaskDispatchModal}
        onClose={() => setShowTaskDispatchModal(false)}
      />

      <EditUserModal
        isOpen={Boolean(selectedUserForEdit)}
        onClose={() => setSelectedUserForEdit(null)}
        user={selectedUserForEdit}
      />
    </div>
  );
}
