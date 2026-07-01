import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import type { ClusterSummary } from '../types';

export const ClusterBarChart: React.FC<{ clusters: ClusterSummary[] }> = ({ clusters }) => {
  if (!clusters || clusters.length === 0) return null;

  const data = clusters.map((c) => ({
    name: c.label,
    Count: c.count,
    Income: Math.round(c.avgIncome),
    Spending: Math.round(c.avgSpendingScore)
  }));

  return (
    <div className="card">
      <h3 style={{ marginBottom: '1.25rem', color: '#fff' }}>Cluster Metrics Comparison</h3>
      <div style={{ width: '100%', height: 320 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} tickLine={false} />
            <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} />
            <Tooltip
              contentStyle={{ background: '#111827', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff' }}
            />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Bar dataKey="Count" name="Headcount" fill="#6366F1" radius={[6, 6, 0, 0]} />
            <Bar dataKey="Income" name="Avg Income (k$)" fill="#10B981" radius={[6, 6, 0, 0]} />
            <Bar dataKey="Spending" name="Avg Spending Score" fill="#06B6D4" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
