// Type definitions for AI/ML analytics

export interface TimeSeriesData {
  timestamp: Date;
  machineId: string;
  metrics: {
    efficiency: number;
    temperature: number;
    vibration: number;
    output: number;
    pressure: number;
    speed: number;
  };
}

export interface PredictionModel {
  name: string;
  type: 'regression' | 'classification' | 'time_series';
  accuracy: number;
  lastTrained: Date;
  features: string[];
}

export interface ProductionMetrics {
  oee: number;
  efficiency: number;
  qualityRate: number;
  onTimeDelivery: number;
  predictedEfficiency: number[];
  maintenanceRisk: number;
  timestamp: Date;
}

export interface AIInsight {
  id: number;
  type: 'optimization' | 'maintenance' | 'quality' | 'demand';
  title: string;
  description: string;
  impact: 'Low' | 'Medium' | 'High' | 'Critical';
  confidence: number;
  icon: string;
}

export interface MaintenancePrediction {
  machineId: string;
  probability: number;
  daysUntil: number;
  confidence: number;
  factors: string[];
}

export interface QualityPrediction {
  qualityScore: number;
  defectProbability: number;
  confidence: number;
  factors: {
    temperature: number;
    pressure: number;
    materialGrade: string;
    operatorExperience: number;
  };
}