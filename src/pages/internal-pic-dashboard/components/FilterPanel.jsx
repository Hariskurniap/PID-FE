import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const FilterPanel = ({ onFiltersChange, isCollapsed, onToggleCollapse }) => {
  const [filters, setFilters] = useState({
    vendor: '',
    dateRange: 'today',
    status: 'all',
    urgency: 'all',
    assignedTo: 'all'
  });

  const [savedFilters, setSavedFilters] = useState([
    { id: 1, name: "Pending Today", filters: { status: 'pending', dateRange: 'today' } },
    { id: 2, name: "Overdue Items", filters: { urgency: 'overdue', status: 'reviewing' } },
    { id: 3, name: "My Reviews", filters: { assignedTo: 'me', status: 'reviewing' } }
  ]);

  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [filterName, setFilterName] = useState('');

  const dateRangeOptions = [
    { value: 'today', label: 'Hari Ini' },
    { value: 'yesterday', label: 'Kemarin' },
    { value: 'this_week', label: 'Minggu Ini' },
    { value: 'last_week', label: 'Minggu Lalu' },
    { value: 'this_month', label: 'Bulan Ini' },
    { value: 'last_month', label: 'Bulan Lalu' },
    { value: 'custom', label: 'Rentang Kustom' }
  ];

  const statusOptions = [
    { value: 'all', label: 'Semua Status' },
    { value: 'pending', label: 'Menunggu Review' },
    { value: 'reviewing', label: 'Sedang Direview' },
    { value: 'approved', label: 'Disetujui' },
    { value: 'rejected', label: 'Ditolak' }
  ];

  const urgencyOptions = [
    { value: 'all', label: 'Semua Prioritas' },
    { value: 'normal', label: 'Normal' },
    { value: 'urgent', label: 'Mendesak' },
    { value: 'overdue', label: 'Terlambat' }
  ];

  const assignedToOptions = [
    { value: 'all', label: 'Semua Staff' },
    { value: 'me', label: 'Ditugaskan ke Saya' },
    { value: 'unassigned', label: 'Belum Ditugaskan' },
    { value: 'ahmad_staff', label: 'Ahmad Wijaya' },
    { value: 'sari_staff', label: 'Sari Indah' },
    { value: 'budi_staff', label: 'Budi Santoso' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleApplyPreset = (preset) => {
    setFilters(preset.filters);
    onFiltersChange(preset.filters);
  };

  const handleSaveFilter = () => {
    if (filterName.trim()) {
      const newFilter = {
        id: Date.now(),
        name: filterName,
        filters: { ...filters }
      };
      setSavedFilters([...savedFilters, newFilter]);
      setFilterName('');
      setShowSaveDialog(false);
    }
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      vendor: '',
      dateRange: 'today',
      status: 'all',
      urgency: 'all',
      assignedTo: 'all'
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.vendor) count++;
    if (filters.dateRange !== 'today') count++;
    if (filters.status !== 'all') count++;
    if (filters.urgency !== 'all') count++;
    if (filters.assignedTo !== 'all') count++;
    return count;
  };

  return (
    <div className={`bg-card border-r border-border transition-all duration-300 ${
      isCollapsed ? 'w-12' : 'w-80'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h3 className="text-lg font-heading font-semibold text-foreground">
                Filter & Pencarian
              </h3>
              <p className="text-sm font-caption text-muted-foreground">
                Kelola kriteria pencarian
              </p>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            iconName={isCollapsed ? "ChevronRight" : "ChevronLeft"}
          />
        </div>
      </div>

      {!isCollapsed && (
        <div className="p-4 space-y-6">
          {/* Quick Actions */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-body font-medium text-foreground">
              Filter Aktif ({getActiveFilterCount()})
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              iconName="X"
              iconPosition="left"
            >
              Bersihkan
            </Button>
          </div>

          {/* Saved Filter Presets */}
          <div>
            <h4 className="text-sm font-body font-medium text-foreground mb-3">
              Filter Tersimpan
            </h4>
            <div className="space-y-2">
              {savedFilters.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleApplyPreset(preset)}
                  className="w-full flex items-center justify-between p-2 rounded-md text-sm font-body text-muted-foreground hover:text-foreground hover:bg-muted transition-micro"
                >
                  <span>{preset.name}</span>
                  <Icon name="ChevronRight" size={14} />
                </button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSaveDialog(true)}
              iconName="Plus"
              iconPosition="left"
              className="w-full mt-2"
            >
              Simpan Filter
            </Button>
          </div>

          {/* Vendor Search */}
          <div>
            <Input
              label="Cari Vendor"
              type="text"
              placeholder="Nama vendor atau kode..."
              value={filters.vendor}
              onChange={(e) => handleFilterChange('vendor', e.target.value)}
            />
          </div>

          {/* Date Range */}
          <div>
            <Select
              label="Rentang Tanggal"
              options={dateRangeOptions}
              value={filters.dateRange}
              onChange={(value) => handleFilterChange('dateRange', value)}
            />
          </div>

          {/* Status Filter */}
          <div>
            <Select
              label="Status Dokumen"
              options={statusOptions}
              value={filters.status}
              onChange={(value) => handleFilterChange('status', value)}
            />
          </div>

          {/* Urgency Filter */}
          <div>
            <Select
              label="Tingkat Prioritas"
              options={urgencyOptions}
              value={filters.urgency}
              onChange={(value) => handleFilterChange('urgency', value)}
            />
          </div>

          {/* Assigned To Filter */}
          <div>
            <Select
              label="Ditugaskan Kepada"
              options={assignedToOptions}
              value={filters.assignedTo}
              onChange={(value) => handleFilterChange('assignedTo', value)}
            />
          </div>

          {/* Advanced Search */}
          <div className="pt-4 border-t border-border">
            <Button
              variant="outline"
              fullWidth
              iconName="Search"
              iconPosition="left"
            >
              Pencarian Lanjutan
            </Button>
          </div>
        </div>
      )}

      {/* Save Filter Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-1200">
          <div className="bg-card rounded-lg shadow-modal w-full max-w-md mx-4">
            <div className="p-6">
              <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
                Simpan Filter
              </h3>
              <Input
                label="Nama Filter"
                type="text"
                placeholder="Masukkan nama filter..."
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                className="mb-4"
              />
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowSaveDialog(false)}
                  className="flex-1"
                >
                  Batal
                </Button>
                <Button
                  variant="default"
                  onClick={handleSaveFilter}
                  className="flex-1"
                >
                  Simpan
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;