import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin } from 'lucide-react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup
} from 'react-simple-maps';

interface Region {
  name: string;
  projects: string;
  coordinates: [number, number]; // [longitude, latitude]
}

interface WorldMapRealisticProps {
  regions: Region[];
}

// GeoJSON URL for world map (Natural Earth data)
const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

export const WorldMapRealistic = ({ regions }: WorldMapRealisticProps) => {
  const [hoveredRegion, setHoveredRegion] = useState<Region | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const handleMarkerEnter = (region: Region, event: React.MouseEvent) => {
    setHoveredRegion(region);
    setTooltipPosition({ x: event.clientX, y: event.clientY });
  };

  const handleMarkerLeave = () => {
    setHoveredRegion(null);
  };

  return (
    <div className="relative w-full h-full min-h-[400px] bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-lg overflow-hidden">
      {/* Map Container */}
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 147,
          center: [0, 20]
        }}
        className="w-full h-full"
      >
        <ZoomableGroup zoom={1} center={[0, 20]}>
          {/* Geographies (Countries/Continents) */}
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth={0.5}
                  className="text-slate-300 dark:text-slate-700 hover:text-slate-400 dark:hover:text-slate-600 transition-colors duration-300"
                  style={{
                    default: { outline: 'none' },
                    hover: { outline: 'none' },
                    pressed: { outline: 'none' }
                  }}
                />
              ))
            }
          </Geographies>

          {/* Markers (Pins) */}
          {regions.map((region, index) => (
            <Marker
              key={region.name}
              coordinates={region.coordinates}
              onMouseEnter={(e) => handleMarkerEnter(region, e as any)}
              onMouseLeave={handleMarkerLeave}
              style={{ cursor: 'pointer' }}
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
                className="transition-all duration-300 hover:r-8"
                filter="url(#glow)"
              />

              {/* Inner Dot */}
              <circle r={2} fill="white" opacity={0.9} />

              {/* Project Count */}
              <text
                textAnchor="middle"
                y={20}
                className="text-xs font-bold fill-current text-brand-600 dark:text-brand-400"
                style={{ fontSize: '11px', pointerEvents: 'none' }}
              >
                {region.projects}
              </text>
            </Marker>
          ))}
        </ZoomableGroup>

        {/* Glow filter definition */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </ComposableMap>

      {/* Tooltip */}
      <AnimatePresence>
        {hoveredRegion && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.2 }}
            className="fixed z-50 bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-4 border border-brand-200 dark:border-brand-500/30 min-w-[200px] pointer-events-none"
            style={{
              left: `${tooltipPosition.x + 15}px`,
              top: `${tooltipPosition.y + 15}px`,
              backdropFilter: 'blur(10px)',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-5 h-5 text-brand-600" />
              <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                {hoveredRegion.name}
              </h4>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-brand-600 dark:text-brand-400">
                {hoveredRegion.projects}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                projetos
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              Média e alta complexidade
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg px-4 py-2 text-xs text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-brand-600 animate-pulse"></div>
          <span className="font-medium">Presença Global Ativa</span>
        </div>
      </div>

      {/* Controls Info */}
      <div className="absolute top-4 right-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <MapPin className="w-3 h-3" />
          <span>Passe o mouse sobre os pins</span>
        </div>
      </div>
    </div>
  );
};
