import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, ArrowRight, Compass, ZoomIn, ZoomOut } from 'lucide-react';
import { GalaxyNode } from '../../types';
import { audioEngine } from '../../utils/audioEngine';

interface Scene4GalaxyProps {
  nodes: GalaxyNode[];
  onProceed: () => void;
}

export const Scene4Galaxy: React.FC<Scene4GalaxyProps> = ({ nodes, onProceed }) => {
  const [selectedNode, setSelectedNode] = useState<GalaxyNode | null>(null);
  const [viewedCount, setViewedCount] = useState<number>(0);
  const [rotation, setRotation] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(1);
  const isDraggingRef = useRef<boolean>(false);
  const startXRef = useRef<number>(0);

  // Auto slow rotation of galaxy
  useEffect(() => {
    let animId: number;
    const loop = () => {
      if (!isDraggingRef.current) {
        setRotation(prev => (prev + 0.15) % 360);
      }
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - startXRef.current;
    setRotation(prev => prev + dx * 0.4);
    startXRef.current = e.clientX;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleSelectNode = (node: GalaxyNode) => {
    audioEngine.playClick();
    setSelectedNode(node);
    setViewedCount(prev => prev + 1);
  };

  return (
    <div
      className="relative min-h-screen w-full flex flex-col items-center justify-between p-4 sm:p-8 select-none z-10 overflow-hidden font-sans"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={(e) => {
        isDraggingRef.current = true;
        startXRef.current = e.touches[0].clientX;
      }}
      onTouchMove={(e) => {
        if (!isDraggingRef.current) return;
        const dx = e.touches[0].clientX - startXRef.current;
        setRotation(prev => prev + dx * 0.4);
        startXRef.current = e.touches[0].clientX;
      }}
      onTouchEnd={() => { isDraggingRef.current = false; }}
    >
      {/* Top Header */}
      <div className="pt-10 sm:pt-12 text-center max-w-xl mx-auto z-20 pointer-events-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-xs font-mono tracking-widest uppercase mb-2">
          <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '10s' }} />
          <span>Interactive Memory Galaxy</span>
        </div>
        <h2 className="font-cinzel text-2xl sm:text-3xl text-zinc-100 font-bold tracking-wide">
          Explore The Celestial System
        </h2>
        <p className="text-xs text-zinc-400 font-sans tracking-wide mt-1">
          Drag to rotate orbit • Click planets to inspect data memories ({viewedCount} scanned)
        </p>

        {/* Zoom Controls */}
        <div className="flex items-center justify-center gap-2 mt-3">
          <button
            onClick={() => setZoom(prev => Math.min(1.4, prev + 0.15))}
            className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom(prev => Math.max(0.75, prev - 0.15))}
            className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Galaxy Core Stage */}
      <div
        className="relative flex-1 w-full max-w-4xl mx-auto flex items-center justify-center transition-transform duration-200 cursor-grab active:cursor-grabbing"
        style={{ transform: `scale(${zoom})` }}
      >
        {/* Central Black Hole / Sun */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-amber-400 via-orange-500 to-yellow-200 flex items-center justify-center shadow-[0_0_60px_rgba(251,191,36,0.8)] z-10 animate-pulse">
          <div className="absolute inset-0 rounded-full bg-white/40 blur-sm" />
          <span className="relative font-cinzel text-[11px] sm:text-xs font-black text-black tracking-widest uppercase">
            CHAPTER 21
          </span>
        </div>

        {/* Orbits and Planets */}
        {nodes.map((node, idx) => {
          const currentAngleRad = ((rotation * node.orbitSpeed * 80 + node.initialAngle * (180 / Math.PI)) * Math.PI) / 180;
          const x = Math.cos(currentAngleRad) * node.orbitRadius;
          const y = Math.sin(currentAngleRad) * node.orbitRadius * 0.75; // isometric slant

          return (
            <React.Fragment key={node.id}>
              {/* Elliptical Orbit Path */}
              <div
                className="absolute rounded-full border border-dashed border-zinc-800 pointer-events-none"
                style={{
                  width: `${node.orbitRadius * 2}px`,
                  height: `${node.orbitRadius * 1.5}px`
                }}
              />

              {/* Planet Body */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectNode(node);
                }}
                className="absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                style={{
                  transform: `translate(${x}px, ${y}px)`
                }}
              >
                {/* Planet visual aura */}
                <div
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 transition-transform duration-300 group-hover:scale-130 shadow-lg flex items-center justify-center relative overflow-hidden"
                  style={{
                    backgroundColor: node.color,
                    borderColor: '#ffffff88',
                    boxShadow: `0 0 25px ${node.color}99`
                  }}
                >
                  <span className="text-xs">
                    {node.type === 'memory' ? '🌍' : node.type === 'photo' ? '⭐' : node.type === 'funny' ? '☄️' : '🌙'}
                  </span>
                </div>

                {/* Planet Label Tooltip */}
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 whitespace-nowrap opacity-80 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-black/80 border border-zinc-700 text-zinc-200">
                    {node.name}
                  </span>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Bottom Continue Action */}
      <div className="pb-8 z-20 pointer-events-auto text-center">
        <button
          id="btn-galaxy-continue"
          onClick={() => {
            audioEngine.playTransition();
            onProceed();
          }}
          className="px-8 py-3.5 rounded-full bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 hover:border-cyan-300 text-cyan-200 font-cinzel text-xs tracking-[0.25em] uppercase transition-all duration-300 shadow-[0_0_30px_rgba(6,182,212,0.3)] flex items-center gap-2 cursor-pointer"
        >
          <span>Deep Space Transit</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Planet Modal Details */}
      <AnimatePresence>
        {selectedNode && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setSelectedNode(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg bg-zinc-950 border border-cyan-500/40 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.4)] flex flex-col"
            >
              <div className="relative h-48 sm:h-56 w-full bg-zinc-900 overflow-hidden">
                <img
                  src={selectedNode.image}
                  alt={selectedNode.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
                <button
                  onClick={() => setSelectedNode(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/70 text-zinc-300 hover:text-white border border-zinc-700"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-3 left-4 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-mono">
                  {selectedNode.name} • {selectedNode.date}
                </div>
              </div>

              <div className="p-6 space-y-3 font-sans">
                <h3 className="font-cinzel text-xl text-zinc-100 font-bold">
                  {selectedNode.title}
                </h3>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  {selectedNode.description}
                </p>
                {selectedNode.funnyNote && (
                  <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 font-mono text-xs text-amber-200">
                    <span className="font-bold text-amber-400">UNOFFICIAL LOG: </span>
                    {selectedNode.funnyNote}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
