import { useState, useEffect, useRef } from 'react';
import { Bell, Loader2 }               from 'lucide-react';
import { useNotifications }            from '../../hooks/useNotifications';

export default function NotificationBell() {
  const { unread, list, loading, reload, markAsRead, markAll } = useNotifications();
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // close on click-outside or Esc
  useEffect(() => {
    if (!open) return;
    const onClick = e => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const onKey = e => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('mousedown', onClick);
    window.addEventListener('keydown',   onKey);
    return () => {
      window.removeEventListener('mousedown', onClick);
      window.removeEventListener('keydown',   onKey);
    };
  }, [open]);

  const toggle = () => {
    if (!open) reload();
    setOpen(o => !o);
  };

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <button
        onClick={toggle}
        className="p-2 relative focus:outline-none"
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white
                           rounded-full text-[10px] w-5 h-5 flex items-center
                           justify-center leading-none">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-96 max-w-xs bg-white
                        shadow-lg rounded-lg z-50">
          {/* Header */}
          <div className="px-4 py-2 border-b flex items-center justify-between">
            <span className="font-semibold">Notifications</span>
            {loading
              ? <Loader2 className="animate-spin" size={16} />
              : (
                <div className="space-x-3 text-xs text-blue-600">
                  <button onClick={reload}>Refresh</button>
                  {unread > 0 && <button onClick={markAll}>Mark all read</button>}
                </div>
              )}
          </div>
          {/* List */}
          <ul className="max-h-72 overflow-y-auto">
            {(!loading && list.length === 0) ? (
              <li className="p-4 text-center text-gray-500">No notifications</li>
            ) : (
              list.map(n => (
                <li
                  key={n._id}
                  className={`px-4 py-3 border-b last:border-b-0 
                              ${n.isRead ? 'bg-gray-100' : 'bg-white'}`}
                >
                  <div className="flex justify-between gap-2 items-start">
                    <div>
                      <p className="font-medium">{n.payload.title}</p>
                      <p className="text-gray-600">{n.payload.message}</p>
                      <p className="text-[11px] text-gray-400">
                        {new Date(n.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {!n.isRead && (
                      <button
                        onClick={() => markAsRead(n._id)}
                        className="text-blue-600 text-xs"
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
