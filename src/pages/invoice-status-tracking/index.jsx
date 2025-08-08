import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../../components/ui/Header';
import SessionTimeoutHandler from '../../components/ui/SessionTimeoutHandler';
import StatusTimeline from './components/StatusTimeline';
import InvoiceDetails from './components/InvoiceDetails';
import SearchFilters from './components/SearchFilters';
import InvoiceList from './components/InvoiceList';
import CommunicationHistory from './components/CommunicationHistory';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const InvoiceStatusTracking = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [userRole, setUserRole] = useState('vendor'); // vendor or staff
  const [userName, setUserName] = useState('');
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [isSessionActive, setIsSessionActive] = useState(true);

  // Ambil token dari localStorage
  const token = localStorage.getItem('token');

  // Helper: buat header authorization dengan bearer token
  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  });

  // Fetch invoices list dari BE
  const fetchInvoices = async () => {
  try {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    const userEmail = localStorage.getItem('userEmail');

    let endpoint = '';
    if (userRole === 'staff' || userRole === 'administrator') {
      endpoint = '/api/invoice/all';
    } else if (userRole === 'pic') {
      endpoint = `/api/invoice/all?pic=${encodeURIComponent(userEmail)}`;
    }else if (userRole === 'vendor') {
      endpoint = '/api/invoice/vendor/all';
    } else {
      throw new Error('Role tidak dikenali');
    }

    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}${endpoint}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error('Gagal mengambil daftar invoice');
    const data = await res.json();

    return Array.isArray(data) ? data : [];
  } catch (err) {
    setError(err.message);
    return []; // fallback ke array kosong
  }
};


  // Fetch detail invoice by id
  const fetchInvoiceById = async (id) => {
  try {
    const token = localStorage.getItem('token');

    const [invoiceRes, historyRes] = await Promise.all([
      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/invoice/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/invoice/${id}/history`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    if (!invoiceRes.ok) throw new Error('Gagal mengambil detail invoice');
    const invoiceData = await invoiceRes.json();

    const historyData = historyRes.ok ? await historyRes.json() : [];

    return {
      ...invoiceData,
      communications: historyData,
    };
  } catch (err) {
    setError(err.message);
    return null;
  }
};


  const fetchInvoiceHistoryById = async (invoiceId) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/invoice/${invoiceId}/history`,
      {
        headers: getAuthHeaders(),
      }
    );
    if (!res.ok) throw new Error('Gagal mengambil riwayat komunikasi');
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('Fetch history error:', err.message);
    return [];
  }
};

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      setError(null);

      // Ambil role dan userName dari localStorage atau param
      const role = localStorage.getItem('userRole') || searchParams.get('role') || 'vendor';
      const name =
        localStorage.getItem('userName');

      setUserRole(role);
      setUserName(name);

      // Fetch daftar invoice
      const invoiceId = searchParams.get('id');
      const invoicesData = await fetchInvoices();
      // setSelectedInvoice(invoicesData);

      setInvoices(invoicesData);
      setFilteredInvoices(invoicesData);

      // Fetch detail invoice jika ada id di URL param
      // const invoiceId = searchParams.get('id');
      if (invoiceId) {
        const invoiceDetail = await fetchInvoiceById(invoiceId);
        setSelectedInvoice(invoiceDetail);
      }

      setLoading(false);
    };

    initializeData();
  }, [searchParams, navigate]);

  // Search & filter handler
  const handleSearch = (query) => {
    setSearchQuery(query);
    applyFilters(query, filters);
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    applyFilters(searchQuery, newFilters);
  };

  const applyFilters = (query, filterOptions) => {
    let filtered = [...invoices];

    if (query) {
      filtered = filtered.filter(inv =>
        inv.referenceNumber.toLowerCase().includes(query.toLowerCase()) ||
        inv.invoiceNumber.toLowerCase().includes(query.toLowerCase()) ||
        inv.vendorName.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (filterOptions.status) {
      filtered = filtered.filter(inv => inv.status === filterOptions.status);
    }

    if (filterOptions.dateRange) {
      const now = new Date();
      let startDate;
      switch (filterOptions.dateRange) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case 'quarter':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = null;
      }
      if (startDate) {
        filtered = filtered.filter(inv => new Date(inv.submittedAt) >= startDate);
      }
    }

    if (filterOptions.vendor && userRole === 'staff') {
      filtered = filtered.filter(inv =>
        inv.vendorName.toLowerCase().includes(filterOptions.vendor.toLowerCase())
      );
    }

    if (filterOptions.minAmount) {
      filtered = filtered.filter(inv => inv.amount >= Number(filterOptions.minAmount));
    }

    if (filterOptions.maxAmount) {
      filtered = filtered.filter(inv => inv.amount <= Number(filterOptions.maxAmount));
    }

    setFilteredInvoices(filtered);
  };

  // Select invoice handler
  const handleSelectInvoice = async (invoice) => {
    setLoading(true);
    const invoiceDetail = await fetchInvoiceById(invoice.id);
    if (invoiceDetail) {
      setSelectedInvoice(invoiceDetail);
      setSearchParams({ id: invoice.id });
    }
    setLoading(false);
  };

  // Download dokumen (stub)
  const handleDownload = async (documents) => {
  const token = localStorage.getItem('token');

  if (!token) {
    console.error('Token not found');
    return;
  }

  for (const doc of documents) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/invoice/download/${doc.name}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to download ${doc.name}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(`Error downloading ${doc.name}:`, error.message);
    }
  }
};


  // Reupload handler
  const handleReupload = (invoiceId) => {
    navigate('/invoice-upload', { state: { reuploadId: invoiceId } });
  };

  // Quick action contoh: review
  const handleQuickAction = (action, invoice) => {
    if (action === 'review') {
      navigate('/document-review', { state: { invoiceId: invoice.id } });
    }
  };

  // Add note handler (stub)
  const handleAddNote = async (note) => {
    // Implement API call untuk add note di sini
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Note ditambahkan:', note);
  };

  // Session timeout
  const handleSessionTimeout = () => {
    localStorage.clear();
    navigate('/vendor-login');
  };

  // Session extend (stub)
  const handleSessionExtend = async () => {
    // Biasanya hit API untuk extend session
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header userRole={userRole} userName={userName} />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Icon name="Loader2" size={48} className="text-primary mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
              Memuat Data Invoice...
            </h3>
            <p className="text-sm font-body text-muted-foreground">Mohon tunggu sebentar</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header userRole={userRole} userName={userName} />

      <SessionTimeoutHandler
        isActive={true}
        onTimeout={handleSessionTimeout}
        onExtend={handleSessionExtend}
      />

      <main className="pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
                Pelacakan Status Invoice
              </h1>
              <p className="text-sm font-body text-muted-foreground">
                {userRole === 'vendor'
                  ? 'Pantau status pemrosesan invoice Anda secara real-time'
                  : 'Kelola dan pantau semua invoice yang masuk dari vendor'}
              </p>
            </div>

            {/* {userRole === 'vendor' && (
              <Button
                variant="default"
                iconName="Upload"
                iconPosition="left"
                onClick={() => navigate('/invoice-upload')}
              >
                Upload Invoice Baru
              </Button>
            )} */}
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
              Error: {error}
            </div>
          )}

          <SearchFilters
            onSearch={handleSearch}
            onFilter={handleFilter}
            userRole={userRole}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
            <div className="lg:col-span-1">
              <InvoiceList
                invoices={filteredInvoices}
                userRole={userRole}
                onSelectInvoice={handleSelectInvoice}
                selectedInvoiceId={selectedInvoice?.id}
                onQuickAction={handleQuickAction}
              />
            </div>

            <div className="lg:col-span-2">
              {selectedInvoice ? (
                <div className="space-y-8">
                  {/* <StatusTimeline invoice={selectedInvoice} userRole={userRole} /> */}

                  <InvoiceDetails
                    invoice={selectedInvoice}
                    userRole={userRole}
                    onDownload={handleDownload}
                    onReupload={handleReupload}
                  />

                  <CommunicationHistory
                    communications={selectedInvoice.communications || []}
                    userRole={userRole}
                    onAddNote={handleAddNote}
                  />
                </div>
              ) : (
                <div className="bg-card rounded-lg border border-border p-12 text-center">
                  <Icon
                    name="FileSearch"
                    size={64}
                    className="text-muted-foreground mx-auto mb-6"
                  />
                  <h3 className="text-xl font-heading font-semibold text-foreground mb-3">
                    Pilih Invoice untuk Melihat Detail
                  </h3>
                  <p className="text-sm font-body text-muted-foreground mb-6 max-w-md mx-auto">
                    Klik salah satu invoice di daftar sebelah kiri untuk melihat detail dan
                    riwayat komunikasi.
                  </p>
                  {Array.isArray(filteredInvoices) && filteredInvoices.length === 0 && (
  <Button
    variant="outline"
    iconName="RefreshCw"
    iconPosition="left"
    onClick={() => window.location.reload()}
  >
    Refresh Data
  </Button>
)}

                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InvoiceStatusTracking;
