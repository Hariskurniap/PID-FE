import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';

const NotificationBadge = ({
  count = 0,
  maxCount = 99,
  showZero = false,
  variant = 'default',
  size = 'default',
  position = 'top-right',
  className = '',
  children,
  onClick,
  priority = 'normal'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animate, setAnimate] = useState(false);

  const displayCount = count > maxCount ? `${maxCount}+` : count.toString();
  const shouldShow = count > 0 || showZero;

  const variantConfig = {
    default: {
      bg: 'bg-error',
      text: 'text-error-foreground',
      border: 'border-error'
    },
    primary: {
      bg: 'bg-primary',
      text: 'text-primary-foreground',
      border: 'border-primary'
    },
    warning: {
      bg: 'bg-warning',
      text: 'text-warning-foreground',
      border: 'border-warning'
    },
    success: {
      bg: 'bg-success',
      text: 'text-success-foreground',
      border: 'border-success'
    }
  };

  const sizeConfig = {
    sm: {
      badge: 'min-w-4 h-4 text-xs',
      dot: 'w-2 h-2'
    },
    default: {
      badge: 'min-w-5 h-5 text-xs',
      dot: 'w-2.5 h-2.5'
    },
    lg: {
      badge: 'min-w-6 h-6 text-sm',
      dot: 'w-3 h-3'
    }
  };

  const positionConfig = {
    'top-right': '-top-1 -right-1',
    'top-left': '-top-1 -left-1',
    'bottom-right': '-bottom-1 -right-1',
    'bottom-left': '-bottom-1 -left-1'
  };

  const priorityConfig = {
    low: 'animate-pulse',
    normal: '',
    high: 'animate-bounce',
    urgent: 'animate-ping'
  };

  const config = variantConfig[variant];
  const sizeStyles = sizeConfig[size];
  const positionStyles = positionConfig[position];
  const priorityAnimation = priorityConfig[priority];

  useEffect(() => {
    if (shouldShow && count > 0) {
      setIsVisible(true);
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 600);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(shouldShow);
    }
  }, [count, shouldShow]);

  const handleClick = (e) => {
    if (onClick) {
      e.preventDefault();
      e.stopPropagation();
      onClick(count);
    }
  };

  if (!children) {
    // Standalone badge
    return shouldShow ?
    <div
      className={`
          inline-flex items-center justify-center rounded-full
          ${sizeStyles.badge} ${config.bg} ${config.text}
          font-body font-medium transition-micro
          ${animate ? 'animate-scale-in' : ''}
          ${priorityAnimation}
          ${onClick ? 'cursor-pointer hover:opacity-80' : ''}
          ${className}
        `}
      onClick={handleClick}>

        {displayCount}
      </div> :
    null;
  }

  // Badge with children (positioned)
  return (
    <div className={`relative inline-block ${className}`}>
      {children}
      {isVisible &&
      <div
        className={`
            absolute ${positionStyles} flex items-center justify-center
            rounded-full border-2 border-background transition-micro
            ${count > 0 ? sizeStyles.badge : sizeStyles.dot}
            ${config.bg} ${config.text}
            ${animate ? 'animate-scale-in' : ''}
            ${priorityAnimation}
            ${onClick ? 'cursor-pointer hover:opacity-80' : ''}
            font-body font-medium z-10
          `}
        onClick={handleClick}>

          {count > 0 ? displayCount : ''}
        </div>
      }
    </div>);

};

// Notification Dot (simple indicator)
export const NotificationDot = ({
  isActive = false,
  variant = 'default',
  size = 'default',
  className = '',
  onClick, variantConfig, sizeConfig
}) => {
  const config = variantConfig[variant];
  const sizeStyles = sizeConfig[size];

  return isActive ?
  <div
    className={`
        rounded-full ${sizeStyles.dot} ${config.bg}
        ${onClick ? 'cursor-pointer hover:opacity-80' : ''}
        transition-micro animate-pulse ${className}
      `}
    onClick={onClick} /> :

  null;
};

// Notification List Item
export const NotificationItem = ({
  title,
  message,
  timestamp,
  isRead = false,
  priority = 'normal',
  icon,
  onClick,
  onMarkAsRead,
  className = ''
}) => {
  const priorityColors = {
    low: 'border-l-muted',
    normal: 'border-l-primary',
    high: 'border-l-warning',
    urgent: 'border-l-error'
  };

  return (
    <div
      className={`
        p-4 border-l-4 ${priorityColors[priority]}
        ${isRead ? 'bg-muted/30' : 'bg-card'}
        hover:bg-muted/50 transition-micro cursor-pointer
        ${className}
      `}
      onClick={onClick}>

      <div className="flex items-start space-x-3">
        {icon &&
        <div className="flex-shrink-0 mt-0.5">
            <Icon name={icon} size={16} className="text-muted-foreground" />
          </div>
        }
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className={`
              text-sm font-body font-medium truncate
              ${isRead ? 'text-muted-foreground' : 'text-foreground'}
            `}>
              {title}
            </h4>
            {!isRead &&
            <NotificationDot isActive={true} size="sm" />
            }
          </div>
          <p className="text-sm font-body text-muted-foreground mb-2 line-clamp-2">
            {message}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-muted-foreground">
              {timestamp}
            </span>
            {!isRead && onMarkAsRead &&
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMarkAsRead();
              }}
              className="text-xs font-caption text-primary hover:text-primary/80 transition-micro">

                Mark as read
              </button>
            }
          </div>
        </div>
      </div>
    </div>);

};

export default NotificationBadge;