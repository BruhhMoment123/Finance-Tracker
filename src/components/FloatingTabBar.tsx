import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { IonIcon } from '@ionic/react';
import { 
  homeOutline, home,
  calendarOutline, calendar,
  pieChartOutline, pieChart,
  personOutline, person
} from 'ionicons/icons';

const FloatingTabBar: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  
  const tabs = [
    { id: 'tab1', path: '/tab1', activeIcon: home, inactiveIcon: homeOutline, label: 'Home' },
    { id: 'tab2', path: '/tab2', activeIcon: calendar, inactiveIcon: calendarOutline, label: 'Ledger' },
    { id: 'tab3', path: '/tab3', activeIcon: pieChart, inactiveIcon: pieChartOutline, label: 'Budget' },
    { id: 'tab4', path: '/tab4', activeIcon: person, inactiveIcon: personOutline, label: 'Profile' }
  ];

  const handleTabClick = (path: string) => {
    history.push(path);
  };

  return (
    <div className="floating-tab-container">
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path || (tab.path === '/tab1' && location.pathname === '/');
        
        return (
          <div 
            key={tab.id} 
            className="floating-tab-button" 
            onClick={() => handleTabClick(tab.path)}
          >
            {isActive ? (
              <div className="floating-tab-pill">
                <IonIcon icon={tab.activeIcon} style={{ fontSize: '20px', color: '#ffffff' }} />
              </div>
            ) : (
              <IonIcon 
                icon={tab.inactiveIcon} 
                className="floating-tab-icon-inactive" 
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default FloatingTabBar;
