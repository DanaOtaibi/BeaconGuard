import { Link, useLocation } from 'react-router';
import { LayoutDashboard, Wifi, Download } from 'lucide-react';
import logoImg from '../../imports/beaconguard-logo-full.png';

export function Sidebar() {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/scan-results', icon: Wifi, label: 'Scan Results' },
    { path: '/export', icon: Download, label: 'Export' },
  ];

  return (
    <aside className="w-64 bg-[#fafbfc] border-r border-[#e5e7eb] flex flex-col">
      <div className="p-5 border-b border-[#e5e7eb] flex justify-center">
        <img
          src={logoImg}
          alt="BeaconGuard Logo"
          className="w-full max-w-[200px] h-auto object-contain"
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
    </aside>
  );
}
