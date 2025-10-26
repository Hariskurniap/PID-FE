// pages/bast/DetailBastPage.jsx
import React from "react";
import Header from "../../components/ui/Header";
import SessionTimeoutHandler from "../../components/ui/SessionTimeoutHandler";
import DetailBastForm from "./components/DetailBastForm";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import { useNavigate } from "react-router-dom";

const DetailBastPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header userRole="vendor" userName="" />

      {/* Session Timeout Handler */}
      <SessionTimeoutHandler
        isActive={true}
        onTimeout={() => navigate("/vendor-login")}
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
                  Detail BAST
                </h1>
                <p className="text-sm font-body text-muted-foreground">
                  Lihat informasi lengkap dokumen BAST • Hanya untuk pembacaan
                </p>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="space-y-6">
            <DetailBastForm />
          </div>

          {/* Quick Actions */}
          <div className="mt-8 pt-6 border-t border-border">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  const role = localStorage.getItem("userRole");

                  let targetPath = "/";
                  if (role === "vendor") targetPath = "/vendor-dashboard";
                  else if (role === "reviewer")
                    targetPath = "/reviewer-dashboard";
                  else if (role === "approval")
                    targetPath = "/approver-dashboard"; // jika ada role lain

                  navigate(targetPath);
                }}
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

export default DetailBastPage;
