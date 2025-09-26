# CertifyX API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Endpoints

### Authentication

#### POST /auth/register
Register a new user
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "admin|learner|verifier",
  "name": "User Name",
  "institution": "Institution Name",
  "walletAddress": "0x123..."
}
```

#### POST /auth/login
Login user
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### GET /auth/me
Get current user profile (Protected)

#### PUT /auth/profile
Update user profile (Protected)

### Certificates

#### POST /certificates/issue
Issue single certificate (Admin only)
```json
{
  "learnerAddress": "0x456...",
  "learnerName": "John Doe",
  "qualification": "Web Development",
  "institution": "Tech Institute"
}
```

#### POST /certificates/bulk-issue
Bulk issue certificates via CSV upload (Admin only)
- Content-Type: multipart/form-data
- Field: csvFile (CSV file)

CSV Format:
```csv
learnerName,qualification,institution,learnerAddress
John Doe,Web Development,Tech Institute,0x123...
```

#### GET /certificates/verify/:adminAddress/:certificateId
Verify certificate (Public)

#### GET /certificates/learner/:address
Get certificates for learner (Protected)

#### GET /certificates/analytics
Get admin analytics (Admin only)

## Response Format

### Success Response
```json
{
  "success": true,
  "data": {...}
}
```

### Error Response
```json
{
  "error": "Error message"
}
```

## Integration APIs

### DigiLocker Integration
Automatic upload to DigiLocker after certificate issuance

### Skill India Digital Integration
Automatic registration with Skill India platform

### NCRF Integration
Automatic submission to National Credit Framework

## Rate Limiting
- 100 requests per minute per IP
- 1000 requests per hour per authenticated user

## Error Codes
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 429: Too Many Requests
- 500: Internal Server Error