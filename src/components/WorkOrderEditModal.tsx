import React, { useState, useEffect } from 'react';
import { X, Save, Calendar, Clock, User, Package, AlertTriangle } from 'lucide-react';

interface WorkOrder {
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

interface WorkOrderEditModalProps {
  workOrder: WorkOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (workOrder: WorkOrder) => void;
  workCenters: Array<{ id: string; name: string; type: string; capacity: number }>;
}

const WorkOrderEditModal: React.FC<WorkOrderEditModalProps> = ({
  workOrder,
  isOpen,
  onClose,
  onSave,
  workCenters
}) => {
  const [formData, setFormData] = useState<WorkOrder>({
    id: 0,
    orderNo: '',
    product: '',
    workCenter: '',
    startTime: '',
    endTime: '',
    status: 'scheduled',
    priority: 'medium',
    progress: 0,
    color: 'bg-blue-500',
    customer: '',
    quantity: 0,
    operator: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (workOrder) {
      setFormData({
        ...workOrder,
        customer: workOrder.customer || '',
        quantity: workOrder.quantity || 0,
        operator: workOrder.operator || '',
        notes: workOrder.notes || ''
      });
    }
  }, [workOrder]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.orderNo.trim()) newErrors.orderNo = 'Order number is required';
    if (!formData.product.trim()) newErrors.product = 'Product name is required';
    if (!formData.workCenter) newErrors.workCenter = 'Work center is required';
    if (!formData.startTime) newErrors.startTime = 'Start time is required';
    if (!formData.endTime) newErrors.endTime = 'End time is required';
    
    if (formData.startTime && formData.endTime) {
      const start = new Date(`2024-01-01 ${formData.startTime}`);
      const end = new Date(`2024-01-01 ${formData.endTime}`);
      if (start >= end) {
        newErrors.endTime = 'End time must be after start time';
      }
    }

    if (formData.quantity && formData.quantity <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    }

    if (formData.progress < 0 || formData.progress > 100) {
      newErrors.progress = 'Progress must be between 0 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'delayed': return 'bg-red-100 text-red-800 border-red-200';
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const colorOptions = [
    { value: 'bg-blue-500', label: 'Blue', color: 'bg-blue-500' },
    { value: 'bg-green-500', label: 'Green', color: 'bg-green-500' },
    { value: 'bg-purple-500', label: 'Purple', color: 'bg-purple-500' },
    { value: 'bg-red-500', label: 'Red', color: 'bg-red-500' },
    { value: 'bg-orange-500', label: 'Orange', color: 'bg-orange-500' },
    { value: 'bg-cyan-500', label: 'Cyan', color: 'bg-cyan-500' },
    { value: 'bg-indigo-500', label: 'Indigo', color: 'bg-indigo-500' },
    { value: 'bg-pink-500', label: 'Pink', color: 'bg-pink-500' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Package className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">
              {workOrder ? 'Edit Work Order' : 'New Work Order'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order Number *
              </label>
              <input
                type="text"
                value={formData.orderNo}
                onChange={(e) => handleInputChange('orderNo', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.orderNo ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="PO-2024-001"
              />
              {errors.orderNo && (
                <p className="text-red-500 text-xs mt-1">{errors.orderNo}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product *
              </label>
              <input
                type="text"
                value={formData.product}
                onChange={(e) => handleInputChange('product', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.product ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Hydraulic Cylinder"
              />
              {errors.product && (
                <p className="text-red-500 text-xs mt-1">{errors.product}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Work Center *
              </label>
              <select
                value={formData.workCenter}
                onChange={(e) => handleInputChange('workCenter', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.workCenter ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select Work Center</option>
                {workCenters.map(wc => (
                  <option key={wc.id} value={wc.id}>
                    {wc.name} ({wc.type})
                  </option>
                ))}
              </select>
              {errors.workCenter && (
                <p className="text-red-500 text-xs mt-1">{errors.workCenter}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer
              </label>
              <input
                type="text"
                value={formData.customer}
                onChange={(e) => handleInputChange('customer', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Customer Name"
              />
            </div>
          </div>

          {/* Time and Scheduling */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Time *
              </label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => handleInputChange('startTime', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.startTime ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.startTime && (
                <p className="text-red-500 text-xs mt-1">{errors.startTime}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Time *
              </label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => handleInputChange('endTime', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.endTime ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.endTime && (
                <p className="text-red-500 text-xs mt-1">{errors.endTime}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Progress (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.progress}
                onChange={(e) => handleInputChange('progress', parseInt(e.target.value) || 0)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.progress ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.progress && (
                <p className="text-red-500 text-xs mt-1">{errors.progress}</p>
              )}
            </div>
          </div>

          {/* Status and Priority */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="scheduled">Scheduled</option>
                <option value="running">Running</option>
                <option value="completed">Completed</option>
                <option value="delayed">Delayed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 0)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.quantity ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="100"
              />
              {errors.quantity && (
                <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>
              )}
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Card Color
            </label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => handleInputChange('color', option.value)}
                  className={`w-8 h-8 rounded-lg ${option.color} border-2 transition-all ${
                    formData.color === option.value ? 'border-gray-900 scale-110' : 'border-gray-300'
                  }`}
                  title={option.label}
                />
              ))}
            </div>
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Operator
              </label>
              <input
                type="text"
                value={formData.operator}
                onChange={(e) => handleInputChange('operator', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="John Smith"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Additional notes or instructions..."
            />
          </div>

          {/* Preview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Preview</h4>
            <div className="flex items-center space-x-4">
              <div className={`px-3 py-2 rounded-lg text-white text-sm font-medium ${formData.color}`}>
                {formData.orderNo || 'Order Number'}
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(formData.status)}`}>
                {formData.status}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(formData.priority)}`}>
                {formData.priority}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="h-4 w-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkOrderEditModal;