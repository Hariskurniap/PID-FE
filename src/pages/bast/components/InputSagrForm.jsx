import React, { useState, useEffect } from "react";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import {
  DownloadIcon,
  FileIcon,
  Upload,
  CheckCircle,
  XCircle,
} from "lucide-react";

const InputSagrForm = () => {
  const [bastData, setBastData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    nomorSagr: "",
    file: null,
  });

  const [modal, setModal] = useState({
    show: false,
    type: "",
    title: "",
    message: "",
  });

  const urlParams = new URLSearchParams(window.location.search);
  const idBast = urlParams.get("id");

  const statusLabels = {
    DRAFT: "Draft",
    WAITING_REVIEW: "Menunggu Review",
    DIPERIKSA_USER: "Diperiksa User",
    REJECTED: "Ditolak",
    APPROVED: "Disetujui",
  };

  useEffect(() => {
    if (!idBast) {
      setError("ID BAST tidak ditemukan di URL");
      setLoading(false);
      return;
    }

    const fetchBastData = async () => {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/bast/${idBast}`,
          { headers }
        );
        if (!res.ok) throw new Error("Data BAST tidak ditemukan");
        const data = await res.json();
        setBastData(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBastData();
  }, [idBast]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const FileLink = ({ path, filename }) => {
    const baseURL = import.meta.env.VITE_API_BASE_URL;
    if (!path) return <span className="text-muted-foreground">-</span>;
    const fullPath = path.startsWith("http")
      ? path
      : `${baseURL}/${path.replace(/\\/g, "/")}`;
    return (
      <div className="flex items-center gap-2">
        <FileIcon size={16} className="text-blue-500" />
        <a
          href={fullPath}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline text-sm"
          title={filename || "Lihat dokumen"}
        >
          {filename || "Lihat Dokumen"}
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nomorSagr || !formData.file) {
      setModal({
        show: true,
        type: "error",
        title: "Gagal",
        message: "Nomor SA, Nomor GR, dan file SA/GR wajib diisi.",
      });
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const userEmail = localStorage.getItem("userName"); // atau dari state/login Anda

      // 👇 Ganti nama variabel supaya tidak bentrok dengan state formData
      const payload = new FormData();
      payload.append("nomorSagr", formData.nomorSagr);
      payload.append("file", formData.file);
      payload.append("userEmail", userEmail);

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/bast/${idBast}/input_sa_gr`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            // ❌ JANGAN SET Content-Type — FormData akan otomatis set multipart boundary
          },
          body: payload,
        }
      );

      if (!res.ok) throw new Error("Gagal menyimpan SA/GR");

      setModal({
        show: true,
        type: "success",
        title: "Berhasil",
        message: "Nomor SA/GR berhasil disimpan.",
      });

      setTimeout(() => {
        window.location.href = "/internal-staff-dashboard";
      }, 3000);
    } catch (err) {
      console.error(err);
      setModal({
        show: true,
        type: "error",
        title: "Gagal",
        message: err.message,
      });
    } finally {
      setSubmitting(false);
    }
  };

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

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-8">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Input SA/GR</h3>
        <p className="text-sm text-muted-foreground">
          ID: <strong>{bastData.idBast}</strong>
        </p>
        <div className="mt-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              bastData.status === "DRAFT"
                ? "bg-gray-100 text-gray-800"
                : bastData.status === "WAITING_REVIEW"
                ? "bg-yellow-100 text-yellow-800"
                : bastData.status === "DIPERIKSA_USER"
                ? "bg-blue-100 text-blue-800"
                : bastData.status === "APPROVED"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {statusLabels[bastData.status] || bastData.status}
          </span>
        </div>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Informasi Umum */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="ID BAST" value={bastData.idBast} readOnly />
          <Input
            label="Status"
            value={statusLabels[bastData.status] || bastData.status}
            readOnly
          />
          <Input label="Nomor PO" value={bastData.nomorPo || ""} readOnly />
          <Input label="Perihal" value={bastData.perihal || ""} readOnly />
          <Input
            label="Nomor Kontrak"
            value={bastData.nomorKontrak || ""}
            readOnly
          />
          <Input
            label="Reviewer BAST"
            value={bastData.reviewerBast || ""}
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
            value={bastData.vendor?.namaVendor || "-"}
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
                checked={bastData.kesesuaianJumlahSpesifikasi === "Sesuai"}
                className="mr-2"
                readOnly
                disabled
              />
              Sesuai
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                checked={
                  bastData.kesesuaianJumlahSpesifikasi === "Tidak Sesuai"
                }
                disabled
                readOnly
                className="mr-2 appearance-none h-4 w-4 rounded-full border border-gray-400 bg-gray-100 checked:bg-gray-400 checked:border-gray-400"
              />
              Tidak Sesuai
            </label>
          </div>
          {bastData.kesesuaianJumlahSpesifikasi === "Tidak Sesuai" && (
            <div className="mt-4 space-y-4">
              <Input
                label="Alasan Ketidaksesuaian"
                value={bastData.alasanKeterlambatan || ""}
                readOnly
              />
              <Input
                label="Denda Keterlambatan (IDR)"
                value={bastData.idrDendaKeterlambatan || ""}
                readOnly
              />
            </div>
          )}
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
                      <td className="border px-3 py-2 text-right">
                        {item.nilaiTagihan}
                      </td>
                      <td className="border px-3 py-2">{item.keterangan}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="border px-3 py-2 text-center text-muted-foreground"
                    >
                      Tidak ada item
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* 🧮 Bagian Total */}
          <div className="mt-4 text-right font-medium bg-gray-50 p-3 rounded-lg">
            {(() => {
              // Hitung total nilai tagihan dari semua item
              const totalAwal = bastData.detailTransaksi?.reduce(
                (sum, item) => {
                  const clean = parseInt(
                    (item.nilaiTagihan || "0").toString().replace(/[^\d]/g, ""),
                    10
                  );
                  return sum + (isNaN(clean) ? 0 : clean);
                },
                0
              );

              // Ambil denda (jika ada)
              const denda =
                bastData.kesesuaianJumlahSpesifikasi === "Tidak Sesuai"
                  ? parseInt(
                      (bastData.idrDendaKeterlambatan || "0")
                        .toString()
                        .replace(/[^\d]/g, ""),
                      10
                    ) || 0
                  : 0;

              // Hitung total akhir
              const totalAkhir = totalAwal - denda;

              // Fungsi format rupiah
              const formatCurrency = (num) =>
                new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(num || 0);

              return (
                <>
                  <div>
                    Total Awal:{" "}
                    <span className="text-blue-600">
                      {formatCurrency(totalAwal)}
                    </span>
                  </div>

                  {bastData.kesesuaianJumlahSpesifikasi === "Tidak Sesuai" &&
                    denda > 0 && (
                      <div className="text-red-600 mt-1">
                        (-) Denda: {formatCurrency(denda)}
                      </div>
                    )}

                  <div className="mt-1">
                    Total Akhir:{" "}
                    <span className="text-green-600 font-semibold">
                      {formatCurrency(totalAkhir)}
                    </span>
                  </div>
                </>
              );
            })()}
          </div>
        </div>

        {/* Dokumen Pendukung */}
        <div>
          <h4 className="font-medium mb-4">Dokumen Pendukung</h4>
          {bastData.dokumenPendukung?.length > 0 ? (
            <div className="space-y-3">
              {bastData.dokumenPendukung.map((doc, idx) => (
                <div
                  key={doc.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 border rounded bg-gray-50"
                >
                  <div className="flex-1">
                    <strong>{doc.nama || `Dokumen ${idx + 1}`}</strong>
                  </div>
                  <div className="flex-1">
                    <FileLink
                      path={doc.filePath}
                      filename={doc.filePath?.split("/").pop() || "file.pdf"}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">
              Tidak ada dokumen pendukung.
            </p>
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
                value={bastData.fakturPajak.nomorFaktur || ""}
                readOnly
              />
              <Input
                label="Tanggal Faktur"
                value={formatDate(bastData.fakturPajak.tanggalFaktur)}
                readOnly
              />
              <Input
                label="Jumlah OPP"
                value={bastData.fakturPajak.jumlahOpp || ""}
                readOnly
              />
              <Input
                label="Jumlah PPn"
                value={bastData.fakturPajak.jumlahPpn || ""}
                readOnly
              />
              <Input
                label="Jumlah PPnBM"
                value={bastData.fakturPajak.jumlahPpnBm || ""}
                readOnly
              />
              <Input
                label="NPWP Penjual"
                value={bastData.fakturPajak.npwpPenjual || ""}
                readOnly
              />
              <Input
                label="Nama Penjual"
                value={bastData.fakturPajak.namaPenjual || ""}
                readOnly
              />
              <Input
                label="Alamat Penjual"
                value={bastData.fakturPajak.alamatPenjual || ""}
                readOnly
              />
              <Input
                label="NPWP Lawan Transaksi"
                value={bastData.fakturPajak.npwpLawanTransaksi || ""}
                readOnly
              />
              <Input
                label="Nama Lawan Transaksi"
                value={bastData.fakturPajak.namaLawanTransaksi || ""}
                readOnly
              />
              <Input
                label="Alamat Lawan Transaksi"
                value={bastData.fakturPajak.alamatLawanTransaksi || ""}
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

        {/* Input SA/GR */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Nomor SA/GR"
            placeholder="Masukkan Nomor SA/GR"
            value={formData.nomorSagr}
            onChange={(e) =>
              setFormData({ ...formData, nomorSagr: e.target.value })
            }
          />
        </div>

        {/* Upload Dokumen SA/GR */}
        <div>
          <label className="block mb-1 font-medium text-foreground">
            Unggah Dokumen SA/GR
          </label>
          <input
            type="file"
            className="block w-full border rounded px-3 py-2 text-sm"
            onChange={(e) =>
              setFormData({ ...formData, file: e.target.files[0] })
            }
          />
          {formData.file && (
            <p className="text-sm text-muted-foreground mt-1">
              📎 {formData.file.name}
            </p>
          )}
        </div>

        {/* Aksi */}
        <div className="pt-6 border-t flex justify-end gap-3">
          <Button type="submit" disabled={submitting}>
            <Upload size={16} className="mr-2" />
            {submitting ? "Menyimpan..." : "Simpan SA/GR"}
          </Button>
        </div>
      </form>

      {/* Modal */}
      {modal.show && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 text-center">
            {modal.type === "success" ? (
              <CheckCircle size={48} className="text-green-500 mx-auto mb-3" />
            ) : (
              <XCircle size={48} className="text-red-500 mx-auto mb-3" />
            )}
            <h3
              className={`text-xl font-semibold mb-2 ${
                modal.type === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {modal.title}
            </h3>
            <p className="text-gray-700 mb-4">{modal.message}</p>
            <Button onClick={() => setModal({ ...modal, show: false })}>
              Tutup
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InputSagrForm;
