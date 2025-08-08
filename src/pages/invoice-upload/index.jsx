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
    const [currentStep, setCurrentStep] = useState('form'); // Langsung ke form
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

        // Di bagian handleFormSubmit, ubah bagian try block:
        // Di bagian handleFormSubmit, ubah bagian try block:
        try {
            await simulateUpload();
            const refNumber = generateReferenceNumber();
            setReferenceNumber(refNumber);

            // Tampilkan alert sukses
            alert('Upload berhasil!');

            // Langsung navigasi ke halaman dashboard
            navigate('/'); // atau '/vendor-dashboard' sesuai route Anda

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

    // Handle reset upload
    const handleResetUpload = () => {
        setSelectedFile(null);
        setFileErrors([]);
        setUploadErrors([]);
        setUploadProgress(0);
        setCurrentStep('form');
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
            <Header userRole="vendor" userName="" />

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
                    </div>

                    {/* Content based on current step */}
                    <div className="space-y-6">
                        {currentStep === 'form' && (
                            <InvoiceForm
                                onSubmit={handleFormSubmit}
                                isSubmitting={currentStep === 'uploading'}
                                formData={formData}
                                setFormData={setFormData}
                                errors={formErrors}
                            />
                        )}

                        {currentStep === 'uploading' && (
                            <div className="text-center py-8">
                                <Icon name="Loader2" size={48} className="animate-spin mx-auto mb-4" />
                                <p className="text-lg font-medium">Mengunggah invoice...</p>
                                <progress
                                    value={uploadProgress}
                                    max="100"
                                    className="w-full h-2 rounded mt-4"
                                />
                            </div>
                        )}

                        {currentStep === 'error' && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                                <div className="flex items-start space-x-3">
                                    <Icon name="AlertCircle" size={20} className="text-red-500 mt-0.5" />
                                    <div>
                                        <h3 className="font-medium text-red-800">Gagal mengunggah invoice</h3>
                                        {uploadErrors.map((error, index) => (
                                            <p key={index} className="text-sm text-red-700 mt-1">
                                                {error.message}
                                            </p>
                                        ))}
                                        <div className="flex space-x-3 mt-4">
                                            <Button
                                                variant="outline"
                                                onClick={handleResetUpload}
                                            >
                                                Coba Lagi
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                onClick={() => navigate('/vendor-dashboard')}
                                            >
                                                Kembali ke Dashboard
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Quick Actions */}
                    {currentStep !== 'uploading' && (
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
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default InvoiceUpload;