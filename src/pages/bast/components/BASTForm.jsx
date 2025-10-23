// Bast/components/BASTForm.jsx
import React, { useState, useEffect } from "react";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import Select from "../../../components/ui/Select";
import {
  PlusIcon,
  Trash2Icon,
  SearchIcon,
  CheckCircleIcon,
  XCircleIcon,
  SaveIcon,
} from "lucide-react";

// Helper: format angka jadi IDR format
const formatCurrency = (value) => {
  if (!value) return "";
  const number = value.toString().replace(/[^\d]/g, "");
  return number.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

// helper: parse "1.000.000" atau number menjadi integer (0 jika kosong)
const parseCurrency = (value) => {
  if (value === null || value === undefined) return 0;
  const s = typeof value === "number" ? String(value) : value.toString();
  const digits = s.replace(/[^\d]/g, "");
  return parseInt(digits, 10) || 0;
};

const BASTForm = () => {
  const [formData, setFormData] = useState({
    idBast: `BAST-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    invoiceTypeId: "",
    nomorPo: "",
    vendorId: "",
    perihal: "",
    nomorKontrak: "",
    reviewerBast: "",
    tanggalMulaiKontrak: "",
    tanggalAkhirKontrak: "",
    tanggalPenyerahanBarangJasa: "",
    kesesuaianJumlahSpesifikasi: "Sesuai",
    alasanKeterlambatan: "",
    idrDendaKeterlambatan: "",
    copyKontrak: null,
    items: [
      { no: 1, pekerjaan: "", progress: "0", nilaiTagihan: "", keterangan: "" },
    ],
    dokumenPendukung: [{ id: Date.now(), nama: "", file: null }],
    statusFaktur: "",
    nomorFaktur: "",
    tanggalFaktur: "",
    jumlahOpp: "",
    jumlahPpn: "",
    jumlahPpnBm: "",
    npwpPenjual: "",
    namaPenjual: "",
    alamatPenjual: "",
    npwpLawanTransaksi: "",
    namaLawanTransaksi: "",
    alamatLawanTransaksi: "",
    berkas: null,
    detailTransaksi: [
      {
        id: 1,
        no: 1,
        namaBarang: "Nama Barang Kena Pajak/Jasa Kena Pajak",
        hargaJual: "0",
      },
    ],
    creatorBastVendor: "",
  });

  // ✅ Helper Functions (didefinisikan di dalam fungsi)
  const formatDateForDisplay = (isoString) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "N/A";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // State tambahan untuk pencarian kontrak
  const [showKontrakModal, setShowKontrakModal] = useState(false);
  const [kontrakList, setKontrakList] = useState([]);
  const [isSearchingKontrak, setIsSearchingKontrak] = useState(false);

  // State lainnya (tidak diubah)
  const [vendorOptions, setVendorOptions] = useState([]);
  const [pengadaanOptions, setPengadaanOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [errors, setErrors] = useState({});
  const [maxFileSizeMB, setMaxFileSizeMB] = useState(10);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [redirectToDashboard, setRedirectToDashboard] = useState(false);

  // 🔴 State untuk menandai field yang sudah disentuh (untuk visual error saat submit)
  const [touchedFields, setTouchedFields] = useState(new Set());

  // Modal & Popup
  const [showFakturModal, setShowFakturModal] = useState(false);
  const [fakturList, setFakturList] = useState([]);
  const [searchFaktur, setSearchFaktur] = useState("");
  const [showReviewerPopup, setShowReviewerPopup] = useState(false);
  const [reviewerStatus, setReviewerStatus] = useState(null);

  // Redirect ke dashboard setelah save draft berhasil
  useEffect(() => {
    if (redirectToDashboard) {
      window.location.href = "/vendor-dashboard";
    }
  }, [redirectToDashboard]);

  // Load data awal
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return;
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      try {
        const [typeRes, configRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/invoice-types`, {
            headers,
          }),
          fetch(
            `${import.meta.env.VITE_API_BASE_URL}/api/configurations/MAX_FILE`,
            { headers }
          ),
        ]);
        const types = await typeRes.json();
        const config = await configRes.json();
        if (config?.value) setMaxFileSizeMB(parseInt(config.value, 10));
        setPengadaanOptions(
          types.map((t) => ({
            value: t.id.toString(),
            label: t.tipeInvoice,
          }))
        );
      } catch (err) {
        console.error("Gagal muat data awal:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Ambil userEmail dan vendor
  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    const vendorLocId = localStorage.getItem("vendorId");
    if (userEmail) {
      setFormData((prev) => ({ ...prev, creatorBastVendor: userEmail }));
    }
    const fetchVendor = async () => {
      const token = localStorage.getItem("token");
      if (!token || !vendorLocId) return;
      const headers = { Authorization: `Bearer ${token}` };
      try {
        const res = await fetch(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/vendors?filter=id eq ${vendorLocId}`,
          { headers }
        );
        const vendors = await res.json();
        if (vendors.length === 1) {
          setFormData((prev) => ({
            ...prev,
            vendorId: vendors[0].id.toString(),
          }));
          setVendorOptions(
            vendors.map((v) => ({
              value: v.id.toString(),
              label: v.namaVendor,
            }))
          );
        }
      } catch (err) {
        console.error("Gagal load vendor:", err);
      }
    };
    fetchVendor();
  }, []);

  // Fetch daftar faktur
  const fetchFakturList = async () => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/faktur`,
        { headers }
      );
      const data = await res.json();
      setFakturList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Gagal muat daftar faktur:", err);
      setFakturList([]);
    }
  };

  // ✅ FUNGSI BARU: Cari Master Kontrak
  const handleSearchKontrak = async () => {
    const searchValue = formData.nomorKontrak.trim();
    if (!searchValue) {
      setErrors((prev) => ({
        ...prev,
        nomorKontrak: "Masukkan nomor kontrak untuk pencarian",
      }));
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Token tidak ditemukan. Silakan login ulang.");
      return;
    }
    setIsSearchingKontrak(true);
    setErrors((prev) => ({ ...prev, nomorKontrak: undefined }));
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/imasws/GetMasterContract?search=${encodeURIComponent(
          searchValue
        )}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      const contracts = result.values || [];
      if (contracts.length === 0) {
        alert("Tidak ada kontrak ditemukan. Silakan isi manual.");
        return;
      }
      if (contracts.length === 1) {
        // ✅ Otomatis isi form
        const kontrak = contracts[0];
        setFormData((prev) => ({
          ...prev,
          nomorKontrak: kontrak.number || prev.nomorKontrak,
          perihal: kontrak.subject || prev.perihal,
          tanggalMulaiKontrak: kontrak.date
            ? formatDateForInput(kontrak.date)
            : prev.tanggalMulaiKontrak,
          tanggalAkhirKontrak: kontrak.expireDate
            ? formatDateForInput(kontrak.expireDate)
            : prev.tanggalAkhirKontrak,
        }));
        alert("Data kontrak berhasil diisi otomatis!");
      } else {
        // ✅ Tampilkan modal pilih
        setKontrakList(contracts);
        setShowKontrakModal(true);
      }
    } catch (err) {
      console.error("Gagal mencari kontrak:", err);
      alert("Gagal mencari kontrak. Silakan coba lagi.");
    } finally {
      setIsSearchingKontrak(false);
    }
  };

  // Cek reviewer (tidak diubah)
  const handleCheckReviewer = async () => {
    const email = formData.reviewerBast;
    if (!email) {
      setErrors((prev) => ({ ...prev, reviewerBast: "Email harus diisi" }));
      return;
    }
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/${encodeURIComponent(
          email
        )}`,
        { headers }
      );
      const users = await res.json();
      const reviewer = users;
      if (reviewer && ["reviewer", "admin"].includes(reviewer.role)) {
        setReviewerStatus("found");
        setErrors((prev) => ({ ...prev, reviewerBast: undefined }));
      } else {
        setReviewerStatus("not-found");
        setErrors((prev) => ({
          ...prev,
          reviewerBast: "Email tidak ditemukan atau bukan reviewer",
        }));
      }
    } catch (err) {
      console.error("Gagal cek reviewer:", err);
      setErrors((prev) => ({ ...prev, reviewerBast: "Gagal memeriksa email" }));
    } finally {
      setShowReviewerPopup(true);
    }
  };

  // Currency formatting (tidak diubah)
  const formatCurrency = (value) => {
    if (!value) return "";
    const numericValue = value.replace(/\D/g, "");
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleCurrencyChange = (e, field) => {
    const rawValue = e.target.value;
    const formattedValue = formatCurrency(rawValue);
    setFormData((prev) => ({ ...prev, [field]: formattedValue }));
  };

  // Items (tidak diubah)
  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData((prev) => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    const newItem = {
      no: formData.items.length + 1,
      pekerjaan: "",
      progress: "0",
      nilaiTagihan: "",
      keterangan: "",
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

  // File Upload (tidak diubah)
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

  // Dokumen Pendukung (tidak diubah)
  const addDokumenPendukung = () => {
    if (formData.dokumenPendukung.length >= 3) {
      setErrors((prev) => ({
        ...prev,
        dokumenPendukung: "Maksimal 3 dokumen.",
      }));
      return;
    }
    const newDoc = {
      id: Date.now() + Math.random(),
      nama: "",
      file: null,
    };
    setFormData((prev) => ({
      ...prev,
      dokumenPendukung: [...prev.dokumenPendukung, newDoc],
    }));
    setErrors((prev) => ({ ...prev, dokumenPendukung: undefined }));
  };

  const removeDokumenPendukung = (id) => {
    if (formData.dokumenPendukung.length <= 1) {
      setErrors((prev) => ({
        ...prev,
        dokumenPendukung: "Minimal 1 dokumen.",
      }));
      return;
    }
    setFormData((prev) => ({
      ...prev,
      dokumenPendukung: prev.dokumenPendukung.filter((d) => d.id !== id),
    }));
  };

  const handleDokumenChange = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      dokumenPendukung: prev.dokumenPendukung.map((d) =>
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
      dokumenPendukung: prev.dokumenPendukung.map((d) =>
        d.id === id ? { ...d, file } : d
      ),
    }));
  };

  // Detail Transaksi (tidak diubah)
  const addDetailTransaksi = () => {
    const newDetail = {
      id: Date.now() + Math.random(),
      no: formData.detailTransaksi.length + 1,
      namaBarang: "",
      hargaJual: "",
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
      detailTransaksi: prev.detailTransaksi.filter((d) => d.id !== id),
    }));
  };

  const handleDetailChange = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      detailTransaksi: prev.detailTransaksi.map((d) =>
        d.id === id ? { ...d, [field]: value } : d
      ),
    }));
  };

  // 🔴 Fungsi untuk menandai semua field sebagai touched
  const markAllFieldsAsTouched = () => {
    const fields = new Set([
      "invoiceTypeId",
      "nomorPo",
      "vendorId",
      "perihal",
      "nomorKontrak",
      "reviewerBast",
      "tanggalMulaiKontrak",
      "tanggalAkhirKontrak",
      "tanggalPenyerahanBarangJasa",
      "copyKontrak",
      "alasanKeterlambatan",
      "idrDendaKeterlambatan",
      "dokumenPendukung",
      // "statusFaktur",
      // "nomorFaktur",
      // "tanggalFaktur",
      // "jumlahOpp",
      // "jumlahPpn",
      // "npwpPenjual",
      // "namaPenjual",
      // "alamatPenjual",
      // "npwpLawanTransaksi",
      // "namaLawanTransaksi",
      // "alamatLawanTransaksi",
      "berkas",
    ]);
    // Tambahkan item fields
    formData.items.forEach((_, idx) => {
      fields.add(`pekerjaan_${idx}`);
      fields.add(`nilaiTagihan_${idx}`);
    });
    setTouchedFields(fields);
  };

  // Validasi (tidak diubah)
  const validate = () => {
    const newErrors = {};
    if (!formData.invoiceTypeId)
      newErrors.invoiceTypeId = "Jenis Pengadaan harus dipilih";
    // if (!formData.nomorPo) newErrors.nomorPo = "Nomor PO harus diisi";
    if (!formData.vendorId) newErrors.vendorId = "Nama Vendor harus dipilih";
    if (!formData.perihal) newErrors.perihal = "Perihal harus diisi";
    if (!formData.nomorKontrak)
      newErrors.nomorKontrak = "Nomor Kontrak harus diisi";
    if (!formData.reviewerBast)
      newErrors.reviewerBast = "Email Reviewer harus diisi";
    if (!formData.tanggalMulaiKontrak)
      newErrors.tanggalMulaiKontrak = "Tanggal Mulai Kontrak harus diisi";
    if (!formData.tanggalAkhirKontrak)
      newErrors.tanggalAkhirKontrak = "Tanggal Akhir Kontrak harus diisi";
    if (!formData.tanggalPenyerahanBarangJasa)
      newErrors.tanggalPenyerahanBarangJasa = "Tanggal BA harus diisi";
    if (!formData.copyKontrak)
      newErrors.copyKontrak = "Copy Kontrak harus diunggah";
    if (formData.kesesuaianJumlahSpesifikasi === "Tidak Sesuai") {
      if (!formData.alasanKeterlambatan)
        newErrors.alasanKeterlambatan = "Alasan ketidaksesuaian harus diisi";
      if (!formData.idrDendaKeterlambatan)
        newErrors.idrDendaKeterlambatan = "Denda keterlambatan harus diisi";
    }
    formData.items.forEach((item, idx) => {
      if (!item.pekerjaan)
        newErrors[`pekerjaan_${idx}`] = "Pekerjaan tidak boleh kosong";
      if (!item.nilaiTagihan)
        newErrors[`nilaiTagihan_${idx}`] = "Nilai tagihan harus diisi";
    });
    if (!formData.dokumenPendukung.some((d) => d.file)) {
      newErrors.dokumenPendukung = "Minimal 1 dokumen pendukung harus diunggah";
    }
    // if (!formData.statusFaktur)
    //   newErrors.statusFaktur = "Status Faktur harus diisi";
    // if (!formData.nomorFaktur)
    //   newErrors.nomorFaktur = "Nomor Faktur harus diisi";
    // if (!formData.tanggalFaktur)
    //   newErrors.tanggalFaktur = "Tanggal Faktur harus diisi";
    // if (!formData.jumlahOpp) newErrors.jumlahOpp = "Jumlah OPP harus diisi";
    // if (!formData.jumlahPpn) newErrors.jumlahPpn = "Jumlah PPn harus diisi";
    // if (!formData.npwpPenjual)
    //   newErrors.npwpPenjual = "NPWP Penjual harus diisi";
    // if (!formData.namaPenjual)
    //   newErrors.namaPenjual = "Nama Penjual harus diisi";
    // if (!formData.alamatPenjual)
    //   newErrors.alamatPenjual = "Alamat Penjual harus diisi";
    // if (!formData.npwpLawanTransaksi)
    //   newErrors.npwpLawanTransaksi = "NPWP Lawan Transaksi harus diisi";
    // if (!formData.namaLawanTransaksi)
    //   newErrors.namaLawanTransaksi = "Nama Lawan Transaksi harus diisi";
    // if (!formData.alamatLawanTransaksi)
    //   newErrors.alamatLawanTransaksi = "Alamat Lawan Transaksi harus diisi";
    if (!formData.berkas) newErrors.berkas = "Berkas Faktur harus diunggah";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Fungsi untuk membersihkan nilai angka sebelum dikirim (tidak diubah)
  const cleanNumericValues = (data) => {
    return data.map((item) => {
      const cleanedItem = { ...item };
      if (
        cleanedItem.nilaiTagihan &&
        typeof cleanedItem.nilaiTagihan === "string"
      ) {
        cleanedItem.nilaiTagihan = cleanedItem.nilaiTagihan.replace(/\./g, "");
      }
      if (cleanedItem.progress && typeof cleanedItem.progress === "string") {
        cleanedItem.progress = parseFloat(cleanedItem.progress);
      }
      if (cleanedItem.hargaJual && typeof cleanedItem.hargaJual === "string") {
        cleanedItem.hargaJual = cleanedItem.hargaJual.replace(/\./g, "");
      }
      return cleanedItem;
    });
  };

  // Prepare FormData untuk pengiriman (tidak diubah)
  const prepareFormData = () => {
    const formDataToSend = new FormData();
    const cleanedFormData = { ...formData };
    cleanedFormData.items = cleanNumericValues(formData.items);
    cleanedFormData.detailTransaksi = cleanNumericValues(
      formData.detailTransaksi
    );
    Object.keys(cleanedFormData).forEach((key) => {
      if (
        key === "items" ||
        key === "dokumenPendukung" ||
        key === "detailTransaksi"
      ) {
        formDataToSend.append(key, JSON.stringify(cleanedFormData[key]));
      } else if (cleanedFormData[key] instanceof File) {
        formDataToSend.append(key, cleanedFormData[key]);
      } else if (
        cleanedFormData[key] !== null &&
        cleanedFormData[key] !== undefined
      ) {
        formDataToSend.append(key, cleanedFormData[key]);
      }
    });
    formData.dokumenPendukung.forEach((doc, index) => {
      if (doc.file instanceof File) {
        formDataToSend.append(`dokumenPendukungFiles`, doc.file);
        formDataToSend.append(`dokumenPendukungNames`, doc.nama || "");
      }
    });
    return formDataToSend;
  };

  // Save Draft (diperbarui dengan validasi visual)
  const saveDraft = async () => {
  // 🔴 Tandai semua field sebagai touched agar border merah muncul
  markAllFieldsAsTouched();
  if (!validate()) return;

  if (!formData.idBast) {
    alert("ID BAST tidak valid");
    return;
  }
  const token = localStorage.getItem("token");
  if (!token) return alert("Token tidak ditemukan");
  setIsSavingDraft(true);
  try {
    const formDataToSend = prepareFormData();
    const res = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/bast/draft`,
      {
        method: "POST",
        body: formDataToSend,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const result = await res.json();
    if (res.ok) {
      setSuccessMessage(
        `Draft BAST berhasil disimpan! ID: ${formData.idBast}`
      );
      setShowSuccessModal(true);
      setTimeout(() => {
        setRedirectToDashboard(true);
      }, 3000);
    } else {
      alert("Gagal: " + (result.error || "Server error"));
    }
  } catch (err) {
    console.error("Error save draft:", err);
    alert("Kesalahan jaringan");
  } finally {
    setIsSavingDraft(false);
  }
};

  // Submit BAST (diperbarui dengan validasi visual)
  const handleSubmit = async (e) => {
    e.preventDefault();
    markAllFieldsAsTouched(); // 🔴 tandai semua field
    if (!validate()) return;
    const token = localStorage.getItem("token");
    if (!token) return alert("Token tidak ditemukan");
    setIsSubmitting(true);
    try {
      const formDataToSend = prepareFormData();
      const draftRes = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/bast/draft`,
        {
          method: "POST",
          body: formDataToSend,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!draftRes.ok) {
        const err = await draftRes.json();
        throw new Error(err.error || "Gagal simpan draft");
      }
      const submitRes = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/bast/submit`,
        {
          method: "POST",
          body: formDataToSend,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const result = await submitRes.json();
      if (submitRes.ok) {
        setSuccessMessage(
          `Draft BAST berhasil disimpan! ID: ${formData.idBast}`
        );
        setShowSuccessModal(true);
        setTimeout(() => {
          setRedirectToDashboard(true);
        }, 3000);
      } else {
        alert("Gagal: " + (result.error || "Server error"));
      }
    } catch (err) {
      console.error("Error submit:", err);
      alert("Kesalahan: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset Form (tidak diubah)
  const resetForm = () => {
    if (
      window.confirm("Anda yakin ingin mereset draft? Semua data akan hilang.")
    ) {
      setFormData({
        idBast: `BAST-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        invoiceTypeId: "",
        nomorPo: "",
        vendorId: "",
        perihal: "",
        nomorKontrak: "",
        reviewerBast: "",
        tanggalMulaiKontrak: "",
        tanggalAkhirKontrak: "",
        tanggalPenyerahanBarangJasa: "",
        kesesuaianJumlahSpesifikasi: "Sesuai",
        alasanKeterlambatan: "",
        idrDendaKeterlambatan: "",
        copyKontrak: null,
        items: [
          {
            no: 1,
            pekerjaan: "",
            progress: "0",
            nilaiTagihan: "",
            keterangan: "",
          },
        ],
        dokumenPendukung: [{ id: Date.now(), nama: "", file: null }],
        statusFaktur: "",
        nomorFaktur: "",
        tanggalFaktur: "",
        jumlahOpp: "",
        jumlahPpn: "",
        jumlahPpnBm: "",
        npwpPenjual: "",
        namaPenjual: "",
        alamatPenjual: "",
        npwpLawanTransaksi: "",
        namaLawanTransaksi: "",
        alamatLawanTransaksi: "",
        berkas: null,
        detailTransaksi: [
          {
            id: 1,
            no: 1,
            namaBarang: "Nama Barang Kena Pajak/Jasa Kena Pajak",
            hargaJual: "0",
          },
        ],
        creatorBastVendor: formData.creatorBastVendor,
        totalInvoice:0,
      });
      setErrors({});
      setTouchedFields(new Set()); // reset touched
    }
  };

  const totalInvoice = formData.items.reduce((sum, item) => {
    const num = parseInt(item.nilaiTagihan.replace(/\./g, ""), 10) || 0;
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

  const filteredFaktur = fakturList.filter(
    (f) =>
      f.nomor.toLowerCase().includes(searchFaktur.toLowerCase()) ||
      f.namaPenjual.toLowerCase().includes(searchFaktur.toLowerCase())
  );

  // 🔴 Helper untuk cek apakah field wajib dan error
  const isFieldInvalid = (fieldName) => {
    return touchedFields.has(fieldName) && errors[fieldName];
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Form BAST</h3>
        <p className="text-sm text-muted-foreground">
          Isi data BAST sesuai kontrak dan dokumen pendukung
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Jenis Pengadaan"
            required
            options={pengadaanOptions}
            value={formData.invoiceTypeId}
            onChange={(value) =>
              setFormData({ ...formData, invoiceTypeId: value })
            }
            error={errors.invoiceTypeId}
            placeholder={loading ? "Memuat..." : "Pilih jenis..."}
            disabled={loading}
            containerClassName={isFieldInvalid("invoiceTypeId") ? "border-red-500" : ""}
          />
          <div className="flex gap-2">
            <Input
              label="Nomor PO"
              type="text"
              value={formData.nomorPo}
              onChange={(e) =>
                setFormData({ ...formData, nomorPo: e.target.value })
              }
              error={errors.nomorPo}
              containerClassName={`flex-1 ${isFieldInvalid("nomorPo") ? "border-red-500" : ""}`}
            />
            <div className="flex items-end mb-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => alert("Fitur pencarian PO belum tersedia")}
                className="h-10"
              >
                <SearchIcon size={16} />
              </Button>
            </div>
          </div>
          {/* ✅ Bagian Nomor Kontrak yang Diperbarui */}
          <div className="flex flex-col gap-1">
            <label className="block font-medium">Nomor Kontrak *</label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={formData.nomorKontrak}
                onChange={(e) =>
                  setFormData({ ...formData, nomorKontrak: e.target.value })
                }
                className={`flex-1 border rounded px-3 py-2 ${isFieldInvalid("nomorKontrak") ? "border-red-500" : ""}`}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSearchKontrak}
                disabled={isSearchingKontrak}
                className="h-10 whitespace-nowrap"
              >
                {isSearchingKontrak ? "Mencari..." : <SearchIcon size={16} />}
              </Button>
            </div>
            {errors.nomorKontrak && (
              <p className="text-sm text-red-500 mt-1">{errors.nomorKontrak}</p>
            )}
          </div>
          <Select
            label="Nama Vendor"
            required
            options={vendorOptions}
            value={formData.vendorId}
            onChange={(value) => setFormData({ ...formData, vendorId: value })}
            error={errors.vendorId}
            placeholder={loading ? "Memuat..." : "Pilih vendor..."}
            disabled={loading || vendorOptions.length === 1}
            containerClassName={isFieldInvalid("vendorId") ? "border-red-500" : ""}
          />
          <Input
            label="Perihal"
            type="textarea"
            required
            value={formData.perihal}
            onChange={(e) =>
              setFormData({ ...formData, perihal: e.target.value })
            }
            error={errors.perihal}
            containerClassName={isFieldInvalid("perihal") ? "border-red-500" : ""}
          />
          {/* Reviewer BAST (tidak diubah) */}
          <div className="flex flex-col gap-1">
            <label className="block font-medium">Reviewer BAST *</label>
            <div className="flex gap-2">
              <input
                type="email"
                value={formData.reviewerBast}
                onChange={(e) =>
                  setFormData({ ...formData, reviewerBast: e.target.value })
                }
                className={`flex-1 border rounded px-3 py-2 ${isFieldInvalid("reviewerBast") ? "border-red-500" : ""}`}
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
            {errors.reviewerBast && (
              <p className="text-sm text-red-500 mt-1">{errors.reviewerBast}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-6">
            <Input
              label="Tanggal Mulai Kontrak"
              type="date"
              required
              value={formData.tanggalMulaiKontrak}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  tanggalMulaiKontrak: e.target.value,
                })
              }
              error={errors.tanggalMulaiKontrak}
              containerClassName={isFieldInvalid("tanggalMulaiKontrak") ? "border-red-500" : ""}
            />
            <Input
              label="Tanggal Akhir Kontrak"
              type="date"
              required
              value={formData.tanggalAkhirKontrak}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  tanggalAkhirKontrak: e.target.value,
                })
              }
              error={errors.tanggalAkhirKontrak}
              containerClassName={isFieldInvalid("tanggalAkhirKontrak") ? "border-red-500" : ""}
            />
          </div>
          <Input
            label="Tanggal BA"
            type="date"
            value={formData.tanggalPenyerahanBarangJasa}
            onChange={(e) =>
              setFormData({
                ...formData,
                tanggalPenyerahanBarangJasa: e.target.value,
              })
            }
            error={errors.tanggalPenyerahanBarangJasa}
            containerClassName={isFieldInvalid("tanggalPenyerahanBarangJasa") ? "border-red-500" : ""}
          />
          {/* Kesesuaian Spesifikasi */}
          <div>
            <label className="block mb-2 font-medium">
              Kesesuaian Spesifikasi
            </label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="kesesuaian"
                  value="Sesuai"
                  checked={formData.kesesuaianJumlahSpesifikasi === "Sesuai"}
                  onChange={() =>
                    setFormData({
                      ...formData,
                      kesesuaianJumlahSpesifikasi: "Sesuai",
                      alasanKeterlambatan: "",
                      idrDendaKeterlambatan: "",
                    })
                  }
                />
                Sesuai
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="kesesuaian"
                  value="Tidak Sesuai"
                  checked={
                    formData.kesesuaianJumlahSpesifikasi === "Tidak Sesuai"
                  }
                  onChange={() =>
                    setFormData({
                      ...formData,
                      kesesuaianJumlahSpesifikasi: "Tidak Sesuai",
                    })
                  }
                />
                Tidak Sesuai
              </label>
            </div>
            {errors.kesesuaianJumlahSpesifikasi && (
              <p className="text-sm text-red-500 mt-1">
                {errors.kesesuaianJumlahSpesifikasi}
              </p>
            )}
          </div>
          {formData.kesesuaianJumlahSpesifikasi === "Tidak Sesuai" && (
            <div className="space-y-4 col-span-2">
              <Input
                label="Alasan Ketidaksesuaian"
                type="textarea"
                required
                value={formData.alasanKeterlambatan}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    alasanKeterlambatan: e.target.value,
                  })
                }
                error={errors.alasanKeterlambatan}
                containerClassName={isFieldInvalid("alasanKeterlambatan") ? "border-red-500" : ""}
              />
              <Input
                label="Denda Keterlambatan (IDR)"
                type="text"
                required
                value={formData.idrDendaKeterlambatan}
                onChange={(e) =>
                  handleCurrencyChange(e, "idrDendaKeterlambatan")
                }
                error={errors.idrDendaKeterlambatan}
                containerClassName={isFieldInvalid("idrDendaKeterlambatan") ? "border-red-500" : ""}
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
                  <td>
                    <input
                      type="text"
                      value={item.pekerjaan}
                      onChange={(e) =>
                        handleItemChange(index, "pekerjaan", e.target.value)
                      }
                      className={`w-full border rounded px-2 py-1 ${isFieldInvalid(`pekerjaan_${index}`) ? "border-red-500" : ""}`}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={item.progress}
                      onChange={(e) =>
                        handleItemChange(index, "progress", e.target.value)
                      }
                      className="w-20 border rounded px-2 py-1"
                    />
                    %
                  </td>
                  <td>
                    <input
                      type="text"
                      value={item.nilaiTagihan}
                      onChange={(e) => {
                        const f = formatCurrency(e.target.value);
                        handleItemChange(index, "nilaiTagihan", f);
                      }}
                      className={`w-full border rounded px-2 py-1 text-right ${isFieldInvalid(`nilaiTagihan_${index}`) ? "border-red-500" : ""}`}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={item.keterangan}
                      onChange={(e) =>
                        handleItemChange(index, "keterangan", e.target.value)
                      }
                      className="w-full border rounded px-2 py-1"
                    />
                  </td>
                  <td className="text-right">
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="text-red-500"
                    >
                      <Trash2Icon size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-2 flex justify-end">
            <button
              type="button"
              onClick={addItem}
              className="flex items-center gap-1 text-blue-600 text-sm"
            >
              <PlusIcon size={16} /> Tambah Item
            </button>
          </div>
          {/* 🧮 Total Awal, Denda, Total Akhir */}
          <div className="mt-4 text-right font-medium bg-gray-50 p-3 rounded-lg">
            <div>
              Total Awal:{" "}
              <span className="text-blue-600">
                {formatCurrency(totalInvoice.toString())}
              </span>
            </div>
            {formData.kesesuaianJumlahSpesifikasi === "Tidak Sesuai" &&
              parseInt(
                formData.idrDendaKeterlambatan.replace(/[^\d]/g, ""),
                10
              ) > 0 && (
                <div className="text-red-600 mt-1">
                  (-) Denda: {formatCurrency(formData.idrDendaKeterlambatan)}
                </div>
              )}
            <div className="mt-1">
              Total Akhir:{" "}
              <span className="text-green-600 font-semibold">
                {formatCurrency(
                  (
                    parseInt(
                      totalInvoice.toString().replace(/[^\d]/g, ""),
                      10
                    ) -
                    (formData.kesesuaianJumlahSpesifikasi === "Tidak Sesuai"
                      ? parseInt(
                          formData.idrDendaKeterlambatan.replace(/[^\d]/g, ""),
                          10
                        ) || 0
                      : 0)
                  ).toString()
                )}
              </span>
            </div>
          </div>
        </div>
        {/* Copy Kontrak (diperbarui visual error) */}
        <div>
          <h4 className="font-medium mb-4">Copy Kontrak *:</h4>
          {errors.copyKontrak && (
            <p className="text-sm text-red-500 mb-2">{errors.copyKontrak}</p>
          )}
          <div className="bg-gray-50 p-4 rounded border mb-3">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block mb-1">Upload File *</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileChange(e, "copyKontrak")}
                  className={`w-full border rounded px-3 py-2 ${isFieldInvalid("copyKontrak") ? "border-red-500" : ""}`}
                />
                {errors.copyKontrak && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.copyKontrak}
                  </p>
                )}
                {formData.copyKontrak && (
                  <p className="text-sm text-green-600 mt-1">
                    File: {formData.copyKontrak.name}
                  </p>
                )}
              </div>
              <div className="flex-1 opacity-0"></div>
              <div className="mt-6 opacity-0"></div>
            </div>
          </div>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-md text-sm text-gray-800">
            <strong className="block font-medium text-blue-800 mb-2">
              Untuk Menghindari Kegagalan Upload:
            </strong>
            <ul className="space-y-1">
              <li>
                • Dimohon untuk nama file yang diupload tidak menggunakan
                karakter:{" "}
                <code className="bg-gray-200 px-1 rounded">:%$#@-_'"</code>
              </li>
              <li>
                • Ukuran <strong>Copy Kontrak</strong> maksimal{" "}
                <strong>10 MB</strong>
              </li>
              <li>
                • Ukuran <strong>Dokumen Pendukung</strong> maksimal{" "}
                <strong>10 MB</strong>
              </li>
              <li>
                • Dokumen yang di-upload harus dalam bentuk{" "}
                <strong>.pdf</strong> (disarankan untuk kepastian
                kompatibilitas)
              </li>
            </ul>
          </div>
        </div>
        {/* Dokumen Pendukung (diperbarui visual error) */}
        <div>
          <h4 className="font-medium mb-4">Dokumen Pendukung (1-3 dokumen):</h4>
          {errors.dokumenPendukung && (
            <p className="text-sm text-red-500 mb-2">
              {errors.dokumenPendukung}
            </p>
          )}
          {formData.dokumenPendukung.map((doc) => (
            <div key={doc.id} className="bg-gray-50 p-4 rounded border mb-3">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    label={`Nama Dokumen`}
                    type="text"
                    value={doc.nama}
                    onChange={(e) =>
                      handleDokumenChange(doc.id, "nama", e.target.value)
                    }
                    error={errors[`nama_dokumen_${doc.id}`]}
                    className={`text-gray-900 bg-white border ${isFieldInvalid(`nama_dokumen_${doc.id}`) ? "border-red-500" : "border-gray-300"} focus:border-blue-500 focus:ring focus:ring-blue-100`}
                  />
                </div>
                <div className="flex-1">
                  <label className="block mb-1">Upload File *</label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.zip"
                    onChange={(e) => handleDokumenFileChange(doc.id, e)}
                    className={`w-full ${isFieldInvalid(`file_${doc.id}`) ? "border-red-500" : ""}`}
                  />
                  {errors[`file_${doc.id}`] && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors[`file_${doc.id}`]}
                    </p>
                  )}
                </div>
                <div className="mt-6">
                  {formData.dokumenPendukung.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDokumenPendukung(doc.id)}
                      className="text-red-500"
                    >
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
        {/* Faktur Pajak (tidak diubah, tapi diberi visual error) */}
        <div className="bg-white border rounded-lg p-4">
          <h4 className="font-medium mb-4">Faktur Pajak</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* <Input
              label="Status Faktur"
              type="text"
              value={formData.statusFaktur}
              onChange={(e) =>
                setFormData({ ...formData, statusFaktur: e.target.value })
              }
              error={errors.statusFaktur}
              containerClassName={isFieldInvalid("statusFaktur") ? "border-red-500" : ""}
            />
            <div className="flex gap-2">
              <Input
                label="Nomor Faktur"
                type="text"
                required
                value={formData.nomorFaktur}
                onChange={(e) =>
                  setFormData({ ...formData, nomorFaktur: e.target.value })
                }
                error={errors.nomorFaktur}
                containerClassName={`flex-1 ${isFieldInvalid("nomorFaktur") ? "border-red-500" : ""}`}
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
            <Input
              label="Tanggal Faktur"
              type="date"
              value={formData.tanggalFaktur}
              onChange={(e) =>
                setFormData({ ...formData, tanggalFaktur: e.target.value })
              }
              error={errors.tanggalFaktur}
              containerClassName={isFieldInvalid("tanggalFaktur") ? "border-red-500" : ""}
            />
            <Input
              label="Jumlah OPP"
              type="text"
              value={formData.jumlahOpp}
              onChange={(e) =>
                setFormData({ ...formData, jumlahOpp: e.target.value })
              }
              error={errors.jumlahOpp}
              containerClassName={isFieldInvalid("jumlahOpp") ? "border-red-500" : ""}
            />
            <Input
              label="Jumlah PPn"
              type="text"
              value={formData.jumlahPpn}
              onChange={(e) =>
                setFormData({ ...formData, jumlahPpn: e.target.value })
              }
              error={errors.jumlahPpn}
              containerClassName={isFieldInvalid("jumlahPpn") ? "border-red-500" : ""}
            />
            <Input
              label="Jumlah PPnBm"
              type="text"
              value={formData.jumlahPpnBm}
              onChange={(e) =>
                setFormData({ ...formData, jumlahPpnBm: e.target.value })
              }
              error={errors.jumlahPpnBm}
              containerClassName={isFieldInvalid("jumlahPpnBm") ? "border-red-500" : ""}
            />
            <Input
              label="NPWP Penjual"
              type="text"
              value={formData.npwpPenjual}
              onChange={(e) =>
                setFormData({ ...formData, npwpPenjual: e.target.value })
              }
              error={errors.npwpPenjual}
              containerClassName={isFieldInvalid("npwpPenjual") ? "border-red-500" : ""}
            />
            <Input
              label="Nama Penjual"
              type="text"
              value={formData.namaPenjual}
              onChange={(e) =>
                setFormData({ ...formData, namaPenjual: e.target.value })
              }
              error={errors.namaPenjual}
              containerClassName={isFieldInvalid("namaPenjual") ? "border-red-500" : ""}
            />
            <Input
              label="Alamat Penjual"
              type="text"
              value={formData.alamatPenjual}
              onChange={(e) =>
                setFormData({ ...formData, alamatPenjual: e.target.value })
              }
              error={errors.alamatPenjual}
              containerClassName={isFieldInvalid("alamatPenjual") ? "border-red-500" : ""}
            />
            <Input
              label="NPWP Lawan Transaksi"
              type="text"
              value={formData.npwpLawanTransaksi}
              onChange={(e) =>
                setFormData({ ...formData, npwpLawanTransaksi: e.target.value })
              }
              error={errors.npwpLawanTransaksi}
              containerClassName={isFieldInvalid("npwpLawanTransaksi") ? "border-red-500" : ""}
            />
            <Input
              label="Nama Lawan Transaksi"
              type="text"
              value={formData.namaLawanTransaksi}
              onChange={(e) =>
                setFormData({ ...formData, namaLawanTransaksi: e.target.value })
              }
              error={errors.namaLawanTransaksi}
              containerClassName={isFieldInvalid("namaLawanTransaksi") ? "border-red-500" : ""}
            />
            <Input
              label="Alamat Lawan Transaksi"
              type="text"
              value={formData.alamatLawanTransaksi}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  alamatLawanTransaksi: e.target.value,
                })
              }
              error={errors.alamatLawanTransaksi}
              containerClassName={isFieldInvalid("alamatLawanTransaksi") ? "border-red-500" : ""}
            /> */}
            <div>
              <label className="block mb-1">Berkas Faktur *</label>
              <input
                type="file"
                accept=".pdf,.jpg,.png"
                onChange={(e) => handleFileChange(e, "berkas")}
                className={`w-full ${isFieldInvalid("berkas") ? "border-red-500" : ""}`}
              />
              {errors.berkas && (
                <p className="text-sm text-red-500 mt-1">{errors.berkas}</p>
              )}
            </div>
          </div>
        </div>
        {/* Tombol Aksi (tidak diubah) */}
        <div className="pt-4 border-t">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button type="button" variant="outline" onClick={resetForm}>
              Reset Draft
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={saveDraft}
              loading={isSavingDraft}
              icon={<SaveIcon size={16} />}
            >
              {isSavingDraft ? "Menyimpan..." : "Save Draft"}
            </Button>
            <Button
              type="submit"
              variant="default"
              loading={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? "Mengirim..." : "Submit BAST"}
            </Button>
          </div>
        </div>
      </form>
      {/* Modal: Hasil Cek Reviewer (tidak diubah) */}
      {showReviewerPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm text-center">
            {reviewerStatus === "found" ? (
              <>
                <CheckCircleIcon
                  className="text-green-500 mx-auto mb-4"
                  size={48}
                />
                <h5 className="text-lg font-semibold text-green-600">
                  Ditemukan!
                </h5>
                <p>Email valid dan merupakan reviewer.</p>
              </>
            ) : (
              <>
                <XCircleIcon className="text-red-500 mx-auto mb-4" size={48} />
                <h5 className="text-lg font-semibold text-red-600">
                  Tidak Ditemukan
                </h5>
                <p>Email tidak ditemukan atau bukan reviewer.</p>
              </>
            )}
            <Button
              className="mt-4"
              onClick={() => setShowReviewerPopup(false)}
            >
              Tutup
            </Button>
          </div>
        </div>
      )}
      {/* ✅ Modal Pencarian Kontrak */}
      {showKontrakModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-80">
          <div className="bg-white rounded-lg p-6 w-4/5 max-w-3xl max-h-96 overflow-auto">
            <h5 className="text-lg font-semibold mb-4">Pilih Kontrak</h5>
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-3 py-2 text-left">Nomor Kontrak</th>
                  <th className="px-3 py-2 text-left">Partner Name</th>
                  <th className="px-3 py-2 text-left">Perihal</th>
                  <th className="px-3 py-2 text-left">Tanggal Mulai</th>
                  <th className="px-3 py-2 text-left">Tanggal Akhir</th>
                  <th className="px-3 py-2 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {kontrakList.map((kontrak, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-3 py-2 text-sm">
                      {kontrak.number || "N/A"}
                    </td>
                    <td className="px-3 py-2 text-sm">
                      {kontrak.partnerName || "N/A"}
                    </td>
                    <td className="px-3 py-2 text-sm">
                      {kontrak.subject || "N/A"}
                    </td>
                    <td className="px-3 py-2 text-sm">
                      {formatDateForDisplay(kontrak.date)}
                    </td>
                    <td className="px-3 py-2 text-sm">
                      {formatDateForDisplay(kontrak.expireDate)}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <Button
                        size="sm"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            nomorKontrak: kontrak.number,
                            perihal: kontrak.subject,
                            tanggalMulaiKontrak: kontrak.date
                              ? formatDateForInput(kontrak.date)
                              : prev.tanggalMulaiKontrak,
                            tanggalAkhirKontrak: kontrak.expireDate
                              ? formatDateForInput(kontrak.expireDate)
                              : prev.tanggalAkhirKontrak,
                          }));
                          setErrors((prev) => ({
                            ...prev,
                            nomorKontrak: undefined,
                          }));
                          setShowKontrakModal(false);
                        }}
                      >
                        Pilih
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4 flex justify-end">
              <Button
                variant="outline"
                onClick={() => setShowKontrakModal(false)}
              >
                Batal
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Modal Pencarian Faktur (tidak diubah) */}
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
                  filteredFaktur.map((f) => (
                    <tr key={f.id} className="border-b">
                      <td className="px-3 py-2">{f.nomor}</td>
                      <td className="px-3 py-2">{f.tanggal}</td>
                      <td className="px-3 py-2">{f.namaPenjual}</td>
                      <td className="px-3 py-2">
                        <Button size="sm" onClick={() => selectFaktur(f)}>
                          Pilih
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-3 py-4 text-center text-gray-500"
                    >
                      Tidak ada data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="mt-4 flex justify-end">
              <Button
                variant="outline"
                onClick={() => setShowFakturModal(false)}
              >
                Tutup
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Modal Success (tidak diubah) */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm text-center">
            <CheckCircleIcon
              className="text-green-500 mx-auto mb-4"
              size={48}
            />
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