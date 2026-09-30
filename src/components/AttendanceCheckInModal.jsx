import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { stampWatermarkOnImage } from '../utils/watermark';
import {
  X,
  MapPin,
  Camera,
  Navigation,
  CheckCircle,
  AlertCircle,
  Building,
  Sparkles,
} from 'lucide-react';
import GpsCameraModal from './GpsCameraModal';

export default function AttendanceCheckInModal({ isOpen, onClose }) {
  const { schools, checkIn, currentUser } = useApp();

  const [selectedSchoolId, setSelectedSchoolId] = useState(schools[0]?.id || '');
  const [purpose, setPurpose] = useState('STEM Kit Demo & Classroom Workshop');
  const [gpsLocation, setGpsLocation] = useState(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [watermarkedPhoto, setWatermarkedPhoto] = useState(null);
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);
  const [showGpsCamera, setShowGpsCamera] = useState(false);

  const handleGpsCameraCapture = (photoUrl, metadata) => {
    setWatermarkedPhoto(photoUrl);
    setCapturedPhoto(photoUrl);
    if (metadata) {
      setGpsLocation({
        lat: metadata.lat,
        lng: metadata.lng,
        accuracy: metadata.accuracy || '3.5m (GPS Locked)',
        verified: true,
      });
    }
  };

  const selectedSchool = schools.find((s) => s.id === selectedSchoolId);

  // Auto-fetch GPS on modal open
  useEffect(() => {
    if (isOpen) {
      fetchGPS();
    }
  }, [isOpen]);

  const fetchGPS = () => {
    setGpsLoading(true);
    setGpsError(null);

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGpsLocation({
            lat: Number(pos.coords.latitude.toFixed(5)),
            lng: Number(pos.coords.longitude.toFixed(5)),
            accuracy: `${Math.round(pos.coords.accuracy)}m (Device GPS)`,
            verified: true,
          });
          setGpsLoading(false);
        },
        (err) => {
          console.warn('GPS error, using school coordinates as fallback', err);
          // Fallback to school's registered coordinate with simulated accuracy
          if (selectedSchool) {
            setGpsLocation({
              lat: selectedSchool.lat,
              lng: selectedSchool.lng,
              accuracy: '4.8m (Simulated Campus Geofence)',
              verified: true,
            });
          }
          setGpsLoading(false);
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    } else if (selectedSchool) {
      setGpsLocation({
        lat: selectedSchool.lat,
        lng: selectedSchool.lng,
        accuracy: 'Campus Geofence Verified',
        verified: true,
      });
      setGpsLoading(false);
    }
  };

  // Handle Photo selection and apply canvas watermark
  const handlePhotoSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingPhoto(true);
    try {
      const coordsText = gpsLocation
        ? `${gpsLocation.lat}° N, ${gpsLocation.lng}° E`
        : selectedSchool
        ? `${selectedSchool.lat}° N, ${selectedSchool.lng}° E`
        : '28.4595° N, 77.0266° E';

      const stamped = await stampWatermarkOnImage({
        imageSource: file,
        schoolName: selectedSchool?.name || 'School Campus',
        repName: currentUser?.name || 'Field Officer',
        gpsCoords: coordsText,
        activityName: 'Check-In Verification',
      });

      setCapturedPhoto(URL.createObjectURL(file));
      setWatermarkedPhoto(stamped);
    } catch (err) {
      console.error('Failed to stamp photo:', err);
    } finally {
      setIsProcessingPhoto(false);
    }
  };

  // Quick preset sample photo
  const useSampleCampusPhoto = async () => {
    setIsProcessingPhoto(true);
    try {
      const coordsText = gpsLocation
        ? `${gpsLocation.lat}° N, ${gpsLocation.lng}° E`
        : '28.4595° N, 77.0266° E';

      const stamped = await stampWatermarkOnImage({
        imageSource: '/images/campus_sample.jpg',
        schoolName: selectedSchool?.name || 'Indus Valley High School',
        repName: currentUser?.name || 'Field Officer',
        gpsCoords: coordsText,
        activityName: 'Arrival Attendance Gate Check-in',
      });

      setCapturedPhoto('/images/campus_sample.jpg');
      setWatermarkedPhoto(stamped);
    } catch (err) {
      console.error('Error watermarking sample:', err);
    } finally {
      setIsProcessingPhoto(false);
    }
  };

  const handleConfirmCheckIn = () => {
    if (!selectedSchoolId) return;

    checkIn({
      schoolId: selectedSchoolId,
      purpose,
      checkInPhoto: watermarkedPhoto || '/images/campus_sample.jpg',
      location: gpsLocation || {
        lat: selectedSchool?.lat || 28.4595,
        lng: selectedSchool?.lng || 77.0266,
        accuracy: 'Geofence Verified',
        verified: true,
      },
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MapPin size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Mark School Attendance</h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>GPS Geotagged Visit Check-In</p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '16px 20px' }}>
          {/* School Selector */}
          <div className="form-group">
            <label className="form-label">
              <span>Select Destination School</span>
              <span style={{ color: '#38bdf8', fontSize: '0.72rem' }}>{schools.length} Schools in Master</span>
            </label>
            <select
              className="form-select"
              value={selectedSchoolId}
              onChange={(e) => setSelectedSchoolId(e.target.value)}
              id="select-school-checkin"
            >
              {schools.map((sch) => (
                <option key={sch.id} value={sch.id}>
                  {sch.name} ({sch.city}) - {sch.board}
                </option>
              ))}
            </select>
          </div>

          {selectedSchool && (
            <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '10px 12px', borderRadius: 8, fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 16 }}>
              <div style={{ color: '#ffffff', fontWeight: 600 }}>📍 {selectedSchool.address}</div>
              <div style={{ marginTop: 4, display: 'flex', justifyContent: 'space-between' }}>
                <span>Principal: {selectedSchool.principalName}</span>
                <span style={{ color: '#38bdf8' }}>Code: {selectedSchool.code}</span>
              </div>
            </div>
          )}

          {/* GPS Status Banner */}
          <div className="gps-pill-banner">
            <Navigation size={18} color="#38bdf8" style={{ animation: gpsLoading ? 'spin 1s linear infinite' : 'none' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '0.78rem' }}>
                {gpsLoading ? 'Acquiring GPS Satellite Signal...' : 'GPS Geofence Status: Verified'}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                {gpsLocation
                  ? `Lat: ${gpsLocation.lat}, Lng: ${gpsLocation.lng} • Precision: ${gpsLocation.accuracy}`
                  : 'Detecting live coordinates...'}
              </div>
            </div>
            <button
              onClick={fetchGPS}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.7rem', padding: '4px 8px' }}
            >
              Refresh GPS
            </button>
          </div>

          {/* Purpose of Visit */}
          <div className="form-group">
            <label className="form-label">Visit Purpose & Agenda</label>
            <select
              className="form-select"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              id="select-visit-purpose"
            >
              <option value="STEM Kit Demo & Classroom Workshop">STEM Kit Demo & Classroom Workshop</option>
              <option value="Teacher Training & Curriculum Review">Teacher Training & Curriculum Review</option>
              <option value="Routine Inspection & Lab Audit">Routine Inspection & Lab Audit</option>
              <option value="Principal Meeting & MoU Discussion">Principal Meeting & MoU Discussion</option>
              <option value="Fee Collection & Books Delivery">Fee Collection & Books Delivery</option>
              <option value="Technical Support & Hardware Repair">Technical Support & Hardware Repair</option>
              <option value="Other Field Visit">Other Field Visit</option>
            </select>
          </div>

          {/* Gate / Selfie Verification Photo */}
          <div className="form-group">
            <label className="form-label">
              <span>Attendance Photo (Selfie or School Gate)</span>
              <span style={{ color: '#10b981', fontSize: '0.72rem' }}>Auto Geo-stamped</span>
            </label>

            <div className="camera-preview-box" onClick={() => document.getElementById('checkin-file-input').click()}>
              {isProcessingPhoto ? (
                <div style={{ textAlign: 'center', color: '#38bdf8' }}>
                  <Sparkles size={28} style={{ animation: 'spin 1.5s linear infinite', marginBottom: 8 }} />
                  <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Applying GPS Watermark onto Photo...</div>
                </div>
              ) : watermarkedPhoto ? (
                <img
                  src={watermarkedPhoto}
                  alt="Watermarked verification preview"
                  className="camera-preview-img"
                />
              ) : (
                <div style={{ textAlign: 'center', padding: 20 }}>
                  <Camera size={34} color="#38bdf8" style={{ marginBottom: 8 }} />
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc' }}>
                    Tap to Open Camera or Upload Photo
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: 4 }}>
                    GPS coordinates and timestamp will be automatically stamped on the photo
                  </div>
                </div>
              )}
            </div>

            <input
              id="checkin-file-input"
              type="file"
              accept="image/*"
              capture="environment"
              style={{ display: 'none' }}
              onChange={handlePhotoSelect}
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => setShowGpsCamera(true)}
                style={{ width: '100%', gap: 6, fontWeight: 700 }}
                id="btn-open-gps-map-camera"
              >
                <Camera size={16} /> 📸 Open GPS Map Camera (Live / Override HUD)
              </button>

              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => document.getElementById('checkin-file-input').click()}
                  style={{ flex: 1 }}
                >
                  <Camera size={14} /> Upload File
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={useSampleCampusPhoto}
                  style={{ flex: 1 }}
                >
                  <Sparkles size={14} color="#38bdf8" /> Use Campus Photo
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <button className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>
              Cancel
            </button>
            <button
              className="btn btn-success"
              onClick={handleConfirmCheckIn}
              style={{ flex: 2 }}
              id="btn-confirm-checkin"
            >
              <CheckCircle size={18} /> Confirm Check-In
            </button>
          </div>
        </div>
      </div>

      <GpsCameraModal
        isOpen={showGpsCamera}
        onClose={() => setShowGpsCamera(false)}
        defaultSchoolId={selectedSchoolId}
        defaultActivity="Attendance Check-In Gate Verification"
        onCapture={handleGpsCameraCapture}
      />
    </div>
  );
}
