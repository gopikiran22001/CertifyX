// Mock data for frontend-only operation
export const mockCertificates = [
  {
    certificateId: 1,
    learnerAddress: "0x123456789abcdef",
    learnerName: "John Doe",
    qualification: "Web Development Certification",
    institution: "Tech Institute",
    issueDate: new Date("2024-01-15"),
    adminAddress: "0x99f9ffaaa037851fa145a6eea15bd4572019848daa7559b3a47f0e409ca2866a",
    verificationCount: 5,
    qrCode: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
  },
  {
    certificateId: 2,
    learnerAddress: "0x987654321fedcba",
    learnerName: "Jane Smith",
    qualification: "Data Science Certification",
    institution: "AI Academy",
    issueDate: new Date("2024-02-20"),
    adminAddress: "0x99f9ffaaa037851fa145a6eea15bd4572019848daa7559b3a47f0e409ca2866a",
    verificationCount: 3,
    qrCode: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
  }
];

export const mockAnalytics = {
  totalIssued: 25,
  totalVerified: 18,
  verificationRate: "72.00",
  recentCertificates: mockCertificates
};