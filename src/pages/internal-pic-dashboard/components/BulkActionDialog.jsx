import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const BulkActionDialog = ({ 
  isOpen, 
  onClose, 
  action, 
  selectedCount, 
  onConfirm 
}) => {
  const [reason, setReason] = useState('');
  const [assignTo, setAssignTo] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const staffOptions = [
    { value: 'ahmad_staff', label: 'Ahmad Wijaya' },
    { value: 'sari_staff', label: 'Sari Indah' },
    { value: 'budi_staff', label: 'Budi Santoso' },
    { value: 'current_user', label: 'Saya Sendiri' }
  ];

  const rejectionReasons = [
    { value: 'incomplete_docs', label: 'Dokumen tidak lengkap' },
    { value: 'invalid_format', label: 'Format dokumen tidak sesuai' },
    { value: 'wrong_amount', label: 'Jumlah tidak sesuai' },
    { value: 'expired_invoice', label: 'Invoice sudah kadaluarsa' },
    { value: 'duplicate', label: 'Invoice duplikat' },
    { value: 'other', label: 'Alasan lainnya' }
  ];

  const getActionConfig = () => {
    switch (action) {
      case 'approve':
        return {
          title: 'Setujui Invoice',
          description: `Anda akan menyetujui ${selectedCount} invoice yang dipilih`,
          icon: 'CheckCircle',
          iconColor: 'text-success',
          confirmText: 'Setujui Semua',
          confirmVariant: 'default'
        };
      case 'reject':
        return {
          title: 'Tolak Invoice',
          description: `Anda akan menolak ${selectedCount} invoice yang dipilih`,
          icon: 'XCircle',
          iconColor: 'text-error',
          confirmText: 'Tolak Semua',
          confirmVariant: 'destructive'
        };
      case 'assign':
        return {
          title: 'Tugaskan Invoice',
          description: `Anda akan menugaskan ${selectedCount} invoice yang dipilih`,
          icon: 'UserPlus',
          iconColor: 'text-primary',
          confirmText: 'Tugaskan',
          confirmVariant: 'default'
        };
      default:
        return {
          title: 'Aksi Bulk',
          description: `Memproses ${selectedCount} invoice`,
          icon: 'Settings',
          iconColor: 'text-muted-foreground',
          confirmText: 'Proses',
          confirmVariant: 'default'
        };
    }
  };

  const handleConfirm = async () => {
    setIsProcessing(true);
    
    try {
      const actionData = {
        action,
        selectedCount,
        ...(action === 'reject' && { reason }),
        ...(action === 'assign' && { assignTo })
      };
      
      await onConfirm(actionData);
      handleClose();
    } catch (error) {
      console.error('Bulk action failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setReason('');
    setAssignTo('');
    setIsProcessing(false);
    onClose();
  };

  const isFormValid = () => {
    if (action === 'reject' && !reason) return false;
    if (action === 'assign' && !assignTo) return false;
    return true;
  };

  if (!isOpen) return null;

  const config = getActionConfig();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-1200 animate-fade-in">
      <div className="bg-card rounded-lg shadow-modal max-w-md w-full mx-4 animate-scale-in">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center space-x-3 mb-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-muted ${config.iconColor}`}>
              <Icon name={config.icon} size={20} />
            </div>
            <div>
              <h3 className="text-lg font-heading font-semibold text-foreground">
                {config.title}
              </h3>
              <p className="text-sm font-caption text-muted-foreground">
                {config.description}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4">
            {action === 'reject' && (
              <div>
                <Select
                  label="Alasan Penolakan"
                  description="Pilih alasan penolakan yang sesuai"
                  options={rejectionReasons}
                  value={reason}
                  onChange={setReason}
                  required
                />
                {reason === 'other' && (
                  <div className="mt-3">
                    <Input
                      label="Alasan Lainnya"
                      type="text"
                      placeholder="Jelaskan alasan penolakan..."
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      required
                    />
                  </div>
                )}
              </div>
            )}

            {action === 'assign' && (
              <div>
                <Select
                  label="Tugaskan Kepada"
                  description="Pilih staff yang akan menangani invoice ini"
                  options={staffOptions}
                  value={assignTo}
                  onChange={setAssignTo}
                  required
                />
              </div>
            )}

            {action === 'approve' && (
              <div className="p-4 bg-success/10 rounded-lg border border-success/20">
                <div className="flex items-start space-x-3">
                  <Icon name="Info" size={16} className="text-success mt-0.5" />
                  <div>
                    <p className="text-sm font-body text-success font-medium mb-1">
                      Konfirmasi Persetujuan
                    </p>
                    <p className="text-xs font-caption text-success/80">
                      Invoice yang disetujui akan diteruskan ke sistem pembayaran dan tidak dapat dibatalkan.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="mt-6 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between text-sm font-body">
              <span className="text-muted-foreground">Invoice dipilih:</span>
              <span className="font-medium text-foreground">{selectedCount}</span>
            </div>
            <div className="flex items-center justify-between text-sm font-body mt-1">
              <span className="text-muted-foreground">Aksi:</span>
              <span className="font-medium text-foreground">{config.title}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 mt-6">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isProcessing}
              className="flex-1"
            >
              Batal
            </Button>
            <Button
              variant={config.confirmVariant}
              onClick={handleConfirm}
              loading={isProcessing}
              disabled={!isFormValid()}
              className="flex-1"
            >
              {config.confirmText}
            </Button>
          </div>

          {/* Warning for destructive actions */}
          {action === 'reject' && (
            <div className="mt-4 p-3 bg-warning/10 rounded-lg border border-warning/20">
              <div className="flex items-start space-x-2">
                <Icon name="AlertTriangle" size={14} className="text-warning mt-0.5" />
                <p className="text-xs font-caption text-warning">
                  Invoice yang ditolak akan dikembalikan ke vendor untuk diperbaiki.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkActionDialog;