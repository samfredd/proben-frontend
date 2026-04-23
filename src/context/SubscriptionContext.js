'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/api/api';
import { getActiveSubscription } from '@/utils/subscriptions';

const SubscriptionContext = createContext(null);

export function SubscriptionProvider({ children }) {
  const { user, loading: authLoading } = useAuth();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== 'client') {
      setLoading(false);
      return;
    }
    api
      .get('/subscriptions')
      .then((res) => setSubscriptions(res.data || []))
      .catch(() => setSubscriptions([]))
      .finally(() => setLoading(false));
  }, [user, authLoading]);

  const activePlan = getActiveSubscription(subscriptions);
  const isTrialing = !loading && !activePlan;

  return (
    <SubscriptionContext.Provider value={{ subscriptions, activePlan, isTrialing, loading }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  return useContext(SubscriptionContext);
}
