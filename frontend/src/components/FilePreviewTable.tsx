import React from 'react';

interface Props {
  headers: string[];
  rows: string[][];
}

export const FilePreviewTable: React.FC<Props> = ({ headers, rows }) => {
  if (!rows || rows.length === 0) return null;

  return (
    <div className="card" style={{ marginTop: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ color: '#fff' }}>CSV Data Preview (First {rows.length} Rows)</h3>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Pre-Inference Telemetry Inspection</span>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th key={i}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                {r.map((cell, j) => (
                  <td key={j}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
