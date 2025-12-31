'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import type { Resource, ResourceType } from '@/lib/types';
import {
  RESOURCE_TYPE_LABELS,
  STATUS_LABELS,
  STATUS_COLORS,
} from '@/lib/types';

// Dynamic import for Leaflet map (requires window object)
const ResourceMap = dynamic(() => import('@/components/ResourceMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
      <p className="text-gray-500">Loading map...</p>
    </div>
  ),
});

type FilterType = 'all' | ResourceType;
type ViewMode = 'map' | 'list';

export default function Home() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [showOpenOnly, setShowOpenOnly] = useState(false);
  const [showNoIdOnly, setShowNoIdOnly] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

  useEffect(() => {
    fetchResources();
  }, []);

  async function fetchResources() {
    setLoading(true);
    try {
      const res = await fetch('/api/resources');
      const { data } = await res.json();
      setResources(data || []);
    } catch (e) {
      console.error('Failed to fetch resources:', e);
    } finally {
      setLoading(false);
    }
  }

  // Check if a resource is currently open
  const isOpenNow = (resource: Resource): boolean => {
    if (resource.status !== 'operational') return false;
    if (resource.hours.is_24_7) return true;
    if (!resource.hours.schedule?.length) return false;

    const now = new Date();
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDay = days[now.getDay()];
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const todaySchedule = resource.hours.schedule.find((s) => s.day === currentDay);
    if (!todaySchedule) return false;

    return currentTime >= todaySchedule.open && currentTime < todaySchedule.close;
  };

  // Filter resources based on current filters
  const filteredResources = useMemo(() => {
    return resources.filter((r) => {
      if (filterType !== 'all' && r.type !== filterType) return false;
      if (showOpenOnly && !isOpenNow(r)) return false;
      if (showNoIdOnly && r.requirements !== 'none') return false;
      if (r.status === 'permanently_closed') return false;
      return true;
    });
  }, [resources, filterType, showOpenOnly, showNoIdOnly]);

  // Count by type
  const counts = useMemo(() => {
    const c = { fridge: 0, pantry: 0, hot_meal: 0, mobile_distribution: 0 };
    filteredResources.forEach((r) => {
      c[r.type]++;
    });
    return c;
  }, [filteredResources]);

  const formatHours = (resource: Resource) => {
    if (resource.hours.is_24_7) return '24/7';
    if (!resource.hours.schedule?.length) {
      return resource.hours.notes || 'Hours vary';
    }
    if (resource.hours.notes) return resource.hours.notes;

    const days = resource.hours.schedule.map((s) => {
      const dayName = s.day.charAt(0).toUpperCase() + s.day.slice(1, 3);
      return `${dayName} ${s.open}-${s.close}`;
    });
    return days.slice(0, 2).join(', ') + (days.length > 2 ? '...' : '');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">Open Plate NOLA</h1>
              <p className="text-green-100 mt-1">
                Free food resources across New Orleans
              </p>
            </div>
            <Link
              href="/admin"
              className="text-green-200 hover:text-white text-sm"
            >
              Admin
            </Link>
          </div>
        </div>
      </header>

      {/* SMS Banner */}
      <div className="bg-blue-600 text-white text-center py-3 px-4">
        <p>
          <strong>Text &quot;FOOD&quot; to (coming soon)</strong> for nearby resources via SMS
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 items-center justify-between">
            {/* Type filters */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                  filterType === 'all'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All ({filteredResources.length})
              </button>
              <button
                onClick={() => setFilterType('fridge')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                  filterType === 'fridge'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Fridges ({counts.fridge})
              </button>
              <button
                onClick={() => setFilterType('hot_meal')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                  filterType === 'hot_meal'
                    ? 'bg-amber-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Hot Meals ({counts.hot_meal})
              </button>
              <button
                onClick={() => setFilterType('pantry')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                  filterType === 'pantry'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Pantries ({counts.pantry})
              </button>
            </div>

            {/* Toggle filters */}
            <div className="flex gap-4 items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showOpenOnly}
                  onChange={(e) => setShowOpenOnly(e.target.checked)}
                  className="rounded text-green-600"
                />
                <span className="text-sm text-gray-700">Open Now</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showNoIdOnly}
                  onChange={(e) => setShowNoIdOnly(e.target.checked)}
                  className="rounded text-green-600"
                />
                <span className="text-sm text-gray-700">No ID Required</span>
              </label>

              {/* View toggle */}
              <div className="flex border rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('map')}
                  className={`px-3 py-1.5 text-sm ${
                    viewMode === 'map'
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-700'
                  }`}
                >
                  Map
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1.5 text-sm ${
                    viewMode === 'list'
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-700'
                  }`}
                >
                  List
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Loading resources...</p>
          </div>
        ) : viewMode === 'map' ? (
          /* Map View */
          <div className="flex-1 flex">
            <div className="flex-1 relative" style={{ minHeight: '500px' }}>
              <ResourceMap
                resources={filteredResources}
                selectedId={selectedResource?.id}
                onSelectResource={setSelectedResource}
              />
            </div>

            {/* Side panel for selected resource */}
            {selectedResource && (
              <div className="w-80 bg-white border-l shadow-lg overflow-y-auto">
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-medium text-blue-600">
                      {RESOURCE_TYPE_LABELS[selectedResource.type]}
                    </span>
                    <button
                      onClick={() => setSelectedResource(null)}
                      className="text-gray-400 hover:text-gray-600 text-xl"
                    >
                      &times;
                    </button>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {selectedResource.name}
                  </h2>
                  <p className="text-gray-600 mb-1">{selectedResource.address}</p>
                  {selectedResource.neighborhood && (
                    <p className="text-sm text-gray-500 mb-3">
                      {selectedResource.neighborhood}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span
                      className={`${STATUS_COLORS[selectedResource.status]} text-white text-xs px-2 py-1 rounded-full`}
                    >
                      {STATUS_LABELS[selectedResource.status]}
                    </span>
                    {selectedResource.requirements === 'none' && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        No ID Required
                      </span>
                    )}
                    {isOpenNow(selectedResource) && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        Open Now
                      </span>
                    )}
                  </div>

                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Hours:</span>
                      <p className="text-gray-600">{formatHours(selectedResource)}</p>
                    </div>

                    {selectedResource.notes && (
                      <div>
                        <span className="font-medium text-gray-700">Notes:</span>
                        <p className="text-gray-600 italic">{selectedResource.notes}</p>
                      </div>
                    )}

                    <div className="flex gap-3 pt-2">
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(selectedResource.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700"
                      >
                        Get Directions
                      </a>
                      {selectedResource.phone && (
                        <a
                          href={`tel:${selectedResource.phone}`}
                          className="flex-1 bg-green-600 text-white text-center py-2 rounded-lg hover:bg-green-700"
                        >
                          Call
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* List View */
          <div className="flex-1 max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            {filteredResources.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No resources match your filters.
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredResources.map((resource) => (
                  <div
                    key={resource.id}
                    className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-medium text-blue-600">
                        {RESOURCE_TYPE_LABELS[resource.type]}
                      </span>
                      <span
                        className={`${STATUS_COLORS[resource.status]} text-white text-xs px-2 py-0.5 rounded-full`}
                      >
                        {STATUS_LABELS[resource.status]}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {resource.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-1">{resource.address}</p>
                    {resource.neighborhood && (
                      <p className="text-xs text-gray-500 mb-2">
                        {resource.neighborhood}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-1 mb-2">
                      <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                        {formatHours(resource)}
                      </span>
                      {resource.requirements === 'none' && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                          No ID
                        </span>
                      )}
                      {isOpenNow(resource) && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                          Open
                        </span>
                      )}
                    </div>

                    {resource.notes && (
                      <p className="text-xs text-gray-500 italic mb-2 line-clamp-2">
                        {resource.notes}
                      </p>
                    )}

                    <div className="flex gap-2 text-sm pt-2 border-t">
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(resource.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Directions
                      </a>
                      {resource.phone && (
                        <a
                          href={`tel:${resource.phone}`}
                          className="text-blue-600 hover:underline"
                        >
                          Call
                        </a>
                      )}
                      {resource.website && (
                        <a
                          href={
                            resource.website.startsWith('http')
                              ? resource.website
                              : `https://${resource.website}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Website
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400 mb-2">
            Open Plate NOLA - Community food resources with no barriers
          </p>
          <div className="flex justify-center gap-4 text-sm">
            <Link href="/admin" className="text-green-400 hover:text-green-300">
              Update Resources
            </Link>
            <span className="text-gray-600">|</span>
            <Link href="/admin/contacts" className="text-green-400 hover:text-green-300">
              Partner With Us
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
