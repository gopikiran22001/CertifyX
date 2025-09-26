const axios = require('axios');

class IntegrationService {
  constructor() {
    this.digiLockerAPI = process.env.DIGILOCKER_API_URL;
    this.skillIndiaAPI = process.env.SKILL_INDIA_API_URL;
    this.ncrfAPI = process.env.NCRF_API_URL;
  }

  async uploadToDigiLocker(certificateData) {
    try {
      const response = await axios.post(`${this.digiLockerAPI}/upload`, {
        documentType: 'certificate',
        learnerAadhaar: certificateData.learnerAadhaar,
        certificateId: certificateData.certificateId,
        issuerName: certificateData.institution,
        documentName: `${certificateData.qualification} Certificate`,
        documentData: certificateData.qrCode,
        metadata: {
          learnerName: certificateData.learnerName,
          qualification: certificateData.qualification,
          issueDate: certificateData.issueDate
        }
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.DIGILOCKER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('DigiLocker upload failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  async registerWithSkillIndia(certificateData) {
    try {
      const response = await axios.post(`${this.skillIndiaAPI}/register-credential`, {
        credentialId: certificateData.certificateId,
        learnerDetails: {
          name: certificateData.learnerName,
          walletAddress: certificateData.learnerAddress
        },
        qualificationDetails: {
          name: certificateData.qualification,
          level: 'vocational',
          sector: 'technology',
          institution: certificateData.institution
        },
        blockchainProof: {
          network: 'aptos',
          transactionHash: certificateData.transactionHash,
          contractAddress: process.env.MODULE_ADDRESS
        }
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.SKILL_INDIA_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Skill India registration failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  async submitToNCRF(certificateData) {
    try {
      const response = await axios.post(`${this.ncrfAPI}/submit-credential`, {
        credentialId: certificateData.certificateId,
        nqfLevel: certificateData.nqfLevel || 4,
        creditPoints: certificateData.creditPoints || 10,
        learnerProfile: {
          name: certificateData.learnerName,
          identifier: certificateData.learnerAddress
        },
        qualificationProfile: {
          title: certificateData.qualification,
          provider: certificateData.institution,
          completionDate: certificateData.issueDate
        }
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.NCRF_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });
      return { success: true, data: response.data };
    } catch (error) {
      console.error('NCRF submission failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  async processAllIntegrations(certificateData) {
    const results = {
      digiLocker: await this.uploadToDigiLocker(certificateData),
      skillIndia: await this.registerWithSkillIndia(certificateData),
      ncrf: await this.submitToNCRF(certificateData)
    };
    return results;
  }
}

module.exports = new IntegrationService();