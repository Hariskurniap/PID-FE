// Bast-status-tracking/components/StatusTimeline.jsx
import React from 'react';

const StatusTimeline = ({ bastId }) => {
  // Contoh data dummy — ganti dengan API call berdasarkan bastId
  const timeline = [
    { status: 'DRAFT', date: '2025-04-01 10:30', user: 'system@pertamina.com', note: 'BAST dibuat' },
    { status: 'DISETUJUI_APPROVER', date: '2025-04-03 14:15', user: 'approver@pertamina.com', note: 'Disetujui oleh Approver' }
  ];

  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
      {timeline.map((item, index) => (
        <div key={index} className="relative pb-8">
          {index !== timeline.length - 1 && (
            <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-300" aria-hidden="true"></span>
          )}
          <div className="relative flex items-start space-x-3">
            <div>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 ring-8 ring-white">
                <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </span>
            </div>
            <div className="min-w-0 flex-1 py-1.5">
              <div className="text-sm text-gray-500">
                <span className="font-medium text-gray-900">{item.status}</span> oleh {item.user}
              </div>
              <div className="mt-0.5 text-xs text-gray-500">
                {item.date}
              </div>
              {item.note && (
                <div className="mt-2 text-sm text-gray-700 bg-gray-50 p-2 rounded">
                  {item.note}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatusTimeline;