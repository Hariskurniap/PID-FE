import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import InvoiceReviewForm from './components/InvoiceReviewForm';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const InvoiceMappingPicPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState('');

  const fetchInvoice = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/invoice/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error('Gagal memuat data invoice');

      const data = await res.json();
      setInvoice(data);
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat memuat data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  return (
    <div className="min-h-screen bg-background">
      <Header userRole={userRole}userName="Staff Reviewer" />

      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-6 flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="FileText" size={20} color="white" />
            </div>
            <div>
              <h1 className="text-2xl font-heading font-bold text-foreground">
                Review Invoice
              </h1>
              <p className="text-sm text-muted-foreground">
                Lihat dan tinjau detail invoice #{id}
              </p>
            </div>
          </div>

          {/* Konten Utama */}
          {loading ? (
            <div className="text-center py-8">
              <Icon name="Loader2" size={48} className="animate-spin mx-auto mb-4" />
              <p className="text-lg font-medium">Memuat data invoice...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-700">
              <p>{error}</p>
              <Button onClick={() => navigate(-1)} className="mt-4" variant="outline">
                Kembali
              </Button>
            </div>
          ) : (
            <InvoiceReviewForm invoice={invoice} />
          )}
        </div>
      </main>
    </div>
  );
};

export default InvoiceMappingPicPage;
