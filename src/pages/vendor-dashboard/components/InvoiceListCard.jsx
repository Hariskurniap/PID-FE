import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import StatusIndicator from '../../../components/ui/StatusIndicator';

const InvoiceListCard = ({ invoices = [], loading = false, onViewDetails, onReupload, onRefresh }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateDaysRemaining = (submissionDate) => {
    const submitted = new Date(submissionDate);
    const now = new Date();
    const threeDaysLater = new Date(submitted.getTime() + 3 * 24 * 60 * 60 * 1000);
    const diffTime = threeDaysLater - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const getStatusMapping = (status) => {
    const mapping = {
      sent: 'pending',
      received: 'received',
      rejected: 'rejected',
      paid: 'paid'
    };
    return mapping[status?.toLowerCase()] || 'pending';
  };

  return (
    <div className="bg-card rounded-lg shadow-card border border-border">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground">
              Daftar Invoice Terbaru
            </h3>
            <p className="text-sm font-caption text-muted-foreground">Recent Invoice List</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            iconName="RefreshCw"
            iconPosition="left"
            onClick={onRefresh}
            loading={loading}
          >
            Refresh
          </Button>
        </div>
      </div>

      <div className="divide-y divide-border">
        {invoices.length === 0 ? (
          <div className="p-8 text-center">
            <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h4 className="text-sm font-body font-medium text-foreground mb-2">
              Belum ada invoice
            </h4>
            <p className="text-xs font-caption text-muted-foreground">
              No invoices found. Upload your first invoice to get started.
            </p>
          </div>
        ) : (
          invoices.map((invoice) => (
            <div key={invoice.id} className="p-4 hover:bg-muted/30 transition-micro">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon name="FileText" size={18} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-body font-medium text-foreground">
                        {invoice.referenceNumber || invoice.nomorInvoice}
                      </h4>
                      <p className="text-xs font-caption text-muted-foreground">
                        {invoice.fileName || invoice.dokumen}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-caption">
                    <div>
                      <span className="text-muted-foreground">Tanggal Submit:</span>
                      <div className="font-mono text-foreground">
                        {formatDate(invoice.createdAt)}
                      </div>
                      <div className="font-mono text-muted-foreground">
                        {formatTime(invoice.createdAt)}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Nilai Invoice:</span>
                      <div className="font-mono text-foreground">
                        Rp {parseFloat(invoice.jumlahTagihan || 0).toLocaleString('id-ID')}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Sisa Waktu:</span>
                      <div
                        className={`font-mono ${
                          calculateDaysRemaining(invoice.createdAt) <= 1
                            ? 'text-error'
                            : 'text-foreground'
                        }`}
                      >
                        {calculateDaysRemaining(invoice.createdAt)} hari
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Status:</span>
                      <div className="mt-1">
                        <StatusIndicator status={getStatusMapping(invoice.status)} size="sm" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Eye"
                    iconPosition="left"
                    onClick={() => onViewDetails(invoice.id)}
                  >
                    Detail
                  </Button>

                  {/* {invoice.status === 'rejected' && (
                    <Button
                      variant="default"
                      size="sm"
                      iconName="Upload"
                      iconPosition="left"
                      onClick={() => onReupload(invoice.id)}
                    >
                      Upload Ulang
                    </Button>
                  )} */}
                </div>
              </div>

              {invoice.status === 'rejected' && invoice.rejectionReason && (
                <div className="mt-3 p-3 bg-error/10 border border-error/20 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Icon name="AlertCircle" size={16} className="text-error mt-0.5" />
                    <div>
                      <p className="text-sm font-body font-medium text-error mb-1">
                        Alasan Penolakan:
                      </p>
                      <p className="text-xs font-caption text-muted-foreground">
                        {invoice.rejectionReason}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default InvoiceListCard;
