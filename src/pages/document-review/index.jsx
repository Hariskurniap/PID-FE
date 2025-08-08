import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import SessionTimeoutHandler from '../../components/ui/SessionTimeoutHandler';
import DocumentViewer from './components/DocumentViewer';
import InvoiceMetadata from './components/InvoiceMetadata';
import ProcessingHistory from './components/ProcessingHistory';
import ReviewActions from './components/ReviewActions';
import QuickReferenceTools from './components/QuickReferenceTools';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const DocumentReview = () => {
  const { invoiceId } = useParams();
  const navigate = useNavigate();
  const [currentInvoice, setCurrentInvoice] = useState(null);
  const [currentVendor, setCurrentVendor] = useState(null);
  const [annotations, setAnnotations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [activePanel, setActivePanel] = useState('document');
  const [collaborators, setCollaborators] = useState([]);

  // Mock data
  const mockInvoice = {
    id: "INV-2024-001",
    referenceNumber: "REF-240115-001",
    invoiceNumber: "INV/2024/001",
    amount: 2650000,
    currency: "IDR",
    issueDate: "2024-01-15",
    dueDate: "2024-02-14",
    description: "Jasa Pengiriman Barang Jakarta - Surabaya",
    status: "reviewing",
    priority: "normal",
    submissionDate: "2024-01-15T10:30:00Z",
    lastUpdated: "2024-01-15T14:20:00Z",
    document: {
      fileName: "Invoice_PT_Maju_Jaya_001.pdf",
      fileType: "pdf",
      fileSize: "2.4 MB",
      totalPages: 3,
      url: "https://example.com/documents/invoice_001.pdf"
    }
  };

  const mockVendor = {
    id: "VND-001",
    name: "PT Maju Jaya Sejahtera",
    email: "finance@majujaya.co.id",
    phone: "+62-21-5551234",
    address: "Jl. Sudirman No. 123, Jakarta Pusat 10220",
    npwp: "01.234.567.8-901.000",
    registrationDate: "2023-06-15",
    totalInvoices: 24,
    approvedInvoices: 22,
    rejectedInvoices: 2,
    averageProcessingTime: "2.3 hari",
    lastInvoiceDate: "2024-01-10"
  };

  const mockAnnotations = [
    {
      id: 1,
      x: 20,
      y: 30,
      width: 15,
      height: 5,
      note: "Periksa NPWP",
      author: "Sari Dewi",
      timestamp: "2024-01-15T14:20:00Z"
    }
  ];

  const mockCollaborators = [
    {
      id: 1,
      name: "Ahmad Rizki",
      role: "Senior Reviewer",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      status: "viewing",
      lastActive: "2024-01-15T14:25:00Z"
    }
  ];

  useEffect(() => {
    // Simulate data loading
    setCurrentInvoice(mockInvoice);
    setCurrentVendor(mockVendor);
    setAnnotations(mockAnnotations);
    setCollaborators(mockCollaborators);

    // Check mobile view
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 1024);
    };

    checkMobileView();
    window.addEventListener('resize', checkMobileView);
    return () => window.removeEventListener('resize', checkMobileView);
  }, [invoiceId]);

  const handleApprove = async (approvalData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Approving invoice:', approvalData);
      
      // Update invoice status
      setCurrentInvoice(prev => ({
        ...prev,
        status: 'approved',
        lastUpdated: new Date().toISOString()
      }));
      
      // Show success message and redirect
      alert('Invoice berhasil disetujui!');
      navigate('/internal-staff-dashboard');
    } catch (error) {
      console.error('Error approving invoice:', error);
      alert('Terjadi kesalahan saat menyetujui invoice');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (rejectionData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Rejecting invoice:', rejectionData);
      
      // Update invoice status
      setCurrentInvoice(prev => ({
        ...prev,
        status: 'rejected',
        lastUpdated: new Date().toISOString()
      }));
      
      // Show success message and redirect
      alert('Invoice berhasil ditolak!');
      navigate('/internal-staff-dashboard');
    } catch (error) {
      console.error('Error rejecting invoice:', error);
      alert('Terjadi kesalahan saat menolak invoice');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestInfo = async (requestData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Requesting additional info:', requestData);
      
      // Update invoice status
      setCurrentInvoice(prev => ({
        ...prev,
        status: 'pending',
        lastUpdated: new Date().toISOString()
      }));
      
      // Show success message
      alert('Permintaan informasi tambahan berhasil dikirim!');
    } catch (error) {
      console.error('Error requesting info:', error);
      alert('Terjadi kesalahan saat mengirim permintaan');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnnotationAdd = (annotation) => {
    const newAnnotation = {
      ...annotation,
      id: annotations.length + 1,
      author: "Sari Dewi",
      timestamp: new Date().toISOString()
    };
    setAnnotations(prev => [...prev, newAnnotation]);
  };

  const handleAnnotationUpdate = (annotation) => {
    setAnnotations(prev => 
      prev.map(ann => ann.id === annotation.id ? annotation : ann)
    );
  };

  const handleAnnotationDelete = (annotationId) => {
    setAnnotations(prev => prev.filter(ann => ann.id !== annotationId));
  };

  const handleSessionTimeout = () => {
    navigate('/vendor-login');
  };

  const handleSessionExtend = async () => {
    // Simulate session extension
    return new Promise(resolve => setTimeout(resolve, 1000));
  };

  const panels = [
    { id: 'document', label: 'Dokumen', icon: 'FileText' },
    { id: 'metadata', label: 'Info', icon: 'Info' },
    { id: 'history', label: 'Riwayat', icon: 'History' },
    { id: 'actions', label: 'Aksi', icon: 'Settings' },
    { id: 'tools', label: 'Tools', icon: 'Zap' }
  ];

  if (!currentInvoice) {
    return (
      <div className="min-h-screen bg-background">
        <Header userRole="staff" userName="Sari Dewi" />
        <div className="pt-16 flex items-center justify-center h-screen">
          <div className="text-center">
            <Icon name="Loader2" size={32} className="animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Memuat dokumen...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header userRole="staff" userName="Sari Dewi" />
      <SessionTimeoutHandler
        timeoutDuration={600000} // 10 minutes
        warningDuration={60000}  // 1 minute warning
        onTimeout={handleSessionTimeout}
        onExtend={handleExtendSession}
        isActive={true}
      />

      <div className="pt-16">
        {/* Page Header */}
        <div className="bg-card border-b border-border px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/internal-staff-dashboard')}
                iconName="ArrowLeft"
                iconPosition="left"
              >
                Kembali
              </Button>
              <div>
                <h1 className="text-xl font-heading font-semibold text-foreground">
                  Review Dokumen
                </h1>
                <p className="text-sm font-caption text-muted-foreground">
                  {currentInvoice.referenceNumber} • {currentVendor.name}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Collaborators */}
              {collaborators.length > 0 && (
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    {collaborators.map((collaborator) => (
                      <div
                        key={collaborator.id}
                        className="relative w-8 h-8 rounded-full border-2 border-background overflow-hidden"
                        title={`${collaborator.name} - ${collaborator.status}`}
                      >
                        <img
                          src={collaborator.avatar}
                          alt={collaborator.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 right-0 w-2 h-2 bg-success rounded-full border border-background" />
                      </div>
                    ))}
                  </div>
                  <span className="text-xs font-caption text-muted-foreground">
                    {collaborators.length} reviewer aktif
                  </span>
                </div>
              )}

              {/* Mobile Panel Toggle */}
              {isMobileView && (
                <div className="flex space-x-1 bg-muted/30 p-1 rounded-lg">
                  {panels.map((panel) => (
                    <button
                      key={panel.id}
                      onClick={() => setActivePanel(panel.id)}
                      className={`
                        p-2 rounded-md transition-micro
                        ${activePanel === panel.id 
                          ? 'bg-primary text-primary-foreground' 
                          : 'text-muted-foreground hover:text-foreground'
                        }
                      `}
                      title={panel.label}
                    >
                      <Icon name={panel.icon} size={16} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex h-[calc(100vh-8rem)]">
          {/* Desktop Layout */}
          {!isMobileView ? (
            <>
              {/* Left Panel - Document Viewer */}
              <div className="flex-1 border-r border-border">
                <DocumentViewer
                  document={currentInvoice.document}
                  annotations={annotations}
                  onAnnotationAdd={handleAnnotationAdd}
                  onAnnotationUpdate={handleAnnotationUpdate}
                  onAnnotationDelete={handleAnnotationDelete}
                />
              </div>

              {/* Right Panel - Information & Actions */}
              <div className="w-96 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                  <InvoiceMetadata 
                    invoice={currentInvoice} 
                    vendor={currentVendor} 
                  />
                  <ProcessingHistory />
                  <ReviewActions
                    invoice={currentInvoice}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onRequestInfo={handleRequestInfo}
                    isLoading={isLoading}
                  />
                  <QuickReferenceTools
                    vendorId={currentVendor.id}
                    invoiceAmount={currentInvoice.amount}
                  />
                </div>
              </div>
            </>
          ) : (
            /* Mobile Layout */
            <div className="flex-1 overflow-hidden">
              {activePanel === 'document' && (
                <DocumentViewer
                  document={currentInvoice.document}
                  annotations={annotations}
                  onAnnotationAdd={handleAnnotationAdd}
                  onAnnotationUpdate={handleAnnotationUpdate}
                  onAnnotationDelete={handleAnnotationDelete}
                />
              )}
              {activePanel === 'metadata' && (
                <div className="h-full overflow-y-auto p-4">
                  <InvoiceMetadata 
                    invoice={currentInvoice} 
                    vendor={currentVendor} 
                  />
                </div>
              )}
              {activePanel === 'history' && (
                <div className="h-full overflow-y-auto p-4">
                  <ProcessingHistory />
                </div>
              )}
              {activePanel === 'actions' && (
                <div className="h-full overflow-y-auto p-4">
                  <ReviewActions
                    invoice={currentInvoice}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onRequestInfo={handleRequestInfo}
                    isLoading={isLoading}
                  />
                </div>
              )}
              {activePanel === 'tools' && (
                <div className="h-full overflow-y-auto p-4">
                  <QuickReferenceTools
                    vendorId={currentVendor.id}
                    invoiceAmount={currentInvoice.amount}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentReview;