// contract-upload/components/ContractForm.js
import React, { useState, useEffect } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const ContractForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        contractNumber: '',
        subject: '',
        startDate: '',
        endDate: '',
        value: '',
        file: null,
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [maxFileSizeMB, setMaxFileSizeMB] = useState(10);

    useEffect(() => {
        // Ambil konfigurasi ukuran file maksimal
        const fetchConfig = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/configurations/MAX_FILE`);
                const config = await res.json();
                if (config?.value) {
                    setMaxFileSizeMB(parseInt(config.value, 10));
                }
            } catch (err) {
                console.warn('Gagal ambil konfigurasi ukuran file, gunakan default 10MB');
            }
        };
        fetchConfig();
    }, []);

    const formatCurrency = (value) => {
        if (!value) return '';
        const numericValue = value.replace(/\D/g, '');
        return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    const handleValueChange = (e) => {
        const rawValue = e.target.value;
        const formattedValue = formatCurrency(rawValue);
        setFormData(prev => ({
            ...prev,
            value: formattedValue
        }));
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.contractNumber) newErrors.contractNumber = 'Nomor kontrak harus diisi';
        if (!formData.subject) newErrors.subject = 'Perihal harus diisi';
        if (!formData.startDate) newErrors.startDate = 'Tanggal mulai harus diisi';
        if (!formData.endDate) newErrors.endDate = 'Tanggal kadaluarsa harus diisi';
        if (formData.endDate && formData.startDate && new Date(formData.endDate) <= new Date(formData.startDate)) {
            newErrors.endDate = 'Tanggal kadaluarsa harus setelah tanggal mulai';
        }
        if (!formData.value) newErrors.value = 'Nilai kontrak harus diisi';
        if (!formData.file) newErrors.file = 'Dokumen kontrak harus diunggah';

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
                    Informasi Kontrak
                </h3>
                <p className="text-sm font-body text-muted-foreground">
                    Lengkapi detail kontrak yang akan diunggah
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                    label="Nomor Kontrak"
                    type="text"
                    placeholder="KTR-2024-001"
                    description="Nomor kontrak resmi"
                    required
                    value={formData.contractNumber}
                    onChange={(e) => handleChange('contractNumber', e.target.value)}
                    error={errors.contractNumber}
                />

                <Input
                    label="Perihal"
                    type="text"
                    placeholder="Pengadaan barang dan jasa..."
                    description="Deskripsi singkat isi kontrak"
                    required
                    value={formData.subject}
                    onChange={(e) => handleChange('subject', e.target.value)}
                    error={errors.subject}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                        label="Tanggal Mulai"
                        type="date"
                        description="Tanggal efektif kontrak"
                        required
                        value={formData.startDate}
                        onChange={(e) => handleChange('startDate', e.target.value)}
                        error={errors.startDate}
                    />

                    <Input
                        label="Tanggal Kadaluarsa"
                        type="date"
                        description="Tanggal berakhirnya kontrak"
                        required
                        value={formData.endDate}
                        onChange={(e) => handleChange('endDate', e.target.value)}
                        error={errors.endDate}
                    />
                </div>

                <div className="relative">
                    <Input
                        label="Nilai Kontrak"
                        type="text"
                        placeholder="0"
                        description="Nilai total kontrak dalam Rupiah"
                        required
                        value={formData.value}
                        onChange={handleValueChange}
                        error={errors.value}
                    />
                    <div className="absolute right-3 top-9 text-sm text-muted-foreground pointer-events-none">
                        IDR
                    </div>
                </div>

                <div>
                    <label className="block mb-1 font-medium">
                        Upload Dokumen Kontrak <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="file"
                        accept=".pdf,.doc,.docx,image/*,.zip"
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
                                setFormData({
                                    contractNumber: '',
                                    subject: '',
                                    startDate: '',
                                    endDate: '',
                                    value: '',
                                    file: null,
                                });
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
                            {isSubmitting ? 'Mengunggah...' : 'Unggah Kontrak'}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ContractForm;