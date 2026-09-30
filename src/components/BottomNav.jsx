import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  MapPin,
  Receipt,
  GraduationCap,
  CalendarCheck,
  ShieldCheck,
} from 'lucide-react';

export default function BottomNav() {
  const { activeTab, setActiveTab, currentUser, activeVisit } = useApp();

  const tabs = [
    { id: 'home', label: 'Home', icon: LayoutDashboard },
    {
      id: 'visits',
      label: 'Visits',
      icon: MapPin,
      badge: activeVisit ? 'LIVE' : null,
    },
    { id: 'expenses', label: 'Expenses', icon: Receipt },
    { id: 'schools', label: 'Schools', icon: GraduationCap },
    { id: 'planner', label: 'Plan & Notes', icon: CalendarCheck },
    {
      id: 'admin',
      label: 'Admin Hub',
      icon: ShieldCheck,
      highlight: currentUser?.role === 'admin',
    },
  ];

  return (
    <nav className="bottom-nav">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            className={`nav-tab-item ${isActive ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            id={`tab-btn-${tab.id}`}
          >
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={20} strokeWidth={isActive ? 2.4 : 1.8} />
              {tab.badge && (
                <span
                  style={{
                    position: 'absolute',
                    top: -4,
                    right: -10,
                    background: '#10b981',
                    color: '#fff',
                    fontSize: '0.55rem',
                    fontWeight: 800,
                    padding: '1px 4px',
                    borderRadius: '4px',
                    lineHeight: 1,
                  }}
                >
                  {tab.badge}
                </span>
              )}
            </div>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
