import React from 'react';
import { IonContent, IonPage, IonIcon } from '@ionic/react';
import { chevronBackOutline } from 'ionicons/icons';
import { useFinance, Budget } from '../context/FinanceContext';
import './Tab3.css';

const Tab3: React.FC = () => {
  const { budgets, transactions, updateBudgetLimit } = useFinance();

  // Compute total monthly expenses dynamically
  const totalSpent = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // Compute total budget limit dynamically
  const totalBudgetLimit = budgets.reduce((sum, b) => sum + b.limit, 0);
  
  // Calculate aggregate percentage spent
  const pctSpent = totalBudgetLimit > 0 ? (totalSpent / totalBudgetLimit) * 100 : 0;
  const pctLeft = 100 - pctSpent;

  // Concentric arc layout parameters
  const cx = 100;
  const cy = 110;
  // Radii for the 5 categories
  const radii = [90, 78, 66, 54, 42];

  return (
    <IonPage style={{ background: '#f3f4f6' }}>
      <IonContent fullscreen>
        {/* Header */}
        <div className="budget-header">
          <button className="back-btn" onClick={() => window.history.back()}>
            <IonIcon icon={chevronBackOutline} />
          </button>
          <h2 className="budget-title">Budgeting</h2>
          <div style={{ width: '36px' }}></div> {/* spacer */}
        </div>

        {/* Dynamic Concentric SVG Gauge Card */}
        <div className="finflow-card chart-card">
          <div className="gauge-container">
            <svg viewBox="0 0 200 120" className="gauge-svg">
              {budgets.map((b, index) => {
                const radius = radii[index] || 40;
                const pathLength = Math.PI * radius; // Half circumference
                
                // Calculate percentage spent (cap at 100%)
                const ratio = b.limit > 0 ? Math.min(b.spent / b.limit, 1) : 0;
                const strokeOffset = pathLength * (1 - ratio);

                // Path for semi-circle
                const d = `M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`;

                return (
                  <g key={b.category}>
                    {/* Background Arc */}
                    <path
                      d={d}
                      fill="none"
                      stroke="#f3f4f6"
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                    {/* Active Spent Arc */}
                    <path
                      d={d}
                      fill="none"
                      stroke={b.color}
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={pathLength}
                      strokeDashoffset={strokeOffset}
                      style={{ transition: 'stroke-dashoffset 0.4s ease' }}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Inner Dashboard Core Text */}
            <div className="gauge-center-text">
              <span className="gauge-label">Spent this Month</span>
              <h2 className="gauge-amount">${totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
              <span className="gauge-sub" style={{ color: pctLeft >= 0 ? '#10b981' : '#ef4444' }}>
                {pctLeft >= 0 ? `${pctLeft.toFixed(0)}% budget left` : `${Math.abs(pctLeft).toFixed(0)}% over limit`}
              </span>
            </div>
          </div>
        </div>

        {/* Budgets Progress & Adjustment Sliders Panel */}
        <div className="budget-list-container" style={{ paddingBottom: '100px' }}>
          <h3 className="section-title" style={{ margin: '0 20px 16px 20px' }}>Category Budgets</h3>
          <div className="budget-list">
            {budgets.map((b, index) => {
              const pct = b.limit > 0 ? (b.spent / b.limit) * 100 : 0;
              const isOver = b.spent > b.limit;

              return (
                <div key={b.category} className="budget-item-card">
                  {/* Category Details Header */}
                  <div className="budget-item-header">
                    <div className="budget-item-name-group">
                      <span className="color-dot" style={{ backgroundColor: b.color }}></span>
                      <span className="budget-cat-name">{b.category}</span>
                    </div>
                    <div className="budget-item-ratio">
                      <span className="spent-val">${b.spent.toFixed(0)}</span>
                      <span className="limit-divider">/</span>
                      <span className="limit-val">${b.limit.toFixed(0)}</span>
                    </div>
                  </div>

                  {/* Progress Bar Container */}
                  <div className="progress-container">
                    <div 
                      className={`progress-bar ${isOver ? 'over' : ''}`}
                      style={{ 
                        width: `${Math.min(pct, 100)}%`, 
                        backgroundColor: isOver ? '#ef4444' : b.color 
                      }}
                    ></div>
                  </div>

                  {/* Interactive Slider for Adjusting Limit */}
                  <div className="budget-slider-row">
                    <label>Limit Adjustment</label>
                    <input 
                      type="range" 
                      min="100" 
                      max="2000" 
                      step="50" 
                      value={b.limit} 
                      onChange={(e) => updateBudgetLimit(b.category, parseInt(e.target.value))}
                      className="budget-slider"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
