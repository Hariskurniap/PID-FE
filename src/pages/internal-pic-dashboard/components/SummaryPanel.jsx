import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import StatusIndicator from '../../../components/ui/StatusIndicator';

const SummaryPanel = ({ isCollapsed, onToggleCollapse }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedMetric, setSelectedMetric] = useState('today');

  // Mock data for dashboard metrics
  const todayMetrics = {
    totalReceived: 24,
    pendingReview: 8,
    inProgress: 12,
    completed: 4,
    overdue: 3,
    avgProcessingTime: '2.3 hari'
  };

  const teamWorkload = [
    { name: 'Ahmad Wijaya', assigned: 8, completed: 3, pending: 5, avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { name: 'Sari Indah', assigned: 6, completed: 4, pending: 2, avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { name: 'Budi Santoso', assigned: 10, completed: 2, pending: 8, avatar: 'https://randomuser.me/api/portraits/men/56.jpg' },
    { name: 'Anda', assigned: 7, completed: 5, pending: 2, avatar: 'https://randomuser.me/api/portraits/men/68.jpg' }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'approval',
      message: 'Invoice INV-2024-001234 disetujui',
      user: 'Ahmad Wijaya',
      timestamp: new Date(Date.now() - 300000),
      icon: 'CheckCircle',
      color: 'text-success'
    },
    {
      id: 2,
      type: 'submission',
      message: 'Invoice baru dari PT Maju Jaya',
      user: 'System',
      timestamp: new Date(Date.now() - 600000),
      icon: 'Upload',
      color: 'text-primary'
    },
    {
      id: 3,
      type: 'rejection',
      message: 'Invoice INV-2024-001235 ditolak',
      user: 'Sari Indah',
      timestamp: new Date(Date.now() - 900000),
      icon: 'XCircle',
      color: 'text-error'
    },
    {
      id: 4,
      type: 'assignment',
      message: 'Invoice ditugaskan ke Budi Santoso',
      user: 'System',
      timestamp: new Date(Date.now() - 1200000),
      icon: 'UserPlus',
      color: 'text-secondary'
    }
  ];

  const urgentItems = [
    {
      id: 'INV-2024-001240',
      vendor: 'PT Sejahtera Abadi',
      amount: 15750000,
      deadline: new Date(Date.now() + 86400000), // 1 day
      status: 'pending'
    },
    {
      id: 'INV-2024-001238',
      vendor: 'CV Mitra Usaha',
      amount: 8500000,
      deadline: new Date(Date.now() - 3600000), // Overdue
      status: 'reviewing'
    },
    {
      id: 'INV-2024-001241',
      vendor: 'PT Global Mandiri',
      amount: 22300000,
      deadline: new Date(Date.now() + 172800000), // 2 days
      status: 'pending'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const formatRelativeTime = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return `${diffMins} menit lalu`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} jam lalu`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} hari lalu`;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getDeadlineStatus = (deadline) => {
    const now = new Date();
    const diffTime = deadline - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: 'Terlambat', color: 'text-error', urgent: true };
    if (diffDays === 0) return { text: 'Hari ini', color: 'text-warning', urgent: true };
    if (diffDays === 1) return { text: '1 hari lagi', color: 'text-warning', urgent: false };
    return { text: `${diffDays} hari lagi`, color: 'text-muted-foreground', urgent: false };
  };

  return (
    <div className={`bg-card border-l border-border transition-all duration-300 ${
      isCollapsed ? 'w-12' : 'w-96'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            iconName={isCollapsed ? "ChevronLeft" : "ChevronRight"}
          />
          {!isCollapsed && (
            <div className="text-right">
              <h3 className="text-lg font-heading font-semibold text-foreground">
                Ringkasan Hari Ini
              </h3>
              <p className="text-sm font-mono text-muted-foreground">
                {formatTime(currentTime)} WIB
              </p>
            </div>
          )}
        </div>
      </div>

      {!isCollapsed && (
        <div className="p-4 space-y-6 max-h-screen overflow-y-auto">
          {/* Today's Metrics */}
          <div>
            <h4 className="text-sm font-body font-medium text-foreground mb-3">
              Metrik Hari Ini
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                <div className="flex items-center space-x-2 mb-1">
                  <Icon name="FileText" size={16} className="text-primary" />
                  <span className="text-xs font-caption text-primary">Diterima</span>
                </div>
                <div className="text-lg font-heading font-bold text-primary">
                  {todayMetrics.totalReceived}
                </div>
              </div>
              
              <div className="p-3 bg-warning/10 rounded-lg border border-warning/20">
                <div className="flex items-center space-x-2 mb-1">
                  <Icon name="Clock" size={16} className="text-warning" />
                  <span className="text-xs font-caption text-warning">Pending</span>
                </div>
                <div className="text-lg font-heading font-bold text-warning">
                  {todayMetrics.pendingReview}
                </div>
              </div>
              
              <div className="p-3 bg-secondary/10 rounded-lg border border-secondary/20">
                <div className="flex items-center space-x-2 mb-1">
                  <Icon name="Eye" size={16} className="text-secondary" />
                  <span className="text-xs font-caption text-secondary">Review</span>
                </div>
                <div className="text-lg font-heading font-bold text-secondary">
                  {todayMetrics.inProgress}
                </div>
              </div>
              
              <div className="p-3 bg-success/10 rounded-lg border border-success/20">
                <div className="flex items-center space-x-2 mb-1">
                  <Icon name="CheckCircle" size={16} className="text-success" />
                  <span className="text-xs font-caption text-success">Selesai</span>
                </div>
                <div className="text-lg font-heading font-bold text-success">
                  {todayMetrics.completed}
                </div>
              </div>
            </div>
            
            {todayMetrics.overdue > 0 && (
              <div className="mt-3 p-3 bg-error/10 rounded-lg border border-error/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon name="AlertTriangle" size={16} className="text-error" />
                    <span className="text-sm font-body font-medium text-error">
                      Terlambat
                    </span>
                  </div>
                  <span className="text-lg font-heading font-bold text-error">
                    {todayMetrics.overdue}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Urgent Items */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-body font-medium text-foreground">
                Perlu Perhatian
              </h4>
              <Button
                variant="ghost"
                size="sm"
                iconName="ExternalLink"
              />
            </div>
            <div className="space-y-2">
              {urgentItems.map((item) => {
                const deadlineStatus = getDeadlineStatus(item.deadline);
                return (
                  <div
                    key={item.id}
                    className={`p-3 rounded-lg border transition-micro hover:shadow-card cursor-pointer ${
                      deadlineStatus.urgent ? 'bg-warning/5 border-warning/20' : 'bg-muted/30 border-border'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-medium text-foreground">
                        {item.id}
                      </span>
                      <StatusIndicator status={item.status} size="sm" showLabel={false} />
                    </div>
                    <div className="text-sm font-body font-medium text-foreground mb-1">
                      {item.vendor}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-muted-foreground">
                        {formatCurrency(item.amount)}
                      </span>
                      <span className={`text-xs font-body font-medium ${deadlineStatus.color}`}>
                        {deadlineStatus.text}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Team Workload */}
          <div>
            <h4 className="text-sm font-body font-medium text-foreground mb-3">
              Beban Kerja Tim
            </h4>
            <div className="space-y-3">
              {teamWorkload.map((member) => (
                <div key={member.name} className="flex items-center space-x-3">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-body font-medium text-foreground">
                      {member.name}
                    </div>
                    <div className="flex items-center space-x-2 text-xs font-caption text-muted-foreground">
                      <span>{member.assigned} total</span>
                      <span>•</span>
                      <span className="text-success">{member.completed} selesai</span>
                      <span>•</span>
                      <span className="text-warning">{member.pending} pending</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div>
            <h4 className="text-sm font-body font-medium text-foreground mb-3">
              Aktivitas Terbaru
            </h4>
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center bg-muted ${activity.color}`}>
                    <Icon name={activity.icon} size={12} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-body text-foreground">
                      {activity.message}
                    </div>
                    <div className="text-xs font-caption text-muted-foreground">
                      {activity.user} • {formatRelativeTime(activity.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              fullWidth
              iconName="MoreHorizontal"
              className="mt-3"
            >
              Lihat Semua
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SummaryPanel;