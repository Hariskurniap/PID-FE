import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import SessionTimeoutHandler from '../../components/ui/SessionTimeoutHandler';
import StatusOverviewCard from './components/StatusOverviewCard';
import BastListCard from './components/BastListCard';
import SearchFilterCard from './components/SearchFilterCard';
import FloatingActionButton from './components/FloatingActionButton.jsx';

const ApproverDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchFilters, setSearchFilters] = useState({});
  const [isSearching, setIsSearching] = useState(false);
  const [basts, setBasts] = useState([]);
  const emailReviewer = localStorage.getItem('userEmail'); // Ambil email reviewer dari localStorage

  const handleSearch = async (filters = {}) => {
    setIsSearching(true);
    setSearchFilters(filters);
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams({
        search: filters.searchTerm || '',
        orderby: filters.orderby || ''
      });
      
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/bast/approver/${emailReviewer}?${queryParams}`,
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

  const handleRefresh = () => {
    setRefreshing(true);
    handleSearch(searchFilters).finally(() => setRefreshing(false));
  };
  
  const handleViewDetails = (idBast) => {
    navigate(`/bast/details?id=${idBast}`);
  };
  
  const handleReview = (idBast) => {
    navigate(`/bast/approve?id=${idBast}`);
  };

  useEffect(() => {
    if (emailReviewer) {
      handleSearch();
    } else {
      // Handle case when emailReviewer is not available
      alert('Email reviewer tidak ditemukan. Silakan login kembali.');
      navigate('/vendor-login');
    }
  }, [emailReviewer]);

  return (
    <div className="min-h-screen bg-background">
      <Header userRole="reviewer" userName={emailReviewer || 'Reviewer'} />
      <main className="pt-16 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-8">
            <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground mb-2">
              Dashboard Reviewer
            </h1>
            <p className="text-sm font-caption text-muted-foreground">
              Review dan pantau status BAST yang ditugaskan kepada Anda
            </p>
          </div>
          
          <StatusOverviewCard
            statusCounts={{
              pending: basts.filter(b => b.status === 'PENDING').length,
              approved: basts.filter(b => b.status === 'DISETUJUI_REVIEWER').length,
              rejected: basts.filter(b => b.status === 'DITOLAK_REVIEWER').length,
              draft: basts.filter(b => b.status === 'DRAFT').length
            }}
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
                onReview={handleReview}
                onRefresh={handleRefresh}
                loading={refreshing}
              />
            </div>
          </div>
        </div>
      </main>
      
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

export default ApproverDashboard;