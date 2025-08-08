import React, { useState, useEffect, useCallback } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const SessionTimeoutHandler = ({ 
  timeoutDuration = 600000, // 10 minutes in milliseconds
  warningDuration = 60000,  // 1 minute warning
  onTimeout,
  onExtend,
  isActive = true 
}) => {
  const [timeLeft, setTimeLeft] = useState(timeoutDuration);
  const [showWarning, setShowWarning] = useState(false);
  const [isExtending, setIsExtending] = useState(false);

  const resetTimer = useCallback(() => {
    setTimeLeft(timeoutDuration);
    setShowWarning(false);
  }, [timeoutDuration]);

  const handleUserActivity = useCallback(() => {
    if (isActive && !showWarning) {
      resetTimer();
    }
  }, [isActive, showWarning, resetTimer]);

  const handleExtendSession = async () => {
    setIsExtending(true);
    try {
      if (onExtend) {
        await onExtend();
      }
      resetTimer();
    } catch (error) {
      console.error('Failed to extend session:', error);
    } finally {
      setIsExtending(false);
    }
  };

  const handleLogout = () => {
    if (onTimeout) {
      onTimeout();
    }
  };

  const formatTime = (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (!isActive) return;

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, handleUserActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserActivity, true);
      });
    };
  }, [handleUserActivity, isActive]);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        const newTime = prevTime - 1000;
        
        if (newTime <= warningDuration && !showWarning) {
          setShowWarning(true);
        }
        
        if (newTime <= 0) {
          handleLogout();
          return 0;
        }
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, warningDuration, showWarning]);

  if (!isActive || !showWarning) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-1200 animate-fade-in">
      <div className="bg-card rounded-lg shadow-modal max-w-md w-full mx-4 animate-scale-in">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-warning rounded-full flex items-center justify-center">
              <Icon name="Clock" size={20} color="white" />
            </div>
            <div>
              <h3 className="text-lg font-heading font-semibold text-foreground">
                Sesi Akan Berakhir
              </h3>
              <p className="text-sm font-caption text-muted-foreground">
                Session Timeout Warning
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="mb-6">
            <p className="text-sm font-body text-foreground mb-3">
              Sesi Anda akan berakhir dalam <span className="font-mono font-medium text-warning">{formatTime(timeLeft)}</span>.
              Apakah Anda ingin memperpanjang sesi?
            </p>
            <p className="text-xs font-caption text-muted-foreground">
              Your session will expire soon. Would you like to extend your session?
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-warning h-2 rounded-full transition-all duration-1000 ease-linear"
                style={{ 
                  width: `${(timeLeft / warningDuration) * 100}%` 
                }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex-1 sm:order-2"
              iconName="LogOut"
              iconPosition="left"
            >
              Logout
            </Button>
            <Button
              variant="default"
              onClick={handleExtendSession}
              loading={isExtending}
              className="flex-1 sm:order-1"
              iconName="RefreshCw"
              iconPosition="left"
            >
              {isExtending ? 'Memperpanjang...' : 'Perpanjang Sesi'}
            </Button>
          </div>

          {/* Additional Info */}
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs font-caption text-muted-foreground text-center">
              Untuk keamanan, sistem akan otomatis logout setelah 10 menit tidak aktif
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionTimeoutHandler;