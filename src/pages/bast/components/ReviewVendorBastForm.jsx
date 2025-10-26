// src/pages/bast/components/ReviewVendorBastForm.jsx
import React, { useState, useEffect } from "react";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import Textarea from "../../../components/ui/Textarea";
import { DownloadIcon, FileIcon, CheckCircle, XCircle } from "lucide-react";

const ReviewVendorBastForm = () => {
  const [bastData, setBastData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    pejabatApproval: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});
  const [approverStatus, setApproverStatus] = useState(null); // 'found', 'not-found', null

  // State untuk modal
  const [showApproverModal, setShowApproverModal] = useState(false);
  const [modalContent, setModalContent] = useState({
    title: "",
    message: "",
    type: "", // 'success', 'error'
  });

  // Ambil idBast dari URL
  const urlParams = new URLSearchParams(window.location.search);
  const idBast = urlParams.get("id");

  // Mapping status ke label
  const statusLabels = {
    DRAFT: "Draft",
    WAITING_REVIEW: "Menunggu Review",
    WAITING_APPROVER: "Menunggu Approver",
    WAITING_APPROVER: "Menunggu Approver",
    DISETUJUI_APPROVER: "Disetujui Approver",
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
        if (!res.ok) {
          throw new Error("Data BAST tidak ditemukan");
        }
        const data = await res.json();
        setBastData(data);
        // Set pejabatApproval jika sudah ada sebelumnya
        setFormData((prev) => ({
          ...prev,
          pejabatApproval: data.pejabatApproval || "",
        }));
      } catch (err) {
        console.error("Gagal memuat data BAST:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBastData();
  }, [idBast]);

  // Cek approver
  const handleCheckApprover = async () => {
    const email = formData.approverBastVendor;
    if (!email) {
      setErrors((prev) => ({
        ...prev,
        approverBastVendor: "Email harus diisi",
      }));
      return;
    }

    // Validasi format email
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors((prev) => ({
        ...prev,
        approverBastVendor: "Format email tidak valid",
      }));
      return;
    }

    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/${encodeURIComponent(
          email
        )}`,
        { headers }
      );
      const userData = await res.json();

      if (res.ok && userData && ["vendorreview"].includes(userData.role)) {
        setApproverStatus("found");
        setErrors((prev) => ({ ...prev, approverBastVendor: undefined }));
        // Tampilkan modal sukses
        setModalContent({
          title: "Approver Ditemukan",
          message: "Email approver valid dan ditemukan dalam sistem.",
          type: "success",
        });
        setShowApproverModal(true);
      } else {
        setApproverStatus("not-found");
        setErrors((prev) => ({
          ...prev,
          approverBastVendor: "Email tidak ditemukan atau bukan approver",
        }));
        // Tampilkan modal error
        setModalContent({
          title: "Approver Tidak Valid",
          message: "Email tidak ditemukan atau bukan merupakan approver.",
          type: "error",
        });
        setShowApproverModal(true);
      }
    } catch (err) {
      console.error("Gagal cek approver:", err);
      setErrors((prev) => ({
        ...prev,
        approverBastVendor: "Gagal memeriksa email",
      }));
      // Tampilkan modal error
      setModalContent({
        title: "Kesalahan Server",
        message: "Terjadi kesalahan saat memeriksa email approver.",
        type: "error",
      });
      setShowApproverModal(true);
    }
  };

  const validateForm = (isApproval = true) => {
    const newErrors = {};

    if (!formData.approverBastVendor) {
      newErrors.approverBastVendor = "Approval Vendor wajib diisi";
    } else if (!/\S+@\S+\.\S+/.test(formData.approverBastVendor)) {
      newErrors.approverBastVendor = "Format email tidak valid";
    } else if (approverStatus !== "found") {
      newErrors.approverBastVendor =
        "Harap cek validitas email approver terlebih dahulu";
    }

    // Untuk penolakan, catatan wajib diisi
    if (!isApproval && !formData.notes.trim()) {
      newErrors.notes = "Catatan penolakan wajib diisi";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleApprove = async () => {
    // if (!validateForm(true)) return;

    setSubmitting(true);
    const token = localStorage.getItem("token");
    const userEmail = localStorage.getItem("userName");

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/bast/${idBast}/approveVendorreview`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userEmail,
            note: formData.notes,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Gagal menyetujui BAST");
      }

      // Tampilkan modal sukses
      setModalContent({
        title: "BAST Disetujui",
        message: "BAST berhasil disetujui dan akan dialihkan ke dashboard.",
        type: "success",
      });
      setShowApproverModal(true);

      // Redirect setelah 3 detik
      setTimeout(() => {
        window.location.href = "/vendor-dashboard";
      }, 3000);
    } catch (err) {
      console.error(err);
      // Tampilkan modal error
      setModalContent({
        title: "Gagal Menyetujui",
        message: err.message,
        type: "error",
      });
      setShowApproverModal(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async () => {
    // if (!validateForm(false)) return;

    setSubmitting(true);
    const token = localStorage.getItem("token");
    const userEmail = localStorage.getItem("userName");

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/bast/${idBast}/rejectApprover`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userEmail,
            note: formData.notes,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Gagal menolak BAST");
      }

      // Tampilkan modal sukses
      setModalContent({
        title: "BAST Ditolak",
        message: "BAST berhasil ditolak dan akan dialihkan ke dashboard.",
        type: "success",
      });
      setShowApproverModal(true);

      // Redirect setelah 3 detik
      setTimeout(() => {
        window.location.href = "/vendor-dashboard";
      }, 3000);
    } catch (err) {
      console.error(err);
      // Tampilkan modal error
      setModalContent({
        title: "Gagal Menolak",
        message: err.message,
        type: "error",
      });
      setShowApproverModal(true);
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

  // Helper: Format tanggal
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  // Helper: Render file link
  const FileLink = ({ path, filename, label }) => {
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

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-8">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Approve BAST</h3>
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
                : bastData.status === "WAITING_APPROVER"
                ? "bg-blue-100 text-blue-800"
                : bastData.status === "APPROVED"
                ? "bg-green-100 text-green-800"
                : bastData.status === "DISETUJUI_APPROVER"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {statusLabels[bastData.status] || bastData.status}
          </span>
        </div>
      </div>

      <form className="space-y-6">
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
          <Input
            label="Reviewer BAST"
            value={bastData.reviewerBast || ""}
            readOnly
          />
          <Input
            label="Approver BAST"
            type="text"
            value={bastData.pejabatApproval}
            readOnly
          />
        </div>

        {/* Approver Vendor BAST
        <div className="flex flex-col gap-1">
          <label className="block font-medium">Approver Vendor BAST *</label>
          <div className="flex gap-2">
            <input
              type="email"
              value={formData.approverBastVendor}
              onChange={(e) => {
                setFormData({ ...formData, approverBastVendor: e.target.value });
                // Reset status dan error saat input berubah
                setApproverStatus(null);
                setErrors(prev => ({ ...prev, approverBastVendor: undefined }));
              }}
              className={`flex-1 border rounded px-3 py-2 ${errors.approverBastVendor ? 'border-red-500' : ''}`}
              placeholder="masukan@email.com"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCheckApprover}
              className="h-10 whitespace-nowrap"
            >
              Cek
            </Button>
          </div>
          {errors.pejabatApproval && <p className="text-sm text-red-500 mt-1">{errors.pejabatApproval}</p>}
          {approverStatus === 'found' && (
            <p className="text-sm text-green-600 mt-1">✓ Approver valid dan ditemukan</p>
          )}
        </div> */}

        {/* Keterangan/Notes */}
        {/* <div>
          <Textarea
            label="Keterangan"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Tambahkan keterangan untuk review ini"
            rows={3}
            error={errors.notes}
          />
          {errors.notes && <p className="text-sm text-red-500 mt-1">{errors.notes}</p>}
        </div> */}

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
                className="mr-2 appearance-none h-4 w-4 rounded-full border border-gray-400 bg-gray-100 checked:bg-gray-400 checked:border-gray-400"
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

        {/* Tracking Log */}
        <div>
          <h4 className="font-medium mb-4">Riwayat Status</h4>
          {bastData.tracking?.length > 0 ? (
            <div className="space-y-3">
              {bastData.tracking.map((log, idx) => (
                <div
                  key={log.id}
                  className="flex items-start gap-3 p-3 border rounded bg-gray-50 text-sm"
                >
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p>
                      <strong>
                        {statusLabels[log.statusBaru] || log.statusBaru}
                      </strong>
                      {log.statusSebelumnya && (
                        <>
                          {" "}
                          dari{" "}
                          <em>
                            {statusLabels[log.statusSebelumnya] ||
                              log.statusSebelumnya}
                          </em>
                        </>
                      )}
                    </p>
                    <p className="text-muted-foreground">
                      Oleh: <strong>{log.userEmail}</strong> •{" "}
                      {new Date(log.createdAt).toLocaleString("id-ID")}
                    </p>
                    {log.note && (
                      <p className="text-sm mt-1">
                        <em>{log.note}</em>
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Belum ada riwayat.</p>
          )}
        </div>

        {/* Aksi */}
        <div className="pt-6 border-t flex flex-col sm:flex-row gap-3">
          {/*<Button variant="outline" onClick={() => window.history.back()}>
            Kembali
          </Button>*/}
          <div className="flex-1"></div>
          <Button
            variant="destructive"
            onClick={handleReject}
            disabled={submitting}
            className="flex items-center gap-2"
          >
            <XCircle size={16} />
            {submitting ? "Memproses..." : "Tolak"}
          </Button>
          <Button
            onClick={handleApprove}
            disabled={submitting}
            className="flex items-center gap-2"
          >
            <CheckCircle size={16} />
            {submitting ? "Memproses..." : "Setujui"}
          </Button>
        </div>
      </form>

      {/* Modal untuk hasil cek approver dan submit */}
      {showApproverModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-center mb-4">
              {modalContent.type === "success" ? (
                <CheckCircle className="text-green-500" size={48} />
              ) : (
                <XCircle className="text-red-500" size={48} />
              )}
            </div>
            <h3
              className={`text-xl font-semibold text-center mb-2 ${
                modalContent.type === "success"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {modalContent.title}
            </h3>
            <p className="text-gray-700 text-center mb-6">
              {modalContent.message}
            </p>
            <div className="flex justify-center">
              <Button
                onClick={() => {
                  setShowApproverModal(false);
                  // Jika modal sukses setelah submit, redirect ke dashboard
                  if (
                    modalContent.type === "success" &&
                    (modalContent.title === "BAST Disetujui" ||
                      modalContent.title === "BAST Ditolak")
                  ) {
                    window.location.href = "/vendor-dashboard";
                  }
                }}
              >
                {modalContent.type === "success" &&
                (modalContent.title === "BAST Disetujui" ||
                  modalContent.title === "BAST Ditolak")
                  ? "Kembali ke Dashboard"
                  : "Tutup"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewVendorBastForm;
