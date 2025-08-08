import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import SessionTimeoutHandler from '../../components/ui/SessionTimeoutHandler';
import StatusOverviewCard from './components/StatusOverviewCard';
import InvoiceListCard from './components/InvoiceListCard';
import SearchFilterCard from './components/SearchFilterCard';
import FloatingActionButton from './components/FloatingActionButton';
import QuickStatsCard from './components/QuickStatsCard';
import RecentActivityCard from './components/RecentActivityCard';

const VendorDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchFilters, setSearchFilters] = useState({});
  const [isSearching, setIsSearching] = useState(false);
  const [isSessionActive, setIsSessionActive] = useState(true);

  // Mock data for vendor dashboard
  const [statusCounts] = useState({
    sent: 5,
    received: 8,
    verified: 12,
    forwarded: 15
  });

  const [quickStats] = useState({
    thisMonth: 18,
    pending: 13,
    avgProcessing: 2
  });

  // const [invoices] = useState([
  //   {
  //     id: 'INV-001',
  //     referenceNumber: 'REF-2025-001234',
  //     fileName: 'Invoice_Januari_2025.pdf',
  //     submissionDate: '2025-01-20T10:30:00Z',
  //     amount: 15750000,
  //     status: 'received',
  //     rejectionReason: null
  //   },
  //   {
  //     id: 'INV-002',
  //     referenceNumber: 'REF-2025-001235',
  //     fileName: 'Invoice_Logistik_Jan.xlsx',
  //     submissionDate: '2025-01-19T14:15:00Z',
  //     amount: 8500000,
  //     status: 'verified',
  //     rejectionReason: null
  //   },
  //   {
  //     id: 'INV-003',
  //     referenceNumber: 'REF-2025-001236',
  //     fileName: 'Invoice_Transport_Q1.pdf',
  //     submissionDate: '2025-01-18T09:45:00Z',
  //     amount: 22300000,
  //     status: 'rejected',
  //     rejectionReason: 'Format dokumen tidak sesuai. Harap gunakan template resmi yang telah disediakan dan pastikan semua field wajib telah diisi dengan lengkap.'
  //   },
  //   {
  //     id: 'INV-004',
  //     referenceNumber: 'REF-2025-001237',
  //     fileName: 'Invoice_Warehouse_Jan.pdf',
  //     submissionDate: '2025-01-17T16:20:00Z',
  //     amount: 12800000,
  //     status: 'forwarded',
  //     rejectionReason: null
  //   },
  //   {
  //     id: 'INV-005',
  //     referenceNumber: 'REF-2025-001238',
  //     fileName: 'Invoice_Maintenance.zip',
  //     submissionDate: '2025-01-16T11:10:00Z',
  //     amount: 5600000,
  //     status: 'sent',
  //     rejectionReason: null
  //   }
  // ]);

  const [invoices, setInvoices] = useState([]);


  // const [recentActivities] = useState([
  //   {
  //     id: 'ACT-001',
  //     type: 'status_change',
  //     description: 'Status invoice REF-2025-001234 berubah menjadi "Diterima"',
  //     referenceNumber: 'REF-2025-001234',
  //     timestamp: '2025-01-23T13:45:00Z'
  //   },
  //   {
  //     id: 'ACT-002',
  //     type: 'rejection',
  //     description: 'Invoice REF-2025-001236 ditolak dan memerlukan upload ulang',
  //     referenceNumber: 'REF-2025-001236',
  //     timestamp: '2025-01-23T11:20:00Z'
  //   },
  //   {
  //     id: 'ACT-003',
  //     type: 'approval',
  //     description: 'Invoice REF-2025-001235 telah diverifikasi dan disetujui',
  //     referenceNumber: 'REF-2025-001235',
  //     timestamp: '2025-01-23T09:15:00Z'
  //   },
  //   {
  //     id: 'ACT-004',
  //     type: 'upload',
  //     description: 'Invoice baru REF-2025-001238 berhasil diupload',
  //     referenceNumber: 'REF-2025-001238',
  //     timestamp: '2025-01-22T16:30:00Z'
  //   }
  // ]);

  const handleStatusClick = (status) => {
    const filters = {
      searchTerm: '',
      dateFrom: '',
      dateTo: '',
      status,
    };
    handleSearch(filters); // fetch berdasarkan status
  };


  const handleSearch = async (filters) => {
    setIsSearching(true);
    setSearchFilters(filters);

    try {
      const token = localStorage.getItem('token');

      const queryParams = new URLSearchParams({
        search: filters.searchTerm || '',
        dateFrom: filters.dateFrom || '',
        dateTo: filters.dateTo || '',
        status: filters.status || ''
      });

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/invoice/vendor/all?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Gagal mengambil data');

      setInvoices(data); // Update state invoices untuk ditampilkan
    } catch (err) {
      console.error('Search failed:', err);
      alert(err.message);
    } finally {
      setIsSearching(false);
    }
  };

  const handleResetFilters = () => {
    const emptyFilters = {
      searchTerm: '',
      dateFrom: '',
      dateTo: '',
      status: '',
    };
    handleSearch(emptyFilters); // trigger pencarian kosong
  };


  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const token = localStorage.getItem('token');

      // Cek apakah searchFilters aktif
      const hasActiveFilter = Object.values(searchFilters).some((v) => v);

      let query = '';
      if (hasActiveFilter) {
        const queryParams = new URLSearchParams();
        if (searchFilters.dateFrom) queryParams.append('dateFrom', searchFilters.dateFrom);
        if (searchFilters.dateTo) queryParams.append('dateTo', searchFilters.dateTo);
        if (searchFilters.status) queryParams.append('status', searchFilters.status);
        query = `?${queryParams.toString()}`;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/invoice/vendor/all${query}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      setInvoices(result); // update state dari parent
    } catch (error) {
      console.error('Refresh failed:', error.message);
      alert('Gagal menyegarkan data.');
    } finally {
      setRefreshing(false);
    }
  };


  const handleViewDetails = (invoiceId) => {
    navigate(`/invoice-status-tracking?id=${invoiceId}`);
  };

  const handleReupload = (invoiceId) => {
    navigate(`/invoice-upload?reupload=${invoiceId}`);
  };

  const handleUploadNew = () => {
    navigate('/invoice-upload');
  };

  const handleViewAllActivities = () => {
    navigate('/invoice-status-tracking?tab=activities');
  };

  const handleSessionTimeout = () => {
    navigate('/vendor-login');
  };

  const handleExtendSession = async () => {
    // Simulate session extension
    return new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
  };

  // Pull to refresh for mobile
  useEffect(() => {
    // Load semua data saat pertama kali buka halaman
    handleSearch({
      searchTerm: '',
      dateFrom: '',
      dateTo: '',
      status: '',
    });
  }, []);


  return (
    <div className="min-h-screen bg-background">
      <Header userRole="vendor" userName="PT Mitra Logistik" />

      <main className="pt-16 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground mb-2">
              Dashboard Vendor
            </h1>
            <p className="text-sm font-caption text-muted-foreground">
              Kelola dan pantau status invoice Anda dengan mudah
            </p>
            <p className="text-xs font-caption text-muted-foreground">
              Manage and monitor your invoice status easily
            </p>
          </div>

          {/* Quick Stats */}
          {/* <QuickStatsCard stats={quickStats} /> */}

          {/* Status Overview */}
          <StatusOverviewCard
            statusCounts={statusCounts}
            onStatusClick={handleStatusClick}
          />

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="xl:col-span-3 space-y-6">
              {/* Search & Filter */}
              <SearchFilterCard
                onSearch={handleSearch}
                onFilter={handleSearch}
                onReset={handleResetFilters}
                isSearching={isSearching}
              />

              {/* Invoice List */}
              <InvoiceListCard
                invoices={invoices}
                loading={refreshing}
                onViewDetails={handleViewDetails}
                onReupload={handleReupload}
                onRefresh={handleRefresh}
              />

            </div>

            {/* Sidebar */}
            {/* <div className="space-y-6"> */}
            {/* Recent Activities */}
            {/* <RecentActivityCard
                activities={recentActivities}
                onViewAll={handleViewAllActivities}
              /> */}
            {/* </div> */}
          </div>
        </div>
      </main>

      {/* Floating Action Button */}
      <FloatingActionButton onClick={handleUploadNew} />

      {/* Session Timeout Handler */}
      <SessionTimeoutHandler
        timeoutDuration={600000} // 10 minutes
        warningDuration={60000}  // 1 minute warning
        onTimeout={handleSessionTimeout}
        onExtend={handleExtendSession}
        isActive={true}
      />
    </div>
  );
};

export default VendorDashboard;