import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import SessionTimeoutHandler from '../../components/ui/SessionTimeoutHandler';
import StatusOverviewCard from './components/StatusOverviewCard';
import BastListCard from './components/BastListCard';
import SearchFilterCard from './components/SearchFilterCard';
import FloatingActionButton from './components/FloatingActionButton';

const VendorDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchFilters, setSearchFilters] = useState({});
  const [isSearching, setIsSearching] = useState(false);
  const [basts, setBasts] = useState([]);

  const vendorId = localStorage.getItem('vendorId');

  const handleSearch = async (filters = {}) => {
    setIsSearching(true);
    setSearchFilters(filters);

    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams({
        search: filters.searchTerm || ''
      });

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/bast/vendor/${vendorId}?${queryParams}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Gagal mengambil data');
      setBasts(data);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setIsSearching(false);
    }
  };

  const handleRefresh = () => handleSearch(searchFilters);

  const handleViewDetails = (idBast) => {
    navigate(`/bast/details?id=${idBast}`);
  };

  const handleEdit = (idBast) => {
    navigate(`/bast/edit?id=${idBast}`);
  };

  const handleUploadNew = () => {
    navigate('/bast');
  };

  const handleReview = (idBast) => {
    navigate(`/bast/reviewVendor?id=${idBast}`);
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header userRole="vendor" userName="PT Mitra Logistik" />

      <main className="pt-16 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-8">
            <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground mb-2">
              Dashboard Vendor
            </h1>
            <p className="text-sm font-caption text-muted-foreground">
              Kelola dan pantau status BAST Anda
            </p>
          </div>

          <StatusOverviewCard
            statusCounts={{ draft: basts.filter(b => b.status === 'DRAFT').length }}
            onStatusClick={(status) => handleSearch({ status })}
          />

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-3 space-y-6">
              <SearchFilterCard
                onSearch={handleSearch}
                onReset={() => handleSearch({})}
                isSearching={isSearching}
              />

              <BastListCard
                basts={basts}
                onViewDetails={handleViewDetails}
                onEdit={handleEdit}
                onReview={handleReview}
              />
            </div>
          </div>
        </div>
      </main>

      <FloatingActionButton onClick={handleUploadNew} />

      <SessionTimeoutHandler
        timeoutDuration={600000}
        warningDuration={60000}
        onTimeout={() => navigate('/vendor-login')}
        onExtend={() => new Promise((res) => setTimeout(res, 1000))}
        isActive={true}
      />
    </div>
  );
};

export default VendorDashboard;
