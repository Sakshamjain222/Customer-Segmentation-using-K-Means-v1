import React from 'react';
import { LayoutDashboard, UserCheck, UploadCloud, LineChart, Layers } from 'lucide-react';

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage }) => {
  const navItems = [
    { id: 'dashboard', label: 'Overview Dashboard', icon: LayoutDashboard },
    { id: 'predict', label: 'Single Prediction', icon: UserCheck },
    { id: 'batch', label: 'Batch CSV Processing', icon: UploadCloud },
    { id: 'analytics', label: 'Deep-Dive Analytics', icon: LineChart },
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">
          <Layers size={22} />
        </div>
        <span className="brand-text">SegmIntel AI</span>
      </div>

      <nav className="nav-links">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <div
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActivePage(item.id)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </div>
          );
        })}
      </nav>

      <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border-color)', marginTop: 'auto' }}>
        <div style={{ fontSize: '0.8rem', color: '#fff', fontWeight: 600 }}>Architecture Spec</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
          React 18 + Vite Frontend<br />
          Spring Boot 3 API Gateway<br />
          FastAPI ML Microservice
        </div>
      </div>
    </aside>
  );
};
