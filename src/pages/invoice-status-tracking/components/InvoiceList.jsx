import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import StatusIndicator from '../../../components/ui/StatusIndicator';
import Select from '../../../components/ui/Select';

const InvoiceList = ({ invoices, userRole, onSelectInvoice, selectedInvoiceId, onQuickAction }) => {
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('list'); // list or grid

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Number(amount));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getUrgencyLevel = (submittedAt) => {
    const submitted = new Date(submittedAt);
    const now = new Date();
    const diffHours = Math.floor((now - submitted) / (1000 * 60 * 60));
    const maxHours = 72;
    const remainingHours = Math.max(0, maxHours - diffHours);

    if (remainingHours <= 12) return 'urgent';
    if (remainingHours <= 24) return 'high';
    if (remainingHours <= 48) return 'medium';
    return 'low';
  };

  const getUrgencyColor = (level) => {
    switch (level) {
      case 'urgent': return 'text-error';
      case 'high': return 'text-warning';
      case 'medium': return 'text-secondary';
      default: return 'text-success';
    }
  };

  const sortedInvoices = [...invoices].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'amount_high':
        return Number(b.jumlahTagihan) - Number(a.jumlahTagihan);
      case 'amount_low':
        return Number(a.jumlahTagihan) - Number(b.jumlahTagihan);
      case 'status':
        return a.status.localeCompare(b.status);
      case 'vendor':
        return (a.vendor?.namaVendor || '').localeCompare(b.vendor?.namaVendor || '');
      default:
        return 0;
    }
  });

  if (invoices.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border p-12 text-center">
        <Icon name="FileSearch" size={48} className="text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
          Tidak Ada Invoice Ditemukan
        </h3>
        <p className="text-sm font-body text-muted-foreground mb-6">
          Tidak ada invoice yang sesuai dengan kriteria pencarian Anda.
        </p>
        <Button
          variant="outline"
          iconName="RefreshCw"
          iconPosition="left"
          onClick={() => window.location.reload()}
        >
          Refresh Halaman
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-heading font-semibold text-foreground">
            Daftar Invoice ({invoices.length})
          </h3>
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              iconName="List"
              onClick={() => setViewMode('list')}
            />
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              iconName="Grid3X3"
              onClick={() => setViewMode('grid')}
            />
          </div>
        </div>
        <Select
          options={[
            { value: 'newest', label: 'Terbaru' },
            { value: 'oldest', label: 'Terlama' },
            { value: 'amount_high', label: 'Jumlah Tertinggi' },
            { value: 'amount_low', label: 'Jumlah Terendah' },
            { value: 'status', label: 'Status' },
            { value: 'vendor', label: 'Vendor A-Z' }
          ]}
          value={sortBy}
          onChange={setSortBy}
          className="w-40"
        />
      </div>

      {/* List View */}
      {viewMode === 'list' && (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="hidden md:grid md:grid-cols-12 gap-4 p-4 bg-muted/30 border-b border-border text-sm font-body font-medium text-muted-foreground">
            <div className="col-span-3">Invoice</div>
            {/* <div className="col-span-2">Vendor</div> */}
            {/* <div className="col-span-2">Jumlah</div> */}
            <div className="col-span-3">Status</div>
            <div className="col-span-3">Tanggal</div>
            <div className="col-span-1">Aksi</div>
          </div>

          <div className="divide-y divide-border">
            {sortedInvoices.map((invoice) => {
              const urgency = getUrgencyLevel(invoice.createdAt);
              const isSelected = selectedInvoiceId === invoice.id;

              return (
                <div
                  key={invoice.id}
                  className={`
                    p-4 hover:bg-muted/30 transition-micro cursor-pointer
                    ${isSelected ? 'bg-primary/5 border-l-4 border-l-primary' : ''}
                  `}
                  onClick={() => onSelectInvoice && onSelectInvoice(invoice)}
                >
                  <div className="hidden md:grid md:grid-cols-12 gap-4 items-center">
                    <div className="col-span-3">
                      <div className="flex items-center space-x-3">
                        <div className={`
                          w-2 h-8 rounded-full
                          ${getUrgencyColor(urgency).replace('text-', 'bg-')}
                        `} />
                        <div>
                          <p className="text-sm font-body font-medium text-foreground">
                            {invoice.nomorInvoice}
                          </p>
                          <p className="text-xs font-caption text-muted-foreground">
                            {invoice.tipeInvoice?.tipeInvoice}
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* <div className="col-span-2 truncate">
                      {invoice.vendor?.namaVendor}
                    </div> */}
                    {/* <div className="col-span-2 font-semibold">
                      {formatCurrency(invoice.jumlahTagihan)}
                    </div> */}
                    <div className="col-span-3">
                      <StatusIndicator status={invoice.status} size="sm" />
                    </div>
                    <div className="col-span-3">
                      <p className="text-sm font-mono text-foreground">
                        {formatDate(invoice.tanggalInvoice)}
                      </p>
                      <p className={`text-xs font-caption ${getUrgencyColor(urgency)}`}>
                        {urgency === 'urgent' ? 'Mendesak' :
                         urgency === 'high' ? 'Tinggi' :
                         urgency === 'medium' ? 'Sedang' : 'Normal'}
                      </p>
                    </div>
                    <div className="col-span-1 flex items-center space-x-1">
                      {userRole === 'staff' && invoice.status === 'diterima' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          iconName="Eye"
                          onClick={(e) => {
                            e.stopPropagation();
                            onQuickAction && onQuickAction('review', invoice);
                          }}
                        />
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="ExternalLink"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectInvoice && onSelectInvoice(invoice);
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedInvoices.map((invoice) => {
            const urgency = getUrgencyLevel(invoice.createdAt);
            const isSelected = selectedInvoiceId === invoice.id;

            return (
              <div
                key={invoice.id}
                className={`
                  bg-card rounded-lg border border-border p-6 hover:shadow-card transition-micro cursor-pointer
                  ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}
                `}
                onClick={() => onSelectInvoice && onSelectInvoice(invoice)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`
                    w-3 h-3 rounded-full
                    ${getUrgencyColor(urgency).replace('text-', 'bg-')}
                  `} />
                  <StatusIndicator status={invoice.status} size="sm" />
                </div>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-body font-medium text-foreground">
                      {invoice.nomorInvoice}
                    </h4>
                    <p className="text-xs font-caption text-muted-foreground">
                      {invoice.tipeInvoice?.tipeInvoice}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-body text-muted-foreground">
                      {invoice.vendor?.namaVendor}
                    </p>
                    <p className="text-lg font-body font-semibold text-foreground">
                      {formatCurrency(invoice.jumlahTagihan)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div>
                      <p className="text-xs font-mono text-muted-foreground">
                        {formatDate(invoice.tanggalInvoice)}
                      </p>
                      <p className={`text-xs font-caption ${getUrgencyColor(urgency)}`}>
                        {urgency === 'urgent' ? 'Mendesak' :
                         urgency === 'high' ? 'Tinggi' :
                         urgency === 'medium' ? 'Sedang' : 'Normal'}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="ExternalLink"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectInvoice && onSelectInvoice(invoice);
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default InvoiceList;
