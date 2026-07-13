import React, { useState } from 'react';
import { IonContent, IonPage, IonIcon } from '@ionic/react';
import {
  notificationsOutline,
  add,
  arrowForwardOutline,
  ellipsisHorizontal,
  flashOutline,
  wifiOutline,
  calendarOutline,
  callOutline,
  restaurantOutline,
  bagHandleOutline,
  carOutline,
  cashOutline,
  walletOutline
} from 'ionicons/icons';
import { useFinance, Transaction } from '../context/FinanceContext';
import './Tab1.css';

const Tab1: React.FC = () => {
  const { balance, transactions, contacts, addTransaction } = useFinance();
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [transferAmount, setTransferAmount] = useState('');

  // Helper to match category to IonIcon
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

  // Helper to match category to color
  const getCategoryColor = (category: string, type: string) => {
    if (type === 'income') return '#10b981'; // Green
    switch (category.toLowerCase()) {
      case 'utilities': return '#06b6d4'; // Cyan
      case 'dining': return '#f59e0b'; // Amber
      case 'shopping': return '#a855f7'; // Purple
      case 'transport': return '#3b82f6'; // Blue
      default: return '#6b7280'; // Gray
    }
  };

  // Billings options
  const billings = [
    { name: 'Utilities', icon: flashOutline, color: '#06b6d4' },
    { name: 'Internet', icon: wifiOutline, color: '#3b82f6' },
    { name: 'Subscription', icon: calendarOutline, color: '#a855f7' },
    { name: 'Phone', icon: callOutline, color: '#ec4899' }
  ];

  // Get only first 4 recent transactions for the dashboard preview
  const recentTransactions = transactions.slice(0, 4);

  return (
    <IonPage style={{ background: '#f3f4f6' }}>
      <IonContent fullscreen className="ion-padding-bottom">
        {/* Header Section */}
        <div className="header-container">
          <div className="profile-badge">
            <div className="profile-img-placeholder">AS</div>
            <div>
              <p className="welcome-text">Good morning,</p>
              <h2 className="profile-name">Anurag Sharma</h2>
            </div>
          </div>
          <button className="notification-btn">
            <IonIcon icon={notificationsOutline} />
          </button>
        </div>

        {/* Balance Card */}
        <div className="finflow-card balance-card">
          <p className="balance-label">Total Balance</p>
          <div className="balance-value-row">
            <h1 className="balance-amount">${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h1>
          </div>
          <div className="trend-badge">
            <span className="trend-text">+1.8% today</span>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="action-row">
          <button className="btn-primary">
            <IonIcon icon={add} />
            <span>Deposit</span>
          </button>
          <button className="btn-secondary">
            <IonIcon icon={arrowForwardOutline} style={{ transform: 'rotate(-45deg)' }} />
            <span>Send</span>
          </button>
          <button className="btn-more">
            <IonIcon icon={ellipsisHorizontal} />
          </button>
        </div>

        {/* Quick Transfer Section */}
        <div className="section-container">
          <h3 className="section-title">Quick Transfer</h3>
          <div className="horizontal-scroll no-scrollbar">
            {contacts.map((contact, index) => (
              <div key={index} className="contact-item" onClick={() => setSelectedContact(contact)}>
                <div className="avatar-wrapper">
                  <div className="contact-avatar-placeholder" style={{ backgroundColor: `${contact.color}15`, color: contact.color }}>
                    {contact.name[0]}
                  </div>
                  <span className="status-dot" style={{ backgroundColor: contact.color }}></span>
                </div>
                <span className="contact-name">{contact.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Billings Section */}
        <div className="section-container">
          <h3 className="section-title">Billings</h3>
          <div className="horizontal-scroll no-scrollbar">
            {billings.map((bill, index) => (
              <div key={index} className="billing-card">
                <div className="billing-icon-wrapper" style={{ backgroundColor: `${bill.color}15`, color: bill.color }}>
                  <IonIcon icon={bill.icon} />
                </div>
                <span className="billing-name">{bill.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="section-container" style={{ paddingBottom: '90px' }}>
          <div className="section-header">
            <h3 className="section-title">Recent Activity</h3>
          </div>
          <div className="activity-list">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="activity-item">
                <div className="activity-left">
                  <div
                    className="activity-icon-container"
                    style={{ backgroundColor: `${getCategoryColor(tx.category, tx.type)}15`, color: getCategoryColor(tx.category, tx.type) }}
                  >
                    <IonIcon icon={getCategoryIcon(tx.category, tx.type)} />
                  </div>
                  <div>
                    <h4 className="activity-desc">{tx.description}</h4>
                    <p className="activity-meta">{tx.date} • {tx.time}</p>
                  </div>
                </div>
                <div className={`activity-amount ${tx.type}`}>
                  {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Send Overlay Modal */}
        {selectedContact && (
          <div className="transfer-modal-overlay" onClick={() => setSelectedContact(null)}>
            <div className="transfer-modal animate-slide-up" onClick={(e) => e.stopPropagation()}>
              <div className="transfer-modal-header">
                <h3>Quick Transfer</h3>
                <button className="close-transfer-btn" onClick={() => setSelectedContact(null)}>×</button>
              </div>
              <div className="transfer-modal-body">
                <div className="transfer-recipient">
                  <div className="transfer-avatar" style={{ backgroundColor: `${selectedContact.color}15`, color: selectedContact.color }}>
                    {selectedContact.name[0]}
                  </div>
                  <h4>{selectedContact.name}</h4>
                  <p className="recipient-info">{selectedContact.upiId} • {selectedContact.phone}</p>
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
                }}>
                  <div className="transfer-amount-input">
                    <span className="currency-symbol">$</span>
                    <input 
                      type="number" 
                      step="0.01" 
                      placeholder="0.00" 
                      value={transferAmount} 
                      onChange={(e) => setTransferAmount(e.target.value)} 
                      autoFocus
                      required 
                    />
                  </div>
                  <button type="submit" className="confirm-transfer-btn">Confirm Transfer</button>
                </form>
              </div>
            </div>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
