import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import StatusIndicator from '../../../components/ui/StatusIndicator';

const BastListCard = ({ basts = [], loading = false, onViewDetails, onRefresh, onReview }) => {
  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-100';
      case 'DISETUJUI_REVIEWER':
        return 'text-green-600 bg-green-100';
      case 'DITOLAK_REVIEWER':
        return 'text-red-600 bg-red-100';
      case 'DRAFT':
        return 'text-blue-600 bg-blue-100';
      case 'WAITING_APPROVER':
        return 'text-indigo-600 bg-indigo-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // 📝 Urutkan BAST dari terbaru ke lama
  const sortedBasts = [...basts].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="bg-card rounded-lg shadow-card border border-border">
      {/* Header */}
      <div className="p-6 border-b border-border flex justify-between items-center">
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground">
            Daftar BAST untuk Review
          </h3>
          <p className="text-sm font-caption text-muted-foreground">
            Daftar BAST yang membutuhkan review Anda
          </p>
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

      {/* Body */}
      <div className="divide-y divide-border">
        {sortedBasts.length === 0 ? (
          <div className="p-8 text-center">
            <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h4 className="text-sm font-body font-medium text-foreground mb-2">
              Tidak ada BAST untuk direview
            </h4>
            <p className="text-xs font-caption text-muted-foreground">
              Saat ini tidak ada BAST yang membutuhkan review Anda.
            </p>
          </div>
        ) : (
          sortedBasts.map((bast) => (
            <div key={bast.id} className="p-4 hover:bg-muted/30 transition-micro">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
                <div className="flex-1">
                  {/* Header Card */}
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon name="FileText" size={18} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-body font-medium text-foreground">
                        {bast.idBast}
                      </h4>
                      <p className="text-xs font-caption text-muted-foreground">
                        {bast.nomorPo || '-'} • {bast.vendor?.nama || 'Vendor tidak diketahui'}
                      </p>
                    </div>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-caption">
                    <div>
                      <span className="text-muted-foreground">Tanggal Buat:</span>
                      <div className="font-mono text-foreground">{formatDate(bast.createdAt)}</div>
                      <div className="font-mono text-muted-foreground">{formatTime(bast.createdAt)}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Status:</span>
                      <div className="mt-1">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            bast.status
                          )}`}
                        >
                          {bast.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Nomor Kontrak:</span>
                      <div className="font-mono text-foreground">{bast.nomorKontrak || '-'}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Perihal:</span>
                      <div className="font-mono text-foreground">{bast.perihal || '-'}</div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Eye"
                    iconPosition="left"
                    onClick={() => onViewDetails(bast.idBast)}
                  >
                    Detail
                  </Button>

                  {bast.status === 'WAITING_APPROVER' && (
                    <Button
                      variant="default"
                      size="sm"
                      iconName="CheckCircle"
                      iconPosition="left"
                      onClick={() => onReview(bast.idBast)}
                    >
                      Review
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BastListCard;
