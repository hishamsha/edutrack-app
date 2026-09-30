import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { stampWatermarkOnImage } from '../utils/watermark';
import {
  X,
  Camera,
  Navigation,
  Compass,
  Clock,
  MapPin,
  RefreshCw,
  Sparkles,
  Sliders,
  CheckCircle,
  Download,
  ShieldCheck,
  Calendar,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';

export default function GpsCameraModal({
  isOpen,
  onClose,
  onCapture,
  defaultSchoolId = '',
  defaultActivity = 'Field Attendance Gate Verification',
}) {
  const { schools, currentUser, showToast } = useApp();

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Camera state
  const [cameraActive, setCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' or 'user'
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [watermarkedPhoto, setWatermarkedPhoto] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  // School target
  const [selectedSchoolId, setSelectedSchoolId] = useState(defaultSchoolId || schools[0]?.id || '');
  const activeSchool = schools.find((s) => s.id === selectedSchoolId) || schools[0];

  // GPS & Location state
  const [useOverride, setUseOverride] = useState(false);
  const [showOverridePanel, setShowOverridePanel] = useState(false);

  // Live vs Custom GPS values
  const [lat, setLat] = useState(activeSchool?.lat || 28.4595);
  const [lng, setLng] = useState(activeSchool?.lng || 77.0266);
  const [address, setAddress] = useState(activeSchool?.address || 'Campus Main Entrance Gate');
  const [altitude, setAltitude] = useState('214m MSL');
  const [compass, setCompass] = useState('134° SE');
  const [accuracy, setAccuracy] = useState('3.4m (High Precision)');

  // Date & Time state
  const [customDate, setCustomDate] = useState(
    new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  );
  const [customTime, setCustomTime] = useState(
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
  );
  const [liveClock, setLiveClock] = useState('');

  // Live ticking seconds clock for HUD
  useEffect(() => {
    const updateLiveClock = () => {
      const now = new Date();
      setLiveClock(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
      );
    };
    updateLiveClock();
    const interval = setInterval(updateLiveClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Update presets when school changes
  useEffect(() => {
    if (activeSchool && !useOverride) {
      setLat(activeSchool.lat);
      setLng(activeSchool.lng);
      setAddress(activeSchool.address);
    }
  }, [activeSchool, useOverride]);

  // Start Camera Stream
  useEffect(() => {
    if (isOpen && !capturedPhoto) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [isOpen, facingMode, capturedPhoto]);

  const startCamera = async () => {
    stopCamera();
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: facingMode },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraActive(true);
        }
      } else {
        setCameraError('Camera API not accessible in this browser view. File upload is ready.');
      }
    } catch (err) {
      console.warn('Unable to access device camera:', err);
      setCameraError('Camera access unavailable. You can upload or use sample images.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  // Flip Camera
  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Apply Quick School Preset in Override Mode
  const handleQuickSchoolSelect = (schId) => {
    setSelectedSchoolId(schId);
    const sch = schools.find((s) => s.id === schId);
    if (sch) {
      setLat(sch.lat);
      setLng(sch.lng);
      setAddress(sch.address);
      showToast(`Locked GPS to ${sch.name}`, 'info');
    }
  };

  // Snap photo from camera stream
  const handleSnapPhoto = async () => {
    setIsProcessing(true);
    let rawSource = null;

    if (cameraActive && videoRef.current) {
      const video = videoRef.current;
      const offCanvas = document.createElement('canvas');
      offCanvas.width = video.videoWidth || 1280;
      offCanvas.height = video.videoHeight || 720;
      const ctx = offCanvas.getContext('2d');

      // Mirror if front camera
      if (facingMode === 'user') {
        ctx.translate(offCanvas.width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(video, 0, 0, offCanvas.width, offCanvas.height);
      rawSource = offCanvas.toDataURL('image/jpeg', 0.92);
    } else {
      // Use fallback campus sample photo
      rawSource = activeSchool?.imageUrl || '/images/campus_sample.jpg';
    }

    try {
      const coordsString = `${lat}° N, ${lng}° E`;
      const dateToUse = useOverride ? customDate : null;
      const timeToUse = useOverride ? customTime : liveClock;

      const stamped = await stampWatermarkOnImage({
        imageSource: rawSource,
        schoolName: activeSchool?.name || 'School Campus',
        repName: currentUser?.name || 'Field Officer',
        gpsCoords: coordsString,
        addressText: address,
        customDate: dateToUse,
        customTime: timeToUse,
        altitude,
        compass,
        accuracy,
        activityName: defaultActivity,
      });

      setCapturedPhoto(rawSource);
      setWatermarkedPhoto(stamped);
      stopCamera();
    } catch (e) {
      console.error('Error stamping photo:', e);
    } finally {
      setIsProcessing(false);
    }
  };

  // File upload fallback
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const coordsString = `${lat}° N, ${lng}° E`;
      const dateToUse = useOverride ? customDate : null;
      const timeToUse = useOverride ? customTime : liveClock;

      const stamped = await stampWatermarkOnImage({
        imageSource: file,
        schoolName: activeSchool?.name || 'School Campus',
        repName: currentUser?.name || 'Field Officer',
        gpsCoords: coordsString,
        addressText: address,
        customDate: dateToUse,
        customTime: timeToUse,
        altitude,
        compass,
        accuracy,
        activityName: defaultActivity,
      });

      setCapturedPhoto(URL.createObjectURL(file));
      setWatermarkedPhoto(stamped);
      stopCamera();
    } catch (err) {
      console.error('Failed to stamp uploaded photo:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Retake photo
  const handleRetake = () => {
    setCapturedPhoto(null);
    setWatermarkedPhoto(null);
    startCamera();
  };

  // Confirm photo capture
  const handleConfirm = () => {
    if (!watermarkedPhoto) return;

    if (onCapture) {
      onCapture(watermarkedPhoto, {
        lat: Number(lat),
        lng: Number(lng),
        address,
        date: useOverride ? customDate : new Date().toISOString().split('T')[0],
        time: useOverride ? customTime : liveClock,
        accuracy,
        schoolId: activeSchool?.id,
        schoolName: activeSchool?.name,
      });
    }

    onClose();
  };

  // Download watermarked photo directly
  const handleDownload = () => {
    if (!watermarkedPhoto) return;
    const link = document.createElement('a');
    link.href = watermarkedPhoto;
    link.download = `GPS_Photo_${activeSchool?.name.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('GPS Photo saved to device gallery!', 'success');
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: 580, padding: 0, overflow: 'hidden', background: '#090d16' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            background: 'rgba(17, 24, 39, 0.95)',
            borderBottom: '1px solid var(--border-subtle)',
            zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                background: 'rgba(56, 189, 248, 0.2)',
                color: '#38bdf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Camera size={16} />
            </div>
            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#fff' }}>
                GPS Map Camera & Geo-Stamp
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>
                {activeSchool?.name}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {/* HIDDEN / DISCREET OVERRIDE TOGGLE BUTTON */}
            <button
              type="button"
              className={`btn btn-sm ${useOverride ? 'btn-danger' : 'btn-secondary'}`}
              onClick={() => setShowOverridePanel(!showOverridePanel)}
              style={{ fontSize: '0.68rem', padding: '3px 8px', gap: 4 }}
              title="Discreet GPS & Timestamp Override Controls"
              id="btn-toggle-hidden-gps"
            >
              <Sliders size={12} />
              <span>{useOverride ? 'Custom Mode' : 'GPS Mode'}</span>
            </button>

            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* HIDDEN GPS & TIMESTAMP SIMULATOR PANEL */}
        {showOverridePanel && (
          <div
            style={{
              background: 'rgba(30, 41, 59, 0.95)',
              borderBottom: '2px solid #ef4444',
              padding: '12px 16px',
              animation: 'slideUp 0.2s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', fontWeight: 700, color: '#f87171' }}>
                <ShieldCheck size={14} /> GPS Location & Timestamp Override (Custom Mode)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Enable Custom Values:</span>
                <input
                  type="checkbox"
                  checked={useOverride}
                  onChange={(e) => setUseOverride(e.target.checked)}
                  style={{ width: 16, height: 16, accentColor: '#ef4444', cursor: 'pointer' }}
                  id="chk-enable-gps-override"
                />
              </div>
            </div>

            {/* Quick School Presets */}
            <div style={{ marginBottom: 10 }}>
              <label style={{ fontSize: '0.68rem', color: 'var(--text-dim)', fontWeight: 600 }}>
                Quick Lock to Registered School (Auto-fills Coordinates & Address):
              </label>
              <select
                className="form-select"
                style={{ fontSize: '0.75rem', padding: '4px 8px', marginTop: 2 }}
                value={selectedSchoolId}
                onChange={(e) => handleQuickSchoolSelect(e.target.value)}
              >
                {schools.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.city}) — Lat: {s.lat}, Lng: {s.lng}
                  </option>
                ))}
              </select>
            </div>

            {/* Custom Coordinates & Altitude */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 8 }}>
              <div>
                <label style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>Latitude</label>
                <input
                  type="number"
                  step="0.0001"
                  className="form-input"
                  style={{ fontSize: '0.75rem', padding: '4px 6px' }}
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>Longitude</label>
                <input
                  type="number"
                  step="0.0001"
                  className="form-input"
                  style={{ fontSize: '0.75rem', padding: '4px 6px' }}
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>Altitude</label>
                <input
                  type="text"
                  className="form-input"
                  style={{ fontSize: '0.75rem', padding: '4px 6px' }}
                  value={altitude}
                  onChange={(e) => setAltitude(e.target.value)}
                  placeholder="214m MSL"
                />
              </div>
            </div>

            {/* Custom Date & Time Picker */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
              <div>
                <label style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>Custom Date (Stamped)</label>
                <input
                  type="text"
                  className="form-input"
                  style={{ fontSize: '0.75rem', padding: '4px 6px' }}
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  placeholder="e.g. 30-Sep-2026"
                />
              </div>
              <div>
                <label style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>Custom Time (Stamped)</label>
                <input
                  type="text"
                  className="form-input"
                  style={{ fontSize: '0.75rem', padding: '4px 6px' }}
                  value={customTime}
                  onChange={(e) => setCustomTime(e.target.value)}
                  placeholder="e.g. 09:30:15 AM"
                />
              </div>
            </div>

            {/* Custom Address */}
            <div>
              <label style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>Custom Address / Gate Name</label>
              <input
                type="text"
                className="form-input"
                style={{ fontSize: '0.75rem', padding: '4px 6px' }}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Main Gate, Sector 45, Gurgaon"
              />
            </div>
          </div>
        )}

        {/* CAMERA VIEWFINDER / CAPTURED PREVIEW */}
        <div style={{ position: 'relative', width: '100%', height: 360, background: '#000', overflow: 'hidden' }}>
          {watermarkedPhoto ? (
            /* PREVIEW OF STAMPED PHOTO */
            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
              <img
                src={watermarkedPhoto}
                alt="Stamped GPS Photo"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: 10,
                  left: 10,
                  background: 'rgba(16, 185, 129, 0.9)',
                  color: '#fff',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  padding: '3px 8px',
                  borderRadius: 6,
                }}
              >
                ✓ GPS PHOTO GENERATED
              </div>
            </div>
          ) : cameraActive ? (
            /* LIVE VIDEO STREAM */
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              {/* Viewfinder Target Crosshairs */}
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 80,
                  height: 80,
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  borderRadius: 12,
                  pointerEvents: 'none',
                }}
              >
                <div style={{ position: 'absolute', top: 0, left: 38, width: 4, height: 8, background: '#38bdf8' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 38, width: 4, height: 8, background: '#38bdf8' }} />
                <div style={{ position: 'absolute', left: 0, top: 38, width: 8, height: 4, background: '#38bdf8' }} />
                <div style={{ position: 'absolute', right: 0, top: 38, width: 8, height: 4, background: '#38bdf8' }} />
              </div>
            </>
          ) : (
            /* CAMERA UNAVAILABLE / FALLBACK SCREEN */
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 20,
                textAlign: 'center',
                background: 'linear-gradient(180deg, #0f172a 0%, #090d16 100%)',
              }}
            >
              <Camera size={44} color="#38bdf8" style={{ marginBottom: 12 }} />
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>
                GPS Camera Viewfinder Ready
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', maxWidth: 360, marginTop: 4 }}>
                {cameraError || 'Live GPS coordinate simulation active. Snap to generate watermark on school photo.'}
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => document.getElementById('camera-file-input').click()}
                >
                  Upload Local Photo
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={handleSnapPhoto}
                >
                  <Sparkles size={14} /> Snap School Campus Photo
                </button>
              </div>
            </div>
          )}

          {/* REAL-TIME LIVE HUD OVERLAY (When viewfinder is active and not yet captured) */}
          {!watermarkedPhoto && (
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(0deg, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0) 100%)',
                padding: '16px 14px 8px',
                pointerEvents: 'none',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#38bdf8' }}>
                    📍 {activeSchool?.name}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#cbd5e1', marginTop: 1 }}>
                    🌐 {lat}° N, {lng}° E • {altitude}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>
                    🕒 {useOverride ? `${customDate} ${customTime}` : liveClock}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div
                    style={{
                      display: 'inline-block',
                      background: useOverride ? '#ef4444' : '#10b981',
                      color: '#fff',
                      fontSize: '0.58rem',
                      fontWeight: 800,
                      padding: '2px 6px',
                      borderRadius: 4,
                    }}
                  >
                    {useOverride ? 'CUSTOM GPS' : 'GPS LOCKED'}
                  </div>
                  <div style={{ fontSize: '0.62rem', color: '#38bdf8', marginTop: 2 }}>
                    Acc: {accuracy}
                  </div>
                </div>
              </div>
            </div>
          )}

          <input
            id="camera-file-input"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileUpload}
          />
        </div>

        {/* BOTTOM ACTION CONTROLS */}
        <div style={{ padding: '14px 16px', background: '#111827', borderTop: '1px solid var(--border-subtle)' }}>
          {watermarkedPhoto ? (
            /* POST-CAPTURE ACTIONS */
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleRetake}
                style={{ flex: 1 }}
              >
                <RefreshCw size={14} /> Retake
              </button>

              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleDownload}
                style={{ flex: 1 }}
                title="Download stamped photo"
              >
                <Download size={14} /> Download
              </button>

              <button
                type="button"
                className="btn btn-success btn-sm"
                onClick={handleConfirm}
                style={{ flex: 2 }}
                id="btn-confirm-gps-photo"
              >
                <CheckCircle size={15} /> Use This Photo
              </button>
            </div>
          ) : (
            /* PRE-CAPTURE SHUTTER CONTROLS */
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => document.getElementById('camera-file-input').click()}
                title="Upload Photo File"
              >
                Upload File
              </button>

              {/* Shutter Button */}
              <button
                type="button"
                onClick={handleSnapPhoto}
                disabled={isProcessing}
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #38bdf8 0%, #2563eb 100%)',
                  border: '4px solid #ffffff',
                  boxShadow: '0 0 16px rgba(56, 189, 248, 0.6)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  transition: 'transform 0.15s ease',
                }}
                id="btn-camera-shutter"
                title="Capture GPS Stamped Photo"
              >
                <Camera size={26} />
              </button>

              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={toggleFacingMode}
                title="Flip Front/Rear Camera"
              >
                <RefreshCw size={14} /> Flip
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
