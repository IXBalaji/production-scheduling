// AI/ML Service for Production Analytics
import { TimeSeriesData, ProductionMetrics, PredictionModel } from '../types/analytics';

export class AIMLService {
  private static instance: AIMLService;
  private models: Map<string, PredictionModel> = new Map();
  private timeSeriesData: TimeSeriesData[] = [];

  private constructor() {
    this.initializeModels();
    this.generateTimeSeriesData();
  }

  public static getInstance(): AIMLService {
    if (!AIMLService.instance) {
      AIMLService.instance = new AIMLService();
    }
    return AIMLService.instance;
  }

  private initializeModels() {
    // Initialize different AI/ML models
    this.models.set('efficiency_predictor', {
      name: 'Efficiency Predictor',
      type: 'regression',
      accuracy: 0.92,
      lastTrained: new Date(),
      features: ['temperature', 'vibration', 'speed', 'load', 'maintenance_hours']
    });

    this.models.set('quality_classifier', {
      name: 'Quality Classifier',
      type: 'classification',
      accuracy: 0.87,
      lastTrained: new Date(),
      features: ['pressure', 'temperature', 'material_grade', 'operator_experience']
    });

    this.models.set('maintenance_predictor', {
      name: 'Predictive Maintenance',
      type: 'time_series',
      accuracy: 0.94,
      lastTrained: new Date(),
      features: ['vibration_pattern', 'temperature_trend', 'usage_hours', 'oil_quality']
    });

    this.models.set('demand_forecaster', {
      name: 'Demand Forecaster',
      type: 'time_series',
      accuracy: 0.82,
      lastTrained: new Date(),
      features: ['historical_orders', 'seasonal_patterns', 'market_indicators']
    });
  }

  private generateTimeSeriesData() {
    const now = new Date();
    const hoursBack = 168; // 7 days of hourly data

    for (let i = hoursBack; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - (i * 60 * 60 * 1000));
      
      // Generate realistic time series data with patterns
      const hourOfDay = timestamp.getHours();
      const dayOfWeek = timestamp.getDay();
      
      // Base efficiency with daily and weekly patterns
      let baseEfficiency = 85;
      if (hourOfDay >= 6 && hourOfDay <= 14) baseEfficiency += 5; // Day shift boost
      if (dayOfWeek === 0 || dayOfWeek === 6) baseEfficiency -= 10; // Weekend reduction
      
      // Add some noise and trends
      const noise = (Math.random() - 0.5) * 10;
      const efficiency = Math.max(60, Math.min(100, baseEfficiency + noise));
      
      // Generate correlated metrics
      const temperature = 35 + (efficiency / 100) * 15 + (Math.random() - 0.5) * 5;
      const vibration = Math.max(0, 2 - (efficiency / 100) * 1.5 + (Math.random() - 0.5) * 0.5);
      const output = Math.floor(efficiency * 1.5 + (Math.random() - 0.5) * 20);
      
      this.timeSeriesData.push({
        timestamp,
        machineId: 'CNC-001',
        metrics: {
          efficiency,
          temperature,
          vibration,
          output,
          pressure: 45 + (Math.random() - 0.5) * 10,
          speed: 1800 + (Math.random() - 0.5) * 200
        }
      });
    }
  }

  // Predict machine efficiency using time series analysis
  public predictEfficiency(machineId: string, hoursAhead: number = 24): number[] {
    const recentData = this.getRecentData(machineId, 48);
    const model = this.models.get('efficiency_predictor');
    
    if (!model || recentData.length === 0) return [];

    const predictions: number[] = [];
    let lastValue = recentData[recentData.length - 1].metrics.efficiency;
    
    for (let i = 0; i < hoursAhead; i++) {
      // Simple trend analysis with seasonal patterns
      const trend = this.calculateTrend(recentData.map(d => d.metrics.efficiency));
      const seasonal = this.getSeasonalFactor(i);
      const noise = (Math.random() - 0.5) * 2;
      
      lastValue = Math.max(60, Math.min(100, lastValue + trend + seasonal + noise));
      predictions.push(Math.round(lastValue * 100) / 100);
    }
    
    return predictions;
  }

  // Predict maintenance needs using vibration and temperature patterns
  public predictMaintenance(machineId: string): { probability: number; daysUntil: number; confidence: number } {
    const recentData = this.getRecentData(machineId, 72);
    const model = this.models.get('maintenance_predictor');
    
    if (!model || recentData.length === 0) {
      return { probability: 0, daysUntil: 30, confidence: 0 };
    }

    // Analyze vibration trends
    const vibrationTrend = this.calculateTrend(recentData.map(d => d.metrics.vibration));
    const tempTrend = this.calculateTrend(recentData.map(d => d.metrics.temperature));
    
    // Calculate maintenance probability
    const vibrationScore = Math.min(1, Math.max(0, vibrationTrend * 10));
    const temperatureScore = Math.min(1, Math.max(0, tempTrend / 10));
    
    const probability = (vibrationScore * 0.6 + temperatureScore * 0.4) * 100;
    const daysUntil = Math.max(1, Math.floor(30 - (probability * 0.3)));
    const confidence = model.accuracy * 100;
    
    return { probability, daysUntil, confidence };
  }

  // Quality prediction based on process parameters
  public predictQuality(processParams: any): { qualityScore: number; defectProbability: number; confidence: number } {
    const model = this.models.get('quality_classifier');
    
    if (!model) {
      return { qualityScore: 95, defectProbability: 5, confidence: 0 };
    }

    // Simulate quality prediction based on parameters
    const { temperature, pressure, materialGrade = 'A', operatorExperience = 5 } = processParams;
    
    let qualityScore = 95;
    
    // Temperature impact
    if (temperature < 35 || temperature > 50) qualityScore -= 10;
    if (temperature < 30 || temperature > 55) qualityScore -= 15;
    
    // Pressure impact
    if (pressure < 40 || pressure > 60) qualityScore -= 8;
    
    // Material grade impact
    if (materialGrade === 'B') qualityScore -= 5;
    if (materialGrade === 'C') qualityScore -= 12;
    
    // Operator experience impact
    qualityScore += Math.min(10, operatorExperience - 3);
    
    qualityScore = Math.max(60, Math.min(100, qualityScore + (Math.random() - 0.5) * 5));
    const defectProbability = 100 - qualityScore;
    
    return {
      qualityScore: Math.round(qualityScore * 100) / 100,
      defectProbability: Math.round(defectProbability * 100) / 100,
      confidence: model.accuracy * 100
    };
  }

  // Demand forecasting using historical patterns
  public forecastDemand(productType: string, daysAhead: number = 30): number[] {
    const model = this.models.get('demand_forecaster');
    
    if (!model) return [];

    const forecast: number[] = [];
    let baseValue = 100; // Base daily demand
    
    for (let i = 0; i < daysAhead; i++) {
      // Seasonal patterns
      const dayOfWeek = (new Date().getDay() + i) % 7;
      let seasonal = 1.0;
      
      if (dayOfWeek === 0 || dayOfWeek === 6) seasonal = 0.7; // Weekend reduction
      if (dayOfWeek >= 1 && dayOfWeek <= 5) seasonal = 1.1; // Weekday boost
      
      // Weekly trend
      const weeklyTrend = Math.sin((i / 7) * Math.PI) * 0.1;
      
      // Random variation
      const noise = (Math.random() - 0.5) * 0.2;
      
      const value = Math.max(0, baseValue * seasonal * (1 + weeklyTrend + noise));
      forecast.push(Math.round(value));
    }
    
    return forecast;
  }

  // Generate AI insights based on current data
  public generateInsights(): any[] {
    const insights = [];
    
    // Efficiency optimization insight
    const efficiencyPrediction = this.predictEfficiency('CNC-001', 24);
    if (efficiencyPrediction.length > 0) {
      const avgEfficiency = efficiencyPrediction.reduce((a, b) => a + b, 0) / efficiencyPrediction.length;
      if (avgEfficiency < 85) {
        insights.push({
          id: 1,
          type: 'optimization',
          title: 'Schedule Optimization Opportunity',
          description: `AI model predicts ${avgEfficiency.toFixed(1)}% efficiency. Rescheduling could improve by 15%.`,
          impact: 'High',
          confidence: 87,
          icon: 'TrendingUp'
        });
      }
    }
    
    // Maintenance prediction insight
    const maintenanceData = this.predictMaintenance('LAT-002');
    if (maintenanceData.probability > 70) {
      insights.push({
        id: 2,
        type: 'maintenance',
        title: 'Predictive Maintenance Alert',
        description: `LAT-002 showing ${maintenanceData.probability.toFixed(1)}% probability of failure within ${maintenanceData.daysUntil} days.`,
        impact: 'Critical',
        confidence: maintenanceData.confidence,
        icon: 'AlertTriangle'
      });
    }
    
    // Quality prediction insight
    const qualityPrediction = this.predictQuality({ temperature: 48, pressure: 52 });
    if (qualityPrediction.defectProbability > 10) {
      insights.push({
        id: 3,
        type: 'quality',
        title: 'Quality Risk Detection',
        description: `Current process parameters indicate ${qualityPrediction.defectProbability.toFixed(1)}% defect probability.`,
        impact: 'Medium',
        confidence: qualityPrediction.confidence,
        icon: 'Lightbulb'
      });
    }
    
    // Demand forecasting insight
    const demandForecast = this.forecastDemand('hydraulic_cylinders', 7);
    const avgDemand = demandForecast.reduce((a, b) => a + b, 0) / demandForecast.length;
    if (avgDemand > 120) {
      insights.push({
        id: 4,
        type: 'demand',
        title: 'Demand Surge Prediction',
        description: `AI forecasts ${((avgDemand - 100) / 100 * 100).toFixed(0)}% increase in hydraulic cylinder demand next week.`,
        impact: 'Medium',
        confidence: 82,
        icon: 'TrendingUp'
      });
    }
    
    return insights;
  }

  // Get recent time series data for a machine
  private getRecentData(machineId: string, hours: number): TimeSeriesData[] {
    const cutoff = new Date(Date.now() - (hours * 60 * 60 * 1000));
    return this.timeSeriesData
      .filter(d => d.machineId === machineId && d.timestamp >= cutoff)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  // Calculate trend from time series values
  private calculateTrend(values: number[]): number {
    if (values.length < 2) return 0;
    
    const n = values.length;
    const sumX = (n * (n - 1)) / 2;
    const sumY = values.reduce((a, b) => a + b, 0);
    const sumXY = values.reduce((sum, y, x) => sum + x * y, 0);
    const sumX2 = values.reduce((sum, _, x) => sum + x * x, 0);
    
    return (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  }

  // Get seasonal adjustment factor
  private getSeasonalFactor(hourOffset: number): number {
    const hour = (new Date().getHours() + hourOffset) % 24;
    
    // Higher efficiency during day shift (6-14), lower at night
    if (hour >= 6 && hour <= 14) return 2;
    if (hour >= 15 && hour <= 22) return 0;
    return -3;
  }

  // Get current production metrics with AI predictions
  public getCurrentMetrics(): ProductionMetrics {
    const recentData = this.getRecentData('CNC-001', 1);
    const currentData = recentData[0] || {
      metrics: { efficiency: 87.5, temperature: 42, vibration: 1.2, output: 130 }
    };

    const efficiencyPrediction = this.predictEfficiency('CNC-001', 8);
    const maintenancePrediction = this.predictMaintenance('CNC-001');
    
    return {
      oee: currentData.metrics.efficiency,
      efficiency: currentData.metrics.efficiency,
      qualityRate: 98.7 - (Math.random() * 2),
      onTimeDelivery: 94.2 + (Math.random() * 3),
      predictedEfficiency: efficiencyPrediction,
      maintenanceRisk: maintenancePrediction.probability,
      timestamp: new Date()
    };
  }

  // Get machine status with AI analysis
  public getMachineStatus(): any[] {
    const machines = ['CNC-001', 'CNC-002', 'WLD-001', 'WLD-002', 'LAT-001', 'LAT-002'];
    
    return machines.map(machineId => {
      const recentData = this.getRecentData(machineId, 1);
      const maintenance = this.predictMaintenance(machineId);
      const efficiency = this.predictEfficiency(machineId, 1)[0] || 85;
      
      let status = 'running';
      if (maintenance.probability > 80) status = 'error';
      else if (maintenance.probability > 60) status = 'maintenance';
      else if (efficiency < 70) status = 'idle';
      
      return {
        id: machineId,
        name: `${machineId.split('-')[0]} Machine ${machineId.split('-')[1]}`,
        status,
        utilization: Math.round(efficiency),
        temperature: 35 + (Math.random() * 15),
        vibration: maintenance.probability > 70 ? 'Critical' : 
                  maintenance.probability > 40 ? 'High' : 'Normal',
        maintenanceRisk: maintenance.probability,
        predictedFailure: maintenance.daysUntil
      };
    });
  }
}

export const aimlService = AIMLService.getInstance();