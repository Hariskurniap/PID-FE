import React, { useState, useEffect } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const InvoiceForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    vendorName: '',
    invoiceType: '',
    invoiceNumber: '',
    invoiceDate: '',
    invoiceAmount: '',
    dueDate: '',
    description: '',
    file: null,
  });

  const [vendorOptions, setVendorOptions] = useState([]);
  const [invoiceTypeOptions, setInvoiceTypeOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [maxFileSizeMB, setMaxFileSizeMB] = useState(10); // default fallback 10MB

  useEffect(() => {
    const fetchOptions = async () => {
      setLoading(true);
      const vendorId = parseInt(localStorage.getItem('vendorId'), 10);

      try {
        const [vendorRes, typeRes, configRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/vendors`),
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/invoice-types`),
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/configurations/MAX_FILE`),
        ]);

        const vendors = await vendorRes.json();
        const types = await typeRes.json();
        const config = await configRes.json();

        if (config?.value) {
          setMaxFileSizeMB(parseInt(config.value, 10));
        }

        const filteredVendors = vendors.filter(v => v.id === vendorId);
        const mappedVendors = filteredVendors.map(v => ({
          value: v.id.toString(),
          label: v.namaVendor || v.nama || v.name,
        }));
        setVendorOptions(mappedVendors);

        if (!formData.vendorName && mappedVendors.length > 0) {
          setFormData(prev => ({ ...prev, vendorName: mappedVendors[0].value }));
        }

        setInvoiceTypeOptions(types.map(t => ({
          value: t.id.toString(),
          label: t.tipeInvoice,
        })));
      } catch (err) {
        console.error('Gagal memuat data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, []);

  const formatCurrency = (value) => {
    if (!value) return '';
    const numericValue = value.replace(/\D/g, '');
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const handleAmountChange = (e) => {
    const rawValue = e.target.value;
    const formattedValue = formatCurrency(rawValue);
    setFormData(prev => ({
      ...prev,
      invoiceAmount: formattedValue
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.vendorName) newErrors.vendorName = 'Vendor harus dipilih';
    if (!formData.invoiceType) newErrors.invoiceType = 'Jenis invoice harus dipilih';
    if (!formData.invoiceNumber) newErrors.invoiceNumber = 'Nomor invoice harus diisi';
    if (!formData.invoiceDate) newErrors.invoiceDate = 'Tanggal invoice harus diisi';
    if (!formData.invoiceAmount) newErrors.invoiceAmount = 'Jumlah invoice harus diisi';
    if (!formData.dueDate) newErrors.dueDate = 'Tanggal jatuh tempo harus diisi';
    if (!formData.file) newErrors.file = 'File invoice harus diupload';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const data = new FormData();
    data.append('dokumen', formData.file);
    data.append('nomorInvoice', formData.invoiceNumber);
    data.append('jumlahTagihan', formData.invoiceAmount.replace(/\./g, ''));
    data.append('vendorId', formData.vendorName);
    data.append('tipeInvoiceId', formData.invoiceType);
    data.append('tanggalInvoice', formData.invoiceDate);
    data.append('tanggalJatuhTempo', formData.dueDate);
    data.append('keterangan', formData.description || '');

    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/invoice/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Upload gagal');

      alert('Invoice berhasil diunggah');
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Upload error: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
          Informasi Invoice
        </h3>
        <p className="text-sm font-body text-muted-foreground">
          Lengkapi detail invoice yang akan diunggah
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data" noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Nama Vendor"
            description="Pilih nama perusahaan vendor"
            required
            options={vendorOptions}
            value={formData.vendorName}
            onChange={(value) => handleInputChange('vendorName', value)}
            error={errors.vendorName}
            placeholder={loading ? 'Memuat vendor...' : 'Pilih vendor...'}
            disabled={loading}
          />

          <Select
            label="Jenis Invoice"
            description="Kategori layanan invoice"
            required
            options={invoiceTypeOptions}
            value={formData.invoiceType}
            onChange={(value) => handleInputChange('invoiceType', value)}
            error={errors.invoiceType}
            placeholder={loading ? 'Memuat jenis invoice...' : 'Pilih jenis invoice...'}
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Nomor Invoice"
            type="text"
            placeholder="INV-2024-001"
            description="Nomor invoice dari sistem vendor"
            required
            value={formData.invoiceNumber}
            onChange={(e) => handleInputChange('invoiceNumber', e.target.value)}
            error={errors.invoiceNumber}
          />

          <Input
            label="Tanggal Invoice"
            type="date"
            description="Tanggal penerbitan invoice"
            required
            value={formData.invoiceDate}
            onChange={(e) => handleInputChange('invoiceDate', e.target.value)}
            error={errors.invoiceDate}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <Input
              label="Jumlah Invoice"
              type="text"
              placeholder="0"
              description="Nilai total invoice dalam Rupiah"
              required
              value={formData.invoiceAmount}
              onChange={handleAmountChange}
              error={errors.invoiceAmount}
            />
            <div className="absolute right-3 top-9 text-sm text-muted-foreground pointer-events-none">
              IDR
            </div>
          </div>

          <Input
            label="Tanggal Jatuh Tempo"
            type="date"
            description="Batas waktu pembayaran"
            required
            value={formData.dueDate}
            onChange={(e) => handleInputChange('dueDate', e.target.value)}
            error={errors.dueDate}
          />
        </div>

        <Input
          label="Keterangan Tambahan"
          type="text"
          placeholder="Deskripsi layanan atau catatan khusus..."
          description="Informasi tambahan tentang invoice (opsional)"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          error={errors.description}
        />

        <div>
          <label className="block mb-1 font-medium">
            Upload File Invoice <span className="text-red-500">*</span>
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
                  vendorName: '',
                  invoiceType: '',
                  invoiceNumber: '',
                  invoiceDate: '',
                  invoiceAmount: '',
                  dueDate: '',
                  description: '',
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
              {isSubmitting ? 'Mengunggah...' : 'Unggah Invoice'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default InvoiceForm;
