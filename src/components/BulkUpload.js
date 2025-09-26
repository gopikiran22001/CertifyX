import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const BulkUpload = ({ onUploadComplete }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [results, setResults] = useState(null);
  const { t } = useTranslation();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResults(null);
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('csvFile', file);

    try {
      const response = await fetch('/api/certificates/bulk-issue', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      const data = await response.json();
      setResults(data);
      onUploadComplete?.(data);
    } catch (error) {
      console.error('Bulk upload failed:', error);
      setResults({ success: false, error: 'Upload failed' });
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = 'learnerName,qualification,institution,learnerAddress\nJohn Doe,Web Development,Tech Institute,0x123...\nJane Smith,Data Science,AI Academy,0x456...';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'certificate-template.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Bulk Certificate Issuance</h3>
      
      <div className="space-y-4">
        <div>
          <button
            onClick={downloadTemplate}
            className="text-blue-500 hover:text-blue-700 text-sm underline"
          >
            Download CSV Template
          </button>
        </div>

        <div>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <button
          onClick={handleUpload}
          disabled={!file || isUploading}
          className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:opacity-50"
        >
          {isUploading ? 'Processing...' : 'Upload & Issue Certificates'}
        </button>
      </div>

      {results && (
        <div className="mt-6 p-4 border rounded">
          {results.success ? (
            <div className="text-green-700">
              <h4 className="font-semibold">Upload Complete!</h4>
              <p>Successfully issued: {results.issued} certificates</p>
              {results.errors > 0 && (
                <p className="text-red-600">Failed: {results.errors} certificates</p>
              )}
            </div>
          ) : (
            <div className="text-red-700">
              <h4 className="font-semibold">Upload Failed</h4>
              <p>{results.error}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BulkUpload;