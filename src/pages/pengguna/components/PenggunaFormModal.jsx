import React, { useEffect, useState } from 'react';
import AsyncSelect from 'react-select/async';
import Button from 'components/ui/Button';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

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
        const fetchVendors = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return console.error('Token tidak ditemukan');

                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/vendors`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const data = await res.json();
                setVendors(data);
            } catch (err) {
                console.error('Gagal memuat data vendor:', err);
            }
        };

        if (editData) setForm(editData);
        fetchVendors();
    }, [editData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));

        if (name === 'password') {
            const strength = value.length >= 8
                ? (/[A-Z]/.test(value) && /\d/.test(value) ? 'Kuat' : 'Sedang')
                : 'Lemah';
            setPasswordStrength(strength);
        }
    };

    const loadNameOptions = async (inputValue) => {
        if (!inputValue || inputValue.length < 2) return [];

        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/api/pengguna/getuseridaman?search=${encodeURIComponent(inputValue)}`,
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            const result = await res.json();
            return (result?.value || []).map((item) => ({
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
        if (!option) return;
        setForm((prev) => ({
            ...prev,
            nama: option.value,
            email: option.email,
            alamat: option.alamat,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = editData ? 'PUT' : 'POST';
        const url = editData
            ? `${import.meta.env.VITE_API_BASE_URL}/api/pengguna/${editData.id}`
            : `${import.meta.env.VITE_API_BASE_URL}/api/pengguna`;

        const payload = { ...form, status: form.status === 'aktif' ? 1 : 0 };
        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Gagal menyimpan data');
            alert('Berhasil menyimpan!');
            onSubmit(data);
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    };

    return open ? (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow w-full max-w-md">
                <h2 className="text-lg font-semibold mb-4">{editData ? 'Edit Pengguna' : 'Tambah Pengguna'}</h2>
                <form onSubmit={handleSubmit} className="space-y-3">
                    {/* Role */}
                    <select name="role" value={form.role} onChange={handleChange} className="w-full p-2 border rounded">
                        <option value="staff">Staff</option>
                        <option value="vendor">Vendor</option>
                        <option value="administrator">Administrator</option>
                        <option value="pic">PIC</option>
                        <option value="reviewer">Reviewer</option>
                        <option value="approval">Approval</option>
                        <option value="vendorreview">Vendor Review</option>
                    </select>

                    {/* Nama */}
                    {/* {form.role === 'vendor' ? (
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
                            placeholder="Cari Nama (opsional)"
                            isClearable
                        />
                    )} */}

                    {/* Email */}

                    <input
                        className="w-full p-2 border rounded"
                        name="nama"
                        placeholder="Nama"
                        value={form.nama}
                        onChange={handleChange}
                        required
                    />
                    <input
                        className="w-full p-2 border rounded"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
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
                            <small className="block text-sm text-gray-500 mt-1">Kekuatan: {passwordStrength}</small>
                        </div>
                    )}

                    {/* Vendor Selector */}
                    {(form.role === 'vendor' || form.role === 'vendorreview' ) && (
                        <select name="vendorId" value={form.vendorId} onChange={handleChange} className="w-full p-2 border rounded">
                            <option value="">Pilih Vendor</option>
                            {vendors.map((v) => (
                                <option key={v.id} value={v.id}>
                                    {v.namaVendor}
                                </option>
                            ))}
                        </select>
                    )}

                    {/* Alamat */}
                    <input
                        className="w-full p-2 border rounded"
                        name="alamat"
                        placeholder="Alamat"
                        value={form.alamat}
                        onChange={handleChange}
                    />

                    {/* Status for edit mode */}
                    {editData && (
                        <select name="status" value={form.status} onChange={handleChange} className="w-full p-2 border rounded">
                            <option value="aktif">Aktif</option>
                            <option value="tidak aktif">Tidak Aktif</option>
                        </select>
                    )}

                    {/* Buttons */}
                    <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={onClose}>Batal</Button>
                        <Button type="submit">Simpan</Button>
                    </div>
                </form>
            </div>
        </div>
    ) : null;
};

export default PenggunaFormModal;
