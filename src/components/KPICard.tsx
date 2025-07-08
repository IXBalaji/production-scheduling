import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';
import { aimlService } from '../services/aiMLService';

interface KPICardProps {
  title: string;
  value?: string;
  change?: string;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: LucideIcon;
  color: string;
  metric?: string;
}

const KPICard: React.FC<KPICardProps> = ({ 
  title, 
  value, 
  change, 
  changeType, 
  icon: Icon, 
  color,
  metric
}) => {
  // Get real-time metrics from AI service
  const metrics = aimlService.getCurrentMetrics();
  
  const getValue = () => {
    if (value) return value;
    
    switch (metric) {
      case 'oee':
        return `${metrics.oee.toFixed(1)}%`;
      case 'efficiency':
        return `${metrics.efficiency.toFixed(1)}%`;
      case 'quality':
        return `${metrics.qualityRate.toFixed(1)}%`;
      case 'delivery':
        return `${metrics.onTimeDelivery.toFixed(1)}%`;
      default:
        return value || '0';
    }
  };
  
  const getChange = () => {
    if (change) return change;
    
    // Calculate change based on predicted vs current
    const currentValue = parseFloat(getValue().replace('%', ''));
    const predicted = metrics.predictedEfficiency[0] || currentValue;
    const changeValue = predicted - currentValue;
    
    if (Math.abs(changeValue) < 0.1) return 'No change predicted';
    
    const sign = changeValue > 0 ? '+' : '';
    return `${sign}${changeValue.toFixed(1)}% predicted`;
  };
  const changeColor = {
    increase: 'text-green-600',
    decrease: 'text-red-600',
    neutral: 'text-gray-600'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs sm:text-sm font-medium text-gray-600">{title}</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{getValue()}</p>
          <p className={`text-xs sm:text-sm mt-1 ${changeColor[changeType]}`}>
            {getChange()}
          </p>
        </div>
        <div className={`p-2 sm:p-3 rounded-lg ${color}`}>
          <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
        </div>
      </div>
    </div>
  );
};

export default KPICard;