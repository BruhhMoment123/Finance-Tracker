import React, { useState } from 'react';
import { IonContent, IonPage, IonIcon, IonModal } from '@ionic/react';
import { 
  searchOutline, 
  addOutline,
  closeOutline,
  flashOutline,
  restaurantOutline,
  bagHandleOutline,
  carOutline,
  cashOutline,
  walletOutline
} from 'ionicons/icons';
import { useFinance, Transaction } from '../context/FinanceContext';
import './Tab2.css';

const Tab2: React.FC = () => {
  const { transactions, budgets, addTransaction, deleteTransaction } = useFinance();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState('Dining');

  // Compute total expenses dynamically
  const totalSpent = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // Get top spending categories sorted
  const sortedBudgets = [...budgets].sort((a, b) => b.spent - a.spent).slice(0, 3);

  // Filter transactions based on search
  const filteredTransactions = transactions.filter(tx => 
    tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Form submit handler
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!desc || !amount || isNaN(numAmount) || numAmount <= 0) return;
    
    addTransaction(desc, category, numAmount, type);
    
    // Reset form
    setDesc('');
    setAmount('');
    setType('expense');
    setCategory('Dining');
    setShowAddModal(false);
  };

  // Icon mappings
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

  return (
    <IonPage style={{ background: '#f3f4f6' }}>
      <IonContent fullscreen>
        {/* Header Title with Add Trigger */}
        <div className="ledger-header">
          <h2 className="ledger-title">Transactions</h2>
          <button className="add-record-btn" onClick={() => setShowAddModal(true)}>
            <IonIcon icon={addOutline} />
            <span>Add</span>
          </button>
        </div>

        {/* Interactive Search Bar */}
        <div className="search-container">
          <div className="search-bar">
            <IonIcon icon={searchOutline} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by description or category..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {/* Highlights Cards (Grid Layout) */}
        <div className="highlights-grid">
          {/* Card 1: Total Spent */}
          <div className="highlight-card spent-card">
            <span className="card-label">Total Spent</span>
            <h2 className="card-amount">${totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
            <span className="card-sub-info">+4.5% vs last month</span>
            
            {/* Visual Micro Bar Chart inside Card */}
            <div className="micro-chart">
              <div className="bar" style={{ height: '35%' }}></div>
              <div className="bar" style={{ height: '60%' }}></div>
              <div className="bar" style={{ height: '40%' }}></div>
              <div className="bar" style={{ height: '80%' }}></div>
              <div className="bar" style={{ height: '55%' }}></div>
            </div>
          </div>

          {/* Card 2: Top Spending */}
          <div className="highlight-card top-spending-card">
            <span className="card-label">Top Spending</span>
            <div className="top-spending-list">
              {sortedBudgets.map((b, idx) => (
                <div key={idx} className="top-spending-item">
                  <span className="top-cat-name">{b.category}</span>
                  <span className="top-cat-amount">${b.spent.toFixed(0)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Transaction History list */}
        <div className="ledger-list-container" style={{ paddingBottom: '100px' }}>
          <h3 className="section-title" style={{ margin: '0 20px 12px 20px' }}>History</h3>
          {filteredTransactions.length === 0 ? (
            <div className="empty-state">
              <p>No transactions found matching search.</p>
            </div>
          ) : (
            <div className="ledger-list">
              {filteredTransactions.map((tx) => (
                <div key={tx.id} className="ledger-item">
                  <div className="ledger-item-left">
                    <div 
                      className="ledger-icon"
                      style={{ backgroundColor: `${getCategoryColor(tx.category, tx.type)}15`, color: getCategoryColor(tx.category, tx.type) }}
                    >
                      <IonIcon icon={getCategoryIcon(tx.category, tx.type)} />
                    </div>
                    <div>
                      <h4 className="ledger-desc">{tx.description}</h4>
                      <p className="ledger-meta">{tx.category} • {tx.date} • {tx.time}</p>
                    </div>
                  </div>
                  <div className="ledger-item-right">
                    <span className={`ledger-amount ${tx.type}`}>
                      {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                    </span>
                    <button className="delete-tx-btn" onClick={() => deleteTransaction(tx.id)}>
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Custom Slide-Up Form Modal */}
        <IonModal isOpen={showAddModal} onDidDismiss={() => setShowAddModal(false)} className="add-tx-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>New Record</h3>
              <button className="close-modal-btn" onClick={() => setShowAddModal(false)}>
                <IonIcon icon={closeOutline} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="modal-form">
              {/* Transaction Type Segment */}
              <div className="form-group">
                <label>Type</label>
                <div className="type-toggle">
                  <button 
                    type="button" 
                    className={`toggle-btn ${type === 'expense' ? 'active expense' : ''}`}
                    onClick={() => setType('expense')}
                  >
                    Expense
                  </button>
                  <button 
                    type="button" 
                    className={`toggle-btn ${type === 'income' ? 'active income' : ''}`}
                    onClick={() => setType('income')}
                  >
                    Income
                  </button>
                </div>
              </div>

              {/* Description */}
              <div className="form-group">
                <label>Description</label>
                <input 
                  type="text" 
                  placeholder="e.g. Starbucks, Salary Payment" 
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  required
                />
              </div>

              {/* Amount */}
              <div className="form-group">
                <label>Amount ($)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  placeholder="0.00" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>

              {/* Category */}
              <div className="form-group">
                <label>Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="Dining">Dining</option>
                  <option value="Groceries">Groceries</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Transport">Transport</option>
                  <option value="Utilities">Utilities</option>
                </select>
              </div>

              <button type="submit" className="form-submit-btn">
                Add Transaction
              </button>
            </form>
          </div>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
