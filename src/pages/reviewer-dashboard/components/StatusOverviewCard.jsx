import React from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

const StatusOverviewCard = ({ statusCounts, onStatusClick }) => {
  const statusItems = [
    { key: 'pending', label: 'Menunggu Review', color: 'bg-yellow-500', count: statusCounts.pending || 0 },
    { key: 'approved', label: 'Disetujui', color: 'bg-green-500', count: statusCounts.approved || 0 },
    { key: 'rejected', label: 'Ditolak', color: 'bg-red-500', count: statusCounts.rejected || 0 },
    { key: 'draft', label: 'Draft', color: 'bg-blue-500', count: statusCounts.draft || 0 },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statusItems.map((item) => (
        <Card key={item.key} className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => onStatusClick(item.key)}>
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full ${item.color} mr-3`}></div>
            <div className="flex-1">
              <p className="text-sm font-caption text-muted-foreground">{item.label}</p>
              <p className="text-xl font-bold">{item.count}</p>
            </div>
            <Button variant="ghost" size="sm">
              Lihat
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default StatusOverviewCard;