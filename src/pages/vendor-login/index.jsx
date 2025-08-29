import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CompanyLogo from './components/CompanyLogo';
import LoginForm from './components/LoginForm';

const VendorLogin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const userRole = localStorage.getItem('userRole');
    if (userRole === 'vendor') {
      navigate('/vendor-dashboard');
    } else if (userRole === 'staff') {
      navigate('/internal-staff-dashboard');
    }else if (userRole === 'administrator') {
      navigate('/internal-staff-dashboard');
    }else if (userRole === 'pic') {
      navigate('/internal-staff-dashboard');
    }else if (userRole === 'reviewer') {
      navigate('/reviewer-dashboard');
    }else if (userRole === 'approval') {
      navigate('/approver-dashboard');
    }else if (userRole === 'vendorreview') {
      navigate('/vendor-review-dashboard');
    }

    // Set page title
    document.title = 'Masuk - Patra Invoice Drop';
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>
      
      {/* Main Content */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            
            {/* Header Section */}
            <div className="text-center mb-12">
              <CompanyLogo />
            </div>

            {/* Login Section */}
            <div className="flex flex-col lg:flex-row items-start justify-center gap-12">
              
              {/* Login Form */}
              <div className="w-full lg:w-auto flex-shrink-0">
                <LoginForm />
              </div>
            </div>

            {/* Footer Information */}
            <div className="mt-16 text-center">
              <div className="max-w-2xl mx-auto">             

                {/* Copyright */}
                <div className="pt-8 border-t border-border">
                  <p className="text-xs font-caption text-muted-foreground">
                    © {new Date().getFullYear()} PT Patra Logistik. Semua hak dilindungi undang-undang.<br />
                    Sistem Invoice Drop v2.1.0 - 2025
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorLogin;