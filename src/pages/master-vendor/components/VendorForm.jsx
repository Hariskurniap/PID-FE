// pages/master-vendor/components/VendorForm.jsx
import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import FileUpload from '../../../components/ui/FileUpload';

const VendorForm = ({ onCancel }) => {
  const [formData, setFormData] = useState({
    nomor: '',
    nama: '',
    alias: '',
    npwp: '',
    nik: '',
    alamat: '',
    isBranch: false,
    website: '',
    telepon: '',
    pkp: false,
    customer: false,
    vendor: false,
    skbFile: null,
    bank: {
      nomorRekening: '',
      pemegangRekening: '',
      namaBank: '',
      cabang: '',
    },
    pic: {
      nama: '',
      email: '',
      telepon: '',
      password: '',           // ✅ Field password untuk PIC
      confirmPassword: '',    // ✅ Field konfirmasi password
    },
    poinPrioritas1: 0,
    poinPrioritas2: 0,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value,
      },
    }));
  };

  const validate = () => {
    const newErrors = {};

    // Validasi wajib vendor
    if (!formData.nomor) newErrors.nomor = 'Nomor wajib diisi';
    if (!formData.nama) newErrors.nama = 'Nama wajib diisi';
    if (!formData.alamat) newErrors.alamat = 'Alamat wajib diisi';

    // Validasi NPWP & NIK format
    if (formData.npwp && formData.npwp.length !== 15) {
      newErrors.npwp = 'NPWP harus 15 digit';
    }
    if (formData.nik && formData.nik.length !== 16) {
      newErrors.nik = 'NIK harus 16 digit';
    }

    // Validasi website jika cabang
    if (formData.isBranch && !formData.website) {
      newErrors.website = 'Website wajib diisi jika dibuat sebagai cabang';
    }

    // Validasi bank jika salah satu role aktif
    if (formData.pkp || formData.customer || formData.vendor) {
      if (!formData.bank.nomorRekening) {
        newErrors.nomorRekening = 'Nomor rekening wajib diisi';
      }
      if (!formData.bank.pemegangRekening) {
        newErrors.pemegangRekening = 'Pemegang rekening wajib diisi';
      }
      if (!formData.bank.namaBank) {
        newErrors.namaBank = 'Nama bank wajib diisi';
      }
    }

    // Validasi PIC
    if (!formData.pic.nama) newErrors.picNama = 'Nama PIC wajib diisi';
    if (!formData.pic.email) {
      newErrors.picEmail = 'Email PIC wajib diisi';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.pic.email)) {
      newErrors.picEmail = 'Email tidak valid';
    }

    // ✅ Validasi Password PIC
    if (!formData.pic.password) {
      newErrors.picPassword = 'Password wajib diisi';
    } else if (formData.pic.password.length < 8) {
      newErrors.picPassword = 'Password minimal 8 karakter';
    }

    // ✅ Validasi Konfirmasi Password
    if (formData.pic.password !== formData.pic.confirmPassword) {
      newErrors.picConfirmPassword = 'Password tidak cocok';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setApiError('');

    const token = localStorage.getItem('token');
    if (!token) {
      setApiError('Sesi habis. Silakan login ulang.');
      setIsSubmitting(false);
      return;
    }

    // ✅ Siapkan payload termasuk password PIC
    const payload = {
      nomor: formData.nomor,
      namaVendor: formData.nama,
      alias: formData.alias,
      npwp: formData.npwp,
      nik: formData.nik,
      alamat: formData.alamat,
      isBranch: formData.isBranch,
      website: formData.website,
      telepon: formData.telepon,
      pkp: formData.pkp,
      customer: formData.customer,
      vendor: formData.vendor,
      bankNomorRekening: formData.bank.nomorRekening,
      bankPemegangRekening: formData.bank.pemegangRekening,
      bankNamaBank: formData.bank.namaBank,
      bankCabang: formData.bank.cabang,
      picNama: formData.pic.nama,
      picEmail: formData.pic.email,
      picTelepon: formData.pic.telepon,
      picPassword: formData.pic.password, // ✅ Kirim password ke backend
      poinPrioritas1: Number(formData.poinPrioritas1) || 0,
      poinPrioritas2: Number(formData.poinPrioritas2) || 0,
    };

    const body = new FormData();
    Object.keys(payload).forEach(key => {
      if (payload[key] !== null && payload[key] !== undefined) {
        body.append(key, payload[key]);
      }
    });

    if (formData.skbFile) {
      body.append('skbFile', formData.skbFile);
    }

    // 🔍 Optional: Debug FormData (bisa dihapus di production)
    for (let [key, value] of body.entries()) {
      console.log(key, value);
    }
    const baseURL = import.meta.env.VITE_API_BASE_URL;
    try {
      const res = await fetch(`${baseURL}/api/vendors/create`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: body,
      });

      const result = await res.json();

      if (res.ok) {
        alert('Vendor dan Akun PIC berhasil ditambahkan!');
        handleReset();
        if (onCancel) onCancel();
      } else {
        setApiError(result.message || 'Gagal menambahkan vendor');
      }
    } catch (err) {
      setApiError('Kesalahan jaringan. Cek koneksi atau server.');
      console.error('Submit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      nomor: '',
      nama: '',
      alias: '',
      npwp: '',
      nik: '',
      alamat: '',
      isBranch: false,
      website: '',
      telepon: '',
      pkp: false,
      customer: false,
      vendor: false,
      skbFile: null,
      bank: {
        nomorRekening: '',
        pemegangRekening: '',
        namaBank: '',
        cabang: '',
      },
      pic: {
        nama: '',
        email: '',
        telepon: '',
        password: '',           // ✅ Reset password
        confirmPassword: '',    // ✅ Reset konfirmasi
      },
      poinPrioritas1: 0,
      poinPrioritas2: 0,
    });
    setErrors({});
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
          Tambah Mitra
        </h3>
        <p className="text-sm font-body text-muted-foreground">
          Lengkapi informasi mitra baru
        </p>
      </div>

      {apiError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded text-sm">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nomor */}
        <Input
          label="Nomor"
          type="text"
          placeholder="Masukkan nomor"
          required
          value={formData.nomor}
          onChange={(e) => handleChange('nomor', e.target.value)}
          error={errors.nomor}
        />

        {/* Nama */}
        <Input
          label="Nama"
          type="text"
          placeholder="Nama lengkap"
          required
          value={formData.nama}
          onChange={(e) => handleChange('nama', e.target.value)}
          error={errors.nama}
        />

        {/* Alias */}
        <Input
          label="Alias"
          type="text"
          placeholder="Nama panggilan"
          value={formData.alias}
          onChange={(e) => handleChange('alias', e.target.value)}
        />

        {/* NPWP */}
        <Input
          label="NPWP (Tanpa pemisah)"
          type="text"
          placeholder="123456789012345"
          value={formData.npwp}
          onChange={(e) => handleChange('npwp', e.target.value.replace(/\D/g, ''))}
          error={errors.npwp}
        />

        {/* NIK */}
        <Input
          label="NIK (Tanpa pemisah)"
          type="text"
          placeholder="1234567890123456"
          value={formData.nik}
          onChange={(e) => handleChange('nik', e.target.value.replace(/\D/g, ''))}
          error={errors.nik}
        />

        {/* Alamat */}
        <Input
          label="Alamat"
          type="textarea"
          placeholder="Alamat lengkap"
          rows={3}
          value={formData.alamat}
          onChange={(e) => handleChange('alamat', e.target.value)}
          error={errors.alamat}
        />

        {/* Cabang */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isBranch"
            checked={formData.isBranch}
            onChange={(e) => handleChange('isBranch', e.target.checked)}
            className="w-4 h-4 text-primary rounded focus:ring-primary"
          />
          <label htmlFor="isBranch" className="font-medium">
            Buat Sebagai Cabang
          </label>
        </div>

        {/* Website */}
        <Input
          label="Website"
          type="url"
          placeholder="https://contoh.com"
          value={formData.website}
          onChange={(e) => handleChange('website', e.target.value)}
          error={errors.website}
          disabled={!formData.isBranch}
        />

        {/* Telepon */}
        <Input
          label="Telepon"
          type="tel"
          placeholder="081234567890"
          value={formData.telepon}
          onChange={(e) => handleChange('telepon', e.target.value)}
        />

        {/* Roles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="pkp"
              checked={formData.pkp}
              onChange={(e) => handleChange('pkp', e.target.checked)}
              className="w-4 h-4 text-primary rounded focus:ring-primary"
            />
            <label htmlFor="pkp" className="font-medium">PKP</label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="customer"
              checked={formData.customer}
              onChange={(e) => handleChange('customer', e.target.checked)}
              className="w-4 h-4 text-primary rounded focus:ring-primary"
            />
            <label htmlFor="customer" className="font-medium">Customer</label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="vendor"
              checked={formData.vendor}
              onChange={(e) => handleChange('vendor', e.target.checked)}
              className="w-4 h-4 text-primary rounded focus:ring-primary"
            />
            <label htmlFor="vendor" className="font-medium">Vendor</label>
          </div>
        </div>

        {/* Berkas SKB */}
        <div>
          <label className="block mb-1 font-medium">Berkas SKB (Opsional)</label>
          <FileUpload
            onChange={(file) => handleChange('skbFile', file)}
            value={formData.skbFile}
            accept=".pdf,.doc,.docx"
          />
        </div>

        {/* Bank */}
        <div className="mt-6 pt-6 border-t border-border">
          <h4 className="font-medium text-foreground mb-4">Bank</h4>
          <Input
            label="Nomor Rekening"
            type="text"
            placeholder="1234567890"
            value={formData.bank.nomorRekening}
            onChange={(e) => handleNestedChange('bank', 'nomorRekening', e.target.value)}
            error={errors.nomorRekening}
          />
          <Input
            label="Pemegang Rekening"
            type="text"
            placeholder="Nama pemilik rekening"
            value={formData.bank.pemegangRekening}
            onChange={(e) => handleNestedChange('bank', 'pemegangRekening', e.target.value)}
            error={errors.pemegangRekening}
          />
          <Input
            label="Nama Bank"
            type="text"
            placeholder="Bank BCA"
            value={formData.bank.namaBank}
            onChange={(e) => handleNestedChange('bank', 'namaBank', e.target.value)}
            error={errors.namaBank}
          />
          <Input
            label="Cabang"
            type="text"
            placeholder="Cabang Jakarta"
            value={formData.bank.cabang}
            onChange={(e) => handleNestedChange('bank', 'cabang', e.target.value)}
          />
        </div>

        {/* PIC */}
        <div className="mt-6 pt-6 border-t border-border">
          <h4 className="font-medium text-foreground mb-4">PIC (Penanggung Jawab)</h4>
          <Input
            label="Nama"
            type="text"
            placeholder="Nama PIC"
            value={formData.pic.nama}
            onChange={(e) => handleNestedChange('pic', 'nama', e.target.value)}
            error={errors.picNama}
          />
          <Input
            label="Email"
            type="email"
            placeholder="pic@contoh.com"
            value={formData.pic.email}
            onChange={(e) => handleNestedChange('pic', 'email', e.target.value)}
            error={errors.picEmail}
          />
          <Input
            label="Telepon"
            type="tel"
            placeholder="081234567890"
            value={formData.pic.telepon}
            onChange={(e) => handleNestedChange('pic', 'telepon', e.target.value)}
          />

          {/* ✅ Input Password */}
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={formData.pic.password}
            onChange={(e) => handleNestedChange('pic', 'password', e.target.value)}
            error={errors.picPassword}
            description="Minimal 8 karakter"
          />

          {/* ✅ Input Konfirmasi Password */}
          <Input
            label="Konfirmasi Password"
            type="password"
            placeholder="••••••••"
            value={formData.pic.confirmPassword}
            onChange={(e) => handleNestedChange('pic', 'confirmPassword', e.target.value)}
            error={errors.picConfirmPassword}
          />
        </div>

        {/* Poin Prioritas */}
        <div className="mt-6 pt-6 border-t border-border">
          <Input
            label="Poin Prioritas 1"
            type="number"
            placeholder="0"
            value={formData.poinPrioritas1}
            onChange={(e) => handleChange('poinPrioritas1', e.target.value)}
            description="Digunakan untuk menghitung prioritas setelah periode ditutup. 0 untuk normal."
          />
          <Input
            label="Poin Prioritas 2"
            type="number"
            placeholder="0"
            value={formData.poinPrioritas2}
            onChange={(e) => handleChange('poinPrioritas2', e.target.value)}
            description="Digunakan untuk menghitung prioritas sebelum periode ditutup. 0 untuk normal."
          />
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-border flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            BATAL
          </Button>
          <Button type="submit" variant="default" loading={isSubmitting}>
            {isSubmitting ? 'Menyimpan...' : 'SIMPAN'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default VendorForm;