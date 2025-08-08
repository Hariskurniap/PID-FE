import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import SessionTimeoutHandler from '../../components/ui/SessionTimeoutHandler';
import FilterPanel from './components/FilterPanel';
import InvoiceTable from './components/InvoiceTable';
import SummaryPanel from './components/SummaryPanel';
import BulkActionDialog from './components/BulkActionDialog';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const InternalPicDashboard = () => {
  const navigate = useNavigate();
  const [isFilterCollapsed, setIsFilterCollapsed] = useState(false);
  const [isSummaryCollapsed, setIsSummaryCollapsed] = useState(false);
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [filters, setFilters] = useState({});
  const [bulkAction, setBulkAction] = useState({ isOpen: false, action: null });
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSessionActive, setIsSessionActive] = useState(true);

  const currentUser = {
    name: localStorage.getItem('userName') || 'User',
    role: localStorage.getItem('userRole') || 'staff',
    id: localStorage.getItem('userId') || ''
  };

  // Fetch invoice data from API
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const token = localStorage.getItem('token');
        const userEmail = localStorage.getItem('userEmail');
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/invoice/all?pic=${(userEmail)}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error('Gagal mengambil data invoice');

        const data = await res.json();
        setInvoices(data);
        setFilteredInvoices(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Terjadi kesalahan saat mengambil data');
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...invoices];

    if (filters.vendor) {
      filtered = filtered.filter(invoice =>
        invoice.vendor?.namaVendor?.toLowerCase().includes(filters.vendor.toLowerCase()) ||
        invoice.vendor?.vendorCode?.toLowerCase().includes(filters.vendor.toLowerCase())
      );
    }

    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(invoice => invoice.status === filters.status);
    }

    if (filters.urgency && filters.urgency !== 'all') {
      if (filters.urgency === 'urgent') {
        filtered = filtered.filter(invoice => invoice.isUrgent);
      } else if (filters.urgency === 'overdue') {
        filtered = filtered.filter(invoice => new Date(invoice.deadline) < new Date());
      }
    }

    if (filters.assignedTo && filters.assignedTo !== 'all') {
      if (filters.assignedTo === 'me') {
        filtered = filtered.filter(invoice => invoice.assignedTo === currentUser.name);
      } else if (filters.assignedTo === 'unassigned') {
        filtered = filtered.filter(invoice => !invoice.assignedTo);
      }
    }

    setFilteredInvoices(filtered);
  }, [filters, invoices]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleInvoiceSelect = (invoiceIds) => {
    setSelectedInvoices(invoiceIds);
  };

  const handleBulkAction = (action) => {
    setBulkAction({ isOpen: true, action });
  };

  const handleBulkActionConfirm = async (actionData) => {
    console.log('Bulk action confirmed:', actionData);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setSelectedInvoices([]);
    setBulkAction({ isOpen: false, action: null });
    alert(`Berhasil memproses ${actionData.selectedCount} invoice`);
  };

  const handleSessionTimeout = () => {
    navigate('/vendor-login');
  };

  const handleSessionExtend = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header userRole="staff" userName={currentUser.name} />

      <SessionTimeoutHandler
        isActive={isSessionActive}
        onTimeout={handleSessionTimeout}
        onExtend={handleSessionExtend}
      />

      <div className="pt-16 flex h-screen">
        <FilterPanel
          onFiltersChange={handleFiltersChange}
          isCollapsed={isFilterCollapsed}
          onToggleCollapse={() => setIsFilterCollapsed(!isFilterCollapsed)}
        />

        <div className="flex-1 flex flex-col min-w-0">
          <div className="p-6 border-b border-border bg-card">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-heading font-bold text-foreground">
                  Dashboard PIC
                </h1>
                <p className="text-sm font-body text-muted-foreground mt-1">
                  Kelola dan review invoice dari vendor dengan efisien
                </p>
              </div>
              <div className="flex items-center space-x-3">
                {/* <Button variant="outline" iconName="Download" iconPosition="left">
                  Ekspor Data
                </Button>
                <Button
                  variant="default"
                  iconName="Plus"
                  iconPosition="left"
                  onClick={() => navigate('/document-review')}
                >
                  Review Manual
                </Button> */}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <StatCard icon="FileText" color="primary" label="Total Invoice" value={filteredInvoices.length} />
              <StatCard icon="Clock" color="warning" label="Menunggu Review" value={filteredInvoices.filter(i => i.status === 'pending').length} />
              <StatCard icon="Eye" color="secondary" label="Disetujui" value={filteredInvoices.filter(i => i.status === 'approved').length} />
              <StatCard icon="AlertTriangle" color="error" label="Ditolak" value={filteredInvoices.filter(i => i.status === 'rejected').length} />
              <StatCard icon="Eye" color="secondary" label="Terbayar" value={filteredInvoices.filter(i => i.status === 'paid').length} />
            </div>
          </div>

          <div className="flex-1 p-6 overflow-hidden">
            {loading ? (
              <p>Memuat data...</p>
            ) : error ? (
              <p className="text-red-500">Error: {error}</p>
            ) : (
              <InvoiceTable
                invoices={filteredInvoices}
                onInvoiceSelect={handleInvoiceSelect}
                onBulkAction={handleBulkAction}
                selectedInvoices={selectedInvoices}
              />
            )}
          </div>
        </div>

        {/* <SummaryPanel
          isCollapsed={isSummaryCollapsed}
          onToggleCollapse={() => setIsSummaryCollapsed(!isSummaryCollapsed)}
        /> */}
      </div>

      <BulkActionDialog
        isOpen={bulkAction.isOpen}
        onClose={() => setBulkAction({ isOpen: false, action: null })}
        action={bulkAction.action}
        selectedCount={selectedInvoices.length}
        onConfirm={handleBulkActionConfirm}
      />
    </div>
  );
};

// Reusable stat card
const StatCard = ({ icon, color, label, value }) => (
  <div className={`p-4 bg-${color}/10 rounded-lg border border-${color}/20`}>
    <div className="flex items-center space-x-3">
      <Icon name={icon} size={20} className={`text-${color}`} />
      <div>
        <div className={`text-lg font-heading font-bold text-${color}`}>{value}</div>
        <div className={`text-sm font-caption text-${color}/80`}>{label}</div>
      </div>
    </div>
  </div>
);

export default InternalPicDashboard;
