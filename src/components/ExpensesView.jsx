import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Receipt,
  Plus,
  Car,
  Utensils,
  Train,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  IndianRupee,
  ShieldAlert,
} from 'lucide-react';
import ExpenseModal from './ExpenseModal';

export default function ExpensesView() {
  const { expenses, currentUser, updateExpenseStatus } = useApp();
  const [filter, setFilter] = useState('ALL'); // 'ALL', 'PENDING', 'APPROVED'
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [viewReceipt, setViewReceipt] = useState(null);

  const filteredExpenses = expenses.filter((e) => {
    if (filter === 'PENDING') return e.status === 'PENDING';
    if (filter === 'APPROVED') return e.status === 'APPROVED';
    return true;
  });

  const totalClaimed = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const totalApproved = expenses
    .filter((e) => e.status === 'APPROVED')
    .reduce((sum, e) => sum + Number(e.amount), 0);
  const totalPending = expenses
    .filter((e) => e.status === 'PENDING')
    .reduce((sum, e) => sum + Number(e.amount), 0);

  const getCategoryIcon = (cat) => {
    if (cat.includes('Fuel') || cat.includes('Travel')) return <Car size={16} color="#38bdf8" />;
    if (cat.includes('Food') || cat.includes('DA')) return <Utensils size={16} color="#fbbf24" />;
    if (cat.includes('Public') || cat.includes('Transport')) return <Train size={16} color="#a855f7" />;
    return <Receipt size={16} color="#10b981" />;
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Field Expense Manager</h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            Conveyance, Daily TA/DA, and School Trip Claims
          </p>
        </div>

        <button
          className="btn btn-primary btn-sm"
          onClick={() => setShowExpenseModal(true)}
          id="btn-add-expense"
        >
          <Plus size={16} /> New Claim
        </button>
      </div>

      {/* Expense KPI summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
        <div className="stat-card" style={{ padding: 12 }}>
          <div className="stat-label" style={{ fontSize: '0.68rem' }}>Total Claims</div>
          <div className="stat-value" style={{ fontSize: '1.2rem' }}>₹{totalClaimed}</div>
        </div>
        <div className="stat-card" style={{ padding: 12, borderColor: 'rgba(16, 185, 129, 0.3)' }}>
          <div className="stat-label" style={{ fontSize: '0.68rem', color: '#34d399' }}>Approved</div>
          <div className="stat-value" style={{ fontSize: '1.2rem', color: '#34d399' }}>₹{totalApproved}</div>
        </div>
        <div className="stat-card" style={{ padding: 12, borderColor: 'rgba(245, 158, 11, 0.3)' }}>
          <div className="stat-label" style={{ fontSize: '0.68rem', color: '#fbbf24' }}>Pending Review</div>
          <div className="stat-value" style={{ fontSize: '1.2rem', color: '#fbbf24' }}>₹{totalPending}</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {[
          { id: 'ALL', label: 'All Claims' },
          { id: 'PENDING', label: 'Pending Approval' },
          { id: 'APPROVED', label: 'Approved Claims' },
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

      {/* Expenses List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filteredExpenses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-dim)' }}>
            No expense claims match this filter.
          </div>
        ) : (
          filteredExpenses.map((exp) => {
            const isApproved = exp.status === 'APPROVED';
            const isPending = exp.status === 'PENDING';

            return (
              <div key={exp.id} className="expense-item">
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, flex: 1 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: 'rgba(30, 41, 59, 0.7)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {getCategoryIcon(exp.category)}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#fff' }}>
                        {exp.category}
                      </span>
                      <span className={`badge ${isApproved ? 'badge-green' : isPending ? 'badge-amber' : 'badge-red'}`}>
                        {exp.status}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: 2 }}>
                      {exp.schoolName ? `📍 ${exp.schoolName} • ` : ''}
                      👤 {exp.userName} • 🕒 {exp.date}
                    </div>

                    {exp.distanceKm && (
                      <div style={{ fontSize: '0.72rem', color: '#38bdf8', marginTop: 2 }}>
                        🚗 Distance: {exp.distanceKm} KM @ ₹{exp.ratePerKm || 8}/KM
                      </div>
                    )}

                    {exp.notes && (
                      <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', marginTop: 4 }}>
                        Note: {exp.notes}
                      </div>
                    )}

                    {/* Admin Approval info */}
                    {isApproved && exp.approvedBy && (
                      <div style={{ fontSize: '0.68rem', color: '#34d399', marginTop: 4 }}>
                        ✓ Approved by {exp.approvedBy} ({exp.approvedAt})
                      </div>
                    )}

                    {/* Admin Action Buttons (If Admin or current user is admin) */}
                    {currentUser.role === 'admin' && isPending && (
                      <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                        <button
                          className="btn btn-success btn-sm"
                          style={{ fontSize: '0.7rem', padding: '3px 8px' }}
                          onClick={() => updateExpenseStatus(exp.id, 'APPROVED')}
                        >
                          <CheckCircle size={12} /> Approve Claim
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          style={{ fontSize: '0.7rem', padding: '3px 8px' }}
                          onClick={() => updateExpenseStatus(exp.id, 'REJECTED', 'Insufficient documentation')}
                        >
                          <XCircle size={12} /> Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ textAlign: 'right', marginLeft: 10 }}>
                  <div className="expense-amount">₹{exp.amount}</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>{exp.paymentMode}</div>
                  {exp.receiptPhoto && (
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.65rem', padding: '2px 6px', marginTop: 4 }}
                      onClick={() => setViewReceipt(exp.receiptPhoto)}
                    >
                      Receipt
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Receipt Image Viewer Modal */}
      {viewReceipt && (
        <div className="modal-overlay" onClick={() => setViewReceipt(null)}>
          <div
            className="modal-content"
            style={{ maxWidth: 450, padding: 12, background: '#090d16', textAlign: 'center' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h4 style={{ marginBottom: 10, fontSize: '0.9rem' }}>Attached Receipt / Voucher</h4>
            <img
              src={viewReceipt}
              alt="Receipt Attachment"
              style={{ width: '100%', maxHeight: '60vh', objectFit: 'contain', borderRadius: 8 }}
            />
            <div style={{ marginTop: 12 }}>
              <button className="btn btn-secondary btn-sm" onClick={() => setViewReceipt(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <ExpenseModal
        isOpen={showExpenseModal}
        onClose={() => setShowExpenseModal(false)}
      />
    </div>
  );
}
