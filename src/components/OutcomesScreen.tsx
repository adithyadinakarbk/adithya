/**
 * @license
 * Academic Precision OBE System
 * Course Outcomes (CLOs / COs) Screen
 * Loads Bloom's levels, verbs, and domains strictly from config/po_pso.json
 */

import React, { useState } from 'react';
import { CourseSpecification, CourseOutcome, UserRole } from '../types.ts';
import { RolePermissions } from '../permissions.ts';
import { bloomsLevels, getBloomsLevel } from '../annexureA.ts';
import { executeAIRequest } from '../api.ts';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  Layers, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw, 
  ChevronRight,
  Info
} from 'lucide-react';

interface OutcomesScreenProps {
  course: CourseSpecification;
  onUpdateCourse: (updated: CourseSpecification) => void;
  currentRole: UserRole;
  permissions: RolePermissions;
  onOpenAnnexure: () => void;
}

export const OutcomesScreen: React.FC<OutcomesScreenProps> = ({
  course,
  onUpdateCourse,
  currentRole,
  permissions,
  onOpenAnnexure
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<any[] | null>(null);

  const handleUpdateOutcome = (index: number, field: keyof CourseOutcome, value: any) => {
    const updated = [...course.courseOutcomes];
    const outcome = { ...updated[index], [field]: value };

    // If bloomsLevel changed, set default actionVerb from config/po_pso.json
    if (field === 'bloomsLevel') {
      const bloomsInfo = getBloomsLevel(value);
      if (bloomsInfo && bloomsInfo.actionVerbs.length > 0) {
        outcome.actionVerb = bloomsInfo.actionVerbs[0];
      }
    }

    updated[index] = outcome;
    onUpdateCourse({
      ...course,
      courseOutcomes: updated,
      lastUpdated: new Date().toISOString().split('T')[0]
    });
  };

  const handleAddOutcome = () => {
    const nextIdx = course.courseOutcomes.length + 1;
    const defaultBlooms = 'L3';
    const bloomsInfo = getBloomsLevel(defaultBlooms);
    const newOutcome: CourseOutcome = {
      id: `co_${Date.now()}`,
      code: `CO${nextIdx}`,
      bloomsLevel: defaultBlooms,
      actionVerb: bloomsInfo ? bloomsInfo.actionVerbs[0] : 'Apply',
      statement: `Apply computational techniques to resolve engineering challenges relevant to ${course.title}.`,
      expectedAttainment: 70
    };

    onUpdateCourse({
      ...course,
      courseOutcomes: [...course.courseOutcomes, newOutcome],
      lastUpdated: new Date().toISOString().split('T')[0]
    });
  };

  const handleRemoveOutcome = (index: number) => {
    const updated = [...course.courseOutcomes];
    const removedCode = updated[index].code;
    updated.splice(index, 1);

    // Re-index remaining CO codes (CO1, CO2, ...)
    const reindexed = updated.map((co, idx) => ({
      ...co,
      code: `CO${idx + 1}`
    }));

    // Clean up mapping matrix
    const newPoMapping = { ...course.poMapping };
    delete newPoMapping[removedCode];
    const newPsoMapping = { ...course.psoMapping };
    delete newPsoMapping[removedCode];

    onUpdateCourse({
      ...course,
      courseOutcomes: reindexed,
      poMapping: newPoMapping,
      psoMapping: newPsoMapping,
      lastUpdated: new Date().toISOString().split('T')[0]
    });
  };

  const handleGenerateAIOutcomes = async () => {
    setIsGenerating(true);
    setAiError(null);
    try {
      const res = await executeAIRequest({
        task: 'generate_clos',
        courseCode: course.code,
        courseTitle: course.title,
        syllabusUnits: course.syllabusUnits.map(u => ({
          unitNumber: u.unitNumber,
          title: u.title,
          topics: u.topics
        }))
      });

      if (res && res.clos && Array.isArray(res.clos)) {
        setAiSuggestions(res.clos);
      } else {
        setAiError('AI provider responded without compliant Course Outcome proposals.');
      }
    } catch (err: any) {
      setAiError(err.message || 'Failed to synthesize outcomes via AI.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAdoptAISuggestions = () => {
    if (!aiSuggestions) return;
    const converted: CourseOutcome[] = aiSuggestions.map((s, idx) => ({
      id: `co_ai_${Date.now()}_${idx}`,
      code: s.code || `CO${idx + 1}`,
      bloomsLevel: s.bloomsLevel || 'L3',
      actionVerb: s.actionVerb || 'Apply',
      statement: s.statement,
      expectedAttainment: 70
    }));

    onUpdateCourse({
      ...course,
      courseOutcomes: converted,
      lastUpdated: new Date().toISOString().split('T')[0]
    });
    setAiSuggestions(null);
  };

  // Calculate Bloom distribution
  const bloomsCounts: Record<string, number> = {};
  course.courseOutcomes.forEach(co => {
    bloomsCounts[co.bloomsLevel] = (bloomsCounts[co.bloomsLevel] || 0) + 1;
  });

  const higherOrderCount = (bloomsCounts['L4'] || 0) + (bloomsCounts['L5'] || 0) + (bloomsCounts['L6'] || 0);
  const higherOrderPercent = course.courseOutcomes.length > 0 
    ? Math.round((higherOrderCount / course.courseOutcomes.length) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      
      {/* Header and Action Banner */}
      <div className="bg-white border border-[#CBD5E1] rounded-lg p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#1F2937] font-heading">
                Course Learning Outcomes (CLOs / COs)
              </h2>
              <span className="text-xs font-mono font-bold px-2 py-0.5 bg-[#EFF4FF] text-[#1E3A5F] border border-[#CBD5E1] rounded">
                {course.courseOutcomes.length} Outcomes
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Specific, measurable cognitive statements articulating student capabilities upon course completion.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenAnnexure}
              className="px-3 py-1.5 border border-[#1E3A5F] text-[#1E3A5F] hover:bg-[#F1F5F9] rounded text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Info className="w-3.5 h-3.5 text-[#0F9D8A]" />
              Bloom's Verbs Matrix
            </button>

            {permissions.canUseAI && (
              <button
                type="button"
                onClick={handleGenerateAIOutcomes}
                disabled={isGenerating}
                className="px-3.5 py-1.5 bg-[#0F9D8A] hover:bg-[#0B8070] text-white rounded text-xs font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50 shadow-xs"
                title="Synthesize 5 to 6 NBA-compliant Course Outcomes directly from syllabus modules"
              >
                {isGenerating ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-[#80F3DD]" />
                )}
                {isGenerating ? 'Synthesizing...' : 'AI Generate Outcomes'}
              </button>
            )}

            {permissions.canEditOutcomes && (
              <button
                type="button"
                onClick={handleAddOutcome}
                className="px-3.5 py-1.5 bg-[#1E3A5F] hover:bg-[#152A45] text-white rounded text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Outcome
              </button>
            )}
          </div>
        </div>

        {/* AI Suggestions Modal/Drawer if generated */}
        {aiSuggestions && (
          <div className="mt-4 p-5 bg-[#EFF4FF] border border-[#ADC8F5] rounded-lg">
            <div className="flex items-center justify-between pb-3 border-b border-[#CBD5E1]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#006B5D]" />
                <h3 className="text-sm font-bold text-[#1E3A5F] font-heading">
                  AI Synthesized Course Outcomes ({aiSuggestions.length} Proposals)
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setAiSuggestions(null)}
                  className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900"
                >
                  Dismiss
                </button>
                <button
                  type="button"
                  onClick={handleAdoptAISuggestions}
                  className="px-3 py-1 bg-[#0F9D8A] hover:bg-[#0B8070] text-white rounded text-xs font-medium flex items-center gap-1"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-white" />
                  Adopt All Proposals
                </button>
              </div>
            </div>

            <div className="pt-3 space-y-2.5 max-h-80 overflow-y-auto">
              {aiSuggestions.map((prop, idx) => (
                <div key={idx} className="p-3 bg-white border border-[#CBD5E1] rounded text-xs">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold px-1.5 py-0.5 bg-[#1E3A5F] text-white rounded text-[11px]">
                        {prop.code || `CO${idx + 1}`}
                      </span>
                      <span className="px-1.5 py-0.5 font-bold rounded text-[11px] bg-[#CCFBF1] text-[#006B5D]">
                        {prop.bloomsLevel} • {prop.actionVerb}
                      </span>
                    </div>
                    {prop.recommendedPOs && (
                      <span className="text-[11px] font-mono text-slate-500">
                        Mapped POs: {prop.recommendedPOs.join(', ')}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-800 font-medium leading-relaxed">{prop.statement}</p>
                  {prop.rationale && (
                    <p className="text-[11px] text-slate-500 mt-1 italic">
                      OBE Rationale: {prop.rationale}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {aiError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{aiError}</span>
          </div>
        )}

        {/* Cognitive Hierarchy KPI Bar */}
        <div className="pt-4 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-600">Cognitive Balance:</span>
            <div className="flex items-center gap-1.5">
              {bloomsLevels.map(bl => {
                const count = bloomsCounts[bl.level] || 0;
                return (
                  <span
                    key={bl.level}
                    className="px-2 py-0.5 rounded border text-[11px] font-mono font-semibold"
                    style={{
                      borderColor: count > 0 ? bl.color : '#E2E8F0',
                      backgroundColor: count > 0 ? bl.badgeBg : '#F8FAFC',
                      color: count > 0 ? bl.color : '#94A3B8'
                    }}
                    title={`${bl.level}: ${bl.name} (${bl.cognitiveDomain})`}
                  >
                    {bl.level}: {count}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500">Higher-Order (L4-L6):</span>
            <span className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
              higherOrderPercent >= 40 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              {higherOrderPercent}% {higherOrderPercent >= 40 ? '✓ NBA Compliant' : '⚠ Increase L4-L6'}
            </span>
          </div>
        </div>
      </div>

      {/* List of Course Outcomes */}
      <div className="space-y-4">
        {course.courseOutcomes.map((co, index) => {
          const currentBlooms = getBloomsLevel(co.bloomsLevel);
          const availableVerbs = currentBlooms ? currentBlooms.actionVerbs : [];

          return (
            <div 
              key={co.id} 
              className="bg-white border border-[#CBD5E1] rounded-lg p-5 shadow-xs hover:border-[#94A3B8] transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0]">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 bg-[#1E3A5F] text-white font-mono text-xs font-bold rounded">
                    {co.code}
                  </span>

                  {/* Bloom's Level Selector loaded strictly from config/po_pso.json */}
                  {permissions.canEditOutcomes ? (
                    <div className="flex items-center gap-1.5">
                      <label htmlFor={`blooms-select-${co.id}`} className="text-[11px] font-semibold text-slate-500 uppercase">
                        Taxonomy:
                      </label>
                      <select
                        id={`blooms-select-${co.id}`}
                        value={co.bloomsLevel}
                        onChange={e => handleUpdateOutcome(index, 'bloomsLevel', e.target.value)}
                        className="h-8 px-2.5 text-xs font-semibold bg-white border border-[#CBD5E1] rounded focus:outline-none focus:border-[#0F9D8A]"
                        style={{ color: currentBlooms?.color }}
                      >
                        {bloomsLevels.map(b => (
                          <option key={b.level} value={b.level}>
                            {b.level} — {b.name} ({b.cognitiveDomain})
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <span 
                      className="px-2 py-0.5 text-xs font-bold rounded border font-mono"
                      style={{
                        backgroundColor: currentBlooms?.badgeBg,
                        color: currentBlooms?.color,
                        borderColor: currentBlooms?.color
                      }}
                    >
                      {co.bloomsLevel} • {currentBlooms?.name}
                    </span>
                  )}

                  {/* Action Verb Selector loaded strictly from config/po_pso.json */}
                  {permissions.canEditOutcomes ? (
                    <div className="flex items-center gap-1.5">
                      <label htmlFor={`verb-select-${co.id}`} className="text-[11px] font-semibold text-slate-500 uppercase">
                        Action Verb:
                      </label>
                      <select
                        id={`verb-select-${co.id}`}
                        value={co.actionVerb}
                        onChange={e => handleUpdateOutcome(index, 'actionVerb', e.target.value)}
                        className="h-8 px-2 text-xs bg-white border border-[#CBD5E1] rounded focus:outline-none focus:border-[#0F9D8A] text-[#1E3A5F] font-medium"
                      >
                        {availableVerbs.map(verb => (
                          <option key={verb} value={verb}>{verb}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <span className="text-xs font-semibold text-[#1E3A5F] bg-[#F1F5F9] px-2 py-0.5 rounded border border-[#CBD5E1]">
                      Verb: {co.actionVerb}
                    </span>
                  )}
                </div>

                {/* Right controls: Attainment & Delete */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-slate-500">Target Attainment:</span>
                    {permissions.canEditOutcomes ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="40"
                          max="100"
                          value={co.expectedAttainment}
                          onChange={e => handleUpdateOutcome(index, 'expectedAttainment', parseInt(e.target.value) || 0)}
                          className="w-14 h-7 text-xs font-mono font-bold text-center border border-[#CBD5E1] rounded focus:border-[#0F9D8A] tabular-nums"
                        />
                        <span className="font-semibold text-slate-600">%</span>
                      </div>
                    ) : (
                      <span className="font-mono font-bold text-[#1E3A5F] tabular-nums">
                        {co.expectedAttainment}%
                      </span>
                    )}
                  </div>

                  {permissions.canEditOutcomes && course.courseOutcomes.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveOutcome(index)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                      title="Delete outcome"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Statement Editor */}
              <div className="pt-3">
                {permissions.canEditOutcomes ? (
                  <textarea
                    rows={2}
                    value={co.statement}
                    onChange={e => handleUpdateOutcome(index, 'statement', e.target.value)}
                    className="w-full text-xs text-[#1F2937] leading-relaxed p-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded focus:bg-white focus:outline-none focus:border-[#0F9D8A] transition-colors"
                    placeholder="State the measurable learning outcome starting with the specified action verb..."
                  />
                ) : (
                  <p className="text-xs text-[#1F2937] leading-relaxed bg-[#F8FAFC] p-3 rounded border border-[#E2E8F0]">
                    {co.statement}
                  </p>
                )}

                {/* Cognitive Domain & Verb Feedback */}
                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                  <span>
                    Cognitive Dimension: <strong className="text-slate-700">{currentBlooms?.cognitiveDomain}</strong>
                  </span>
                  {!co.statement.toLowerCase().startsWith(co.actionVerb.toLowerCase()) && (
                    <span className="text-amber-600 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3 h-3" />
                      Notice: Recommended to initiate statement with '{co.actionVerb}'.
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
