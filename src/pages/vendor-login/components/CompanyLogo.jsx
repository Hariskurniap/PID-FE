import React from 'react';
import Icon from '../../../components/AppIcon';
import logo from '../../../img/logo.png';

const CompanyLogo = () => {
  return (
    <div className="text-center mb-8">
      {/* Main Logo */}
      <div className="flex items-center justify-center mb-4">
        <div className="flex items-center space-x-3">
          {/* Logo Icon */}
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-card">
            <Icon name="FileText" size={24} color="white" />
          </div>
          
          {/* Company Name */}
          {/* Company Name */}
<div className="text-left">
  <img src={logo} alt="Patra Logistik Logo" className="h-10" />
  <p className="text-sm font-body text-primary font-medium">
    Patlog Invoice Drop
  </p>
</div>

        </div>
      </div>

      {/* Tagline */}
      <div className="max-w-md mx-auto">
        <p className="text-sm font-body text-muted-foreground mb-2">
          Portal Pengiriman Invoice Secara Online dan Terpadu
        </p>
      </div>

      {/* Decorative Elements */}
      {/* <div className="flex items-center justify-center space-x-2 mt-4">
        <div className="w-2 h-2 bg-primary rounded-full"></div>
        <div className="w-8 h-0.5 bg-primary/30 rounded-full"></div>
        <div className="w-2 h-2 bg-primary/60 rounded-full"></div>
        <div className="w-8 h-0.5 bg-primary/30 rounded-full"></div>
        <div className="w-2 h-2 bg-primary rounded-full"></div>
      </div> */}
    </div>
  );
};

export default CompanyLogo;