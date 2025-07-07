import React from 'react';
import { Cog, Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import { aimlService } from '../services/aiMLService';

const MachineStatus = () => {
  // Get real-time machine status from AI service
  const machines = aimlService.getMachineStatus();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-green-100 text-green-800';
      case 'idle':
        return 'bg-yellow-100 text-yellow-800';
      case 'maintenance':
        return 'bg-blue-100 text-blue-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Activity className="h-4 w-4 text-green-500" />;
      case 'idle':
        return <CheckCircle className="h-4 w-4 text-yellow-500" />;
      case 'maintenance':
        return <Cog className="h-4 w-4 text-blue-500" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Cog className="h-4 w-4 text-gray-500" />;
    }
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 80) return 'bg-green-500';
    if (utilization >= 60) return 'bg-yellow-500';
    if (utilization >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Machine Status</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {machines.map((machine) => (
          <div key={machine.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                {getStatusIcon(machine.status)}
                <h4 className="font-medium text-gray-900">{machine.name}</h4>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(machine.status)}`}>
                {machine.status}
              </span>
            </div>
            
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">Utilization</span>
                  <span className="font-medium">{machine.utilization}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${getUtilizationColor(machine.utilization)}`}
                    style={{ width: `${machine.utilization}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-500">Temperature</p>
                  <p className="font-medium">{machine.temperature.toFixed(1)}°C</p>
                </div>
                <div>
                  <p className="text-gray-500">Vibration</p>
                  <p className={`font-medium ${machine.vibration === 'Critical' ? 'text-red-600' : machine.vibration === 'High' ? 'text-yellow-600' : 'text-green-600'}`}>
                    {machine.vibration}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-500">Maintenance Risk</p>
                  <div className="flex items-center space-x-2">
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div 
                        className={`h-1 rounded-full ${
                          machine.maintenanceRisk > 70 ? 'bg-red-500' : 
                          machine.maintenanceRisk > 40 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${machine.maintenanceRisk}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium">{machine.maintenanceRisk.toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MachineStatus;