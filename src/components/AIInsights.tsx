import React from 'react';
import { Brain, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';
import { aimlService } from '../services/aiMLService';

const AIInsights = () => {
  // Get AI-generated insights based on real-time analysis
  const insights = aimlService.generateInsights();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'TrendingUp':
        return TrendingUp;
      case 'AlertTriangle':
        return AlertTriangle;
      case 'Lightbulb':
        return Lightbulb;
      default:
        return TrendingUp;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'Critical':
        return 'text-red-600 bg-red-50';
      case 'High':
        return 'text-orange-600 bg-orange-50';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'bg-green-500';
    if (confidence >= 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200">
      <div className="flex items-center space-x-2 mb-4">
        <Brain className="h-5 w-5 text-purple-600" />
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">AI Insights & Recommendations</h3>
      </div>
      
      <div className="space-y-4">
        {insights.map((insight) => (
          <div key={insight.id} className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2 space-y-2 sm:space-y-0">
              <div className="flex items-center space-x-2">
                {React.createElement(getIcon(insight.icon), { className: "h-4 w-4 text-blue-600" })}
                <h4 className="text-sm sm:text-base font-medium text-gray-900">{insight.title}</h4>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(insight.impact)}`}>
                {insight.impact}
              </span>
            </div>
            
            <p className="text-xs sm:text-sm text-gray-600 mb-3">{insight.description}</p>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">Confidence:</span>
                <div className="w-12 sm:w-16 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${getConfidenceColor(insight.confidence)}`}
                    style={{ width: `${insight.confidence}%` }}
                  ></div>
                </div>
                <span className="text-xs font-medium">{insight.confidence}%</span>
              </div>
              
              <button className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 font-medium">
                Apply
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIInsights;