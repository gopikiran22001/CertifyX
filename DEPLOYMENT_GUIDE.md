# CertifyX Deployment Guide

## Prerequisites

1. **Node.js 18+**
2. **Aptos CLI** - Install from [Aptos Labs](https://aptos.dev/tools/aptos-cli/)
3. **Docker & Docker Compose**
4. **MongoDB** (or use Docker)
5. **Petra Wallet** browser extension

## Quick Deployment

### 1. Automated Deployment
```bash
chmod +x deployment/deploy.sh
./deployment/deploy.sh
```

### 2. Manual Deployment

#### Step 1: Deploy Smart Contracts
```bash
cd move
aptos move compile
aptos move publish --profile testnet
```

#### Step 2: Configure Environment
```bash
# Backend
cp backend/.env.example backend/.env
# Update MODULE_ADDRESS in backend/.env

# Frontend
# Update MODULE_ADDRESS in src/utils/aptos.js
```

#### Step 3: Install Dependencies
```bash
# Frontend
npm install

# Backend
cd backend
npm install
```

#### Step 4: Start Services
```bash
# Option 1: Docker Compose
docker-compose up -d

# Option 2: Manual
# Terminal 1: Start MongoDB
mongod

# Terminal 2: Start Backend
cd backend
npm start

# Terminal 3: Start Frontend
npm start
```

## Configuration

### Environment Variables

#### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/certifyx
JWT_SECRET=your-super-secret-jwt-key
MODULE_ADDRESS=0x1234...
ADMIN_PRIVATE_KEY=0xabc123...
FRONTEND_URL=http://localhost:3000

# External APIs
DIGILOCKER_API_KEY=your-key
SKILL_INDIA_API_KEY=your-key
NCRF_API_KEY=your-key
```

#### Frontend
Update `src/utils/aptos.js`:
```javascript
export const MODULE_ADDRESS = "0x1234..."; // Your deployed contract address
```

## Testing

### Smart Contracts
```bash
cd move
aptos move test
```

### Backend API
```bash
cd backend
npm test
```

### Frontend
```bash
npm test
```

## Production Deployment

### 1. Build for Production
```bash
# Frontend
npm run build

# Backend
cd backend
npm start
```

### 2. Environment Setup
- Set `NODE_ENV=production`
- Use production MongoDB instance
- Configure proper JWT secrets
- Set up SSL certificates
- Configure reverse proxy (Nginx)

### 3. Security Checklist
- [ ] Change default JWT secret
- [ ] Use environment variables for sensitive data
- [ ] Enable HTTPS
- [ ] Set up proper CORS policies
- [ ] Configure rate limiting
- [ ] Set up monitoring and logging

## Scaling Considerations

### Database
- Use MongoDB Atlas for cloud deployment
- Set up proper indexing
- Configure replica sets for high availability

### Backend
- Use PM2 for process management
- Set up load balancing
- Configure horizontal scaling

### Frontend
- Use CDN for static assets
- Enable gzip compression
- Implement caching strategies

## Monitoring

### Health Checks
- Backend: `GET /health`
- Database connectivity
- Blockchain connectivity

### Metrics to Monitor
- Certificate issuance rate
- Verification requests
- API response times
- Database performance
- Blockchain transaction costs

## Troubleshooting

### Common Issues

1. **Smart Contract Deployment Fails**
   - Check Aptos CLI configuration
   - Ensure sufficient APT balance
   - Verify network connectivity

2. **Database Connection Issues**
   - Check MongoDB service status
   - Verify connection string
   - Check firewall settings

3. **Wallet Connection Problems**
   - Ensure Petra Wallet is installed
   - Check network configuration (testnet/mainnet)
   - Verify wallet has sufficient balance

4. **API Integration Failures**
   - Verify API keys and endpoints
   - Check network connectivity
   - Review API documentation

## Support

For deployment issues:
1. Check logs: `docker-compose logs`
2. Verify configuration files
3. Test individual components
4. Review API documentation