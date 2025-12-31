'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Resource } from '@/lib/types';
import { RESOURCE_TYPE_LABELS, STATUS_LABELS, STATUS_COLORS } from '@/lib/types';

export default function Home() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'open_now' | 'no_requirements'>('all');

  useEffect(() => {
    fetchResources();
  }, [filter]);

  async function fetchResources() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter === 'open_now') params.set('open_now', 'true');
      if (filter === 'no_requirements') params.set('requirements', 'none');

      const res = await fetch(`/api/resources?${params}`);
      const { data } = await res.json();
      setResources(data || []);
    } catch (e) {
      console.error('Failed to fetch resources:', e);
    } finally {
      setLoading(false);
    }
  }

  // Group resources by type
  const fridges = resources.filter((r) => r.type === 'fridge');
  const pantries = resources.filter((r) => r.type === 'pantry');
  const hotMeals = resources.filter((r) => r.type === 'hot_meal');
  const mobile = resources.filter((r) => r.type === 'mobile_distribution');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Open Plate NOLA</h1>
          <p className="text-xl text-green-100 max-w-2xl mx-auto">
            Free food resources across New Orleans. No ID, no signup, no
            questions asked.
          </p>
          <div className="mt-6 flex justify-center gap-4 text-sm">
            <span className="bg-green-600 px-3 py-1 rounded-full">
              {fridges.length} Community Fridges
            </span>
            <span className="bg-green-600 px-3 py-1 rounded-full">
              {pantries.length} Food Pantries
            </span>
            <span className="bg-green-600 px-3 py-1 rounded-full">
              {hotMeals.length} Hot Meal Programs
            </span>
          </div>
        </div>
      </header>

      {/* SMS Info Banner */}
      <div className="bg-blue-600 text-white text-center py-4 px-4">
        <p className="text-lg">
          <strong>Text &quot;FOOD&quot; to (coming soon)</strong> to get nearby
          resources via SMS
        </p>
        <p className="text-sm text-blue-200 mt-1">
          Works on any phone, no smartphone required
        </p>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full ${
              filter === 'all'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 border'
            }`}
          >
            All Resources
          </button>
          <button
            onClick={() => setFilter('open_now')}
            className={`px-4 py-2 rounded-full ${
              filter === 'open_now'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 border'
            }`}
          >
            Open Now
          </button>
          <button
            onClick={() => setFilter('no_requirements')}
            className={`px-4 py-2 rounded-full ${
              filter === 'no_requirements'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 border'
            }`}
          >
            No ID Required
          </button>
        </div>

        {/* Map Placeholder */}
        <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center mb-8">
          <div className="text-center text-gray-500">
            <p className="text-2xl mb-2">Map Coming Soon</p>
            <p>Interactive map with all food resources will be here</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading resources...</div>
        ) : resources.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No resources found. Please set up the database and seed data.</p>
            <Link
              href="/admin"
              className="text-green-600 hover:underline mt-2 inline-block"
            >
              Go to Admin Panel
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {/* Community Fridges */}
            {fridges.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-3xl">&#x1F9CA;</span> Community Fridges
                </h2>
                <div className="space-y-4">
                  {fridges.map((resource) => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
                </div>
              </section>
            )}

            {/* Hot Meal Programs */}
            {hotMeals.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-3xl">&#x1F372;</span> Hot Meal Programs
                </h2>
                <div className="space-y-4">
                  {hotMeals.map((resource) => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
                </div>
              </section>
            )}

            {/* Food Pantries */}
            {pantries.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-3xl">&#x1F6D2;</span> Food Pantries
                </h2>
                <div className="space-y-4">
                  {pantries.map((resource) => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
                </div>
              </section>
            )}

            {/* Mobile Distributions */}
            {mobile.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <span className="text-3xl">&#x1F69A;</span> Mobile Distributions
                </h2>
                <div className="space-y-4">
                  {mobile.map((resource) => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400 mb-4">
            Open Plate NOLA is a community resource. Help keep information
            accurate.
          </p>
          <Link
            href="/admin"
            className="text-green-400 hover:text-green-300 underline"
          >
            Volunteer to update resources
          </Link>
        </div>
      </footer>
    </div>
  );
}

function ResourceCard({ resource }: { resource: Resource }) {
  const formatHours = () => {
    if (resource.hours.is_24_7) return '24/7';
    if (!resource.hours.schedule?.length) return 'Hours vary';

    const days = resource.hours.schedule.map((s) => {
      const dayName = s.day.charAt(0).toUpperCase() + s.day.slice(1, 3);
      return `${dayName} ${s.open}-${s.close}`;
    });

    if (resource.hours.notes) {
      return resource.hours.notes;
    }

    return days.slice(0, 2).join(', ') + (days.length > 2 ? '...' : '');
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{resource.name}</h3>
          <p className="text-sm text-gray-600 mt-1">{resource.address}</p>
          {resource.neighborhood && (
            <p className="text-xs text-gray-500">{resource.neighborhood}</p>
          )}
        </div>
        <span
          className={`${STATUS_COLORS[resource.status]} text-white text-xs px-2 py-1 rounded-full`}
        >
          {STATUS_LABELS[resource.status]}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        <span className="bg-gray-100 px-2 py-1 rounded">{formatHours()}</span>
        {resource.requirements === 'none' && (
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
            No ID Required
          </span>
        )}
      </div>

      {resource.notes && (
        <p className="text-xs text-gray-500 mt-2 italic">{resource.notes}</p>
      )}

      <div className="mt-3 flex gap-2 text-sm">
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
        <a
          href={`https://maps.google.com/?q=${encodeURIComponent(resource.address)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          Directions
        </a>
      </div>
    </div>
  );
}
