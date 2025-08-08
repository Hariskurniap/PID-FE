import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import StatusIndicator from '../../../components/ui/StatusIndicator';
import { Checkbox } from '../../../components/ui/Checkbox';

const InvoiceTable = ({ invoices, onInvoiceSelect, onBulkAction, selectedInvoices }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'tanggalInvoice', direction: 'desc' });
  const [selectAll, setSelectAll] = useState(false);

  const sortedInvoices = useMemo(() => {
    if (!sortConfig.key) return invoices;

    return [...invoices].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (sortConfig.key === 'tanggalInvoice' || sortConfig.key === 'tanggalJatuhTempo') {
        return sortConfig.direction === 'asc'
          ? new Date(aValue) - new Date(bValue)
          : new Date(bValue) - new Date(aValue);
      }

      if (typeof aValue === 'string') {
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
    });
  }, [invoices, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSelectAll = (checked) => {
    setSelectAll(checked);
    onInvoiceSelect(checked ? invoices.map(inv => inv.id) : []);
  };

  const handleRowSelect = (invoiceId, checked) => {
    if (checked) {
      onInvoiceSelect([...selectedInvoices, invoiceId]);
    } else {
      onInvoiceSelect(selectedInvoices.filter(id => id !== invoiceId));
      setSelectAll(false);
    }
  };

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

  const getTimeRemaining = (deadline, status) => {
  if (status === 'paid') {
    return { text: '-', color: 'text-muted-foreground', urgent: false };
  }

  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return { text: 'Terlambat', color: 'text-error', urgent: true };
  if (diffDays === 0) return { text: 'Hari ini', color: 'text-warning', urgent: true };
  if (diffDays === 1) return { text: '1 hari', color: 'text-warning', urgent: false };
  return { text: `${diffDays} hari`, color: 'text-muted-foreground', urgent: false };
};


  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return 'ArrowUpDown';
    return sortConfig.direction === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  const handleDownload = (filename) => {
    const token = localStorage.getItem('token');
    const url = `${import.meta.env.VITE_API_BASE_URL}/api/invoice/download/${filename}`;
    fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => res.blob())
    .then(blob => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    })
    .catch(err => console.error('Download error:', err));
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* <Checkbox
              checked={selectAll}
              onChange={(e) => handleSelectAll(e.target.checked)}
              label={`Pilih Semua (${invoices.length})`}
            />
            {selectedInvoices.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm">{selectedInvoices.length} dipilih</span>
                <Button variant="outline" size="sm" onClick={() => onBulkAction('approve')} iconName="Check">Setujui</Button>
                <Button variant="outline" size="sm" onClick={() => onBulkAction('reject')} iconName="X">Tolak</Button>
              </div>
            )} */}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/30">
            <tr>
              {/* <th className="w-12 p-3"></th> */}
              <th className="text-left p-3">
                <button onClick={() => handleSort('nomorInvoice')} className="flex items-center space-x-2">
                  <span>No. Invoice</span>
                  <Icon name={getSortIcon('nomorInvoice')} size={14} />
                </button>
              </th>
              <th className="text-left p-3">Vendor</th>
              <th className="text-left p-3">Jumlah</th>
              <th className="text-left p-3">
                <button onClick={() => handleSort('tanggalInvoice')} className="flex items-center space-x-2">
                  <span>Tgl. Invoice</span>
                  <Icon name={getSortIcon('tanggalInvoice')} size={14} />
                </button>
              </th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">
                <button onClick={() => handleSort('tanggalJatuhTempo')} className="flex items-center space-x-2">
                  <span>Sisa Waktu</span>
                  <Icon name={getSortIcon('tanggalJatuhTempo')} size={14} />
                </button>
              </th>
              <th className="text-right p-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {sortedInvoices.map((inv) => {
              const time = getTimeRemaining(inv.tanggalJatuhTempo, inv.status);
              const isSelected = selectedInvoices.includes(inv.id);

              return (
                <tr key={inv.id} className={`border-b border-border ${isSelected ? 'bg-primary/5' : ''}`}>
                  {/* <td className="p-3">
                    <Checkbox
                      checked={isSelected}
                      onChange={(e) => handleRowSelect(inv.id, e.target.checked)}
                    />
                  </td> */}
                  <td className="p-3 text-sm font-mono">{inv.nomorInvoice}</td>
                  <td className="p-3 text-sm">{inv.vendor?.namaVendor || '-'}</td>
                  <td className="p-3 text-sm">{formatCurrency(inv.jumlahTagihan)}</td>
                  <td className="p-3 text-sm">{formatDate(inv.tanggalInvoice)}</td>
                  <td className="p-3"><StatusIndicator status={inv.status} size="sm" /></td>
                  <td className="p-3 text-sm font-medium">
                    <span className={time.color}>{time.text}</span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Eye"
                        onClick={() => window.open(`/invoice-review/${inv.id}`, '_blank')}
                      />
                      {inv.dokumen && (
                        <Button
                          variant="ghost"
                          size="sm"
                          iconName="Download"
                          onClick={() => handleDownload(inv.dokumen)}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {invoices.length === 0 && (
        <div className="p-12 text-center">
          <Icon name="FileText" size={48} className="text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Tidak Ada Invoice</h3>
          <p className="text-sm text-muted-foreground">Belum ada data invoice tersedia</p>
        </div>
      )}
    </div>
  );
};

export default InvoiceTable;
