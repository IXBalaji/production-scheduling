import React, { useState } from 'react';
import { 
  BarChart3, 
  Calendar, 
  Cog, 
  Package, 
  Users, 
  TrendingUp,
  AlertTriangle,
  Settings
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {

  const navigation = [
    { name: 'Dashboard', icon: BarChart3, id: 'dashboard' },
    { name: 'Production Schedule', icon: Calendar, id: 'schedule' },
    { name: 'Machine Status', icon: Cog, id: 'machines' },
    { name: 'Orders', icon: Package, id: 'orders' },
    { name: 'Resources', icon: Users, id: 'resources' },
    { name: 'Analytics', icon: TrendingUp, id: 'analytics' },
    { name: 'Alerts', icon: AlertTriangle, id: 'alerts' },
    { name: 'Settings', icon: Settings, id: 'settings' },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-6">Production Control</h2>
        <nav className="space-y-2">
          {navigation.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${
                activeTab === item.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.name}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;