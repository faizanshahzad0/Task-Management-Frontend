'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { SIDEBAR_MENU } from '@/utils/constants/sidebarMenu';

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-800 border-r border-slate-700 h-screen fixed left-0 top-16 flex flex-col z-30">
      <div className="p-6 border-b border-slate-700">
        <h2 className="text-xl font-bold text-white">Tasks App</h2>
      </div>
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {SIDEBAR_MENU.map((item) => {
            const isActive = pathname === item.link;
            return (
              <li key={item.link}>
                <Link
                  href={item.link}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {item.icon && (
                    <item.icon className="text-lg" />
                  )}
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;

