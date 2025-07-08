import React from 'react';
import { AlertTriangle, Clock, CheckCircle, X, Bell } from 'lucide-react';

const AlertsView = () => {
  const alerts = [
    {
      id: 1,
      type: 'critical',
      title: 'Machine LAT-002 Vibration Critical',
      description: 'Bearing replacement required within 72 hours to prevent failure',
      machine: 'LAT-002',
      timestamp: '2024-01-10 14:30',
      status: 'active',
      priority: 'high'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Temperature Fluctuation WLD-001',
      description: 'Welding station temperature outside optimal range',
      machine: 'WLD-001',
      timestamp: '2024-01-10 13:45',
      status: 'active',
      priority: 'medium'
    },
    {
      id: 3,
      type: 'maintenance',
      title: 'Scheduled Maintenance Due',
      description: 'CNC-001 requires routine maintenance check',
      machine: 'CNC-001',
      timestamp: '2024-01-10 12:00',
      status: 'acknowledged',
      priority: 'low'
    },
    {
      id: 4,
      type: 'quality',
      title: 'Quality Check Failed',
      description: 'Batch QC-2024-015 failed dimensional tolerance check',
      machine: 'QC-Station',
      timestamp: '2024-01-10 11:20',
      status: 'resolved',
      priority: 'high'
    },
    {
      id: 5,
      type: 'production',
      title: 'Production Target Behind',
      description: 'Order PO-2024-004 is 2 hours behind schedule',
      machine: 'CNC-002',
      timestamp: '2024-01-10 10:15',
      status: 'active',
      priority: 'medium'
    },
    {
      id: 6,
      type: 'safety',
      title: 'Safety Protocol Violation',
      description: 'Emergency stop activated on WLD-002',
      machine: 'WLD-002',
      timestamp: '2024-01-10 09:30',
      status: 'resolved',
      priority: 'high'
    }
  ];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'maintenance':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'quality':
        return <X className="h-5 w-5 text-purple-500" />;
      case 'production':
        return <Clock className="h-5 w-5 text-orange-500" />;
      case 'safety':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getAlertColor = (type: string, status: string) => {
    if (status === 'resolved') return 'bg-gray-50 border-gray-200';
    
    switch (type) {
      case 'critical':
      case 'safety':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'maintenance':
        return 'bg-blue-50 border-blue-200';
      case 'quality':
        return 'bg-purple-50 border-purple-200';
      case 'production':
        return 'bg-orange-50 border-orange-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-red-100 text-red-800';
      case 'acknowledged':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
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
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const activeAlerts = alerts.filter(alert => alert.status === 'active').length;
  const criticalAlerts = alerts.filter(alert => alert.type === 'critical' && alert.status === 'active').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">System Alerts</h1>
        <p className="text-gray-600">Monitor and manage production alerts and notifications</p>
      </div>

      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Alerts</p>
              <p className="text-2xl font-bold text-gray-900">{alerts.length}</p>
            </div>
            <Bell className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Alerts</p>
              <p className="text-2xl font-bold text-red-600">{activeAlerts}</p>
            </div>
            <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 text-red-500" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Critical</p>
              <p className="text-xl sm:text-2xl font-bold text-red-600">{criticalAlerts}</p>
            </div>
            <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 text-red-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Resolved Today</p>
              <p className="text-xl sm:text-2xl font-bold text-green-600">
                {alerts.filter(alert => alert.status === 'resolved').length}
              </p>
            </div>
            <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-500" />
          <p className="text-sm sm:text-base text-gray-600">Monitor and manage production alerts and notifications</p>
        </div>
      </div>

      {/* Alerts List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Recent Alerts</h3>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div 
                key={alert.id} 
                className={`p-3 sm:p-4 rounded-lg border-2 ${getAlertColor(alert.type, alert.status)} transition-all hover:shadow-md`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between space-y-3 lg:space-y-0">
                  <div className="flex items-start space-x-3">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 mb-1">
                        <h4 className="text-sm sm:text-base font-medium text-gray-900">{alert.title}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(alert.priority)}`}>
                          {alert.priority}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 mb-2">{alert.description}</p>
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-xs text-gray-500">
                        <span>Machine: {alert.machine}</span>
                        <span>Time: {alert.timestamp}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(alert.status)}`}>
                      {alert.status}
                    </span>
                    {alert.status === 'active' && (
                      <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-1">
                        <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors">
                          Acknowledge
                        </button>
                        <button className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        </button>
                      </div>
                    )}
              <p className="text-xs sm:text-sm text-gray-600">Total Alerts</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{alerts.length}</p>
              </div>
            <Bell className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
          </div>
        </div>
      </div>
    </div>
  );
              <p className="text-xs sm:text-sm text-gray-600">Active Alerts</p>
              <p className="text-xl sm:text-2xl font-bold text-red-600">{activeAlerts}</p>
export default AlertsView;