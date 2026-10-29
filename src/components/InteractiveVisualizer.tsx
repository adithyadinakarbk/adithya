/**
 * @license
 * Academic Precision OBE System
 * Futuristic Interactive Visualizations:
 * 1. 3D Holographic Bloom's Cognitive Pyramid
 * 2. Vector PO Attainment Radar & Spider Chart
 * 3. 15-Week Instructional & Assessment Timeline
 */

import React, { useState } from 'react';
import { CourseSpecification } from '../types.ts';
import { bloomsLevels, programOutcomes, getBloomsLevel } from '../annexureA.ts';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Layers, 
  Target, 
  Calendar, 
  Info, 
  CheckCircle2, 
  Activity,
  Flame,
  Zap
} from 'lucide-react';

interface VisualizerProps {
  course: CourseSpecification;
  onSelectCO?: (code: string) => void;
}

export const InteractiveVisualizer: React.FC<VisualizerProps> = ({ course, onSelectCO }) => {
  const [activeVisualizer, setActiveVisualizer] = useState<'pyramid' | 'radar' | 'timeline'>('pyramid');
  const [selectedBloomsLevel, setSelectedBloomsLevel] = useState<string | null>('L4');
  const [hoveredPOIndex, setHoveredPOIndex] = useState<number | null>(null);

  // Compute Bloom counts
  const bloomsCounts: Record<string, number> = {};
  course.courseOutcomes.forEach(co => {
    bloomsCounts[co.bloomsLevel] = (bloomsCounts[co.bloomsLevel] || 0) + 1;
  });

  // Calculate PO stats for Radar chart
  const poStats = programOutcomes.map((po, idx) => {
    let sum = 0;
    let count = 0;
    course.courseOutcomes.forEach(co => {
      const val = course.poMapping[co.code]?.[po.code] || 0;
      if (val > 0) {
        sum += val;
        count++;
      }
    });
    const avg = count > 0 ? sum / count : 0;
    return {
      po,
      index: idx,
      target: po.targetAttainment,
      actual: avg
    };
  });

  // Radar chart geometry calculations (12 axes for PO1-PO12)
  const centerX = 200;
  const centerY = 200;
  const maxRadius = 140;
  const totalAxes = programOutcomes.length;

  const getCoordinates = (index: number, value: number, maxVal = 3.0) => {
    const angle = (Math.PI * 2 / totalAxes) * index - Math.PI / 2;
    const r = (value / maxVal) * maxRadius;
    const x = centerX + r * Math.cos(angle);
    const y = centerY + r * Math.sin(angle);
    return { x, y, angle };
  };

  // Generate SVG polygon points for Actual Attainment
  const actualPolygonPoints = poStats
    .map((s, i) => {
      const coords = getCoordinates(i, s.actual);
      return `${coords.x},${coords.y}`;
    })
    .join(' ');

  // Generate SVG polygon points for Target Attainment
  const targetPolygonPoints = poStats
    .map((s, i) => {
      const coords = getCoordinates(i, s.target);
      return `${coords.x},${coords.y}`;
    })
    .join(' ');

  const selectedLevelObj = bloomsLevels.find(b => b.level === selectedBloomsLevel);
  const matchingCOs = course.courseOutcomes.filter(c => c.bloomsLevel === selectedBloomsLevel);

  return (
    <div className="bg-white border border-[#CBD5E1] rounded-lg p-6 shadow-xs space-y-6 overflow-hidden">
      
      {/* Top Visualizer Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-gradient-to-tr from-[#1E3A5F] to-[#0F9D8A] flex items-center justify-center text-white shadow-xs">
            <Zap className="w-4 h-4 text-[#80F3DD]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-[#1F2937] font-heading">
                Interactive OBE Cognitive & Radar Telemetry
              </h3>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#CCFBF1] text-[#006B5D] font-bold">
                LIVE VISUALS
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Interactive 3D-stacked taxonomy pyramid, PO attainment radar, and 15-week timeline.
            </p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex rounded border border-[#CBD5E1] p-0.5 bg-[#F8FAFC]">
          <button
            type="button"
            onClick={() => setActiveVisualizer('pyramid')}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition-all flex items-center gap-1.5 ${
              activeVisualizer === 'pyramid'
                ? 'bg-[#1E3A5F] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-[#0F9D8A]" />
            Cognitive Pyramid
          </button>
          <button
            type="button"
            onClick={() => setActiveVisualizer('radar')}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition-all flex items-center gap-1.5 ${
              activeVisualizer === 'radar'
                ? 'bg-[#1E3A5F] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Target className="w-3.5 h-3.5 text-[#0F9D8A]" />
            PO Radar Chart
          </button>
          <button
            type="button"
            onClick={() => setActiveVisualizer('timeline')}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition-all flex items-center gap-1.5 ${
              activeVisualizer === 'timeline'
                ? 'bg-[#1E3A5F] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-[#0F9D8A]" />
            15-Week Timeline
          </button>
        </div>
      </div>

      {/* VIEW 1: 3D Holographic Bloom's Cognitive Pyramid */}
      {activeVisualizer === 'pyramid' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Stepped Interactive Pyramid */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center space-y-2 py-4">
            <span className="text-[11px] font-mono text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Higher Order Cognitive Domains (L4 - L6)
            </span>

            {/* Render levels backwards L6 (top) down to L1 (base) */}
            {[...bloomsLevels].reverse().map((bl, i) => {
              const count = bloomsCounts[bl.level] || 0;
              const isSelected = selectedBloomsLevel === bl.level;
              // Width scales from 45% (L6) to 98% (L1)
              const widthPercents = ['48%', '58%', '68%', '78%', '88%', '98%'];
              const width = widthPercents[i];

              return (
                <motion.button
                  key={bl.level}
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setSelectedBloomsLevel(bl.level)}
                  style={{
                    width,
                    backgroundColor: isSelected ? bl.color : bl.badgeBg,
                    borderColor: bl.color,
                    color: isSelected ? '#FFFFFF' : bl.color
                  }}
                  className={`h-11 px-4 rounded border-2 font-medium shadow-xs transition-all flex items-center justify-between text-xs cursor-pointer relative overflow-hidden group ${
                    isSelected ? 'ring-2 ring-offset-2 ring-[#0F9D8A]' : 'hover:border-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2 z-10">
                    <span className="font-mono font-bold text-sm tracking-tight">{bl.level}</span>
                    <span className="font-bold text-xs uppercase tracking-wider">{bl.name}</span>
                    <span className={`text-[10px] hidden sm:inline ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>
                      • {bl.cognitiveDomain}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 z-10">
                    <span className={`px-2 py-0.5 rounded font-mono font-bold text-xs ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-white text-slate-800 border border-[#CBD5E1]'
                    }`}>
                      {count} {count === 1 ? 'CO' : 'COs'}
                    </span>
                  </div>
                </motion.button>
              );
            })}

            <span className="text-[11px] font-mono text-slate-500 uppercase tracking-widest mt-1">
              Foundational Cognitive Retrieval (L1 - L2)
            </span>
          </div>

          {/* Right Inspection Card for Selected Bloom's Tier */}
          <div className="lg:col-span-5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg p-5 space-y-4">
            {selectedLevelObj && (
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: selectedLevelObj.color }}
                    />
                    <h4 className="text-sm font-bold text-[#1F2937] font-heading">
                      {selectedLevelObj.level}: {selectedLevelObj.name}
                    </h4>
                  </div>
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-white border border-[#CBD5E1] text-[#1E3A5F]">
                    {bloomsCounts[selectedLevelObj.level] || 0} Outcomes Mapped
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mt-3">
                  {selectedLevelObj.description}
                </p>

                {/* Action Verbs from config/po_pso.json */}
                <div className="mt-4 pt-3 border-t border-[#E2E8F0]">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                    Accredited Action Verbs (config/po_pso.json):
                  </span>
                  <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
                    {selectedLevelObj.actionVerbs.map(v => (
                      <span
                        key={v}
                        className="px-2 py-0.5 text-[11px] bg-white border border-[#CBD5E1] text-[#1E3A5F] rounded font-medium"
                      >
                        {v}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Associated Outcomes in Course */}
                <div className="mt-4 pt-3 border-t border-[#E2E8F0]">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                    Course Outcomes at this Level:
                  </span>
                  {matchingCOs.length > 0 ? (
                    <div className="space-y-1.5">
                      {matchingCOs.map(co => (
                        <div
                          key={co.id}
                          className="p-2 bg-white border border-[#E2E8F0] rounded text-xs flex items-center justify-between gap-2"
                        >
                          <span className="font-mono font-bold text-[#1E3A5F] shrink-0">{co.code}</span>
                          <span className="truncate text-slate-700 text-[11px]">{co.statement}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-amber-700 bg-amber-50 p-2 rounded border border-amber-200">
                      No outcomes currently targeting {selectedLevelObj.level}. Consider adding one to enhance taxonomy balance.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      {/* VIEW 2: Vector PO Attainment Radar & Spider Chart */}
      {activeVisualizer === 'radar' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left SVG Radar Canvas */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center p-2">
            <div className="relative">
              <svg width="400" height="400" className="overflow-visible select-none">
                {/* Concentric Web Rings (Levels 1.0, 2.0, 3.0) */}
                {[1.0, 2.0, 3.0].map(val => (
                  <circle
                    key={val}
                    cx={centerX}
                    cy={centerY}
                    r={(val / 3.0) * maxRadius}
                    fill="none"
                    stroke="#E2E8F0"
                    strokeWidth="1"
                    strokeDasharray={val === 3.0 ? '0' : '4 4'}
                  />
                ))}

                {/* Level Value Labels */}
                <text x={centerX + 4} y={centerY - (1.0 / 3.0) * maxRadius - 2} className="text-[9px] fill-slate-400 font-mono">1.0</text>
                <text x={centerX + 4} y={centerY - (2.0 / 3.0) * maxRadius - 2} className="text-[9px] fill-slate-400 font-mono">2.0</text>
                <text x={centerX + 4} y={centerY - maxRadius - 2} className="text-[9px] fill-slate-400 font-mono">3.0 (Max)</text>

                {/* Spoke lines */}
                {poStats.map((s, idx) => {
                  const edge = getCoordinates(idx, 3.0);
                  const isHovered = hoveredPOIndex === idx;
                  return (
                    <g key={s.po.code}>
                      <line
                        x1={centerX}
                        y1={centerY}
                        x2={edge.x}
                        y2={edge.y}
                        stroke={isHovered ? '#0F9D8A' : '#CBD5E1'}
                        strokeWidth={isHovered ? '2' : '1'}
                      />
                      {/* PO Label */}
                      <text
                        x={edge.x + (edge.x > centerX ? 10 : -24)}
                        y={edge.y + (edge.y > centerY ? 12 : -6)}
                        className={`text-[10px] font-mono font-bold cursor-pointer transition-colors ${
                          isHovered ? 'fill-[#0F9D8A] font-extrabold text-[12px]' : 'fill-[#1E3A5F]'
                        }`}
                        onMouseEnter={() => setHoveredPOIndex(idx)}
                        onMouseLeave={() => setHoveredPOIndex(null)}
                      >
                        {s.po.code}
                      </text>
                    </g>
                  );
                })}

                {/* Target Attainment Polygon (Dashed Navy) */}
                <polygon
                  points={targetPolygonPoints}
                  fill="rgba(30, 58, 95, 0.08)"
                  stroke="#1E3A5F"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />

                {/* Actual Attainment Polygon (Glowing Teal) */}
                <polygon
                  points={actualPolygonPoints}
                  fill="rgba(15, 157, 138, 0.28)"
                  stroke="#0F9D8A"
                  strokeWidth="2.5"
                />

                {/* Attainment Nodes */}
                {poStats.map((s, idx) => {
                  const pt = getCoordinates(idx, s.actual);
                  const isHovered = hoveredPOIndex === idx;
                  return (
                    <circle
                      key={s.po.code}
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered ? 6 : 4}
                      fill={isHovered ? '#80F3DD' : '#0F9D8A'}
                      stroke="#FFFFFF"
                      strokeWidth="2"
                      className="cursor-pointer transition-all"
                      onMouseEnter={() => setHoveredPOIndex(idx)}
                      onMouseLeave={() => setHoveredPOIndex(null)}
                    />
                  );
                })}
              </svg>
            </div>

            {/* Radar Legend */}
            <div className="flex items-center gap-6 text-xs pt-3">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 bg-[#0F9D8A] rounded" />
                <span className="font-semibold text-slate-700">Course Outcome Attainment (Actual)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-1 border-t-2 border-dashed border-[#1E3A5F]" />
                <span className="font-semibold text-slate-700">NBA Target Threshold</span>
              </div>
            </div>
          </div>

          {/* Right Inspection Info Card */}
          <div className="lg:col-span-5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg p-5 space-y-4">
            <div>
              <h4 className="text-sm font-bold text-[#1F2937] font-heading pb-2 border-b border-[#E2E8F0] flex items-center justify-between">
                <span>Program Outcome Telemetry</span>
                <span className="text-xs font-mono text-slate-500">12 POs Audited</span>
              </h4>

              {hoveredPOIndex !== null ? (
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 bg-[#1E3A5F] text-white font-mono font-bold rounded text-xs">
                      {poStats[hoveredPOIndex].po.code}
                    </span>
                    <span className="text-xs font-medium text-slate-600">
                      {poStats[hoveredPOIndex].po.category}
                    </span>
                  </div>
                  <h5 className="text-xs font-bold text-[#1F2937]">
                    {poStats[hoveredPOIndex].po.title}
                  </h5>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {poStats[hoveredPOIndex].po.description}
                  </p>

                  <div className="pt-2 border-t border-[#E2E8F0] grid grid-cols-2 gap-2 text-center text-xs">
                    <div className="p-2 bg-white rounded border border-[#E2E8F0]">
                      <span className="text-[10px] text-slate-500 uppercase block">Actual Score</span>
                      <span className="font-mono font-bold text-sm text-[#0F9D8A] tabular-nums">
                        {poStats[hoveredPOIndex].actual.toFixed(2)} / 3.0
                      </span>
                    </div>
                    <div className="p-2 bg-white rounded border border-[#E2E8F0]">
                      <span className="text-[10px] text-slate-500 uppercase block">Target Attainment</span>
                      <span className="font-mono font-bold text-sm text-[#1E3A5F] tabular-nums">
                        {poStats[hoveredPOIndex].target.toFixed(2)} / 3.0
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-4 p-4 text-center text-xs text-slate-500 italic">
                  Hover over any node or PO axis label on the radar chart to inspect graduate attribute attainment and category alignment.
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* VIEW 3: 15-Week Instructional Timeline */}
      {activeVisualizer === 'timeline' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-600 pb-2">
            <span>15-Week Autonomous Instructional Roadmap & Assessment Milestones</span>
            <span className="font-mono font-bold text-[#0F9D8A]">{course.totalContactHours} Contact Hours Delivered</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {/* Week Blocks */}
            <div className="p-3 bg-[#F8FAFC] border border-[#CBD5E1] rounded text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#1E3A5F]">Weeks 1 — 3</span>
                <span className="px-1.5 py-0.2 bg-[#D5E3FF] text-[#1E3A5F] rounded font-mono text-[10px] font-bold">Unit I</span>
              </div>
              <p className="text-[11px] text-slate-700">Asymptotic analysis, Recurrence trees, Master Theorem.</p>
              <div className="text-[10px] text-[#006B5D] bg-[#CCFBF1] p-1.5 rounded">
                ⚡ Quiz 1 & Proof Workshop
              </div>
            </div>

            <div className="p-3 bg-[#F8FAFC] border border-[#CBD5E1] rounded text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#1E3A5F]">Weeks 4 — 6</span>
                <span className="px-1.5 py-0.2 bg-[#D5E3FF] text-[#1E3A5F] rounded font-mono text-[10px] font-bold">Unit II</span>
              </div>
              <p className="text-[11px] text-slate-700">Divide-and-conquer, Strassen multiplication, Greedy scheduling.</p>
              <div className="text-[10px] text-purple-700 bg-purple-50 p-1.5 rounded font-medium">
                🏆 Continuous Assessment Test 1 (CAT-I)
              </div>
            </div>

            <div className="p-3 bg-[#F8FAFC] border border-[#CBD5E1] rounded text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#1E3A5F]">Weeks 7 — 9</span>
                <span className="px-1.5 py-0.2 bg-[#D5E3FF] text-[#1E3A5F] rounded font-mono text-[10px] font-bold">Unit III</span>
              </div>
              <p className="text-[11px] text-slate-700">Dynamic programming, Graph network flows, Matrix chain mult.</p>
              <div className="text-[10px] text-amber-700 bg-amber-50 p-1.5 rounded">
                💡 Term Project Milestone 1
              </div>
            </div>

            <div className="p-3 bg-[#F8FAFC] border border-[#CBD5E1] rounded text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#1E3A5F]">Weeks 10 — 12</span>
                <span className="px-1.5 py-0.2 bg-[#D5E3FF] text-[#1E3A5F] rounded font-mono text-[10px] font-bold">Unit IV</span>
              </div>
              <p className="text-[11px] text-slate-700">Intractability proofs, 3-SAT reductions, NP-Completeness.</p>
              <div className="text-[10px] text-purple-700 bg-purple-50 p-1.5 rounded font-medium">
                🏆 Continuous Assessment Test 2 (CAT-II)
              </div>
            </div>

            <div className="p-3 bg-[#EFF4FF] border border-[#ADC8F5] rounded text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#1E3A5F]">Weeks 13 — 15</span>
                <span className="px-1.5 py-0.2 bg-[#1E3A5F] text-white rounded font-mono text-[10px] font-bold">Unit V</span>
              </div>
              <p className="text-[11px] text-slate-700">Approximation heuristics, Branch-and-bound, Revision.</p>
              <div className="text-[10px] text-emerald-800 bg-emerald-100 p-1.5 rounded font-bold">
                🎓 Final Semester Exam (SEE)
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
