import { useState, useEffect } from "react";
import { Menu, UserCircle, Bell, X } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchNotifications, markAllNotificationsRead } from "../services/notifications";

interface NotificationItem {
  id: string;
  read_at: string | null;
  message?: string;
  data?: {
    message?: string;
  };
}

export default function Navbar({ appName = "Campus Ticketing System", onMenuClick, isSidebarOpen = false }: any) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    fetchNotifications().then(setNotifications).catch(console.error);
  }, []);

  async function handleBellClick() {
    const nextOpen = !showDropdown;
    setShowDropdown(nextOpen);

    if (!showDropdown && notifications.some((n: any) => !n.read_at)) {
      setNotifications((current: any[]) => current.map((notification) => ({
        ...notification,
        read_at: notification.read_at ?? new Date().toISOString(),
      })));

      try {
        await markAllNotificationsRead();
      } catch (error) {
        console.error(error);
        fetchNotifications().then(setNotifications).catch(console.error);
      }
    }
  }

  const unreadCount = notifications.filter((n: any) => !n.read_at).length;

  return (
    <header className="h-16 bg-white flex items-center justify-between px-4 relative z-40 border-b border-gray-100 rounded-t-[32px]">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} aria-expanded={isSidebarOpen} className="p-2 hover:bg-gray-100 rounded-full">
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">{appName}</h1>
      </div>

      <div className="flex items-center gap-2 relative">
        <button onClick={handleBellClick} className="relative p-2 rounded-full hover:bg-gray-100">
          <Bell className="w-6 h-6 text-gray-700" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          )}
        </button>

        {showDropdown && (
          <div className="absolute top-12 right-0 w-80 bg-white border border-gray-100 shadow-xl rounded-2xl p-4 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900 text-sm">Notifications</h3>
              <button onClick={() => setShowDropdown(false)}><X className="w-4 h-4 text-gray-400" /></button>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-xs text-gray-400 italic text-center py-4">All clear.</p>
              ) : (
                notifications.map((n: any) => (
                  <div key={n.id} className={`p-3 rounded-xl text-[11px] ${n.read_at ? 'bg-gray-50' : 'bg-blue-50 border border-blue-100'}`}>
                    {n.message || n.data?.message || "Notification"}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        <Link to="/settings" className="p-2 rounded-full hover:bg-gray-100">
          <UserCircle className="w-7 h-7 text-gray-700" />
        </Link>
      </div>
    </header>
  );
}