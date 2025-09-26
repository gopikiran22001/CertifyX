const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const QRCode = require('qrcode');
const Certificate = require('../models/Certificate');
const aptosService = require('../services/aptosService');
const integrationService = require('../services/integrationService');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Issue single certificate
router.post('/issue', auth, authorize('admin'), async (req, res) => {
  try {
    const { learnerAddress, learnerName, qualification, institution } = req.body;

    // Issue on blockchain
    const txResult = await aptosService.issueCertificate(learnerAddress, learnerName, qualification, institution);
    
    // Get certificate ID from events
    const certificateId = txResult.events?.[0]?.data?.certificate_id || Date.now();
    
    // Generate QR code
    const qrData = await QRCode.toDataURL(`${process.env.FRONTEND_URL}/verify?admin=${req.user.walletAddress}&id=${certificateId}`);
    
    // Save to database
    const certificate = new Certificate({
      certificateId,
      learnerAddress,
      learnerName,
      qualification,
      institution,
      adminAddress: req.user.walletAddress,
      transactionHash: txResult.hash,
      qrCode: qrData
    });
    
    await certificate.save();

    // Process integrations asynchronously
    integrationService.processAllIntegrations(certificate).then(results => {
      certificate.digiLockerStatus = results.digiLocker.success ? 'uploaded' : 'failed';
      certificate.skillIndiaStatus = results.skillIndia.success ? 'registered' : 'failed';
      certificate.save();
    });

    res.json({ success: true, certificate, transactionHash: txResult.hash });
  } catch (error) {
    console.error('Certificate issuance failed:', error);
    res.status(500).json({ error: 'Certificate issuance failed' });
  }
});

// Bulk issue certificates
router.post('/bulk-issue', auth, authorize('admin'), upload.single('csvFile'), async (req, res) => {
  try {
    const results = [];
    const errors = [];

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', async (row) => {
        try {
          const txResult = await aptosService.issueCertificate(
            row.learnerAddress,
            row.learnerName,
            row.qualification,
            row.institution
          );
          
          const certificateId = txResult.events?.[0]?.data?.certificate_id || Date.now();
          const qrData = await QRCode.toDataURL(`${process.env.FRONTEND_URL}/verify?admin=${req.user.walletAddress}&id=${certificateId}`);
          
          const certificate = new Certificate({
            certificateId,
            learnerAddress: row.learnerAddress,
            learnerName: row.learnerName,
            qualification: row.qualification,
            institution: row.institution,
            adminAddress: req.user.walletAddress,
            transactionHash: txResult.hash,
            qrCode: qrData
          });
          
          await certificate.save();
          results.push(certificate);
        } catch (error) {
          errors.push({ row, error: error.message });
        }
      })
      .on('end', () => {
        fs.unlinkSync(req.file.path);
        res.json({ success: true, issued: results.length, errors: errors.length, results, errors });
      });
  } catch (error) {
    res.status(500).json({ error: 'Bulk issuance failed' });
  }
});

// Verify certificate
router.get('/verify/:adminAddress/:certificateId', async (req, res) => {
  try {
    const { adminAddress, certificateId } = req.params;
    
    // Verify on blockchain
    const blockchainResult = await aptosService.verifyCertificate(adminAddress, parseInt(certificateId));
    
    if (blockchainResult[0]) {
      // Update verification count
      await Certificate.findOneAndUpdate(
        { certificateId: parseInt(certificateId) },
        { $inc: { verificationCount: 1 }, status: 'verified' }
      );
      
      res.json({
        valid: true,
        learnerName: blockchainResult[1],
        qualification: blockchainResult[2],
        institution: blockchainResult[3],
        issueDate: new Date(blockchainResult[4] * 1000).toISOString()
      });
    } else {
      res.json({ valid: false });
    }
  } catch (error) {
    res.status(500).json({ error: 'Verification failed' });
  }
});

// Get learner certificates
router.get('/learner/:address', auth, async (req, res) => {
  try {
    const certificates = await Certificate.find({ learnerAddress: req.params.address });
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch certificates' });
  }
});

// Get admin analytics
router.get('/analytics', auth, authorize('admin'), async (req, res) => {
  try {
    const totalIssued = await Certificate.countDocuments({ adminAddress: req.user.walletAddress });
    const totalVerified = await Certificate.countDocuments({ adminAddress: req.user.walletAddress, status: 'verified' });
    const recentCertificates = await Certificate.find({ adminAddress: req.user.walletAddress })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      totalIssued,
      totalVerified,
      verificationRate: totalIssued > 0 ? (totalVerified / totalIssued * 100).toFixed(2) : 0,
      recentCertificates
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

module.exports = router;