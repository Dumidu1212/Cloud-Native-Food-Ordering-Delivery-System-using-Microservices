// src/hooks/useNotifications.js
import { useState, useEffect, useCallback } from 'react';
import { fetchUnreadCount, fetchNotifications, markNotificationAsRead } from '../services/notificationApi.js';

export function useNotifications(pollInterval = 30000) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadCount = useCallback(async () => {
    try {
      const { data } = await fetchUnreadCount();
      setUnreadCount(data.unreadCount);
    } catch (err) {
      console.error('Failed loading unread count', err);
    }
  }, []);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await fetchNotifications(1, 10);
      setNotifications(data);
    } catch (err) {
      console.error('Failed loading notifications', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCount();
    const iv = setInterval(loadCount, pollInterval);
    return () => clearInterval(iv);
  }, [loadCount, pollInterval]);

  return {
    unreadCount,
    notifications,
    loading,
    reload: loadAll,
    markAsRead: async id => {
      await markNotificationAsRead(id);
      await loadCount();
      await loadAll();
    }
  };
}