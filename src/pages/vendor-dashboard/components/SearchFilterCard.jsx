import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const SearchFilterCard = ({ onSearch, onReset, isSearching }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const statusOptions = [
    { value: '', label: 'Semua Status' },
    { value: 'paid', label: 'Terbayar' },
    { value: 'received', label: 'Diterima' },
    { value: 'pending', label: 'Menunggu Review' },
    { value: 'rejected', label: 'Ditolak' }
  ];

  const handleSearch = () => {
    const filters = {
      searchTerm: searchTerm.trim(),
      dateFrom,
      dateTo,
      status: statusFilter
    };
    onSearch(filters);
  };

  const handleReset = () => {
    setSearchTerm('');
    setDateFrom('');
    setDateTo('');
    setStatusFilter('');
    onReset();
  };

  const hasActiveFilters = searchTerm || dateFrom || dateTo || statusFilter;

  return (
    <div className="bg-card rounded-lg shadow-card border border-border mb-6">
      <div className="p-4">
        {/* Quick Search */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="flex-1">
            <Input
              type="search"
              placeholder="Cari berdasarkan nomor referensi atau nama file..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button
            variant="default"
            iconName="Search"
            iconPosition="left"
            onClick={handleSearch}
            loading={isSearching}
          >
            Cari
          </Button>
          <Button
            variant="outline"
            iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            Filter
          </Button>
        </div>

        {/* Advanced Filters */}
        {isExpanded && (
          <div className="border-t border-border pt-4 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Input
                type="date"
                label="Tanggal Mulai"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
              <Input
                type="date"
                label="Tanggal Akhir"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
              <Select
                label="Status"
                options={statusOptions}
                value={statusFilter}
                onChange={setStatusFilter}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-xs font-caption text-muted-foreground">
                {hasActiveFilters && (
                  <span className="flex items-center space-x-1">
                    <Icon name="Filter" size={12} />
                    <span>Filter aktif</span>
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  disabled={!hasActiveFilters}
                >
                  Reset
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  iconName="Search"
                  iconPosition="left"
                  onClick={handleSearch}
                  loading={isSearching}
                >
                  Terapkan Filter
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFilterCard;
