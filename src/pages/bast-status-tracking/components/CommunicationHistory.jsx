// Bast-status-tracking/components/CommunicationHistory.jsx
import React from 'react';

const CommunicationHistory = ({ bastId }) => {
  // Contoh data dummy — ganti dengan API call berdasarkan bastId
  const communications = [
    { type: 'email', from: 'vendor@metrodata.co.id', to: 'bast-team@pertamina.com', subject: 'Konfirmasi Dokumen Pendukung', date: '2025-04-02 09:00', content: 'Dokumen telah kami upload, mohon dicek.' },
    { type: 'system', from: 'system', to: 'all', subject: 'Status Updated', date: '2025-04-03 14:15', content: 'Status BAST berubah menjadi DISETUJUI_APPROVER.' }
  ];

  return (
    <div className="space-y-4">
      {communications.map((comm, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                comm.type === 'email' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
              }`}>
                {comm.type === 'email' ? '📧 Email' : '🤖 System'}
              </span>
              <span className="text-sm font-medium text-gray-900">{comm.subject}</span>
            </div>
            <span className="text-xs text-gray-500">{comm.date}</span>
          </div>
          <div className="mb-2">
            <span className="text-xs text-gray-500">Dari: </span>
            <span className="text-sm text-gray-900">{comm.from}</span>
            <span className="mx-2 text-gray-300">→</span>
            <span className="text-xs text-gray-500">Kepada: </span>
            <span className="text-sm text-gray-900">{comm.to}</span>
          </div>
          <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
            {comm.content}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommunicationHistory;