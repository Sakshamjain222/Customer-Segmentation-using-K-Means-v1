import React from 'react';
import { ClusterScatterPlot } from '../components/ClusterScatterPlot';
import { ElbowCurveChart } from '../components/ElbowCurveChart';
import type { ScatterPoint, ElbowPoint } from '../types';

interface Props {
  scatterData: ScatterPoint[];
  elbowData: ElbowPoint[];
}

export const AnalyticsPage: React.FC<Props> = ({ scatterData, elbowData }) => {
  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', color: '#fff' }}>Model Explainability & Cluster Diagnostics</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Visualize centroid clustering boundaries and unsupervised hyperparameter optimization curves.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <ClusterScatterPlot data={scatterData} />
        <ElbowCurveChart data={elbowData} />
      </div>
    </div>
  );
};
