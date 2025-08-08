import React from 'react';
import Icon from '../../../components/AppIcon';
import StatusIndicator from '../../../components/ui/StatusIndicator';

const InvoiceMetadata = ({ invoice, vendor }) => {
  const mockInvoice = {
    id: "INV-2024-001",
    referenceNumber: "REF-240115-001",
    invoiceNumber: "INV/2024/001",
    amount: 2650000,
    currency: "IDR",
    issueDate: "2024-01-15",
    dueDate: "2024-02-14",
    description: "Jasa Pengiriman Barang Jakarta - Surabaya",
    status: "reviewing",
    priority: "normal",
    submissionDate: "2024-01-15T10:30:00Z",
    lastUpdated: "2024-01-15T14:20:00Z"
  };

  const mockVendor = {
    id: "VND-001",
    name: "PT Maju Jaya Sejahtera",
    email: "finance@majujaya.co.id",
    phone: "+62-21-5551234",
    address: "Jl. Sudirman No. 123, Jakarta Pusat 10220",
    npwp: "01.234.567.8-901.000",
    registrationDate: "2023-06-15",
    totalInvoices: 24,
    approvedInvoices: 22,
    rejectedInvoices: 2,
    averageProcessingTime: "2.3 hari",
    lastInvoiceDate: "2024-01-10"
  };

  const currentInvoice = invoice || mockInvoice;
  const currentVendor = vendor || mockVendor;

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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-error';
      case 'medium': return 'text-warning';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Invoice Information */}
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-heading font-semibold text-foreground">
            Informasi Invoice
          </h3>
          <StatusIndicator status={currentInvoice.status} />
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-caption text-muted-foreground uppercase tracking-wide">
                Nomor Referensi
              </label>
              <p className="text-sm font-mono text-foreground font-medium">
                {currentInvoice.referenceNumber}
              </p>
            </div>
            <div>
              <label className="text-xs font-caption text-muted-foreground uppercase tracking-wide">
                Nomor Invoice
              </label>
              <p className="text-sm font-mono text-foreground font-medium">
                {currentInvoice.invoiceNumber}
              </p>
            </div>
          </div>

          <div>
            <label className="text-xs font-caption text-muted-foreground uppercase tracking-wide">
              Jumlah
            </label>
            <p className="text-lg font-heading font-semibold text-foreground">
              {formatCurrency(currentInvoice.amount)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-caption text-muted-foreground uppercase tracking-wide">
                Tanggal Invoice
              </label>
              <p className="text-sm font-body text-foreground">
                {formatDate(currentInvoice.issueDate)}
              </p>
            </div>
            <div>
              <label className="text-xs font-caption text-muted-foreground uppercase tracking-wide">
                Jatuh Tempo
              </label>
              <p className="text-sm font-body text-foreground">
                {formatDate(currentInvoice.dueDate)}
              </p>
            </div>
          </div>

          <div>
            <label className="text-xs font-caption text-muted-foreground uppercase tracking-wide">
              Deskripsi
            </label>
            <p className="text-sm font-body text-foreground">
              {currentInvoice.description}
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex items-center space-x-2">
              <Icon name="Clock" size={14} className="text-muted-foreground" />
              <span className="text-xs font-caption text-muted-foreground">
                Disubmit: {formatDate(currentInvoice.submissionDate)}
              </span>
            </div>
            <div className={`flex items-center space-x-1 ${getPriorityColor(currentInvoice.priority)}`}>
              <Icon name="Flag" size={14} />
              <span className="text-xs font-caption capitalize">
                {currentInvoice.priority}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Vendor Information */}
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-heading font-semibold text-foreground">
            Informasi Vendor
          </h3>
          <div className="flex items-center space-x-2">
            <Icon name="Building2" size={16} className="text-primary" />
            <span className="text-sm font-caption text-muted-foreground">
              Terdaftar {formatDate(currentVendor.registrationDate)}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-caption text-muted-foreground uppercase tracking-wide">
              Nama Perusahaan
            </label>
            <p className="text-sm font-body font-semibold text-foreground">
              {currentVendor.name}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-caption text-muted-foreground uppercase tracking-wide">
                Email
              </label>
              <p className="text-sm font-body text-foreground">
                {currentVendor.email}
              </p>
            </div>
            <div>
              <label className="text-xs font-caption text-muted-foreground uppercase tracking-wide">
                Telepon
              </label>
              <p className="text-sm font-body text-foreground">
                {currentVendor.phone}
              </p>
            </div>
          </div>

          <div>
            <label className="text-xs font-caption text-muted-foreground uppercase tracking-wide">
              Alamat
            </label>
            <p className="text-sm font-body text-foreground">
              {currentVendor.address}
            </p>
          </div>

          <div>
            <label className="text-xs font-caption text-muted-foreground uppercase tracking-wide">
              NPWP
            </label>
            <p className="text-sm font-mono text-foreground font-medium">
              {currentVendor.npwp}
            </p>
          </div>
        </div>
      </div>

      {/* Vendor Statistics */}
      <div className="bg-card rounded-lg border border-border p-4">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
          Statistik Vendor
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <p className="text-2xl font-heading font-bold text-foreground">
              {currentVendor.totalInvoices}
            </p>
            <p className="text-xs font-caption text-muted-foreground">
              Total Invoice
            </p>
          </div>
          <div className="text-center p-3 bg-success/10 rounded-lg">
            <p className="text-2xl font-heading font-bold text-success">
              {currentVendor.approvedInvoices}
            </p>
            <p className="text-xs font-caption text-muted-foreground">
              Disetujui
            </p>
          </div>
          <div className="text-center p-3 bg-error/10 rounded-lg">
            <p className="text-2xl font-heading font-bold text-error">
              {currentVendor.rejectedInvoices}
            </p>
            <p className="text-xs font-caption text-muted-foreground">
              Ditolak
            </p>
          </div>
          <div className="text-center p-3 bg-primary/10 rounded-lg">
            <p className="text-xl font-heading font-bold text-primary">
              {currentVendor.averageProcessingTime}
            </p>
            <p className="text-xs font-caption text-muted-foreground">
              Rata-rata Proses
            </p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm font-body text-muted-foreground">
              Invoice Terakhir:
            </span>
            <span className="text-sm font-body text-foreground">
              {formatDate(currentVendor.lastInvoiceDate)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceMetadata;