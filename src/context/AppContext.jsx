import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  STORAGE_KEYS,
  INITIAL_USERS,
  INITIAL_SCHOOLS,
  INITIAL_VISITS,
  INITIAL_EXPENSES,
  INITIAL_TASKS,
  INITIAL_NOTES,
  loadFromStorage,
  saveToStorage,
} from '../data/mockData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Load states from localStorage or use initial defaults
  const [users, setUsers] = useState(() => loadFromStorage(STORAGE_KEYS.USERS, INITIAL_USERS));
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = loadFromStorage(STORAGE_KEYS.CURRENT_USER, null);
    // Default to Arun Sharma (Field Officer) for immediate mobile experience
    return saved || INITIAL_USERS[1];
  });
  const [schools, setSchools] = useState(() => loadFromStorage(STORAGE_KEYS.SCHOOLS, INITIAL_SCHOOLS));
  const [visits, setVisits] = useState(() => loadFromStorage(STORAGE_KEYS.VISITS, INITIAL_VISITS));
  const [expenses, setExpenses] = useState(() => loadFromStorage(STORAGE_KEYS.EXPENSES, INITIAL_EXPENSES));
  const [tasks, setTasks] = useState(() => loadFromStorage(STORAGE_KEYS.TASKS, INITIAL_TASKS));
  const [notes, setNotes] = useState(() => loadFromStorage(STORAGE_KEYS.NOTES, INITIAL_NOTES));

  // UI state
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'visits', 'expenses', 'schools', 'planner', 'notes', 'admin'
  const [isMobileFrame, setIsMobileFrame] = useState(false); // Can toggle smartphone frame simulation
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [toasts, setToasts] = useState([]);

  // Sync state changes to localStorage
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.USERS, users);
  }, [users]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.CURRENT_USER, currentUser);
  }, [currentUser]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.SCHOOLS, schools);
  }, [schools]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.VISITS, visits);
  }, [visits]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.EXPENSES, expenses);
  }, [expenses]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.TASKS, tasks);
  }, [tasks]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.NOTES, notes);
  }, [notes]);

  // Online / Offline monitor
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      showToast('You are back online. All data synced!', 'success');
    };
    const handleOffline = () => {
      setIsOnline(false);
      showToast('Working in Offline Mode. Data will be saved locally.', 'warning');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Toast helper
  const showToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // User Actions
  const switchUser = (userId) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
      showToast(`Switched account to ${user.name} (${user.role === 'admin' ? 'Admin' : 'Field Officer'})`, 'info');
      // If switched to admin, set active tab to admin
      if (user.role === 'admin') {
        setActiveTab('admin');
      } else {
        setActiveTab('home');
      }
    }
  };

  const addUser = (userData) => {
    const newUser = {
      ...userData,
      id: `user_${Date.now()}`,
      avatar: userData.role === 'admin' ? '👨‍💼' : '🎒',
    };
    setUsers((prev) => [...prev, newUser]);
    showToast(`Added colleague ${newUser.name}`, 'success');
    return newUser;
  };

  // Find currently active check-in for the logged in user
  const activeVisit = visits.find(
    (v) => v.userId === currentUser?.id && v.status === 'CHECKED_IN'
  );

  // Check In to a school
  const checkIn = ({ schoolId, purpose, checkInPhoto, location }) => {
    const school = schools.find((s) => s.id === schoolId);
    if (!school) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toISOString().split('T')[0];

    const newVisit = {
      id: `vis_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      schoolId: school.id,
      schoolName: school.name,
      schoolAddress: school.address,
      date: dateStr,
      checkInTime: timeStr,
      checkOutTime: null,
      durationHours: null,
      status: 'CHECKED_IN',
      purpose: purpose || 'General School Visit & Assessment',
      checkInLocation: location || {
        lat: school.lat,
        lng: school.lng,
        accuracy: 'Device GPS verified',
        verified: true,
      },
      checkInPhoto: checkInPhoto || school.imageUrl || '/images/campus_sample.jpg',
      activities: [],
      notes: '',
    };

    setVisits((prev) => [newVisit, ...prev]);

    // Also update matching task if exists
    setTasks((prev) =>
      prev.map((t) =>
        t.schoolId === schoolId && t.userId === currentUser.id && t.status === 'PENDING'
          ? { ...t, status: 'IN_PROGRESS' }
          : t
      )
    );

    // Fire celebratory confetti!
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
    });

    showToast(`Checked in at ${school.name}! Have a great session.`, 'success');
  };

  // Add Activity to a Visit
  const addActivity = (visitId, activityData) => {
    const newActivity = {
      id: `act_${Date.now()}`,
      ...activityData,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setVisits((prev) =>
      prev.map((v) => {
        if (v.id === visitId) {
          return {
            ...v,
            activities: [...(v.activities || []), newActivity],
          };
        }
        return v;
      })
    );

    showToast('Activity & stamped photo logged successfully!', 'success');
  };

  // Check Out from a Visit
  const checkOut = (visitId, summaryData) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setVisits((prev) =>
      prev.map((v) => {
        if (v.id === visitId) {
          return {
            ...v,
            status: 'COMPLETED',
            checkOutTime: timeStr,
            durationHours: summaryData.durationHours || '3h 15m',
            satisfactionRating: summaryData.rating || 5,
            notes: summaryData.notes || v.notes,
            summaryData: summaryData,
          };
        }
        return v;
      })
    );

    // Mark corresponding task as COMPLETED
    setTasks((prev) =>
      prev.map((t) =>
        t.userId === currentUser.id && t.status === 'IN_PROGRESS'
          ? { ...t, status: 'COMPLETED' }
          : t
      )
    );

    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.6 },
    });

    showToast('Visit completed & attendance report submitted!', 'success');
  };

  // Expense Management
  const addExpense = (expenseData) => {
    const newExpense = {
      id: `exp_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      date: new Date().toISOString().split('T')[0],
      status: 'PENDING',
      approvedBy: null,
      approvedAt: null,
      ...expenseData,
    };

    setExpenses((prev) => [newExpense, ...prev]);
    showToast(`Claim of ₹${newExpense.amount} submitted for approval`, 'success');
  };

  const updateExpenseStatus = (expenseId, status, remarks = '') => {
    setExpenses((prev) =>
      prev.map((e) => {
        if (e.id === expenseId) {
          return {
            ...e,
            status,
            adminRemarks: remarks,
            approvedBy: currentUser.name,
            approvedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
        }
        return e;
      })
    );

    showToast(`Expense claim marked as ${status}`, status === 'APPROVED' ? 'success' : 'info');
  };

  // Task / Daily Plan Management
  const addTask = (taskData) => {
    const newTask = {
      id: `tsk_${Date.now()}`,
      userId: taskData.userId || currentUser.id,
      userName: users.find((u) => u.id === (taskData.userId || currentUser.id))?.name || currentUser.name,
      date: new Date().toISOString().split('T')[0],
      status: 'PENDING',
      assignedBy: currentUser.role === 'admin' ? `${currentUser.name} (Admin)` : 'Self Planned',
      ...taskData,
    };

    setTasks((prev) => [newTask, ...prev]);
    showToast('New school visit task scheduled', 'success');
  };

  const toggleTaskStatus = (taskId) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const nextStatus = t.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

  const deleteTask = (taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    showToast('Task removed from plan', 'info');
  };

  // Notes Management
  const addNote = (noteData) => {
    const newNote = {
      id: `not_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      date: new Date().toISOString().split('T')[0],
      pinned: false,
      ...noteData,
    };

    setNotes((prev) => [newNote, ...prev]);
    showToast('Field observation note saved', 'success');
  };

  const togglePinNote = (noteId) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === noteId ? { ...n, pinned: !n.pinned } : n))
    );
  };

  const deleteNote = (noteId) => {
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
    showToast('Note deleted', 'info');
  };

  // Add School
  const addSchool = (schoolData) => {
    const newSchool = {
      id: `sch_${Date.now()}`,
      imageUrl: '/images/campus_sample.jpg',
      status: 'Active Partner',
      ...schoolData,
    };

    setSchools((prev) => [...prev, newSchool]);
    showToast(`Added ${newSchool.name} to directory`, 'success');
  };

  // Update School
  const updateSchool = (schoolId, updatedData) => {
    setSchools((prev) =>
      prev.map((s) => (s.id === schoolId ? { ...s, ...updatedData } : s))
    );
    // Also update any pending tasks or visits mentioning this school
    setVisits((prev) =>
      prev.map((v) => (v.schoolId === schoolId ? { ...v, schoolName: updatedData.name || v.schoolName, schoolAddress: updatedData.address || v.schoolAddress } : v))
    );
    showToast(`Updated details for ${updatedData.name || 'school'}`, 'success');
  };

  // Delete School
  const deleteSchool = (schoolId) => {
    const target = schools.find((s) => s.id === schoolId);
    setSchools((prev) => prev.filter((s) => s.id !== schoolId));
    showToast(`Removed ${target?.name || 'school'} from directory`, 'info');
  };

  // Update Trainer / User Profile
  const updateUser = (userId, updatedData) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, ...updatedData } : u))
    );
    if (currentUser?.id === userId) {
      setCurrentUser((prev) => ({ ...prev, ...updatedData }));
    }
    showToast(`Updated trainer/colleague profile for ${updatedData.name || 'user'}`, 'success');
  };

  // Delete Trainer / User
  const deleteUser = (userId) => {
    if (currentUser?.id === userId) {
      showToast('Cannot delete the currently active user profile. Please switch accounts first.', 'warning');
      return;
    }
    const target = users.find((u) => u.id === userId);
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    showToast(`Removed colleague ${target?.name || ''}`, 'info');
  };

  // Update Visit
  const updateVisit = (visitId, updatedData) => {
    setVisits((prev) =>
      prev.map((v) => (v.id === visitId ? { ...v, ...updatedData } : v))
    );
    showToast('Visit details updated', 'success');
  };

  // Reset to initial seed data
  const resetToDefaultData = () => {
    localStorage.clear();
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[1]);
    setSchools(INITIAL_SCHOOLS);
    setVisits(INITIAL_VISITS);
    setExpenses(INITIAL_EXPENSES);
    setTasks(INITIAL_TASKS);
    setNotes(INITIAL_NOTES);
    showToast('Reset system to default sample data', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        users,
        currentUser,
        switchUser,
        addUser,
        schools,
        addSchool,
        updateSchool,
        deleteSchool,
        visits,
        activeVisit,
        checkIn,
        addActivity,
        checkOut,
        updateVisit,
        expenses,
        addExpense,
        updateExpenseStatus,
        tasks,
        addTask,
        toggleTaskStatus,
        deleteTask,
        notes,
        addNote,
        togglePinNote,
        deleteNote,
        addUser,
        updateUser,
        deleteUser,
        activeTab,
        setActiveTab,
        isMobileFrame,
        setIsMobileFrame,
        isOnline,
        toasts,
        showToast,
        removeToast,
        resetToDefaultData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
