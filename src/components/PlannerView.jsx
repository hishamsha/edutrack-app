import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CalendarCheck,
  FileText,
  Plus,
  CheckCircle,
  Clock,
  Pin,
  Trash2,
  Tag,
  AlertTriangle,
  Mic,
} from 'lucide-react';
import AddTaskModal from './AddTaskModal';
import AddNoteModal from './AddNoteModal';

export default function PlannerView() {
  const {
    tasks,
    currentUser,
    toggleTaskStatus,
    deleteTask,
    notes,
    togglePinNote,
    deleteNote,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState('TASKS'); // 'TASKS' or 'NOTES'
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);

  // User's tasks
  const userTasks = tasks.filter((t) => t.userId === currentUser.id);

  // User's notes (sorted by pinned first)
  const userNotes = [...notes].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Tour Plan & Field Notes</h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
            Daily scheduled route, targets & school observations
          </p>
        </div>

        {activeSubTab === 'TASKS' ? (
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setShowTaskModal(true)}
            id="btn-add-tour-task"
          >
            <Plus size={16} /> New Visit Plan
          </button>
        ) : (
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setShowNoteModal(true)}
            id="btn-add-field-note"
          >
            <Plus size={16} /> Add Field Note
          </button>
        )}
      </div>

      {/* Sub tabs: Tour Plan / Daily Tasks vs Field Notes */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 18, borderBottom: '1px solid var(--border-subtle)', paddingBottom: 10 }}>
        <button
          onClick={() => setActiveSubTab('TASKS')}
          className={`btn btn-sm ${activeSubTab === 'TASKS' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <CalendarCheck size={15} /> Tour Plan & Checklist ({userTasks.length})
        </button>
        <button
          onClick={() => setActiveSubTab('NOTES')}
          className={`btn btn-sm ${activeSubTab === 'NOTES' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <FileText size={15} /> Field Observations & Notes ({userNotes.length})
        </button>
      </div>

      {activeSubTab === 'TASKS' ? (
        /* TOUR PLAN / TASKS LIST */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {userTasks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-dim)' }}>
              No tasks scheduled for you today. Tap "New Visit Plan" to schedule a visit!
            </div>
          ) : (
            userTasks.map((task) => {
              const isDone = task.status === 'COMPLETED';

              return (
                <div
                  key={task.id}
                  className="task-item"
                  style={{
                    borderLeft: isDone ? '3px solid #10b981' : '3px solid #38bdf8',
                  }}
                >
                  <button
                    className={`task-checkbox ${isDone ? 'checked' : ''}`}
                    onClick={() => toggleTaskStatus(task.id)}
                    title={isDone ? 'Mark as Incomplete' : 'Mark as Complete'}
                  >
                    {isDone && <CheckCircle size={14} />}
                  </button>

                  <div className="task-content">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
                      <span className="task-school">📍 {task.schoolName}</span>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <span className="badge badge-amber" style={{ fontSize: '0.65rem' }}>
                          <Clock size={11} /> {task.time}
                        </span>
                        <span className="badge badge-blue" style={{ fontSize: '0.62rem' }}>
                          {task.priority}
                        </span>
                      </div>
                    </div>

                    <div className={`task-title ${isDone ? 'completed' : ''}`}>
                      {task.title}
                    </div>

                    <div className="task-instructions">{task.instructions}</div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, paddingTop: 6, borderTop: '1px solid rgba(255,255,255,0.04)', fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                      <span>Assigned by: {task.assignedBy}</span>
                      <button
                        onClick={() => deleteTask(task.id)}
                        style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: 2 }}
                        title="Delete task"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* FIELD NOTES LIST */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {userNotes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-dim)' }}>
              No notes recorded yet. Record feedback, issues, or leads from schools.
            </div>
          ) : (
            userNotes.map((note) => (
              <div
                key={note.id}
                className="glass-card"
                style={{
                  padding: 14,
                  border: note.pinned ? '1px solid var(--accent-sky)' : '1px solid var(--border-subtle)',
                  background: note.pinned ? 'rgba(30, 58, 138, 0.25)' : 'var(--bg-card)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>
                        <Tag size={10} /> {note.category}
                      </span>
                      {note.pinned && (
                        <span style={{ fontSize: '0.7rem', color: '#38bdf8', fontWeight: 600 }}>
                          📌 Pinned
                        </span>
                      )}
                    </div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '6px 0 2px', color: '#fff' }}>
                      {note.title}
                    </h4>
                    <div style={{ fontSize: '0.72rem', color: '#38bdf8' }}>
                      📍 {note.schoolName}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      onClick={() => togglePinNote(note.id)}
                      style={{ background: 'none', border: 'none', color: note.pinned ? '#38bdf8' : 'var(--text-dim)', cursor: 'pointer' }}
                      title="Pin note"
                    >
                      <Pin size={15} />
                    </button>
                    <button
                      onClick={() => deleteNote(note.id)}
                      style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}
                      title="Delete note"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                <div style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: 8, lineHeight: 1.5 }}>
                  {note.content}
                </div>

                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: 10, display: 'flex', justifyContent: 'space-between' }}>
                  <span>Logged by {note.userName}</span>
                  <span>{note.date}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <AddTaskModal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
      />

      <AddNoteModal
        isOpen={showNoteModal}
        onClose={() => setShowNoteModal(false)}
      />
    </div>
  );
}
