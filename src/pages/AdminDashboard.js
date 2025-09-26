import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { issueCertificate } from '../utils/aptos';
import { generateCertificateQR } from '../utils/qr';
import { mockAnalytics } from '../utils/mockData';

const AdminDashboard = ({ wallet }) => {
  const [formData, setFormData] = useState({
    learnerName: '',
    qualification: '',
    institution: '',
    learnerAddress: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [analytics, setAnalytics] = useState(null);
  const [activeTab, setActiveTab] = useState('single');
  const { t } = useTranslation();

  useEffect(() => {
    if (wallet) {
      fetchAnalytics();
    }
  }, [wallet]);

  const fetchAnalytics = async () => {
    // Use mock data for frontend-only operation
    setAnalytics(mockAnalytics);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!wallet) {
      setMessage('Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const result = await issueCertificate(
        wallet,
        formData.learnerAddress,
        formData.learnerName,
        formData.qualification,
        formData.institution
      );

      setMessage(t('admin.success') + ` Transaction: ${result.hash}`);
      setFormData({
        learnerName: '',
        qualification: '',
        institution: '',
        learnerAddress: ''
      });
      
      // Update analytics
      setAnalytics(prev => ({
        ...prev,
        totalIssued: prev.totalIssued + 1
      }));
    } catch (error) {
      console.error('Certificate issuance failed:', error);
      setMessage(t('admin.error') + `: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">{t('admin.dashboard')}</h1>
      
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800">Total Issued</h3>
            <p className="text-3xl font-bold text-blue-600">{analytics.totalIssued}</p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800">Total Verified</h3>
            <p className="text-3xl font-bold text-green-600">{analytics.totalVerified}</p>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-purple-800">Verification Rate</h3>
            <p className="text-3xl font-bold text-purple-600">{analytics.verificationRate}%</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6">{t('admin.issueCertificate')}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('admin.learnerName')}
            </label>
            <input
              type="text"
              name="learnerName"
              value={formData.learnerName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('admin.qualification')}
            </label>
            <input
              type="text"
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('admin.institution')}
            </label>
            <input
              type="text"
              name="institution"
              value={formData.institution}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('admin.learnerAddress')}
            </label>
            <input
              type="text"
              name="learnerAddress"
              value={formData.learnerAddress}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0x..."
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? t('common.loading') : t('admin.issue')}
          </button>
        </form>

        {message && (
          <div className={`mt-4 p-3 rounded ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}
        </div>
    </div>
  );
};

export default AdminDashboard;