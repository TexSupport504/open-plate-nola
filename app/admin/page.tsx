'use client';

import { useState, useEffect } from 'react';
import type {
  Resource,
  ResourceType,
  ResourceRequirement,
  ResourceStatus,
  OperatingHours,
  DayOfWeek,
} from '@/lib/types';
import {
  RESOURCE_TYPE_LABELS,
  REQUIREMENT_LABELS,
  STATUS_LABELS,
  STATUS_COLORS,
} from '@/lib/types';

const DAYS_OF_WEEK: DayOfWeek[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

const RESOURCE_TYPES: ResourceType[] = [
  'fridge',
  'pantry',
  'hot_meal',
  'mobile_distribution',
];

const REQUIREMENTS: ResourceRequirement[] = [
  'none',
  'id_required',
  'proof_of_address',
  'income_verification',
];

const STATUSES: ResourceStatus[] = [
  'operational',
  'low_stock',
  'empty',
  'temporarily_closed',
  'permanently_closed',
];

interface ResourceFormData {
  name: string;
  type: ResourceType;
  address: string;
  latitude: string;
  longitude: string;
  neighborhood: string;
  is_24_7: boolean;
  schedule: Array<{ day: DayOfWeek; open: string; close: string }>;
  hours_notes: string;
  requirements: ResourceRequirement;
  phone: string;
  website: string;
  notes: string;
  status: ResourceStatus;
}

const initialFormData: ResourceFormData = {
  name: '',
  type: 'fridge',
  address: '',
  latitude: '',
  longitude: '',
  neighborhood: '',
  is_24_7: true,
  schedule: [],
  hours_notes: '',
  requirements: 'none',
  phone: '',
  website: '',
  notes: '',
  status: 'operational',
};

export default function AdminPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<ResourceFormData>(initialFormData);
  const [filterType, setFilterType] = useState<ResourceType | ''>('');

  // Fetch resources on mount
  useEffect(() => {
    fetchResources();
  }, [filterType]);

  async function fetchResources() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterType) params.set('type', filterType);

      const res = await fetch(`/api/resources?${params}`);
      const { data, error } = await res.json();

      if (error) throw new Error(error);
      setResources(data || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch resources');
    } finally {
      setLoading(false);
    }
  }

  function resourceToFormData(resource: Resource): ResourceFormData {
    return {
      name: resource.name,
      type: resource.type,
      address: resource.address,
      latitude: String(resource.latitude),
      longitude: String(resource.longitude),
      neighborhood: resource.neighborhood || '',
      is_24_7: resource.hours.is_24_7,
      schedule: resource.hours.schedule || [],
      hours_notes: resource.hours.notes || '',
      requirements: resource.requirements,
      phone: resource.phone || '',
      website: resource.website || '',
      notes: resource.notes || '',
      status: resource.status,
    };
  }

  function formDataToResource(): Partial<Resource> {
    const hours: OperatingHours = {
      is_24_7: formData.is_24_7,
      schedule: formData.is_24_7 ? [] : formData.schedule,
      notes: formData.hours_notes || undefined,
    };

    return {
      name: formData.name,
      type: formData.type,
      address: formData.address,
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
      neighborhood: formData.neighborhood || null,
      hours,
      requirements: formData.requirements,
      phone: formData.phone || null,
      website: formData.website || null,
      notes: formData.notes || null,
      status: formData.status,
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const resourceData = formDataToResource();

      if (editingId) {
        // Update existing resource
        const res = await fetch(`/api/resources/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(resourceData),
        });
        const { error } = await res.json();
        if (error) throw new Error(error);
      } else {
        // Create new resource
        const res = await fetch('/api/resources', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(resourceData),
        });
        const { error } = await res.json();
        if (error) throw new Error(error);
      }

      // Reset form and refresh
      setFormData(initialFormData);
      setEditingId(null);
      setShowForm(false);
      fetchResources();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save resource');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this resource?')) return;

    try {
      const res = await fetch(`/api/resources/${id}`, { method: 'DELETE' });
      const { error } = await res.json();
      if (error) throw new Error(error);
      fetchResources();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete resource');
    }
  }

  async function handleStatusUpdate(id: string, status: ResourceStatus) {
    try {
      const res = await fetch(`/api/resources/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const { error } = await res.json();
      if (error) throw new Error(error);
      fetchResources();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update status');
    }
  }

  function handleEdit(resource: Resource) {
    setFormData(resourceToFormData(resource));
    setEditingId(resource.id);
    setShowForm(true);
  }

  function handleAddNew() {
    setFormData(initialFormData);
    setEditingId(null);
    setShowForm(true);
  }

  function addScheduleDay() {
    setFormData({
      ...formData,
      schedule: [
        ...formData.schedule,
        { day: 'monday', open: '09:00', close: '17:00' },
      ],
    });
  }

  function removeScheduleDay(index: number) {
    setFormData({
      ...formData,
      schedule: formData.schedule.filter((_, i) => i !== index),
    });
  }

  function updateScheduleDay(
    index: number,
    field: 'day' | 'open' | 'close',
    value: string
  ) {
    const newSchedule = [...formData.schedule];
    newSchedule[index] = { ...newSchedule[index], [field]: value };
    setFormData({ ...formData, schedule: newSchedule });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Open Plate NOLA Admin
              </h1>
              <p className="text-gray-600 mt-1">
                Manage food resources across New Orleans
              </p>
            </div>
            <button
              onClick={handleAddNew}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              + Add Resource
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
            <button onClick={() => setError(null)} className="float-right">
              &times;
            </button>
          </div>
        )}

        {/* Filter */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Type
          </label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as ResourceType | '')}
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="">All Types</option>
            {RESOURCE_TYPES.map((type) => (
              <option key={type} value={type}>
                {RESOURCE_TYPE_LABELS[type]}
              </option>
            ))}
          </select>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  {editingId ? 'Edit Resource' : 'Add New Resource'}
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Type *
                  </label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value as ResourceType,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    {RESOURCE_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {RESOURCE_TYPE_LABELS[type]}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>

                {/* Lat/Long */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Latitude *
                    </label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={formData.latitude}
                      onChange={(e) =>
                        setFormData({ ...formData, latitude: e.target.value })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Longitude *
                    </label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={formData.longitude}
                      onChange={(e) =>
                        setFormData({ ...formData, longitude: e.target.value })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                </div>

                {/* Neighborhood */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Neighborhood
                  </label>
                  <input
                    type="text"
                    value={formData.neighborhood}
                    onChange={(e) =>
                      setFormData({ ...formData, neighborhood: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>

                {/* Hours */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hours
                  </label>
                  <div className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id="is_24_7"
                      checked={formData.is_24_7}
                      onChange={(e) =>
                        setFormData({ ...formData, is_24_7: e.target.checked })
                      }
                      className="mr-2"
                    />
                    <label htmlFor="is_24_7">Open 24/7</label>
                  </div>

                  {!formData.is_24_7 && (
                    <div className="space-y-2 pl-4 border-l-2 border-gray-200">
                      {formData.schedule.map((s, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <select
                            value={s.day}
                            onChange={(e) =>
                              updateScheduleDay(i, 'day', e.target.value)
                            }
                            className="border border-gray-300 rounded px-2 py-1"
                          >
                            {DAYS_OF_WEEK.map((day) => (
                              <option key={day} value={day}>
                                {day.charAt(0).toUpperCase() + day.slice(1)}
                              </option>
                            ))}
                          </select>
                          <input
                            type="time"
                            value={s.open}
                            onChange={(e) =>
                              updateScheduleDay(i, 'open', e.target.value)
                            }
                            className="border border-gray-300 rounded px-2 py-1"
                          />
                          <span>to</span>
                          <input
                            type="time"
                            value={s.close}
                            onChange={(e) =>
                              updateScheduleDay(i, 'close', e.target.value)
                            }
                            className="border border-gray-300 rounded px-2 py-1"
                          />
                          <button
                            type="button"
                            onClick={() => removeScheduleDay(i)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addScheduleDay}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        + Add Day
                      </button>
                    </div>
                  )}

                  <input
                    type="text"
                    placeholder="Hours notes (e.g., '1st & 3rd Saturday only')"
                    value={formData.hours_notes}
                    onChange={(e) =>
                      setFormData({ ...formData, hours_notes: e.target.value })
                    }
                    className="mt-2 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  />
                </div>

                {/* Requirements */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Requirements
                  </label>
                  <select
                    value={formData.requirements}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        requirements: e.target.value as ResourceRequirement,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    {REQUIREMENTS.map((req) => (
                      <option key={req} value={req}>
                        {REQUIREMENT_LABELS[req]}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as ResourceStatus,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    {STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {STATUS_LABELS[status]}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Website
                    </label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) =>
                        setFormData({ ...formData, website: e.target.value })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>

                {/* Submit */}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    {editingId ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Resources Table */}
        {loading ? (
          <div className="text-center py-12">Loading resources...</div>
        ) : resources.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No resources found. Add one to get started!
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Neighborhood
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hours
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {resources.map((resource) => (
                  <tr key={resource.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {resource.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {resource.address}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        {RESOURCE_TYPE_LABELS[resource.type]}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {resource.neighborhood || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={resource.status}
                        onChange={(e) =>
                          handleStatusUpdate(
                            resource.id,
                            e.target.value as ResourceStatus
                          )
                        }
                        className={`text-xs rounded-full px-2 py-1 ${STATUS_COLORS[resource.status]} text-white`}
                      >
                        {STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {STATUS_LABELS[status]}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {resource.hours.is_24_7
                        ? '24/7'
                        : resource.hours.schedule?.length
                          ? `${resource.hours.schedule.length} days`
                          : 'No hours set'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(resource)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(resource.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
