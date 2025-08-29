// pages/master-vendor/index.jsx
import React, { useState } from 'react';
import VendorForm from './components/VendorForm';
import ListVendor from './components/ListVendor';
import VendorView from './components/VendorView';
import Header from '../../components/ui/Header';

const MasterVendor = () => {
  const [showForm, setShowForm] = useState(false);
  const [showView, setShowView] = useState(false);
  const [editVendor, setEditVendor] = useState(null);
  const [viewVendor, setViewVendor] = useState(null);

  const handleAdd = () => {
    setEditVendor(null);
    setShowForm(true);
    setShowView(false);
  };

  const handleEdit = (vendor) => {
    setEditVendor(vendor);
    setShowForm(true);
    setShowView(false);
  };

  const handleView = (vendor) => {
    setViewVendor(vendor);
    setShowView(true);
    setShowForm(false);
  };

  const handleCancel = () => {
    setShowForm(false);
    setShowView(false);
    setEditVendor(null);
    setViewVendor(null);
  };

  const userRole = localStorage.getItem('userRole') || 'vendor';
  const userName = localStorage.getItem('userName') || 'User';

  return (
    <div className="min-h-screen bg-background">
      <Header userRole={userRole} userName={userName} />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8">
          {!showForm && !showView ? (
            <ListVendor onAdd={handleAdd} onEdit={handleEdit} onView={handleView} />
          ) : showView ? (
            <VendorView vendor={viewVendor} onBack={handleCancel} />
          ) : (
            <VendorForm initialData={editVendor} onCancel={handleCancel} />
          )}
        </div>
      </main>
    </div>
  );
};

export default MasterVendor;