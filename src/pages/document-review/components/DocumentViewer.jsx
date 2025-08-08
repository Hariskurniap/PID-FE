import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DocumentViewer = ({ 
  document, 
  annotations = [], 
  onAnnotationAdd,
  onAnnotationUpdate,
  onAnnotationDelete 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [isAnnotating, setIsAnnotating] = useState(false);
  const [selectedAnnotation, setSelectedAnnotation] = useState(null);

  const mockDocument = {
    id: "INV-2024-001",
    fileName: "Invoice_PT_Maju_Jaya_001.pdf",
    fileType: "pdf",
    fileSize: "2.4 MB",
    totalPages: 3,
    uploadDate: "2024-01-15T10:30:00Z",
    url: "https://example.com/documents/invoice_001.pdf"
  };

  const currentDoc = document || mockDocument;

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handlePageChange = (direction) => {
    if (direction === 'next' && currentPage < currentDoc.totalPages) {
      setCurrentPage(prev => prev + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleAnnotationClick = (annotation) => {
    setSelectedAnnotation(annotation);
  };

  const renderPDFViewer = () => (
    <div className="flex-1 bg-gray-100 rounded-lg overflow-hidden">
      <div 
        className="w-full h-full flex items-center justify-center relative"
        style={{ 
          transform: `rotate(${rotation}deg) scale(${zoom / 100})`,
          transformOrigin: 'center'
        }}
      >
        {/* PDF Content Placeholder */}
        <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-8 relative">
          <div className="text-center mb-6">
            <h2 className="text-xl font-heading font-semibold text-foreground mb-2">
              INVOICE
            </h2>
            <p className="text-sm font-body text-muted-foreground">
              Invoice #INV-2024-001
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-body font-semibold text-foreground mb-2">
                From:
              </h3>
              <div className="text-sm font-body text-muted-foreground">
                <p>PT Maju Jaya Sejahtera</p>
                <p>Jl. Sudirman No. 123</p>
                <p>Jakarta Pusat 10220</p>
                <p>NPWP: 01.234.567.8-901.000</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-body font-semibold text-foreground mb-2">
                To:
              </h3>
              <div className="text-sm font-body text-muted-foreground">
                <p>PT Patra Logistik</p>
                <p>Jl. Gatot Subroto No. 456</p>
                <p>Jakarta Selatan 12950</p>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-sm font-body font-semibold text-foreground py-2">
                    Deskripsi
                  </th>
                  <th className="text-right text-sm font-body font-semibold text-foreground py-2">
                    Jumlah
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-sm font-body text-muted-foreground py-2">
                    Jasa Pengiriman Barang - Jakarta ke Surabaya
                  </td>
                  <td className="text-right text-sm font-body text-muted-foreground py-2">
                    Rp 2.500.000,00
                  </td>
                </tr>
                <tr>
                  <td className="text-sm font-body text-muted-foreground py-2">
                    Biaya Administrasi
                  </td>
                  <td className="text-right text-sm font-body text-muted-foreground py-2">
                    Rp 150.000,00
                  </td>
                </tr>
                <tr className="border-t border-border">
                  <td className="text-sm font-body font-semibold text-foreground py-2">
                    Total
                  </td>
                  <td className="text-right text-sm font-body font-semibold text-foreground py-2">
                    Rp 2.650.000,00
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Annotations */}
          {annotations.map((annotation, index) => (
            <div
              key={annotation.id || index}
              className="absolute bg-warning/20 border-2 border-warning rounded cursor-pointer"
              style={{
                left: `${annotation.x}%`,
                top: `${annotation.y}%`,
                width: `${annotation.width}%`,
                height: `${annotation.height}%`
              }}
              onClick={() => handleAnnotationClick(annotation)}
            >
              <div className="absolute -top-6 left-0 bg-warning text-warning-foreground px-2 py-1 rounded text-xs font-caption">
                {annotation.note}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderExcelViewer = () => (
    <div className="flex-1 bg-gray-100 rounded-lg overflow-hidden">
      <div className="w-full h-full p-4">
        <div className="bg-white rounded-lg shadow-card overflow-auto h-full">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border p-2 text-sm font-body font-semibold text-foreground">A</th>
                <th className="border border-border p-2 text-sm font-body font-semibold text-foreground">B</th>
                <th className="border border-border p-2 text-sm font-body font-semibold text-foreground">C</th>
                <th className="border border-border p-2 text-sm font-body font-semibold text-foreground">D</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border p-2 text-sm font-body text-foreground">No</td>
                <td className="border border-border p-2 text-sm font-body text-foreground">Deskripsi</td>
                <td className="border border-border p-2 text-sm font-body text-foreground">Qty</td>
                <td className="border border-border p-2 text-sm font-body text-foreground">Harga</td>
              </tr>
              <tr>
                <td className="border border-border p-2 text-sm font-body text-muted-foreground">1</td>
                <td className="border border-border p-2 text-sm font-body text-muted-foreground">Jasa Pengiriman</td>
                <td className="border border-border p-2 text-sm font-body text-muted-foreground">1</td>
                <td className="border border-border p-2 text-sm font-body text-muted-foreground">2.500.000</td>
              </tr>
              <tr>
                <td className="border border-border p-2 text-sm font-body text-muted-foreground">2</td>
                <td className="border border-border p-2 text-sm font-body text-muted-foreground">Biaya Admin</td>
                <td className="border border-border p-2 text-sm font-body text-muted-foreground">1</td>
                <td className="border border-border p-2 text-sm font-body text-muted-foreground">150.000</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      {/* Document Viewer Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center space-x-3">
          <Icon name="FileText" size={20} className="text-primary" />
          <div>
            <h3 className="text-sm font-body font-semibold text-foreground">
              {currentDoc.fileName}
            </h3>
            <p className="text-xs font-caption text-muted-foreground">
              {currentDoc.fileSize} • {currentDoc.fileType.toUpperCase()}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAnnotating(!isAnnotating)}
            iconName="Edit3"
            iconPosition="left"
          >
            {isAnnotating ? 'Selesai Anotasi' : 'Tambah Anotasi'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(currentDoc.url, '_blank')}
            iconName="Download"
            iconPosition="left"
          >
            Unduh
          </Button>
        </div>
      </div>

      {/* Document Controls */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-muted/30">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomOut}
            disabled={zoom <= 50}
            iconName="ZoomOut"
          />
          <span className="text-sm font-mono text-foreground min-w-16 text-center">
            {zoom}%
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomIn}
            disabled={zoom >= 200}
            iconName="ZoomIn"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleRotate}
            iconName="RotateCw"
          />
        </div>

        {currentDoc.fileType === 'pdf' && (
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange('prev')}
              disabled={currentPage <= 1}
              iconName="ChevronLeft"
            />
            <span className="text-sm font-body text-foreground min-w-20 text-center">
              {currentPage} / {currentDoc.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange('next')}
              disabled={currentPage >= currentDoc.totalPages}
              iconName="ChevronRight"
            />
          </div>
        )}
      </div>

      {/* Document Content */}
      {currentDoc.fileType === 'pdf' ? renderPDFViewer() : renderExcelViewer()}

      {/* Annotation Panel */}
      {selectedAnnotation && (
        <div className="absolute bottom-4 right-4 bg-card border border-border rounded-lg shadow-elevated p-4 max-w-sm">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-body font-semibold text-foreground">
              Catatan Anotasi
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedAnnotation(null)}
              iconName="X"
            />
          </div>
          <p className="text-sm font-body text-muted-foreground mb-3">
            {selectedAnnotation.note}
          </p>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAnnotationUpdate && onAnnotationUpdate(selectedAnnotation)}
            >
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onAnnotationDelete && onAnnotationDelete(selectedAnnotation.id)}
            >
              Hapus
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentViewer;