/**
 * Utilities to export data to CSV and formatted printable sheets
 */

export function downloadCSV(filename, csvContent) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportVisitsToCSV(visits) {
  const headers = [
    'Visit ID',
    'Date',
    'Field Representative',
    'School Name',
    'Check-In Time',
    'Check-Out Time',
    'Duration',
    'Status',
    'Visit Purpose',
    'Activities Recorded',
    'Total Participants Met',
    'Key Observations / Notes',
  ];

  const rows = visits.map((v) => {
    const activityTitles = (v.activities || []).map((a) => a.title).join(' | ');
    const totalParticipants = (v.activities || []).reduce((acc, a) => acc + (a.participantsCount || 0), 0);
    return [
      `"${v.id}"`,
      `"${v.date}"`,
      `"${v.userName}"`,
      `"${v.schoolName.replace(/"/g, '""')}"`,
      `"${v.checkInTime || ''}"`,
      `"${v.checkOutTime || 'Active In-Progress'}"`,
      `"${v.durationHours || 'Ongoing'}"`,
      `"${v.status}"`,
      `"${(v.purpose || '').replace(/"/g, '""')}"`,
      `"${activityTitles.replace(/"/g, '""')}"`,
      `"${totalParticipants}"`,
      `"${(v.notes || '').replace(/"/g, '""')}"`,
    ].join(',');
  });

  const csv = [headers.join(','), ...rows].join('\r\n');
  const filename = `EduTrack_Visits_Report_${new Date().toISOString().split('T')[0]}.csv`;
  downloadCSV(filename, csv);
}

export function exportExpensesToCSV(expenses) {
  const headers = [
    'Expense ID',
    'Date',
    'Colleague Name',
    'School / Destination',
    'Category',
    'Expense Type',
    'Amount (INR)',
    'Payment Mode',
    'Distance (KM)',
    'Status',
    'Approved By',
    'Approval Timestamp',
    'Remarks',
  ];

  const rows = expenses.map((e) => {
    return [
      `"${e.id}"`,
      `"${e.date}"`,
      `"${e.userName}"`,
      `"${(e.schoolName || '').replace(/"/g, '""')}"`,
      `"${e.category}"`,
      `"${e.type || ''}"`,
      `"${e.amount}"`,
      `"${e.paymentMode || 'Cash'}"`,
      `"${e.distanceKm || ''}"`,
      `"${e.status}"`,
      `"${e.approvedBy || ''}"`,
      `"${e.approvedAt || ''}"`,
      `"${(e.notes || '').replace(/"/g, '""')}"`,
    ].join(',');
  });

  const csv = [headers.join(','), ...rows].join('\r\n');
  const filename = `EduTrack_Expenses_Summary_${new Date().toISOString().split('T')[0]}.csv`;
  downloadCSV(filename, csv);
}
