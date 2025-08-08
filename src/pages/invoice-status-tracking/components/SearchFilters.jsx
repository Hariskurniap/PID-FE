import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const SearchFilters = ({ onSearch, onFilter, userRole }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    dateRange: '',
    vendor: '',
    sortBy: 'newest'
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  const statusOptions = [
    { value: '', label: 'Semua Status' },
    { value: 'dikirim', label: 'Dikirim' },
    { value: 'diterima', label: 'Diterima' },
    { value: 'diverifikasi', label: 'Diverifikasi' },
    { value: 'diteruskan', label: 'Diteruskan' },
    { value: 'rejected', label: 'Ditolak' }
  ];

  const dateRangeOptions = [
    { value: '', label: 'Semua Tanggal' },
    { value: 'today', label: 'Hari Ini' },
    { value: 'week', label: '7 Hari Terakhir' },
    { value: 'month', label: '30 Hari Terakhir' },
    { value: 'quarter', label: '3 Bulan Terakhir' },
    { value: 'custom', label: 'Rentang Kustom' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Terbaru' },
    { value: 'oldest', label: 'Terlama' },
    { value: 'amount_high', label: 'Jumlah Tertinggi' },
    { value: 'amount_low', label: 'Jumlah Terendah' },
    { value: 'status', label: 'Status' },
    { value: 'vendor', label: 'Vendor A-Z' }
  ];

  const vendorOptions = [
    { value: '', label: 'Semua Vendor' },
    { value: 'pt_maju_jaya', label: 'PT Maju Jaya Sentosa' },
    { value: 'cv_berkah', label: 'CV Berkah Mandiri' },
    { value: 'pt_sejahtera', label: 'PT Sejahtera Abadi' },
    { value: 'ud_makmur', label: 'UD Makmur Bersama' },
    { value: 'pt_global', label: 'PT Global Logistics' }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch && onSearch(searchQuery);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter && onFilter(newFilters);
  };

  const handleReset = () => {
    setSearchQuery('');
    const resetFilters = {
      status: '',
      dateRange: '',
      vendor: '',
      sortBy: 'newest'
    };
    setFilters(resetFilters);
    onSearch && onSearch('');
    onFilter && onFilter(resetFilters);
  };

  const hasActiveFilters = searchQuery || filters.status || filters.dateRange || filters.vendor || filters.sortBy !== 'newest';

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-4">
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              type="search"
              placeholder="Cari berdasarkan nomor referensi, invoice, atau vendor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <Button
            type="submit"
            variant="default"
            iconName="Search"
            iconPosition="left"
          >
            Cari
          </Button>
        </div>
      </form>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <Select
          options={statusOptions}
          value={filters.status}
          onChange={(value) => handleFilterChange('status', value)}
          placeholder="Status"
          className="w-40"
        />
        
        <Select
          options={dateRangeOptions}
          value={filters.dateRange}
          onChange={(value) => handleFilterChange('dateRange', value)}
          placeholder="Tanggal"
          className="w-40"
        />

        <Select
          options={sortOptions}
          value={filters.sortBy}
          onChange={(value) => handleFilterChange('sortBy', value)}
          placeholder="Urutkan"
          className="w-40"
        />

        <Button
          variant="outline"
          size="sm"
          iconName={showAdvanced ? "ChevronUp" : "ChevronDown"}
          iconPosition="right"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          Filter Lanjutan
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            iconPosition="left"
            onClick={handleReset}
            className="text-muted-foreground hover:text-foreground"
          >
            Reset
          </Button>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="border-t border-border pt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userRole === 'staff' && (
              <Select
                label="Vendor"
                options={vendorOptions}
                value={filters.vendor}
                onChange={(value) => handleFilterChange('vendor', value)}
                placeholder="Pilih vendor"
              />
            )}

            {filters.dateRange === 'custom' && (
              <>
                <Input
                  label="Tanggal Mulai"
                  type="date"
                  value={filters.startDate || ''}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                />
                <Input
                  label="Tanggal Akhir"
                  type="date"
                  value={filters.endDate || ''}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                />
              </>
            )}

            <Input
              label="Jumlah Minimum (IDR)"
              type="number"
              placeholder="0"
              value={filters.minAmount || ''}
              onChange={(e) => handleFilterChange('minAmount', e.target.value)}
            />

            <Input
              label="Jumlah Maksimum (IDR)"
              type="number"
              placeholder="999999999"
              value={filters.maxAmount || ''}
              onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
            />
          </div>

          {/* Filter Summary */}
          {hasActiveFilters && (
            <div className="mt-4 p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Filter" size={16} className="text-muted-foreground" />
                <span className="text-sm font-body font-medium text-foreground">
                  Filter Aktif:
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {searchQuery && (
                  <span className="inline-flex items-center space-x-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-caption">
                    <span>Pencarian: "{searchQuery}"</span>
                  </span>
                )}
                {filters.status && (
                  <span className="inline-flex items-center space-x-1 px-2 py-1 bg-secondary/10 text-secondary rounded-full text-xs font-caption">
                    <span>Status: {statusOptions.find(s => s.value === filters.status)?.label}</span>
                  </span>
                )}
                {filters.dateRange && (
                  <span className="inline-flex items-center space-x-1 px-2 py-1 bg-warning/10 text-warning rounded-full text-xs font-caption">
                    <span>Tanggal: {dateRangeOptions.find(d => d.value === filters.dateRange)?.label}</span>
                  </span>
                )}
                {filters.vendor && (
                  <span className="inline-flex items-center space-x-1 px-2 py-1 bg-success/10 text-success rounded-full text-xs font-caption">
                    <span>Vendor: {vendorOptions.find(v => v.value === filters.vendor)?.label}</span>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Export Options */}
      {userRole === 'staff' && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <div className="text-sm font-caption text-muted-foreground">
            Export hasil pencarian untuk laporan dan audit
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="FileText"
              iconPosition="left"
            >
              Export PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="FileSpreadsheet"
              iconPosition="left"
            >
              Export Excel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;