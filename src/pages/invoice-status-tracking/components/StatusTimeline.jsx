import React from 'react';
import Icon from '../../../components/AppIcon';

const StatusTimeline = ({ invoice, userRole }) => {
  const stages = [
    {
      key: 'dikirim',
      label: 'Dikirim',
      englishLabel: 'Submitted',
      icon: 'Send',
      description: 'Invoice telah dikirim ke sistem'
    },
    {
      key: 'diterima',
      label: 'Diterima',
      englishLabel: 'Received',
      icon: 'CheckCircle',
      description: 'Invoice telah diterima dan masuk antrian review'
    },
    {
      key: 'diverifikasi',
      label: 'Diverifikasi',
      englishLabel: 'Verified',
      icon: 'Shield',
      description: 'Invoice telah diverifikasi oleh tim internal'
    },
    {
      key: 'diteruskan',
      label: 'Diteruskan',
      englishLabel: 'Forwarded',
      icon: 'ArrowRight',
      description: 'Invoice telah diteruskan untuk proses pembayaran'
    }
  ];

  const getStageStatus = (stageKey) => {
    const stageIndex = stages.findIndex(s => s.key === stageKey);
    const currentIndex = stages.findIndex(s => s.key === invoice.status);
    
    if (invoice.status === 'rejected') {
      return stageIndex <= 1 ? 'completed' : 'pending';
    }
    
    if (stageIndex < currentIndex) return 'completed';
    if (stageIndex === currentIndex) return 'current';
    return 'pending';
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes} menit`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours < 24) return `${hours}j ${remainingMinutes}m`;
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days}h ${remainingHours}j`;
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-heading font-semibold text-foreground">
          Status Timeline
        </h3>
        <div className="text-sm font-caption text-muted-foreground">
          Ref: {invoice.referenceNumber}
        </div>
      </div>

      {/* Desktop Timeline */}
      <div className="hidden md:block">
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-6 left-6 right-6 h-0.5 bg-border">
            <div 
              className="h-full bg-primary transition-all duration-500"
              style={{ 
                width: invoice.status === 'rejected' ? '25%' : 
                       `${((stages.findIndex(s => s.key === invoice.status) + 1) / stages.length) * 100}%` 
              }}
            />
          </div>

          {/* Timeline Items */}
          <div className="grid grid-cols-4 gap-4">
            {stages.map((stage, index) => {
              const status = getStageStatus(stage.key);
              const stageData = invoice.timeline?.find(t => t.stage === stage.key);
              
              return (
                <div key={stage.key} className="relative">
                  {/* Stage Icon */}
                  <div className={`
                    w-12 h-12 rounded-full border-2 flex items-center justify-center mb-3 transition-all duration-300
                    ${status === 'completed' ? 'bg-success border-success' : 
                      status === 'current'? 'bg-primary border-primary animate-pulse' : 'bg-background border-border'}
                  `}>
                    <Icon 
                      name={stage.icon} 
                      size={20} 
                      color={status === 'pending' ? 'var(--color-muted-foreground)' : 'white'}
                    />
                  </div>

                  {/* Stage Content */}
                  <div className="text-center">
                    <h4 className={`
                      text-sm font-body font-medium mb-1
                      ${status === 'pending' ? 'text-muted-foreground' : 'text-foreground'}
                    `}>
                      {stage.label}
                    </h4>
                    <p className="text-xs font-caption text-muted-foreground mb-2">
                      {stage.englishLabel}
                    </p>
                    
                    {stageData && (
                      <div className="space-y-1">
                        <p className="text-xs font-mono text-foreground">
                          {new Date(stageData.timestamp).toLocaleString('id-ID')}
                        </p>
                        {stageData.duration && (
                          <p className="text-xs font-caption text-muted-foreground">
                            {formatDuration(stageData.duration)}
                          </p>
                        )}
                        {userRole === 'staff' && stageData.assignedTo && (
                          <p className="text-xs font-caption text-secondary">
                            {stageData.assignedTo}
                          </p>
                        )}
                      </div>
                    )}

                    {status === 'current' && (
                      <div className="mt-2">
                        <div className="inline-flex items-center space-x-1 px-2 py-1 bg-primary/10 text-primary rounded-full">
                          <Icon name="Clock" size={12} />
                          <span className="text-xs font-caption">Sedang Diproses</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Timeline */}
      <div className="md:hidden space-y-4">
        {stages.map((stage, index) => {
          const status = getStageStatus(stage.key);
          const stageData = invoice.timeline?.find(t => t.stage === stage.key);
          
          return (
            <div key={stage.key} className="flex items-start space-x-4">
              {/* Stage Icon */}
              <div className={`
                w-10 h-10 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300
                ${status === 'completed' ? 'bg-success border-success' : 
                  status === 'current'? 'bg-primary border-primary animate-pulse' : 'bg-background border-border'}
              `}>
                <Icon 
                  name={stage.icon} 
                  size={16} 
                  color={status === 'pending' ? 'var(--color-muted-foreground)' : 'white'}
                />
              </div>

              {/* Stage Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className={`
                    text-sm font-body font-medium
                    ${status === 'pending' ? 'text-muted-foreground' : 'text-foreground'}
                  `}>
                    {stage.label}
                  </h4>
                  {status === 'current' && (
                    <div className="inline-flex items-center space-x-1 px-2 py-1 bg-primary/10 text-primary rounded-full">
                      <Icon name="Clock" size={10} />
                      <span className="text-xs font-caption">Proses</span>
                    </div>
                  )}
                </div>
                
                <p className="text-xs font-caption text-muted-foreground mb-2">
                  {stage.description}
                </p>
                
                {stageData && (
                  <div className="space-y-1">
                    <p className="text-xs font-mono text-foreground">
                      {new Date(stageData.timestamp).toLocaleString('id-ID')}
                    </p>
                    {stageData.duration && (
                      <p className="text-xs font-caption text-muted-foreground">
                        Durasi: {formatDuration(stageData.duration)}
                      </p>
                    )}
                    {userRole === 'staff' && stageData.assignedTo && (
                      <p className="text-xs font-caption text-secondary">
                        PIC: {stageData.assignedTo}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Connection Line */}
              {index < stages.length - 1 && (
                <div className="absolute left-9 mt-10 w-0.5 h-8 bg-border" />
              )}
            </div>
          );
        })}
      </div>

      {/* Rejection Notice */}
      {invoice.status === 'rejected' && (
        <div className="mt-6 p-4 bg-error/10 border border-error/20 rounded-lg">
          <div className="flex items-start space-x-3">
            <Icon name="XCircle" size={20} className="text-error flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-body font-medium text-error mb-1">
                Invoice Ditolak
              </h4>
              <p className="text-sm font-body text-foreground mb-2">
                {invoice.rejectionReason || 'Dokumen tidak memenuhi persyaratan yang ditetapkan.'}
              </p>
              <p className="text-xs font-caption text-muted-foreground">
                Silakan perbaiki dan upload ulang dokumen Anda.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusTimeline;