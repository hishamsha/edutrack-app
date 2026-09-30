import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { stampWatermarkOnImage } from '../utils/watermark';
import {
  X,
  Camera,
  Layers,
  Sparkles,
  Users,
  CheckCircle,
  Image,
} from 'lucide-react';
import GpsCameraModal from './GpsCameraModal';

export default function ActivityModal({ isOpen, onClose, visitId, schoolName }) {
  const { addActivity, currentUser } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Interactive Workshop');
  const [participantsCount, setParticipantsCount] = useState(35);
  const [staffMet, setStaffMet] = useState('Science Teacher & Lab Assistant');
  const [description, setDescription] = useState('');
  const [photoCaption, setPhotoCaption] = useState('Classroom session in progress');
  const [watermarkedPhoto, setWatermarkedPhoto] = useState(null);
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);
  const [showGpsCamera, setShowGpsCamera] = useState(false);

  if (!isOpen) return null;

  const handlePhotoSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingPhoto(true);
    try {
      const stamped = await stampWatermarkOnImage({
        imageSource: file,
        schoolName: schoolName || 'School Visit',
        repName: currentUser?.name || 'Field Officer',
        gpsCoords: '28.4595° N, 77.0266° E',
        activityName: category,
      });
      setWatermarkedPhoto(stamped);
    } catch (err) {
      console.error('Error stamping activity photo:', err);
    } finally {
      setIsProcessingPhoto(false);
    }
  };

  const useSampleWorkshopPhoto = async () => {
    setIsProcessingPhoto(true);
    try {
      const stamped = await stampWatermarkOnImage({
        imageSource: '/images/workshop_sample.jpg',
        schoolName: schoolName || 'School Visit',
        repName: currentUser?.name || 'Field Officer',
        gpsCoords: '28.4595° N, 77.0266° E',
        activityName: `${category} Activity`,
      });
      setWatermarkedPhoto(stamped);
    } catch (err) {
      console.error('Error stamping sample workshop photo:', err);
    } finally {
      setIsProcessingPhoto(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return;

    const photosList = watermarkedPhoto
      ? [
          {
            url: watermarkedPhoto,
            caption: photoCaption || title,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            watermark: `${schoolName} | ${currentUser?.name} | Verified`,
          },
        ]
      : [];

    addActivity(visitId, {
      title,
      category,
      participantsCount: Number(participantsCount) || 0,
      staffMet,
      description,
      photos: photosList,
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Layers size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Log School Activity</h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Record session & geo-stamped photos</p>
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
          {/* Activity Category */}
          <div className="form-group">
            <label className="form-label">Activity Category</label>
            <select
              className="form-select"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                if (!title) setTitle(`${e.target.value} with Students`);
              }}
            >
              <option value="Interactive Workshop">Interactive Workshop / Hands-on Lab</option>
              <option value="STEM Kit Demo">STEM Kit Demo & Walkthrough</option>
              <option value="Teacher Training">Teacher Training & Orientation</option>
              <option value="Lab & Hardware Inspection">Lab & Hardware Inspection</option>
              <option value="Principal & Management Meeting">Principal & Management Meeting</option>
              <option value="Book & Kit Distribution">Book & Kit Distribution</option>
              <option value="Student Assessment / Quiz">Student Assessment / Quiz</option>
              <option value="Assembly Presentation">Morning Assembly Presentation</option>
            </select>
          </div>

          {/* Activity Title */}
          <div className="form-group">
            <label className="form-label">Activity Title</label>
            <input
              type="text"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Grade 8 Robotics Sensor Assembly"
              required
            />
          </div>

          {/* Metrics row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Students / Attendees</label>
              <input
                type="number"
                className="form-input"
                value={participantsCount}
                onChange={(e) => setParticipantsCount(e.target.value)}
                min="0"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Staff / Faculty Met</label>
              <input
                type="text"
                className="form-input"
                value={staffMet}
                onChange={(e) => setStaffMet(e.target.value)}
                placeholder="e.g. Science HOD"
              />
            </div>
          </div>

          {/* Activity Description */}
          <div className="form-group">
            <label className="form-label">Detailed Notes / Activities Done</label>
            <textarea
              className="form-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What topics were covered? How was student enthusiasm? Any issues resolved?"
              rows={2}
            />
          </div>

          {/* Photo Capture & Live Watermark */}
          <div className="form-group">
            <label className="form-label">
              <span>Activity Proof Photo</span>
              <span style={{ color: '#38bdf8', fontSize: '0.72rem' }}>With Geo & Time Stamping</span>
            </label>

            <div
              className="camera-preview-box"
              style={{ height: 180 }}
              onClick={() => document.getElementById('activity-photo-input').click()}
            >
              {isProcessingPhoto ? (
                <div style={{ textAlign: 'center', color: '#38bdf8' }}>
                  <Sparkles size={24} style={{ animation: 'spin 1.5s linear infinite', marginBottom: 6 }} />
                  <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>Stamping Geo-Watermark...</div>
                </div>
              ) : watermarkedPhoto ? (
                <img
                  src={watermarkedPhoto}
                  alt="Activity watermark preview"
                  className="camera-preview-img"
                />
              ) : (
                <div style={{ textAlign: 'center', padding: 12 }}>
                  <Camera size={28} color="#38bdf8" style={{ marginBottom: 6 }} />
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f8fafc' }}>
                    Capture Classroom / Lab Photo
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: 2 }}>
                    Tap to snap camera or upload file
                  </div>
                </div>
              )}
            </div>

            <input
              id="activity-photo-input"
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
                id="btn-activity-open-gps-camera"
              >
                <Camera size={16} /> 📸 Open GPS Map Camera (Live / Custom HUD)
              </button>

              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => document.getElementById('activity-photo-input').click()}
                  style={{ flex: 1 }}
                >
                  <Camera size={14} /> Upload File
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={useSampleWorkshopPhoto}
                  style={{ flex: 1 }}
                >
                  <Sparkles size={14} color="#38bdf8" /> Use Workshop Sample
                </button>
              </div>
            </div>
          </div>

          {watermarkedPhoto && (
            <div className="form-group">
              <label className="form-label">Photo Caption</label>
              <input
                type="text"
                className="form-input"
                value={photoCaption}
                onChange={(e) => setPhotoCaption(e.target.value)}
                placeholder="e.g. Students demonstrating obstacle avoidance robot"
              />
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 2 }} id="btn-save-activity">
              <CheckCircle size={16} /> Save Activity & Photo
            </button>
          </div>
        </form>
      </div>

      <GpsCameraModal
        isOpen={showGpsCamera}
        onClose={() => setShowGpsCamera(false)}
        defaultActivity={category}
        onCapture={(photoUrl) => {
          setWatermarkedPhoto(photoUrl);
          setShowGpsCamera(false);
        }}
      />
    </div>
  );
}
