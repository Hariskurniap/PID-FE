import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import StatusIndicator from '../../../components/ui/StatusIndicator';

const BastListCard = ({ basts = [], loading = false, onViewDetails, onRefresh, onEdit, onReview }) => {
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="bg-card rounded-lg shadow-card border border-border">
            <div className="p-6 border-b border-border flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-heading font-semibold text-foreground">
                        Daftar BAST Vendor
                    </h3>
                    <p className="text-sm font-caption text-muted-foreground">
                        Recent BAST List
                    </p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    iconName="RefreshCw"
                    iconPosition="left"
                    onClick={onRefresh}
                    loading={loading}
                >
                    Refresh
                </Button>
            </div>

            <div className="divide-y divide-border">
                {basts.length === 0 ? (
                    <div className="p-8 text-center">
                        <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
                        <h4 className="text-sm font-body font-medium text-foreground mb-2">
                            Belum ada BAST
                        </h4>
                        <p className="text-xs font-caption text-muted-foreground">
                            No BAST found. Create your first BAST to get started.
                        </p>
                    </div>
                ) : (
                    basts.map((bast) => (
                        <div key={bast.id} className="p-4 hover:bg-muted/30 transition-micro">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                            <Icon name="FileText" size={18} className="text-primary" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-body font-medium text-foreground">
                                                {bast.idBast}
                                            </h4>
                                            <p className="text-xs font-caption text-muted-foreground">
                                                {bast.nomorPo || '-'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-caption">
                                        <div>
                                            <span className="text-muted-foreground">Tanggal Buat:</span>
                                            <div className="font-mono text-foreground">{formatDate(bast.createdAt)}</div>
                                            <div className="font-mono text-muted-foreground">{formatTime(bast.createdAt)}</div>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Status:</span>
                                            <div className="mt-1">
                                                <StatusIndicator status={bast.status.toUpperCase()} size="sm" />
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Nomor Kontrak:</span>
                                            <div className="font-mono text-foreground">{bast.nomorKontrak || '-'}</div>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Perihal:</span>
                                            <div className="font-mono text-foreground">{bast.perihal || '-'}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        iconName="Eye"
                                        iconPosition="left"
                                        onClick={() => onViewDetails(bast.idBast)}
                                    >
                                        Detail
                                    </Button>
                                    {/* Tombol EDIT untuk DRAFT */}
                                    {(bast.status === 'DRAFT') && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            iconName="Edit"
                                            iconPosition="left"
                                            onClick={() => onEdit(bast.idBast)}
                                        >
                                            Edit
                                        </Button>
                                    )}

                                    {/* Tombol REVIEW untuk DISETUJUI_APPROVER */}
                                    {(bast.status === 'DISETUJUI_APPROVER') && (
                                        <Button
                                            variant="default"
                                            size="sm"
                                            iconName="CheckCircle"
                                            iconPosition="left"
                                            onClick={() => onReview(bast.idBast)}
                                        >
                                            Review
                                        </Button>
                                    )}

                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default BastListCard;
