import React, { useState } from 'react';
import { IonIcon } from '@ionic/react';
import {
  notificationsOutline,
  ellipsisHorizontal,
  flashOutline,
  wifiOutline,
  calendarOutline,
  callOutline,
  restaurantOutline,
  bagHandleOutline,
  carOutline,
  cashOutline,
  walletOutline,
  searchOutline,
  filterOutline,
  shieldCheckmarkOutline,
  codeSlashOutline,
  colorPaletteOutline,
  logoFigma,
  personOutline
} from 'ionicons/icons';
import { useFinance } from '../context/FinanceContext';
import './DesktopDashboard.css';

const DesktopDashboard: React.FC = () => {
  const { balance, transactions, contacts, budgets, addTransaction, deleteTransaction, updateBudgetLimit } = useFinance();

  // Navigation states
  const [activeTab, setActiveTab] = useState<'overview' | 'balance' | 'billing' | 'reports'>('overview');
  const [searchTerm, setSearchTerm] = useState('');

  // Interactive settings toggles
  const [dailyAlerts, setDailyAlerts] = useState(true);
  const [biometrics, setBiometrics] = useState(false);

  // Quick Transfer interactive states
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [transferAmount, setTransferAmount] = useState('');

  // Modal for adding transaction
  const [showAddModal, setShowAddModal] = useState(false);
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState('Dining');

  // Compute stats
  const totalSpent = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalLimit = budgets.reduce((sum, b) => sum + b.limit, 0);
  const spentPct = totalLimit > 0 ? (totalSpent / totalLimit) * 100 : 0;

  // Filter transactions
  const filteredTransactions = transactions.filter(tx =>
    tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Icon mapping helper
  const getCategoryIcon = (category: string, type: string) => {
    if (type === 'income') return cashOutline;
    switch (category.toLowerCase()) {
      case 'utilities': return flashOutline;
      case 'dining': return restaurantOutline;
      case 'shopping': return bagHandleOutline;
      case 'transport': return carOutline;
      default: return walletOutline;
    }
  };

  const getCategoryColor = (category: string, type: string) => {
    if (type === 'income') return '#10b981';
    switch (category.toLowerCase()) {
      case 'utilities': return '#06b6d4';
      case 'dining': return '#f59e0b';
      case 'shopping': return '#a855f7';
      case 'transport': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!desc || !amount || isNaN(numAmount) || numAmount <= 0) return;
    addTransaction(desc, category, numAmount, type);
    setDesc('');
    setAmount('');
    setShowAddModal(false);
  };

  // Helper to render Initials Placeholder Avatars
  const renderInitialsAvatar = (name: string, color: string, size = 38) => {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    return (
      <div
        className="initials-avatar-placeholder"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: `${color}15`,
          color: color,
          fontSize: `${size * 0.38}px`
        }}
      >
        {initials}
      </div>
    );
  };

  return (
    <div className="desktop-dashboard-container">
      {/* 1. Header Banner Panel */}
      <div className="desktop-banner">
        <div className="banner-left">
          <span className="banner-date">Wednesday, 24 March 2026</span>
          <h1 className="banner-welcome">Welcome Back,<br />Anurag Sharma</h1>

          {/* Navigation Bar */}
          <div className="desktop-nav">
            <button className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Overview</button>
            <button className={`nav-item ${activeTab === 'balance' ? 'active' : ''}`} onClick={() => setActiveTab('balance')}>Ledger</button>
            <button className={`nav-item ${activeTab === 'billing' ? 'active' : ''}`} onClick={() => setActiveTab('billing')}>Budgeting</button>
            <button className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')}>Showcase/Profile</button>
            <button className="nav-item add-nav-trigger" onClick={() => setShowAddModal(true)}>+ Add Record</button>
          </div>
        </div>

        <div className="banner-right">
          {/* Top Profile Badge with Initials Placeholder */}
          <div className="banner-top-profile">
            <IonIcon icon={notificationsOutline} className="icon-notify" />
            <div className="profile-badge-desktop">
              {renderInitialsAvatar('Anurag Sharma', '#5550df', 24)}
              <span>Anurag Sharma (Pro Plan)</span>
            </div>
          </div>

          {/* Monthly Budget Summary Widget */}
          <div className="monthly-budget-widget">
            <div className="widget-header">
              <div>
                <h5>Monthly Budget</h5>
                <p>March 2026</p>
              </div>
              <div className="widget-icon">
                <IonIcon icon={walletOutline} />
              </div>
            </div>
            <div className="widget-progress-info">
              <span>You've spent ${totalSpent.toLocaleString('en-US', { maximumFractionDigits: 0 })} of ${totalLimit.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="widget-progress-bar">
              <div className="progress-fill" style={{ width: `${Math.min(spentPct, 100)}%` }}></div>
            </div>
            <div className="widget-footer">
              <span>${Math.max(totalLimit - totalSpent, 0).toLocaleString('en-US', { maximumFractionDigits: 0 })} remaining</span>
              <span>{spentPct.toFixed(0)}% spent</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Dynamic Content Render */}

      {/* Tab A: Overview (Main 3-Column Grid) */}
      {activeTab === 'overview' && (
        <div className="desktop-grid">
          {/* Column 1: Balance, Quick Transfer, Billings */}
          <div className="grid-column">
            <div className="desktop-card">
              <div className="card-header-desktop">
                <div>
                  <h3>My Balance</h3>
                  <p>Monitoring your monthly activity</p>
                </div>
                <button className="card-menu-btn"><IonIcon icon={ellipsisHorizontal} /></button>
              </div>
              <div className="card-balance-body">
                <h2>${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                <span className="balance-delta-badge">+1.8% from last month</span>
              </div>

              <div className="progress-bars-vertical">
                <div className="progress-bar-group">
                  <div className="bar-labels">
                    <span>Total Income</span>
                    <span>${totalIncome.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
                  </div>
                  <div className="bar-track"><div className="bar-fill-income" style={{ width: '80%' }}></div></div>
                </div>
                <div className="progress-bar-group">
                  <div className="bar-labels">
                    <span>Total Outcome</span>
                    <span>${totalSpent.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
                  </div>
                  <div className="bar-track"><div className="bar-fill-outcome" style={{ width: `${Math.min((totalSpent / (totalIncome || 1)) * 100, 100)}%` }}></div></div>
                </div>
              </div>

              <div className="smart-rec-banner">
                <div className="rec-icon"><IonIcon icon={shieldCheckmarkOutline} /></div>
                <div className="rec-text">
                  <h5>Smart Recommendation</h5>
                  <p>Try setting a weekly limit of $200 on Coffee to save $40.</p>
                </div>
              </div>
            </div>

            {/* Quick Transfer with Initials */}
            <div className="desktop-card">
              <h3>Quick Transfer</h3>
              <div className="contacts-desktop-row">
                {contacts.map((c, i) => (
                  <div key={i} className="contact-avatar-col" style={{ cursor: 'pointer' }} onClick={() => setSelectedContact(c)}>
                    {renderInitialsAvatar(c.name, c.color, 38)}
                    <span>{c.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Billings Grid */}
            <div className="desktop-card">
              <h3>Billings Shortcuts</h3>
              <div className="billings-desktop-grid">
                <div className="billing-item-desktop">
                  <div className="icon-wrap u"><IonIcon icon={flashOutline} /></div>
                  <span>Utilities</span>
                </div>
                <div className="billing-item-desktop">
                  <div className="icon-wrap w"><IonIcon icon={wifiOutline} /></div>
                  <span>Internet</span>
                </div>
                <div className="billing-item-desktop">
                  <div className="icon-wrap s"><IonIcon icon={calendarOutline} /></div>
                  <span>Subscription</span>
                </div>
                <div className="billing-item-desktop">
                  <div className="icon-wrap p"><IonIcon icon={callOutline} /></div>
                  <span>Phone</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Overview charts and table */}
          <div className="grid-column col-span-2">
            <div className="desktop-card">
              <div className="card-header-desktop">
                <div>
                  <h3>Settlement Overview</h3>
                  <p>Today's transactions processed</p>
                </div>
                <button className="card-menu-btn"><IonIcon icon={ellipsisHorizontal} /></button>
              </div>

              <div className="settlement-body">
                <div className="settlement-stat">
                  <h2>${totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                  <span className="delta-green">+4.5% vs yesterday</span>
                </div>

                <div className="settlement-chart">
                  <div className="chart-bar-container"><div className="chart-bar" style={{ height: '35%' }}></div><span>Mon</span></div>
                  <div className="chart-bar-container"><div className="chart-bar" style={{ height: '60%' }}></div><span>Tue</span></div>
                  <div className="chart-bar-container"><div className="chart-bar active" style={{ height: '80%' }}></div><span>Wed</span></div>
                  <div className="chart-bar-container"><div className="chart-bar" style={{ height: '45%' }}></div><span>Thu</span></div>
                  <div className="chart-bar-container"><div className="chart-bar" style={{ height: '65%' }}></div><span>Fri</span></div>
                  <div className="chart-bar-container"><div className="chart-bar" style={{ height: '40%' }}></div><span>Sat</span></div>
                  <div className="chart-bar-container"><div className="chart-bar" style={{ height: '50%' }}></div><span>Sun</span></div>
                </div>
              </div>
            </div>

            <div className="desktop-card">
              <div className="card-header-desktop table-header">
                <h3>Recent Activity</h3>
                <button className="section-link-desktop" onClick={() => setActiveTab('balance')}>View Full Ledger</button>
              </div>

              <div className="desktop-table">
                <div className="table-row table-head">
                  <div>Transaction</div>
                  <div>Category</div>
                  <div>Date</div>
                  <div>Time</div>
                  <div>Amount</div>
                  <div>Action</div>
                </div>
                {transactions.slice(0, 4).map((tx) => (
                  <div key={tx.id} className="table-row">
                    <div className="tx-name-col">
                      <div className="tx-icon" style={{ backgroundColor: `${getCategoryColor(tx.category, tx.type)}15`, color: getCategoryColor(tx.category, tx.type) }}>
                        <IonIcon icon={getCategoryIcon(tx.category, tx.type)} />
                      </div>
                      <span>{tx.description}</span>
                    </div>
                    <div><span className="badge-cat">{tx.category}</span></div>
                    <div>{tx.date}</div>
                    <div className="text-secondary">{tx.time}</div>
                    <div className={`tx-amount ${tx.type}`}>
                      {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                    </div>
                    <div>
                      <button className="table-del-btn" onClick={() => deleteTransaction(tx.id)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Column 3: Payment breakdown concentric arc */}
          <div className="grid-column">
            <div className="desktop-card chart-breakdown-card">
              <div className="card-header-desktop">
                <div>
                  <h3>Payment Breakdown</h3>
                  <p>Overview of category allocations</p>
                </div>
                <button className="card-menu-btn"><IonIcon icon={ellipsisHorizontal} /></button>
              </div>

              <div className="gauge-center-wrapper-desktop">
                <svg viewBox="0 0 200 120" style={{ width: '200px', height: '120px' }}>
                  {budgets.map((b, i) => {
                    const radii = [90, 78, 66, 54, 42];
                    const radius = radii[i] || 40;
                    const pathLength = Math.PI * radius;
                    const ratio = b.limit > 0 ? Math.min(b.spent / b.limit, 1) : 0;
                    const strokeOffset = pathLength * (1 - ratio);
                    const d = `M ${100 - radius} 110 A ${radius} ${radius} 0 0 1 ${100 + radius} 110`;

                    return (
                      <g key={b.category}>
                        <path d={d} fill="none" stroke="#f3f4f6" strokeWidth="7" />
                        <path
                          d={d}
                          fill="none"
                          stroke={b.color}
                          strokeWidth="7"
                          strokeDasharray={pathLength}
                          strokeDashoffset={strokeOffset}
                          style={{ transition: 'stroke-dashoffset 0.4s ease' }}
                        />
                      </g>
                    );
                  })}
                </svg>
                <div className="center-value-desktop">
                  <h5>Total Spend</h5>
                  <h3>${totalSpent.toLocaleString('en-US', { maximumFractionDigits: 0 })}</h3>
                </div>
              </div>

              <div className="desktop-budget-adjusters">
                {budgets.slice(0, 3).map((b) => (
                  <div key={b.category} className="desktop-adjuster-item">
                    <div className="adjuster-info">
                      <div className="adjuster-label">
                        <span className="dot" style={{ backgroundColor: b.color }}></span>
                        <span className="cat-name">{b.category}</span>
                      </div>
                      <span className="ratio-text">${b.spent.toFixed(0)} / ${b.limit.toFixed(0)}</span>
                    </div>
                  </div>
                ))}
                <button className="section-link-desktop" style={{ marginTop: '8px' }} onClick={() => setActiveTab('billing')}>Adjust Budget limits</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab B: Ledger (Transactions Ledger Full Page) */}
      {activeTab === 'balance' && (
        <div className="desktop-single-pane">
          <div className="desktop-grid-2-col">
            <div className="desktop-card spent-stats-panel">
              <h3>Spent Statistics</h3>
              <div className="grid-column">
                <div className="stat-pill-item exp">
                  <span>Total Expense</span>
                  <h2>${totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h2>
                </div>
                <div className="stat-pill-item inc">
                  <span>Total Income</span>
                  <h2>${totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h2>
                </div>
              </div>
            </div>

            <div className="desktop-card full-table-panel">
              <div className="card-header-desktop table-header">
                <div>
                  <h3>Transactions Ledger</h3>
                  <p>Comprehensive search & review logs</p>
                </div>
                <div className="table-actions">
                  <div className="table-search">
                    <IonIcon icon={searchOutline} />
                    <input
                      type="text"
                      placeholder="Search ledger..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="desktop-table">
                <div className="table-row table-head">
                  <div>Transaction</div>
                  <div>Category</div>
                  <div>Date</div>
                  <div>Time</div>
                  <div>Amount</div>
                  <div>Action</div>
                </div>
                {filteredTransactions.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '32px', color: '#9ca3af' }}>No transactions found matching search.</div>
                ) : (
                  filteredTransactions.map((tx) => (
                    <div key={tx.id} className="table-row">
                      <div className="tx-name-col">
                        <div className="tx-icon" style={{ backgroundColor: `${getCategoryColor(tx.category, tx.type)}15`, color: getCategoryColor(tx.category, tx.type) }}>
                          <IonIcon icon={getCategoryIcon(tx.category, tx.type)} />
                        </div>
                        <span>{tx.description}</span>
                      </div>
                      <div><span className="badge-cat">{tx.category}</span></div>
                      <div>{tx.date}</div>
                      <div className="text-secondary">{tx.time}</div>
                      <div className={`tx-amount ${tx.type}`}>
                        {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                      </div>
                      <div>
                        <button className="table-del-btn" onClick={() => deleteTransaction(tx.id)}>Delete</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab C: Budgeting (Widescreen Budget arc and adjusters) */}
      {activeTab === 'billing' && (
        <div className="desktop-single-pane">
          <div className="desktop-grid-2-col">
            <div className="desktop-card chart-breakdown-card font-center">
              <h3>Allocation Chart</h3>
              <div className="gauge-center-wrapper-desktop" style={{ margin: '40px 0' }}>
                <svg viewBox="0 0 200 120" style={{ width: '280px', height: '160px' }}>
                  {budgets.map((b, i) => {
                    const radii = [90, 78, 66, 54, 42];
                    const radius = radii[i] || 40;
                    const pathLength = Math.PI * radius;
                    const ratio = b.limit > 0 ? Math.min(b.spent / b.limit, 1) : 0;
                    const strokeOffset = pathLength * (1 - ratio);
                    const d = `M ${100 - radius} 110 A ${radius} ${radius} 0 0 1 ${100 + radius} 110`;

                    return (
                      <g key={b.category}>
                        <path d={d} fill="none" stroke="#f3f4f6" strokeWidth="8" />
                        <path
                          d={d}
                          fill="none"
                          stroke={b.color}
                          strokeWidth="8"
                          strokeDasharray={pathLength}
                          strokeDashoffset={strokeOffset}
                          style={{ transition: 'stroke-dashoffset 0.4s ease' }}
                        />
                      </g>
                    );
                  })}
                </svg>
                <div className="center-value-desktop" style={{ bottom: '10px' }}>
                  <h5 style={{ fontSize: '12px' }}>Total Spend</h5>
                  <h3 style={{ fontSize: '26px' }}>${totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
                </div>
              </div>
              <div className="smart-rec-banner">
                <IonIcon icon={shieldCheckmarkOutline} style={{ color: '#5550df', fontSize: '20px' }} />
                <p style={{ margin: 0, fontSize: '11px', textAlign: 'left' }}>Your monthly spending limit is <strong>${totalLimit.toLocaleString()}</strong>. Drag the sliders to adjust category envelopes.</p>
              </div>
            </div>

            <div className="desktop-card">
              <h3>Adjust Category Budgets</h3>
              <div className="desktop-budget-adjusters" style={{ gap: '20px', marginTop: '24px' }}>
                {budgets.map((b) => {
                  const pct = b.limit > 0 ? (b.spent / b.limit) * 100 : 0;
                  return (
                    <div key={b.category} className="desktop-adjuster-item" style={{ background: '#f9fafb', padding: '16px', borderRadius: '16px' }}>
                      <div className="adjuster-info" style={{ marginBottom: '8px' }}>
                        <div className="adjuster-label">
                          <span className="dot" style={{ backgroundColor: b.color, width: '10px', height: '10px' }}></span>
                          <span className="cat-name" style={{ fontSize: '14px' }}>{b.category}</span>
                        </div>
                        <span className="ratio-text" style={{ fontSize: '13px', color: '#1f2937' }}>
                          <strong>${b.spent.toFixed(0)}</strong> spent of ${b.limit.toFixed(0)}
                        </span>
                      </div>

                      <div className="adjuster-progress-line" style={{ background: '#e5e7eb', height: '6px', borderRadius: '3px', overflow: 'hidden', marginBottom: '12px' }}>
                        <div style={{ width: `${Math.min(pct, 100)}%`, height: '100%', backgroundColor: b.spent > b.limit ? '#ef4444' : b.color }}></div>
                      </div>

                      <div className="adjuster-slider-row">
                        <input
                          type="range"
                          min="100"
                          max="2000"
                          step="50"
                          value={b.limit}
                          onChange={(e) => updateBudgetLimit(b.category, parseInt(e.target.value))}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab D: Showcase/Profile (Anurag Sharma real-world profile panel) */}
      {activeTab === 'reports' && (
        <div className="desktop-single-pane">
          <div className="desktop-grid-2-col">
            {/* User Card & Personal Information */}
            <div className="desktop-card user-showcase-profile">
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '16px 0', borderBottom: '1px solid #f3f4f6', marginBottom: '16px' }}>
                {renderInitialsAvatar('Anurag Sharma', '#5550df', 80)}
                <h3 style={{ marginTop: '16px', fontSize: '20px', fontWeight: 800 }}>Anurag Sharma</h3>
                <p style={{ color: '#9ca3af', fontSize: '13px', margin: '4px 0 16px 0' }}>anurag.sharma@1233424.com</p>
                <div className="badge-premium" style={{ background: '#fef3c7', color: '#d97706', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, display: 'inline-flex', alignItems: 'center' }}>
                  <IonIcon icon={shieldCheckmarkOutline} style={{ marginRight: '4px' }} />
                  Premium Tier User
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#9ca3af', marginBottom: '12px', letterSpacing: '0.5px' }}>Personal Information</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f9fafb', fontSize: '13px' }}>
                  <span style={{ color: '#6b7280', fontWeight: 600 }}>Phone Number</span>
                  <span style={{ color: '#1f2937', fontWeight: 700 }}>+91 98765 43210</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f9fafb', fontSize: '13px' }}>
                  <span style={{ color: '#6b7280', fontWeight: 600 }}>Primary Bank</span>
                  <span style={{ color: '#1f2937', fontWeight: 700 }}>HDFC Bank</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', fontSize: '13px' }}>
                  <span style={{ color: '#6b7280', fontWeight: 600 }}>Account Tier</span>
                  <span style={{ color: '#1f2937', fontWeight: 700 }}>Savings Classic</span>
                </div>
              </div>
            </div>

            {/* App Settings, Preferences, & Support */}
            <div className="desktop-card">
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#9ca3af', marginBottom: '16px', letterSpacing: '0.5px' }}>App Settings & Preferences</h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#f9fafb', borderRadius: '14px', border: '1px solid #f1f5f9' }}>
                    <div>
                      <h5 style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#1f2937' }}>Daily Spending Alerts</h5>
                      <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#9ca3af' }}>Notify me when expenses exceed my regular budgets</p>
                    </div>
                    <span
                      className={`toggle-pill ${dailyAlerts ? 'active' : ''}`}
                      onClick={() => setDailyAlerts(!dailyAlerts)}
                    >
                      {dailyAlerts ? 'ON' : 'OFF'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#f9fafb', borderRadius: '14px', border: '1px solid #f1f5f9' }}>
                    <div>
                      <h5 style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#1f2937' }}>Biometric Authentication</h5>
                      <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#9ca3af' }}>Unlock app securely with fingerprint or face recognition</p>
                    </div>
                    <span
                      className={`toggle-pill ${biometrics ? 'active' : ''}`}
                      onClick={() => setBiometrics(!biometrics)}
                    >
                      {biometrics ? 'ON' : 'OFF'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#f9fafb', borderRadius: '14px', border: '1px solid #f1f5f9', fontSize: '13px' }}>
                    <span style={{ fontWeight: 700, color: '#1f2937' }}>Preferred Currency</span>
                    <span style={{ color: '#9ca3af', fontWeight: 600 }}>USD ($)</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#9ca3af', marginBottom: '16px', letterSpacing: '0.5px' }}>Support</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f9fafb', fontSize: '13px', cursor: 'pointer' }}>
                    <span style={{ color: '#4b5563', fontWeight: 600 }}>Help Center & FAQs</span>
                    <span style={{ color: '#9ca3af' }}>&#8250;</span>
                  </div>
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', fontSize: '13px', cursor: 'pointer' }}
                    onClick={() => alert('Log out clicked!')}
                  >
                    <span style={{ color: '#ef4444', fontWeight: 700 }}>Log Out</span>
                    <span style={{ color: '#ef4444' }}>&#8250;</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Add Record Modal Overlay for Desktop */}
      {showAddModal && (
        <div className="desktop-modal-overlay">
          <div className="desktop-modal">
            <div className="d-modal-header">
              <h3>Add New Record</h3>
              <button className="close-d-btn" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <form onSubmit={handleSave} className="d-modal-form">
              <div className="d-form-group">
                <label>Type</label>
                <div className="d-toggle-type">
                  <button type="button" className={type === 'expense' ? 'active exp' : ''} onClick={() => setType('expense')}>Expense</button>
                  <button type="button" className={type === 'income' ? 'active inc' : ''} onClick={() => setType('income')}>Income</button>
                </div>
              </div>
              <div className="d-form-group">
                <label>Description</label>
                <input type="text" placeholder="e.g. Office rent, Salary" value={desc} onChange={(e) => setDesc(e.target.value)} required />
              </div>
              <div className="d-form-group">
                <label>Amount ($)</label>
                <input type="number" step="0.01" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} required />
              </div>
              <div className="d-form-group">
                <label>Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="Dining">Dining</option>
                  <option value="Groceries">Groceries</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Transport">Transport</option>
                  <option value="Utilities">Utilities</option>
                </select>
              </div>
              <button type="submit" className="d-form-submit">Save Transaction</button>
            </form>
          </div>
        </div>
      )}

      {/* 4. Quick Send Modal Overlay for Desktop */}
      {selectedContact && (
        <div className="desktop-modal-overlay" onClick={() => setSelectedContact(null)}>
          <div className="desktop-modal animate-slide-up" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
            <div className="d-modal-header">
              <h3>Quick Transfer</h3>
              <button className="close-d-btn" onClick={() => setSelectedContact(null)}>×</button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '20px 0', textAlign: 'center' }}>
              <div style={{ 
                width: '64px', 
                height: '64px', 
                borderRadius: '50%', 
                backgroundColor: `${selectedContact.color}15`, 
                color: selectedContact.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '22px',
                fontWeight: 700,
                border: '1.5px solid #ffffff',
                boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                marginBottom: '12px'
              }}>
                {selectedContact.name[0]}
              </div>
              <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#1f2937' }}>{selectedContact.name}</h4>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#9ca3af', fontWeight: 600 }}>{selectedContact.upiId} • {selectedContact.phone}</p>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const amt = parseFloat(transferAmount);
              if (amt > 0) {
                addTransaction(`Send to ${selectedContact.name}`, 'Dining', amt, 'expense');
                setSelectedContact(null);
                setTransferAmount('');
                alert(`Successfully transferred $${amt} to ${selectedContact.name}!`);
              }
            }} className="d-modal-form">
              <div className="d-form-group">
                <label>Amount ($)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '8px 16px', background: '#f9fafb' }}>
                  <span style={{ fontSize: '20px', fontWeight: 700, color: '#111827' }}>$</span>
                  <input 
                    type="number" 
                    step="0.01" 
                    placeholder="0.00" 
                    value={transferAmount} 
                    onChange={(e) => setTransferAmount(e.target.value)} 
                    style={{ border: 'none', background: 'transparent', fontSize: '22px', fontWeight: 800, color: '#111827', width: '100%', outline: 'none' }}
                    autoFocus
                    required 
                  />
                </div>
              </div>
              <button type="submit" className="d-form-submit" style={{ width: '100%', padding: '14px', borderRadius: '14px', fontSize: '13px' }}>Confirm Transfer</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DesktopDashboard;
