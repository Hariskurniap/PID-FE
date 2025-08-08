import React, { useEffect, useState } from 'react';
import AsyncSelect from 'react-select/async';
import Button from 'components/ui/Button';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Navigate } from 'react-router-dom';

const PenggunaFormModal = ({ open, onClose, onSubmit, editData }) => {
    const [form, setForm] = useState({
        nama: '',
        email: '',
        password: '',
        role: 'staff',
        vendorId: '',
        status: 'aktif',
        alamat: '',
    });

    const [vendors, setVendors] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState('');

    useEffect(() => {
        if (editData) setForm(editData);
        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/vendors`)
            .then((res) => res.json())
            .then(setVendors);
    }, [editData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));

        if (name === 'password') {
            const strength = value.length >= 8 ? (/[A-Z]/.test(value) && /\d/.test(value) ? 'Kuat' : 'Sedang') : 'Lemah';
            setPasswordStrength(strength);
        }
    };

    const loadNameOptions = async (inputValue) => {
        if (!inputValue || inputValue.length < 2 || form.role === 'vendor') return [];

        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/api/pengguna/getuseridaman?search=${encodeURIComponent(inputValue)}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                }
            );
            const result = await res.json();
            const values = result?.value || [];

            return values.map((item) => ({
                label: item.displayName,
                value: item.displayName,
                email: item.email,
                alamat: item.alamat,
            }));
        } catch (err) {
            console.error('Error fetching name suggestions:', err);
            return [];
        }
    };

    const handleNameSelect = (option) => {
        setForm((prev) => ({
            ...prev,
            nama: option?.value || '',
            email: option?.email || '',
            alamat: option?.alamat || '',
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const method = editData ? 'PUT' : 'POST';
        const url = editData
            ? `${import.meta.env.VITE_API_BASE_URL}/api/pengguna/${editData.id}`
            : `${import.meta.env.VITE_API_BASE_URL}/api/pengguna`;

        const payload = {
            ...form,
            status: form.status === 'aktif' ? 1 : 0, // ubah ke boolean
        };

        const res = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(payload),
        });

        const data = await res.json();
        
        if (!res.ok) {
            console.error('Error:', data.message || data);
            alert(data.message || 'Gagal menyimpan data');
            return;
        }
        alert("Berhasil menyimpan!");  // <-- alert berhasil disini

    onSubmit(data);  // kirim data ke parent supaya parent bisa update state / redirect
    };

    return open ? (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow w-full max-w-md">
                <h2 className="text-lg font-semibold mb-4">
                    {editData ? 'Edit Pengguna' : 'Tambah Pengguna'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-3">
                    {/* Role */}
                    <select
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    >
                        <option value="staff">Staff</option>
                        <option value="vendor">Vendor</option>
                        <option value="administrator">Administrator</option>
                        <option value="pic">PIC</option>
                    </select>

                    {/* Nama */}
                    {form.role === 'vendor' ? (
                        <input
                            className="w-full p-2 border rounded"
                            name="nama"
                            placeholder="Nama"
                            value={form.nama}
                            onChange={handleChange}
                            required
                        />
                    ) : (
                        <AsyncSelect
                            cacheOptions
                            loadOptions={loadNameOptions}
                            defaultOptions
                            onChange={handleNameSelect}
                            value={form.nama ? { label: form.nama, value: form.nama } : null}
                            placeholder="Cari Nama"
                        />
                    )}

                    {/* Email */}
                    <input
                        className={`w-full p-2 border rounded ${form.role !== 'vendor' ? 'bg-gray-100' : ''}`}
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        readOnly={form.role !== 'vendor'}
                        required
                    />

                    {/* Password */}
                    {!editData && (
                        <div className="relative">
                            <input
                                className="w-full p-2 border rounded pr-10"
                                name="password"
                                placeholder="Password"
                                type={showPassword ? 'text' : 'password'}
                                value={form.password}
                                onChange={handleChange}
                                required
                            />
                            <span
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                            <small className="block text-sm text-gray-500 mt-1">
                                Kekuatan: {passwordStrength}
                            </small>
                        </div>
                    )}

                    {/* Vendor Selector */}
                    {form.role === 'vendor' && (
                        <select
                            name="vendorId"
                            value={form.vendorId}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        >
                            <option value="">Pilih Vendor</option>
                            {vendors.map((v) => (
                                <option key={v.id} value={v.id}>
                                    {v.namaVendor}
                                </option>
                            ))}
                        </select>
                    )}

                    {/* Alamat (non-vendor only) */}
                    {form.role !== 'vendor' && (
                        <input
                            className="w-full p-2 border rounded"
                            name="alamat"
                            placeholder="Alamat"
                            value={form.alamat}
                            onChange={handleChange}
                        />
                    )}

                    {/* Status for edit mode */}
                    {editData && (
                        <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        >
                            <option value="aktif">Aktif</option>
                            <option value="tidak aktif">Tidak Aktif</option>
                        </select>
                    )}

                    {/* Buttons */}
                    <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Batal
                        </Button>
                        <Button type="submit">Simpan</Button>
                    </div>
                </form>
            </div>
        </div>
    ) : null;
};

export default PenggunaFormModal;
