// Bast-status-tracking/components/BastList.jsx
import React, { useState } from 'react';
import BastDetails from './BastDetails';

const BastList = () => {
  const [selectedBast, setSelectedBast] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Contoh data dummy — ganti dengan API call nanti
  const bastData = [
    {
      idBast: 'BAST-V2AH7QAH5',
      nomorBast: 'B3950238452-22220016',
      vendor: 'PT. METRODATA ELECTRONICS TBK',
      tanggalBuat: '2025-04-01',
      status: 'DISETUJUI_APPROVER',
      prioritas: 'Normal'
    },
    {
      idBast: 'BAST-Z9XK8LMP2',
      nomorBast: 'B3950238453-22220017',
      vendor: 'PT. SOLUSI DATA INDONESIA',
      tanggalBuat: '2025-04-03',
      status: 'DRAFT',
      prioritas: 'Tinggi'
    }
  ];

  const handleViewDetails = (bast) => {
    setSelectedBast(bast);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBast(null);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nomor BAST</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prioritas</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bastData.map((bast) => (
              <tr key={bast.idBast} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{bast.nomorBast}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bast.vendor}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bast.tanggalBuat}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    bast.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' :
                    bast.status === 'DISETUJUI_APPROVER' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {bast.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{bast.prioritas}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleViewDetails(bast)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Lihat Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Detail */}
      {isModalOpen && selectedBast && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Detail BAST</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  &times;
                </button>
              </div>
              <BastDetails bast={selectedBast} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BastList;