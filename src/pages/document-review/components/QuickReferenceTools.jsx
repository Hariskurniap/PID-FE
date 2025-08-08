import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const QuickReferenceTools = ({ vendorId, invoiceAmount }) => {
  const [activeTab, setActiveTab] = useState('vendor_history');
  const [searchQuery, setSearchQuery] = useState('');
  const [comparisonType, setComparisonType] = useState('amount');

  const mockVendorHistory = [
    {
      id: "INV-2023-045",
      date: "2023-12-20",
      amount: 2800000,
      status: "approved",
      processingTime: "1.5 hari",
      reviewer: "Ahmad Rizki"
    },
    {
      id: "INV-2023-032",
      date: "2023-11-15",
      amount: 2200000,
      status: "approved",
      processingTime: "2 hari",
      reviewer: "Sari Dewi"
    },
    {
      id: "INV-2023-018",
      date: "2023-10-08",
      amount: 3100000,
      status: "rejected",
      processingTime: "1 hari",
      reviewer: "Budi Santoso",
      rejectionReason: "Dokumen tidak lengkap"
    }
  ];

  const mockSimilarInvoices = [
    {
      id: "INV-2024-003",
      vendor: "PT Sejahtera Logistik",
      amount: 2750000,
      similarity: 95,
      status: "approved",
      date: "2024-01-10"
    },
    {
      id: "INV-2023-089",
      vendor: "CV Maju Bersama",
      amount: 2500000,
      similarity: 88,
      status: "approved",
      date: "2023-12-28"
    },
    {
      id: "INV-2023-076",
      vendor: "PT Logistik Prima",
      amount: 2900000,
      similarity: 82,
      status: "rejected",
      date: "2023-12-15"
    }
  ];

  const mockComplianceChecklist = [
    {
      id: 1,
      category: "Dokumen",
      items: [
        { name: "Invoice asli tersedia", status: "checked", required: true },
        { name: "Nomor invoice unik", status: "checked", required: true },
        { name: "Tanggal invoice valid", status: "checked", required: true },
        { name: "Tanda tangan/cap perusahaan", status: "warning", required: false }
      ]
    },
    {
      id: 2,
      category: "Vendor",
      items: [
        { name: "Vendor terdaftar", status: "checked", required: true },
        { name: "NPWP valid", status: "checked", required: true },
        { name: "Kontrak/PO tersedia", status: "checked", required: true },
        { name: "Riwayat pembayaran baik", status: "checked", required: false }
      ]
    },
    {
      id: 3,
      category: "Finansial",
      items: [
        { name: "Jumlah sesuai PO", status: "checked", required: true },
        { name: "Pajak dihitung benar", status: "warning", required: true },
        { name: "Mata uang konsisten", status: "checked", required: true },
        { name: "Diskon/potongan valid", status: "checked", required: false }
      ]
    }
  ];

  const comparisonOptions = [
    { value: 'amount', label: 'Berdasarkan Jumlah' },
    { value: 'vendor', label: 'Berdasarkan Vendor' },
    { value: 'date', label: 'Berdasarkan Tanggal' },
    { value: 'service', label: 'Berdasarkan Jenis Layanan' }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-success';
      case 'rejected': return 'text-error';
      case 'pending': return 'text-warning';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'checked': return 'CheckCircle';
      case 'warning': return 'AlertTriangle';
      case 'error': return 'XCircle';
      default: return 'Clock';
    }
  };

  const getStatusColor2 = (status) => {
    switch (status) {
      case 'checked': return 'text-success';
      case 'warning': return 'text-warning';
      case 'error': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const tabs = [
    { id: 'vendor_history', label: 'Riwayat Vendor', icon: 'History' },
    { id: 'similar_invoices', label: 'Invoice Serupa', icon: 'Search' },
    { id: 'compliance', label: 'Checklist Compliance', icon: 'Shield' }
  ];

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-heading font-semibold text-foreground">
          Tools Referensi Cepat
        </h3>
        <div className="flex items-center space-x-2">
          <Icon name="Zap" size={16} className="text-primary" />
          <span className="text-sm font-caption text-muted-foreground">
            Quick Reference
          </span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-4 bg-muted/30 p-1 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-body transition-micro flex-1
              ${activeTab === tab.id 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }
            `}
          >
            <Icon name={tab.icon} size={14} />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Vendor History Tab */}
      {activeTab === 'vendor_history' && (
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Input
              placeholder="Cari invoice..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button variant="outline" size="sm" iconName="Search" />
          </div>

          <div className="space-y-3">
            {mockVendorHistory.map((invoice) => (
              <div key={invoice.id} className="p-3 border border-border rounded-lg hover:bg-muted/30 transition-micro">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-mono font-medium text-foreground">
                      {invoice.id}
                    </span>
                    <span className={`text-sm font-caption ${getStatusColor(invoice.status)}`}>
                      {invoice.status === 'approved' ? 'Disetujui' : 
                       invoice.status === 'rejected' ? 'Ditolak' : 'Pending'}
                    </span>
                  </div>
                  <span className="text-sm font-body text-muted-foreground">
                    {formatDate(invoice.date)}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Jumlah: </span>
                    <span className="font-medium text-foreground">
                      {formatCurrency(invoice.amount)}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Waktu Proses: </span>
                    <span className="font-medium text-foreground">
                      {invoice.processingTime}
                    </span>
                  </div>
                </div>

                <div className="mt-2 text-sm">
                  <span className="text-muted-foreground">Reviewer: </span>
                  <span className="font-medium text-foreground">
                    {invoice.reviewer}
                  </span>
                </div>

                {invoice.rejectionReason && (
                  <div className="mt-2 p-2 bg-error/10 rounded text-sm">
                    <span className="text-error font-medium">Alasan Penolakan: </span>
                    <span className="text-error">{invoice.rejectionReason}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Similar Invoices Tab */}
      {activeTab === 'similar_invoices' && (
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Select
              placeholder="Pilih kriteria perbandingan"
              options={comparisonOptions}
              value={comparisonType}
              onChange={setComparisonType}
              className="flex-1"
            />
            <Button variant="outline" size="sm" iconName="RefreshCw" />
          </div>

          <div className="space-y-3">
            {mockSimilarInvoices.map((invoice) => (
              <div key={invoice.id} className="p-3 border border-border rounded-lg hover:bg-muted/30 transition-micro">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-mono font-medium text-foreground">
                      {invoice.id}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Icon name="Target" size={12} className="text-primary" />
                      <span className="text-xs font-caption text-primary">
                        {invoice.similarity}% mirip
                      </span>
                    </div>
                  </div>
                  <span className={`text-sm font-caption ${getStatusColor(invoice.status)}`}>
                    {invoice.status === 'approved' ? 'Disetujui' : 'Ditolak'}
                  </span>
                </div>
                
                <div className="space-y-1 text-sm">
                  <div>
                    <span className="text-muted-foreground">Vendor: </span>
                    <span className="font-medium text-foreground">
                      {invoice.vendor}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-muted-foreground">Jumlah: </span>
                      <span className="font-medium text-foreground">
                        {formatCurrency(invoice.amount)}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Tanggal: </span>
                      <span className="font-medium text-foreground">
                        {formatDate(invoice.date)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Compliance Checklist Tab */}
      {activeTab === 'compliance' && (
        <div className="space-y-4">
          {mockComplianceChecklist.map((category) => (
            <div key={category.id} className="border border-border rounded-lg p-4">
              <h4 className="text-sm font-body font-semibold text-foreground mb-3">
                {category.category}
              </h4>
              
              <div className="space-y-2">
                {category.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Icon 
                        name={getStatusIcon(item.status)} 
                        size={14} 
                        className={getStatusColor2(item.status)} 
                      />
                      <span className="text-sm font-body text-foreground">
                        {item.name}
                      </span>
                      {item.required && (
                        <span className="text-xs font-caption text-error">*</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {item.status === 'warning' && (
                        <Button variant="outline" size="sm">
                          Periksa
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="mt-4 p-3 bg-primary/10 rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon name="Info" size={16} className="text-primary" />
              <span className="text-sm font-body text-primary">
                Compliance Score: 85% (17/20 item terpenuhi)
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickReferenceTools;