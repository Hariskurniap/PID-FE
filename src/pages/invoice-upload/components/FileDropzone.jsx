import React, { useState, useCallback } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FileDropzone = ({ onFileSelect, acceptedTypes, maxSize, disabled }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file) => {
    const errors = [];
    
    // Check file type
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (!acceptedTypes.includes(fileExtension)) {
      errors.push(`Tipe file tidak didukung. Hanya ${acceptedTypes.join(', ').toUpperCase()} yang diizinkan.`);
    }
    
    // Check file size
    if (file.size > maxSize) {
      errors.push(`Ukuran file terlalu besar. Maksimal ${formatFileSize(maxSize)}.`);
    }
    
    return errors;
  };

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => prev + 1);
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragOver(true);
    }
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => {
      const newCounter = prev - 1;
      if (newCounter === 0) {
        setIsDragOver(false);
      }
      return newCounter;
    });
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    setDragCounter(0);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      const errors = validateFile(file);
      onFileSelect(file, errors);
    }
  }, [disabled, onFileSelect, acceptedTypes, maxSize]);

  const handleFileInput = useCallback((e) => {
    if (disabled) return;
    
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const file = files[0];
      const errors = validateFile(file);
      onFileSelect(file, errors);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  }, [disabled, onFileSelect, acceptedTypes, maxSize]);

  return (
    <div
      className={`
        relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300
        ${isDragOver && !disabled
          ? 'border-primary bg-primary/5 scale-105' :'border-border hover:border-primary/50'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-muted/30'}
      `}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept={acceptedTypes.map(type => `.${type}`).join(',')}
        onChange={handleFileInput}
        disabled={disabled}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
      />
      
      <div className="space-y-4">
        <div className={`
          w-16 h-16 mx-auto rounded-full flex items-center justify-center transition-colors
          ${isDragOver && !disabled ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
        `}>
          <Icon 
            name={isDragOver && !disabled ? "Upload" : "FileText"} 
            size={32}
            className={isDragOver && !disabled ? "animate-bounce" : ""}
          />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-heading font-semibold text-foreground">
            {isDragOver && !disabled ? 'Lepaskan file di sini' : 'Unggah Dokumen Invoice'}
          </h3>
          <p className="text-sm font-body text-muted-foreground">
            Seret dan lepas file atau{' '}
            <span className="text-primary font-medium">klik untuk memilih</span>
          </p>
        </div>
        
        <div className="space-y-1">
          <p className="text-xs font-caption text-muted-foreground">
            Format yang didukung: {acceptedTypes.map(type => type.toUpperCase()).join(', ')}
          </p>
          <p className="text-xs font-caption text-muted-foreground">
            Ukuran maksimal: {formatFileSize(maxSize)}
          </p>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          disabled={disabled}
          iconName="FolderOpen"
          iconPosition="left"
          className="pointer-events-none"
        >
          Pilih File
        </Button>
      </div>
    </div>
  );
};

export default FileDropzone;