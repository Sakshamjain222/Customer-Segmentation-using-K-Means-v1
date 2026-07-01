import React, { useState } from 'react';
import type { BatchPredictionItem } from '../types';
import { Download, Filter } from 'lucide-react';

interface Props {
  results: BatchPredictionItem[];
  jobId: string;
}

export const BatchResultsTable: React.FC<Props> = ({ results, jobId }) => {
  const [filterCluster, setFilterCluster] = useState<number | null>(null);

  if (!results || results.length === 0) return null;

  const filtered = filterCluster !== null ? results.filter((r) => r.clusterId === filterCluster) : results;

  const exportCsv = () => {
    const header = 'CustomerID,ClusterID,ClusterLabel,Confidence,Insights\n';
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      header +
      results.map((r) => `"${r.customerId}",${r.clusterId},"${r.clusterLabel}",${r.confidence},"${r.insights.replace(/"/g, '""')}"`).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `customer_segmentation_${jobId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getColorClass = (id: number) => `cluster-${id % 5}`;

  return (
    <div className="card" style={{ marginTop: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
        <div>
          <h3 style={{ color: '#fff', fontSize: '1.25rem' }}>Batch Processing Results ({filtered.length} profiles)</h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Job Reference: {jobId}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={16} color="var(--text-secondary)" />
            <select
              className="form-input"
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}
              value={filterCluster !== null ? filterCluster : ''}
              onChange={(e) => setFilterCluster(e.target.value === '' ? null : Number(e.target.value))}
            >
              <option value="">All Segments</option>
              <option value="0">Cluster 0</option>
              <option value="1">Cluster 1</option>
              <option value="2">Cluster 2</option>
              <option value="3">Cluster 3</option>
              <option value="4">Cluster 4</option>
            </select>
          </div>

          <button onClick={exportCsv} className="btn btn-primary" style={{ padding: '0.55rem 1.15rem' }}>
            <Download size={16} /> Export CSV Results
          </button>
        </div>
      </div>

      <div className="table-container" style={{ maxHeight: '500px' }}>
        <table className="data-table">
          <thead style={{ position: 'sticky', top: 0 }}>
            <tr>
              <th>Customer ID</th>
              <th>Cluster Assignment</th>
              <th>Confidence</th>
              <th>Strategy Insight</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, idx) => (
              <tr key={idx}>
                <td style={{ fontWeight: 600, color: '#fff' }}>{r.customerId}</td>
                <td>
                  <span className={`badge ${getColorClass(r.clusterId)}`}>
                    #{r.clusterId} • {r.clusterLabel}
                  </span>
                </td>
                <td>
                  <span style={{ fontWeight: 700, color: r.confidence >= 0.8 ? 'var(--emerald)' : 'var(--amber)' }}>
                    {Math.round(r.confidence * 100)}%
                  </span>
                </td>
                <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', maxWidth: '380px' }}>
                  {r.insights}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
