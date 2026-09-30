import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Signal } from 'lucide-react';

export default function MobileDeviceFrame({ children, isFrameEnabled }) {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!isFrameEnabled) {
    return <div className="main-content">{children}</div>;
  }

  return (
    <div className="device-container">
      <div className="device-frame">
        {/* Dynamic Island Notch */}
        <div className="device-notch">
          <div className="device-camera" />
        </div>

        {/* Mobile Device Status Bar */}
        <div className="device-statusbar">
          <div style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>{time || '09:41'}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Signal size={12} />
            <Wifi size={12} />
            <BatteryMedium size={14} />
          </div>
        </div>

        {/* Phone Content Viewport */}
        <div className="mobile-content-wrapper">{children}</div>
      </div>
    </div>
  );
}
