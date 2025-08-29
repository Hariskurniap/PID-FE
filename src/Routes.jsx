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

import ContractUpload from "pages/contract-upload";
import ReceiptUpload from "pages/receipt-upload";
import MasterVendor from "pages/master-vendor";

import Bast from "pages/bast";
// import EditBASTForm from './pages/bast/components/EditBASTForm';
import EditBastPage from './pages/bast/EditBastPage';
import DetailBastPage from './pages/bast/DetailBastPage';

import ReviewerDashboard from "pages/reviewer-dashboard";
import ReviewBastPage from "./pages/bast/ReviewBastPage";

import ApproverDashboard from "pages/approver-dashboard";
import ApproverBastPage from "./pages/bast/ApproverBastPage";

import VendorReviewDashboard from "pages/vendor-review-dashboard";
import ReviewVendorBastPage from "./pages/bast/ReviewVendorBastPage";



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
          <Route path="/contract-upload" element={<ContractUpload />} />
          <Route path="/receipt-upload" element={<ReceiptUpload />} />
          <Route path="/internal-staff-dashboard" element={<InternalStaffDashboard />} />
          <Route path="/internal-pic-dashboard" element={<InternalPicDashboard />} />
          <Route path="/document-review" element={<DocumentReview />} />
          <Route path="/invoice-status-tracking" element={<InvoiceStatusTracking />} />
          <Route path="/invoice-mapping-pic/:id" element={<InvoiceMappingPic />} />
          <Route path="/pengguna" element={<Pengguna />} />
          <Route path="/bast" element={<Bast />} />
          {/* <Route path="/bast/edit" element={<EditBASTForm />} /> */}
          <Route path="/bast/edit" element={<EditBastPage />} />
          <Route path="/bast/details" element={<DetailBastPage />} />
          <Route path="/bast/review" element={<ReviewBastPage />} />
          <Route path="/bast/approve" element={<ApproverBastPage />} />
          <Route path="/bast/reviewVendor" element={<ReviewVendorBastPage />} />
          <Route path="/master-vendor" element={<MasterVendor />} />
          <Route path="/invoice-review/:id" element={<InvoiceReview />} />
          <Route path="/reviewer-dashboard" element={<ReviewerDashboard/>} />
          <Route path="/approver-dashboard" element={<ApproverDashboard/>} />
          <Route path="/vendor-review-dashboard" element={<VendorReviewDashboard/>} />
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
