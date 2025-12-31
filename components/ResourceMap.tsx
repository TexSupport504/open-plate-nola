'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Resource, ResourceType } from '@/lib/types';
import {
  RESOURCE_TYPE_LABELS,
  STATUS_LABELS,
  REQUIREMENT_LABELS,
} from '@/lib/types';

// Fix for default marker icons in Next.js
const createIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      background-color: ${color};
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

// Icons for different resource types
const RESOURCE_ICONS: Record<ResourceType, L.DivIcon> = {
  fridge: createIcon('#3B82F6'),      // blue
  pantry: createIcon('#10B981'),       // green
  hot_meal: createIcon('#F59E0B'),     // amber
  mobile_distribution: createIcon('#8B5CF6'), // purple
};

// Icon for closed/inactive resources
const INACTIVE_ICON = createIcon('#9CA3AF'); // gray

interface ResourceMapProps {
  resources: Resource[];
  selectedId?: string | null;
  onSelectResource?: (resource: Resource) => void;
}

// Component to recenter map when resources change
function MapController({ resources }: { resources: Resource[] }) {
  const map = useMap();

  useEffect(() => {
    if (resources.length > 0) {
      const bounds = L.latLngBounds(
        resources.map((r) => [r.latitude, r.longitude])
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [resources, map]);

  return null;
}

export default function ResourceMap({
  resources,
  selectedId,
  onSelectResource,
}: ResourceMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
        <p className="text-gray-500">Loading map...</p>
      </div>
    );
  }

  // New Orleans center coordinates
  const defaultCenter: [number, number] = [29.9511, -90.0715];
  const defaultZoom = 12;

  const getIcon = (resource: Resource) => {
    if (
      resource.status === 'temporarily_closed' ||
      resource.status === 'permanently_closed'
    ) {
      return INACTIVE_ICON;
    }
    return RESOURCE_ICONS[resource.type];
  };

  const formatHours = (resource: Resource) => {
    if (resource.hours.is_24_7) return '24/7';
    if (!resource.hours.schedule?.length) {
      return resource.hours.notes || 'Hours vary';
    }

    const days = resource.hours.schedule.map((s) => {
      const dayName = s.day.charAt(0).toUpperCase() + s.day.slice(1, 3);
      return `${dayName} ${s.open}-${s.close}`;
    });

    if (resource.hours.notes) {
      return resource.hours.notes;
    }

    return days.join(', ');
  };

  return (
    <MapContainer
      center={defaultCenter}
      zoom={defaultZoom}
      className="w-full h-full"
      style={{ minHeight: '400px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapController resources={resources} />

      {resources.map((resource) => (
        <Marker
          key={resource.id}
          position={[resource.latitude, resource.longitude]}
          icon={getIcon(resource)}
          eventHandlers={{
            click: () => onSelectResource?.(resource),
          }}
        >
          <Popup>
            <div className="min-w-[200px]">
              <h3 className="font-bold text-gray-900 mb-1">{resource.name}</h3>
              <p className="text-xs text-blue-600 mb-2">
                {RESOURCE_TYPE_LABELS[resource.type]}
              </p>
              <p className="text-sm text-gray-600 mb-1">{resource.address}</p>
              {resource.neighborhood && (
                <p className="text-xs text-gray-500 mb-2">
                  {resource.neighborhood}
                </p>
              )}
              <div className="flex flex-wrap gap-1 mb-2">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    resource.status === 'operational'
                      ? 'bg-green-100 text-green-800'
                      : resource.status === 'low_stock'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {STATUS_LABELS[resource.status]}
                </span>
                {resource.requirements === 'none' && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800">
                    No ID Required
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-600 mb-2">
                <strong>Hours:</strong> {formatHours(resource)}
              </p>
              {resource.notes && (
                <p className="text-xs text-gray-500 italic mb-2">
                  {resource.notes}
                </p>
              )}
              <div className="flex gap-2 text-xs">
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
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
