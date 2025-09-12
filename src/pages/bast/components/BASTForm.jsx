// Bast/components/BASTForm.jsx
import React, { useState, useEffect } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { PlusIcon, Trash2Icon, SearchIcon, CheckCircleIcon, XCircleIcon, SaveIcon } from 'lucide-react';

const BASTForm = () => {
    const [formData, setFormData] = useState({
        idBast: `BAST-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        invoiceTypeId: '',
        nomorPo: '',
        vendorId: '',
        perihal: '',
        nomorKontrak: '',
        reviewerBast: '',
        tanggalMulaiKontrak: '',
        tanggalAkhirKontrak: '',
        tanggalPenyerahanBarangJasa: '',
        kesesuaianJumlahSpesifikasi: 'Sesuai',
        alasanKetidaksesuaian: '',
        idrDendaKeterlambatan: 0,
        copyKontrak: null,
        items: [
            { no: 1, pekerjaan: '', progress: '0', nilaiTagihan: '', keterangan: '' }
        ],
        dokumenPendukung: [
            { id: Date.now(), nama: '', file: null }
        ],
        statusFaktur: '',
        nomorFaktur: '',
        tanggalFaktur: '',
        jumlahOpp: '',
        jumlahPpn: '',
        jumlahPpnBm: '',
        npwpPenjual: '',
        namaPenjual: '',
        alamatPenjual: '',
        npwpLawanTransaksi: '',
        namaLawanTransaksi: '',
        alamatLawanTransaksi: '',
        berkas: null,
        detailTransaksi: [
            { id: 1, no: 1, namaBarang: 'Nama Barang Kena Pajak/Jasa Kena Pajak', hargaJual: '0' },
        ],
        creatorBastVendor: '',
    });

    const [vendorOptions, setVendorOptions] = useState([]);
    const [pengadaanOptions, setPengadaanOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSavingDraft, setIsSavingDraft] = useState(false);
    const [errors, setErrors] = useState({});
    const [maxFileSizeMB, setMaxFileSizeMB] = useState(10);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [redirectToDashboard, setRedirectToDashboard] = useState(false);

    // Modal & Popup
    const [showFakturModal, setShowFakturModal] = useState(false);
    const [fakturList, setFakturList] = useState([]);
    const [searchFaktur, setSearchFaktur] = useState('');
    const [showReviewerPopup, setShowReviewerPopup] = useState(false);
    const [reviewerStatus, setReviewerStatus] = useState(null);

    // Redirect ke dashboard setelah save draft berhasil
    useEffect(() => {
        if (redirectToDashboard) {
            window.location.href = '/vendor-dashboard';
        }
    }, [redirectToDashboard]);

    // Load data awal
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) return;

            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            try {
                const [typeRes, configRes] = await Promise.all([
                    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/invoice-types`, { headers }),
                    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/configurations/MAX_FILE`, { headers }),
                ]);

                const types = await typeRes.json();
                const config = await configRes.json();

                if (config?.value) setMaxFileSizeMB(parseInt(config.value, 10));

                setPengadaanOptions(types.map(t => ({
                    value: t.id.toString(),
                    label: t.tipeInvoice,
                })));
            } catch (err) {
                console.error('Gagal muat data awal:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Ambil userEmail dan vendor
    useEffect(() => {
        const userEmail = localStorage.getItem('userEmail');
        const vendorLocId = localStorage.getItem('vendorId');
        if (userEmail) {
            setFormData(prev => ({ ...prev, creatorBastVendor: userEmail }));
        }

        const fetchVendor = async () => {
            const token = localStorage.getItem('token');
            if (!token || !vendorLocId) return;

            const headers = { 'Authorization': `Bearer ${token}` };
            try {
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/vendors?filter=id eq ${vendorLocId}`, { headers });
                const vendors = await res.json();
                if (vendors.length === 1) {
                    setFormData(prev => ({ ...prev, vendorId: vendors[0].id.toString() }));
                    setVendorOptions(vendors.map(v => ({
                        value: v.id.toString(),
                        label: v.namaVendor,
                    })));
                }
            } catch (err) {
                console.error('Gagal load vendor:', err);
            }
        };

        fetchVendor();
    }, []);

    // Fetch daftar faktur
    const fetchFakturList = async () => {
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/faktur`, { headers });
            const data = await res.json();
            setFakturList(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Gagal muat daftar faktur:', err);
            setFakturList([]);
        }
    };

    // Cek reviewer
    const handleCheckReviewer = async () => {
        const email = formData.reviewerBast;
        if (!email) {
            setErrors(prev => ({ ...prev, reviewerBast: 'Email harus diisi' }));
            return;
        }
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/${encodeURIComponent(email)}`, { headers });
            const users = await res.json();
            const reviewer = users;
            if (reviewer && ['reviewer', 'admin'].includes(reviewer.role)) {
                setReviewerStatus('found');
                setErrors(prev => ({ ...prev, reviewerBast: undefined }));
            } else {
                setReviewerStatus('not-found');
                setErrors(prev => ({ ...prev, reviewerBast: 'Email tidak ditemukan atau bukan reviewer' }));
            }
        } catch (err) {
            console.error('Gagal cek reviewer:', err);
            setErrors(prev => ({ ...prev, reviewerBast: 'Gagal memeriksa email' }));
        } finally {
            setShowReviewerPopup(true);
        }
    };

    // Currency formatting
    const formatCurrency = (value) => {
        if (!value) return '';
        const numericValue = value.replace(/\D/g, '');
        return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    const handleCurrencyChange = (e, field) => {
        const rawValue = e.target.value;
        const formattedValue = formatCurrency(rawValue);
        setFormData((prev) => ({ ...prev, [field]: formattedValue }));
    };

    // Items
    const handleItemChange = (index, field, value) => {
        const newItems = [...formData.items];
        newItems[index][field] = value;
        setFormData((prev) => ({ ...prev, items: newItems }));
    };

    const addItem = () => {
        const newItem = {
            no: formData.items.length + 1,
            pekerjaan: '',
            progress: '0',
            nilaiTagihan: '',
            keterangan: '',
        };
        setFormData((prev) => ({ ...prev, items: [...prev.items, newItem] }));
    };

    const removeItem = (index) => {
        if (formData.items.length <= 1) return;
        const newItems = formData.items.filter((_, i) => i !== index);
        setFormData((prev) => ({
            ...prev,
            items: newItems.map((item, idx) => ({ ...item, no: idx + 1 })),
        }));
    };

    // File Upload
    const handleFileChange = (e, field) => {
        const file = e.target.files[0];
        if (!file) {
            setFormData((prev) => ({ ...prev, [field]: null }));
            return;
        }
        if (file.size > maxFileSizeMB * 1024 * 1024) {
            setErrors((prev) => ({
                ...prev,
                [field]: `Ukuran file maksimal ${maxFileSizeMB}MB`,
            }));
            setFormData((prev) => ({ ...prev, [field]: null }));
        } else {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
            setFormData((prev) => ({ ...prev, [field]: file }));
        }
    };

    // Dokumen Pendukung
    const addDokumenPendukung = () => {
        if (formData.dokumenPendukung.length >= 3) {
            setErrors(prev => ({ ...prev, dokumenPendukung: 'Maksimal 3 dokumen.' }));
            return;
        }
        const newDoc = {
            id: Date.now() + Math.random(),
            nama: '',
            file: null,
        };
        setFormData((prev) => ({
            ...prev,
            dokumenPendukung: [...prev.dokumenPendukung, newDoc],
        }));
        setErrors(prev => ({ ...prev, dokumenPendukung: undefined }));
    };

    const removeDokumenPendukung = (id) => {
        if (formData.dokumenPendukung.length <= 1) {
            setErrors(prev => ({ ...prev, dokumenPendukung: 'Minimal 1 dokumen.' }));
            return;
        }
        setFormData((prev) => ({
            ...prev,
            dokumenPendukung: prev.dokumenPendukung.filter(d => d.id !== id),
        }));
    };

    const handleDokumenChange = (id, field, value) => {
        setFormData((prev) => ({
            ...prev,
            dokumenPendukung: prev.dokumenPendukung.map(d =>
                d.id === id ? { ...d, [field]: value } : d
            ),
        }));
    };

    const handleDokumenFileChange = (id, e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > maxFileSizeMB * 1024 * 1024) {
            setErrors((prev) => ({
                ...prev,
                [`file_${id}`]: `Ukuran file maksimal ${maxFileSizeMB}MB`,
            }));
            return;
        }
        setFormData((prev) => ({
            ...prev,
            dokumenPendukung: prev.dokumenPendukung.map(d =>
                d.id === id ? { ...d, file } : d
            ),
        }));
    };

    // Detail Transaksi
    const addDetailTransaksi = () => {
        const newDetail = {
            id: Date.now() + Math.random(),
            no: formData.detailTransaksi.length + 1,
            namaBarang: '',
            hargaJual: '',
        };
        setFormData((prev) => ({
            ...prev,
            detailTransaksi: [...prev.detailTransaksi, newDetail],
        }));
    };

    const removeDetailTransaksi = (id) => {
        if (formData.detailTransaksi.length <= 1) return;
        setFormData((prev) => ({
            ...prev,
            detailTransaksi: prev.detailTransaksi.filter(d => d.id !== id),
        }));
    };

    const handleDetailChange = (id, field, value) => {
        setFormData((prev) => ({
            ...prev,
            detailTransaksi: prev.detailTransaksi.map(d =>
                d.id === id ? { ...d, [field]: value } : d
            ),
        }));
    };

    // Validasi
    const validate = () => {
        const newErrors = {};
        if (!formData.invoiceTypeId) newErrors.invoiceTypeId = 'Jenis Pengadaan harus dipilih';
        if (!formData.nomorPo) newErrors.nomorPo = 'Nomor PO harus diisi';
        if (!formData.vendorId) newErrors.vendorId = 'Nama Vendor harus dipilih';
        if (!formData.perihal) newErrors.perihal = 'Perihal harus diisi';
        if (!formData.nomorKontrak) newErrors.nomorKontrak = 'Nomor Kontrak harus diisi';
        if (!formData.reviewerBast) newErrors.reviewerBast = 'Email Reviewer harus diisi';
        if (!formData.tanggalMulaiKontrak) newErrors.tanggalMulaiKontrak = 'Tanggal Mulai Kontrak harus diisi';
        if (!formData.tanggalAkhirKontrak) newErrors.tanggalAkhirKontrak = 'Tanggal Akhir Kontrak harus diisi';
        if (!formData.tanggalPenyerahanBarangJasa) newErrors.tanggalPenyerahanBarangJasa = 'Tanggal Penyerahan harus diisi';
        if (!formData.copyKontrak) newErrors.copyKontrak = 'Copy Kontrak harus diunggah';
        if (formData.kesesuaianJumlahSpesifikasi === 'Tidak Sesuai') {
            if (!formData.alasanKetidaksesuaian) newErrors.alasanKetidaksesuaian = 'Alasan ketidaksesuaian harus diisi';
            if (!formData.idrDendaKeterlambatan) newErrors.idrDendaKeterlambatan = 'Denda keterlambatan harus diisi';
        }
        formData.items.forEach((item, idx) => {
            if (!item.pekerjaan) newErrors[`pekerjaan_${idx}`] = 'Pekerjaan tidak boleh kosong';
            if (!item.nilaiTagihan) newErrors[`nilaiTagihan_${idx}`] = 'Nilai tagihan harus diisi';
        });
        if (!formData.dokumenPendukung.some(d => d.file)) {
            newErrors.dokumenPendukung = 'Minimal 1 dokumen pendukung harus diunggah';
        }
        if (!formData.statusFaktur) newErrors.statusFaktur = 'Status Faktur harus diisi';
        if (!formData.nomorFaktur) newErrors.nomorFaktur = 'Nomor Faktur harus diisi';
        if (!formData.tanggalFaktur) newErrors.tanggalFaktur = 'Tanggal Faktur harus diisi';
        if (!formData.jumlahOpp) newErrors.jumlahOpp = 'Jumlah OPP harus diisi';
        if (!formData.jumlahPpn) newErrors.jumlahPpn = 'Jumlah PPn harus diisi';
        if (!formData.npwpPenjual) newErrors.npwpPenjual = 'NPWP Penjual harus diisi';
        if (!formData.namaPenjual) newErrors.namaPenjual = 'Nama Penjual harus diisi';
        if (!formData.alamatPenjual) newErrors.alamatPenjual = 'Alamat Penjual harus diisi';
        if (!formData.npwpLawanTransaksi) newErrors.npwpLawanTransaksi = 'NPWP Lawan Transaksi harus diisi';
        if (!formData.namaLawanTransaksi) newErrors.namaLawanTransaksi = 'Nama Lawan Transaksi harus diisi';
        if (!formData.alamatLawanTransaksi) newErrors.alamatLawanTransaksi = 'Alamat Lawan Transaksi harus diisi';
        if (!formData.berkas) newErrors.berkas = 'Berkas Faktur harus diunggah';
        return Object.keys(newErrors).length === 0;
    };

    // Fungsi untuk membersihkan nilai angka sebelum dikirim
    const cleanNumericValues = (data) => {
        return data.map(item => {
            const cleanedItem = { ...item };

            // Bersihkan nilaiTagihan (hapus titik pemisah ribuan)
            if (cleanedItem.nilaiTagihan && typeof cleanedItem.nilaiTagihan === 'string') {
                cleanedItem.nilaiTagihan = cleanedItem.nilaiTagihan.replace(/\./g, '');
            }

            // Bersihkan progress (konversi ke number)
            if (cleanedItem.progress && typeof cleanedItem.progress === 'string') {
                cleanedItem.progress = parseFloat(cleanedItem.progress);
            }

            // Bersihkan hargaJual di detailTransaksi (hapus titik pemisah ribuan)
            if (cleanedItem.hargaJual && typeof cleanedItem.hargaJual === 'string') {
                cleanedItem.hargaJual = cleanedItem.hargaJual.replace(/\./g, '');
            }

            return cleanedItem;
        });
    };

    // Prepare FormData untuk pengiriman
    // Prepare FormData untuk pengiriman
    const prepareFormData = () => {
        const formDataToSend = new FormData();

        // Buat salinan formData untuk dimodifikasi
        const cleanedFormData = { ...formData };

        // Bersihkan data items dan detailTransaksi
        cleanedFormData.items = cleanNumericValues(formData.items);
        cleanedFormData.detailTransaksi = cleanNumericValues(formData.detailTransaksi);

        // Tambahkan semua field utama
        Object.keys(cleanedFormData).forEach(key => {
            if (key === 'items' || key === 'dokumenPendukung' || key === 'detailTransaksi') {
                // Handle array fields dengan JSON.stringify
                formDataToSend.append(key, JSON.stringify(cleanedFormData[key]));
            } else if (cleanedFormData[key] instanceof File) {
                // Handle file fields
                formDataToSend.append(key, cleanedFormData[key]);
            } else if (cleanedFormData[key] !== null && cleanedFormData[key] !== undefined) {
                // Handle regular fields
                formDataToSend.append(key, cleanedFormData[key]);
            }
        });

        // Tambahkan file dokumen pendukung secara terpisah
        formData.dokumenPendukung.forEach((doc, index) => {
            if (doc.file instanceof File) {
                formDataToSend.append(`dokumenPendukungFiles`, doc.file);
                formDataToSend.append(`dokumenPendukungNames`, doc.nama || '');
            }
        });

        return formDataToSend;
    };

    // Save Draft
    const saveDraft = async () => {
        if (!formData.idBast) {
            alert('ID BAST tidak valid');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) return alert('Token tidak ditemukan');

        setIsSavingDraft(true);
        try {
            const formDataToSend = prepareFormData();

            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/bast/draft`, {
                method: 'POST',
                body: formDataToSend,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await res.json();
            if (res.ok) {
                setSuccessMessage(`Draft BAST berhasil disimpan! ID: ${formData.idBast}`);
                setShowSuccessModal(true);

                // Set timeout untuk redirect setelah 3 detik
                setTimeout(() => {
                    setRedirectToDashboard(true);
                }, 3000);
            } else {
                alert('Gagal: ' + (result.error || 'Server error'));
            }
        } catch (err) {
            console.error('Error save draft:', err);
            alert('Kesalahan jaringan');
        } finally {
            setIsSavingDraft(false);
        }
    };

    // Submit BAST
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        const token = localStorage.getItem('token');
        if (!token) return alert('Token tidak ditemukan');

        setIsSubmitting(true);
        try {
            const formDataToSend = prepareFormData();

            // 1. Save draft dulu (opsional, tapi aman)
            const draftRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/bast/draft`, {
                method: 'POST',
                body: formDataToSend,
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!draftRes.ok) {
                const err = await draftRes.json();
                throw new Error(err.error || 'Gagal simpan draft');
            }

            // 2. Submit ke WAITING_REVIEW
            const submitRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/bast/submit`, {
                method: 'POST',
                body: formDataToSend,
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const result = await submitRes.json();
            if (submitRes.ok) {
                setSuccessMessage(`Draft BAST berhasil disimpan! ID: ${formData.idBast}`);
                setShowSuccessModal(true);

                // Set timeout untuk redirect setelah 3 detik
                setTimeout(() => {
                    setRedirectToDashboard(true);
                }, 3000);
            } else {
                alert('Gagal: ' + (result.error || 'Server error'));
            }
        } catch (err) {
            console.error('Error submit:', err);
            alert('Kesalahan: ' + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Reset Form
    const resetForm = () => {
        if (window.confirm('Anda yakin ingin mereset draft? Semua data akan hilang.')) {
            setFormData({
                idBast: `BAST-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                invoiceTypeId: '',
                nomorPo: '',
                vendorId: '',
                perihal: '',
                nomorKontrak: '',
                reviewerBast: '',
                tanggalMulaiKontrak: '',
                tanggalAkhirKontrak: '',
                tanggalPenyerahanBarangJasa: '',
                kesesuaianJumlahSpesifikasi: 'Sesuai',
                alasanKetidaksesuaian: '',
                idrDendaKeterlambatan: 0,
                copyKontrak: null,
                items: [{ no: 1, pekerjaan: '', progress: '0', nilaiTagihan: '', keterangan: '' }],
                dokumenPendukung: [{ id: Date.now(), nama: '', file: null }],
                statusFaktur: '',
                nomorFaktur: '',
                tanggalFaktur: '',
                jumlahOpp: '',
                jumlahPpn: '',
                jumlahPpnBm: '',
                npwpPenjual: '',
                namaPenjual: '',
                alamatPenjual: '',
                npwpLawanTransaksi: '',
                namaLawanTransaksi: '',
                alamatLawanTransaksi: '',
                berkas: null,
                detailTransaksi: [{ id: 1, no: 1, namaBarang: 'Nama Barang Kena Pajak/Jasa Kena Pajak', hargaJual: '0' }],
                creatorBastVendor: formData.creatorBastVendor,
            });
            setErrors({});
        }
    };

    const totalTagihan = formData.items.reduce((sum, item) => {
        const num = parseInt(item.nilaiTagihan.replace(/\./g, ''), 10) || 0;
        return sum + num;
    }, 0);

    const openFakturModal = () => {
        fetchFakturList();
        setShowFakturModal(true);
    };

    const selectFaktur = (faktur) => {
        setFormData({
            ...formData,
            nomorFaktur: faktur.nomor,
            tanggalFaktur: faktur.tanggal,
            jumlahOpp: faktur.jumlahOpp,
            jumlahPpn: faktur.ppn,
            npwpPenjual: faktur.npwpPenjual,
            namaPenjual: faktur.namaPenjual,
            alamatPenjual: faktur.alamatPenjual,
        });
        setShowFakturModal(false);
    };

    const filteredFaktur = fakturList.filter(f =>
        f.nomor.toLowerCase().includes(searchFaktur.toLowerCase()) ||
        f.namaPenjual.toLowerCase().includes(searchFaktur.toLowerCase())
    );

    return (
        <div className="bg-card border border-border rounded-lg p-6 space-y-6">
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground">Form BAST</h3>
                <p className="text-sm text-muted-foreground">Isi data BAST sesuai kontrak dan dokumen pendukung</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Select
                        label="Jenis Pengadaan"
                        required
                        options={pengadaanOptions}
                        value={formData.invoiceTypeId}
                        onChange={(value) => setFormData({ ...formData, invoiceTypeId: value })}
                        error={errors.invoiceTypeId}
                        placeholder={loading ? 'Memuat...' : 'Pilih jenis...'}
                        disabled={loading}
                    />

                    <div className="flex gap-2">
                        <Input
                            label="Nomor PO"
                            type="text"
                            required
                            value={formData.nomorPo}
                            onChange={(e) => setFormData({ ...formData, nomorPo: e.target.value })}
                            error={errors.nomorPo}
                            containerClassName="flex-1"
                        />
                        <div className="flex items-end mb-1">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => alert('Fitur pencarian PO belum tersedia')}
                                className="h-10"
                            >
                                <SearchIcon size={16} />
                            </Button>
                        </div>
                    </div>

                    <Input
                        label="Nomor Kontrak"
                        type="textarea"
                        required
                        value={formData.nomorKontrak}
                        onChange={(e) => setFormData({ ...formData, nomorKontrak: e.target.value })}
                        error={errors.nomorKontrak}
                    />

                    <Select
                        label="Nama Vendor"
                        required
                        options={vendorOptions}
                        value={formData.vendorId}
                        onChange={(value) => setFormData({ ...formData, vendorId: value })}
                        error={errors.vendorId}
                        placeholder={loading ? 'Memuat...' : 'Pilih vendor...'}
                        disabled={loading || vendorOptions.length === 1} // kalau 1 vendor, sekalian disable
                    />


                    <Input
                        label="Perihal"
                        type="textarea"
                        required
                        value={formData.perihal}
                        onChange={(e) => setFormData({ ...formData, perihal: e.target.value })}
                        error={errors.perihal}
                    />

                    {/* Reviewer BAST dengan tombol Cek */}
                    <div className="flex flex-col gap-1">
                        <label className="block font-medium">Reviewer BAST *</label>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                value={formData.reviewerBast}
                                onChange={(e) => setFormData({ ...formData, reviewerBast: e.target.value })}
                                className="flex-1 border rounded px-3 py-2"
                                placeholder="masukan@email.com"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleCheckReviewer}
                                className="h-10 whitespace-nowrap"
                            >
                                Cek
                            </Button>
                        </div>
                        {errors.reviewerBast && <p className="text-sm text-red-500 mt-1">{errors.reviewerBast}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <Input
                            label="Tanggal Mulai Kontrak"
                            type="date"
                            required
                            value={formData.tanggalMulaiKontrak}
                            onChange={(e) => setFormData({ ...formData, tanggalMulaiKontrak: e.target.value })}
                            error={errors.tanggalMulaiKontrak}
                        />
                        <Input
                            label="Tanggal Akhir Kontrak"
                            type="date"
                            required
                            value={formData.tanggalAkhirKontrak}
                            onChange={(e) => setFormData({ ...formData, tanggalAkhirKontrak: e.target.value })}
                            error={errors.tanggalAkhirKontrak}
                        />
                    </div>

                    <Input
                        label="Tanggal Penyerahan Barang/Jasa"
                        type="date"
                        value={formData.tanggalPenyerahanBarangJasa}
                        onChange={(e) => setFormData({ ...formData, tanggalPenyerahanBarangJasa: e.target.value })}
                        error={errors.tanggalPenyerahanBarangJasa}
                    />

                    <div>
                        <label className="block mb-2 font-medium">Kesesuaian Spesifikasi</label>
                        <div className="flex gap-6">
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="kesesuaian"
                                    value="Sesuai"
                                    checked={formData.kesesuaianJumlahSpesifikasi === 'Sesuai'}
                                    onChange={() => setFormData({
                                        ...formData,
                                        kesesuaianJumlahSpesifikasi: 'Sesuai',
                                        alasanKetidaksesuaian: '',
                                        idrDendaKeterlambatan: ''
                                    })}
                                />
                                Sesuai
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="kesesuaian"
                                    value="Tidak Sesuai"
                                    checked={formData.kesesuaianJumlahSpesifikasi === 'Tidak Sesuai'}
                                    onChange={() => setFormData({
                                        ...formData,
                                        kesesuaianJumlahSpesifikasi: 'Tidak Sesuai'
                                    })}
                                />
                                Tidak Sesuai
                            </label>
                        </div>
                        {errors.kesesuaianJumlahSpesifikasi && (
                            <p className="text-sm text-red-500 mt-1">{errors.kesesuaianJumlahSpesifikasi}</p>
                        )}
                    </div>

                    {formData.kesesuaianJumlahSpesifikasi === 'Tidak Sesuai' && (
                        <div className="space-y-4 col-span-2">
                            <Input
                                label="Alasan Ketidaksesuaian"
                                type="textarea"
                                required
                                value={formData.alasanKetidaksesuaian}
                                onChange={(e) => setFormData({ ...formData, alasanKetidaksesuaian: e.target.value })}
                                error={errors.alasanKetidaksesuaian}
                            />
                            <Input
                                label="Denda Keterlambatan (IDR)"
                                type="text"
                                required
                                value={formData.idrDendaKeterlambatan}
                                onChange={(e) => handleCurrencyChange(e, 'idrDendaKeterlambatan')}
                                error={errors.idrDendaKeterlambatan}
                            />
                        </div>
                    )}
                </div>

                {/* Item Pekerjaan */}
                <div>
                    <h4 className="font-medium mb-4">Item Pekerjaan:</h4>
                    <table className="w-full table-auto border-collapse">
                        <thead>
                            <tr className="bg-blue-50">
                                <th className="px-4 py-2 text-left">No.</th>
                                <th className="px-4 py-2 text-left">Pekerjaan</th>
                                <th className="px-4 py-2 text-left">Progress</th>
                                <th className="px-4 py-2 text-left">Nilai Tagihan</th>
                                <th className="px-4 py-2 text-left">Keterangan</th>
                                <th className="px-4 py-2 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {formData.items.map((item, index) => (
                                <tr key={index} className="border-b">
                                    <td className="px-4 py-2">{item.no}</td>
                                    <td><input type="text" value={item.pekerjaan} onChange={(e) => handleItemChange(index, 'pekerjaan', e.target.value)} className="w-full border rounded px-2 py-1" /></td>
                                    <td><input type="number" min="0" max="100" value={item.progress} onChange={(e) => handleItemChange(index, 'progress', e.target.value)} className="w-20 border rounded px-2 py-1" />%</td>
                                    <td><input type="text" value={item.nilaiTagihan} onChange={(e) => { const f = formatCurrency(e.target.value); handleItemChange(index, 'nilaiTagihan', f); }} className="w-full border rounded px-2 py-1" /></td>
                                    <td><input type="text" value={item.keterangan} onChange={(e) => handleItemChange(index, 'keterangan', e.target.value)} className="w-full border rounded px-2 py-1" /></td>
                                    <td className="text-right"><button type="button" onClick={() => removeItem(index)} className="text-red-500"><Trash2Icon size={16} /></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="mt-2 flex justify-end">
                        <button type="button" onClick={addItem} className="flex items-center gap-1 text-blue-600 text-sm">
                            <PlusIcon size={16} /> Tambah Item
                        </button>
                    </div>
                    <div className="mt-2 text-right font-medium">Total: <span className="text-blue-600">{formatCurrency(totalTagihan.toString())}</span></div>
                </div>

                {/* Copy Kontrak (tampilan seperti Dokumen Pendukung) */}
                <div>
                    <h4 className="font-medium mb-4">Copy Kontrak *:</h4>
                    {errors.copyKontrak && (
                        <p className="text-sm text-red-500 mb-2">{errors.copyKontrak}</p>
                    )}
                    <div className="bg-gray-50 p-4 rounded border mb-3">
                        <div className="flex flex-col sm:flex-row gap-4">
                            {/* Kolom File Upload */}
                            <div className="flex-1">
                                <label className="block mb-1">Upload File *</label>
                                <input
                                    type="file"
                                    accept=".pdf,.doc,.docx"
                                    onChange={(e) => handleFileChange(e, 'copyKontrak')}
                                    className="w-full border rounded px-3 py-2"
                                />
                                {errors.copyKontrak && <p className="text-sm text-red-500 mt-1">{errors.copyKontrak}</p>}
                                {formData.copyKontrak && (
                                    <p className="text-sm text-green-600 mt-1">File: {formData.copyKontrak.name}</p>
                                )}
                            </div>

                            {/* Kolom kosong (untuk alignment) */}
                            <div className="flex-1 opacity-0">
                                {/* Ini hanya untuk menjaga alignment dengan dokumen pendukung */}
                            </div>

                            {/* Kolom kosong (untuk alignment tombol) */}
                            <div className="mt-6 opacity-0">
                                {/* Tidak ada tombol hapus karena hanya 1 file dan wajib */}
                            </div>
                        </div>
                    </div>
                    {/* Legend / Petunjuk Pengunggahan */}
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-md text-sm text-gray-800">
                        <strong className="block font-medium text-blue-800 mb-2">Untuk Menghindari Kegagalan Upload:</strong>
                        <ul className="space-y-1">
                            <li>• Dimohon untuk nama file yang diupload tidak menggunakan karakter: <code className="bg-gray-200 px-1 rounded">:%$#@-_'"</code></li>
                            <li>• Ukuran <strong>Copy Kontrak</strong> maksimal <strong>10 MB</strong></li>
                            <li>• Ukuran <strong>Dokumen Pendukung</strong> maksimal <strong>10 MB</strong></li>
                            <li>• Dokumen yang di-upload harus dalam bentuk <strong>.pdf</strong> (disarankan untuk kepastian kompatibilitas)</li>
                        </ul>
                    </div>
                </div>

                {/* Dokumen Pendukung */}
                <div>
                    <h4 className="font-medium mb-4">Dokumen Pendukung (1-3 dokumen):</h4>
                    {errors.dokumenPendukung && (
                        <p className="text-sm text-red-500 mb-2">{errors.dokumenPendukung}</p>
                    )}
                    {formData.dokumenPendukung.map((doc) => (
                        <div key={doc.id} className="bg-gray-50 p-4 rounded border mb-3">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                    <Input
                                        label={`Nama Dokumen`}
                                        type="text"
                                        value={doc.nama}
                                        onChange={(e) => handleDokumenChange(doc.id, 'nama', e.target.value)}
                                        error={errors[`nama_dokumen_${doc.id}`]}
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block mb-1">Upload File *</label>
                                    <input type="file" accept=".pdf,.doc,.zip" onChange={(e) => handleDokumenFileChange(doc.id, e)} className="w-full" />
                                    {errors[`file_${doc.id}`] && <p className="text-sm text-red-500 mt-1">{errors[`file_${doc.id}`]}</p>}
                                </div>
                                <div className="mt-6">
                                    {formData.dokumenPendukung.length > 1 && (
                                        <button type="button" onClick={() => removeDokumenPendukung(doc.id)} className="text-red-500">
                                            <Trash2Icon size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addDokumenPendukung}
                        disabled={formData.dokumenPendukung.length >= 3}
                        className="flex items-center gap-1 text-blue-600 text-sm mt-2 disabled:text-gray-400"
                    >
                        <PlusIcon size={16} /> Tambah Dokumen
                    </button>
                </div>

                {/* Faktur Pajak */}
                <div className="bg-white border rounded-lg p-4">
                    <h4 className="font-medium mb-4">Faktur Pajak</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Status Faktur" type="text" value={formData.statusFaktur} onChange={(e) => setFormData({ ...formData, statusFaktur: e.target.value })} error={errors.statusFaktur} />

                        <div className="flex gap-2">
                            <Input
                                label="Nomor Faktur"
                                type="text"
                                required
                                value={formData.nomorFaktur}
                                onChange={(e) => setFormData({ ...formData, nomorFaktur: e.target.value })}
                                error={errors.nomorFaktur}
                                containerClassName="flex-1"
                            />
                            <div className="flex items-end mb-1">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={openFakturModal}
                                    className="h-10"
                                >
                                    <SearchIcon size={16} />
                                </Button>
                            </div>
                        </div>

                        <Input label="Tanggal Faktur" type="date" value={formData.tanggalFaktur} onChange={(e) => setFormData({ ...formData, tanggalFaktur: e.target.value })} error={errors.tanggalFaktur} />
                        <Input label="Jumlah OPP" type="text" value={formData.jumlahOpp} onChange={(e) => setFormData({ ...formData, jumlahOpp: e.target.value })} error={errors.jumlahOpp} />
                        <Input label="Jumlah PPn" type="text" value={formData.jumlahPpn} onChange={(e) => setFormData({ ...formData, jumlahPpn: e.target.value })} error={errors.jumlahPpn} />
                        <Input label="Jumlah PPnBm" type="text" value={formData.jumlahPpnBm} onChange={(e) => setFormData({ ...formData, jumlahPpnBm: e.target.value })} error={errors.jumlahPpnBm} />
                        <Input label="NPWP Penjual" type="text" value={formData.npwpPenjual} onChange={(e) => setFormData({ ...formData, npwpPenjual: e.target.value })} error={errors.npwpPenjual} />
                        <Input label="Nama Penjual" type="text" value={formData.namaPenjual} onChange={(e) => setFormData({ ...formData, namaPenjual: e.target.value })} error={errors.namaPenjual} />
                        <Input label="Alamat Penjual" type="text" value={formData.alamatPenjual} onChange={(e) => setFormData({ ...formData, alamatPenjual: e.target.value })} error={errors.alamatPenjual} />
                        <Input label="NPWP Lawan Transaksi" type="text" value={formData.npwpLawanTransaksi} onChange={(e) => setFormData({ ...formData, npwpLawanTransaksi: e.target.value })} error={errors.npwpLawanTransaksi} />
                        <Input label="Nama Lawan Transaksi" type="text" value={formData.namaLawanTransaksi} onChange={(e) => setFormData({ ...formData, namaLawanTransaksi: e.target.value })} error={errors.namaLawanTransaksi} />
                        <Input label="Alamat Lawan Transaksi" type="text" value={formData.alamatLawanTransaksi} onChange={(e) => setFormData({ ...formData, alamatLawanTransaksi: e.target.value })} error={errors.alamatLawanTransaksi} />
                        <div>
                            <label className="block mb-1">Berkas Faktur *</label>
                            <input type="file" accept=".pdf,.jpg,.png" onChange={(e) => handleFileChange(e, 'berkas')} className="w-full" />
                            {errors.berkas && <p className="text-sm text-red-500 mt-1">{errors.berkas}</p>}
                        </div>
                    </div>
                </div>

                {/* Tombol Aksi */}
                <div className="pt-4 border-t">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={resetForm}
                        >
                            Reset Draft
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={saveDraft}
                            loading={isSavingDraft}
                            icon={<SaveIcon size={16} />}
                        >
                            {isSavingDraft ? 'Menyimpan...' : 'Save Draft'}
                        </Button>
                        <Button
                            type="submit"
                            variant="default"
                            loading={isSubmitting}
                            className="flex-1"
                        >
                            {isSubmitting ? 'Mengirim...' : 'Submit BAST'}
                        </Button>
                    </div>
                </div>
            </form>

            {/* Modal: Hasil Cek Reviewer */}
            {showReviewerPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm text-center">
                        {reviewerStatus === 'found' ? (
                            <>
                                <CheckCircleIcon className="text-green-500 mx-auto mb-4" size={48} />
                                <h5 className="text-lg font-semibold text-green-600">Ditemukan!</h5>
                                <p>Email valid dan merupakan reviewer.</p>
                            </>
                        ) : (
                            <>
                                <XCircleIcon className="text-red-500 mx-auto mb-4" size={48} />
                                <h5 className="text-lg font-semibold text-red-600">Tidak Ditemukan</h5>
                                <p>Email tidak ditemukan atau bukan reviewer.</p>
                            </>
                        )}
                        <Button className="mt-4" onClick={() => setShowReviewerPopup(false)}>Tutup</Button>
                    </div>
                </div>
            )}

            {/* Modal Pencarian Faktur */}
            {showFakturModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-4/5 max-w-2xl max-h-96 overflow-auto">
                        <h5 className="text-lg font-semibold mb-4">Pilih Faktur</h5>
                        <input
                            type="text"
                            placeholder="Cari nomor atau nama penjual..."
                            value={searchFaktur}
                            onChange={(e) => setSearchFaktur(e.target.value)}
                            className="w-full border rounded px-3 py-2 mb-4"
                        />
                        <table className="w-full table-auto">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="px-3 py-2">Nomor</th>
                                    <th className="px-3 py-2">Tanggal</th>
                                    <th className="px-3 py-2">Penjual</th>
                                    <th className="px-3 py-2">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredFaktur.length > 0 ? (
                                    filteredFaktur.map(f => (
                                        <tr key={f.id} className="border-b">
                                            <td className="px-3 py-2">{f.nomor}</td>
                                            <td className="px-3 py-2">{f.tanggal}</td>
                                            <td className="px-3 py-2">{f.namaPenjual}</td>
                                            <td className="px-3 py-2">
                                                <Button
                                                    size="sm"
                                                    onClick={() => selectFaktur(f)}
                                                >
                                                    Pilih
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-3 py-4 text-center text-gray-500">Tidak ada data</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <div className="mt-4 flex justify-end">
                            <Button variant="outline" onClick={() => setShowFakturModal(false)}>Tutup</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Success */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm text-center">
                        <CheckCircleIcon className="text-green-500 mx-auto mb-4" size={48} />
                        <h5 className="text-lg font-semibold text-green-600">Berhasil!</h5>
                        <p className="mb-4">{successMessage}</p>
                        <p className="text-sm text-gray-500 mb-4">
                            Anda akan dialihkan ke dashboard dalam 3 detik...
                        </p>
                        <Button
                            onClick={() => setRedirectToDashboard(true)}
                            className="mt-2"
                        >
                            Kembali ke Dashboard Sekarang
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BASTForm;