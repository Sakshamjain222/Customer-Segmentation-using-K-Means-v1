import React from 'react';
import type { SinglePredictionResponse } from '../types';
import { ShieldCheck, Sparkles, Target, Compass } from 'lucide-react';

export const PredictionResultCard: React.FC<{ result: SinglePredictionResponse | null }> = ({ result }) => {
  if (!result) {
    return (
      <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', minHeight: '380px', textAlign: 'center', borderStyle: 'dashed', borderColor: 'rgba(255,255,255,0.12)' }}>
        <Target size={48} color="var(--primary)" style={{ opacity: 0.5, marginBottom: '1rem' }} />
        <h3 style={{ color: 'var(--text-secondary)' }}>Awaiting Prediction Input</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '300px', marginTop: '0.5rem' }}>
          Fill out customer parameters on the left and submit to trigger real-time K-Means clustering.
        </p>
      </div>
    );
  }

  const getColorClass = (id: number) => `cluster-${id % 5}`;
  const confPercent = Math.round(result.confidence * 100);

  return (
    <div className="card" style={{ border: '1px solid rgba(99,102,241,0.3)', background: 'linear-gradient(145deg, rgba(30,41,59,0.9), rgba(15,23,42,0.95))' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            ID: {result.customerId}
          </span>
          <h2 style={{ fontSize: '1.5rem', color: '#fff', marginTop: '0.25rem' }}>Classification Report</h2>
        </div>
        <span className={`badge ${getColorClass(result.clusterId)}`} style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
          Cluster #{result.clusterId}
        </span>
      </div>

      <div style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <Sparkles size={20} color="var(--cyan)" />
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Assigned Customer Segment:</span>
        </div>
        <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#fff', fontFamily: 'var(--font-heading)' }}>
          {result.clusterLabel}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '10px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block' }}>Model Confidence</span>
          <span style={{ fontSize: '1.35rem', fontWeight: 700, color: confPercent >= 80 ? 'var(--emerald)' : 'var(--amber)' }}>
            {confPercent}%
          </span>
        </div>
        <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '10px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block' }}>Persistence Status</span>
          <span style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--cyan)', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.25rem' }}>
            <ShieldCheck size={16} /> Postgres Recorded
          </span>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.25rem' }}>
        <h4 style={{ color: '#fff', fontSize: '0.95rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Compass size={16} color="var(--pink)" /> Business & Marketing Strategy Insights
        </h4>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, background: 'rgba(236,72,153,0.08)', padding: '1rem', borderRadius: '10px', borderLeft: '3px solid var(--pink)' }}>
          {result.insights}
        </p>
      </div>
    </div>
  );
};
