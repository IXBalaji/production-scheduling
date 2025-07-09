import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, Play, CheckCircle, AlertCircle, Plus, Filter } from 'lucide-react';
import ProductionCalendarView from './ProductionCalendarView';

interface ScheduleItem {
  id: number;
  orderNo: string;
  product: string;
  machine: string;
  startDateTime: Date;
  endDateTime: Date;
  status: 'running' | 'scheduled' | 'completed' | 'delayed';
  priority: 'high' | 'medium' | 'low';
  progress: number;
}

interface CalendarViewProps {
  scheduleData: ScheduleItem[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ scheduleData }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<'day' | 'month' | 'year' | 'timeline'>('timeline');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-green-100 border-green-500 text-green-800';
      case 'completed':
        return 'bg-green-100 border-green-500 text-green-800';
      case 'delayed':
        return 'bg-red-100 border-red-500 text-red-800';
      case 'scheduled':
        return 'bg-blue-100 border-blue-500 text-blue-800';
      default:
        return 'bg-gray-100 border-gray-500 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Play className="h-3 w-3" />;
      case 'completed':
        return <CheckCircle className="h-3 w-3" />;
      case 'delayed':
        return <AlertCircle className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    
    switch (viewType) {
      case 'day':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
        break;
      case 'year':
        newDate.setFullYear(newDate.getFullYear() + (direction === 'next' ? 1 : -1));
        break;
    }
    
    setCurrentDate(newDate);
  };

  const getDateTitle = () => {
    switch (viewType) {
      case 'day':
        return currentDate.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
      case 'month':
        return currentDate.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long' 
        });
      case 'year':
        return currentDate.getFullYear().toString();
      default:
        return '';
    }
  };

  const filterScheduleByDate = (items: ScheduleItem[]) => {
    return items.filter(item => {
      const itemDate = item.startDateTime;
      
      switch (viewType) {
        case 'day':
          return itemDate.toDateString() === currentDate.toDateString();
        case 'month':
          return itemDate.getMonth() === currentDate.getMonth() && 
                 itemDate.getFullYear() === currentDate.getFullYear();
        case 'year':
          return itemDate.getFullYear() === currentDate.getFullYear();
        default:
          return false;
      }
    });
  };

  const renderDayView = () => {
    const dayItems = filterScheduleByDate(scheduleData);
    const hours = Array.from({ length: 17 }, (_, i) => i + 6); // 6 AM to 10 PM

    return (
      <div className="flex-1 overflow-auto bg-gray-50">
        <div className="min-h-full">
          {hours.map(hour => {
            const hourItems = dayItems.filter(item => 
              item.startDateTime.getHours() === hour
            );

            return (
              <div key={hour} className="flex border-b border-gray-200 min-h-[80px] bg-white">
                <div className="w-20 p-3 text-sm font-medium text-gray-600 border-r border-gray-200 bg-gray-50 flex items-start">
                  {hour.toString().padStart(2, '0')}:00
                </div>
                <div className="flex-1 p-3 space-y-2">
                  {hourItems.map(item => (
                    <div
                      key={item.id}
                      className={`p-3 rounded-lg border-l-4 ${getStatusColor(item.status)} shadow-sm hover:shadow-md transition-all cursor-pointer`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(item.status)}
                          <span className="text-sm font-semibold">{item.orderNo}</span>
                          <div className={`w-2 h-2 rounded-full ${getPriorityColor(item.priority)}`}></div>
                        </div>
                        <span className="text-xs font-medium text-gray-600">
                          {formatTime(item.startDateTime)} - {formatTime(item.endDateTime)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-700 mb-1 font-medium">{item.product}</div>
                      <div className="text-xs text-gray-500 mb-2">Machine: {item.machine}</div>
                      <div className="flex items-center justify-between">
                        <div className="w-full bg-gray-200 rounded-full h-2 mr-3">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${item.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-gray-600 whitespace-nowrap">
                          {item.progress}%
                        </span>
                      </div>
                    </div>
                  ))}
                  {hourItems.length === 0 && (
                    <div className="h-12 flex items-center justify-center text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-colors">
                      <Plus className="h-4 w-4 mr-1" />
                      Add task for {hour.toString().padStart(2, '0')}:00
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    const monthItems = filterScheduleByDate(scheduleData);
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDay = new Date(startDate);
    
    // Generate 6 weeks of days
    for (let week = 0; week < 6; week++) {
      for (let day = 0; day < 7; day++) {
        days.push(new Date(currentDay));
        currentDay.setDate(currentDay.getDate() + 1);
      }
    }

    return (
      <div className="flex-1 bg-gray-50">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-px bg-gray-200 mb-px">
          {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
            <div key={day} className="bg-gray-50 p-3 text-center">
              <span className="text-sm font-semibold text-gray-700">{day}</span>
            </div>
          ))}
        </div>
        
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-px bg-gray-200 h-96">
          {days.map((day, index) => {
            const dayItems = monthItems.filter(item => 
              item.startDateTime.toDateString() === day.toDateString()
            );
            const isCurrentMonth = day.getMonth() === currentDate.getMonth();
            const isToday = day.toDateString() === new Date().toDateString();
            const isWeekend = day.getDay() === 0 || day.getDay() === 6;

            return (
              <div
                key={index}
                className={`bg-white p-2 min-h-[120px] ${
                  !isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''
                } ${isToday ? 'ring-2 ring-blue-500 ring-inset' : ''} ${
                  isWeekend ? 'bg-gray-50' : ''
                } hover:bg-blue-50 transition-colors cursor-pointer`}
              >
                <div className={`text-sm font-semibold mb-2 ${
                  isToday ? 'text-blue-600' : isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                }`}>
                  {day.getDate()}
                </div>
                
                <div className="space-y-1">
                  {dayItems.slice(0, 3).map(item => (
                    <div
                      key={item.id}
                      className={`p-1 rounded text-xs ${getStatusColor(item.status)} truncate hover:shadow-sm transition-shadow cursor-pointer`}
                    >
                      <div className="flex items-center space-x-1">
                        <div 
                          className={`w-2 h-2 rounded-full ${getPriorityColor(item.priority).replace('bg-', 'bg-').replace('text-', '')}`}
                        />
                        <span className="font-medium truncate">{item.orderNo}</span>
                      </div>
                      <div className="text-xs opacity-75 truncate mt-0.5">
                        {formatTime(item.startDateTime)} - {item.product}
                      </div>
                    </div>
                  ))}
                  {dayItems.length > 3 && (
                    <div className="text-xs text-gray-500 font-medium">
                      +{dayItems.length - 3} more
                    </div>
                  ))}
                  {dayItems.length === 0 && isCurrentMonth && (
                    <div className="text-xs text-gray-400 border border-dashed border-gray-300 rounded p-1 text-center hover:border-blue-300 hover:text-blue-500 transition-colors">
                      <Plus className="h-3 w-3 mx-auto" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderYearView = () => {
    const yearItems = filterScheduleByDate(scheduleData);
    const months = Array.from({ length: 12 }, (_, i) => i);

    return (
      <div className="flex-1 bg-gray-50 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {months.map(month => {
            const monthDate = new Date(currentDate.getFullYear(), month, 1);
            const monthItems = yearItems.filter(item => 
              item.startDateTime.getMonth() === month
            );
            
            const totalOrders = monthItems.length;
            const completedOrders = monthItems.filter(item => item.status === 'completed').length;
            const runningOrders = monthItems.filter(item => item.status === 'running').length;
            const delayedOrders = monthItems.filter(item => item.status === 'delayed').length;

            return (
              <div key={month} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-base text-gray-900">
                    {monthDate.toLocaleDateString('en-US', { month: 'long' })}
                  </h4>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {totalOrders} orders
                  </span>
                </div>
                
                {/* Month Statistics */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="text-center p-2 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-600">{completedOrders}</div>
                    <div className="text-xs text-green-600">Completed</div>
                  </div>
                  <div className="text-center p-2 bg-blue-50 rounded-lg">
                    <div className="text-lg font-bold text-blue-600">{runningOrders}</div>
                    <div className="text-xs text-blue-600">Running</div>
                  </div>
                </div>
                
                {delayedOrders > 0 && (
                  <div className="text-center p-2 bg-red-50 rounded-lg mb-4">
                    <div className="text-lg font-bold text-red-600">{delayedOrders}</div>
                    <div className="text-xs text-red-600">Delayed</div>
                  </div>
                )}
                
                {/* Recent Orders */}
                <div className="space-y-2">
                  <h5 className="text-xs font-medium text-gray-700 mb-2">Recent Orders:</h5>
                  {monthItems.slice(0, 4).map(item => (
                    <div
                      key={item.id}
                      className={`p-2 rounded-lg text-xs ${getStatusColor(item.status)} hover:shadow-sm transition-shadow`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <div className={`w-2 h-2 rounded-full ${getPriorityColor(item.priority).replace('bg-', 'bg-').replace('text-', '')}`}></div>
                          <span className="font-medium truncate">{item.orderNo}</span>
                        </div>
                        <span className="text-xs opacity-75">
                          {formatDate(item.startDateTime)}
                        </span>
                      </div>
                      <div className="text-xs opacity-75 truncate mt-1">
                        {item.product}
                      </div>
                    </div>
                  ))}
                  {monthItems.length > 4 && (
                    <div className="text-xs text-gray-500 text-center py-1 bg-gray-50 rounded">
                      +{monthItems.length - 4} more orders
                    </div>
                  )}
                  {monthItems.length === 0 && (
                    <div className="text-xs text-gray-400 text-center py-4 border-2 border-dashed border-gray-200 rounded-lg">
                      No orders scheduled
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderQuickStats = () => {
    const todayItems = scheduleData.filter(item => 
      item.startDateTime.toDateString() === currentDate.toDateString()
    );
    
    const stats = {
      total: todayItems.length,
      running: todayItems.filter(item => item.status === 'running').length,
      completed: todayItems.filter(item => item.status === 'completed').length,
      delayed: todayItems.filter(item => item.status === 'delayed').length,
      scheduled: todayItems.filter(item => item.status === 'scheduled').length
    };

    return (
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
        <div className="bg-white p-3 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Orders</div>
        </div>
        <div className="bg-white p-3 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-blue-600">{stats.running}</div>
          <div className="text-sm text-gray-600">Running</div>
        </div>
        <div className="bg-white p-3 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        <div className="bg-white p-3 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-red-600">{stats.delayed}</div>
          <div className="text-sm text-gray-600">Delayed</div>
        </div>
        <div className="bg-white p-3 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-gray-600">{stats.scheduled}</div>
          <div className="text-sm text-gray-600">Scheduled</div>
        </div>
      </div>
    );
  };

  const renderViewControls = () => {
    return (
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigateDate('prev')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h3 className="text-lg font-semibold text-gray-900">{getDateTitle()}</h3>
          <button
            onClick={() => navigateDate('next')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filter</span>
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Today
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        {renderViewControls()}

        {/* View Type Selector */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {(['timeline', 'day', 'month', 'year'] as const).map(view => (
            <button
              key={view}
              onClick={() => setViewType(view)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                viewType === view
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </button>
          ))}
        </div>
        
        {/* Quick Stats for Day View */}
        {viewType === 'day' && renderQuickStats()}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {viewType === 'timeline' && <ProductionCalendarView />}
        {viewType === 'day' && renderDayView()}
        {viewType === 'month' && renderMonthView()}
        {viewType === 'year' && renderYearView()}
      </div>

      {/* Legend */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-gray-700">Status:</span>
            <div className="flex items-center space-x-1">
              <Play className="h-3 w-3 text-green-500" />
              <span>Running</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3 text-blue-500" />
              <span>Scheduled</span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span>Completed</span>
            </div>
            <div className="flex items-center space-x-1">
              <AlertCircle className="h-3 w-3 text-red-500" />
              <span>Delayed</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-medium text-gray-700">Priority:</span>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span>High</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              <span>Medium</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>Low</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
                  {monthDate.toLocaleDateString('en-US', { month: 'long' })}
                </h4>
                <div className="space-y-1">
                  {monthItems.slice(0, 5).map(item => (
                    <div
                      key={item.id}
                      className={`p-1 rounded text-xs ${getStatusColor(item.status)}`}
                    >
                      <div className="flex items-center space-x-1">
                        <div className={`w-1 h-1 rounded-full ${getPriorityColor(item.priority)}`}></div>
                        <span className="truncate">{item.orderNo}</span>
                        <span className="text-xs">({formatDate(item.startDateTime)})</span>
                      </div>
                    </div>
                  ))}
                  {monthItems.length > 5 && (
                    <div className="text-xs text-gray-500">+{monthItems.length - 5} more</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex flex-col">
      {/* Calendar Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigateDate('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h3 className="text-lg font-semibold text-gray-900">{getDateTitle()}</h3>
            <button
              onClick={() => navigateDate('next')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Today
            </button>
          </div>
        </div>

        {/* View Type Selector */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {(['timeline', 'day', 'month', 'year'] as const).map(view => (
            <button
              key={view}
              onClick={() => setViewType(view)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                viewType === view
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar Content */}
      <div className="flex-1 p-4">
        {viewType === 'timeline' && <ProductionCalendarView />}
        {viewType === 'day' && renderDayView()}
        {viewType === 'month' && renderMonthView()}
        {viewType === 'year' && renderYearView()}
      </div>

      {/* Legend */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-gray-700">Status:</span>
            <div className="flex items-center space-x-1">
              <Play className="h-3 w-3 text-green-500" />
              <span>Running</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3 text-blue-500" />
              <span>Scheduled</span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span>Completed</span>
            </div>
            <div className="flex items-center space-x-1">
              <AlertCircle className="h-3 w-3 text-red-500" />
              <span>Delayed</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-medium text-gray-700">Priority:</span>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span>High</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              <span>Medium</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>Low</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;