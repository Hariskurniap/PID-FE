import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const InvoiceDetails = ({ invoice, userRole, onDownload, onReupload }) => {
  const [showPreview, setShowPreview] = useState(false);

  if (!invoice) return <div>Loading invoice...</div>;

  const getMappedStatus = (status) => {
    const mapping = {
      sent: 'pending',
      received: 'received',
      rejected: 'rejected',
      paid: 'paid'
    };
    return mapping[status] || 'unknown';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf': return 'FileText';
      case 'xls':
      case 'xlsx': return 'FileSpreadsheet';
      case 'zip':
      case 'rar': return 'Archive';
      default: return 'File';
    }
  };

  const renderStatus = (rawStatus) => {
    const status = getMappedStatus(rawStatus);
    const statusMap = {
      pending: { text: 'Pending', color: 'warning', icon: 'Clock' },
      received: { text: 'Received', color: 'primary', icon: 'CheckCircle' },
      rejected: { text: 'Rejected', color: 'error', icon: 'XCircle' },
      paid: { text: 'Paid', color: 'success', icon: 'CheckCircle' },
      unknown: { text: 'Unknown', color: 'muted-foreground', icon: 'AlertCircle' }
    };
    const current = statusMap[status];

    return (
      <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-body font-medium bg-${current.color}/10 text-${current.color}`}>
        <Icon name={current.icon} size={14} />
        <span>{current.text}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Invoice Info */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-heading font-semibold text-foreground">
            Detail Invoice
          </h3>
          {renderStatus(invoice.status)}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {/* <div>
              <label className="text-sm font-medium text-muted-foreground">
                Nomor Referensi
              </label>
              <p className="text-base font-mono text-foreground mt-1">
                {invoice.referenceNumber}
              </p>
            </div> */}

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Nomor Invoice
              </label>
              <p className="text-base text-foreground mt-1">
                {invoice.nomorInvoice}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Vendor
              </label>
              <p className="text-base text-foreground mt-1">
                {invoice.vendor.namaVendor}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Jumlah Invoice
              </label>
              <p className="text-lg font-semibold text-foreground mt-1">
                {formatCurrency(invoice.jumlahTagihan)}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Tanggal Invoice
              </label>
              <p className="text-base text-foreground mt-1">
                {new Date(invoice.tanggalInvoice).toLocaleString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>

            {invoice.tanggalJatuhTempo && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Jatuh Tempo
                </label>
                <p className="text-base text-foreground mt-1">
                  {new Date(invoice.tanggalJatuhTempo).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            )}
          </div>
        </div>

        {invoice.keterangan && (
          <div className="mt-6 pt-6 border-t border-border">
            <label className="text-sm font-medium text-muted-foreground">
              Deskripsi
            </label>
            <p className="text-base text-foreground mt-2 leading-relaxed">
              {invoice.keterangan}
            </p>
          </div>
        )}
      </div>

      {/* Dokumen Terlampir */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-heading font-semibold text-foreground">
            Dokumen Terlampir
          </h3>
          {userRole === 'staff' && (
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              iconPosition="left"
              onClick={() => onDownload && onDownload(invoice.dokumen)}
            >
              Download Semua
            </Button>
          )}
        </div>

        {invoice.dokumen ? (
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name={getFileIcon(invoice.dokumen)} size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{invoice.dokumen}</p>
                <p className="text-xs text-muted-foreground">
                  Uploaded {new Date(invoice.createdAt).toLocaleDateString('id-ID')}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* <Button
        variant="ghost"
        size="sm"
        iconName="Eye"
        onClick={() => setShowPreview({ name: invoice.dokumen, url: `/path/to/files/${invoice.dokumen}` })}
      >
        Preview
      </Button> */}
              {/* {userRole === 'staff' && ( */}
              <Button
                variant="ghost"
                size="sm"
                iconName="Download"
                onClick={() => onDownload && onDownload([{ name: invoice.dokumen, url: `/path/to/files/${invoice.dokumen}` }])}
              >
                Download
              </Button>
              {/* // )} */}
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground">Tidak ada dokumen terlampir</p>
        )}


        {/* {getMappedStatus(invoice.status) === 'rejected' && userRole === 'vendor' && (
          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-foreground mb-1">
                  Upload Ulang Dokumen
                </h4>
                <p className="text-xs text-muted-foreground">
                  Perbaiki dokumen sesuai catatan dan upload ulang
                </p>
              </div>
              <Button
                variant="default"
                iconName="Upload"
                iconPosition="left"
                onClick={() => onReupload && onReupload(invoice.id)}
              >
                Upload Ulang
              </Button>
            </div>
          </div>
        )} */}
      </div>

      {/* Preview Dokumen */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-1200 p-4">
          <div className="bg-card rounded-lg shadow-modal max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h4 className="font-semibold text-foreground">{showPreview.name}</h4>
              <button
                onClick={() => setShowPreview(false)}
                aria-label="Close preview"
                className="text-foreground hover:text-error transition"
              >
                &times;
              </button>
            </div>
            <iframe
              src={showPreview.url}
              title={showPreview.name}
              className="w-full h-[600px] border-0"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceDetails;
