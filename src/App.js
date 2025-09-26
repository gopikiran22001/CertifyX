import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import WalletConnect from './components/WalletConnect';
import AdminDashboard from './pages/AdminDashboard';
import VerifyPage from './pages/VerifyPage';
import LearnerPortal from './pages/LearnerPortal';
import './i18n';

function App() {
  const [wallet, setWallet] = useState(null);
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-8">
                <Link to="/" className="text-xl font-bold text-blue-600">
                  CertifyX
                </Link>
                
                <div className="flex space-x-4">
                  <Link
                    to="/"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    {t('admin.dashboard')}
                  </Link>
                  <Link
                    to="/verify"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    {t('verifier.title')}
                  </Link>
                  <Link
                    to="/learner"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    {t('learner.certificates')}
                  </Link>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <select
                  onChange={(e) => changeLanguage(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                  defaultValue="en"
                >
                  <option value="en">English</option>
                  <option value="hi">हिंदी</option>
                </select>
                
                <WalletConnect onWalletChange={setWallet} />
              </div>
            </div>
          </div>
        </nav>

        <main className="py-8">
          <Routes>
            <Route path="/" element={<AdminDashboard wallet={wallet} />} />
            <Route path="/verify" element={<VerifyPage />} />
            <Route path="/learner" element={<LearnerPortal wallet={wallet} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;