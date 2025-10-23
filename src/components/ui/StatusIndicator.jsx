import React from 'react';
import Icon from '../AppIcon';

const bastStatusConfig = {
  DRAFT: {
    label: 'Draft',
    englishLabel: 'Draft',
    icon: 'FileText',
    color: 'muted-foreground',
    bgColor: 'bg-muted/10',
    textColor: 'text-muted-foreground',
    borderColor: 'border-muted/20',
  },
  REJECT_FROM_REVIEW: {
  label: 'Reject From Review',
  englishLabel: 'Reject From Review',
  icon: 'FileText',
  color: 'red',
  bgColor: 'bg-red-100',
  textColor: 'text-red-600',
  borderColor: 'border-red-200',
},
  WAITING_REVIEW: {
    label: 'Menunggu Review',
    englishLabel: 'Pending Review',
    icon: 'Clock',
    color: 'warning',
    bgColor: 'bg-warning/10',
    textColor: 'text-warning',
    borderColor: 'border-warning/20',
  },
  WAITING_APPROVER: {
    label: 'Menunggu Approver',
    englishLabel: 'Pending Approver',
    icon: 'Clock',
    color: 'warning',
    bgColor: 'bg-warning/10',
    textColor: 'text-warning',
    borderColor: 'border-warning/20',
  },
  DISETUJUI_APPROVER: {
    label: 'Disetujui Approver',
    englishLabel: 'Approved by Approver',
    icon: 'CheckCircle',
    color: 'success',
    bgColor: 'bg-success/10',
    textColor: 'text-success',
    borderColor: 'border-success/20',
  },
  DISETUJUI_VENDOR: {
    label: 'Disetujui Vendor',
    englishLabel: 'Approved by Vendor',
    icon: 'CheckCircle',
    color: 'success',
    bgColor: 'bg-success/10',
    textColor: 'text-success',
    borderColor: 'border-success/20',
  },
  INPUT_SAGR: {
    label: 'Input ke SAGR',
    englishLabel: 'Input to SAGR',
    icon: 'Database',
    color: 'primary',
    bgColor: 'bg-primary/10',
    textColor: 'text-primary',
    borderColor: 'border-primary/20',
  },
  BAST_DONE: {
    label: 'Selesai',
    englishLabel: 'Completed',
    icon: 'Check',
    color: 'success',
    bgColor: 'bg-success/10',
    textColor: 'text-success',
    borderColor: 'border-success/20',
  },
};

const sizeConfig = {
  sm: {
    container: 'px-2 py-1 text-xs',
    icon: 12,
    gap: 'space-x-1',
  },
  default: {
    container: 'px-3 py-1.5 text-sm',
    icon: 14,
    gap: 'space-x-2',
  },
  lg: {
    container: 'px-4 py-2 text-base',
    icon: 16,
    gap: 'space-x-2',
  },
};

const StatusIndicator = ({ status, size = 'default', showLabel = true, showIcon = true, className = '' }) => {
  const config = bastStatusConfig[status] || bastStatusConfig.DRAFT;
  const sizeStyles = sizeConfig[size];

  return (
    <div
      className={`
        inline-flex items-center ${sizeStyles.gap} ${sizeStyles.container}
        ${config.bgColor} ${config.textColor} ${config.borderColor}
        border rounded-full font-body font-medium transition-micro
        ${className}
      `}
    >
      {showIcon && <Icon name={config.icon} size={sizeStyles.icon} />}
      {showLabel && (
        <div className="flex flex-col">
          <span className="leading-tight">{config.label}</span>
          {size !== 'sm' && (
            <span className="text-xs opacity-75 leading-tight">{config.englishLabel}</span>
          )}
        </div>
      )}
    </div>
  );
};

// Compact badge (no label)
export const StatusBadge = ({ status, className = '' }) => (
  <StatusIndicator status={status} size="sm" showLabel={false} className={className} />
);

// Detailed card
export const StatusCard = ({ status, title, description, timestamp, className = '' }) => {
  const config = bastStatusConfig[status] || bastStatusConfig.DRAFT;
  return (
    <div
      className={`
        p-4 rounded-lg border ${config.borderColor} ${config.bgColor}
        transition-micro hover:shadow-card ${className}
      `}
    >
      <div className="flex items-start space-x-3">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            config.textColor === 'text-muted-foreground' ? 'bg-muted' : `bg-${config.color}`
          }`}
        >
          <Icon
            name={config.icon}
            size={16}
            color={config.textColor === 'text-muted-foreground' ? 'currentColor' : 'white'}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <StatusIndicator status={status} size="sm" showIcon={false} />
          </div>
          {title && <h4 className="text-sm font-body font-medium text-foreground mb-1">{title}</h4>}
          {description && (
            <p className="text-xs font-caption text-muted-foreground mb-2">{description}</p>
          )}
          {timestamp && (
            <p className="text-xs font-mono text-muted-foreground">{timestamp}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatusIndicator;
