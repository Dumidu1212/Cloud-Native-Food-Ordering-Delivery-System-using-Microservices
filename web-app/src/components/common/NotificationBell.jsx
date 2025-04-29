// src/components/admin/NotificationBell.jsx
import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications.js';

export default function NotificationBell() {
  const { unreadCount, notifications, loading, reload, markAsRead } = useNotifications();
  const [open, setOpen] = useState(false);

  const toggle = () => {
    if (!open) reload();
    setOpen(!open);
  };

  return (
    <div className="relative">
      <button onClick={toggle} className="p-2 focus:outline-none">
        <Bell />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg overflow-hidden z-50">
          <div className="p-2 flex justify-between items-center">
            <span className="font-semibold">Notifications</span>
            <button onClick={reload} disabled={loading} className="text-sm text-blue-500">
              {loading ? 'Loading…' : 'Refresh'}
            </button>
          </div>
          <ul className="max-h-60 overflow-y-auto">
            {notifications.length === 0
              ? <li className="p-4 text-center text-gray-500">No notifications</li>
              : notifications.map(n => (
                <li key={n._id} className={`p-3 border-b ${n.isRead ? 'bg-gray-100' : 'bg-white'}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{n.payload.title}</p>
                      <p className="text-sm text-gray-600">{n.payload.message}</p>
                      <p className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleString()}</p>
                    </div>
                    {!n.isRead && (
                      <button onClick={() => markAsRead(n._id)} className="text-xs text-blue-500 ml-2">
                        Mark read
                      </button>
                    )}
                  </div>
                </li>
              ))
            }
          </ul>
        </div>
      )}
    </div>
  );
}