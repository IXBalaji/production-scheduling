import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, Play, CheckCircle, AlertCircle } from 'lucide-react';

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
  const [viewType, setViewType] = useState<'day' | 'month' | 'year'>('day');

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
    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-1 gap-1">
          {hours.map(hour => {
            const hourItems = dayItems.filter(item => 
              item.startDateTime.getHours() === hour
            );

            return (
              <div key={hour} className="flex border-b border-gray-100 min-h-[60px]">
                <div className="w-16 p-2 text-sm text-gray-500 border-r border-gray-100">
                  {hour.toString().padStart(2, '0')}:00
                </div>
                <div className="flex-1 p-2 space-y-1">
                  {hourItems.map(item => (
                    <div
                      key={item.id}
                      className={`p-2 rounded-lg border-l-4 ${getStatusColor(item.status)} text-xs`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(item.status)}
                          <span className="font-medium">{item.orderNo}</span>
                          <div className={`w-2 h-2 rounded-full ${getPriorityColor(item.priority)}`}></div>
                        </div>
                        <span className="text-xs">
                          {formatTime(item.startDateTime)} - {formatTime(item.endDateTime)}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 mb-1">{item.product}</div>
                      <div className="text-xs text-gray-500">{item.machine}</div>
                      <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                        <div 
                          className="bg-blue-600 h-1 rounded-full"
                          style={{ width: `${item.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
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
    
    while (currentDay <= lastDay || days.length < 42) {
      days.push(new Date(currentDay));
      currentDay.setDate(currentDay.getDate() + 1);
    }

    return (
      <div className="flex-1">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 h-96">
          {days.map((day, index) => {
            const dayItems = monthItems.filter(item => 
              item.startDateTime.toDateString() === day.toDateString()
            );
            const isCurrentMonth = day.getMonth() === currentDate.getMonth();
            const isToday = day.toDateString() === new Date().toDateString();

            return (
              <div
                key={index}
                className={`p-1 border border-gray-200 ${
                  isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                } ${isToday ? 'ring-2 ring-blue-500' : ''}`}
              >
                <div className={`text-sm ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'} mb-1`}>
                  {day.getDate()}
                </div>
                <div className="space-y-1">
                  {dayItems.slice(0, 3).map(item => (
                    <div
                      key={item.id}
                      className={`p-1 rounded text-xs ${getStatusColor(item.status)} truncate`}
                    >
                      <div className="flex items-center space-x-1">
                        <div className={`w-1 h-1 rounded-full ${getPriorityColor(item.priority)}`}></div>
                        <span className="truncate">{item.orderNo}</span>
                      </div>
                    </div>
                  ))}
                  {dayItems.length > 3 && (
                    <div className="text-xs text-gray-500">+{dayItems.length - 3} more</div>
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
      <div className="flex-1">
        <div className="grid grid-cols-3 gap-4">
          {months.map(month => {
            const monthDate = new Date(currentDate.getFullYear(), month, 1);
            const monthItems = yearItems.filter(item => 
              item.startDateTime.getMonth() === month
            );

            return (
              <div key={month} className="border border-gray-200 rounded-lg p-3">
                <h4 className="font-medium text-sm mb-2">
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
          {(['day', 'month', 'year'] as const).map(view => (
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