import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UploadError = ({ errors, onRetry, onReset, file }) => {
  const getErrorIcon = (errorType) => {
    switch (errorType) {
      case 'file-size':
        return 'AlertTriangle';
      case 'file-type':
        return 'FileX';
      case 'network':
        return 'WifiOff';
      case 'server':
        return 'ServerCrash';
      default:
        return 'AlertCircle';
    }
  };

  const getErrorColor = (errorType) => {
    switch (errorType) {
      case 'file-size': case'file-type':
        return 'text-warning';
      case 'network': case'server':
        return 'text-error';
      default:
        return 'text-error';
    }
  };

  const commonSolutions = [
    {
      issue: 'File terlalu besar',
      solution: 'Kompres file atau gunakan format yang lebih efisien'
    },
    {
      issue: 'Format tidak didukung',
      solution: 'Konversi ke format PDF, XLS, atau ZIP'
    },
    {
      issue: 'Koneksi bermasalah',
      solution: 'Periksa koneksi internet dan coba lagi'
    },
    {
      issue: 'File rusak',
      solution: 'Pastikan file dapat dibuka dengan normal'
    }
  ];

  return (
    <div className="bg-card border border-error/20 rounded-lg p-6 space-y-6">
      {/* Error Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-error/10 rounded-full flex items-center justify-center">
          <Icon name="AlertCircle" size={32} className="text-error" />
        </div>
        <div>
          <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
            Gagal Mengunggah Invoice
          </h3>
          <p className="text-sm font-body text-muted-foreground">
            Terjadi masalah saat mengunggah dokumen Anda
          </p>
        </div>
      </div>

      {/* File Info */}
      {file && (
        <div className="bg-muted/30 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
              <Icon name="FileX" size={20} className="text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-body font-medium text-foreground truncate">
                {file.name}
              </h4>
              <p className="text-xs font-caption text-muted-foreground">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error List */}
      <div className="space-y-3">
        <h4 className="text-sm font-heading font-semibold text-foreground">
          Masalah yang Ditemukan:
        </h4>
        <div className="space-y-2">
          {errors.map((error, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-error/5 rounded-lg border border-error/10">
              <Icon 
                name={getErrorIcon(error.type)} 
                size={16} 
                className={`${getErrorColor(error.type)} flex-shrink-0 mt-0.5`}
              />
              <div className="flex-1">
                <p className="text-sm font-body text-foreground">
                  {error.message}
                </p>
                {error.details && (
                  <p className="text-xs font-caption text-muted-foreground mt-1">
                    {error.details}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Solutions */}
      <div className="space-y-3">
        <h4 className="text-sm font-heading font-semibold text-foreground">
          Solusi yang Disarankan:
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {commonSolutions.map((item, index) => (
            <div key={index} className="p-3 bg-muted/30 rounded-lg">
              <h5 className="text-xs font-body font-medium text-foreground mb-1">
                {item.issue}
              </h5>
              <p className="text-xs font-caption text-muted-foreground">
                {item.solution}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-primary/5 border border-primary/10 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="HelpCircle" size={16} className="text-primary flex-shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h5 className="text-sm font-body font-medium text-foreground">
              Butuh Bantuan?
            </h5>
            <p className="text-xs font-caption text-muted-foreground">
              Jika masalah terus berlanjut, hubungi tim support kami di{' '}
              <span className="text-primary font-medium">support@patralogistik.com</span>{' '}
              atau telepon <span className="text-primary font-medium">(021) 1234-5678</span>
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
        <Button
          variant="outline"
          onClick={onReset}
          className="flex-1"
          iconName="RotateCcw"
          iconPosition="left"
        >
          Pilih File Lain
        </Button>
        <Button
          variant="default"
          onClick={onRetry}
          className="flex-1"
          iconName="RefreshCw"
          iconPosition="left"
        >
          Coba Lagi
        </Button>
      </div>
    </div>
  );
};

export default UploadError;