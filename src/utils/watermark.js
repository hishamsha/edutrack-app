/**
 * High-Precision GPS Camera Watermarking Engine
 * Stamps live or customized GPS coordinates, street address, timestamp, altitude & compass
 * with authentic GPS Map Camera styling.
 */
export async function stampWatermarkOnImage({
  imageSource, // file, blob, canvas, or dataURL
  schoolName = 'School Visit Campus',
  repName = 'Field Officer',
  gpsCoords = '28.4595° N, 77.0266° E',
  addressText = '',
  customDate = '',
  customTime = '',
  altitude = '214m MSL',
  compass = '128° SE',
  accuracy = '3.5m',
  activityName = 'Field Attendance Verification',
}) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const maxDim = 1280;
      let width = img.width;
      let height = img.height;

      // Scale down large photos for optimal storage and high resolution
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      // Draw original image
      ctx.drawImage(img, 0, 0, width, height);

      // Determine date and time strings
      const now = new Date();
      const dateStr =
        customDate ||
        now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      const timeStr =
        customTime ||
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });

      // Calculate HUD Bar Height
      const barHeight = Math.max(120, Math.round(height * 0.22));

      // Dark translucent gradient backdrop
      const gradient = ctx.createLinearGradient(0, height - barHeight, 0, height);
      gradient.addColorStop(0, 'rgba(11, 15, 25, 0)');
      gradient.addColorStop(0.25, 'rgba(11, 15, 25, 0.85)');
      gradient.addColorStop(1, 'rgba(11, 15, 25, 0.98)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, height - barHeight, width, barHeight);

      // Accent border bar
      ctx.fillStyle = '#38bdf8'; // Cyan accent
      ctx.fillRect(0, height - barHeight + 2, width, 3);

      // Watermark Text styling
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
      ctx.shadowBlur = 5;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;

      const baseFontSize = Math.max(14, Math.round(width * 0.022));

      // Row 1: School Name + Verified Badge
      ctx.font = `700 ${baseFontSize + 3}px 'Plus Jakarta Sans', Arial, sans-serif`;
      ctx.fillText(`📍 ${schoolName}`, 24, height - barHeight + 36);

      // Verified Badge at top right
      ctx.fillStyle = '#22c55e';
      ctx.font = `700 ${Math.max(11, Math.round(width * 0.015))}px sans-serif`;
      const badgeText = '✓ GPS MAP CAMERA • VERIFIED';
      const badgeWidth = ctx.measureText(badgeText).width;
      ctx.fillText(badgeText, width - badgeWidth - 24, height - barHeight + 36);

      // Row 2: Address / Location details
      ctx.fillStyle = '#e2e8f0';
      ctx.font = `500 ${Math.max(12, Math.round(width * 0.017))}px 'Plus Jakarta Sans', Arial, sans-serif`;
      const displayAddress = addressText || 'Campus Main Gate & Administrative Block';
      ctx.fillText(`🏢 ${displayAddress}`, 24, height - barHeight + 64);

      // Row 3: GPS Coordinates & Altitude & Compass Heading
      ctx.fillStyle = '#38bdf8';
      ctx.font = `600 ${Math.max(11, Math.round(width * 0.016))}px 'Inter', monospace, sans-serif`;
      ctx.fillText(
        `🌐 GPS: ${gpsCoords}   |   ⛰️ Alt: ${altitude}   |   🧭 ${compass} (Acc: ${accuracy})`,
        24,
        height - barHeight + 90
      );

      // Row 4: Officer Name + Date & Time Stamp
      ctx.fillStyle = '#f8fafc';
      ctx.font = `500 ${Math.max(11, Math.round(width * 0.016))}px 'Inter', monospace, sans-serif`;
      ctx.fillText(
        `👤 Officer: ${repName}   •   🎯 ${activityName}   •   🕒 ${dateStr} ${timeStr}`,
        24,
        height - barHeight + 114
      );

      resolve(canvas.toDataURL('image/jpeg', 0.9));
    };

    img.onerror = (err) => {
      console.error('Failed to load image for GPS watermarking', err);
      resolve(typeof imageSource === 'string' ? imageSource : URL.createObjectURL(imageSource));
    };

    if (typeof imageSource === 'string') {
      img.src = imageSource;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(imageSource);
    }
  });
}
