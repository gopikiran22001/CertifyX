import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { QRCodeSVG } from 'qrcode.react';
import { mockCertificates } from '../utils/mockData';

const LearnerPortal = ({ wallet }) => {
  const [certificates, setCertificates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (wallet) {
      fetchCertificates();
    }
  }, [wallet]);

  const fetchCertificates = async () => {
    setIsLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setCertificates(mockCertificates);
      setIsLoading(false);
    }, 1000);
  };

  const downloadQR = (certificate) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      const link = document.createElement('a');
      link.download = `certificate-${certificate.certificateId}-qr.png`;
      link.href = canvas.toDataURL();
      link.click();
    };
    
    img.src = certificate.qrCode;
  };

  if (!wallet) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">{t('learner.certificates')}</h1>
        <p className="text-gray-600">Please connect your wallet to view certificates</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">{t('learner.certificates')}</h1>
      
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4">{t('common.loading')}</p>
        </div>
      ) : certificates.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">{t('learner.noCertificates')}</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {certificates.map((cert) => (
            <div key={cert.certificateId} className="bg-white rounded-lg shadow-md p-6 border">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-blue-600">{cert.qualification}</h3>
                  <p className="text-gray-600">{cert.institution}</p>
                  <p className="text-sm text-gray-500">
                    Issued: {new Date(cert.issueDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-center">
                  <QRCodeSVG
                    value={`${window.location.origin}/verify?admin=${cert.adminAddress}&id=${cert.certificateId}`}
                    size={80}
                    className="border rounded"
                  />
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-sm">
                  <span>Certificate ID: {cert.certificateId}</span>
                  <span className="text-green-600">✓ Verified on Blockchain</span>
                </div>
                
                <div className="mt-3 flex space-x-2">
                  <button
                    onClick={() => downloadQR(cert)}
                    className="px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                  >
                    {t('learner.download')}
                  </button>
                  
                  <button
                    onClick={() => window.open(`/verify?admin=${cert.adminAddress}&id=${cert.certificateId}`, '_blank')}
                    className="px-4 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                  >
                    View Certificate
                  </button>
                </div>
                
                {cert.verificationCount > 0 && (
                  <p className="text-xs text-gray-500 mt-2">
                    Verified {cert.verificationCount} times
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LearnerPortal;