import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FilePreview = ({ file, onRemove, uploadProgress, isUploading }) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'FileText';
      case 'xls': case'xlsx':
        return 'FileSpreadsheet';
      case 'zip':
        return 'Archive';
      default:
        return 'File';
    }
  };

  const getFileTypeColor = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'text-red-600';
      case 'xls': case'xlsx':
        return 'text-green-600';
      case 'zip':
        return 'text-blue-600';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-4">
      <div className="flex items-start space-x-4">
        <div className={`
          w-12 h-12 rounded-lg flex items-center justify-center
          ${isUploading ? 'bg-primary/10' : 'bg-muted'}
        `}>
          <Icon 
            name={getFileIcon(file.name)} 
            size={24} 
            className={`${getFileTypeColor(file.name)} ${isUploading ? 'animate-pulse' : ''}`}
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-body font-medium text-foreground truncate">
                {file.name}
              </h4>
              <p className="text-xs font-caption text-muted-foreground mt-1">
                {formatFileSize(file.size)} • {file.type || 'Unknown type'}
              </p>
            </div>
            
            {!isUploading && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onRemove}
                iconName="X"
                className="text-muted-foreground hover:text-error"
              />
            )}
          </div>
          
          {isUploading && (
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-caption text-muted-foreground">
                  Mengunggah...
                </span>
                <span className="font-mono text-primary">
                  {uploadProgress}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      
      {isUploading && (
        <div className="flex items-center space-x-2 text-xs font-caption text-muted-foreground">
          <Icon name="Clock" size={14} />
          <span>Estimasi waktu tersisa: {Math.max(1, Math.ceil((100 - uploadProgress) / 10))} detik</span>
        </div>
      )}
    </div>
  );
};

export default FilePreview;