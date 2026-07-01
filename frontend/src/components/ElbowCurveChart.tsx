import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceDot } from 'recharts';
import type { ElbowPoint } from '../types';

export const ElbowCurveChart: React.FC<{ data: ElbowPoint[] }> = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="card">
      <div style={{ marginBottom: '1.25rem' }}>
        <h3 style={{ color: '#fff' }}>Elbow Method Explainability (WCSS vs K)</h3>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Optimal K=5 selected via inflection point analysis</span>
      </div>

      <div style={{ width: '100%', height: 320 }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="k" stroke="#94A3B8" fontSize={12} label={{ value: 'Number of Clusters (k)', position: 'bottom', fill: '#94A3B8' }} />
            <YAxis stroke="#94A3B8" fontSize={12} />
            <Tooltip
              contentStyle={{ background: '#111827', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff' }}
              formatter={(val: any) => [`${Math.round(Number(val) || 0).toLocaleString()}`, 'WCSS Inertia']}
            />
            <Line type="monotone" dataKey="wcss" stroke="#6366F1" strokeWidth={3} dot={{ r: 5, fill: '#06B6D4' }} activeDot={{ r: 8 }} />
            <ReferenceDot x={5} y={data.find((d) => d.k === 5)?.wcss || 0} r={8} fill="#EC4899" stroke="#fff" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
