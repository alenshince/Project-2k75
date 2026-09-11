import React, { useState, useMemo } from 'react';
import { ShieldCheck, Lock, X, Database, Search, Filter } from 'lucide-react';
import type { PlanetDossier, PlanetArchetype } from './types';
import { getAllCapturedDossiers } from './codexStore';

interface ArchivalCodexProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlanet: (index: number) => void;
}

type StatusFilter = 'ALL' | 'ARCHIVED' | 'LOCKED';

export const ArchivalCodex: React.FC<ArchivalCodexProps> = ({
  isOpen,
  onClose,
  onSelectPlanet,
}) => {
  const [selectedEntry, setSelectedEntry] = useState<PlanetDossier | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedArchetype, setSelectedArchetype] = useState<PlanetArchetype | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');

  // Load all 75 dossier records
  const rawCatalog = useMemo(() => getAllCapturedDossiers(), [isOpen]);

  // Filter catalog dynamically based on user search, archetype, and lock status
  const filteredCatalog = useMemo(() => {
    return rawCatalog.filter((planet) => {
      // 1. Text Search Filter
      const matchesQuery =
        searchQuery.trim() === '' ||
        planet.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        planet.catalogIndex.toString().includes(searchQuery.trim());

      // 2. Archetype Filter
      const matchesArchetype =
        selectedArchetype === 'ALL' || planet.archetype === selectedArchetype;

      // 3. Status Filter (Archived vs Locked)
      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'ARCHIVED' && planet.isCaptured) ||
        (statusFilter === 'LOCKED' && !planet.isCaptured);

      return matchesQuery && matchesArchetype && matchesStatus;
    });
  }, [rawCatalog, searchQuery, selectedArchetype, statusFilter]);

  if (!isOpen) return null;

  const archetypes: (PlanetArchetype | 'ALL')[] = [
    'ALL',
    'TERRESTRIAL',
    'OCEANIC',
    'GAS_GIANT',
    'CRYO',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md p-6 flex flex-col font-mono text-slate-200 select-none">
      {/* Header Bar */}
      <div className="flex justify-between items-center border-b border-cyan-500/40 pb-3">
        <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm tracking-wider">
          <Database className="w-4 h-4" />
          <span>PROJECT 2K75 // ARCHIVAL CODEX DATABASE</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-cyan-400 border border-slate-800 hover:border-cyan-400 rounded transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mt-4 p-3 bg-slate-950/80 border border-slate-800 rounded">
        {/* Search Input */}
        <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded border border-slate-700 w-72">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search designation or index..."
            className="bg-transparent text-xs text-cyan-300 placeholder-slate-500 outline-none w-full"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-slate-500 hover:text-slate-300 text-[10px]"
            >
              CLEAR
            </button>
          )}
        </div>

        {/* Archetype Filter Pills */}
        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-slate-500 mr-1" />
          {archetypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedArchetype(type)}
              className={`px-2.5 py-1 text-[10px] font-bold rounded border transition-all cursor-pointer ${
                selectedArchetype === type
                  ? 'bg-cyan-950 border-cyan-400 text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.3)]'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Status Filter Toggle */}
        <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded border border-slate-800 text-[10px]">
          {(['ALL', 'ARCHIVED', 'LOCKED'] as StatusFilter[]).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                statusFilter === status
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content: Left Grid + Right Inspector */}
      <div className="flex-1 grid grid-cols-12 gap-6 mt-4 overflow-hidden">
        {/* Left Column: Filtered Matrix Grid */}
        <div className="col-span-7 overflow-y-auto pr-2 space-y-2 max-h-[70vh]">
          {filteredCatalog.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-500 text-xs border border-dashed border-slate-800 rounded">
              <p>NO ARCHIVAL ENTRIES MATCH THE CURRENT FILTER.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedArchetype('ALL');
                  setStatusFilter('ALL');
                }}
                className="mt-2 text-cyan-400 underline text-[11px] cursor-pointer"
              >
                Reset all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-2">
              {filteredCatalog.map((planet) => {
                const isSelected = selectedEntry?.catalogIndex === planet.catalogIndex;
                return (
                  <button
                    key={planet.catalogIndex}
                    onClick={() => setSelectedEntry(planet)}
                    className={`p-2.5 rounded border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'border-cyan-400 bg-cyan-950/70 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                        : planet.isCaptured
                        ? 'border-slate-800 bg-slate-900/60 hover:border-slate-600 text-slate-300'
                        : 'border-slate-900 bg-black/50 opacity-45 text-slate-600 hover:opacity-60'
                    }`}
                  >
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="font-bold">
                        #{planet.catalogIndex.toString().padStart(2, '0')}
                      </span>
                      {planet.isCaptured ? (
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Lock className="w-3 h-3 text-slate-600" />
                      )}
                    </div>
                    <div className="text-xs font-semibold truncate mt-2">
                      {planet.isCaptured ? planet.designation : 'ENCRYPTED'}
                    </div>
                    <div className="text-[9px] text-slate-400 mt-1 uppercase">
                      {planet.isCaptured ? planet.archetype : 'LOCKED'}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Telemetry Inspector */}
        <div className="col-span-5 border border-slate-800 bg-slate-950/90 rounded p-5 flex flex-col justify-between">
          {selectedEntry ? (
            <div className="space-y-4 text-xs">
              <div className="border-b border-slate-800 pb-2">
                <div className="text-[10px] text-cyan-400 font-bold">TARGET SPECIFICATION</div>
                <div className="text-lg font-bold text-slate-100">{selectedEntry.designation}</div>
                <div className="text-[11px] text-slate-400">ARCHETYPE: {selectedEntry.archetype}</div>
              </div>

              {selectedEntry.isCaptured ? (
                <div className="space-y-3">
                  <div>
                    <span className="text-slate-400">TOPOGRAPHY:</span>
                    <p className="text-slate-200 mt-0.5">{selectedEntry.topography.description}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">ATMOSPHERIC COMPOSITION:</span>
                    <p className="text-slate-200 mt-0.5">
                      {selectedEntry.atmosphere.primaryGas} ({selectedEntry.atmosphere.primaryPercentage}%),{' '}
                      {selectedEntry.atmosphere.secondaryGas} ({selectedEntry.atmosphere.secondaryPercentage}%)
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-900/60 p-2.5 rounded border border-slate-800">
                    <div>
                      <span className="text-slate-400">ORBIT RADIUS:</span>
                      <div className="text-emerald-400 font-bold">{selectedEntry.orbitalRadiusAU} AU</div>
                    </div>
                    <div>
                      <span className="text-slate-400">SURFACE TEMP:</span>
                      <div className="text-emerald-400 font-bold">{selectedEntry.surfaceTempKelvin} K</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onSelectPlanet(selectedEntry.catalogIndex);
                      onClose();
                    }}
                    className="w-full mt-4 py-2.5 bg-cyan-950 border border-cyan-500 hover:bg-cyan-900 text-cyan-300 font-bold rounded text-xs transition-colors cursor-pointer"
                  >
                    FOCUS OPTICS ON THIS TARGET
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center space-y-2 text-slate-500">
                  <Lock className="w-8 h-8 stroke-1" />
                  <p className="text-xs font-bold text-slate-400">RECORD ENCRYPTED</p>
                  <p className="text-[10px] max-w-xs">
                    Complete optical reconnaissance shutter lock during survey rounds to extract full planetary telemetry.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-600 text-xs">
              Select a catalog index on the left to inspect archival records.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};