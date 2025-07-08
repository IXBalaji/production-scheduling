import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import KPICard from './components/KPICard';
import ProductionSchedule from './components/ProductionSchedule';
import MachineStatus from './components/MachineStatus';
import TimeSeriesChart from './components/TimeSeriesChart';
import AIInsights from './components/AIInsights';
import OrdersView from './components/OrdersView';
import ResourcesView from './components/ResourcesView';
import AnalyticsView from './components/AnalyticsView';
import AlertsView from './components/AlertsView';
import SettingsView from './components/SettingsView';
import { aimlService } from './services/aiMLService';
import { 
  Activity, 
  Clock, 
  TrendingUp, 
  AlertTriangle,
  Package,
  Users
} from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Get real-time metrics from AI service
  const metrics = aimlService.getCurrentMetrics();
  const machineStatuses = aimlService.getMachineStatus();
  const activeOrders = 24; // This could also come from AI service
  const criticalAlerts = machineStatuses.filter(m => m.maintenanceRisk > 70).length;

  const renderMainContent = () => {
    switch (activeTab) {
      case 'schedule':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Production Schedule</h1>
              <p className="text-gray-600">Manage and optimize production scheduling</p>
            </div>
            <ProductionSchedule />
          </div>
        );
      case 'machines':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Machine Status</h1>
              <p className="text-gray-600">Monitor real-time machine performance and health</p>
            </div>
            <MachineStatus />
          </div>
        );
      case 'orders':
        return <OrdersView />;
      case 'resources':
        return <ResourcesView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'alerts':
        return <AlertsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return (
          <div className="space-y-6">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Production Dashboard</h1>
              <p className="text-gray-600">Real-time monitoring and control of manufacturing operations</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <KPICard
                title="Overall Equipment Effectiveness"
                metric="oee"
                changeType="increase"
                icon={TrendingUp}
                color="bg-green-500"
              />
              <KPICard
                title="Active Orders"
                value="24"
                change="3 new orders today"
                changeType="increase"
                icon={Package}
                color="bg-blue-500"
              />
              <KPICard
                title="Machine Utilization"
                metric="efficiency"
                changeType="increase"
                icon={Activity}
                color="bg-purple-500"
              />
              <KPICard
                title="Critical Alerts"
                value={criticalAlerts.toString()}
                change={`${machineStatuses.filter(m => m.status === 'error').length} machines need attention`}
                changeType="decrease"
                icon={AlertTriangle}
                color="bg-red-500"
              />
            </div>

            {/* Main Content Grid */}
            <div className="space-y-6 mb-6">
              <div>
                <ProductionSchedule />
              </div>
              <div>
                <TimeSeriesChart />
              </div>
            </div>

            {/* Machine Status */}
            <div className="mb-6">
              <MachineStatus />
            </div>

            {/* AI Insights */}
            <div>
              <AIInsights />
            </div>
          </div>
        );
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex relative">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 p-3 sm:p-4 lg:p-6 w-full lg:w-auto">
          <div className="max-w-7xl mx-auto">
            {renderMainContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;