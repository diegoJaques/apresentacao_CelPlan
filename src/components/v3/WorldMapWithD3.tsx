import { useState, useEffect } from 'react';
import { geoPath, geoMercator } from 'd3-geo';
import { feature } from 'topojson-client';

interface Region {
  name: string;
  projects: string;
  coordinates: [number, number]; // [longitude, latitude]
}

interface WorldMapWithD3Props {
  regions: Region[];
}

export const WorldMapWithD3 = ({ regions }: WorldMapWithD3Props) => {
  const [geoData, setGeoData] = useState<any>(null);

  // Dimensions
  const width = 1000;
  const height = 500;

  // Setup projection
  const projection = geoMercator()
    .scale(90)
    .translate([width / 2, height / 2])
    .center([0, 0]);

  const pathGenerator = geoPath().projection(projection);

  // Load GeoJSON data
  useEffect(() => {
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then(response => response.json())
      .then(topology => {
        const countries = feature(topology, topology.objects.countries);
        setGeoData(countries);
      })
      .catch(error => console.error('Error loading map data:', error));
  }, []);

  // Convert coordinates to pixel positions
  const getMarkerPosition = (coordinates: [number, number]) => {
    const projected = projection(coordinates);
    return projected || [0, 0];
  };

  return (
    <div className="relative w-full h-full min-h-[400px] bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-lg overflow-hidden">
      {/* SVG Map */}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Glow filter for pins */}
          <filter id="pin-glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background */}
        <rect width={width} height={height} fill="transparent" />

        {/* Countries/Continents */}
        {geoData && geoData.features.map((feature: any, index: number) => (
          <path
            key={`country-${index}`}
            d={pathGenerator(feature) || ''}
            className="text-slate-300 dark:text-slate-700 hover:text-slate-400 dark:hover:text-slate-600 transition-colors duration-300"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth={0.5}
          />
        ))}

        {/* Markers (Pins) */}
        {regions.map((region, index) => {
          const [x, y] = getMarkerPosition(region.coordinates);

          return (
            <g
              key={region.name}
              transform={`translate(${x}, ${y})`}
            >
              {/* Pulse Circle */}
              <circle
                r={12}
                fill="#7c3aed"
                opacity={0.2}
                className="animate-ping"
                style={{ animationDelay: `${index * 0.2}s` }}
              />

              {/* Main Pin Circle */}
              <circle
                r={6}
                fill="#7c3aed"
                stroke="white"
                strokeWidth={2}
                filter="url(#pin-glow)"
              />

              {/* Inner Dot */}
              <circle r={2} fill="white" opacity={0.9} />
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg px-4 py-2 text-xs text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-brand-600 animate-pulse"></div>
          <span className="font-medium">Presença Global Ativa</span>
        </div>
      </div>

      {/* Loading state */}
      {!geoData && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Carregando mapa...</span>
          </div>
        </div>
      )}
    </div>
  );
};
