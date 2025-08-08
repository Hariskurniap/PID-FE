import React from 'react';
import Icon from '../AppIcon';

const StatusIndicator = ({
  status,
  size = 'default',
  showLabel = true,
  showIcon = true,
  className = ''
}) => {
  const statusConfig = {
    pending: {
      label: 'Menunggu Review',
      englishLabel: 'Pending Review',
      icon: 'Clock',
      color: 'warning',
      bgColor: 'bg-warning/10',
      textColor: 'text-warning',
      borderColor: 'border-warning/20'
    },
    reviewing: {
      label: 'Sedang Direview',
      englishLabel: 'Under Review',
      icon: 'Eye',
      color: 'secondary',
      bgColor: 'bg-secondary/10',
      textColor: 'text-secondary',
      borderColor: 'border-secondary/20'
    },
    paid: {
      label: 'Lunas',
      englishLabel: 'Paid',
      icon: 'CheckCircle',  // atau icon lain yang sesuai
      color: 'success',
      bgColor: 'bg-success/10',
      textColor: 'text-success',
      borderColor: 'border-success/20'
    },
    approved: {
      label: 'Disetujui',
      englishLabel: 'Approved',
      icon: 'CheckCircle',
      color: 'success',
      bgColor: 'bg-success/10',
      textColor: 'text-success',
      borderColor: 'border-success/20'
    },
    rejected: {
      label: 'Ditolak',
      englishLabel: 'Rejected',
      icon: 'XCircle',
      color: 'error',
      bgColor: 'bg-error/10',
      textColor: 'text-error',
      borderColor: 'border-error/20'
    },
    processing: {
      label: 'Sedang Diproses',
      englishLabel: 'Processing',
      icon: 'Loader2',
      color: 'primary',
      bgColor: 'bg-primary/10',
      textColor: 'text-primary',
      borderColor: 'border-primary/20'
    },
    completed: {
      label: 'Selesai',
      englishLabel: 'Completed',
      icon: 'Check',
      color: 'success',
      bgColor: 'bg-success/10',
      textColor: 'text-success',
      borderColor: 'border-success/20'
    },
    cancelled: {
      label: 'Dibatalkan',
      englishLabel: 'Cancelled',
      icon: 'Ban',
      color: 'muted-foreground',
      bgColor: 'bg-muted',
      textColor: 'text-muted-foreground',
      borderColor: 'border-muted'
    },
    assigned: {
      label: 'Ditugaskan',
      englishLabel: 'Assigned',
      icon: 'UserCheck',
      color: 'warning',
      bgColor: 'bg-warning/10',
      textColor: 'text-warning',
      borderColor: 'border-warning/20'
    }
  };

  const sizeConfig = {
    sm: {
      container: 'px-2 py-1 text-xs',
      icon: 12,
      gap: 'space-x-1'
    },
    default: {
      container: 'px-3 py-1.5 text-sm',
      icon: 14,
      gap: 'space-x-2'
    },
    lg: {
      container: 'px-4 py-2 text-base',
      icon: 16,
      gap: 'space-x-2'
    }
  };

  const config = statusConfig[status] || statusConfig.pending;
  const sizeStyles = sizeConfig[size];

  const isAnimated = status === 'processing' || status === 'reviewing';

  return (
    <div className={`
      inline-flex items-center ${sizeStyles.gap} ${sizeStyles.container}
      ${config.bgColor} ${config.textColor} ${config.borderColor}
      border rounded-full font-body font-medium transition-micro
      ${className}
    `}>
      {showIcon &&
        <Icon
          name={config.icon}
          size={sizeStyles.icon}
          className={isAnimated ? 'animate-spin' : ''} />

      }
      {showLabel &&
        <div className="flex flex-col">
          <span className="leading-tight">{config.label}</span>
          {size !== 'sm' &&
            <span className="text-xs opacity-75 leading-tight">
              {config.englishLabel}
            </span>
          }
        </div>
      }
    </div>);

};

// Status Badge for compact display
export const StatusBadge = ({ status, className = '' }) => {
  return (
    <StatusIndicator
      status={status}
      size="sm"
      showLabel={false}
      className={className} />);


};

// Status Card for detailed display
export const StatusCard = ({
  status,
  title,
  description,
  timestamp,
  className = '', statusConfig
}) => {
  const config = statusConfig[status] || statusConfig.pending;

  return (
    <div className={`
      p-4 rounded-lg border ${config.borderColor} ${config.bgColor}
      transition-micro hover:shadow-card ${className}
    `}>
      <div className="flex items-start space-x-3">
        <div className={`
          w-8 h-8 rounded-full flex items-center justify-center
          ${config.textColor === 'text-muted-foreground' ? 'bg-muted' : `bg-${config.color}`}
        `}>
          <Icon
            name={config.icon}
            size={16}
            color={config.textColor === 'text-muted-foreground' ? 'currentColor' : 'white'}
            className={status === 'processing' ? 'animate-spin' : ''} />

        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <StatusIndicator status={status} size="sm" showIcon={false} />
          </div>
          {title &&
            <h4 className="text-sm font-body font-medium text-foreground mb-1">
              {title}
            </h4>
          }
          {description &&
            <p className="text-xs font-caption text-muted-foreground mb-2">
              {description}
            </p>
          }
          {timestamp &&
            <p className="text-xs font-mono text-muted-foreground">
              {timestamp}
            </p>
          }
        </div>
      </div>
    </div>);

};

export default StatusIndicator;