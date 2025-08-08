import React from 'react';
import Icon from '../../../components/AppIcon';

const RecentActivityCard = ({ activities, onViewAll }) => {
  const getActivityIcon = (type) => {
    const iconMap = {
      'upload': 'Upload',
      'status_change': 'RefreshCw',
      'rejection': 'XCircle',
      'approval': 'CheckCircle',
      'reupload': 'RotateCcw'
    };
    return iconMap[type] || 'Bell';
  };

  const getActivityColor = (type) => {
    const colorMap = {
      'upload': 'text-primary',
      'status_change': 'text-secondary',
      'rejection': 'text-error',
      'approval': 'text-success',
      'reupload': 'text-warning'
    };
    return colorMap[type] || 'text-muted-foreground';
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const activityDate = new Date(date);
    const diffInMinutes = Math.floor((now - activityDate) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Baru saja';
    if (diffInMinutes < 60) return `${diffInMinutes} menit lalu`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} jam lalu`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} hari lalu`;
  };

  return (
    <div className="bg-card rounded-lg shadow-card border border-border">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground">
              Aktivitas Terbaru
            </h3>
            <p className="text-sm font-caption text-muted-foreground">
              Recent Activities
            </p>
          </div>
          {activities.length > 0 && (
            <button
              onClick={onViewAll}
              className="text-sm font-body text-primary hover:text-primary/80 transition-micro"
            >
              Lihat Semua
            </button>
          )}
        </div>
      </div>

      <div className="divide-y divide-border max-h-80 overflow-y-auto">
        {activities.length === 0 ? (
          <div className="p-6 text-center">
            <Icon name="Activity" size={40} className="text-muted-foreground mx-auto mb-3" />
            <p className="text-sm font-body text-muted-foreground">
              Belum ada aktivitas terbaru
            </p>
            <p className="text-xs font-caption text-muted-foreground">
              No recent activities
            </p>
          </div>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="p-4 hover:bg-muted/30 transition-micro">
              <div className="flex items-start space-x-3">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  bg-muted ${getActivityColor(activity.type)}
                `}>
                  <Icon name={getActivityIcon(activity.type)} size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-body text-foreground mb-1">
                    {activity.description}
                  </p>
                  <div className="flex items-center space-x-2 text-xs font-caption text-muted-foreground">
                    <span>{activity.referenceNumber}</span>
                    <span>•</span>
                    <span>{formatTimeAgo(activity.timestamp)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentActivityCard;