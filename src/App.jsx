import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from "./components/ui/toaster";
import { AuthProvider, useAuth } from './context/auth-context';
import { Landing } from './pages/Landing';
import { Terms } from './pages/legal/Terms';
import { Privacy } from './pages/legal/Privacy';
import { AUP } from './pages/legal/AUP';
import { Abuse } from './pages/legal/Abuse';
import { About } from './pages/About';


import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyEmail from './pages/VerifyEmail';
import Verify2FA from './pages/Verify2FA';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import SetPassword from './pages/SetPassword';
import CompleteProfile from './pages/CompleteProfile';
import ChangeEmail from './pages/ChangeEmail';
import NotFound from './pages/NotFound';
import DashboardLayout from './layouts/DashboardLayout';
import Overview from './pages/dashboard/Overview';
import MyDomains from './pages/dashboard/Domains';
import DNSRecords from './pages/dashboard/DNS';
import Register from './pages/dashboard/Register';
import Settings from './pages/dashboard/Settings';
import { Donate } from './pages/Donate';
import { Whois } from './pages/Whois';
import DomainDetail from './pages/dashboard/DomainDetail';
import Help from './pages/dashboard/Help';
import History from './pages/dashboard/History';
import VerifyGitHub from './pages/dashboard/VerifyGitHub';

// Placeholder pages
const Docs = () => <div className="p-10 min-h-screen bg-[#FFF8F0] pt-32"><h1 className="text-4xl font-bold">Docs (Coming Soon)</h1></div>;


const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = window.location.pathname;
  const search = window.location.search; // Preserve query params

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-[#FFF8F0] font-bold text-xl">Loading...</div>;
  if (!user) return <Navigate to={`/login${search}`} replace />; // Preserve ?error=... params

  // FORCE REDIRECT: Users with noreply emails MUST change their email
  // BUT: Allow them to complete migration steps first (/set-password, /complete-profile)
  // This ensures backend migration flow isn't disrupted
  const isNoreplyEmail = user?.email?.includes('noreply.github.com');
  const allowedPagesForNoreply = ['/change-email', '/set-password', '/complete-profile'];
  if (isNoreplyEmail && !allowedPagesForNoreply.includes(location)) {
    return <Navigate to={`/change-email?email=${encodeURIComponent(user.email)}&required=true`} replace />;
  }

  // SPECIAL: Allow access to /change-email for noreply users regardless of other checks
  // This is critical for the noreply email fix - users need to change their email first
  if (location === '/change-email') {
    return children ? children : <Outlet />;
  }

  // Identity (email/password) is managed by ZITADEL — no in-app password/profile gate.
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
          <Route path="/verify-2fa" element={<Verify2FA />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/complete-profile" element={<CompleteProfile />} />
          <Route path="/whois" element={<Whois />} />

          {/* Protected Routes including Set Password Force Flow */}
          <Route element={<ProtectedRoute />}>
            <Route path="/set-password" element={<SetPassword />} />
            <Route path="/change-email" element={<ChangeEmail />} />
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
            <Route path="/dashboard/verify-github" element={<VerifyGitHub />} />
          </Route>


          {/* Public Donate Page */}
          <Route path="/donate" element={<Donate />} />

          {/* WHOIS Lookup Page */}
          <Route path="/whois" element={<Whois />} />

          {/* Legal Pages */}
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/aup" element={<AUP />} />
          <Route path="/abuse" element={<Abuse />} />

          {/* Catch-all for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <DiscordPill />
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

const DiscordPill = () => (
  <a
    href="https://discord.gg/wr7s97cfM7"
    target="_blank"
    rel="noreferrer"
    className="fixed bottom-24 right-6 z-50 hidden md:flex items-center gap-2.5 bg-black dark:bg-white text-white dark:text-black px-4 py-2.5 rounded-full font-bold text-sm shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:scale-105 hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-all duration-300 group"
  >
    <div className="bg-white/20 dark:bg-black/10 p-1.5 rounded-full text-white dark:text-black flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 127.14 96.36" fill="currentColor">
        <path d="M107.7 8.07A105.15 105.15 0 0 0 81.47 0a72.06 72.06 0 0 0-3.36 6.83 97.68 97.68 0 0 0-29.08 0A72.37 72.37 0 0 0 45.67 0a105.14 105.14 0 0 0-26.23 8.07C2.04 33.72-2.38 58.62.9 83.33a105.73 105.73 0 0 0 32.17 16.14A77.7 77.7 0 0 0 40 85.34a69.8 69.8 0 0 1-10.87-5.18c.9-.67 1.8-1.34 2.66-2a75.57 75.57 0 0 0 63.56 0c.88.66 1.77 1.34 2.67 2a69.8 69.8 0 0 1-10.88 5.18 77.34 77.34 0 0 0 6.9 14.13 105.74 105.74 0 0 0 32.2-16.14c3.85-28.53-2.12-52.6-18.54-75.26zM42.3 65.23c-5.86 0-10.66-5.32-10.66-11.83 0-6.5 4.7-11.82 10.66-11.82 5.96 0 10.74 5.3 10.66 11.82 0 6.5-4.7 11.83-10.66 11.83zm42.54 0c-5.86 0-10.66-5.32-10.66-11.83 0-6.5 4.7-11.82 10.66-11.82 5.96 0 10.73 5.3 10.66 11.82 0 6.5-4.72 11.83-10.66 11.83z"/>
      </svg>
    </div>
    <span>Need help? Join Discord</span>
  </a>
);

export default App;
