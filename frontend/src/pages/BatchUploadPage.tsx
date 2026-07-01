import React, { useState } from 'react';
import { CsvUploader } from '../components/CsvUploader';
import { FilePreviewTable } from '../components/FilePreviewTable';
import { BatchResultsTable } from '../components/BatchResultsTable';
import type { BatchPredictionResponse } from '../types';
import { Play } from 'lucide-react';

export const BatchUploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewRows, setPreviewRows] = useState<string[][]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [batchResult, setBatchResult] = useState<BatchPredictionResponse | null>(null);

  const handleFileSelect = (f: File) => {
    setFile(f);
    setBatchResult(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = (e.target?.result as string) || '';
      const lines = text.split('\n').filter((l) => l.trim().length > 0);
      if (lines.length > 0) {
        setHeaders(lines[0].split(',').map((h) => h.trim()));
        const rows = lines.slice(1, 11).map((l) => l.split(',').map((c) => c.trim()));
        setPreviewRows(rows);
      }
    };
    reader.readAsText(f);
  };

  const handleBatchProcess = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:8080/api/v1/predict/batch', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data: BatchPredictionResponse = await response.json();
        setBatchResult(data);
      } else {
        alert('Batch prediction via Spring Boot gateway failed. Ensure backend service is running.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error connecting to backend API Gateway on port 8080.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', color: '#fff' }}>Batch CSV Customer Segmentation</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Upload retail datasets for high-throughput multi-sample classification and marketing intelligence export.
        </p>
      </div>

      <CsvUploader onFileSelect={handleFileSelect} selectedFile={file} />

      {file && (
        <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
          <button onClick={handleBatchProcess} className="btn btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1rem' }} disabled={loading}>
            <Play size={18} />
            {loading ? 'Executing High-Throughput Inference...' : 'Execute Batch Segmentation'}
          </button>
        </div>
      )}

      {previewRows.length > 0 && !batchResult && (
        <FilePreviewTable headers={headers} rows={previewRows} />
      )}

      {batchResult && (
        <BatchResultsTable results={batchResult.results} jobId={batchResult.jobId} />
      )}
    </div>
  );
};
