# CertifyX Frontend Setup

## Quick Start (Frontend Only)

1. **Install Dependencies**
```bash
npm install
```

2. **Start Development Server**
```bash
npm start
```

3. **Access Application**
- Open http://localhost:3000
- Install Petra Wallet browser extension
- Connect to Aptos Testnet

## Features Available

### ✅ Working Features
- **Admin Dashboard** - Issue certificates directly to blockchain
- **Certificate Verification** - Verify certificates via QR or ID
- **Learner Portal** - View mock certificates (demo data)
- **Multilingual Support** - Switch between English/Hindi
- **QR Code Generation** - Generate verification QRs
- **Wallet Integration** - Connect Petra Wallet

### 📝 Demo Data
- Mock certificates for testing verification
- Sample analytics data for admin dashboard
- Fallback verification for demo purposes

## Usage

### 1. Admin (Certificate Issuance)
- Connect Petra Wallet
- Fill learner details
- Click "Issue Certificate"
- Transaction sent to Aptos blockchain
- Gas fees paid from connected wallet

### 2. Verifier (Certificate Verification)
- Enter admin address: `0x99f9ffaaa037851fa145a6eea15bd4572019848daa7559b3a47f0e409ca2866a`
- Enter certificate ID: `1` or `2` (demo data)
- Or scan QR code
- View certificate details

### 3. Learner (View Certificates)
- Connect wallet to view mock certificates
- Download QR codes
- View certificate details

## Smart Contract

**Deployed Address:** `0x99f9ffaaa037851fa145a6eea15bd4572019848daa7559b3a47f0e409ca2866a`

## Wallet Setup

1. Install [Petra Wallet](https://petra.app/)
2. Switch to Aptos Testnet
3. Get testnet APT from [faucet](https://aptoslabs.com/testnet-faucet)
4. Connect wallet in CertifyX

## Next Steps

To enable full functionality:
1. Deploy backend API
2. Set up MongoDB database
3. Configure external integrations
4. Update frontend to use real APIs

The frontend is fully functional for blockchain operations!