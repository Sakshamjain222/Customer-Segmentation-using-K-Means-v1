import React, { useRef } from 'react';
import { UploadCloud, FileText } from 'lucide-react';

interface Props {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
}

export const CsvUploader: React.FC<Props> = ({ onFileSelect, selectedFile }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  return (
    <div
      className="card"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      style={{
        border: '2px dashed rgba(99, 102, 241, 0.4)',
        textAlign: 'center',
        padding: '2.5rem 1.5rem',
        cursor: 'pointer',
        background: 'rgba(99, 102, 241, 0.04)',
        transition: 'all 0.2s ease'
      }}
      onClick={() => inputRef.current?.click()}
    >
      <input
        type="file"
        ref={inputRef}
        onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])}
        accept=".csv"
        style={{ display: 'none' }}
      />

      {selectedFile ? (
        <div>
          <FileText size={48} color="var(--cyan)" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ color: '#fff', fontSize: '1.2rem' }}>{selectedFile.name}</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            {(selectedFile.size / 1024).toFixed(2)} KB • Ready for batch clustering
          </p>
          <div style={{ marginTop: '1rem', color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600 }}>
            Click or drag another CSV file to replace
          </div>
        </div>
      ) : (
        <div>
          <UploadCloud size={54} color="var(--primary)" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ color: '#fff', fontSize: '1.25rem' }}>Drag & Drop Customer Dataset CSV</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '380px', margin: '0.5rem auto 1.25rem auto' }}>
            Expected format: <code style={{ color: 'var(--cyan)' }}>CustomerID, Genre, Age, Annual Income (k$), Spending Score (1-100)</code>
          </p>
          <span className="btn btn-primary" style={{ padding: '0.6rem 1.25rem' }}>
            Browse Local File
          </span>
        </div>
      )}
    </div>
  );
};
