import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from "./components/ui/toaster";
import { AuthProvider, useAuth } from './context/auth-context';
import { Landing } from './pages/Landing';
import { Terms } from './pages/legal/Terms';
import { Privacy } from './pages/legal/Privacy';
import { AUP } from './pages/legal/AUP';
import { Abuse } from './pages/legal/Abuse';
import { About } from './pages/About';
import { IncidentAnnouncement } from './components/IncidentAnnouncement';

import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import SetPassword from './pages/SetPassword';
import NotFound from './pages/NotFound';
import DashboardLayout from './layouts/DashboardLayout';
import Overview from './pages/dashboard/Overview';
import MyDomains from './pages/dashboard/Domains';
import DNSRecords from './pages/dashboard/DNS';
import Register from './pages/dashboard/Register';
import Settings from './pages/dashboard/Settings';
import { Donate } from './pages/Donate';
import DomainDetail from './pages/dashboard/DomainDetail';
import Help from './pages/dashboard/Help';
import History from './pages/dashboard/History';

// Placeholder pages
const Docs = () => <div className="p-10 min-h-screen bg-[#FFF8F0] pt-32"><h1 className="text-4xl font-bold">Docs (Coming Soon)</h1></div>;


const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = window.location.pathname;
  const search = window.location.search; // Preserve query params

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-[#FFF8F0] font-bold text-xl">Loading...</div>;
  if (!user) return <Navigate to={`/login${search}`} replace />; // Preserve ?error=... params

  // 1. Force Password Set Flow
  if (user && !user.hasPassword) {
    if (location !== '/set-password') {
      return <Navigate to="/set-password" replace />;
    }
  }

  // 2. Prevent access to Set Password if already set
  if (user && user.hasPassword && location === '/set-password') {
    return <Navigate to="/dashboard" replace />;
  }

  return children ? children : <Outlet />;
};

function App() {
  return (
    <AuthProvider>
      <Router>

        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/about" element={<About />} />

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected Routes including Set Password Force Flow */}
          <Route element={<ProtectedRoute />}>
            <Route path="/set-password" element={<SetPassword />} />
          </Route>

          <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Overview />} />
            <Route path="/overview" element={<Overview />} />
            <Route path="/my-domains" element={<MyDomains />} />
            <Route path="/domains/:id" element={<DomainDetail />} />
            <Route path="/dns" element={<DNSRecords />} />
            <Route path="/register" element={<Register />} />
            <Route path="/history" element={<History />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Settings />} />
            <Route path="/help" element={<Help />} />
          </Route>


          {/* Public Donate Page */}
          <Route path="/donate" element={<Donate />} />

          {/* Legal Pages */}
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/aup" element={<AUP />} />
          <Route path="/abuse" element={<Abuse />} />

          {/* Catch-all for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;
