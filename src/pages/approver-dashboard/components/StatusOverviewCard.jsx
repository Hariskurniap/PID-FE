import React, { useEffect, useState } from 'react';
import Icon from '../../../components/AppIcon';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const StatusOverviewCard = ({ reviewerEmail, onStatusClick }) => {
  const [statusCounts, setStatusCounts] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchStatusSummary = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_BASE_URL}/api/bast/reviewerUser/${reviewerEmail}/summary`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatusCounts(response.data);
    } catch (error) {
      console.error('Failed to fetch reviewer BAST status summary:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (reviewerEmail) fetchStatusSummary();
  }, [reviewerEmail]);

  const statusConfig = [
    { key: 'DRAFT', label: 'Draft', icon: 'FileText', color: 'text-gray-500', bgColor: 'bg-gray-100', borderColor: 'border-gray-200', count: statusCounts.DRAFT || 0 },
    { key: 'WAITING_REVIEW', label: 'Menunggu Review', icon: 'Clock', color: 'text-primary', bgColor: 'bg-primary/10', borderColor: 'border-primary/20', count: statusCounts.WAITING_REVIEW || 0 },
    { key: 'DIPERIKSA_USER', label: 'Diperiksa User', icon: 'UserCheck', color: 'text-blue-500', bgColor: 'bg-blue-100', borderColor: 'border-blue-200', count: statusCounts.DIPERIKSA_USER || 0 },
    { key: 'DISETUJUI_APPROVER', label: 'Disetujui Approver', icon: 'CheckCircle2', color: 'text-green-500', bgColor: 'bg-green-100', borderColor: 'border-green-200', count: statusCounts.DISETUJUI_APPROVER || 0 },
    { key: 'DISETUJUI_VENDOR', label: 'Disetujui Vendor', icon: 'User', color: 'text-teal-500', bgColor: 'bg-teal-100', borderColor: 'border-teal-200', count: statusCounts.DISETUJUI_VENDOR || 0 },
    { key: 'INPUT_SAGR', label: 'Input SAGR', icon: 'Edit', color: 'text-yellow-600', bgColor: 'bg-yellow-100', borderColor: 'border-yellow-200', count: statusCounts.INPUT_SAGR || 0 },
    { key: 'BAST_DONE', label: 'Selesai', icon: 'CheckSquare', color: 'text-success', bgColor: 'bg-success/10', borderColor: 'border-success/20', count: statusCounts.BAST_DONE || 0 },
  ];

  const total = statusConfig.reduce((sum, s) => sum + s.count, 0);

  return (
    <div className="bg-card rounded-lg shadow-card border border-border p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-heading font-semibold text-foreground">
            Ringkasan Status BAST (Diperiksa User)
          </h2>
          <p className="text-sm font-caption text-muted-foreground">
            BAST Status Overview
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-heading font-bold text-foreground">
            {loading ? '...' : total}
          </div>
          <div className="text-sm font-caption text-muted-foreground">
            Total BAST
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statusConfig.map((status) => (
          <div
            key={status.key}
            onClick={() => onStatusClick && onStatusClick(status.key)}
            className={`p-4 rounded-lg border transition-micro cursor-pointer
              ${status.bgColor} ${status.borderColor}
              hover:shadow-card hover:scale-105
            `}
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${status.bgColor} ${status.color}`}>
                <Icon name={status.icon} size={20} />
              </div>
              <div className="flex-1">
                <div className={`text-2xl font-heading font-bold ${status.color}`}>
                  {loading ? '-' : status.count}
                </div>
              </div>
            </div>
            <div>
              <div className={`text-sm font-body font-medium ${status.color}`}>
                {status.label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusOverviewCard;
