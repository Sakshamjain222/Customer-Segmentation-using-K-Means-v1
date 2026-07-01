import React from 'react';
import { Activity, ShieldCheck, Cpu } from 'lucide-react';

export const NavBar: React.FC<{ activePage: string }> = ({ activePage }) => {
  const getPageTitle = (page: string) => {
    switch (page) {
      case 'dashboard': return 'Executive Overview';
      case 'predict': return 'Single Customer Classification';
      case 'batch': return 'Batch CSV Segmentation';
      case 'analytics': return 'Model & Cluster Analytics';
      default: return 'Dashboard';
    }
  };

  return (
    <header className="navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', color: '#fff', fontWeight: 600 }}>
          {getPageTitle(activePage)}
        </h2>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div className="badge badge-connected">
          <Activity size={14} />
          ML Microservice Online
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          <Cpu size={16} color="var(--cyan)" />
          <span>K-Means (k=5)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          <ShieldCheck size={16} color="var(--primary)" />
          <span>Spring Boot Gateway</span>
        </div>
      </div>
    </header>
  );
};
