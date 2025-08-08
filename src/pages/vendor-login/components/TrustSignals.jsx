import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustSignals = () => {
  const trustBadges = [
    {
      id: 1,
      icon: 'Shield',
      title: 'SSL Terenkripsi',
      description: 'Koneksi aman 256-bit'
    },
    {
      id: 2,
      icon: 'Lock',
      title: 'Data Terlindungi',
      description: 'Sesuai standar ISO 27001'
    },
    {
      id: 3,
      icon: 'CheckCircle',
      title: 'Tersertifikasi',
      description: 'Terdaftar resmi di Indonesia'
    }
  ];

  const complianceInfo = [
    'Sistem keamanan tingkat enterprise',
    'Audit keamanan berkala',
    'Backup data otomatis',
    'Monitoring 24/7'
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Trust Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {trustBadges.map((badge) => (
          <div
            key={badge.id}
            className="flex items-center space-x-3 p-4 bg-card rounded-lg border border-border shadow-card"
          >
            <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Icon name={badge.icon} size={20} className="text-success" />
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-body font-medium text-foreground">
                {badge.title}
              </h4>
              <p className="text-xs font-caption text-muted-foreground">
                {badge.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Security Information */}
      <div className="bg-muted/30 rounded-lg p-4 border border-border">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
            <Icon name="Info" size={16} className="text-primary" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-body font-medium text-foreground mb-2">
              Keamanan & Kepatuhan
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {complianceInfo.map((info, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Icon name="Check" size={12} className="text-success flex-shrink-0" />
                  <span className="text-xs font-caption text-muted-foreground">
                    {info}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="text-center mt-4">
        <p className="text-xs font-caption text-muted-foreground">
          Portal ini dikelola oleh PT Patra Logistik dengan standar keamanan tinggi.<br />
          Untuk bantuan teknis, hubungi: support@patralogistik.com
        </p>
      </div>
    </div>
  );
};

export default TrustSignals;