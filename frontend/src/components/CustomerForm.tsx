import React, { useState } from 'react';
import type { SinglePredictionRequest } from '../types';
import { Sparkles, RefreshCw } from 'lucide-react';

interface Props {
  onSubmit: (data: SinglePredictionRequest) => void;
  loading: boolean;
}

export const CustomerForm: React.FC<Props> = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState<SinglePredictionRequest>({
    customerId: 'CUST-' + Math.floor(1000 + Math.random() * 9000),
    age: 34,
    annualIncome: 72,
    spendingScore: 61,
    gender: 'Female',
  });

  const handleChange = (field: keyof SinglePredictionRequest, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const randomize = () => {
    setFormData({
      customerId: 'CUST-' + Math.floor(1000 + Math.random() * 9000),
      age: Math.floor(18 + Math.random() * 52),
      annualIncome: Math.floor(15 + Math.random() * 120),
      spendingScore: Math.floor(5 + Math.random() * 92),
      gender: Math.random() > 0.5 ? 'Female' : 'Male',
    });
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ color: '#fff' }}>Input Customer Telemetry</h3>
        <button type="button" onClick={randomize} className="btn" style={{ background: 'rgba(255,255,255,0.06)', color: '#fff', padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}>
          <RefreshCw size={14} /> Randomize Sample
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Customer ID Identifier</label>
          <input
            type="text"
            className="form-input"
            value={formData.customerId}
            onChange={(e) => handleChange('customerId', e.target.value)}
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Age (Years)</label>
            <input
              type="number"
              className="form-input"
              value={formData.age}
              onChange={(e) => handleChange('age', Number(e.target.value))}
              min="10"
              max="100"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Gender Profile</label>
            <select
              className="form-input"
              value={formData.gender}
              onChange={(e) => handleChange('gender', e.target.value)}
            >
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Annual Income ($k USD)</label>
            <input
              type="number"
              className="form-input"
              value={formData.annualIncome}
              onChange={(e) => handleChange('annualIncome', Number(e.target.value))}
              min="1"
              max="500"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Spending Score (1 - 100)</label>
            <input
              type="number"
              className="form-input"
              value={formData.spendingScore}
              onChange={(e) => handleChange('spendingScore', Number(e.target.value))}
              min="1"
              max="100"
              required
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
          <Sparkles size={18} />
          {loading ? 'Executing Neural Inference...' : 'Classify Customer Segment'}
        </button>
      </form>
    </div>
  );
};
