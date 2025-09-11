// Bast/components/TrackingBastForm.jsx
import React, { useState, useEffect } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { DownloadIcon, FileIcon, ExternalLinkIcon } from 'lucide-react';

const TrackingBastForm = () => {
  const [bastData, setBastData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ambil idBast dari URL
  const urlParams = new URLSearchParams(window.location.search);
  const idBast = urlParams.get('id');

  // Mapping status ke label lebih baik
  const statusLabels = {
    DRAFT: 'Draft',
    WAITING_REVIEW: 'Menunggu Review',
    DIPERIKSA_USER: 'Diperiksa User',
    REJECTED: 'Ditolak',
    APPROVED: 'Disetujui'
  };

  useEffect(() => {
    if (!idBast) {
      setError('ID BAST tidak ditemukan di URL');
      setLoading(false);
      return;
    }

    const fetchBastData = async () => {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/bast/${idBast}`, { headers });
        if (!res.ok) {
          throw new Error('Data BAST tidak ditemukan');
        }
        const data = await res.json();
        setBastData(data);
      } catch (err) {
        console.error('Gagal memuat data BAST:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBastData();
  }, [idBast]);

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        <p className="mt-2 text-muted-foreground">Memuat data BAST...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700">Gagal memuat data: {error}</p>
        <Button
          variant="outline"
          onClick={() => window.history.back()}
          className="mt-4"
        >
          Kembali
        </Button>
      </div>
    );
  }

  // Helper: Format tanggal
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  // Helper: Render file link
  const FileLink = ({ path, filename, label }) => {
    if (!path) return <span className="text-muted-foreground">-</span>;
    const baseURL = import.meta.env.VITE_API_BASE_URL;
    const fullPath = path.startsWith('http') ? path : `${baseURL}/${path.replace(/\\/g, '/')}`;
    return (
      <div className="flex items-center gap-2">
        <FileIcon size={16} className="text-blue-500" />
        <a
          href={fullPath}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline text-sm"
          title={filename || 'Lihat dokumen'}
        >
          {filename || 'Lihat Dokumen'}
        </a>
        <a
          href={fullPath}
          download
          className="text-gray-500 hover:text-gray-700"
          title="Download"
        >
          <DownloadIcon size={14} />
        </a>
      </div>
    );
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-8">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Tracking BAST</h3>
        
      </div>

      <form className="space-y-6">
        {/* Tracking Log */}
        <div>
          <h4 className="font-medium mb-4">Riwayat Status</h4>
          {bastData.tracking?.length > 0 ? (
            <div className="space-y-3">
              {bastData.tracking.map((log, idx) => (
                <div key={log.id} className="flex items-start gap-3 p-3 border rounded bg-gray-50 text-sm">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p>
                      <strong>{statusLabels[log.statusBaru] || log.statusBaru}</strong>
                      {log.statusSebelumnya && (
                        <> dari <em>{statusLabels[log.statusSebelumnya] || log.statusSebelumnya}</em></>
                      )}
                    </p>
                    <p className="text-muted-foreground">
                      Oleh: <strong>{log.userEmail}</strong> • {new Date(log.createdAt).toLocaleString('id-ID')}
                    </p>
                    {log.note && <p className="text-sm mt-1"><em>{log.note}</em></p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Belum ada riwayat.</p>
          )}
        </div>

        {/* Aksi */}
        <div className="pt-6 border-t">
          <Button
            variant="outline"
            onClick={() => window.history.back()}
          >
            Kembali
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TrackingBastForm;