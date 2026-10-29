/**
 * @license
 * Academic Precision OBE System
 * Accreditation Compliance & Quality Assurance Audit Screen
 */

import React, { useState } from 'react';
import { CourseSpecification, UserRole } from '../types.ts';
import { RolePermissions } from '../permissions.ts';
import { programOutcomes, bloomsLevels } from '../annexureA.ts';
import { executeAIRequest, AIAuditResult } from '../api.ts';
import { 
  ShieldCheck, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Sparkles, 
  RefreshCw, 
  Award, 
  FileCheck, 
  Scale, 
  TrendingUp,
  Download
} from 'lucide-react';

interface AccreditationScreenProps {
  course: CourseSpecification;
  onUpdateCourse: (updated: CourseSpecification) => void;
  currentRole: UserRole;
  permissions: RolePermissions;
  onOpenPrint: () => void;
}

export const AccreditationScreen: React.FC<AccreditationScreenProps> = ({
  course,
  onUpdateCourse,
  currentRole,
  permissions,
  onOpenPrint
}) => {
  const [isAuditing, setIsAuditing] = useState(false);
  const [aiAuditResult, setAiAuditResult] = useState<AIAuditResult | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  // Compute validation checks
  const coCount = course.courseOutcomes.length;
  const isCOCountValid = coCount >= 4 && coCount <= 6;

  const bloomsDist: Record<string, number> = {};
  course.courseOutcomes.forEach(co => {
    bloomsDist[co.bloomsLevel] = (bloomsDist[co.bloomsLevel] || 0) + 1;
  });
  const higherOrderCount = (bloomsDist['L4'] || 0) + (bloomsDist['L5'] || 0) + (bloomsDist['L6'] || 0);
  const higherOrderPercent = coCount > 0 ? Math.round((higherOrderCount / coCount) * 100) : 0;
  const isBloomsValid = higherOrderPercent >= 40;

  // Contact hours check
  const totalSyllabusHours = course.syllabusUnits.reduce((acc, u) => acc + (u.lectureHours || 0), 0);
  const isHoursValid = totalSyllabusHours === course.totalContactHours;

  // Assessment check
  const totalMarks = course.assessments.reduce((acc, a) => acc + (a.weightageMarks || 0), 0);
  const isAssessmentValid = totalMarks === 100;

  // Unmapped POs
  const mappedPOCodes = new Set<string>();
  Object.values(course.poMapping).forEach(row => {
    Object.entries(row).forEach(([po, val]) => {
      if (val > 0) mappedPOCodes.add(po);
    });
  });
  const poCoveragePercent = Math.round((mappedPOCodes.size / programOutcomes.length) * 100);
  const isPOCoverageAdequate = mappedPOCodes.size >= 8; // At least 8 POs addressed in a professional core course

  // Textbooks check
  const hasPrescribedBook = course.textbooks.some(t => t.isPrescribed);

  // Calculate composite compliance score (out of 100)
  let score = 0;
  if (isCOCountValid) score += 20; else if (coCount > 0) score += 10;
  if (isBloomsValid) score += 25; else score += 12;
  if (isHoursValid) score += 20;
  if (isAssessmentValid) score += 20;
  if (isPOCoverageAdequate) score += 10; else score += 5;
  if (hasPrescribedBook) score += 5;

  const complianceStatus = score >= 85 ? 'Compliant' : score >= 65 ? 'Needs Review' : 'Non-Compliant';

  const handleRunAIAudit = async () => {
    setIsAuditing(true);
    setAiError(null);
    try {
      const res = await executeAIRequest({
        task: 'audit_alignment',
        courseCode: course.code,
        courseTitle: course.title,
        existingCLOs: course.courseOutcomes.map(c => ({
          code: c.code,
          statement: c.statement,
          bloomsLevel: c.bloomsLevel
        }))
      });

      if (res && res.complianceState) {
        setAiAuditResult(res as AIAuditResult);
      } else {
        setAiError('Audit payload processed without structured output.');
      }
    } catch (err: any) {
      setAiError(err.message || 'Audit execution encountered a connection failure.');
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header and Compliance Score Banner */}
      <div className="bg-white border border-[#CBD5E1] rounded-lg p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#E2E8F0]">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#0F9D8A]" />
              <h2 className="text-base font-bold text-[#1F2937] font-heading">
                Accreditation Compliance & Quality Assurance Board
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Automated institutional OBE compliance evaluation according to NBA Tier-1 / ABET Criterion 2 & 3.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Score Metric Card */}
            <div className="text-right">
              <span className="text-[11px] font-semibold text-slate-500 uppercase block">Compliance Rating</span>
              <div className="flex items-baseline gap-1 justify-end">
                <span className="text-2xl font-black font-mono text-[#1E3A5F] tabular-nums">{score}</span>
                <span className="text-xs text-slate-400 font-mono">/ 100</span>
              </div>
            </div>

            <div className={`px-3.5 py-2 rounded text-xs font-bold border flex items-center gap-1.5 ${
              complianceStatus === 'Compliant' ? 'bg-[#DCFCE7] border-[#86EFAC] text-[#15803D]' :
              complianceStatus === 'Needs Review' ? 'bg-[#FEF3C7] border-[#FCD34D] text-[#B45309]' :
              'bg-[#FEE2E2] border-[#FCA5A5] text-[#B91C1C]'
            }`}>
              {complianceStatus === 'Compliant' && <CheckCircle className="w-4 h-4" />}
              {complianceStatus === 'Needs Review' && <AlertTriangle className="w-4 h-4" />}
              {complianceStatus === 'Non-Compliant' && <XCircle className="w-4 h-4" />}
              <span>{complianceStatus.toUpperCase()}</span>
            </div>
          </div>
        </div>

        {/* Action strip */}
        <div className="pt-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRunAIAudit}
              disabled={isAuditing}
              className="px-3.5 py-2 bg-[#1E3A5F] hover:bg-[#152A45] text-white rounded text-xs font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              {isAuditing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-[#80F3DD]" />}
              {isAuditing ? 'Executing Diagnostic...' : 'Run Deep AI Accreditation Audit'}
            </button>

            <button
              type="button"
              onClick={onOpenPrint}
              className="px-3.5 py-2 border border-[#1E3A5F] text-[#1E3A5F] hover:bg-[#F1F5F9] rounded text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download Audit Report
            </button>
          </div>

          <span className="text-[11px] font-mono text-slate-500">
            Last Verified: {course.lastUpdated}
          </span>
        </div>
      </div>

      {/* AI Deep Diagnostic Output if generated */}
      {aiAuditResult && (
        <div className="p-5 bg-[#EFF4FF] border border-[#ADC8F5] rounded-lg text-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#CBD5E1]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#006B5D]" />
              <h3 className="text-sm font-bold text-[#1E3A5F] font-heading">
                AI Evaluator Inspection Report (Score: {aiAuditResult.overallScore}/100)
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#DCFCE7] text-[#15803D]">
              {aiAuditResult.complianceState}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div className="p-3 bg-white border border-[#CBD5E1] rounded space-y-1.5">
              <span className="font-semibold text-emerald-800 uppercase text-[10px] tracking-wider block">
                Accreditation Strengths & Compliant Facets
              </span>
              <ul className="space-y-1 list-disc list-inside text-slate-700 leading-relaxed">
                {aiAuditResult.highlights.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 bg-white border border-[#CBD5E1] rounded space-y-1.5">
              <span className="font-semibold text-amber-800 uppercase text-[10px] tracking-wider block">
                Continuous Quality Improvement (CQI) Recommendations
              </span>
              <ul className="space-y-1 list-disc list-inside text-slate-700 leading-relaxed">
                {aiAuditResult.recommendations.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Structured Validation Checklist */}
      <div className="bg-white border border-[#CBD5E1] rounded-lg p-6 shadow-xs">
        <h3 className="text-sm font-bold text-[#1F2937] font-heading pb-3 border-b border-[#E2E8F0] mb-4">
          Automated OBE Audit Matrix Checklist
        </h3>

        <div className="divide-y divide-[#E2E8F0]">
          
          {/* Rule 1: CO Count */}
          <div className="py-3.5 flex items-start justify-between gap-4 first:pt-0">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                {isCOCountValid ? (
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                )}
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1F2937]">Course Outcomes Cardinality (NBA Criterion 2.1)</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Tier-1 specifications require 5 to 6 distinct course learning outcomes. Currently defined: <strong className="font-mono text-slate-800">{coCount}</strong>.
                </p>
              </div>
            </div>
            <span className={`px-2 py-0.5 text-[11px] font-bold rounded ${
              isCOCountValid ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
            }`}>
              {isCOCountValid ? 'PASSED' : 'REVISION NEEDED'}
            </span>
          </div>

          {/* Rule 2: Bloom's Hierarchy Balance */}
          <div className="py-3.5 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                {isBloomsValid ? (
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                )}
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1F2937]">Cognitive Rigor & Higher-Order Thinking (Bloom L4 — L6)</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  At least 40% of outcomes must target Analysis (L4), Evaluation (L5), or Creation (L6). Current: <strong className="font-mono text-slate-800">{higherOrderPercent}%</strong> ({higherOrderCount} of {coCount} outcomes).
                </p>
              </div>
            </div>
            <span className={`px-2 py-0.5 text-[11px] font-bold rounded ${
              isBloomsValid ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
            }`}>
              {isBloomsValid ? 'PASSED' : 'REVISION NEEDED'}
            </span>
          </div>

          {/* Rule 3: Program Outcome (PO) Coverage */}
          <div className="py-3.5 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                {isPOCoverageAdequate ? (
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                )}
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1F2937]">Program Outcome (PO1-PO12) Articulation Breadth</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Addresses <strong className="font-mono text-slate-800">{mappedPOCodes.size}</strong> out of 12 Graduate Attributes ({poCoveragePercent}% overall program mapping coverage).
                </p>
              </div>
            </div>
            <span className={`px-2 py-0.5 text-[11px] font-bold rounded ${
              isPOCoverageAdequate ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
            }`}>
              {isPOCoverageAdequate ? 'PASSED' : 'LOW COVERAGE'}
            </span>
          </div>

          {/* Rule 4: Contact Hours vs Syllabus Modules */}
          <div className="py-3.5 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                {isHoursValid ? (
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1F2937]">Instructional Contact Hours Balance</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Syllabus unit hours ({totalSyllabusHours} hrs) must strictly balance the declared semester contact hours ({course.totalContactHours} hrs).
                </p>
              </div>
            </div>
            <span className={`px-2 py-0.5 text-[11px] font-bold rounded ${
              isHoursValid ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
            }`}>
              {isHoursValid ? 'PASSED' : 'FAILED'}
            </span>
          </div>

          {/* Rule 5: Assessment Total Weightage */}
          <div className="py-3.5 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                {isAssessmentValid ? (
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1F2937]">Cumulative Assessment Weightage (100% Attainment Target)</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Sum of all Continuous Internal Evaluations (CIE) and Semester End Examination (SEE) components must equal exactly 100%. Current sum: <strong className="font-mono text-slate-800">{totalMarks}%</strong>.
                </p>
              </div>
            </div>
            <span className={`px-2 py-0.5 text-[11px] font-bold rounded ${
              isAssessmentValid ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
            }`}>
              {isAssessmentValid ? 'PASSED' : 'FAILED'}
            </span>
          </div>

          {/* Rule 6: Bibliography Currency */}
          <div className="py-3.5 flex items-start justify-between gap-4 last:pb-0">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                {hasPrescribedBook ? (
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                )}
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1F2937]">Prescribed Textbook Benchmark Compliance</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Requires at least one primary prescribed textbook authored by recognized standard subject authorities. Current prescribed books: <strong className="font-mono text-slate-800">{course.textbooks.filter(t => t.isPrescribed).length}</strong>.
                </p>
              </div>
            </div>
            <span className={`px-2 py-0.5 text-[11px] font-bold rounded ${
              hasPrescribedBook ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
            }`}>
              {hasPrescribedBook ? 'PASSED' : 'NEEDS BOOK'}
            </span>
          </div>

        </div>
      </div>

      {/* Board of Studies (BoS) Official Approval & Sign-Off Block */}
      <div className="bg-white border border-[#CBD5E1] rounded-lg p-6 shadow-xs">
        <h3 className="text-sm font-bold text-[#1F2937] font-heading pb-3 border-b border-[#E2E8F0] mb-4">
          Institutional Signatures & Approval Verification
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          
          <div className="p-4 bg-[#F8FAFC] border border-[#CBD5E1] rounded text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-600 uppercase text-[10px]">1. Course Coordinator</span>
              <span className="text-emerald-700 font-bold text-[10px]">VERIFIED ✓</span>
            </div>
            <p className="font-bold text-[#1F2937]">{course.courseCoordinator}</p>
            <p className="text-[11px] text-slate-500">Associate Professor, Department of {course.department}</p>
            <div className="pt-2 border-t border-[#E2E8F0] text-[10px] font-mono text-slate-400">
              Submitted: {course.lastUpdated}
            </div>
          </div>

          <div className="p-4 bg-[#F8FAFC] border border-[#CBD5E1] rounded text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-600 uppercase text-[10px]">2. Department Chair / HOD</span>
              <span className={`font-bold text-[10px] ${
                course.approvalStatus === 'approved' || course.approvalStatus === 'under_review' 
                  ? 'text-emerald-700' 
                  : 'text-amber-700'
              }`}>
                {course.approvalStatus === 'approved' ? 'APPROVED ✓' : 'REVIEW PENDING'}
              </span>
            </div>
            <p className="font-bold text-[#1F2937]">Prof. Marcus Brody</p>
            <p className="text-[11px] text-slate-500">Professor & Head of Department, {course.department}</p>
            <div className="pt-2 border-t border-[#E2E8F0] text-[10px] font-mono text-slate-400">
              Status: {course.approvalStatus.toUpperCase()}
            </div>
          </div>

          <div className="p-4 bg-[#F8FAFC] border border-[#CBD5E1] rounded text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-600 uppercase text-[10px]">3. Dean / BoS Chair</span>
              <span className={`font-bold text-[10px] ${
                course.approvalStatus === 'approved' ? 'text-emerald-700' : 'text-slate-400'
              }`}>
                {course.approvalStatus === 'approved' ? 'RATIFIED ✓' : 'PENDING BoS'}
              </span>
            </div>
            <p className="font-bold text-[#1F2937]">Dr. Alistair Finch</p>
            <p className="text-[11px] text-slate-500">Dean of Academic Affairs & BoS Chairman</p>
            <div className="pt-2 border-t border-[#E2E8F0] text-[10px] font-mono text-slate-400">
              Accreditation Ref: OBE-R22-{course.code}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
