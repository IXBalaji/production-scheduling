import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, Play, CheckCircle, AlertCircle, Plus, Filter, Search } from 'lucide-react';
import WorkOrderEditModal from './WorkOrderEditModal';

interface WorkCenter {
  id: string;
  name: string;
  type: string;
  capacity: number;
}

interface ScheduleItem {
  id: number;
  orderNo: string;
  product: string;
  workCenter: string;
  startTime: string;
  endTime: string;
  status: 'running' | 'scheduled' | 'completed' | 'delayed';
  priority: 'high' | 'medium' | 'low';
  progress: number;
  color: string;
  customer?: string;
  quantity?: number;
  operator?: string;
  notes?: string;
}

const ProductionCalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [selectedWorkCenter, setSelectedWorkCenter] = useState<string | null>(null);
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([
    {
      id: 1,
      orderNo: 'PO-2024-001',
      product: 'Hydraulic Cylinder',
      workCenter: 'CNC-001',
      startTime: '08:00',
      endTime: '12:00',
      status: 'running',
      priority: 'high',
      progress: 65,
      color: 'bg-blue-500',
      customer: 'Automotive Corp',
      quantity: 50,
      operator: 'John Smith'
    },
    {
      id: 2,
      orderNo: 'PO-2024-002',
      product: 'Steel Bracket',
      workCenter: 'CNC-001',
      startTime: '13:00',
      endTime: '16:00',
      status: 'scheduled',
      priority: 'medium',
      progress: 0,
      color: 'bg-green-500',
      customer: 'Industrial Solutions',
      quantity: 100
    },
    {
      id: 3,
      orderNo: 'PO-2024-003',
      product: 'Welded Assembly',
      workCenter: 'WLD-001',
      startTime: '09:00',
      endTime: '15:00',
      status: 'running',
      priority: 'high',
      progress: 40,
      color: 'bg-purple-500',
      customer: 'Manufacturing Plus',
      quantity: 25,
      operator: 'Maria Garcia'
    },
    {
      id: 4,
      orderNo: 'PO-2024-004',
      product: 'Precision Bearing',
      workCenter: 'LAT-001',
      startTime: '10:00',
      endTime: '14:00',
      status: 'completed',
      priority: 'low',
      progress: 100,
      color: 'bg-emerald-500',
      customer: 'Precision Engineering',
      quantity: 200
    },
    {
      id: 5,
      orderNo: 'PO-2024-005',
      product: 'Motor Assembly',
      workCenter: 'ASM-001',
      startTime: '07:00',
      endTime: '11:00',
      status: 'delayed',
      priority: 'high',
      progress: 25,
      color: 'bg-red-500',
      customer: 'Electric Motors Inc',
      quantity: 15,
      operator: 'David Chen'
    },
    {
      id: 6,
      orderNo: 'PO-2024-006',
      product: 'Quality Check',
      workCenter: 'QC-001',
      startTime: '14:00',
      endTime: '16:00',
      status: 'scheduled',
      priority: 'medium',
      progress: 0,
      color: 'bg-orange-500',
      quantity: 75
    },
    {
      id: 7,
      orderNo: 'PO-2024-007',
      product: 'Final Packaging',
      workCenter: 'PKG-001',
      startTime: '16:00',
      endTime: '18:00',
      status: 'scheduled',
      priority: 'low',
      progress: 0,
      color: 'bg-cyan-500',
      quantity: 300
    },
    {
      id: 8,
      orderNo: 'PO-2024-008',
      product: 'Custom Parts',
      workCenter: 'CNC-002',
      startTime: '08:30',
      endTime: '12:30',
      status: 'running',
      priority: 'medium',
      progress: 55,
      color: 'bg-indigo-500',
      customer: 'Custom Manufacturing',
      quantity: 80,
      operator: 'Sarah Johnson'
    },
    {
      id: 9,
      orderNo: 'PO-2024-009',
      product: 'Structural Weld',
      workCenter: 'WLD-002',
      startTime: '11:00',
      endTime: '17:00',
      status: 'scheduled',
      priority: 'high',
      progress: 0,
      color: 'bg-pink-500',
      customer: 'Construction Co',
      quantity: 40
    }
  ]);
  
  const [editingWorkOrder, setEditingWorkOrder] = useState<ScheduleItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [draggedItem, setDraggedItem] = useState<ScheduleItem | null>(null);
  const [dragOverWorkCenter, setDragOverWorkCenter] = useState<string | null>(null);

  const workCenters: WorkCenter[] = [
    { id: 'CNC-001', name: 'CNC Machine 001', type: 'CNC', capacity: 20 },
    { id: 'WLD-001', name: 'Welding Station 001', type: 'Welding', capacity: 15 },
    { id: 'LAT-001', name: 'Lathe Machine 001', type: 'Lathe', capacity: 12 },
    { id: 'ASM-001', name: 'Assembly Line 001', type: 'Assembly', capacity: 25 },
    { id: 'QC-001', name: 'Quality Control 001', type: 'QC', capacity: 8 },
    { id: 'PKG-001', name: 'Packaging Station 001', type: 'Packaging', capacity: 18 },
    { id: 'CNC-002', name: 'CNC Machine 002', type: 'CNC', capacity: 20 },
    { id: 'WLD-002', name: 'Welding Station 002', type: 'Welding', capacity: 15 }
  ];


  // Generate time slots from 6:00 AM to 10:00 PM
  const timeSlots = [];
  for (let hour = 6; hour <= 22; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <Play className="h-3 w-3 text-white" />;
      case 'completed':
        return <CheckCircle className="h-3 w-3 text-white" />;
      case 'delayed':
        return <AlertCircle className="h-3 w-3 text-white" />;
      default:
        return <Clock className="h-3 w-3 text-white" />;
    }
  };

  const calculateTimeSlotPosition = (startTime: string, endTime: string) => {
    const startHour = parseInt(startTime.split(':')[0]);
    const startMinute = parseInt(startTime.split(':')[1]);
    const endHour = parseInt(endTime.split(':')[0]);
    const endMinute = parseInt(endTime.split(':')[1]);
    
    const startPosition = ((startHour - 6) * 60 + startMinute) / 60;
    const duration = ((endHour - 6) * 60 + endMinute - (startHour - 6) * 60 - startMinute) / 60;
    
    return { left: startPosition * 60, width: duration * 60 };
  };

  const getItemsForWorkCenter = (workCenterId: string) => {
    return scheduleItems.filter(item => item.workCenter === workCenterId);
  };

  const handleTimeSlotClick = (timeSlot: string, workCenter: string) => {
    setSelectedTimeSlot(timeSlot);
    setSelectedWorkCenter(workCenter);
  };

  const handleWorkOrderClick = (workOrder: ScheduleItem) => {
    setEditingWorkOrder(workOrder);
    setIsEditModalOpen(true);
  };

  const handleWorkOrderSave = (updatedWorkOrder: ScheduleItem) => {
    setScheduleItems(prev => 
      prev.map(item => 
        item.id === updatedWorkOrder.id ? updatedWorkOrder : item
      )
    );
  };

  const handleDragStart = (e: React.DragEvent, item: ScheduleItem) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget.outerHTML);
    e.currentTarget.style.opacity = '0.5';
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.style.opacity = '1';
    setDraggedItem(null);
    setDragOverWorkCenter(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent, workCenterId: string) => {
    e.preventDefault();
    setDragOverWorkCenter(workCenterId);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    // Only clear if we're leaving the work center row entirely
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverWorkCenter(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetWorkCenter: string) => {
    e.preventDefault();
    
    if (draggedItem && draggedItem.workCenter !== targetWorkCenter) {
      setScheduleItems(prev => 
        prev.map(item => 
          item.id === draggedItem.id 
            ? { ...item, workCenter: targetWorkCenter }
            : item
        )
      );
    }
    
    setDragOverWorkCenter(null);
    setDraggedItem(null);
  };
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-full flex flex-col">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateDate('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">{formatDate(currentDate)}</h2>
            <button
              onClick={() => navigateDate('next')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            
            {/* Buttons moved next to date */}
            <button className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Search</span>
            </button>
            <button className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filter</span>
            </button>
            <button className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Task</span>
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              TODAY
            </button>
          </div>
          
          <div className="text-sm text-gray-600">
            Production Schedule
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 overflow-auto">
        <div className="min-w-[1200px]">
          {/* Time Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
            <div className="flex">
              <div className="w-48 p-3 border-r border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Work Centers</span>
                  <span className="text-xs text-gray-500">Capacity</span>
                </div>
              </div>
              <div className="flex-1 flex">
                {timeSlots.map((timeSlot, index) => (
                  <div
                    key={timeSlot}
                    className="w-16 p-2 text-center border-r border-gray-200 bg-gray-50"
                  >
                    <span className="text-xs font-medium text-gray-600">
                      {timeSlot}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Work Center Rows */}
          <div className="divide-y divide-gray-200">
            {workCenters.map((workCenter) => {
              const items = getItemsForWorkCenter(workCenter.id);
              const isDragOver = dragOverWorkCenter === workCenter.id;
              
              return (
                <div 
                  key={workCenter.id} 
                  className={`flex hover:bg-gray-50 transition-colors ${
                    isDragOver ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                  onDragOver={handleDragOver}
                  onDragEnter={(e) => handleDragEnter(e, workCenter.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, workCenter.id)}
                >
                  {/* Work Center Info */}
                  <div className="w-48 p-3 border-r border-gray-200 bg-white">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900 truncate">
                        {workCenter.name}
                      </span>
                      <span className="text-xs text-gray-500">{workCenter.type}</span>
                      <span className="text-xs text-blue-600 font-medium mt-1">
                        Cap: {workCenter.capacity}
                      </span>
                    </div>
                  </div>

                  {/* Time Slots */}
                  <div className="flex-1 relative h-20 min-h-[80px]">
                    {/* Time Slot Grid */}
                    <div className="absolute inset-0 flex">
                      {timeSlots.map((timeSlot, index) => (
                        <div
                          key={timeSlot}
                          className="w-16 h-full border-r border-gray-100 cursor-pointer hover:bg-blue-50 transition-colors"
                          onClick={() => handleTimeSlotClick(timeSlot, workCenter.id)}
                        />
                      ))}
                    </div>

                    {/* Schedule Items */}
                    <div className="absolute inset-0 p-1">
                      {items.map((item, itemIndex) => {
                        const position = calculateTimeSlotPosition(item.startTime, item.endTime);
                        
                        return (
                          <div
                            key={item.id}
                            className={`absolute ${item.color} text-white rounded-lg shadow-sm border border-white/20 cursor-pointer hover:shadow-md transition-all transform hover:scale-105 ${
                              draggedItem?.id === item.id ? 'opacity-50' : ''
                            }`}
                            style={{
                              left: `${position.left}px`,
                              width: `${Math.max(position.width, 80)}px`,
                              top: `${itemIndex * 24 + 4}px`,
                              height: '20px',
                              zIndex: 10
                            }}
                            draggable
                            onDragStart={(e) => handleDragStart(e, item)}
                            onDragEnd={handleDragEnd}
                            onClick={() => handleWorkOrderClick(item)}
                          >
                            <div className="flex items-center justify-between h-full px-2">
                              <div className="flex items-center space-x-1 min-w-0">
                                {getStatusIcon(item.status)}
                                <span className="text-xs font-medium truncate">
                                  {item.orderNo}
                                </span>
                              </div>
                              <span className="text-xs opacity-90 ml-1">
                                {item.startTime}-{item.endTime}
                              </span>
                            </div>
                            
                            {/* Progress Bar */}
                            {item.progress > 0 && (
                              <div className="absolute bottom-0 left-0 h-0.5 bg-white/30 w-full">
                                <div 
                                  className="h-full bg-white/80"
                                  style={{ width: `${item.progress}%` }}
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <WorkOrderEditModal
        workOrder={editingWorkOrder}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingWorkOrder(null);
        }}
        onSave={handleWorkOrderSave}
        workCenters={workCenters}
      />

      {/* Legend */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex flex-wrap items-center gap-6 text-xs">
          <div className="flex items-center space-x-4">
            <span className="font-medium text-gray-700">Status:</span>
            <div className="flex items-center space-x-1">
              <Play className="h-3 w-3 text-blue-500" />
              <span>Running</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3 text-gray-500" />
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
          
          <div className="flex items-center space-x-4">
            <span className="font-medium text-gray-700">Priority:</span>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded bg-red-500"></div>
              <span>High</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded bg-yellow-500"></div>
              <span>Medium</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded bg-green-500"></div>
              <span>Low</span>
            </div>
          </div>
        </div>
        
        <div className="mt-2 text-xs text-gray-500">
          <span className="font-medium">Tip:</span> Click on work order cards to edit, drag to move between work centers
        </div>
      </div>
    </div>
  );
};

export default ProductionCalendarView;