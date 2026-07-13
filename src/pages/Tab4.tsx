import React, { useState } from 'react';
import { IonContent, IonPage, IonIcon } from '@ionic/react';
import {
  personOutline,
  shieldCheckmarkOutline,
  settingsOutline,
  cardOutline,
  phonePortraitOutline,
  notificationsOutline,
  fingerPrintOutline,
  helpCircleOutline,
  logOutOutline,
  lockClosedOutline
} from 'ionicons/icons';
import './Tab4.css';

const Tab4: React.FC = () => {
  // Local toggle states for interactive demo
  const [dailyAlerts, setDailyAlerts] = useState(true);
  const [biometrics, setBiometrics] = useState(false);

  return (
    <IonPage style={{ background: '#f3f4f6' }}>
      <IonContent fullscreen>
        {/* Header Title */}
        <div className="profile-header">
          <h2 className="profile-title">Profile</h2>
          <button className="settings-btn">
            <IonIcon icon={settingsOutline} />
          </button>
        </div>

        {/* User Profile Card */}
        <div className="finflow-card user-card">
          <div className="user-card-avatar-placeholder">AS</div>
          <h3 className="user-name">Anurag Sharma</h3>
          <p className="user-email">anurag.sharma@1233424.com</p>
          <div className="badge-premium">
            <IonIcon icon={shieldCheckmarkOutline} style={{ marginRight: '4px' }} />
            <span>Premium Tier</span>
          </div>
        </div>

        {/* 1. Account Details Section */}
        <div className="section-container">
          <h3 className="section-title">Personal Information</h3>
          <div className="settings-list">
            <div className="settings-item">
              <div className="settings-item-label">
                <IonIcon icon={phonePortraitOutline} className="settings-item-icon" />
                <span>Phone Number</span>
              </div>
              <span className="settings-item-value">+91 98765 43210</span>
            </div>
            <div className="settings-item">
              <div className="settings-item-label">
                <IonIcon icon={cardOutline} className="settings-item-icon" />
                <span>Primary Bank</span>
              </div>
              <span className="settings-item-value">HDFC Bank</span>
            </div>
            <div className="settings-item">
              <div className="settings-item-label">
                <IonIcon icon={lockClosedOutline} className="settings-item-icon" />
                <span>Account Tier</span>
              </div>
              <span className="settings-item-value">Savings Classic</span>
            </div>
          </div>
        </div>

        {/* 2. Preferences and Toggles */}
        <div className="section-container">
          <h3 className="section-title">App Preferences</h3>
          <div className="settings-list">
            <div className="settings-item" onClick={() => setDailyAlerts(!dailyAlerts)}>
              <div className="settings-item-label">
                <IonIcon icon={notificationsOutline} className="settings-item-icon" />
                <span>Daily Spending Alerts</span>
              </div>
              <span className={`settings-item-value toggle-pill ${dailyAlerts ? 'active' : ''}`}>
                {dailyAlerts ? 'ON' : 'OFF'}
              </span>
            </div>
            <div className="settings-item" onClick={() => setBiometrics(!biometrics)}>
              <div className="settings-item-label">
                <IonIcon icon={fingerPrintOutline} className="settings-item-icon" />
                <span>Biometric Authentication</span>
              </div>
              <span className={`settings-item-value toggle-pill ${biometrics ? 'active' : ''}`}>
                {biometrics ? 'ON' : 'OFF'}
              </span>
            </div>
            <div className="settings-item">
              <div className="settings-item-label">
                <IonIcon icon={personOutline} className="settings-item-icon" />
                <span>Preferred Currency</span>
              </div>
              <span className="settings-item-value">USD ($)</span>
            </div>
          </div>
        </div>

        {/* 3. Support & Log Out Actions */}
        <div className="section-container" style={{ paddingBottom: '100px' }}>
          <h3 className="section-title">Support</h3>
          <div className="settings-list">
            <div className="settings-item">
              <div className="settings-item-label">
                <IonIcon icon={helpCircleOutline} className="settings-item-icon" />
                <span>Help Center & FAQs</span>
              </div>
              <span className="settings-item-value">&#8250;</span>
            </div>
            <div className="settings-item logout-action" onClick={() => alert('Log out clicked!')}>
              <div className="settings-item-label" style={{ color: '#ef4444' }}>
                <IonIcon icon={logOutOutline} className="settings-item-icon" style={{ color: '#ef4444' }} />
                <span>Log Out</span>
              </div>
              <span className="settings-item-value" style={{ color: '#ef4444' }}>&#8250;</span>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab4;
