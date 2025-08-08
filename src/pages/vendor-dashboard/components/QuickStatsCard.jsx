import React from 'react';
import Icon from '../../../components/AppIcon';

const QuickStatsCard = ({ stats }) => {
  const quickStats = [
    {
      key: 'thisMonth',
      label: 'Bulan Ini',
      englishLabel: 'This Month',
      value: stats.thisMonth || 0,
      icon: 'Calendar',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      key: 'pending',
      label: 'Menunggu',
      englishLabel: 'Pending',
      value: stats.pending || 0,
      icon: 'Clock',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      key: 'avgProcessing',
      label: 'Rata-rata Proses',
      englishLabel: 'Avg Processing',
      value: `${stats.avgProcessing || 0} hari`,
      icon: 'TrendingUp',
      color: 'text-success',
      bgColor: 'bg-success/10'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {quickStats.map((stat) => (
        <div
          key={stat.key}
          className="bg-card rounded-lg shadow-card border border-border p-4"
        >
          <div className="flex items-center space-x-3">
            <div className={`
              w-12 h-12 rounded-lg flex items-center justify-center
              ${stat.bgColor}
            `}>
              <Icon name={stat.icon} size={20} className={stat.color} />
            </div>
            <div className="flex-1">
              <div className="text-lg font-heading font-bold text-foreground">
                {stat.value}
              </div>
              <div className="text-sm font-body text-muted-foreground">
                {stat.label}
              </div>
              <div className="text-xs font-caption text-muted-foreground">
                {stat.englishLabel}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickStatsCard;