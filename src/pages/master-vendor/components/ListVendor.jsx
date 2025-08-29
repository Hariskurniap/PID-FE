// pages/master-vendor/components/ListVendor.jsx
import React, { useState, useEffect } from 'react';
import Table from '../../../components/ui/Table';
import Button from '../../../components/ui/Button';

const ListVendor = ({ onAdd, onEdit, onView }) => {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Ambil token dari localStorage
    const token = localStorage.getItem('token');

    // Fetch data dari backend
    const fetchVendors = async () => {
        try {
            setLoading(true);
            setError('');

            const res = await fetch('http://localhost:5000/api/vendors', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error(`Gagal memuat data: ${res.status}`);
            }

            const data = await res.json();
            setVendors(data);
        } catch (err) {
            console.error('Error fetching vendors:', err);
            setError(err.message || 'Gagal terhubung ke server');
        } finally {
            setLoading(false);
        }
    };

    // Hapus vendor
    const handleDelete = async (id) => {
        if (!window.confirm('Yakin ingin menghapus vendor ini?')) return;

        try {
            const res = await fetch(`http://localhost:5000/api/vendors/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const result = await res.json();

            if (res.ok) {
                alert('Vendor berhasil dihapus');
                fetchVendors(); // Refresh list
            } else {
                alert(result.message || 'Gagal menghapus vendor');
            }
        } catch (err) {
            console.error('Delete error:', err);
            alert('Kesalahan jaringan');
        }
    };

    // Load data saat komponen mount
    useEffect(() => {
        if (token) {
            fetchVendors();
        } else {
            setError('Token tidak ditemukan. Silakan login ulang.');
            setLoading(false);
        }
    }, []);

    const columns = [
        { key: 'nomor', label: 'Nomor' },
        { key: 'nama', label: 'Nama' },
        { key: 'npwp', label: 'NPWP' },
        { key: 'status', label: 'Status' },
        { key: 'actions', label: 'Aksi' },
    ];

    const rows = vendors.map((vendor) => ({
        nomor: vendor.nomor,
        nama: vendor.namaVendor, // Sesuaikan dengan nama field di BE
        npwp: vendor.npwp || '-',
        status: vendor.isActive === true ? 'Aktif' : 'Non-Aktif',
        actions: (
            <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => onEdit(vendor)}>
                    Edit
                </Button>
                <Button size="sm" variant="secondary" onClick={() => onView(vendor)}>
                    Lihat
                </Button>
                <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(vendor.id)}
                >
                    Hapus
                </Button>
            </div>
        ),
    }));

    return (
        <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-heading font-semibold text-foreground">Daftar Mitra</h3>
                <Button onClick={onAdd}>Tambah Mitra</Button>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded text-sm">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                    <span className="ml-3 text-muted-foreground">Memuat data...</span>
                </div>
            ) : (
                <Table columns={columns} rows={rows} />
            )}
        </div>
    );
};

export default ListVendor;