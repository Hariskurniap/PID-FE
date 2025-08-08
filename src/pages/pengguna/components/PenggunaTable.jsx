// src/pages/Pengguna/components/PenggunaTable.jsx
import React from 'react';
import Button from 'components/ui/Button';

const PenggunaTable = ({ users, onEdit, onDelete }) => {
    return (
        <table className="w-full border text-sm">
            <thead>
                <tr className="bg-gray-100">
                    <th className="border p-2">Nama</th>
                    <th className="border p-2">Email</th>
                    <th className="border p-2">Role</th>
                    <th className="border p-2">Nama Vendor</th>
                    <th className="border p-2">Status</th>
                    <th className="border p-2">Aksi</th>
                </tr>
            </thead>
            <tbody>
                {users.map(user => (
                    <tr key={user.id}>
                        <td className="border p-2">{user.Pengguna?.nama || '-'}</td>
                        <td className="border p-2">{user.email}</td>
                        <td className="border p-2">{user.role}</td>
                        <td className="border p-2">
                            {user.role === 'vendor' ? (user.Vendor?.namaVendor || '-') : '-'}
                        </td>
                        <td className="border p-2">{user.status ? 'Aktif' : 'Tidak Aktif'}</td>
                        <td className="border p-2 space-x-2">
                            <Button size="sm" onClick={() => onEdit(user)}>Edit</Button>
                            <Button size="sm" variant="destructive" onClick={() => onDelete(user.id)}>Hapus</Button>
                        </td>
                    </tr>
                ))}
            </tbody>

        </table>
    );
};

export default PenggunaTable;