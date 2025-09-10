// Bast-status-tracking/components/SearchFilters.jsx
import React, { useState } from 'react';

const SearchFilters = () => {
  const [filters, setFilters] = useState({
    nomorBast: '',
    vendor: '',
    status: '',
    tanggalMulai: '',
    tanggalAkhir: ''
  });

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = () => {
    // Implementasi pencarian — bisa trigger API call
    console.log('Cari dengan filter:', filters);
    alert('Fitur pencarian akan memicu reload daftar BAST sesuai filter');
  };

  const handleReset = () => {
    setFilters({
      nomorBast: '',
      vendor: '',
      status: '',
      tanggalMulai: '',
      tanggalAkhir: ''
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <h3 className="text-lg font-medium mb-4">Filter Pencarian</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nomor BAST</label>
          <input
            type="text"
            value={filters.nomorBast}
            onChange={(e) => handleFilterChange('nomorBast', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Cari nomor BAST"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Vendor</label>
          <input
            type="text"
            value={filters.vendor}
            onChange={(e) => handleFilterChange('vendor', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Nama vendor"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Semua Status</option>
            <option value="DRAFT">DRAFT</option>
            <option value="DISETUJUI_APPROVER">DISETUJUI_APPROVER</option>
            <option value="SELESAI">SELESAI</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Dari Tanggal</label>
          <input
            type="date"
            value={filters.tanggalMulai}
            onChange={(e) => handleFilterChange('tanggalMulai', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Sampai Tanggal</label>
          <input
            type="date"
            value={filters.tanggalAkhir}
            onChange={(e) => handleFilterChange('tanggalAkhir', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>
      <div className="mt-4 flex space-x-3">
        <button
          onClick={handleSearch}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Cari
        </button>
        <button
          onClick={handleReset}
          className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default SearchFilters;