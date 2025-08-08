import React from 'react';
import Icon from '../../../components/AppIcon';
import StatusIndicator from '../../../components/ui/StatusIndicator';

const ProcessingHistory = ({ history = [] }) => {
  const mockHistory = [
    {
      id: 1,
      action: "submitted",
      status: "pending",
      timestamp: "2024-01-15T10:30:00Z",
      user: {
        name: "PT Maju Jaya Sejahtera",
        role: "vendor",
        avatar: null
      },
      description: "Invoice disubmit oleh vendor",
      details: "Dokumen berhasil diunggah dengan nomor referensi REF-240115-001"
    },
    {
      id: 2,
      action: "received",
      status: "reviewing",
      timestamp: "2024-01-15T10:32:00Z",
      user: {
        name: "Sistem",
        role: "system",
        avatar: null
      },
      description: "Invoice diterima sistem",
      details: "Validasi format dokumen berhasil, invoice masuk antrian review"
    },
    {
      id: 3,
      action: "assigned",
      status: "reviewing",
      timestamp: "2024-01-15T11:15:00Z",
      user: {
        name: "Sari Dewi",
        role: "reviewer",
        avatar: "https://randomuser.me/api/portraits/women/32.jpg"
      },
      description: "Invoice ditugaskan untuk review",
      details: "Dokumen ditugaskan kepada reviewer untuk proses verifikasi"
    },
    {
      id: 4,
      action: "reviewing",
      status: "reviewing",
      timestamp: "2024-01-15T14:20:00Z",
      user: {
        name: "Sari Dewi",
        role: "reviewer",
        avatar: "https://randomuser.me/api/portraits/women/32.jpg"
      },
      description: "Review sedang berlangsung",
      details: "Reviewer sedang memeriksa kelengkapan dokumen dan validitas data"
    }
  ];

  const currentHistory = history.length > 0 ? history : mockHistory;

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'submitted': return 'Upload';
      case 'received': return 'CheckCircle';
      case 'assigned': return 'UserCheck';
      case 'reviewing': return 'Eye';
      case 'approved': return 'CheckCircle2';
      case 'rejected': return 'XCircle';
      case 'forwarded': return 'Send';
      default: return 'Clock';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'vendor': return 'text-secondary';
      case 'reviewer': return 'text-primary';
      case 'manager': return 'text-accent';
      case 'system': return 'text-muted-foreground';
      default: return 'text-foreground';
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'vendor': return 'Vendor';
      case 'reviewer': return 'Reviewer';
      case 'manager': return 'Manager';
      case 'system': return 'Sistem';
      default: return 'User';
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-heading font-semibold text-foreground">
          Riwayat Pemrosesan
        </h3>
        <div className="flex items-center space-x-2">
          <Icon name="History" size={16} className="text-muted-foreground" />
          <span className="text-sm font-caption text-muted-foreground">
            {currentHistory.length} aktivitas
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {currentHistory.map((item, index) => {
          const { date, time } = formatTimestamp(item.timestamp);
          const isLatest = index === currentHistory.length - 1;

          return (
            <div key={item.id} className="relative">
              {/* Timeline Line */}
              {index < currentHistory.length - 1 && (
                <div className="absolute left-6 top-12 w-0.5 h-16 bg-border" />
              )}

              <div className="flex space-x-4">
                {/* Timeline Icon */}
                <div className={`
                  flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center
                  ${isLatest ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
                  transition-micro
                `}>
                  <Icon name={getActionIcon(item.action)} size={16} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-body font-semibold text-foreground">
                        {item.description}
                      </h4>
                      <StatusIndicator status={item.status} size="sm" showLabel={false} />
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-mono text-foreground">
                        {time}
                      </p>
                      <p className="text-xs font-caption text-muted-foreground">
                        {date}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm font-body text-muted-foreground mb-2">
                    {item.details}
                  </p>

                  <div className="flex items-center space-x-3">
                    {item.user.avatar ? (
                      <img
                        src={item.user.avatar}
                        alt={item.user.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                        <Icon name="User" size={12} className="text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-body font-medium ${getRoleColor(item.user.role)}`}>
                        {item.user.name}
                      </span>
                      <span className="text-xs font-caption text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                        {getRoleBadge(item.user.role)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Processing Time Summary */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg font-heading font-semibold text-foreground">
              1h 50m
            </p>
            <p className="text-xs font-caption text-muted-foreground">
              Waktu Review
            </p>
          </div>
          <div>
            <p className="text-lg font-heading font-semibold text-warning">
              1 hari
            </p>
            <p className="text-xs font-caption text-muted-foreground">
              Sisa Waktu
            </p>
          </div>
          <div>
            <p className="text-lg font-heading font-semibold text-primary">
              3 hari
            </p>
            <p className="text-xs font-caption text-muted-foreground">
              Batas Maksimal
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessingHistory;