'use client';

import { useState, useRef } from 'react';
import { MapPin, CheckCircle } from 'lucide-react';

interface MapEmbedProps {
  onLocationSelect?: (pinX: number, pinY: number) => void;
  selectedPin?: { x: number; y: number } | null;
  interactive?: boolean;
  height?: string;
}

export function MapEmbed({
  onLocationSelect,
  selectedPin,
  interactive = true,
  height = '200px',
}: MapEmbedProps) {
  const [hovering, setHovering] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !onLocationSelect) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    onLocationSelect(x, y);
  };

  return (
    <div
      className="relative w-full rounded-xl overflow-hidden shadow-md"
      style={{ height }}
    >
      <iframe
        src="https://www.openstreetmap.org/export/embed.html?bbox=-84.588%2C33.649%2C-84.188%2C33.849&layer=mapnik"
        className="w-full h-full border-0"
        title="Map"
        loading="lazy"
      />

      {interactive && (
        <div
          ref={overlayRef}
          className={`absolute inset-0 ${interactive ? 'cursor-crosshair' : ''}`}
          onClick={handleClick}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          {/* Pin indicator */}
          {selectedPin && (
            <div
              className="absolute pointer-events-none"
              style={{
                left: `${selectedPin.x}%`,
                top: `${selectedPin.y}%`,
                transform: 'translate(-50%, -100%)',
              }}
            >
              <div className="relative">
                <MapPin className="w-8 h-8 text-emerald-600 drop-shadow-lg" fill="#059669" />
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-emerald-600 rounded-full opacity-40 animate-ping" />
              </div>
            </div>
          )}

          {/* Overlay hint */}
          {!selectedPin && (
            <div className="absolute inset-0 flex items-end justify-center pb-3">
              <div
                className={`bg-black/60 text-white text-xs px-4 py-2 rounded-full backdrop-blur-sm flex items-center gap-1.5 transition-opacity ${hovering ? 'opacity-100' : 'opacity-80'}`}
              >
                <MapPin className="w-3 h-3" />
                Tap to set search location
              </div>
            </div>
          )}

          {/* Location confirmed indicator */}
          {selectedPin && (
            <div className="absolute top-2 right-2">
              <div className="bg-emerald-600 text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                <CheckCircle className="w-3 h-3" />
                Location set
              </div>
            </div>
          )}
        </div>
      )}

      {/* Non-interactive marker for preview */}
      {!interactive && selectedPin && (
        <div
          className="absolute pointer-events-none"
          style={{
            left: `${selectedPin.x}%`,
            top: `${selectedPin.y}%`,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <MapPin className="w-7 h-7 text-emerald-600 drop-shadow-lg" fill="#059669" />
        </div>
      )}
    </div>
  );
}
