import React, { useEffect, useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import Select from 'react-select';

const statusOptions = [
  { value: 'approved', label: 'Diterima' },
  { value: 'rejected', label: 'Ditolak' },
  { value: 'paid', label: 'Terbayar' },
];

const InvoiceReviewForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [invoice, setInvoice] = useState(null);
  const [status, setStatus] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [userRole, setUserRole] = useState('');
  const [selectedPIC, setSelectedPIC] = useState('');
  const [picOptions, setPicOptions] = useState([]);

  useEffect(() => {
    const roleFromStorage = localStorage.getItem('userRole');
    const roleFromUrl = searchParams.get('role');
    setUserRole(roleFromStorage || roleFromUrl || '');
  }, [searchParams]);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/invoice/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Gagal mengambil invoice');
        const data = await res.json();
        setInvoice(data);
        setStatus(data.status || '');
      } catch (err) {
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id]);

  useEffect(() => {
    if (userRole === 'administrator') {
      const fetchPICOptions = async () => {
        try {
          const token = localStorage.getItem('token');
          const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/pengguna/pic`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) throw new Error('Gagal mengambil data PIC');
          const data = await res.json();

          const options = data.map(user => ({
            value: user.email,
            label: user.nama,
          }));

          setPicOptions(options);
        } catch (error) {
          console.error(error);
        }
      };

      fetchPICOptions();
    }
  }, [userRole]);

  const handleDownload = (filename) => {
    const token = localStorage.getItem('token');
    const url = `${import.meta.env.VITE_API_BASE_URL}/api/invoice/download/${filename}`;
    fetch(url, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error('Gagal mengunduh file');
        return res.blob();
      })
      .then(blob => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch(err => console.error('Download error:', err));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!note.trim()) {
      alert('Catatan wajib diisi.');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');

      let body = { status, note };
      if (userRole === 'administrator') {
        body.pic = selectedPIC;
      }

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/invoice/${id}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Gagal memperbarui status');

      alert('Status berhasil diperbarui');
      navigate('/internal-pic-dashboard');
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Memuat data...</p>;
  if (!invoice) return <p>Invoice tidak ditemukan.</p>;

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
          Informasi Invoice
        </h3>
        <p className="text-sm font-body text-muted-foreground">
          Detail invoice yang akan ditinjau
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input label="Vendor" value={invoice.vendor?.namaVendor} readOnly />
        <Input label="Nomor Invoice" value={invoice.nomorInvoice} readOnly />
        <Input label="Jenis Invoice" value={invoice.tipeInvoice?.tipeInvoice} readOnly />
        <Input label="Tanggal Invoice" value={invoice.tanggalInvoice} readOnly />
        <Input
          label="Jumlah Tagihan"
          value={`Rp ${parseInt(invoice.jumlahTagihan).toLocaleString('id-ID')}`}
          readOnly
        />
        <Input label="Jatuh Tempo" value={invoice.tanggalJatuhTempo} readOnly />
        <Input label="Keterangan" value={invoice.keterangan || '-'} readOnly />

        {invoice.dokumen && (
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Dokumen Invoice</label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              iconName="Download"
              onClick={() => handleDownload(invoice.dokumen)}
            >
              Unduh File Invoice
            </Button>
          </div>
        )}

        {userRole === 'pic' && (
          <Select
            label="Tinjau Status"
            value={statusOptions.find(opt => opt.value === status)}
            options={statusOptions}
            onChange={(opt) => setStatus(opt.value)}
            required
            placeholder="Pilih status review"
          />
        )}

        {/* Catatan wajib */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Catatan</label>
          <textarea
            className="w-full border border-border rounded-lg p-2"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            required
            placeholder="Tulis catatan review"
          />
        </div>

        <Button
          type="submit"
          variant="default"
          loading={submitting}
          iconName="CheckCircle"
          iconPosition="left"
        >
          {submitting ? 'Menyimpan...' : 'Simpan Review'}
        </Button>
      </form>
    </div>
  );
};

export default InvoiceReviewForm;
