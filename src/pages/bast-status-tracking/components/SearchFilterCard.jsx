// src/pages/bast-status-tracking/components/SearchFilterCard.jsx
import React, { useState } from 'react';

const SearchFilterCard = ({ onSearch, onReset, isSearching }) => {
  const [filters, setFilters] = useState({
    searchTerm: '',
    status: '',
    startDate: '',
    endDate: ''
  });

  const handleInputChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleResetFilters = () => {
    setFilters({
      searchTerm: '',
      status: '',
      startDate: '',
      endDate: ''
    });
    onReset();
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
        Filter Pencarian
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-caption text-muted-foreground mb-1">
              Pencarian
            </label>
            <input
              type="text"
              placeholder="Cari nomor BAST, vendor..."
              value={filters.searchTerm}
              onChange={(e) => handleInputChange('searchTerm', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-caption text-muted-foreground mb-1">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Semua Status</option>
              <option value="DRAFT">DRAFT</option>
              <option value="DISETUJUI_APPROVER">DISETUJUI_APPROVER</option>
              <option value="SELESAI">SELESAI</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-caption text-muted-foreground mb-1">
              Dari Tanggal
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-caption text-muted-foreground mb-1">
              Sampai Tanggal
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="flex space-x-3 pt-2">
          <button
            type="submit"
            disabled={isSearching}
            className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSearching ? 'Mencari...' : 'Cari'}
          </button>
          <button
            type="button"
            onClick={handleResetFilters}
            className="px-4 py-2 border border-border text-foreground text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchFilterCard;