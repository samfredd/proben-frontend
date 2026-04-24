'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/api/api';
import { getActiveSubscription } from '@/utils/subscriptions';

const SubscriptionContext = createContext(null);

export function SubscriptionProvider({ children }) {
  const { user, loading: authLoading } = useAuth();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSubscriptions = useCallback(async () => {
    if (!user || user.role !== 'client') return;
    setLoading(true);
    try {
      const res = await api.get('/subscriptions');
      setSubscriptions(res.data || []);
    } catch {
      setSubscriptions([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== 'client') {
      setLoading(false);
      return;
    }
    fetchSubscriptions();
  }, [user, authLoading, fetchSubscriptions]);

  const activePlan = getActiveSubscription(subscriptions);
  const isTrialing = !loading && !activePlan;

  return (
    <SubscriptionContext.Provider value={{ subscriptions, activePlan, isTrialing, loading, refresh: fetchSubscriptions }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  return useContext(SubscriptionContext);
}
