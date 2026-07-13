import React, { createContext, useState, useEffect, useContext } from 'react';

export interface Transaction {
  id: string;
  description: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
  time: string;
  date: string;
  status: 'Completed' | 'Pending';
}

export interface Contact {
  name: string;
  avatar: string;
  color: string;
  phone: string;
  upiId: string;
}

export interface Budget {
  category: string;
  spent: number;
  limit: number;
  color: string;
}

interface FinanceContextProps {
  balance: number;
  transactions: Transaction[];
  contacts: Contact[];
  budgets: Budget[];
  addTransaction: (description: string, category: string, amount: number, type: 'income' | 'expense') => void;
  deleteTransaction: (id: string) => void;
  updateBudgetLimit: (category: string, limit: number) => void;
}

const FinanceContext = createContext<FinanceContextProps | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state or local storage
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('finflow_transactions');
    if (saved) {
      const parsed = JSON.parse(saved);
      const hasOldNames = parsed.some((t: any) => 
        t.description.includes('Josh') || 
        t.description.includes('Brian') || 
        t.description.includes('Sarah')
      );
      if (!hasOldNames) {
        return parsed;
      }
      localStorage.removeItem('finflow_transactions');
      localStorage.removeItem('finflow_budgets');
    }
    return [
      { id: '1', description: 'Withdraw from ATM', category: 'Utilities', amount: 10.33, type: 'expense', time: '22:11', date: 'Today', status: 'Completed' },
      { id: '2', description: 'Send to Rohan', category: 'Dining', amount: 15.12, type: 'expense', time: '19:21', date: 'Today', status: 'Completed' },
      { id: '3', description: 'Tax bills', category: 'Utilities', amount: 28.57, type: 'expense', time: '15:53', date: 'Today', status: 'Completed' },
      { id: '4', description: 'Received from Priya', category: 'Utilities', amount: 13.82, type: 'income', time: '12:26', date: 'Today', status: 'Completed' },
      { id: '5', description: 'Internet bills', category: 'Utilities', amount: 15.12, type: 'expense', time: '10:33', date: 'Today', status: 'Completed' },
      { id: '6', description: 'Send to Anjali', category: 'Dining', amount: 10.24, type: 'expense', time: '08:15', date: 'Today', status: 'Completed' },
      { id: '7', description: 'Apple Store', category: 'Shopping', amount: 199.00, type: 'expense', time: '16:02', date: 'Nov 15, 2022', status: 'Completed' },
      { id: '8', description: 'Cafe Coffee Day', category: 'Dining', amount: 6.20, type: 'expense', time: '09:41', date: 'Nov 15, 2022', status: 'Completed' },
      { id: '9', description: 'Rent Payment', category: 'Utilities', amount: 1200.00, type: 'expense', time: '13:00', date: 'Nov 13, 2022', status: 'Completed' },
      { id: '10', description: 'Flipkart Order', category: 'Shopping', amount: 45.60, type: 'expense', time: '16:45', date: 'Nov 18, 2022', status: 'Completed' },
      { id: '11', description: 'Ola Ride', category: 'Transport', amount: 22.15, type: 'expense', time: '14:20', date: 'Nov 18, 2022', status: 'Completed' }
    ];
  });

  const [budgets, setBudgets] = useState<Budget[]>(() => {
    const saved = localStorage.getItem('finflow_budgets');
    if (saved) return JSON.parse(saved);
    return [
      { category: 'Dining', spent: 710, limit: 900, color: '#10b981' }, // Greenish
      { category: 'Groceries', spent: 980, limit: 1100, color: '#f97316' }, // Orange
      { category: 'Shopping', spent: 550, limit: 600, color: '#a855f7' }, // Purple
      { category: 'Transport', spent: 340, limit: 400, color: '#3b82f6' }, // Blue
      { category: 'Utilities', spent: 180, limit: 200, color: '#06b6d4' } // Cyan
    ];
  });

  const [balance, setBalance] = useState<number>(24983.64);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('finflow_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('finflow_budgets', JSON.stringify(budgets));
  }, [budgets]);

  // Recalculate balance and category expenses dynamically
  useEffect(() => {
    let baseBalance = 24983.64;
    // Calculate total net transactions from user inputs relative to initial balance
    const userAddedTx = transactions.filter(t => !['1','2','3','4','5','6','7','8','9','10','11'].includes(t.id));
    let delta = 0;
    userAddedTx.forEach(tx => {
      if (tx.type === 'income') {
        delta += tx.amount;
      } else {
        delta -= tx.amount;
      }
    });
    setBalance(baseBalance + delta);

    // Dynamic spent calculations for budgets
    const updatedBudgets = budgets.map(b => {
      const catTx = transactions.filter(t => t.category.toLowerCase() === b.category.toLowerCase() && t.type === 'expense');
      const totalSpent = catTx.reduce((sum, current) => sum + current.amount, 0);
      return { ...b, spent: Math.round(totalSpent * 100) / 100 };
    });

    // Check if changed to avoid loop
    const changed = updatedBudgets.some((b, i) => b.spent !== budgets[i].spent);
    if (changed) {
      setBudgets(updatedBudgets);
    }
  }, [transactions]);

  const contacts: Contact[] = [
    { name: 'Priya', avatar: '', color: '#f472b6', phone: '+91 98765 11111', upiId: 'priya@okaxis' },
    { name: 'Rohan', avatar: '', color: '#60a5fa', phone: '+91 98765 22222', upiId: 'rohan@okhdfc' },
    { name: 'Anjali', avatar: '', color: '#34d399', phone: '+91 98765 33333', upiId: 'anjali@okicici' },
    { name: 'Kabir', avatar: '', color: '#fbbf24', phone: '+91 98765 44444', upiId: 'kabir@okaxis' },
    { name: 'Diya', avatar: '', color: '#a78bfa', phone: '+91 98765 55555', upiId: 'diya@oksbi' }
  ];

  const addTransaction = (description: string, category: string, amount: number, type: 'income' | 'expense') => {
    const now = new Date();
    const pad = (num: number) => num.toString().padStart(2, '0');
    const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
    
    const newTx: Transaction = {
      id: Date.now().toString(),
      description,
      category,
      amount,
      type,
      time: timeStr,
      date: 'Today',
      status: 'Completed'
    };

    setTransactions(prev => [newTx, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const updateBudgetLimit = (category: string, limit: number) => {
    setBudgets(prev => prev.map(b => b.category === category ? { ...b, limit } : b));
  };

  return (
    <FinanceContext.Provider value={{
      balance,
      transactions,
      contacts,
      budgets,
      addTransaction,
      deleteTransaction,
      updateBudgetLimit
    }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
