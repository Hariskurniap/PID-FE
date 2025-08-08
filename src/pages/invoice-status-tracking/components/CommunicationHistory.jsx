import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CommunicationHistory = ({ communications, userRole, onAddNote }) => {
  const [showAddNote, setShowAddNote] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('id-ID', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMessageIcon = (type) => {
    switch (type) {
      case 'status_change': return 'ArrowRight';
      case 'note': return 'MessageSquare';
      case 'system': return 'Settings';
      case 'email': return 'Mail';
      case 'rejection': return 'XCircle';
      case 'approval': return 'CheckCircle';
      default: return 'Info';
    }
  };

  const getMessageColor = (type) => {
    switch (type) {
      case 'status_change': return 'text-primary';
      case 'note': return 'text-secondary';
      case 'system': return 'text-muted-foreground';
      case 'email': return 'text-warning';
      case 'rejection': return 'text-error';
      case 'approval': return 'text-success';
      default: return 'text-foreground';
    }
  };

  const handleSubmitNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddNote && onAddNote(newNote.trim());
      setNewNote('');
      setShowAddNote(false);
    } catch (error) {
      console.error('Failed to add note:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const sortedCommunications = [...communications].sort((a, b) => 
    new Date(b.timestamp) - new Date(a.timestamp)
  );

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-heading font-semibold text-foreground">
          Riwayat
        </h3>
        {/* {userRole === 'staff' && (
          <Button
            variant="outline"
            size="sm"
            iconName="Plus"
            iconPosition="left"
            onClick={() => setShowAddNote(!showAddNote)}
          >
            Tambah Catatan
          </Button>
        )} */}
      </div>

      {/* Add Note Form */}
      {/* {showAddNote && (
        <div className="mb-6 p-4 bg-muted/30 rounded-lg border border-border">
          <form onSubmit={handleSubmitNote}>
            <div className="mb-3">
              <label className="block text-sm font-body font-medium text-foreground mb-2">
                Tambah Catatan Internal
              </label>
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Tulis catatan untuk invoice ini..."
                className="w-full p-3 border border-border rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
                rows={3}
                required
              />
            </div>
            <div className="flex items-center space-x-3">
              <Button
                type="submit"
                variant="default"
                size="sm"
                loading={isSubmitting}
                iconName="Send"
                iconPosition="left"
              >
                {isSubmitting ? 'Mengirim...' : 'Kirim Catatan'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowAddNote(false);
                  setNewNote('');
                }}
              >
                Batal
              </Button>
            </div>
          </form>
        </div>
      )} */}

      {/* Communications List */}
      {sortedCommunications.length === 0 ? (
        <div className="text-center py-8">
          <Icon name="MessageSquare" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h4 className="text-sm font-body font-medium text-foreground mb-2">
            Belum Ada Komunikasi
          </h4>
          <p className="text-xs font-caption text-muted-foreground">
            Riwayat komunikasi dan notifikasi akan muncul di sini
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedCommunications.map((comm, index) => (
            <div key={index} className="flex items-start space-x-4">
              {/* Timeline Indicator */}
              <div className="flex flex-col items-center">
                <div className={`
                  w-8 h-8 rounded-full border-2 border-background flex items-center justify-center
                  ${comm.type === 'approval' ? 'bg-success' :
                    comm.type === 'rejection' ? 'bg-error' :
                    comm.type === 'status_change' ? 'bg-primary' :
                    comm.type === 'note'? 'bg-secondary' : 'bg-muted'}
                `}>
                  <Icon 
                    name={getMessageIcon(comm.type)} 
                    size={14} 
                    color={comm.type === 'system' ? 'currentColor' : 'white'}
                  />
                </div>
                {index < sortedCommunications.length - 1 && (
                  <div className="w-0.5 h-8 bg-border mt-2" />
                )}
              </div>

              {/* Communication Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-sm font-body font-medium text-foreground">
                      {comm.status}
                    </h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs font-caption text-muted-foreground">
                        {comm.notes}
                      </span>
                      </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs font-caption text-muted-foreground">
                        {comm.changedBy}
                      </span>
                      <span className="text-xs font-mono text-muted-foreground">
                        {formatTimestamp(comm.changedAt)}
                      </span>
                      {/* {comm.type === 'email' && (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-warning/10 text-warning rounded-full text-xs font-caption">
                          <Icon name="Mail" size={10} />
                          <span>Email Terkirim</span>
                        </span>
                      )} */}
                    </div>
                  </div>
                  {/* {comm.priority && (
                    <span className={`
                      inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-caption
                      ${comm.priority === 'high' ? 'bg-error/10 text-error' :
                        comm.priority === 'medium'? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'}
                    `}>
                      <Icon 
                        name={comm.priority === 'high' ? 'AlertTriangle' : 
                              comm.priority === 'medium' ? 'AlertCircle' : 'Info'} 
                        size={10} 
                      />
                      <span>
                        {comm.priority === 'high' ? 'Tinggi' :
                         comm.priority === 'medium' ? 'Sedang' : 'Normal'}
                      </span>
                    </span>
                  )} */}
                </div>

                <div className="bg-muted/30 rounded-lg p-3">
                  <p className="text-sm font-body text-foreground leading-relaxed">
                    {comm.message}
                  </p>
                  
                  {comm.attachments && comm.attachments.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <p className="text-xs font-caption text-muted-foreground mb-2">
                        Lampiran:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {comm.attachments.map((attachment, idx) => (
                          <div key={idx} className="flex items-center space-x-2 px-2 py-1 bg-background rounded border border-border">
                            <Icon name="Paperclip" size={12} className="text-muted-foreground" />
                            <span className="text-xs font-caption text-foreground">
                              {attachment.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* {comm.metadata && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <div className="grid grid-cols-2 gap-4 text-xs font-caption">
                        {comm.metadata.oldStatus && (
                          <div>
                            <span className="text-muted-foreground">Status Lama:</span>
                            <span className="ml-1 text-foreground">{comm.metadata.oldStatus}</span>
                          </div>
                        )}
                        {comm.metadata.newStatus && (
                          <div>
                            <span className="text-muted-foreground">Status Baru:</span>
                            <span className="ml-1 text-foreground">{comm.metadata.newStatus}</span>
                          </div>
                        )}
                        {comm.metadata.processingTime && (
                          <div>
                            <span className="text-muted-foreground">Waktu Proses:</span>
                            <span className="ml-1 text-foreground">{comm.metadata.processingTime}</span>
                          </div>
                        )}
                        {comm.metadata.assignedTo && (
                          <div>
                            <span className="text-muted-foreground">Ditugaskan ke:</span>
                            <span className="ml-1 text-foreground">{comm.metadata.assignedTo}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )} */}
                </div>

                {/* Internal Note Indicator */}
                {comm.type === 'note' && comm.isInternal && (
                  <div className="mt-2">
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-secondary/10 text-secondary rounded-full text-xs font-caption">
                      <Icon name="Lock" size={10} />
                      <span>Catatan Internal</span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Auto-refresh Notice */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-center space-x-2 text-xs font-caption text-muted-foreground">
          <Icon name="RefreshCw" size={12} />
          <span>Riwayat diperbarui secara otomatis setiap 30 detik</span>
        </div>
      </div>
    </div>
  );
};

export default CommunicationHistory;