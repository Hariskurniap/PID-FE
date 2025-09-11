// Bast/components/DetailBastForm.jsx
import React, { useState, useEffect } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { DownloadIcon, FileIcon, ExternalLinkIcon } from 'lucide-react';

const DetailBastForm = () => {
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
    const baseURL = import.meta.env.VITE_API_BASE_URL;
    if (!path) return <span className="text-muted-foreground">-</span>;
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
        <h3 className="text-lg font-semibold text-foreground">Detail BAST</h3>
        <p className="text-sm text-muted-foreground">Status: </p>
        <div className="mt-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${bastData.status === 'DRAFT' ? 'bg-gray-100 text-gray-800' :
              bastData.status === 'WAITING_REVIEW' ? 'bg-yellow-100 text-yellow-800' :
                bastData.status === 'DIPERIKSA_USER' ? 'bg-blue-100 text-blue-800' :
                  bastData.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
            }`}>
            {(statusLabels[bastData.status] || bastData.status).replace(/_/g, ' ')}
          </span>
        </div>
      </div>

      <form className="space-y-6">
        {/* Informasi Umum */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="ID BAST"
            value={bastData.idBast}
            readOnly
          />
          {/* <Input
            label="Status"
            value={(statusLabels[bastData.status] || bastData.status).replace(/_/g, ' ')}
            readOnly
          /> */}
          {/* <Select
            label="Status"
            value={bastData.status}
            options={Object.entries(statusLabels).map(([value, label]) => ({
              value, label
            }))}
            readOnly
          /> */}
          <Input
            label="Nomor BAST"
            value={bastData.nomorBast || '-'}
            readOnly
          />
          <Input
            label="Nomor PO"
            value={bastData.nomorPo || ''}
            readOnly
          />
          <Input
            label="Perihal"
            value={bastData.perihal || ''}
            readOnly
          />
          <Input
            label="Nomor Kontrak"
            value={bastData.nomorKontrak || ''}
            readOnly
          />
          <Input
            label="Reviewer BAST"
            value={bastData.reviewerBast || ''}
            readOnly
          />
          <Input
            label="Tanggal Mulai Kontrak"
            type="text"
            value={formatDate(bastData.tanggalMulaiKontrak)}
            readOnly
          />
          <Input
            label="Tanggal Akhir Kontrak"
            type="text"
            value={formatDate(bastData.tanggalAkhirKontrak)}
            readOnly
          />
          <Input
            label="Tanggal Penyerahan"
            type="text"
            value={formatDate(bastData.tanggalPenyerahanBarangJasa)}
            readOnly
          />
        </div>

        {/* Vendor */}
        <div>
          <h4 className="font-medium mb-4">Vendor</h4>
          <Input
            label="Nama Vendor"
            value={bastData.vendor?.namaVendor || '-'}
            readOnly
          />
        </div>

        {/* Kesesuaian */}
        <div>
          <h4 className="font-medium mb-4">Kesesuaian Jumlah & Spesifikasi</h4>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                checked={bastData.kesesuaianJumlahSpesifikasi === 'Sesuai'}
                className="mr-2"
                readOnly
                disabled
              />
              Sesuai
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                checked={bastData.kesesuaianJumlahSpesifikasi === 'Tidak Sesuai'}
                className="mr-2"
                readOnly
                disabled
              />
              Tidak Sesuai
            </label>
          </div>
          {bastData.kesesuaianJumlahSpesifikasi === 'Tidak Sesuai' && (
            <div className="mt-4 space-y-4">
              <Input
                label="Alasan Ketidaksesuaian"
                value={bastData.alasanKetidaksesuaian || ''}
                readOnly
              />
              <Input
                label="Denda Keterlambatan (IDR)"
                value={bastData.idrDendaKeterlambatan || ''}
                readOnly
              />
            </div>
          )}
        </div>

{/* Dokumen BAST */}
        <div>
          <h4 className="font-medium mb-4">Dokumen Bast</h4>
          <FileLink
            path={bastData.fileBastUser}
            filename="Bast.pdf"
            label="Bast"
          />
        </div>

        {/* Copy Kontrak */}
        <div>
          <h4 className="font-medium mb-4">Copy Kontrak</h4>
          <FileLink
            path={bastData.copyKontrakPath}
            filename="Copy Kontrak.pdf"
            label="Copy Kontrak"
          />
        </div>

        {/* Items Pekerjaan */}
        <div>
          <h4 className="font-medium mb-4">Item Pekerjaan</h4>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border px-3 py-2 text-left">No</th>
                  <th className="border px-3 py-2 text-left">Pekerjaan</th>
                  <th className="border px-3 py-2 text-left">Progress (%)</th>
                  <th className="border px-3 py-2 text-left">Nilai Tagihan</th>
                  <th className="border px-3 py-2 text-left">Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {bastData.detailTransaksi?.length > 0 ? (
                  bastData.detailTransaksi.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-25">
                      <td className="border px-3 py-2">{item.no}</td>
                      <td className="border px-3 py-2">{item.pekerjaan}</td>
                      <td className="border px-3 py-2">{item.progress}%</td>
                      <td className="border px-3 py-2">{item.nilaiTagihan}</td>
                      <td className="border px-3 py-2">{item.keterangan}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="border px-3 py-2 text-center text-muted-foreground">
                      Tidak ada item
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dokumen Pendukung */}
        <div>
          <h4 className="font-medium mb-4">Dokumen Pendukung</h4>
          {bastData.dokumenPendukung?.length > 0 ? (
            <div className="space-y-3">
              {bastData.dokumenPendukung.map((doc, idx) => (
                <div key={doc.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 border rounded bg-gray-50">
                  <div className="flex-1">
                    <strong>{doc.nama || `Dokumen ${idx + 1}`}</strong>
                  </div>
                  <div className="flex-1">
                    <FileLink
                      path={doc.filePath}
                      filename={doc.filePath?.split('/').pop() || 'file.pdf'}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Tidak ada dokumen pendukung.</p>
          )}
        </div>

        {/* Faktur Pajak */}
        <div>
          <h4 className="font-medium mb-4">Faktur Pajak</h4>
          {bastData.fakturPajak ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Status Faktur"
                value={bastData.fakturPajak.statusFaktur}
                readOnly
              />
              <Input
                label="Nomor Faktur"
                value={bastData.fakturPajak.nomorFaktur || ''}
                readOnly
              />
              <Input
                label="Tanggal Faktur"
                value={formatDate(bastData.fakturPajak.tanggalFaktur)}
                readOnly
              />
              <Input
                label="Jumlah OPP"
                value={bastData.fakturPajak.jumlahOpp || ''}
                readOnly
              />
              <Input
                label="Jumlah PPn"
                value={bastData.fakturPajak.jumlahPpn || ''}
                readOnly
              />
              <Input
                label="Jumlah PPnBM"
                value={bastData.fakturPajak.jumlahPpnBm || ''}
                readOnly
              />
              <Input
                label="NPWP Penjual"
                value={bastData.fakturPajak.npwpPenjual || ''}
                readOnly
              />
              <Input
                label="Nama Penjual"
                value={bastData.fakturPajak.namaPenjual || ''}
                readOnly
              />
              <Input
                label="Alamat Penjual"
                value={bastData.fakturPajak.alamatPenjual || ''}
                readOnly
              />
              <Input
                label="NPWP Lawan Transaksi"
                value={bastData.fakturPajak.npwpLawanTransaksi || ''}
                readOnly
              />
              <Input
                label="Nama Lawan Transaksi"
                value={bastData.fakturPajak.namaLawanTransaksi || ''}
                readOnly
              />
              <Input
                label="Alamat Lawan Transaksi"
                value={bastData.fakturPajak.alamatLawanTransaksi || ''}
                readOnly
              />
              <div>
                <label className="block mb-1">Berkas Faktur</label>
                <FileLink
                  path={bastData.fakturPajak.berkasPath}
                  filename="Faktur Pajak.pdf"
                />
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">Belum ada faktur pajak.</p>
          )}
        </div>

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

export default DetailBastForm;