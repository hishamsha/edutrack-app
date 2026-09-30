import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MapPin,
  Clock,
  CheckCircle,
  Plus,
  Receipt,
  GraduationCap,
  Calendar,
  AlertCircle,
  Camera,
  Navigation,
  Sparkles,
  ArrowRight,
  LogOut,
  Layers,
  ChevronRight,
} from 'lucide-react';
import AttendanceCheckInModal from './AttendanceCheckInModal';
import CheckOutModal from './CheckOutModal';
import ActivityModal from './ActivityModal';
import ExpenseModal from './ExpenseModal';
import GpsCameraModal from './GpsCameraModal';

export default function HomeView() {
  const {
    currentUser,
    activeVisit,
    visits,
    tasks,
    expenses,
    toggleTaskStatus,
    setActiveTab,
  } = useApp();

  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showCheckOutModal, setShowCheckOutModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showGpsCameraModal, setShowGpsCameraModal] = useState(false);

  // Filter tasks for current user
  const userTasks = tasks.filter((t) => t.userId === currentUser.id);
  const todayVisits = visits.filter(
    (v) => v.userId === currentUser.id && v.date === new Date().toISOString().split('T')[0]
  );
  const userExpensesToday = expenses
    .filter((e) => e.userId === currentUser.id && e.date === new Date().toISOString().split('T')[0])
    .reduce((sum, e) => sum + Number(e.amount), 0);

  const completedVisitsCount = todayVisits.filter((v) => v.status === 'COMPLETED').length;

  return (
    <div>
      {/* Top Greeting Card */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginTop: 2 }}>
              Hello, {currentUser.name.split(' ')[0]} 👋
            </h2>
          </div>
          <div className="badge badge-blue">
            <span>{currentUser.zone.split('(')[0].trim()}</span>
          </div>
        </div>
      </div>

      {/* ACTIVE VISIT BANNER (If Checked In) */}
      {activeVisit ? (
        <div className="active-checkin-banner">
          <div className="active-visit-header">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="pulse-dot" />
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Live On-Duty Check-In
                </span>
              </div>
              <div className="active-visit-school">{activeVisit.schoolName}</div>
              <div style={{ fontSize: '0.75rem', color: '#cbd5e1', marginTop: 2 }}>
                📍 {activeVisit.schoolAddress}
              </div>
            </div>
            <div className="badge badge-green" style={{ fontSize: '0.7rem' }}>
              In Progress
            </div>
          </div>

          <div className="active-visit-meta">
            <span>
              <Clock size={14} color="#38bdf8" /> Since {activeVisit.checkInTime}
            </span>
            <span>
              <Navigation size={14} color="#34d399" /> {activeVisit.checkInLocation?.accuracy || 'GPS Verified'}
            </span>
            <span>
              <Layers size={14} color="#fbbf24" /> {activeVisit.activities?.length || 0} Activities Logged
            </span>
          </div>

          <div className="active-visit-actions">
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setShowActivityModal(true)}
              style={{ flex: 1 }}
              id="btn-log-activity-home"
            >
              <Camera size={15} /> Log Activity & Photo
            </button>
            <button
              className="btn btn-danger btn-sm"
              onClick={() => setShowCheckOutModal(true)}
              style={{ flex: 1 }}
              id="btn-checkout-home"
            >
              <LogOut size={15} /> Check-Out
            </button>
          </div>
        </div>
      ) : (
        /* HERO CHECK-IN CTA (When Not Checked In) */
        <div className="checkin-hero-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span className="badge badge-blue">Ready for Field Visit</span>
          </div>
          <h3 className="checkin-hero-title">Start Daily School Visit</h3>
          <p className="checkin-hero-desc">
            Check-in with real-time GPS location stamping, selfie/gate photo verification, and eliminate manual Google Forms!
          </p>
          <div>
            <button
              className="btn btn-success btn-lg"
              onClick={() => setShowCheckInModal(true)}
              id="btn-open-checkin-modal"
              style={{ width: '100%', maxWidth: 320 }}
            >
              <MapPin size={20} /> Mark School Attendance
            </button>
          </div>
        </div>
      )}

      {/* TODAY'S METRIC KPI CARDS */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">
            <span>Visits Today</span>
            <GraduationCap size={15} color="#38bdf8" />
          </div>
          <div className="stat-value">{completedVisitsCount} / {userTasks.length || 2}</div>
          <div className="stat-sub">{activeVisit ? '1 Active in progress' : 'All done so far'}</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">
            <span>Expenses</span>
            <Receipt size={15} color="#34d399" />
          </div>
          <div className="stat-value">₹{userExpensesToday}</div>
          <div className="stat-sub">Today's submitted claims</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">
            <span>Tasks Left</span>
            <Calendar size={15} color="#fbbf24" />
          </div>
          <div className="stat-value">
            {userTasks.filter((t) => t.status !== 'COMPLETED').length}
          </div>
          <div className="stat-sub">Schools on today's route</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">
            <span>Activities</span>
            <Layers size={15} color="#c084fc" />
          </div>
          <div className="stat-value">
            {todayVisits.reduce((acc, v) => acc + (v.activities?.length || 0), 0)}
          </div>
          <div className="stat-sub">Workshops & audits logged</div>
        </div>
      </div>

      {/* QUICK FLOATING ACTIONS ROW */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 20 }}>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => setShowGpsCameraModal(true)}
          style={{ flexDirection: 'column', padding: '10px 4px', gap: 4, background: 'rgba(56, 189, 248, 0.12)', borderColor: 'rgba(56, 189, 248, 0.3)' }}
          id="btn-quick-gps-camera"
          title="Open GPS Map Camera (Live / Override Mode)"
        >
          <Camera size={18} color="#38bdf8" />
          <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#38bdf8' }}>GPS Camera</span>
        </button>

        <button
          className="btn btn-secondary btn-sm"
          onClick={() => setShowExpenseModal(true)}
          style={{ flexDirection: 'column', padding: '10px 4px', gap: 4 }}
          id="btn-quick-expense"
        >
          <Receipt size={18} color="#34d399" />
          <span style={{ fontSize: '0.68rem' }}>Add Expense</span>
        </button>

        <button
          className="btn btn-secondary btn-sm"
          onClick={() => setActiveTab('schools')}
          style={{ flexDirection: 'column', padding: '10px 4px', gap: 4 }}
        >
          <GraduationCap size={18} color="#fbbf24" />
          <span style={{ fontSize: '0.68rem' }}>Schools</span>
        </button>

        <button
          className="btn btn-secondary btn-sm"
          onClick={() => setActiveTab('planner')}
          style={{ flexDirection: 'column', padding: '10px 4px', gap: 4 }}
        >
          <Calendar size={18} color="#c084fc" />
          <span style={{ fontSize: '0.68rem' }}>Tour Plan</span>
        </button>
      </div>

      {/* TODAY'S TOUR PLAN & ROUTE */}
      <div style={{ marginBottom: 24 }}>
        <div className="section-header">
          <h4 className="section-title">
            <Calendar size={18} color="#38bdf8" /> Today's School Route
          </h4>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setActiveTab('planner')}
            style={{ fontSize: '0.75rem', padding: '4px 8px' }}
          >
            Full Plan <ChevronRight size={14} />
          </button>
        </div>

        {userTasks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 20, color: 'var(--text-dim)', fontSize: '0.85rem' }}>
            No assigned visits scheduled for today yet.
          </div>
        ) : (
          userTasks.slice(0, 3).map((task) => {
            const isDone = task.status === 'COMPLETED';
            return (
              <div key={task.id} className="task-item">
                <button
                  className={`task-checkbox ${isDone ? 'checked' : ''}`}
                  onClick={() => toggleTaskStatus(task.id)}
                  title={isDone ? 'Mark as Pending' : 'Mark as Done'}
                >
                  {isDone && <CheckCircle size={14} />}
                </button>
                <div className="task-content">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span className="task-school">{task.schoolName}</span>
                    <span className="badge badge-amber" style={{ fontSize: '0.62rem', padding: '2px 6px' }}>
                      {task.time}
                    </span>
                  </div>
                  <div className={`task-title ${isDone ? 'completed' : ''}`}>
                    {task.title}
                  </div>
                  <div className="task-instructions">{task.instructions}</div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* RECENT FIELD ACTIVITY & PHOTOS */}
      <div style={{ marginBottom: 20 }}>
        <div className="section-header">
          <h4 className="section-title">
            <Camera size={18} color="#38bdf8" /> Recent Visit Photos & Activities
          </h4>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setActiveTab('visits')}
            style={{ fontSize: '0.75rem', padding: '4px 8px' }}
          >
            View All <ChevronRight size={14} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
          {visits
            .flatMap((v) =>
              (v.activities || []).flatMap((a) =>
                (a.photos || []).map((p) => ({
                  ...p,
                  schoolName: v.schoolName,
                  userName: v.userName,
                  activityTitle: a.title,
                }))
              )
            )
            .slice(0, 2)
            .map((item, idx) => (
              <div
                key={idx}
                className="glass-card"
                style={{ overflow: 'hidden', border: '1px solid var(--border-subtle)' }}
              >
                <img
                  src={item.url}
                  alt={item.caption}
                  style={{ width: '100%', height: 140, objectFit: 'cover' }}
                />
                <div style={{ padding: 12 }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8' }}>
                    {item.schoolName}
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', marginTop: 2 }}>
                    {item.activityTitle}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: 4 }}>
                    👤 {item.userName} • 🕒 {item.timestamp}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Modals */}
      <AttendanceCheckInModal
        isOpen={showCheckInModal}
        onClose={() => setShowCheckInModal(false)}
      />

      <CheckOutModal
        isOpen={showCheckOutModal}
        onClose={() => setShowCheckOutModal(false)}
        visit={activeVisit}
      />

      <ActivityModal
        isOpen={showActivityModal}
        onClose={() => setShowActivityModal(false)}
        visitId={activeVisit?.id}
        schoolName={activeVisit?.schoolName}
      />

      <ExpenseModal
        isOpen={showExpenseModal}
        onClose={() => setShowExpenseModal(false)}
      />

      <GpsCameraModal
        isOpen={showGpsCameraModal}
        onClose={() => setShowGpsCameraModal(false)}
      />
    </div>
  );
}
