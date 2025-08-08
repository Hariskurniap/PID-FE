import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";

// Import halaman baru yang ingin ditambahkan
import SigninOidc from "pages/auth/SigninOidc";

// Import halaman lain
import VendorLogin from "pages/vendor-login";
import VendorDashboard from "pages/vendor-dashboard";
import InvoiceUpload from "pages/invoice-upload";
import InternalStaffDashboard from "pages/internal-staff-dashboard";
import InternalPicDashboard from "pages/internal-pic-dashboard";
import DocumentReview from "pages/document-review";
import InvoiceStatusTracking from "pages/invoice-status-tracking";
import InvoiceMappingPic from "pages/invoice-mapping-pic";
import InvoiceReview from "pages/invoice-review";
import Pengguna from "pages/pengguna";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          <Route path="/" element={<VendorLogin />} />
          <Route path="/vendor-login" element={<VendorLogin />} />
          <Route path="/signin-oidc" element={<SigninOidc />} />  {/* Tambahkan route baru di sini */}
          <Route path="/vendor-dashboard" element={<VendorDashboard />} />
          <Route path="/invoice-upload" element={<InvoiceUpload />} />
          <Route path="/internal-staff-dashboard" element={<InternalStaffDashboard />} />
          <Route path="/internal-pic-dashboard" element={<InternalPicDashboard />} />
          <Route path="/document-review" element={<DocumentReview />} />
          <Route path="/invoice-status-tracking" element={<InvoiceStatusTracking />} />
          <Route path="/invoice-mapping-pic/:id" element={<InvoiceMappingPic />} />
          <Route path="/pengguna" element={<Pengguna />} />
          <Route path="/invoice-review/:id" element={<InvoiceReview />} />
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
