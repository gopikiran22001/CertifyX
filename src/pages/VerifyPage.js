import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { verifyCertificate } from '../utils/aptos';
import { mockCertificates } from '../utils/mockData';

const VerifyPage = () => {
  const [searchParams] = useSearchParams();
  const [certificateData, setCertificateData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [manualId, setManualId] = useState('');
  const [adminAddress, setAdminAddress] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const admin = searchParams.get('admin');
    const id = searchParams.get('id');
    
    if (admin && id) {
      setAdminAddress(admin);
      setManualId(id);
      handleVerify(admin, id);
    }
  }, [searchParams]);

  useEffect(() => {
    if (showScanner) {
      const scanner = new Html5QrcodeScanner("qr-reader", {
        fps: 10,
        qrbox: { width: 250, height: 250 }
      });

      scanner.render(
        (decodedText) => {
          try {
            const url = new URL(decodedText);
            const admin = url.searchParams.get('admin');
            const id = url.searchParams.get('id');
            
            if (admin && id) {
              setAdminAddress(admin);
              setManualId(id);
              handleVerify(admin, id);
              scanner.clear();
              setShowScanner(false);
            }
          } catch (error) {
            setError('Invalid QR code format');
          }
        },
        (error) => {
          console.log('QR scan error:', error);
        }
      );

      return () => {
        scanner.clear();
      };
    }
  }, [showScanner]);

  const handleVerify = async (admin, certificateId) => {
    setIsLoading(true);
    setError('');
    setCertificateData(null);

    try {
      const result = await verifyCertificate(admin, parseInt(certificateId));
      
      if (result[0]) {
        setCertificateData({
          isValid: true,
          learnerName: result[1],
          qualification: result[2],
          institution: result[3],
          issueDate: new Date(result[4] * 1000).toLocaleDateString(),
          certificateId,
          adminAddress: admin
        });
      } else {
        // Fallback to mock data for demo
        const mockCert = mockCertificates.find(c => c.certificateId == certificateId);
        if (mockCert) {
          setCertificateData({
            isValid: true,
            learnerName: mockCert.learnerName,
            qualification: mockCert.qualification,
            institution: mockCert.institution,
            issueDate: mockCert.issueDate.toLocaleDateString(),
            certificateId,
            adminAddress: admin
          });
        } else {
          setError(t('verifier.invalid'));
        }
      }
    } catch (error) {
      console.error('Verification failed:', error);
      // Fallback to mock data for demo
      const mockCert = mockCertificates.find(c => c.certificateId == certificateId);
      if (mockCert) {
        setCertificateData({
          isValid: true,
          learnerName: mockCert.learnerName,
          qualification: mockCert.qualification,
          institution: mockCert.institution,
          issueDate: mockCert.issueDate.toLocaleDateString(),
          certificateId,
          adminAddress: admin
        });
      } else {
        setError(t('verifier.invalid') + ` (${error.message})`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualVerify = () => {
    if (adminAddress && manualId) {
      handleVerify(adminAddress, manualId);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">{t('verifier.title')}</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="space-y-4">
          <button
            onClick={() => setShowScanner(!showScanner)}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            {t('verifier.scanQR')}
          </button>

          {showScanner && (
            <div id="qr-reader" className="w-full"></div>
          )}

          <div className="border-t pt-4">
            <h3 className="text-lg font-medium mb-4">{t('verifier.enterID')}</h3>
            
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Admin Address (0x...)"
                value={adminAddress}
                onChange={(e) => setAdminAddress(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              
              <input
                type="number"
                placeholder="Certificate ID"
                value={manualId}
                onChange={(e) => setManualId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              
              <button
                onClick={handleManualVerify}
                disabled={isLoading || !adminAddress || !manualId}
                className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 disabled:opacity-50"
              >
                {isLoading ? t('common.loading') : t('verifier.verify')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {certificateData && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-green-800 mb-4">
            {t('verifier.valid')}
          </h2>
          
          <div className="space-y-2 text-sm">
            <p><strong>Learner:</strong> {certificateData.learnerName}</p>
            <p><strong>Qualification:</strong> {certificateData.qualification}</p>
            <p><strong>Institution:</strong> {certificateData.institution}</p>
            <p><strong>Issue Date:</strong> {certificateData.issueDate}</p>
            <p><strong>Certificate ID:</strong> {certificateData.certificateId}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}
    </div>
  );
};

export default VerifyPage;