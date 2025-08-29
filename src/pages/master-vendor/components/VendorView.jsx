// pages/master-vendor/components/VendorView.jsx
import React from 'react';
import Button from '../../../components/ui/Button';

const VendorView = ({ vendor, onBack }) => {
  if (!vendor) return <div>Vendor tidak ditemukan</div>;

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-lg font-heading font-semibold text-foreground mb-2">Detail Mitra</h3>
        <p className="text-sm font-body text-muted-foreground">Informasi lengkap mitra (hanya untuk dilihat)</p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-muted-foreground">Nomor</label>
            <p className="text-foreground font-medium">{vendor.nomor}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground">Nama</label>
            <p className="text-foreground font-medium">{vendor.namaVendor}</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-muted-foreground">Alias</label>
          <p className="text-foreground">{vendor.alias || '-'}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-muted-foreground">NPWP</label>
            <p className="text-foreground">{vendor.npwp || '-'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground">NIK</label>
            <p className="text-foreground">{vendor.nik || '-'}</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-muted-foreground">Alamat</label>
          <p className="text-foreground whitespace-pre-line">{vendor.alamat || '-'}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-muted-foreground">Cabang</label>
            <p className="text-foreground">{vendor.isBranch ? 'Ya' : 'Tidak'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground">Website</label>
            <p className="text-foreground">
              {vendor.website ? <a href={vendor.website} target="_blank" className="text-primary">{vendor.website}</a> : '-'}
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-muted-foreground">Telepon</label>
          <p className="text-foreground">{vendor.telepon || '-'}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-muted-foreground">Peran</label>
          <div className="flex flex-wrap gap-2 mt-1">
            {vendor.pkp && <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">PKP</span>}
            {vendor.customer && <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Customer</span>}
            {vendor.vendor && <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Vendor</span>}
          </div>
        </div>

        {vendor.skbFileName && (
          <div>
            <label className="block text-sm font-medium text-muted-foreground">Berkas SKB</label>
            <a
              href={`${import.meta.env.VITE_API_BASE_URL}/api/vendors/file/skb/${vendor.skbFileName}`}
              target="_blank"
              className="text-primary hover:underline"
            >
              📄 {vendor.skbFileName}
            </a>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-border">
          <h4 className="font-medium text-foreground mb-4">Bank</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-muted-foreground">Nomor Rekening</label>
              <p className="text-foreground">{vendor.bankNomorRekening || '-'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground">Pemegang Rekening</label>
              <p className="text-foreground">{vendor.bankPemegangRekening || '-'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground">Nama Bank</label>
              <p className="text-foreground">{vendor.bankNamaBank || '-'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground">Cabang</label>
              <p className="text-foreground">{vendor.bankCabang || '-'}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <h4 className="font-medium text-foreground mb-4">PIC</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-muted-foreground">Nama</label>
              <p className="text-foreground">{vendor.picNama || '-'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground">Email</label>
              <p className="text-foreground">{vendor.picEmail || '-'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground">Telepon</label>
              <p className="text-foreground">{vendor.picTelepon || '-'}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-muted-foreground">Poin Prioritas 1</label>
              <p className="text-foreground">{vendor.poinPrioritas1 || 0}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground">Poin Prioritas 2</label>
              <p className="text-foreground">{vendor.poinPrioritas2 || 0}</p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-muted-foreground">Status</label>
          <span className={`px-2 py-1 text-xs rounded-full ${vendor.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {vendor.isActive ? 'Aktif' : 'Non-Aktif'}
          </span>
        </div>
      </div>

      <div className="pt-6 border-t border-border flex justify-end">
        <Button variant="outline" onClick={onBack}>Kembali</Button>
      </div>
    </div>
  );
};

export default VendorView;