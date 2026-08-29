import { Routes, Route } from 'react-router-dom';
import SiteLayout from './components/site/SiteLayout';
import SiteHomePage from './pages/site/HomePage';
import SiteAboutPage from './pages/site/AboutPage';
import SiteAdvocacyPage from './pages/site/AdvocacyPage';
import SiteOurWorkPage from './pages/site/OurWorkPage';
import SiteImpactPage from './pages/site/ImpactPage';
import SiteGetInvolvedPage from './pages/site/GetInvolvedPage';
import SiteEnrollLandingPage from './pages/site/EnrollLandingPage';

import MmaEventsRoot from './components/layout/MmaEventsRoot';
import ProtectedRoute from './components/common/ProtectedRoute';
import HomePage from './pages/HomePage';
import ResourcesPage from './pages/ResourcesPage';
import AboutPage from './pages/AboutPage';
import TicketPage from './pages/TicketPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import EnrollPage from './pages/EnrollPage';
import AccountPage from './pages/AccountPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotesAnalyzerPage from './pages/NotesAnalyzerPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<SiteHomePage />} />
        <Route path="/about" element={<SiteAboutPage />} />
        <Route path="/advocacy" element={<SiteAdvocacyPage />} />
        <Route path="/our-work" element={<SiteOurWorkPage />} />
        <Route path="/impact" element={<SiteImpactPage />} />
        <Route path="/get-involved" element={<SiteGetInvolvedPage />} />
        <Route path="/enroll" element={<SiteEnrollLandingPage />} />
      </Route>

      <Route path="/mma-events" element={<MmaEventsRoot />}>
        <Route index element={<HomePage />} />
        <Route path="resources" element={<ResourcesPage />} />
        <Route path="about" element={<AboutPage />} />

        <Route
          path="tickets"
          element={
            <ProtectedRoute>
              <TicketPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="orders"
          element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="notes-analyzer"
          element={
            <ProtectedRoute>
              <NotesAnalyzerPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="enroll"
          element={
            <ProtectedRoute>
              <EnrollPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="account"
          element={
            <ProtectedRoute>
              <AccountPage />
            </ProtectedRoute>
          }
        />

        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
