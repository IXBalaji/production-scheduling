import React, { useState } from 'react';
import { Clock, CheckCircle, AlertCircle, Play, Calendar, List } from 'lucide-react';
import CalendarView from './CalendarView';
import ProductionCalendarView from './ProductionCalendarView';

const ProductionSchedule = () => {
  const [viewMode, setViewMode] = useState<'list' | 'calendar' | 'timeline'>('timeline');

  // Enhanced schedule data with proper datetime objects
  const scheduleData = [
    {
      id: 1,
      orderNo: 'PO-2024-001',
      product: 'CNC Machined Parts',
      machine: 'CNC-001',
      startDateTime: new Date(2024, 0, 10, 8, 0), // Jan 10, 2024, 8:00 AM
      endDateTime: new Date(2024, 0, 10, 12, 0), // Jan 10, 2024, 12:00 PM
      status: 'running' as const,
      progress: 65,
      priority: 'high' as const
    },
    {
      id: 2,
      orderNo: 'PO-2024-002',
      product: 'Welded Assemblies',
      machine: 'WLD-002',
      startDateTime: new Date(2024, 0, 10, 10, 0), // Jan 10, 2024, 10:00 AM
      endDateTime: new Date(2024, 0, 10, 16, 0), // Jan 10, 2024, 4:00 PM
      status: 'scheduled' as const,
      progress: 0,
      priority: 'medium' as const
    },
    {
      id: 3,
      orderNo: 'PO-2024-003',
      product: 'Precision Bearings',
      machine: 'LAT-003',
      startDateTime: new Date(2024, 0, 10, 14, 0), // Jan 10, 2024, 2:00 PM
      endDateTime: new Date(2024, 0, 10, 18, 0), // Jan 10, 2024, 6:00 PM
      status: 'completed' as const,
      progress: 100,
      priority: 'low' as const
    },
    {
      id: 4,
      orderNo: 'PO-2024-004',
      product: 'Hydraulic Cylinders',
      machine: 'CNC-002',
      startDateTime: new Date(2024, 0, 10, 16, 0), // Jan 10, 2024, 4:00 PM
      endDateTime: new Date(2024, 0, 10, 22, 0), // Jan 10, 2024, 10:00 PM
      status: 'delayed' as const,
      progress: 30,
      priority: 'high' as const
    },
    {
      id: 5,
      orderNo: 'PO-2024-005',
      product: 'Steel Fabrication',
      machine: 'WLD-001',
      startDateTime: new Date(2024, 0, 11, 6, 0), // Jan 11, 2024, 6:00 AM
      endDateTime: new Date(2024, 0, 11, 14, 0), // Jan 11, 2024, 2:00 PM
      status: 'scheduled' as const,
      progress: 0,
      priority: 'medium' as const
    },
    {
      id: 6,
      orderNo: 'PO-2024-006',
      product: 'Aluminum Parts',
      machine: 'CNC-003',
      startDateTime: new Date(2024, 0, 11, 9, 0), // Jan 11, 2024, 9:00 AM
      endDateTime: new Date(2024, 0, 11, 17, 0), // Jan 11, 2024, 5:00 PM
      status: 'scheduled' as const,
      progress: 0,
      priority: 'low' as const
    },
    {
      id: 7,
      orderNo: 'PO-2024-007',
      product: 'Custom Brackets',
      machine: 'LAT-001',
      startDateTime: new Date(2024, 0, 12, 8, 30), // Jan 12, 2024, 8:30 AM
      endDateTime: new Date(2024, 0, 12, 15, 30), // Jan 12, 2024, 3:30 PM
      status: 'scheduled' as const,
      progress: 0,
      priority: 'high' as const
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Play className="h-4 w-4 text-green-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'delayed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'delayed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const calculateDuration = (start: Date, end: Date) => {
    const diffMs = end.getTime() - start.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${diffHours}h ${diffMinutes > 0 ? diffMinutes + 'm' : ''}`;
  };

  const renderListView = () => (
    <div className="space-y-4">
      {scheduleData.map((item) => (
        <div key={item.id} className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 space-y-2 sm:space-y-0">
            <div className="flex items-center space-x-3">
              {getStatusIcon(item.status)}
              <h4 className="text-sm sm:text-base font-medium text-gray-900">{item.orderNo}</h4>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(item.priority)}`}>
                {item.priority}
              </span>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
              {item.status}
            </span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-3">
            <div>
              <p className="text-xs text-gray-500">Product</p>
              <p className="text-xs sm:text-sm font-medium">{item.product}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Machine</p>
              <p className="text-xs sm:text-sm font-medium">{item.machine}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Start Time</p>
              <p className="text-xs sm:text-sm font-medium">{formatDateTime(item.startDateTime)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Duration</p>
              <p className="text-xs sm:text-sm font-medium">{calculateDuration(item.startDateTime, item.endDateTime)}</p>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${item.progress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">{item.progress}% Complete</p>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-2 sm:space-y-0">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Production Schedule</h3>
        
        {/* View Mode Toggle */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 overflow-x-auto">
          <button
            onClick={() => setViewMode('timeline')}
            className={`px-3 py-1 text-sm rounded-md transition-colors flex items-center space-x-1 whitespace-nowrap ${
              viewMode === 'timeline'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span>Timeline</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1 text-sm rounded-md transition-colors flex items-center space-x-1 whitespace-nowrap ${
              viewMode === 'list'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <List className="h-4 w-4" />
            <span>List</span>
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-3 py-1 text-sm rounded-md transition-colors flex items-center space-x-1 whitespace-nowrap ${
              viewMode === 'calendar'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span>Calendar</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {viewMode === 'timeline' && <ProductionCalendarView />}
        {viewMode === 'list' ? renderListView() : <CalendarView scheduleData={scheduleData} />}
      </div>
    </div>
  );
};

export default ProductionSchedule;