import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { aimlService } from '../services/aiMLService';

const TimeSeriesChart = () => {
  // Get real-time and predicted data from AI service
  const metrics = aimlService.getCurrentMetrics();
  const predictions = aimlService.predictEfficiency('CNC-001', 8);
  
  // Generate time series data for the last 8 hours + 8 hour prediction
  const now = new Date();
  const productionData = [];
  
  // Historical data (last 8 hours)
  for (let i = 7; i >= 0; i--) {
    const time = new Date(now.getTime() - (i * 60 * 60 * 1000));
    const hour = time.getHours().toString().padStart(2, '0') + ':00';
    const efficiency = 85 + Math.sin((time.getHours() / 24) * Math.PI * 2) * 5 + (Math.random() - 0.5) * 4;
    const output = Math.floor(efficiency * 1.5 + (Math.random() - 0.5) * 20);
    
    productionData.push({
      hour,
      efficiency: Math.round(efficiency * 10) / 10,
      output,
      isPrediction: false
    });
  }
  
  // Predicted data (next 8 hours)
  for (let i = 1; i <= 8; i++) {
    const time = new Date(now.getTime() + (i * 60 * 60 * 1000));
    const hour = time.getHours().toString().padStart(2, '0') + ':00';
    const efficiency = predictions[i - 1] || 85;
    const output = Math.floor(efficiency * 1.5);
    
    productionData.push({
      hour,
      efficiency: Math.round(efficiency * 10) / 10,
      output,
      isPrediction: true
    });
  }

  const maxOutput = Math.max(...productionData.map(d => d.output));
  const maxEfficiency = Math.max(...productionData.map(d => d.efficiency));
  
  const avgEfficiency = productionData
    .filter(d => !d.isPrediction)
    .reduce((sum, d) => sum + d.efficiency, 0) / 8;
  const totalOutput = productionData
    .filter(d => !d.isPrediction)
    .reduce((sum, d) => sum + d.output, 0);

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200 w-full overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm sm:text-lg font-semibold text-gray-900 truncate mr-2">Production Trends & AI Predictions</h3>
        <div className="hidden sm:flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Historical</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-sm text-gray-600">AI Predicted</span>
          </div>
        </div>
      </div>
      
      <div className="relative h-48 sm:h-64 w-full overflow-hidden">
        <div className="absolute inset-0 flex items-end justify-between space-x-2">
          {productionData.map((data, index) => (
            <div key={index} className="flex-1 flex flex-col items-center min-w-0">
              <div className="w-full flex flex-col items-center space-y-1">
                {/* Efficiency Bar */}
                <div className={`w-2 sm:w-4 bg-gray-200 rounded-t ${data.isPrediction ? 'opacity-70' : ''}`}>
                  <div 
                    className={`${data.isPrediction ? 'bg-purple-500' : 'bg-blue-500'} rounded-t transition-all duration-300`}
                    style={{ height: `${(data.efficiency / maxEfficiency) * 80}px` }}
                  ></div>
                </div>
                
                {/* Output Bar */}
                <div className={`w-2 sm:w-4 bg-gray-200 rounded-t ${data.isPrediction ? 'opacity-70' : ''}`}>
                  <div 
                    className={`${data.isPrediction ? 'bg-purple-300' : 'bg-orange-500'} rounded-t transition-all duration-300`}
                    style={{ height: `${(data.output / maxOutput) * 80}px` }}
                  ></div>
                </div>
              </div>
              
              <span className={`text-xs mt-2 truncate ${data.isPrediction ? 'text-purple-500 font-medium' : 'text-gray-500'} ${index % 4 === 0 ? '' : 'hidden sm:block'}`}>
                {data.hour}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-4 w-4 text-green-500" />
          <span className="text-xs sm:text-sm text-gray-600">Avg Efficiency: {avgEfficiency.toFixed(1)}%</span>
        </div>
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-4 w-4 text-green-500" />
          <span className="text-xs sm:text-sm text-gray-600">Total Output: {totalOutput} units</span>
        </div>
      </div>
    </div>
  );
};

export default TimeSeriesChart;