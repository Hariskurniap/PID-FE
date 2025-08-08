// src/pages/pengguna/index.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from 'components/ui/Header';
import SessionTimeoutHandler from 'components/ui/SessionTimeoutHandler';
import Button from 'components/ui/Button';
import PenggunaTable from './components/PenggunaTable';
import PenggunaFormModal from './components/PenggunaFormModal';

const Pengguna = () => {
  const navigate = useNavigate();

  // Ambil userRole dan userName dari localStorage (sesuai logikamu)
  const [userRole, setUserRole] = useState('');
  const [userName, setUserName] = useState('');

  // State data users
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal form state
  const [openForm, setOpenForm] = useState(false);
  const [editData, setEditData] = useState(null);

  // Fetch users dari backend API
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/pengguna/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Jika butuh otentikasi:
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
      if (!res.ok) throw new Error('Gagal memuat data pengguna');
      const data = await res.json();
      console.log('data',data);
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Ambil dari localStorage
    setUserRole(localStorage.getItem('userRole') || '');
    setUserName(localStorage.getItem('userName') || '');

    fetchUsers();
  }, []);

  // Handler untuk buka form tambah atau edit
  const handleAdd = () => {
    setEditData(null);
    setOpenForm(true);
  };
  const handleEdit = (user) => {
    setEditData(user);
    setOpenForm(true);
  };

  const handleFormSubmit = (savedUser) => {
    if (editData) {
      setUsers(users.map(u => u.id === savedUser.id ? savedUser : u));
    } else {
      setUsers([...users, savedUser]);
    }
    setOpenForm(false);
    setEditData(null);

    window.location.reload(); // <-- redirect setelah berhasil simpan
  };

  // Handler delete (ubah status menjadi tidak aktif)
  const handleDelete = async (id) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/pengguna/delete/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (!res.ok) throw new Error('Gagal menghapus pengguna');

    alert('Pengguna berhasil dihapus');
    window.location.reload(); // reload halaman agar data terbaru muncul
  } catch (err) {
    alert(err.message);
  }
};


  // Session timeout handler
  const handleSessionTimeout = () => {
    localStorage.clear();
    navigate('/vendor-login'); // sesuaikan halaman login mu
  };

  // Session extend stub
  const handleSessionExtend = async () => {
    await new Promise(r => setTimeout(r, 1000));
    return true;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header userRole={userRole} userName={userName} />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin mb-4">🔄</div>
            <h3 className="text-lg font-semibold mb-2">Memuat data pengguna...</h3>
            <p className="text-sm text-gray-500">Mohon tunggu sebentar</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header userRole={userRole} userName={userName} />

      <SessionTimeoutHandler
        isActive={true}
        onTimeout={handleSessionTimeout}
        onExtend={handleSessionExtend}
      />

      <main className="pt-16 container mx-auto px-4 py-8">
        <div className="mb-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Manajemen Pengguna</h1>
          <Button onClick={handleAdd}>Tambah Pengguna</Button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
            Error: {error}
          </div>
        )}

        <PenggunaTable
          users={users}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {openForm && (
          <PenggunaFormModal
            open={openForm}
            onClose={() => { setOpenForm(false); setEditData(null); }}
            onSubmit={handleFormSubmit}
            editData={editData}
          />
        )}
      </main>
    </div>
  );
};

export default Pengguna;
