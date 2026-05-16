import { Link, useLocation } from 'react-router';
import { LayoutDashboard, Wifi, Download } from 'lucide-react';
import logoImg from '../../imports/ChatGPT_Image_May_15__2026__08_30_39_PM-1.png';

export function Sidebar() {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/scan-results', icon: Wifi, label: 'Scan Results' },
    { path: '/export', icon: Download, label: 'Export' },
  ];

  return (
    <aside className="w-64 bg-[#fafbfc] border-r border-[#e5e7eb] flex flex-col">
      <div className="p-6 border-b border-[#e5e7eb]">
        <img
          src="/logo.png"
          alt="BeaconGuard Logo"
          className="w-12 h-12 object-contain"
        />
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                    ${isActive
                      ? 'bg-[#0c7c84] text-white shadow-sm'
                      : 'text-[#6b7280] hover:bg-white hover:text-[#1f2937]'
                    }
                  `}
                >
                  <Icon size={20} />
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-[#e5e7eb]">
        <div className="px-4 py-3 bg-white rounded-lg border border-[#e5e7eb]">
          <p className="text-xs text-[#6b7280] mb-1">Security Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-[#0c7c84] rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-[#1f2937]">Active</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
