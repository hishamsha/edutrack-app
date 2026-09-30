import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Receipt,
  Camera,
  Car,
  Utensils,
  Train,
  CheckCircle,
  FileText,
  IndianRupee,
} from 'lucide-react';

export default function ExpenseModal({ isOpen, onClose }) {
  const { schools, addExpense } = useApp();

  const [category, setCategory] = useState('Travel / Conveyance');
  const [selectedSchoolId, setSelectedSchoolId] = useState(schools[0]?.id || '');
  const [amount, setAmount] = useState('');
  const [distanceKm, setDistanceKm] = useState('');
  const [ratePerKm, setRatePerKm] = useState(8); // Default ₹8/km
  const [paymentMode, setPaymentMode] = useState('UPI');
  const [notes, setNotes] = useState('');
  const [receiptPhoto, setReceiptPhoto] = useState(null);

  if (!isOpen) return null;

  const handleKmChange = (val) => {
    setDistanceKm(val);
    if (val && !isNaN(val)) {
      setAmount(Math.round(Number(val) * ratePerKm));
    }
  };

  const handleRateChange = (val) => {
    setRatePerKm(val);
    if (distanceKm && !isNaN(distanceKm)) {
      setAmount(Math.round(Number(distanceKm) * Number(val)));
    }
  };

  const handleReceiptUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptPhoto(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;

    const school = schools.find((s) => s.id === selectedSchoolId);

    addExpense({
      schoolId: school ? school.id : null,
      schoolName: school ? school.name : 'General Travel',
      category,
      amount: Number(amount),
      distanceKm: category === 'Travel / Conveyance' && distanceKm ? Number(distanceKm) : null,
      ratePerKm: category === 'Travel / Conveyance' && distanceKm ? Number(ratePerKm) : null,
      paymentMode,
      receiptPhoto,
      notes: notes || `${category} during school visit`,
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Receipt size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Submit Expense Claim</h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Conveyance, Food DA, Bills & Receipts</p>
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
          {/* Category Selector */}
          <div className="form-group">
            <label className="form-label">Expense Category</label>
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              id="select-expense-category"
            >
              <option value="Travel / Conveyance">Travel / Fuel Mileage (KM calculation)</option>
              <option value="Public Transport / Cab">Public Transport / Cab / Metro / Auto</option>
              <option value="Daily Food Allowance (DA)">Daily Food Allowance (DA) & Refreshment</option>
              <option value="Stationery & Printing">Stationery, Kit Materials & Printouts</option>
              <option value="Hotel / Lodging">Hotel / Outstation Lodging</option>
              <option value="Miscellaneous">Miscellaneous Field Expense</option>
            </select>
          </div>

          {/* Destination School */}
          <div className="form-group">
            <label className="form-label">Associated School / Destination</label>
            <select
              className="form-select"
              value={selectedSchoolId}
              onChange={(e) => setSelectedSchoolId(e.target.value)}
            >
              <option value="">General Field Travel (Multiple Schools / Route)</option>
              {schools.map((sch) => (
                <option key={sch.id} value={sch.id}>
                  {sch.name} ({sch.city})
                </option>
              ))}
            </select>
          </div>

          {/* Conditional KM Mileage Calculator */}
          {category === 'Travel / Conveyance' ? (
            <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: 14, borderRadius: 12, border: '1px solid var(--border-subtle)', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', fontWeight: 700, color: '#38bdf8', marginBottom: 10 }}>
                <Car size={16} /> Distance Mileage Calculator
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Distance Travelled (KM)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={distanceKm}
                    onChange={(e) => handleKmChange(e.target.value)}
                    placeholder="e.g. 35"
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Vehicle Rate (₹/KM)</label>
                  <select
                    className="form-select"
                    value={ratePerKm}
                    onChange={(e) => handleRateChange(e.target.value)}
                  >
                    <option value={8}>₹8 / KM (Car / 4-Wheeler)</option>
                    <option value={4.5}>₹4.5 / KM (Bike / 2-Wheeler)</option>
                    <option value={10}>₹10 / KM (Outstation AC)</option>
                  </select>
                </div>
              </div>

              <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Computed Claim Amount:</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#34d399' }}>₹{amount || 0}</span>
              </div>
            </div>
          ) : (
            <div className="form-group">
              <label className="form-label">Claim Amount (INR ₹)</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontWeight: 700 }}>
                  ₹
                </span>
                <input
                  type="number"
                  className="form-input"
                  style={{ paddingLeft: 28 }}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 250"
                  required
                  min="1"
                  id="input-expense-amount"
                />
              </div>
            </div>
          )}

          {/* Payment Mode */}
          <div className="form-group">
            <label className="form-label">Paid Via</label>
            <select
              className="form-select"
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
            >
              <option value="UPI">UPI / Google Pay / PhonePe</option>
              <option value="Cash">Cash in Hand</option>
              <option value="Corporate Card">Company Card</option>
              <option value="Metro Smart Card">Metro / Bus Smart Card</option>
            </select>
          </div>

          {/* Receipt Attachment */}
          <div className="form-group">
            <label className="form-label">
              <span>Bill / Fuel Receipt (Optional)</span>
              <span style={{ color: 'var(--text-dim)', fontSize: '0.7rem' }}>Camera / Gallery</span>
            </label>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 14px',
                border: '1px dashed var(--border-subtle)',
                borderRadius: 10,
                background: 'rgba(15, 23, 42, 0.5)',
                cursor: 'pointer',
              }}
              onClick={() => document.getElementById('expense-receipt-input').click()}
            >
              <Camera size={22} color="#38bdf8" />
              <div style={{ flex: 1, fontSize: '0.8rem', color: receiptPhoto ? '#34d399' : 'var(--text-muted)' }}>
                {receiptPhoto ? '✓ Receipt Photo Attached' : 'Attach Bill or Fuel Slip Photo'}
              </div>
              <input
                id="expense-receipt-input"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleReceiptUpload}
              />
            </div>
          </div>

          {/* Remarks */}
          <div className="form-group">
            <label className="form-label">Notes / Route Details</label>
            <textarea
              className="form-textarea"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Toll booth charges and round trip fuel between schools..."
              rows={2}
            />
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 2 }} id="btn-submit-expense">
              <CheckCircle size={16} /> Submit Claim
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
