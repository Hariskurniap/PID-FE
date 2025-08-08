import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UploadSuccess = ({ referenceNumber, onNewUpload, onViewStatus }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyReference = async () => {
    try {
      await navigator.clipboard.writeText(referenceNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy reference number:', err);
    }
  };

  const expectedProcessingSteps = [
    {
      step: 1,
      title: 'Diterima',
      description: 'Invoice berhasil diterima sistem',
      status: 'completed',
      estimatedTime: 'Selesai'
    },
    {
      step: 2,
      title: 'Review Dokumen',
      description: 'Tim internal melakukan verifikasi',
      status: 'pending',
      estimatedTime: '1-2 hari kerja'
    },
    {
      step: 3,
      title: 'Persetujuan',
      description: 'Proses approval dan validasi final',
      status: 'pending',
      estimatedTime: '1 hari kerja'
    },
    {
      step: 4,
      title: 'Diteruskan',
      description: 'Invoice diteruskan ke sistem pembayaran',
      status: 'pending',
      estimatedTime: '1 hari kerja'
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-6">
      {/* Success Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-success/10 rounded-full flex items-center justify-center">
          <Icon name="CheckCircle" size={32} className="text-success animate-scale-in" />
        </div>
        <div>
          <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
            Invoice Berhasil Diunggah!
          </h3>
          <p className="text-sm font-body text-muted-foreground">
            Dokumen Anda telah berhasil diterima dan sedang dalam proses review
          </p>
        </div>
      </div>

      {/* Reference Number */}
      <div className="bg-muted/50 rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-body font-medium text-foreground">
            Nomor Referensi:
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyReference}
            iconName={copied ? "Check" : "Copy"}
            iconPosition="left"
            className="text-xs"
          >
            {copied ? 'Tersalin!' : 'Salin'}
          </Button>
        </div>
        <div className="font-mono text-lg font-semibold text-primary bg-background rounded px-3 py-2 border">
          {referenceNumber}
        </div>
        <p className="text-xs font-caption text-muted-foreground">
          Simpan nomor referensi ini untuk melacak status invoice Anda
        </p>
      </div>

      {/* Processing Timeline */}
      <div className="space-y-4">
        <h4 className="text-sm font-heading font-semibold text-foreground">
          Tahapan Proses:
        </h4>
        <div className="space-y-3">
          {expectedProcessingSteps.map((item, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className={`
                w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5
                ${item.status === 'completed' 
                  ? 'bg-success text-success-foreground' :'bg-muted text-muted-foreground'
                }
              `}>
                {item.status === 'completed' ? (
                  <Icon name="Check" size={14} />
                ) : (
                  <span className="text-xs font-mono">{item.step}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h5 className={`
                    text-sm font-body font-medium
                    ${item.status === 'completed' ? 'text-success' : 'text-foreground'}
                  `}>
                    {item.title}
                  </h5>
                  <span className="text-xs font-caption text-muted-foreground">
                    {item.estimatedTime}
                  </span>
                </div>
                <p className="text-xs font-caption text-muted-foreground mt-1">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Important Notes */}
      <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={16} className="text-warning flex-shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h5 className="text-sm font-body font-medium text-foreground">
              Informasi Penting:
            </h5>
            <ul className="text-xs font-caption text-muted-foreground space-y-1">
              <li>• Proses review maksimal 3 hari kerja</li>
              <li>• Notifikasi akan dikirim via email untuk setiap perubahan status</li>
              <li>• Jika ada masalah, tim akan menghubungi Anda langsung</li>
              <li>• Anda dapat melacak status kapan saja menggunakan nomor referensi</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
        <Button
          variant="outline"
          onClick={onViewStatus}
          className="flex-1"
          iconName="Search"
          iconPosition="left"
        >
          Lacak Status
        </Button>
        <Button
          variant="default"
          onClick={onNewUpload}
          className="flex-1"
          iconName="Plus"
          iconPosition="left"
        >
          Unggah Invoice Baru
        </Button>
      </div>
    </div>
  );
};

export default UploadSuccess;