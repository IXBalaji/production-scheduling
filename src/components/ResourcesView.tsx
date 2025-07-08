import React from 'react';
import { Users, Clock, CheckCircle, AlertTriangle, UserPlus } from 'lucide-react';

const ResourcesView = () => {
  const employees = [
    {
      id: 1,
      name: 'John Smith',
      role: 'CNC Operator',
      shift: 'Day Shift',
      status: 'active',
      machine: 'CNC-001',
      efficiency: 92,
      hoursWorked: 6.5,
      overtime: 0
    },
    {
      id: 2,
      name: 'Maria Garcia',
      role: 'Welding Specialist',
      shift: 'Day Shift',
      status: 'active',
      machine: 'WLD-001',
      efficiency: 88,
      hoursWorked: 7.2,
      overtime: 1.2
    },
    {
      id: 3,
      name: 'David Chen',
      role: 'Quality Inspector',
      shift: 'Day Shift',
      status: 'break',
      machine: 'QC-Station',
      efficiency: 95,
      hoursWorked: 4.0,
      overtime: 0
    },
    {
      id: 4,
      name: 'Sarah Johnson',
      role: 'Lathe Operator',
      shift: 'Night Shift',
      status: 'offline',
      machine: 'LAT-002',
      efficiency: 85,
      hoursWorked: 0,
      overtime: 0
    },
    {
      id: 5,
      name: 'Mike Wilson',
      role: 'Maintenance Tech',
      shift: 'Day Shift',
      status: 'active',
      machine: 'Multiple',
      efficiency: 90,
      hoursWorked: 5.8,
      overtime: 0
    }
  ];

  const shifts = [
    { name: 'Day Shift', time: '06:00 - 14:00', active: 12, total: 15 },
    { name: 'Evening Shift', time: '14:00 - 22:00', active: 8, total: 10 },
    { name: 'Night Shift', time: '22:00 - 06:00', active: 5, total: 8 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'break':
        return 'bg-yellow-100 text-yellow-800';
      case 'offline':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'break':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'offline':
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
      default:
        return <Users className="h-4 w-4 text-gray-500" />;
    }
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return 'bg-green-500';
    if (efficiency >= 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Resource Management</h1>
          <p className="text-sm sm:text-base text-gray-600">Monitor workforce allocation and performance</p>
        </div>
        <button className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <UserPlus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Employee</span>
        </button>
      </div>

      {/* Shift Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {shifts.map((shift, index) => (
          <div key={index} className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900">{shift.name}</h3>
              <Clock className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mb-2">{shift.time}</p>
            <div className="flex items-center justify-between">
              <span className="text-xl sm:text-2xl font-bold text-gray-900">{shift.active}/{shift.total}</span>
              <span className="text-xs sm:text-sm text-gray-600">Active</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${(shift.active / shift.total) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Employee Details */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Employee Status</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-600">Employee</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-600 hidden sm:table-cell">Role</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-600 hidden md:table-cell">Shift</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-600">Status</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-600 hidden lg:table-cell">Machine</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-600">Efficiency</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-600 hidden sm:table-cell">Hours</th>
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-gray-600 hidden md:table-cell">Overtime</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 sm:py-3 px-2 sm:px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <Users className="h-4 w-4 text-gray-600" />
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-gray-900">{employee.name}</span>
                      </div>
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm text-gray-600 hidden sm:table-cell">{employee.role}</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm text-gray-600 hidden md:table-cell">{employee.shift}</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(employee.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(employee.status)}`}>
                          {employee.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm text-gray-600 hidden lg:table-cell">{employee.machine}</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-12 sm:w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${getEfficiencyColor(employee.efficiency)}`}
                            style={{ width: `${employee.efficiency}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium">{employee.efficiency}%</span>
                      </div>
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm text-gray-900 hidden sm:table-cell">{employee.hoursWorked}h</td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 hidden md:table-cell">
                      <span className={`font-medium ${employee.overtime > 0 ? 'text-orange-600' : 'text-gray-600'}`}>
                        {employee.overtime}h
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourcesView;