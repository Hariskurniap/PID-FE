// receipt-upload/components/ReceiptForm.js
import React, { useState, useEffect } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const ReceiptForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        date: '',
        file: null,
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [maxFileSizeMB, setMaxFileSizeMB] = useState(10);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/configurations/MAX_FILE`);
                const config = await res.json();
                if (config?.value) {
                    setMaxFileSizeMB(parseInt(config.value, 10));
                }
            } catch (err) {
                console.warn('Gagal ambil konfigurasi ukuran file');
            }
        };
        fetchConfig();
    }, []);

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.date) newErrors.date = 'Tanggal kwitansi harus diisi';
        if (!formData.file) newErrors.file = 'File kwitansi harus diunggah';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);
        setTimeout(() => {
            onSubmit(formData);
            setIsSubmitting(false);
        }, 500);
    };

    return (
        <div className="bg-card border border-border rounded-lg p-6">
            <div className="mb-6">
                <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                    Informasi Kwitansi
                </h3>
                <p className="text-sm font-body text-muted-foreground">
                    Unggah bukti pembayaran atau kwitansi
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                    label="Tanggal Kwitansi"
                    type="date"
                    description="Tanggal penerbitan kwitansi"
                    required
                    value={formData.date}
                    onChange={(e) => handleChange('date', e.target.value)}
                    error={errors.date}
                />

                <div>
                    <label className="block mb-1 font-medium">
                        Upload File Kwitansi <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.docx"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (file && file.size > maxFileSizeMB * 1024 * 1024) {
                                setErrors((prev) => ({
                                    ...prev,
                                    file: `Ukuran file maksimal ${maxFileSizeMB}MB`,
                                }));
                                setFormData((prev) => ({ ...prev, file: null }));
                            } else {
                                setErrors((prev) => ({ ...prev, file: undefined }));
                                setFormData((prev) => ({ ...prev, file }));
                            }
                        }}
                        className="w-full"
                        required
                    />
                    {errors.file && <p className="text-sm text-red-500 mt-1">{errors.file}</p>}
                </div>

                <div className="pt-4 border-t border-border">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1 sm:flex-none"
                            iconName="RotateCcw"
                            iconPosition="left"
                            onClick={() => {
                                setFormData({ date: '', file: null });
                                setErrors({});
                            }}
                        >
                            Reset Form
                        </Button>
                        <Button
                            type="submit"
                            variant="default"
                            loading={isSubmitting}
                            className="flex-1"
                            iconName="Upload"
                            iconPosition="left"
                        >
                            {isSubmitting ? 'Mengunggah...' : 'Unggah Kwitansi'}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ReceiptForm;