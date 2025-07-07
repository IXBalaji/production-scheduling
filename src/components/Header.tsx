import React from 'react';
import { Factory, Bell, Settings, User } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Factory className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-xl font-bold text-gray-900">
              ManufacturingPro
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Bell className="h-6 w-6 text-gray-400 hover:text-gray-600 cursor-pointer" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </div>
            <Settings className="h-6 w-6 text-gray-400 hover:text-gray-600 cursor-pointer" />
            <div className="flex items-center space-x-2">
              <User className="h-8 w-8 text-gray-400 bg-gray-100 rounded-full p-1" />
              <span className="text-sm font-medium text-gray-700">John Doe</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;