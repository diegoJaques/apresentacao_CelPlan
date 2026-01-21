import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

interface Region {
  name: string;
  projects: string;
  x: number; // Posição X do pin (0-100%)
  y: number; // Posição Y do pin (0-100%)
  continent: string; // Identificador do continente
}

interface WorldMapSVGProps {
  regions: Region[];
}

export const WorldMapSVG = ({ regions }: WorldMapSVGProps) => {
  const [hoveredRegion, setHoveredRegion] = useState<Region | null>(null);

  return (
    <div className="relative w-full h-full min-h-[400px]">
      {/* SVG Map */}
      <svg
        viewBox="0 0 1000 500"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
          </linearGradient>

          {/* Glow filter para pins */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background */}
        <rect width="1000" height="500" fill="url(#mapGradient)" opacity="0.3" />

        {/* Grid lines (opcional - para dar contexto de mapa) */}
        <g stroke="currentColor" strokeWidth="0.5" opacity="0.1" className="text-slate-400 dark:text-neutral-600">
          {/* Linhas horizontais */}
          <line x1="0" y1="125" x2="1000" y2="125" />
          <line x1="0" y1="250" x2="1000" y2="250" />
          <line x1="0" y1="375" x2="1000" y2="375" />
          {/* Linhas verticais */}
          <line x1="250" y1="0" x2="250" y2="500" />
          <line x1="500" y1="0" x2="500" y2="500" />
          <line x1="750" y1="0" x2="750" y2="500" />
        </g>

        {/* Continentes Simplificados */}
        <g className="continents text-slate-300 dark:text-slate-700" fill="currentColor" opacity="0.4">
          {/* América do Norte */}
          <path d="M 80 80 Q 120 60, 180 70 L 200 90 Q 210 110, 190 130 L 160 140 Q 140 135, 120 120 L 100 110 Z" />

          {/* América do Sul */}
          <path d="M 200 200 Q 220 180, 240 200 L 250 250 Q 245 280, 230 300 L 210 290 Q 195 270, 195 240 Z" />

          {/* Europa */}
          <path d="M 480 90 Q 520 80, 560 95 L 570 120 Q 565 140, 540 145 L 510 140 Q 485 130, 475 110 Z" />

          {/* África */}
          <path d="M 500 170 Q 540 160, 570 180 L 580 240 Q 570 280, 540 300 L 510 290 Q 490 260, 495 210 Z" />

          {/* Ásia */}
          <path d="M 600 70 Q 700 60, 800 90 L 820 150 Q 810 180, 770 200 L 700 190 Q 650 170, 620 130 Z" />

          {/* Oceania */}
          <path d="M 800 320 Q 840 310, 870 330 L 875 360 Q 865 380, 840 380 L 820 370 Q 805 355, 805 335 Z" />
        </g>

        {/* Pins nos Continentes */}
        {regions.map((region, index) => (
          <g
            key={region.name}
            transform={`translate(${region.x * 10}, ${region.y * 5})`}
            onMouseEnter={() => setHoveredRegion(region)}
            onMouseLeave={() => setHoveredRegion(null)}
            className="cursor-pointer"
          >
            {/* Pulse animation circle */}
            <circle
              cx="0"
              cy="0"
              r="12"
              fill="#7c3aed"
              opacity="0.2"
              className="animate-ping"
              style={{ animationDelay: `${index * 0.2}s` }}
            />

            {/* Pin base */}
            <circle
              cx="0"
              cy="0"
              r="8"
              fill="#7c3aed"
              filter="url(#glow)"
              className="transition-all duration-300 hover:r-10"
            />

            {/* Pin inner */}
            <circle
              cx="0"
              cy="0"
              r="4"
              fill="white"
              opacity="0.9"
            />

            {/* Número de projetos */}
            <text
              x="0"
              y="25"
              textAnchor="middle"
              className="text-xs font-bold fill-current text-brand-600 dark:text-brand-400"
              style={{ fontSize: '14px' }}
            >
              {region.projects}
            </text>
          </g>
        ))}

        {/* Linhas conectando continentes (efeito de rede global) */}
        <g stroke="#7c3aed" strokeWidth="1" opacity="0.15" strokeDasharray="5,5">
          <line x1="150" y1="100" x2="500" y2="100" />
          <line x1="220" y1="250" x2="520" y2="220" />
          <line x1="540" y1="120" x2="700" y2="120" />
          <line x1="560" y1="240" x2="700" y2="180" />
          <line x1="770" y1="180" x2="840" y2="350" />
        </g>
      </svg>

      {/* Tooltip Card */}
      {hoveredRegion && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          transition={{ duration: 0.2 }}
          className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-4 border border-brand-200 dark:border-brand-500/30 min-w-[200px] z-50"
          style={{
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

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg px-4 py-2 text-xs text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-brand-600 animate-pulse"></div>
          <span>Presença Global Ativa</span>
        </div>
      </div>
    </div>
  );
};
