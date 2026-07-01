import React from 'react';
import type { ClusterSummary } from '../types';
import { Users, DollarSign, Zap } from 'lucide-react';

export const ClusterKpiCards: React.FC<{ clusters: ClusterSummary[] }> = ({ clusters }) => {
  if (!clusters || clusters.length === 0) {
    return <div className="card">Loading Cluster KPIs...</div>;
  }

  const getColorClass = (id: number) => `cluster-${id % 5}`;

  return (
    <div className="kpi-grid">
      {clusters.map((c) => (
        <div key={c.clusterId} className="card" style={{ position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
              <span className={`badge ${getColorClass(c.clusterId)}`} style={{ marginBottom: '0.5rem' }}>
                Cluster #{c.clusterId}
              </span>
              <h3 style={{ fontSize: '1.15rem', color: '#fff', marginTop: '0.25rem' }}>{c.label}</h3>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginTop: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Users size={15} color="var(--primary)" /> Headcount
              </span>
              <span style={{ fontWeight: 700, color: '#fff', fontSize: '1rem' }}>{c.count} profiles</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '0.5rem' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <DollarSign size={15} color="var(--emerald)" /> Avg Income
              </span>
              <span style={{ fontWeight: 700, color: 'var(--emerald)', fontSize: '1rem' }}>${Math.round(c.avgIncome)}k / yr</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Zap size={15} color="var(--amber)" /> Spend Index
              </span>
              <span style={{ fontWeight: 700, color: 'var(--amber)', fontSize: '1rem' }}>{Math.round(c.avgSpendingScore)} / 100</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
