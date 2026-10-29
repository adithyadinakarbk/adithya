/**
 * @license
 * Academic Precision OBE System
 * Assessment and Evaluation Pattern Screen
 */

import React from 'react';
import { CourseSpecification, AssessmentComponent, UserRole } from '../types.ts';
import { RolePermissions } from '../permissions.ts';
import { bloomsLevels } from '../annexureA.ts';
import { 
  FileCheck2, 
  CheckCircle, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  Award, 
  Percent,
  Sliders
} from 'lucide-react';

interface AssessmentScreenProps {
  course: CourseSpecification;
  onUpdateCourse: (updated: CourseSpecification) => void;
  currentRole: UserRole;
  permissions: RolePermissions;
}

export const AssessmentScreen: React.FC<AssessmentScreenProps> = ({
  course,
  onUpdateCourse,
  currentRole,
  permissions
}) => {
  const handleUpdateComponent = (id: string, field: keyof AssessmentComponent, val: any) => {
    const updated = course.assessments.map(a => {
      if (a.id === id) {
        return { ...a, [field]: val };
      }
      return a;
    });

    onUpdateCourse({
      ...course,
      assessments: updated,
      lastUpdated: new Date().toISOString().split('T')[0]
    });
  };

  const handleToggleBloomsFocus = (comp: AssessmentComponent, level: string) => {
    if (!permissions.canEditAssessments) return;
    const exists = comp.bloomsFocus.includes(level);
    const updated = exists 
      ? comp.bloomsFocus.filter(l => l !== level)
      : [...comp.bloomsFocus, level];

    handleUpdateComponent(comp.id, 'bloomsFocus', updated);
  };

  const handleToggleMappedCO = (comp: AssessmentComponent, coCode: string) => {
    if (!permissions.canEditAssessments) return;
    const exists = comp.mappedCOs.includes(coCode);
    const updated = exists 
      ? comp.mappedCOs.filter(c => c !== coCode)
      : [...comp.mappedCOs, coCode];

    handleUpdateComponent(comp.id, 'mappedCOs', updated);
  };

  const handleAddComponent = (category: 'CIE' | 'SEE') => {
    const newComp: AssessmentComponent = {
      id: `as_${Date.now()}`,
      category,
      name: category === 'CIE' ? 'Continuous Assessment Component' : 'End Semester Component',
      weightageMarks: 10,
      mappedCOs: ['CO1'],
      bloomsFocus: ['L2', 'L3']
    };

    onUpdateCourse({
      ...course,
      assessments: [...course.assessments, newComp],
      lastUpdated: new Date().toISOString().split('T')[0]
    });
  };

  const handleRemoveComponent = (id: string) => {
    onUpdateCourse({
      ...course,
      assessments: course.assessments.filter(a => a.id !== id),
      lastUpdated: new Date().toISOString().split('T')[0]
    });
  };

  // Compute CIE and SEE subtotals
  const cieTotal = course.assessments
    .filter(a => a.category === 'CIE')
    .reduce((acc, a) => acc + (a.weightageMarks || 0), 0);

  const seeTotal = course.assessments
    .filter(a => a.category === 'SEE')
    .reduce((acc, a) => acc + (a.weightageMarks || 0), 0);

  const grandTotal = cieTotal + seeTotal;
  const isCompliant = grandTotal === 100;

  return (
    <div className="space-y-6">
      
      {/* Header & Sum Verification Card */}
      <div className="bg-white border border-[#CBD5E1] rounded-lg p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#1F2937] font-heading">
                Assessment Scheme & Evaluation Rubrics
              </h2>
              <span className="text-xs font-mono font-bold px-2 py-0.5 bg-[#EFF4FF] text-[#1E3A5F] border border-[#CBD5E1] rounded">
                Tier-1 OBE Standard
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Defines the Continuous Internal Evaluation (CIE) and Semester End Examination (SEE) mark distribution.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded border text-xs font-semibold ${
              isCompliant 
                ? 'bg-[#DCFCE7] border-[#86EFAC] text-[#15803D]' 
                : 'bg-[#FEE2E2] border-[#FCA5A5] text-[#B91C1C]'
            }`}>
              {isCompliant ? <CheckCircle className="w-4 h-4 text-[#15803D]" /> : <AlertTriangle className="w-4 h-4 text-[#B91C1C]" />}
              <span>Total Weightage: <strong className="font-mono tabular-nums">{grandTotal}%</strong> (CIE: {cieTotal}% + SEE: {seeTotal}%)</span>
              <span>{isCompliant ? '✓ 100% Balanced' : '⚠ Discrepancy'}</span>
            </div>
          </div>
        </div>

        {/* Breakdown Summary Stats */}
        <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded">
            <span className="text-[11px] font-semibold text-slate-500 uppercase block">Continuous Internal (CIE)</span>
            <span className="text-xl font-bold font-mono text-[#1E3A5F] tabular-nums">{cieTotal} Marks</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Recommended: 40% — 50%</span>
          </div>

          <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded">
            <span className="text-[11px] font-semibold text-slate-500 uppercase block">Semester End Exam (SEE)</span>
            <span className="text-xl font-bold font-mono text-[#1E3A5F] tabular-nums">{seeTotal} Marks</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Standard: 50% — 60%</span>
          </div>

          <div className="p-3 bg-[#EFF4FF] border border-[#CBD5E1] rounded">
            <span className="text-[11px] font-bold text-[#1E3A5F] uppercase block">Cumulative Course Grade</span>
            <span className="text-xl font-bold font-mono text-[#0F9D8A] tabular-nums">{grandTotal} / 100</span>
            <span className="text-[10px] text-[#006B5D] block mt-0.5 font-medium">100% Attainment Target</span>
          </div>
        </div>
      </div>

      {/* CIE Components Table */}
      <div className="bg-white border border-[#CBD5E1] rounded-lg p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
          <div>
            <h3 className="text-sm font-bold text-[#1F2937] font-heading">
              1. Continuous Internal Evaluation (CIE) — {cieTotal} Marks
            </h3>
            <p className="text-xs text-slate-500">
              Formative evaluation conducted progressively during the instructional semester.
            </p>
          </div>
          {permissions.canEditAssessments && (
            <button
              type="button"
              onClick={() => handleAddComponent('CIE')}
              className="px-3 py-1.5 bg-[#1E3A5F] hover:bg-[#152A45] text-white rounded text-xs font-medium flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Add CIE Task
            </button>
          )}
        </div>

        <div className="pt-4 divide-y divide-[#E2E8F0]">
          {course.assessments.filter(a => a.category === 'CIE').map(comp => (
            <div key={comp.id} className="py-4 space-y-3 first:pt-0 last:pb-0">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex-1">
                  {permissions.canEditAssessments ? (
                    <input
                      type="text"
                      value={comp.name}
                      onChange={e => handleUpdateComponent(comp.id, 'name', e.target.value)}
                      className="text-xs font-bold text-[#1F2937] w-full max-w-md p-1 border-b border-[#CBD5E1] focus:border-[#0F9D8A] focus:outline-none"
                    />
                  ) : (
                    <span className="text-xs font-bold text-[#1F2937]">{comp.name}</span>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-xs">
                    <span className="text-slate-500 font-medium">Weight:</span>
                    {permissions.canEditAssessments ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="1"
                          max="50"
                          value={comp.weightageMarks}
                          onChange={e => handleUpdateComponent(comp.id, 'weightageMarks', parseInt(e.target.value) || 0)}
                          className="w-14 h-7 text-xs font-mono font-bold text-center border border-[#CBD5E1] rounded focus:border-[#0F9D8A] tabular-nums"
                        />
                        <span className="font-semibold text-slate-600">Marks</span>
                      </div>
                    ) : (
                      <span className="font-mono font-bold text-[#1E3A5F] tabular-nums">
                        {comp.weightageMarks} Marks
                      </span>
                    )}
                  </div>

                  {permissions.canEditAssessments && (
                    <button
                      type="button"
                      onClick={() => handleRemoveComponent(comp.id)}
                      className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                      title="Remove component"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Mapped COs and Bloom level tags for this assessment */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 text-[11px] font-semibold uppercase">Mapped Outcomes:</span>
                  <div className="flex gap-1">
                    {course.courseOutcomes.map(co => {
                      const isMapped = comp.mappedCOs.includes(co.code);
                      return (
                        <button
                          type="button"
                          key={co.code}
                          onClick={() => handleToggleMappedCO(comp, co.code)}
                          disabled={!permissions.canEditAssessments}
                          className={`px-2 py-0.5 font-mono text-[11px] rounded border transition-colors ${
                            isMapped 
                              ? 'bg-[#1E3A5F] text-white border-[#1E3A5F] font-bold' 
                              : 'bg-white text-slate-400 border-[#E2E8F0]'
                          }`}
                        >
                          {co.code}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-500 text-[11px] font-semibold uppercase">Bloom Focus:</span>
                  <div className="flex gap-1">
                    {bloomsLevels.map(b => {
                      const isFocused = comp.bloomsFocus.includes(b.level);
                      return (
                        <button
                          type="button"
                          key={b.level}
                          onClick={() => handleToggleBloomsFocus(comp, b.level)}
                          disabled={!permissions.canEditAssessments}
                          className={`px-2 py-0.5 font-mono text-[11px] rounded border transition-colors ${
                            isFocused 
                              ? 'text-white font-bold' 
                              : 'bg-white text-slate-400 border-[#E2E8F0]'
                          }`}
                          style={{
                            backgroundColor: isFocused ? b.color : 'white',
                            borderColor: isFocused ? b.color : '#E2E8F0'
                          }}
                        >
                          {b.level}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SEE Components Table */}
      <div className="bg-white border border-[#CBD5E1] rounded-lg p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
          <div>
            <h3 className="text-sm font-bold text-[#1F2937] font-heading">
              2. Semester End Examination (SEE) — {seeTotal} Marks
            </h3>
            <p className="text-xs text-slate-500">
              Summative written comprehensive assessment administered under university examination board guidelines.
            </p>
          </div>
          {permissions.canEditAssessments && (
            <button
              type="button"
              onClick={() => handleAddComponent('SEE')}
              className="px-3 py-1.5 bg-[#1E3A5F] hover:bg-[#152A45] text-white rounded text-xs font-medium flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Add SEE Component
            </button>
          )}
        </div>

        <div className="pt-4 divide-y divide-[#E2E8F0]">
          {course.assessments.filter(a => a.category === 'SEE').map(comp => (
            <div key={comp.id} className="py-4 space-y-3 first:pt-0 last:pb-0">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex-1">
                  {permissions.canEditAssessments ? (
                    <input
                      type="text"
                      value={comp.name}
                      onChange={e => handleUpdateComponent(comp.id, 'name', e.target.value)}
                      className="text-xs font-bold text-[#1F2937] w-full max-w-md p-1 border-b border-[#CBD5E1] focus:border-[#0F9D8A] focus:outline-none"
                    />
                  ) : (
                    <span className="text-xs font-bold text-[#1F2937]">{comp.name}</span>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-xs">
                    <span className="text-slate-500 font-medium">Weight:</span>
                    {permissions.canEditAssessments ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={comp.weightageMarks}
                          onChange={e => handleUpdateComponent(comp.id, 'weightageMarks', parseInt(e.target.value) || 0)}
                          className="w-14 h-7 text-xs font-mono font-bold text-center border border-[#CBD5E1] rounded focus:border-[#0F9D8A] tabular-nums"
                        />
                        <span className="font-semibold text-slate-600">Marks</span>
                      </div>
                    ) : (
                      <span className="font-mono font-bold text-[#1E3A5F] tabular-nums">
                        {comp.weightageMarks} Marks
                      </span>
                    )}
                  </div>

                  {permissions.canEditAssessments && (
                    <button
                      type="button"
                      onClick={() => handleRemoveComponent(comp.id)}
                      className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                      title="Remove component"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Mapped COs and Bloom level tags for this assessment */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 text-[11px] font-semibold uppercase">Mapped Outcomes:</span>
                  <div className="flex gap-1">
                    {course.courseOutcomes.map(co => {
                      const isMapped = comp.mappedCOs.includes(co.code);
                      return (
                        <button
                          type="button"
                          key={co.code}
                          onClick={() => handleToggleMappedCO(comp, co.code)}
                          disabled={!permissions.canEditAssessments}
                          className={`px-2 py-0.5 font-mono text-[11px] rounded border transition-colors ${
                            isMapped 
                              ? 'bg-[#1E3A5F] text-white border-[#1E3A5F] font-bold' 
                              : 'bg-white text-slate-400 border-[#E2E8F0]'
                          }`}
                        >
                          {co.code}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-500 text-[11px] font-semibold uppercase">Bloom Focus:</span>
                  <div className="flex gap-1">
                    {bloomsLevels.map(b => {
                      const isFocused = comp.bloomsFocus.includes(b.level);
                      return (
                        <button
                          type="button"
                          key={b.level}
                          onClick={() => handleToggleBloomsFocus(comp, b.level)}
                          disabled={!permissions.canEditAssessments}
                          className={`px-2 py-0.5 font-mono text-[11px] rounded border transition-colors ${
                            isFocused 
                              ? 'text-white font-bold' 
                              : 'bg-white text-slate-400 border-[#E2E8F0]'
                          }`}
                          style={{
                            backgroundColor: isFocused ? b.color : 'white',
                            borderColor: isFocused ? b.color : '#E2E8F0'
                          }}
                        >
                          {b.level}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
