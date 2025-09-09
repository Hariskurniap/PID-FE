import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'User';
  const userRole = localStorage.getItem('userRole') || 'vendor';

  // Navigasi untuk setiap role
  const vendorNavItems = [
    { label: 'Dashboard', path: '/vendor-dashboard', icon: 'LayoutDashboard' },
    { label: 'BAST', path: '/bast', icon: 'Upload' },
    { label: 'Track Status', path: '/invoice-status-tracking', icon: 'Search' },
  ];

  const reviewerNavItems = [
    { label: 'Dashboard', path: '/reviewer-dashboard', icon: 'LayoutDashboard' },
    // { label: 'BAST', path: '/bast', icon: 'Upload' },
    { label: 'Track Status', path: '/invoice-status-tracking', icon: 'Search' },
  ];

  const approvalNavItems = [
    { label: 'Dashboard', path: '/approver-dashboard', icon: 'LayoutDashboard' },
    // { label: 'Document Review', path: '/document-review', icon: 'FileText' },
    { label: 'Track Status', path: '/invoice-status-tracking', icon: 'Search' },
  ];

  const vendorreviewNavItems = [
    { label: 'Dashboard', path: '/internal-staff-dashboard', icon: 'LayoutDashboard' },
    { label: 'BAST', path: '/bast', icon: 'Upload' },
    { label: 'Track Status', path: '/invoice-status-tracking', icon: 'Search' },
  ];

  const staffNavItems = [
    { label: 'Dashboard', path: '/internal-staff-dashboard', icon: 'LayoutDashboard' },
    { label: 'Track Status', path: '/invoice-status-tracking', icon: 'Search' },
  ];

  const adminNavItems = [
    { label: 'Dashboard', path: '/internal-staff-dashboard', icon: 'LayoutDashboard' },
    { label: 'Master Vendor', path: '/master-vendor', icon: 'FileText' },
    { label: 'Pengguna', path: '/pengguna', icon: 'FileText' },
    { label: 'Track Status', path: '/invoice-status-tracking', icon: 'Search' },
  ];

  const picNavItems = [
    { label: 'Dashboard', path: '/internal-pic-dashboard', icon: 'LayoutDashboard' },
    { label: 'BAST', path: '/bast', icon: 'Upload' },
    { label: 'Track Status', path: '/invoice-status-tracking', icon: 'Search' },
  ];

  // Mapping role ke navigasi
  const navMap = {
    administrator: adminNavItems,
    staff: staffNavItems,
    pic: picNavItems,
    vendor: vendorNavItems,
    reviewer: reviewerNavItems,      // Tambahkan role reviewer
    approval: approvalNavItems,      // Tambahkan role approval
    vendorreview: vendorreviewNavItems, // Tambahkan role vendorreview
  };

  const navigationItems = navMap[userRole] || vendorNavItems;

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  // const handleLogout = () => {
  //   // Hapus semua localStorage
  //   localStorage.clear();
  //   // Hapus semua cookies
  //   deleteAllCookies();
  //   setIsProfileMenuOpen(false);
  //   // Redirect ke login page
  //   navigate('/');
  // };
  const handleLogout = () => {
    // 👇 AMBIL TOKEN DULU — SEBELUM DIHAPUS!
    const idToken = localStorage.getItem('id_token'); // HARUS disimpan saat login
    const issuer = import.meta.env.VITE_OIDC_ISSUER;
    const clientId = import.meta.env.VITE_OIDC_CLIENT_ID;
    const postLogoutRedirectUri = import.meta.env.VITE_OIDC_POST_LOGOUT_REDIRECT_URI;

    // Tutup menu (jika ada)
    setIsProfileMenuOpen(false);

    // Hapus semua data lokal
    localStorage.clear();
    deleteAllCookies();

    // Jika tidak ada id_token, fallback ke logout lokal
    if (!idToken) {
      console.warn("id_token tidak ditemukan. Logout lokal saja.");
      navigate('/');
      return;
    }

    // 🔥 Endpoint logout untuk IdAMan (kemungkinan besar .NET backend)
    // Gunakan: /connect/endsession — standar IdentityServer
    const logoutUrl = `${issuer}/connect/endsession` +
      `?id_token_hint=${encodeURIComponent(idToken)}` +
      `&post_logout_redirect_uri=${encodeURIComponent(postLogoutRedirectUri)}` +
      `&client_id=${encodeURIComponent(clientId)}`;

    // Redirect ke IdAMan untuk logout server-side
    window.location.href = logoutUrl;
  };

  function deleteAllCookies() {
    document.cookie.split(";").forEach(function (c) {
      document.cookie = c.trim().split("=")[0] + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
    });
  }

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileMenuOpen && !event.target.closest('.profile-menu')) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileMenuOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 bg-card border-b border-border z-1000">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Logo */}
        <div className="flex items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="FileText" size={20} color="white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-heading font-semibold text-foreground">
                Patlog Invoice Drop
              </h1>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navigationItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-body transition-micro ${isActivePath(item.path)
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
            >
              <Icon name={item.icon} size={16} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-3">
          {/* Profile Menu */}
          <div className="relative profile-menu">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-body text-muted-foreground hover:text-foreground hover:bg-muted transition-micro"
            >
              <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
                <Icon name="User" size={14} color="white" />
              </div>
              <span className="hidden md:block">{userName}</span>
              <Icon name="ChevronDown" size={14} />
            </button>

            {/* Profile Dropdown */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg shadow-elevated animate-fade-in">
                <div className="py-2">
                  <div className="px-4 py-2 border-b border-border">
                    <p className="text-sm font-body font-medium text-foreground">{userName}</p>
                    <p className="text-xs font-caption text-muted-foreground">
                      {userRole}
                    </p>
                  </div>

                  <div className="border-t border-border mt-2 pt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm font-body text-error hover:bg-muted transition-micro"
                    >
                      <Icon name="LogOut" size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-micro"
          >
            <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-card border-t border-border animate-slide-in">
          <nav className="px-4 py-4 space-y-2">
            {navigationItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md text-sm font-body transition-micro ${isActivePath(item.path)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
              >
                <Icon name={item.icon} size={18} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;