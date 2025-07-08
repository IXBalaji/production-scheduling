import React from 'react';
import { Clock, CheckCircle, AlertCircle, Play } from 'lucide-react';

const ProductionSchedule = () => {
  const scheduleData = [
    {
      id: 1,
      orderNo: 'PO-2024-001',
      product: 'CNC Machined Parts',
      machine: 'CNC-001',
      startTime: '08:00',
      endTime: '12:00',
      duration: '4h',
      status: 'running',
      progress: 65,
      priority: 'high'
    },
    {
      id: 2,
      orderNo: 'PO-2024-002',
      product: 'Welded Assemblies',
      machine: 'WLD-002',
      startTime: '10:00',
      endTime: '16:00',
      duration: '6h',
      status: 'scheduled',
      progress: 0,
      priority: 'medium'
    },
    {
      id: 3,
      orderNo: 'PO-2024-003',
      product: 'Precision Bearings',
      machine: 'LAT-003',
      startTime: '14:00',
      endTime: '18:00',
      duration: '4h',
      status: 'completed',
      progress: 100,
      priority: 'low'
    },
    {
      id: 4,
      orderNo: 'PO-2024-004',
      product: 'Hydraulic Cylinders',
      machine: 'CNC-002',
      startTime: '16:00',
      endTime: '22:00',
      duration: '6h',
      status: 'delayed',
      progress: 30,
      priority: 'high'
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

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Today's Production Schedule</h3>
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
                <p className="text-xs text-gray-500">Time</p>
                <p className="text-xs sm:text-sm font-medium">{item.startTime} - {item.endTime}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Duration</p>
                <p className="text-xs sm:text-sm font-medium">{item.duration}</p>
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
    </div>
  );
};

export default ProductionSchedule;