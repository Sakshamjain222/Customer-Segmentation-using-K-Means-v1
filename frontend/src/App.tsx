import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { NavBar } from './components/NavBar';
import { DashboardPage } from './pages/DashboardPage';
import { PredictPage } from './pages/PredictPage';
import { BatchUploadPage } from './pages/BatchUploadPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import type { ClusterSummary, ScatterPoint, ElbowPoint } from './types';

export const App: React.FC = () => {
  const [activePage, setActivePage] = useState('dashboard');
  const [clusters, setClusters] = useState<ClusterSummary[]>([]);
  const [scatterData, setScatterData] = useState<ScatterPoint[]>([]);
  const [elbowData, setElbowData] = useState<ElbowPoint[]>([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        let res = await fetch('http://localhost:8080/api/v1/analytics/model');
        if (!res.ok) {
          res = await fetch('http://localhost:8000/ml/model-info');
        }
        if (res.ok) {
          const data = await res.json();
          if (data.clusters) {
            setClusters(
              data.clusters.map((c: any) => ({
                clusterId: c.clusterId ?? c.cluster_id,
                label: c.label,
                count: c.count,
                avgIncome: c.avgIncome ?? c.avg_income,
                avgSpendingScore: c.avgSpendingScore ?? c.avg_spending_score,
              }))
            );
          }
          if (data.scatter_data || data.scatterData) {
            setScatterData(data.scatter_data || data.scatterData);
          }
          if (data.elbow_curve || data.elbowCurve) {
            setElbowData(data.elbow_curve || data.elbowCurve);
          }
        }
      } catch (err) {
        console.log('Using local fallback demo data until servers start...');
        setClusters([
          { clusterId: 0, label: 'Budget Conscious', count: 20, avgIncome: 25, avgSpendingScore: 20 },
          { clusterId: 1, label: 'Impulsive Shoppers', count: 54, avgIncome: 26, avgSpendingScore: 78 },
          { clusterId: 2, label: 'High Value Spender', count: 40, avgIncome: 86, avgSpendingScore: 82 },
          { clusterId: 3, label: 'Conservative Spenders', count: 39, avgIncome: 88, avgSpendingScore: 17 },
          { clusterId: 4, label: 'Average Spenders', count: 47, avgIncome: 55, avgSpendingScore: 49 },
        ]);
      }
    };

    fetchAnalytics();
  }, []);

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage clusters={clusters} setActivePage={setActivePage} />;
      case 'predict':
        return <PredictPage />;
      case 'batch':
        return <BatchUploadPage />;
      case 'analytics':
        return <AnalyticsPage scatterData={scatterData} elbowData={elbowData} />;
      default:
        return <DashboardPage clusters={clusters} setActivePage={setActivePage} />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="main-content">
        <NavBar activePage={activePage} />
        <main className="page-wrapper">{renderPage()}</main>
      </div>
    </div>
  );
};

export default App;
