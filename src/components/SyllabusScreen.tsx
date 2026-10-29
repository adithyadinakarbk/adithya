/**
 * @license
 * Academic Precision OBE System
 * Syllabus Modules, Teaching Pedagogy, and Textbook Bibliography Screen
 */

import React, { useState } from 'react';
import { CourseSpecification, SyllabusUnit, Textbook, UserRole } from '../types.ts';
import { RolePermissions } from '../permissions.ts';
import { 
  BookOpen, 
  Clock, 
  Layers, 
  GraduationCap, 
  Plus, 
  Trash2, 
  CheckCircle, 
  AlertTriangle,
  Library,
  Sparkles
} from 'lucide-react';

interface SyllabusScreenProps {
  course: CourseSpecification;
  onUpdateCourse: (updated: CourseSpecification) => void;
  currentRole: UserRole;
  permissions: RolePermissions;
}

const AVAILABLE_PEDAGOGICAL_METHODS = [
  'Chalk & Talk',
  'ICT / Interactive Slides',
  'Visual Simulation',
  'Algorithm Visualization Demo',
  'Case Study',
  'Problem-Based Learning Group Activity',
  'Peer Code Walkthrough',
  'Socratic Seminar',
  'Research Paper Seminar'
];

export const SyllabusScreen: React.FC<SyllabusScreenProps> = ({
  course,
  onUpdateCourse,
  currentRole,
  permissions
}) => {
  const [selectedUnitIdx, setSelectedUnitIdx] = useState(0);

  const handleUpdateUnit = (idx: number, field: keyof SyllabusUnit, val: any) => {
    const updated = [...course.syllabusUnits];
    updated[idx] = { ...updated[idx], [field]: val };
    onUpdateCourse({
      ...course,
      syllabusUnits: updated,
      lastUpdated: new Date().toISOString().split('T')[0]
    });
  };

  const handleToggleUnitCO = (unitIdx: number, coCode: string) => {
    if (!permissions.canEditSyllabus) return;
    const unit = course.syllabusUnits[unitIdx];
    const exists = unit.mappedCOs.includes(coCode);
    const updatedCOs = exists 
      ? unit.mappedCOs.filter(c => c !== coCode)
      : [...unit.mappedCOs, coCode];

    handleUpdateUnit(unitIdx, 'mappedCOs', updatedCOs);
  };

  const handleTogglePedagogy = (unitIdx: number, method: string) => {
    if (!permissions.canEditSyllabus) return;
    const unit = course.syllabusUnits[unitIdx];
    const exists = unit.pedagogicalMethods.includes(method);
    const updated = exists 
      ? unit.pedagogicalMethods.filter(m => m !== method)
      : [...unit.pedagogicalMethods, method];

    handleUpdateUnit(unitIdx, 'pedagogicalMethods', updated);
  };

  const handleAddTextbook = () => {
    const newTb: Textbook = {
      id: `tb_${Date.now()}`,
      authors: 'Author Name',
      title: 'Course Textbook Title',
      edition: '1st Edition',
      publisher: 'Academic Press',
      year: '2024',
      isPrescribed: true
    };
    onUpdateCourse({
      ...course,
      textbooks: [...course.textbooks, newTb],
      lastUpdated: new Date().toISOString().split('T')[0]
    });
  };

  const handleRemoveTextbook = (id: string) => {
    onUpdateCourse({
      ...course,
      textbooks: course.textbooks.filter(t => t.id !== id),
      lastUpdated: new Date().toISOString().split('T')[0]
    });
  };

  // Compute total syllabus hours
  const totalSyllabusHours = course.syllabusUnits.reduce((acc, u) => acc + (u.lectureHours || 0), 0);
  const isHoursMatched = totalSyllabusHours === course.totalContactHours;

  const activeUnit = course.syllabusUnits[selectedUnitIdx] || course.syllabusUnits[0];

  return (
    <div className="space-y-6">
      
      {/* Header and Total Hours Verification Card */}
      <div className="bg-white border border-[#CBD5E1] rounded-lg p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#1F2937] font-heading">
                Modular Syllabus Specification (Units I — V)
              </h2>
              <span className="text-xs font-mono font-bold px-2 py-0.5 bg-[#EFF4FF] text-[#1E3A5F] border border-[#CBD5E1] rounded">
                {course.syllabusUnits.length} Instructional Modules
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Comprehensive unit breakdown with detailed topics, instructional hours, pedagogical methods, and CLO mapping.
            </p>
          </div>

          {/* Hours Alignment Indicator */}
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded border text-xs ${
              isHoursMatched 
                ? 'bg-[#DCFCE7] border-[#86EFAC] text-[#15803D]' 
                : 'bg-[#FEF3C7] border-[#FCD34D] text-[#B45309]'
            }`}>
              <Clock className="w-3.5 h-3.5" />
              <span>
                Syllabus Hours: <strong className="font-mono tabular-nums">{totalSyllabusHours}</strong> / {course.totalContactHours} hrs
              </span>
              {isHoursMatched ? '✓ Matched' : '⚠ Discrepancy'}
            </div>
          </div>
        </div>

        {/* Unit Selector Tabs */}
        <div className="pt-4 flex gap-2 overflow-x-auto">
          {course.syllabusUnits.map((u, idx) => (
            <button
              type="button"
              key={u.id}
              onClick={() => setSelectedUnitIdx(idx)}
              className={`px-4 py-2 text-xs font-semibold rounded border transition-colors flex items-center gap-2 shrink-0 ${
                selectedUnitIdx === idx
                  ? 'bg-[#1E3A5F] text-white border-[#1E3A5F]'
                  : 'bg-[#F8FAFC] text-slate-700 border-[#CBD5E1] hover:bg-[#F1F5F9]'
              }`}
            >
              <span className="font-mono">Unit {u.unitNumber}</span>
              <span className="text-[11px] opacity-80 truncate max-w-xs">{u.title}</span>
              <span className="text-[10px] px-1 py-0.2 rounded font-mono bg-white/20">
                {u.lectureHours}h
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Unit Detailed Workspace */}
      {activeUnit && (
        <div className="bg-white border border-[#CBD5E1] rounded-lg p-6 shadow-xs space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-[#1E3A5F] text-white font-mono text-sm font-bold rounded">
                Unit {activeUnit.unitNumber}
              </span>
              {permissions.canEditSyllabus ? (
                <input
                  type="text"
                  value={activeUnit.title}
                  onChange={e => handleUpdateUnit(selectedUnitIdx, 'title', e.target.value)}
                  className="text-base font-bold text-[#1F2937] font-heading border-b border-transparent hover:border-[#CBD5E1] focus:border-[#0F9D8A] focus:outline-none max-w-lg"
                />
              ) : (
                <h3 className="text-base font-bold text-[#1F2937] font-heading">{activeUnit.title}</h3>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium">Instructional Hours:</span>
              {permissions.canEditSyllabus ? (
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={activeUnit.lectureHours}
                    onChange={e => handleUpdateUnit(selectedUnitIdx, 'lectureHours', parseInt(e.target.value) || 0)}
                    className="w-14 h-8 text-xs font-mono font-bold text-center border border-[#CBD5E1] rounded focus:border-[#0F9D8A] tabular-nums"
                  />
                  <span className="text-slate-600 font-medium">Hours</span>
                </div>
              ) : (
                <span className="font-mono font-bold text-[#1E3A5F] tabular-nums">
                  {activeUnit.lectureHours} Hours
                </span>
              )}
            </div>
          </div>

          {/* Topics Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider">
              Syllabus Topics & Sub-topics
            </label>
            {permissions.canEditSyllabus ? (
              <textarea
                rows={4}
                value={activeUnit.topics}
                onChange={e => handleUpdateUnit(selectedUnitIdx, 'topics', e.target.value)}
                className="w-full text-xs text-slate-800 leading-relaxed p-3 bg-[#F8FAFC] border border-[#CBD5E1] rounded focus:bg-white focus:outline-none focus:border-[#0F9D8A]"
                placeholder="List detailed topics, models, paradigms, and algorithmic bounds covered in this unit..."
              />
            ) : (
              <div className="p-3.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded text-xs text-slate-800 leading-relaxed">
                {activeUnit.topics}
              </div>
            )}
          </div>

          {/* Mapped Course Outcomes for this unit */}
          <div className="space-y-2 pt-2 border-t border-[#E2E8F0]">
            <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider">
              Mapped Course Learning Outcomes (CLOs)
            </label>
            <div className="flex flex-wrap gap-2">
              {course.courseOutcomes.map(co => {
                const isSelected = activeUnit.mappedCOs.includes(co.code);
                return (
                  <button
                    type="button"
                    key={co.code}
                    onClick={() => handleToggleUnitCO(selectedUnitIdx, co.code)}
                    disabled={!permissions.canEditSyllabus}
                    className={`px-3 py-1.5 rounded text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#1E3A5F] text-white border-[#1E3A5F]'
                        : 'bg-white text-slate-600 border-[#CBD5E1] hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <span className="font-mono font-bold">{co.code}</span>
                    <span className="text-[10px] opacity-80">({co.bloomsLevel})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pedagogical Methods */}
          <div className="space-y-2 pt-2 border-t border-[#E2E8F0]">
            <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider">
              Instructional & Pedagogical Delivery Methods
            </label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_PEDAGOGICAL_METHODS.map(method => {
                const isSelected = activeUnit.pedagogicalMethods.includes(method);
                return (
                  <button
                    type="button"
                    key={method}
                    onClick={() => handleTogglePedagogy(selectedUnitIdx, method)}
                    disabled={!permissions.canEditSyllabus}
                    className={`px-2.5 py-1 text-xs rounded border transition-colors ${
                      isSelected
                        ? 'bg-[#0F9D8A] text-white border-[#0F9D8A] font-semibold'
                        : 'bg-white text-slate-600 border-[#CBD5E1] hover:bg-[#F8FAFC]'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {method}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Bibliography & Prescribed Textbooks */}
      <div className="bg-white border border-[#CBD5E1] rounded-lg p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2">
            <Library className="w-4 h-4 text-[#1E3A5F]" />
            <h3 className="text-base font-bold text-[#1F2937] font-heading">
              Prescribed Textbooks & Reference Materials
            </h3>
          </div>
          {permissions.canEditSyllabus && (
            <button
              type="button"
              onClick={handleAddTextbook}
              className="px-3 py-1.5 bg-[#1E3A5F] hover:bg-[#152A45] text-white rounded text-xs font-medium flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Reference
            </button>
          )}
        </div>

        <div className="pt-4 divide-y divide-[#E2E8F0]">
          {course.textbooks.map((tb, idx) => (
            <div key={tb.id} className="py-3 flex items-start justify-between gap-4 first:pt-0 last:pb-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-500">[{idx + 1}]</span>
                  <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                    tb.isPrescribed ? 'bg-[#D5E3FF] text-[#1E3A5F]' : 'bg-[#F1F5F9] text-slate-600'
                  }`}>
                    {tb.isPrescribed ? 'Textbook' : 'Reference'}
                  </span>
                  <h4 className="text-xs font-bold text-[#1F2937]">{tb.title}</h4>
                </div>
                <p className="text-xs text-slate-600">
                  <strong className="text-slate-800">{tb.authors}</strong>, {tb.edition}, {tb.publisher}, {tb.year}
                  {tb.isbn && ` (ISBN: ${tb.isbn})`}
                </p>
              </div>

              {permissions.canEditSyllabus && (
                <button
                  type="button"
                  onClick={() => handleRemoveTextbook(tb.id)}
                  className="text-slate-400 hover:text-red-600 p-1"
                  title="Remove Textbook"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
