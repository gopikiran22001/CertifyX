import QRCode from 'qrcode';

export const generateCertificateQR = async (adminAddress, certificateId) => {
  const verificationUrl = `${window.location.origin}/verify?admin=${adminAddress}&id=${certificateId}`;
  
  try {
    const qrDataURL = await QRCode.toDataURL(verificationUrl, {
      width: 256,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    return qrDataURL;
  } catch (error) {
    console.error('QR generation failed:', error);
    return null;
  }
};

export const generateCertificateData = (adminAddress, certificateId, learnerName, qualification, institution, issueDate) => {
  return {
    adminAddress,
    certificateId,
    learnerName,
    qualification,
    institution,
    issueDate: new Date(issueDate * 1000).toLocaleDateString(),
    verificationUrl: `${window.location.origin}/verify?admin=${adminAddress}&id=${certificateId}`
  };
};