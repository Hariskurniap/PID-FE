import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import SessionTimeoutHandler from '../../components/ui/SessionTimeoutHandler';
import FileDropzone from './components/FileDropzone';
import FilePreview from './components/FilePreview';
import InvoiceForm from './components/InvoiceForm';
import UploadSuccess from './components/UploadSuccess';
import UploadError from './components/UploadError';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const InvoiceUpload = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState('upload'); // upload, form, uploading, success, error
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileErrors, setFileErrors] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [uploadErrors, setUploadErrors] = useState([]);
  const [isSessionActive, setIsSessionActive] = useState(true);

  const [formData, setFormData] = useState({
    vendorName: '',
    invoiceType: '',
    invoiceNumber: '',
    invoiceDate: '',
    invoiceAmount: '',
    dueDate: '',
    description: ''
  });

  const [formErrors, setFormErrors] = useState({});

  // File upload configuration
  const acceptedTypes = ['pdf', 'xls', 'xlsx', 'zip'];
  const maxFileSize = 10 * 1024 * 1024; // 10MB

  // Generate reference number
  const generateReferenceNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `INV-${year}${month}${day}-${random}`;
  };

  // Validate form data
  const validateForm = (data) => {
    const errors = {};

    if (!data.vendorName) {
      errors.vendorName = 'Nama vendor harus dipilih';
    }

    if (!data.invoiceType) {
      errors.invoiceType = 'Jenis invoice harus dipilih';
    }

    if (!data.invoiceNumber) {
      errors.invoiceNumber = 'Nomor invoice harus diisi';
    }

    if (!data.invoiceDate) {
      errors.invoiceDate = 'Tanggal invoice harus diisi';
    }

    if (!data.invoiceAmount) {
      errors.invoiceAmount = 'Jumlah invoice harus diisi';
    } else {
      const numericAmount = data.invoiceAmount.replace(/\./g, '');
      if (isNaN(numericAmount) || parseInt(numericAmount) <= 0) {
        errors.invoiceAmount = 'Jumlah invoice harus berupa angka yang valid';
      }
    }

    if (!data.dueDate) {
      errors.dueDate = 'Tanggal jatuh tempo harus diisi';
    } else if (new Date(data.dueDate) <= new Date(data.invoiceDate)) {
      errors.dueDate = 'Tanggal jatuh tempo harus setelah tanggal invoice';
    }

    return errors;
  };

  // Handle file selection
  const handleFileSelect = (file, errors) => {
    if (errors.length > 0) {
      setFileErrors(errors);
      setSelectedFile(file);
      setCurrentStep('error');
      setUploadErrors(errors.map(error => ({ 
        type: 'file-validation', 
        message: error 
      })));
    } else {
      setSelectedFile(file);
      setFileErrors([]);
      setCurrentStep('form');
    }
  };

  // Handle file removal
  const handleFileRemove = () => {
    setSelectedFile(null);
    setFileErrors([]);
    setCurrentStep('upload');
  };

  // Simulate file upload
  const simulateUpload = () => {
    return new Promise((resolve, reject) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          // Simulate random success/failure
          if (Math.random() > 0.1) { // 90% success rate
            resolve();
          } else {
            reject(new Error('Upload failed'));
          }
        }
        setUploadProgress(Math.min(progress, 100));
      }, 200);
    });
  };

  // Handle form submission
  const handleFormSubmit = async (data) => {
    const errors = validateForm(data);
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setCurrentStep('uploading');
    setUploadProgress(0);

    try {
      await simulateUpload();
      const refNumber = generateReferenceNumber();
      setReferenceNumber(refNumber);
      setCurrentStep('success');
    } catch (error) {
      setUploadErrors([
        {
          type: 'network',
          message: 'Gagal mengunggah file ke server',
          details: 'Periksa koneksi internet Anda dan coba lagi'
        }
      ]);
      setCurrentStep('error');
    }
  };

  // Handle retry upload
  const handleRetryUpload = () => {
    if (selectedFile) {
      setCurrentStep('form');
      setUploadErrors([]);
      setUploadProgress(0);
    }
  };

  // Handle reset upload
  const handleResetUpload = () => {
    setSelectedFile(null);
    setFileErrors([]);
    setUploadErrors([]);
    setUploadProgress(0);
    setCurrentStep('upload');
    setFormData({
      vendorName: '',
      invoiceType: '',
      invoiceNumber: '',
      invoiceDate: '',
      invoiceAmount: '',
      dueDate: '',
      description: ''
    });
    setFormErrors({});
  };

  // Handle new upload
  const handleNewUpload = () => {
    handleResetUpload();
  };

  // Handle view status
  const handleViewStatus = () => {
    navigate('/bast-status-tracking', { 
      state: { referenceNumber } 
    });
  };

  // Handle session timeout
  const handleSessionTimeout = () => {
    navigate('/vendor-login');
  };

  // Handle session extension
  const handleSessionExtend = async () => {
    // Simulate session extension API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Session extended');
        resolve();
      }, 1000);
    });
  };

  // Set current date as default for invoice date
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setFormData(prev => ({
      ...prev,
      invoiceDate: today
    }));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header userRole="vendor" userName="PT Maju Jaya Logistik" />
      
      <SessionTimeoutHandler
        isActive={isSessionActive}
        onTimeout={handleSessionTimeout}
        onExtend={handleSessionExtend}
      />

      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Upload" size={20} color="white" />
              </div>
              <div>
                <h1 className="text-2xl font-heading font-bold text-foreground">
                  Unggah Invoice
                </h1>
                <p className="text-sm font-body text-muted-foreground">
                  Upload Invoice • Kelola dokumen invoice dengan mudah
                </p>
              </div>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center space-x-4 text-sm">
              <div className={`flex items-center space-x-2 ${
                ['upload', 'form', 'uploading', 'success', 'error'].includes(currentStep) 
                  ? 'text-primary' : 'text-muted-foreground'
              }`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  ['upload', 'form', 'uploading', 'success', 'error'].includes(currentStep)
                    ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {currentStep === 'success' ? (
                    <Icon name="Check" size={14} />
                  ) : (
                    <span className="text-xs">1</span>
                  )}
                </div>
                <span className="font-body">Pilih File</span>
              </div>

              <div className="w-8 h-px bg-border" />

              <div className={`flex items-center space-x-2 ${
                ['form', 'uploading', 'success'].includes(currentStep) 
                  ? 'text-primary' : 'text-muted-foreground'
              }`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  ['form', 'uploading', 'success'].includes(currentStep)
                    ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {currentStep === 'success' ? (
                    <Icon name="Check" size={14} />
                  ) : (
                    <span className="text-xs">2</span>
                  )}
                </div>
                <span className="font-body">Isi Detail</span>
              </div>

              <div className="w-8 h-px bg-border" />

              <div className={`flex items-center space-x-2 ${
                ['uploading', 'success'].includes(currentStep) 
                  ? 'text-primary' : 'text-muted-foreground'
              }`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  ['uploading', 'success'].includes(currentStep)
                    ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {currentStep === 'success' ? (
                    <Icon name="Check" size={14} />
                  ) : currentStep === 'uploading' ? (
                    <Icon name="Loader2" size={14} className="animate-spin" />
                  ) : (
                    <span className="text-xs">3</span>
                  )}
                </div>
                <span className="font-body">Unggah</span>
              </div>
            </div>
          </div>

          {/* Content based on current step */}
          <div className="space-y-6">
            {currentStep === 'upload' && (
              <FileDropzone
                onFileSelect={handleFileSelect}
                acceptedTypes={acceptedTypes}
                maxSize={maxFileSize}
               
              />
            )}

            {currentStep === 'form' && selectedFile && (
              <>
                <FilePreview
                  file={selectedFile}
                  onRemove={handleFileRemove}
                  uploadProgress={0}
                  isUploading={false}
                />
                <InvoiceForm
                  onSubmit={handleFormSubmit}
                  isSubmitting={false}
                  formData={formData}
                  setFormData={setFormData}
                  errors={formErrors}
                />
              </>
            )}

            {currentStep === 'uploading' && selectedFile && (
              <FilePreview
                file={selectedFile}
                onRemove={() => {}}
                uploadProgress={uploadProgress}
                isUploading={true}
              />
            )}

            {currentStep === 'success' && (
              <UploadSuccess
                referenceNumber={referenceNumber}
                onNewUpload={handleNewUpload}
                onViewStatus={handleViewStatus}
              />
            )}

            {currentStep === 'error' && (
              <UploadError
                errors={uploadErrors}
                onRetry={handleRetryUpload}
                onReset={handleResetUpload}
                file={selectedFile}
              />
            )}
          </div>

          {/* Quick Actions */}
          {currentStep !== 'success' && currentStep !== 'uploading' && (
            <div className="mt-8 pt-6 border-t border-border">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="outline"
                  onClick={() => navigate('/vendor-dashboard')}
                  iconName="ArrowLeft"
                  iconPosition="left"
                  className="flex-1 sm:flex-none"
                >
                  Kembali ke Dashboard
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => navigate('/bast-status-tracking')}
                  iconName="Search"
                  iconPosition="left"
                  className="flex-1 sm:flex-none"
                >
                  Lacak Status Invoice
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default InvoiceUpload;