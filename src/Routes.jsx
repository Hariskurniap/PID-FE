import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";

// Import halaman baru
import SigninOidc from "pages/auth/SigninOidc";
import VendorLogin from "pages/vendor-login";
import VendorDashboard from "pages/vendor-dashboard";
import InternalStaffDashboard from "pages/internal-staff-dashboard";
import Pengguna from "pages/pengguna";
import NotFound from "pages/NotFound";
import MasterVendor from "pages/master-vendor";

import Bast from "pages/bast";
import EditBastPage from "./pages/bast/EditBastPage";
import DetailBastPage from "./pages/bast/DetailBastPage";
import TrackingBastPage from "./pages/bast/TrackingBastPage";
import ReviewBastPage from "./pages/bast/ReviewBastPage";
import ApproverBastPage from "./pages/bast/ApproverBastPage";
import ReviewVendorBastPage from "./pages/bast/ReviewVendorBastPage";

// 🆕 Import halaman Input SA/GR
import InputSagrPage from "./pages/bast/InputSagrPage";

import ReviewerDashboard from "pages/reviewer-dashboard";
import ApproverDashboard from "pages/approver-dashboard";
import VendorReviewDashboard from "pages/vendor-review-dashboard";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          <Route path="/" element={<VendorLogin />} />
          <Route path="/vendor-login" element={<VendorLogin />} />
          <Route path="/signin-oidc" element={<SigninOidc />} />

          {/* Dashboard */}
          <Route path="/vendor-dashboard" element={<VendorDashboard />} />
          <Route path="/internal-staff-dashboard" element={<InternalStaffDashboard />} />
          <Route path="/reviewer-dashboard" element={<ReviewerDashboard />} />
          <Route path="/approver-dashboard" element={<ApproverDashboard />} />
          <Route path="/vendor-review-dashboard" element={<VendorReviewDashboard />} />

          {/* BAST */}
          <Route path="/bast" element={<Bast />} />
          <Route path="/bast/edit" element={<EditBastPage />} />
          <Route path="/bast/details" element={<DetailBastPage />} />
          <Route path="/bast/tracking" element={<TrackingBastPage />} />
          <Route path="/bast/review" element={<ReviewBastPage />} />
          <Route path="/bast/approve" element={<ApproverBastPage />} />
          <Route path="/bast/reviewVendor" element={<ReviewVendorBastPage />} />

          {/* 🆕 Route baru untuk Input SA/GR */}
          <Route path="/bast/inputSagr" element={<InputSagrPage />} />

          {/* Master Data */}
          <Route path="/master-vendor" element={<MasterVendor />} />
          <Route path="/pengguna" element={<Pengguna />} />

          {/* Not Found */}
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
