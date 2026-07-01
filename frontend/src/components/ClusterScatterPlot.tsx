import React from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import type { ScatterPoint } from '../types';

export const ClusterScatterPlot: React.FC<{ data: ScatterPoint[] }> = ({ data }) => {
  if (!data || data.length === 0) return null;

  const clusterColors = ['#06B6D4', '#EC4899', '#10B981', '#F59E0B', '#A855F7'];

  const clusters = [0, 1, 2, 3, 4].map((cid) => {
    const points = data.filter((p) => p.cluster_id === cid);
    const label = points.length > 0 ? points[0].cluster_label : `Cluster ${cid}`;
    return { cid, label, points };
  });

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <h3 style={{ color: '#fff' }}>2D Segment Projection (Income vs Spending Score)</h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>K-Means Cluster Space Distribution</span>
        </div>
      </div>

      <div style={{ width: '100%', height: 420 }}>
        <ResponsiveContainer>
          <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis
              type="number"
              dataKey="annual_income"
              name="Annual Income"
              unit="k$"
              stroke="#94A3B8"
              fontSize={12}
              label={{ value: 'Annual Income ($k)', position: 'bottom', fill: '#94A3B8', offset: 0 }}
            />
            <YAxis
              type="number"
              dataKey="spending_score"
              name="Spending Score"
              unit=""
              stroke="#94A3B8"
              fontSize={12}
              label={{ value: 'Spending Score (1-100)', angle: -90, position: 'insideLeft', fill: '#94A3B8' }}
            />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const pt = payload[0].payload as ScatterPoint;
                  return (
                    <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.15)', padding: '0.85rem', borderRadius: '10px' }}>
                      <div style={{ fontWeight: 700, color: '#fff', marginBottom: '0.35rem' }}>ID: {pt.customer_id}</div>
                      <div style={{ color: clusterColors[pt.cluster_id % 5], fontSize: '0.85rem', fontWeight: 600 }}>{pt.cluster_label}</div>
                      <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '0.5rem' }}>Age: {pt.age} yrs</div>
                      <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Income: ${pt.annual_income}k</div>
                      <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Spending Score: {pt.spending_score}</div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend wrapperStyle={{ paddingTop: '15px' }} />
            {clusters.map((c) => (
              <Scatter key={c.cid} name={c.label} data={c.points} fill={clusterColors[c.cid % 5]} />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
