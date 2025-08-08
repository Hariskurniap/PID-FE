import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const ReviewActions = ({ 
  invoice, 
  onApprove, 
  onReject, 
  onRequestInfo,
  isLoading = false 
}) => {
  const [activeAction, setActiveAction] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectionCategory, setRejectionCategory] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [requiresManagerApproval, setRequiresManagerApproval] = useState(false);
  const [complianceChecklist, setComplianceChecklist] = useState({
    documentComplete: false,
    amountValid: false,
    vendorVerified: false,
    taxCompliant: false,
    approvalRequired: false
  });

  const rejectionCategories = [
    { value: 'incomplete_document', label: 'Dokumen Tidak Lengkap' },
    { value: 'invalid_amount', label: 'Jumlah Tidak Valid' },
    { value: 'tax_issue', label: 'Masalah Perpajakan' },
    { value: 'vendor_issue', label: 'Masalah Vendor' },
    { value: 'duplicate', label: 'Invoice Duplikat' },
    { value: 'expired', label: 'Invoice Kadaluarsa' },
    { value: 'other', label: 'Lainnya' }
  ];

  const mockInvoice = {
    id: "INV-2024-001",
    amount: 2650000,
    requiresManagerApproval: true
  };

  const currentInvoice = invoice || mockInvoice;

  const handleChecklistChange = (key, checked) => {
    setComplianceChecklist(prev => ({
      ...prev,
      [key]: checked
    }));
  };

  const isComplianceComplete = () => {
    return Object.values(complianceChecklist).every(value => value === true);
  };

  const handleApprove = () => {
    if (!isComplianceComplete()) {
      alert('Harap lengkapi semua checklist compliance sebelum menyetujui');
      return;
    }

    const approvalData = {
      invoiceId: currentInvoice.id,
      notes: additionalNotes,
      requiresManagerApproval,
      complianceChecklist
    };

    if (onApprove) {
      onApprove(approvalData);
    }
    setActiveAction(null);
  };

  const handleReject = () => {
    if (!rejectionReason.trim() || !rejectionCategory) {
      alert('Harap isi alasan penolakan dan kategori');
      return;
    }

    const rejectionData = {
      invoiceId: currentInvoice.id,
      category: rejectionCategory,
      reason: rejectionReason,
      notes: additionalNotes
    };

    if (onReject) {
      onReject(rejectionData);
    }
    setActiveAction(null);
  };

  const handleRequestInfo = () => {
    if (!additionalNotes.trim()) {
      alert('Harap isi informasi yang diminta');
      return;
    }

    const requestData = {
      invoiceId: currentInvoice.id,
      requestedInfo: additionalNotes
    };

    if (onRequestInfo) {
      onRequestInfo(requestData);
    }
    setActiveAction(null);
  };

  const resetForm = () => {
    setRejectionReason('');
    setRejectionCategory('');
    setAdditionalNotes('');
    setRequiresManagerApproval(false);
    setComplianceChecklist({
      documentComplete: false,
      amountValid: false,
      vendorVerified: false,
      taxCompliant: false,
      approvalRequired: false
    });
  };

  const handleActionChange = (action) => {
    if (activeAction === action) {
      setActiveAction(null);
      resetForm();
    } else {
      setActiveAction(action);
      resetForm();
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-heading font-semibold text-foreground">
          Tindakan Review
        </h3>
        <div className="flex items-center space-x-2">
          <Icon name="Shield" size={16} className="text-primary" />
          <span className="text-sm font-caption text-muted-foreground">
            Review Actions
          </span>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Button
          variant={activeAction === 'approve' ? 'default' : 'outline'}
          onClick={() => handleActionChange('approve')}
          iconName="CheckCircle"
          iconPosition="left"
          className="h-12"
        >
          Setujui
        </Button>
        <Button
          variant={activeAction === 'reject' ? 'destructive' : 'outline'}
          onClick={() => handleActionChange('reject')}
          iconName="XCircle"
          iconPosition="left"
          className="h-12"
        >
          Tolak
        </Button>
        <Button
          variant={activeAction === 'request_info' ? 'secondary' : 'outline'}
          onClick={() => handleActionChange('request_info')}
          iconName="MessageCircle"
          iconPosition="left"
          className="h-12"
        >
          Minta Info
        </Button>
      </div>

      {/* Compliance Checklist */}
      <div className="mb-6 p-4 bg-muted/30 rounded-lg">
        <h4 className="text-sm font-body font-semibold text-foreground mb-3">
          Checklist Compliance
        </h4>
        <div className="space-y-2">
          <Checkbox
            label="Dokumen lengkap dan dapat dibaca"
            checked={complianceChecklist.documentComplete}
            onChange={(e) => handleChecklistChange('documentComplete', e.target.checked)}
          />
          <Checkbox
            label="Jumlah invoice sesuai dan valid"
            checked={complianceChecklist.amountValid}
            onChange={(e) => handleChecklistChange('amountValid', e.target.checked)}
          />
          <Checkbox
            label="Vendor terverifikasi dan terdaftar"
            checked={complianceChecklist.vendorVerified}
            onChange={(e) => handleChecklistChange('vendorVerified', e.target.checked)}
          />
          <Checkbox
            label="Perpajakan sesuai regulasi"
            checked={complianceChecklist.taxCompliant}
            onChange={(e) => handleChecklistChange('taxCompliant', e.target.checked)}
          />
          <Checkbox
            label="Persetujuan manager diperlukan"
            checked={complianceChecklist.approvalRequired}
            onChange={(e) => handleChecklistChange('approvalRequired', e.target.checked)}
          />
        </div>
      </div>

      {/* Action Forms */}
      {activeAction === 'approve' && (
        <div className="space-y-4 p-4 bg-success/5 border border-success/20 rounded-lg">
          <div className="flex items-center space-x-2 mb-3">
            <Icon name="CheckCircle" size={16} className="text-success" />
            <h4 className="text-sm font-body font-semibold text-success">
              Persetujuan Invoice
            </h4>
          </div>

          {currentInvoice.amount > 5000000 && (
            <Checkbox
              label="Memerlukan persetujuan manager (jumlah &gt; Rp 5.000.000)"
              checked={requiresManagerApproval}
              onChange={(e) => setRequiresManagerApproval(e.target.checked)}
            />
          )}

          <Input
            label="Catatan Tambahan (Opsional)"
            type="text"
            placeholder="Tambahkan catatan untuk persetujuan ini..."
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
          />

          <div className="flex space-x-3 pt-2">
            <Button
              variant="success"
              onClick={handleApprove}
              loading={isLoading}
              disabled={!isComplianceComplete()}
              iconName="Check"
              iconPosition="left"
            >
              Konfirmasi Persetujuan
            </Button>
            <Button
              variant="outline"
              onClick={() => setActiveAction(null)}
            >
              Batal
            </Button>
          </div>
        </div>
      )}

      {activeAction === 'reject' && (
        <div className="space-y-4 p-4 bg-error/5 border border-error/20 rounded-lg">
          <div className="flex items-center space-x-2 mb-3">
            <Icon name="XCircle" size={16} className="text-error" />
            <h4 className="text-sm font-body font-semibold text-error">
              Penolakan Invoice
            </h4>
          </div>

          <Select
            label="Kategori Penolakan"
            placeholder="Pilih kategori penolakan"
            options={rejectionCategories}
            value={rejectionCategory}
            onChange={setRejectionCategory}
            required
          />

          <Input
            label="Alasan Penolakan"
            type="text"
            placeholder="Jelaskan alasan penolakan secara detail..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            required
          />

          <Input
            label="Catatan Tambahan"
            type="text"
            placeholder="Saran perbaikan atau informasi tambahan..."
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
          />

          <div className="flex space-x-3 pt-2">
            <Button
              variant="destructive"
              onClick={handleReject}
              loading={isLoading}
              disabled={!rejectionReason.trim() || !rejectionCategory}
              iconName="X"
              iconPosition="left"
            >
              Konfirmasi Penolakan
            </Button>
            <Button
              variant="outline"
              onClick={() => setActiveAction(null)}
            >
              Batal
            </Button>
          </div>
        </div>
      )}

      {activeAction === 'request_info' && (
        <div className="space-y-4 p-4 bg-warning/5 border border-warning/20 rounded-lg">
          <div className="flex items-center space-x-2 mb-3">
            <Icon name="MessageCircle" size={16} className="text-warning" />
            <h4 className="text-sm font-body font-semibold text-warning">
              Permintaan Informasi Tambahan
            </h4>
          </div>

          <Input
            label="Informasi yang Diminta"
            type="text"
            placeholder="Jelaskan informasi atau dokumen tambahan yang diperlukan..."
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            required
          />

          <div className="flex space-x-3 pt-2">
            <Button
              variant="warning"
              onClick={handleRequestInfo}
              loading={isLoading}
              disabled={!additionalNotes.trim()}
              iconName="Send"
              iconPosition="left"
            >
              Kirim Permintaan
            </Button>
            <Button
              variant="outline"
              onClick={() => setActiveAction(null)}
            >
              Batal
            </Button>
          </div>
        </div>
      )}

      {/* Processing Info */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={14} className="text-muted-foreground" />
            <span className="font-caption text-muted-foreground">
              Batas waktu pemrosesan: 2 hari lagi
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="User" size={14} className="text-muted-foreground" />
            <span className="font-caption text-muted-foreground">
              Reviewer: Sari Dewi
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewActions;