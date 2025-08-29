// receipt-upload/index.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import SessionTimeoutHandler from '../../components/ui/SessionTimeoutHandler';
import ReceiptForm from './components/ReceiptForm';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const ReceiptUpload = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState('form');
    const [uploadErrors, setUploadErrors] = useState([]);
    const [isSessionActive, setIsSessionActive] = useState(true);

    const handleFormSubmit = async (data) => {
        setCurrentStep('uploading');

        try {
            await new Promise((resolve, reject) => {
                let progress = 0;
                const interval = setInterval(() => {
                    progress += Math.random() * 20;
                    if (progress >= 100) {
                        clearInterval(interval);
                        setTimeout(() => {
                            Math.random() > 0.1 ? resolve() : reject(new Error('Upload gagal'));
                        }, 500);
                    }
                }, 150);
            });

            alert('Kwitansi berhasil diunggah!');
            navigate('/');
        } catch (error) {
            setUploadErrors([
                {
                    type: 'upload',
                    message: 'Gagal mengunggah kwitansi',
                    details: 'Periksa file dan koneksi Anda'
                }
            ]);
            setCurrentStep('error');
        }
    };

    const handleReset = () => {
        setCurrentStep('form');
        setUploadErrors([]);
    };

    const handleSessionTimeout = () => {
        navigate('/vendor-login');
    };

    const handleSessionExtend = async () => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(), 1000);
        });
    };

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
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                                <Icon name="Receipt" size={20} color="white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-heading font-bold text-foreground">
                                    Unggah Kwitansi
                                </h1>
                                <p className="text-sm font-body text-muted-foreground">
                                    Upload Kwitansi • Unggah bukti pembayaran
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-6">
                        {currentStep === 'form' && (
                            <ReceiptForm onSubmit={handleFormSubmit} />
                        )}

                        {currentStep === 'uploading' && (
                            <div className="text-center py-8">
                                <Icon name="Loader2" size={48} className="animate-spin mx-auto mb-4" />
                                <p className="text-lg font-medium">Mengunggah kwitansi...</p>
                                <progress value="0" max="100" className="w-full h-2 rounded mt-4" />
                            </div>
                        )}

                        {currentStep === 'error' && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                                <div className="flex items-start space-x-3">
                                    <Icon name="AlertCircle" size={20} className="text-red-500 mt-0.5" />
                                    <div>
                                        <h3 className="font-medium text-red-800">Gagal mengunggah kwitansi</h3>
                                        {uploadErrors.map((err, idx) => (
                                            <p key={idx} className="text-sm text-red-700 mt-1">{err.message}</p>
                                        ))}
                                        <div className="flex space-x-3 mt-4">
                                            <Button variant="outline" onClick={handleReset}>
                                                Coba Lagi
                                            </Button>
                                            <Button variant="ghost" onClick={() => navigate('/vendor-dashboard')}>
                                                Kembali
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

export default ReceiptUpload;