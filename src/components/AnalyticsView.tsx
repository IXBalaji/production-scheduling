import React from 'react';
import { TrendingUp, TrendingDown, BarChart3, PieChart } from 'lucide-react';
import { aimlService } from '../services/aiMLService';

const AnalyticsView = () => {
  // Get real-time metrics from AI service
  const metrics = aimlService.getCurrentMetrics();
  const machineStatuses = aimlService.getMachineStatus();
  
  const kpis = [
    { 
      title: 'Overall Equipment Effectiveness', 
      value: `${metrics.oee.toFixed(1)}%`, 
      change: `${(metrics.predictedEfficiency[0] - metrics.oee).toFixed(1)}%`, 
      trend: metrics.predictedEfficiency[0] > metrics.oee ? 'up' : 'down' 
    },
    { 
      title: 'Production Efficiency', 
      value: `${metrics.efficiency.toFixed(1)}%`, 
      change: `${(metrics.predictedEfficiency[0] - metrics.efficiency).toFixed(1)}%`, 
      trend: metrics.predictedEfficiency[0] > metrics.efficiency ? 'up' : 'down' 
    },
    { 
      title: 'Quality Rate', 
      value: `${metrics.qualityRate.toFixed(1)}%`, 
      change: `${(Math.random() * 2 - 1).toFixed(1)}%`, 
      trend: Math.random() > 0.5 ? 'up' : 'down' 
    },
    { 
      title: 'On-Time Delivery', 
      value: `${metrics.onTimeDelivery.toFixed(1)}%`, 
      change: `${(Math.random() * 3).toFixed(1)}%`, 
      trend: 'up' 
    }
  ];

  // Generate production data with AI predictions
  const demandForecast = aimlService.forecastDemand('general', 6);
  const productionData = [
    { month: 'Jan', planned: 1200, actual: 1150, efficiency: 95.8 },
    { month: 'Feb', planned: 1300, actual: 1280, efficiency: 98.5 },
    { month: 'Mar', planned: 1250, actual: 1190, efficiency: 95.2 },
    { month: 'Apr', planned: 1400, actual: 1420, efficiency: 101.4 },
    { month: 'May', planned: 1350, actual: 1310, efficiency: 97.0 },
    { month: 'Jun', planned: demandForecast[0] || 1450, actual: Math.floor((demandForecast[0] || 1450) * 0.95), efficiency: metrics.efficiency }
  ];

  // Get real machine utilization from AI service
  const machineUtilization = machineStatuses.map(machine => ({
    machine: machine.id,
    utilization: machine.utilization
  }));

  const qualityMetrics = [
    { 
      category: 'Passed', 
      count: Math.floor(metrics.qualityRate * 30), 
      percentage: metrics.qualityRate, 
      color: 'bg-green-500' 
    },
    { 
      category: 'Rework', 
      count: Math.floor((100 - metrics.qualityRate) * 0.7 * 30), 
      percentage: (100 - metrics.qualityRate) * 0.7, 
      color: 'bg-yellow-500' 
    },
    { 
      category: 'Rejected', 
      count: Math.floor((100 - metrics.qualityRate) * 0.3 * 30), 
      percentage: (100 - metrics.qualityRate) * 0.3, 
      color: 'bg-red-500' 
    }
  ];

  const maxProduction = Math.max(...productionData.map(d => Math.max(d.planned, d.actual)));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Production Analytics</h1>
        <p className="text-gray-600">Comprehensive performance metrics and insights</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <div key={index} className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{kpi.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{kpi.value}</p>
                <div className="flex items-center mt-2">
                  {kpi.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {kpi.change}
                  </span>
                </div>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-500" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Production Trends */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Production Trends</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Planned</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Actual</span>
              </div>
            </div>
          </div>
          
          <div className="relative h-64">
            <div className="absolute inset-0 flex items-end justify-between space-x-2">
              {productionData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex justify-center space-x-1">
                    <div className="w-4 bg-gray-200 rounded-t">
                      <div 
                        className="bg-blue-500 rounded-t transition-all duration-300"
                        style={{ height: `${(data.planned / maxProduction) * 200}px` }}
                      ></div>
                    </div>
                    <div className="w-4 bg-gray-200 rounded-t">
                      <div 
                        className="bg-green-500 rounded-t transition-all duration-300"
                        style={{ height: `${(data.actual / maxProduction) * 200}px` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 mt-2">{data.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Machine Utilization */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Machine Utilization</h3>
          <div className="space-y-4">
            {machineUtilization.map((machine, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{machine.machine}</span>
                <div className="flex items-center space-x-2 flex-1 ml-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        machine.utilization >= 80 ? 'bg-green-500' : 
                        machine.utilization >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${machine.utilization}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-600 w-12">{machine.utilization}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quality Metrics */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Quality Metrics</h3>
          <PieChart className="h-5 w-5 text-gray-400" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {qualityMetrics.map((metric, index) => (
            <div key={index} className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-3">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-gray-200"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={metric.color.replace('bg-', 'text-')}
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray={`${metric.percentage}, 100`}
                    strokeLinecap="round"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-gray-900">{metric.percentage}%</span>
                </div>
              </div>
              <h4 className="font-medium text-gray-900">{metric.category}</h4>
              <p className="text-sm text-gray-600">{metric.count} units</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;