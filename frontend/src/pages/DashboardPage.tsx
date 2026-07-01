import React from 'react';
import type { ClusterSummary } from '../types';
import { ClusterKpiCards } from '../components/ClusterKpiCards';
import { ClusterBarChart } from '../components/ClusterBarChart';
import { ArrowRight, Layers, Sparkles } from 'lucide-react';

interface Props {
  clusters: ClusterSummary[];
  setActivePage: (page: string) => void;
}

export const DashboardPage: React.FC<Props> = ({ clusters, setActivePage }) => {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(6,182,212,0.1))', padding: '1.75rem', borderRadius: '16px', border: '1px solid rgba(99,102,241,0.25)' }}>
        <div>
          <span className="badge badge-connected" style={{ marginBottom: '0.5rem' }}>
            <Sparkles size={14} /> Production Model Active
          </span>
          <h1 style={{ fontSize: '1.85rem', color: '#fff', marginTop: '0.25rem' }}>Customer Intelligence Center</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '600px', marginTop: '0.35rem' }}>
            Real-time clustering and strategic segmentation of retail customer populations using unsupervised machine learning.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => setActivePage('predict')} className="btn btn-primary">
            Classify Single Sample <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <h2 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Layers size={18} color="var(--cyan)" /> Segments Overview ({clusters?.length || 5} Identified Clusters)
      </h2>

      <ClusterKpiCards clusters={clusters} />

      <div style={{ marginTop: '2rem' }}>
        <ClusterBarChart clusters={clusters} />
      </div>
    </div>
  );
};
