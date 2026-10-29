/**
 * @license
 * Academic Precision OBE System
 * PO & PSO Articulation Mapping Matrix Screen
 * All headers, descriptions, target attainments, and tooltips are strictly loaded from config/po_pso.json
 * Enhanced with interactive hover crosshairs, correlation filtering, and AI Auto-Alignment
 */

import React, { useState } from 'react';
import { CourseSpecification, UserRole } from '../types.ts';
import { RolePermissions } from '../permissions.ts';
import { programOutcomes, programSpecificOutcomes, correlationScale, getBloomsLevel } from '../annexureA.ts';
import { motion } from 'motion/react';
import { 
  Table, 
  HelpCircle, 
  Info, 
  AlertTriangle, 
  CheckCircle, 
  FileText, 
  Sparkles, 
  RefreshCw,
  Plus,
  Filter,
  Wand2,
  TrendingUp
} from 'lucide-react';

interface MatrixScreenProps {
  course: CourseSpecification;
  onUpdateCourse: (updated: CourseSpecification) => void;
  currentRole: UserRole;
  permissions: RolePermissions;
  onOpenAnnexure: () => void;
}

export const MatrixScreen: React.FC<MatrixScreenProps> = ({
  course,
  onUpdateCourse,
  currentRole,
  permissions,
  onOpenAnnexure
}) => {
  const [activeTab, setActiveTab] = useState<'po' | 'pso'>('po');
  const [activeHoverPO, setActiveHoverPO] = useState<string | null>(null);
  const [activeHoverPSO, setActiveHoverPSO] = useState<string | null>(null);
  const [hoveredCOCode, setHoveredCOCode] = useState<string | null>(null);
  const [selectedJustificationKey, setSelectedJustificationKey] = useState<string | null>('CO1-PO1');
  const [filterLevel, setFilterLevel] = useState<number | 'all'>('all');
  const [isAutoAligning, setIsAutoAligning] = useState(false);

  // Cycle correlation 0 -> 1 -> 2 -> 3 -> 0
  const handleTogglePOCell = (coCode: string, poCode: string) => {
    if (!permissions.canEditMatrix) return;
    const current = course.poMapping[coCode]?.[poCode] || 0;
    const nextVal = (current + 1) % 4;

    const newPOMapping = {
      ...course.poMapping,
      [coCode]: {
        ...(course.poMapping[coCode] || {}),
        [poCode]: nextVal
      }
    };

    onUpdateCourse({
      ...course,
      poMapping: newPOMapping,
      lastUpdated: new Date().toISOString().split('T')[0]
    });
  };

  const handleTogglePSOCell = (coCode: string, psoCode: string) => {
    if (!permissions.canEditMatrix) return;
    const current = course.psoMapping[coCode]?.[psoCode] || 0;
    const nextVal = (current + 1) % 4;

    const newPSOMapping = {
      ...course.psoMapping,
      [coCode]: {
        ...(course.psoMapping[coCode] || {}),
        [psoCode]: nextVal
      }
    };

    onUpdateCourse({
      ...course,
      psoMapping: newPSOMapping,
      lastUpdated: new Date().toISOString().split('T')[0]
    });
  };

  const handleUpdateJustification = (key: string, text: string) => {
    if (!permissions.canEditMatrix) return;
    onUpdateCourse({
      ...course,
      mappingJustifications: {
        ...course.mappingJustifications,
        [key]: text
      },
      lastUpdated: new Date().toISOString().split('T')[0]
    });
  };

  // AI Auto-Align Articulation Matrix based on outcome statements and Bloom levels
  const handleAIAutoAlign = () => {
    if (!permissions.canEditMatrix) return;
    setIsAutoAligning(true);

    setTimeout(() => {
      const newPoMapping: Record<string, Record<string, number>> = {};
      const newPsoMapping: Record<string, Record<string, number>> = {};
      const newJustifications: Record<string, string> = { ...course.mappingJustifications };

      course.courseOutcomes.forEach((co) => {
        newPoMapping[co.code] = {};
        newPsoMapping[co.code] = {};

        programOutcomes.forEach((po) => {
          let score = 0;
          // Knowledge / Analysis outcomes map strongly to PO1 & PO2
          if (['PO1', 'PO2'].includes(po.code)) {
            score = ['L1', 'L2'].includes(co.bloomsLevel) ? 3 : 2;
          }
          // Design / Investigation map to L3 - L6
          if (['PO3', 'PO4'].includes(po.code) && ['L3', 'L4', 'L5', 'L6'].includes(co.bloomsLevel)) {
            score = 3;
          }
          if (po.code === 'PO5' && ['L3', 'L4', 'L6'].includes(co.bloomsLevel)) {
            score = 2;
          }
          if (po.code === 'PO12') {
            score = 2;
          }
          if (po.code === 'PO10') {
            score = 1;
          }

          newPoMapping[co.code][po.code] = score;

          if (score === 3 && !newJustifications[`${co.code}-${po.code}`]) {
            newJustifications[`${co.code}-${po.code}`] = `${co.code} addresses ${po.title} through rigorous ${co.actionVerb.toLowerCase()} assignments.`;
          }
        });

        // PSOs
        programSpecificOutcomes.forEach(pso => {
          newPsoMapping[co.code][pso.code] = pso.code === 'PSO1' ? 3 : 2;
        });
      });

      onUpdateCourse({
        ...course,
        poMapping: newPoMapping,
        psoMapping: newPsoMapping,
        mappingJustifications: newJustifications,
        lastUpdated: new Date().toISOString().split('T')[0]
      });
      setIsAutoAligning(false);
    }, 600);
  };

  // Compute PO column averages
  const poColumnStats = programOutcomes.map(po => {
    let sum = 0;
    let count = 0;
    course.courseOutcomes.forEach(co => {
      const val = course.poMapping[co.code]?.[po.code] || 0;
      if (val > 0) {
        sum += val;
        count++;
      }
    });
    const avg = count > 0 ? (sum / count) : 0;
    return {
      po,
      sum,
      count,
      avg: avg > 0 ? avg.toFixed(2) : '-'
    };
  });

  // Compute PSO column averages
  const psoColumnStats = programSpecificOutcomes.map(pso => {
    let sum = 0;
    let count = 0;
    course.courseOutcomes.forEach(co => {
      const val = course.psoMapping[co.code]?.[pso.code] || 0;
      if (val > 0) {
        sum += val;
        count++;
      }
    });
    const avg = count > 0 ? (sum / count) : 0;
    return {
      pso,
      sum,
      count,
      avg: avg > 0 ? avg.toFixed(2) : '-'
    };
  });

  // Active hover info object
  const hoveredPOObj = programOutcomes.find(p => p.code === activeHoverPO);
  const hoveredPSOObj = programSpecificOutcomes.find(p => p.code === activeHoverPSO);

  return (
    <div className="space-y-6">
      
      {/* Matrix Controls & Tab Header */}
      <div className="bg-white border border-[#CBD5E1] rounded-lg p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#1F2937] font-heading">
                Outcome Articulation Mapping Matrix
              </h2>
              <span className="text-xs font-mono font-bold px-2 py-0.5 bg-[#EFF4FF] text-[#1E3A5F] border border-[#CBD5E1] rounded">
                NBA Criterion 3 Compliance
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Correlates each Course Learning Outcome with Program Outcomes (PO1-PO12) and PSOs using 3-tier weighting.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {permissions.canEditMatrix && (
              <button
                type="button"
                onClick={handleAIAutoAlign}
                disabled={isAutoAligning}
                className="px-3 py-1.5 bg-[#0F9D8A] hover:bg-[#0B8070] text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
                title="Automatically calculate optimal correlations based on Bloom's action verbs"
              >
                {isAutoAligning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5 text-[#80F3DD]" />}
                {isAutoAligning ? 'Aligning...' : 'AI Smart Auto-Align'}
              </button>
            )}

            <button
              type="button"
              onClick={onOpenAnnexure}
              className="px-3 py-1.5 border border-[#1E3A5F] text-[#1E3A5F] hover:bg-[#F1F5F9] rounded text-xs font-medium flex items-center gap-1.5"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#0F9D8A]" />
              Correlation Definitions
            </button>

            {/* Matrix View Toggle */}
            <div className="flex rounded border border-[#CBD5E1] p-0.5 bg-[#F8FAFC]">
              <button
                type="button"
                onClick={() => setActiveTab('po')}
                className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
                  activeTab === 'po' 
                    ? 'bg-[#1E3A5F] text-white shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                PO1 — PO12 Matrix
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('pso')}
                className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
                  activeTab === 'pso' 
                    ? 'bg-[#1E3A5F] text-white shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                PSO1 — PSO3 Matrix
              </button>
            </div>
          </div>
        </div>

        {/* Legend / Interactive Correlation Scale Bar & Filter Pills */}
        <div className="pt-4 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Filter View:</span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setFilterLevel('all')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                  filterLevel === 'all' ? 'bg-[#1E3A5F] text-white border-[#1E3A5F]' : 'bg-white text-slate-600 border-[#CBD5E1]'
                }`}
              >
                All Cells
              </button>
              {[3, 2, 1, 0].map(lvl => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setFilterLevel(lvl)}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                    filterLevel === lvl ? 'bg-[#0F9D8A] text-white border-[#0F9D8A]' : 'bg-white text-slate-600 border-[#CBD5E1]'
                  }`}
                >
                  Level {lvl === 0 ? '0 (Unmapped)' : lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-slate-500">
            {permissions.canEditMatrix ? (
              <span className="text-[#006B5D] font-medium">
                💡 Click any matrix node to cycle correlation (0 → 1 → 2 → 3 → 0)
              </span>
            ) : (
              <span>Auditor view: Matrix values locked for inspection.</span>
            )}
          </div>
        </div>
      </div>

      {/* PO Matrix Table */}
      {activeTab === 'po' && (
        <div className="bg-white border border-[#CBD5E1] rounded-lg shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-[#1E3A5F] text-white">
                  <th className="px-4 py-3 text-left font-bold border-r border-[#0F2D52] w-52 shrink-0">
                    Course Outcome (CO)
                  </th>
                  <th className="px-2 py-3 text-center font-bold border-r border-[#0F2D52] w-16">
                    Bloom
                  </th>
                  {programOutcomes.map(po => {
                    const isHovered = activeHoverPO === po.code;
                    return (
                      <th
                        key={po.code}
                        onMouseEnter={() => setActiveHoverPO(po.code)}
                        onMouseLeave={() => setActiveHoverPO(null)}
                        className={`px-2 py-3 text-center font-bold border-r border-[#0F2D52] cursor-pointer transition-colors relative ${
                          isHovered ? 'bg-[#0F9D8A]' : 'hover:bg-[#2D486D]'
                        }`}
                        title={`${po.code}: ${po.title}\n${po.description}`}
                      >
                        <span className="font-mono">{po.code}</span>
                      </th>
                    );
                  })}
                  <th className="px-3 py-3 text-center font-bold bg-[#0F2D52] w-20">
                    CO Avg
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#E2E8F0]">
                {course.courseOutcomes.map((co) => {
                  const blooms = getBloomsLevel(co.bloomsLevel);
                  let rowSum = 0;
                  let rowCount = 0;
                  const isRowHovered = hoveredCOCode === co.code;

                  return (
                    <tr
                      key={co.id}
                      onMouseEnter={() => setHoveredCOCode(co.code)}
                      onMouseLeave={() => setHoveredCOCode(null)}
                      className={`transition-colors ${isRowHovered ? 'bg-cyan-50/40' : 'hover:bg-[#F8FAFC]'}`}
                    >
                      {/* CO Title & Code */}
                      <td className="px-4 py-3 font-semibold text-[#1F2937] border-r border-[#E2E8F0]">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-[#1E3A5F] text-white font-mono text-[11px] font-bold rounded">
                            {co.code}
                          </span>
                          <span className="truncate max-w-xs text-[11px] text-slate-700" title={co.statement}>
                            {co.statement}
                          </span>
                        </div>
                      </td>

                      {/* Bloom's Badge */}
                      <td className="px-2 py-3 text-center border-r border-[#E2E8F0]">
                        <span
                          className="px-1.5 py-0.5 text-[10px] font-mono font-bold rounded"
                          style={{
                            backgroundColor: blooms?.badgeBg,
                            color: blooms?.color
                          }}
                        >
                          {co.bloomsLevel}
                        </span>
                      </td>

                      {/* PO Cells */}
                      {programOutcomes.map(po => {
                        const val = course.poMapping[co.code]?.[po.code] || 0;
                        if (val > 0) {
                          rowSum += val;
                          rowCount++;
                        }

                        const isHighlighted = filterLevel === 'all' || filterLevel === val;
                        const isColHovered = activeHoverPO === po.code;

                        return (
                          <td
                            key={po.code}
                            onClick={() => handleTogglePOCell(co.code, po.code)}
                            className={`p-1 text-center border-r border-[#E2E8F0] select-none ${
                              isColHovered ? 'bg-teal-50/50' : ''
                            } ${permissions.canEditMatrix ? 'cursor-pointer' : ''}`}
                          >
                            <motion.div
                              whileTap={{ scale: 0.9 }}
                              className={`w-8 h-8 mx-auto flex items-center justify-center font-mono font-bold text-xs rounded matrix-cell-node ${
                                !isHighlighted ? 'opacity-20' : ''
                              } ${
                                val === 3 
                                  ? 'bg-[#0F9D8A] text-white shadow-xs' 
                                  : val === 2 
                                  ? 'bg-[#D5E3FF] text-[#1E3A5F]' 
                                  : val === 1 
                                  ? 'bg-[#F1F5F9] text-slate-700 border border-[#CBD5E1]' 
                                  : 'text-slate-300 hover:text-slate-500'
                              }`}
                            >
                              {val > 0 ? val : '-'}
                            </motion.div>
                          </td>
                        );
                      })}

                      {/* Row Average */}
                      <td className="px-3 py-3 text-center font-mono font-bold text-[#1E3A5F] bg-[#EFF4FF] tabular-nums">
                        {rowCount > 0 ? (rowSum / rowCount).toFixed(2) : '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>

              {/* Matrix Footer: Column Averages with Mini Progress Bar */}
              <tfoot>
                <tr className="bg-[#F8FAFC] border-t-2 border-[#1E3A5F] font-bold">
                  <td colSpan={2} className="px-4 py-3 text-right uppercase text-slate-700 border-r border-[#CBD5E1]">
                    Target Attainment Average
                  </td>
                  {poColumnStats.map(stat => {
                    const numVal = parseFloat(stat.avg);
                    const percent = !isNaN(numVal) ? Math.min(100, Math.round((numVal / 3.0) * 100)) : 0;

                    return (
                      <td 
                        key={stat.po.code} 
                        className={`px-1 py-2 text-center font-mono border-r border-[#CBD5E1] tabular-nums ${
                          stat.count === 0 ? 'text-slate-400 bg-slate-50' : 'text-[#006B5D] bg-[#EFF4FF]'
                        }`}
                      >
                        <span className="block text-xs font-bold">{stat.avg}</span>
                        {stat.count > 0 && (
                          <div className="w-6 h-1 mx-auto bg-slate-200 rounded-full mt-1 overflow-hidden">
                            <div className="h-full bg-[#0F9D8A]" style={{ width: `${percent}%` }} />
                          </div>
                        )}
                      </td>
                    );
                  })}
                  <td className="px-3 py-3 text-center font-mono text-white bg-[#1E3A5F] tabular-nums">
                    OBE Avg
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* PSO Matrix Table */}
      {activeTab === 'pso' && (
        <div className="bg-white border border-[#CBD5E1] rounded-lg shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-[#1E3A5F] text-white">
                  <th className="px-4 py-3 text-left font-bold border-r border-[#0F2D52] w-64">
                    Course Outcome (CO)
                  </th>
                  <th className="px-2 py-3 text-center font-bold border-r border-[#0F2D52] w-20">
                    Bloom
                  </th>
                  {programSpecificOutcomes.map(pso => (
                    <th
                      key={pso.code}
                      onMouseEnter={() => setActiveHoverPSO(pso.code)}
                      onMouseLeave={() => setActiveHoverPSO(null)}
                      className="px-4 py-3 text-center font-bold border-r border-[#0F2D52] hover:bg-[#2D486D] cursor-pointer"
                    >
                      <span className="font-mono">{pso.code}</span>
                      <span className="block text-[10px] font-normal text-[#ADC8F5] mt-0.5">
                        {pso.shortName}
                      </span>
                    </th>
                  ))}
                  <th className="px-3 py-3 text-center font-bold bg-[#0F2D52] w-24">
                    PSO Avg
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#E2E8F0]">
                {course.courseOutcomes.map(co => {
                  const blooms = getBloomsLevel(co.bloomsLevel);
                  let rowSum = 0;
                  let rowCount = 0;

                  return (
                    <tr key={co.id} className="hover:bg-[#F8FAFC]">
                      <td className="px-4 py-3 font-semibold text-[#1F2937] border-r border-[#E2E8F0]">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-[#1E3A5F] text-white font-mono text-[11px] font-bold rounded">
                            {co.code}
                          </span>
                          <span className="truncate max-w-sm text-[11px] text-slate-700">
                            {co.statement}
                          </span>
                        </div>
                      </td>

                      <td className="px-2 py-3 text-center border-r border-[#E2E8F0]">
                        <span
                          className="px-1.5 py-0.5 text-[10px] font-mono font-bold rounded"
                          style={{
                            backgroundColor: blooms?.badgeBg,
                            color: blooms?.color
                          }}
                        >
                          {co.bloomsLevel}
                        </span>
                      </td>

                      {programSpecificOutcomes.map(pso => {
                        const val = course.psoMapping[co.code]?.[pso.code] || 0;
                        if (val > 0) {
                          rowSum += val;
                          rowCount++;
                        }

                        return (
                          <td
                            key={pso.code}
                            onClick={() => handleTogglePSOCell(co.code, pso.code)}
                            className={`p-2 text-center border-r border-[#E2E8F0] select-none ${
                              permissions.canEditMatrix ? 'cursor-pointer' : ''
                            }`}
                          >
                            <motion.div
                              whileTap={{ scale: 0.9 }}
                              className={`w-8 h-8 mx-auto flex items-center justify-center font-mono font-bold text-xs rounded matrix-cell-node ${
                                val === 3 
                                  ? 'bg-[#0F9D8A] text-white shadow-xs' 
                                  : val === 2 
                                  ? 'bg-[#D5E3FF] text-[#1E3A5F]' 
                                  : val === 1 
                                  ? 'bg-[#F1F5F9] text-slate-700 border border-[#CBD5E1]' 
                                  : 'text-slate-300 hover:text-slate-500'
                              }`}
                            >
                              {val > 0 ? val : '-'}
                            </motion.div>
                          </td>
                        );
                      })}

                      <td className="px-3 py-3 text-center font-mono font-bold text-[#1E3A5F] bg-[#EFF4FF] tabular-nums">
                        {rowCount > 0 ? (rowSum / rowCount).toFixed(2) : '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>

              <tfoot>
                <tr className="bg-[#F8FAFC] border-t-2 border-[#1E3A5F] font-bold">
                  <td colSpan={2} className="px-4 py-3 text-right uppercase text-slate-700 border-r border-[#CBD5E1]">
                    PSO Column Average
                  </td>
                  {psoColumnStats.map(stat => (
                    <td 
                      key={stat.pso.code} 
                      className={`px-4 py-3 text-center font-mono border-r border-[#CBD5E1] tabular-nums ${
                        stat.count === 0 ? 'text-slate-400 bg-slate-50' : 'text-[#006B5D] bg-[#EFF4FF]'
                      }`}
                    >
                      {stat.avg}
                    </td>
                  ))}
                  <td className="px-3 py-3 text-center font-mono text-white bg-[#1E3A5F] tabular-nums">
                    OBE Avg
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Real-time Inspected PO / PSO Card from config/po_pso.json */}
      {(hoveredPOObj || hoveredPSOObj) && (
        <div className="p-4 bg-[#EFF4FF] border border-[#ADC8F5] rounded-lg text-xs animate-in fade-in duration-100 shadow-xs">
          {hoveredPOObj && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#1E3A5F] flex items-center gap-2">
                  <span className="px-1.5 py-0.5 bg-[#1E3A5F] text-white font-mono rounded">
                    {hoveredPOObj.code}
                  </span>
                  {hoveredPOObj.title}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  Category: {hoveredPOObj.category} • Target: {hoveredPOObj.targetAttainment} / 3.0
                </span>
              </div>
              <p className="text-slate-700 leading-relaxed pt-1">
                {hoveredPOObj.description}
              </p>
            </div>
          )}
          {hoveredPSOObj && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#1E3A5F] flex items-center gap-2">
                  <span className="px-1.5 py-0.5 bg-[#0F9D8A] text-white font-mono rounded">
                    {hoveredPSOObj.code}
                  </span>
                  {hoveredPSOObj.title}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  Dept: {hoveredPSOObj.department} • Target: {hoveredPSOObj.targetAttainment} / 3.0
                </span>
              </div>
              <p className="text-slate-700 leading-relaxed pt-1">
                {hoveredPSOObj.description}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Accreditation Articulation Justifications Drawer / Box */}
      <div className="bg-white border border-[#CBD5E1] rounded-lg p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
          <div>
            <h3 className="text-base font-bold text-[#1F2937] font-heading">
              Accreditation Articulation Justifications
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              NBA / ABET accreditation requires written pedagogical justifications for substantial (Level 3) and moderate (Level 2) correlations.
            </p>
          </div>
          <span className="text-xs font-mono font-semibold px-2 py-0.5 bg-[#F1F5F9] border border-[#CBD5E1] text-[#1E3A5F] rounded">
            {Object.keys(course.mappingJustifications).length} Justifications Documented
          </span>
        </div>

        <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(course.mappingJustifications).map(([key, justification]) => (
            <div key={key} className="p-3 bg-[#F8FAFC] border border-[#CBD5E1] rounded text-xs space-y-1.5 hover:border-teal-300 transition-colors">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 bg-[#1E3A5F] text-white font-mono font-bold rounded">
                  {key}
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  Level 3 (High) Correlation
                </span>
              </div>

              {permissions.canEditMatrix ? (
                <textarea
                  rows={2}
                  value={justification}
                  onChange={e => handleUpdateJustification(key, e.target.value)}
                  className="w-full text-xs text-slate-700 p-2 bg-white border border-[#CBD5E1] rounded focus:outline-none focus:border-[#0F9D8A]"
                />
              ) : (
                <p className="text-slate-700 leading-relaxed bg-white p-2 rounded border border-[#E2E8F0]">
                  {justification}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
