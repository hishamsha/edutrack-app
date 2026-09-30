import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import MobileDeviceFrame from './components/MobileDeviceFrame';
import ToastContainer from './components/ToastContainer';

import HomeView from './components/HomeView';
import VisitsView from './components/VisitsView';
import ExpensesView from './components/ExpensesView';
import SchoolsView from './components/SchoolsView';
import PlannerView from './components/PlannerView';
import AdminView from './components/AdminView';

import './App.css';

function MainApp() {
  const { activeTab, isMobileFrame } = useApp();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'home':
        return <HomeView />;
      case 'visits':
        return <VisitsView />;
      case 'expenses':
        return <ExpensesView />;
      case 'schools':
        return <SchoolsView />;
      case 'planner':
        return <PlannerView />;
      case 'admin':
        return <AdminView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="app-container">
      <Navbar />

      <MobileDeviceFrame isFrameEnabled={isMobileFrame}>
        {renderActiveView()}
      </MobileDeviceFrame>

      <BottomNav />
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
