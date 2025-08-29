// pages/bast/ApproverBastPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import SessionTimeoutHandler from '../../components/ui/SessionTimeoutHandler';
import ApproverBastForm from './components/ApproverBastForm';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const ApproverBastPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header userRole="reviewer" userName="" />
      
      {/* Session Timeout Handler */}
      <SessionTimeoutHandler
        isActive={true}
        onTimeout={() => navigate('/reviewer-login')}
        onExtend={() => {}}
      />
      
      {/* Main Content */}
      <main className="pt-16">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="FileText" size={20} color="white" />
              </div>
              <div>
                <h1 className="text-2xl font-heading font-bold text-foreground">
                  Approve BAST
                </h1>
                <p className="text-sm font-body text-muted-foreground">
                  Approve dan berikan keputusan pada dokumen BAST
                </p>
              </div>
            </div>
          </div>
          
          {/* Form Content */}
          <div className="space-y-6">
            <ApproverBastForm />
          </div>
          
          {/* Quick Actions */}
          <div className="mt-8 pt-6 border-t border-border">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="outline"
                onClick={() => navigate('/approver-dashboard')}
                iconName="ArrowLeft"
                iconPosition="left"
                className="flex-1 sm:flex-none"
              >
                Kembali ke Daftar BAST
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ApproverBastPage;