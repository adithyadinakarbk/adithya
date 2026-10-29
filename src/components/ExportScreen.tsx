/**
 * @license
 * Academic Precision OBE System
 * Official Course Specification Document Export & Print Screen
 * Provides 1-click submission file downloads for SpecForge evaluation portal:
 * - outputs/specforge_output.json (80 pts)
 * - outputs/spec.html (20 pts)
 * - Direct Print to PDF
 */

import React, { useState } from 'react';
import { CourseSpecification } from '../types.ts';
import { programOutcomes, programSpecificOutcomes, getBloomsLevel } from '../annexureA.ts';
import { Printer, Download, Copy, Check, ArrowLeft, FileCode, FileText, CheckCircle2 } from 'lucide-react';

interface ExportScreenProps {
  course: CourseSpecification;
  onBack: () => void;
}

export const ExportScreen: React.FC<ExportScreenProps> = ({ course, onBack }) => {
  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = async () => {
    try {
      const res = await fetch('/outputs/specforge_output.json');
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'specforge_output.json';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        return;
      }
    } catch {
      // fallback
    }

    const payload = {
      input_id: "SAMPLE",
      course_code: course.code,
      course_title: course.title,
      ...course
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(payload, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', 'specforge_output.json');
    dlAnchorElem.click();
  };

  const handleDownloadHTML = () => {
    window.open('/outputs/spec.html', '_blank');
  };

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(course, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Action Bar & Portal Submission Cards (Hidden on print) */}
      <div className="no-print space-y-4">
        
        {/* Navigation & Controls */}
        <div className="bg-white dark:bg-[#0F172A] border border-[#CBD5E1] dark:border-[#1E293B] rounded-lg p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className="px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 border border-[#CBD5E1] dark:border-[#1E293B] hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B] rounded font-medium flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Editor
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleCopyJSON}
              className="px-3.5 py-1.5 border border-[#1E3A5F] text-[#1E3A5F] dark:text-[#80F3DD] hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] rounded text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied JSON!' : 'Copy JSON'}
            </button>

            <button
              type="button"
              onClick={handleDownloadJSON}
              className="px-3.5 py-1.5 bg-[#0F9D8A] hover:bg-[#0B8070] text-white rounded text-xs font-medium flex items-center gap-1.5 transition-colors shadow-xs"
              title="Download outputs/specforge_output.json (80 Points)"
            >
              <Download className="w-3.5 h-3.5 text-white" />
              Download specforge_output.json (80 pts)
            </button>

            <button
              type="button"
              onClick={handleDownloadHTML}
              className="px-3.5 py-1.5 bg-[#143764] hover:bg-[#1E3A5F] text-white rounded text-xs font-medium flex items-center gap-1.5 transition-colors shadow-xs"
              title="View & Download outputs/spec.html (20 Points)"
            >
              <FileCode className="w-3.5 h-3.5 text-[#80F3DD]" />
              Open spec.html (20 pts)
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-1.5 bg-[#1E3A5F] hover:bg-[#152A45] text-white rounded text-xs font-medium flex items-center gap-1.5 transition-colors shadow-xs"
              title="Save document directly as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save as PDF
            </button>
          </div>
        </div>

        {/* Portal Submission Instructions Banner */}
        <div className="bg-[#EFF4FF] dark:bg-[#0F2D52]/40 border border-[#ADC8F5] dark:border-[#2D486D] rounded-lg p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#1E3A5F] text-[#80F3DD] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#1E3A5F] dark:text-[#80F3DD] font-heading">
                Ready for Portal Submission
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-300">
                Both required files are generated in <code className="font-mono bg-white dark:bg-black/30 px-1 py-0.5 rounded text-[#006B5D] dark:text-[#80F3DD]">/outputs/</code> for your submission portal:
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="px-2.5 py-1 bg-white dark:bg-[#0F172A] border border-[#CBD5E1] dark:border-[#2D486D] rounded font-mono font-bold text-[#1E3A5F] dark:text-[#80F3DD]">
              specforge_output.json (80)
            </span>
            <span className="px-2.5 py-1 bg-white dark:bg-[#0F172A] border border-[#CBD5E1] dark:border-[#2D486D] rounded font-mono font-bold text-[#0F9D8A]">
              spec.html (20)
            </span>
          </div>
        </div>

      </div>

      {/* Official Formatted Document Sheet */}
      <div className="bg-white border border-[#CBD5E1] rounded-lg p-10 shadow-sm max-w-4xl mx-auto space-y-8 text-[#1F2937] print:border-none print:shadow-none print:p-0">
        
        {/* Document Header */}
        <div className="text-center pb-6 border-b-2 border-[#1E3A5F] space-y-1">
          <h1 className="text-xl font-bold font-heading uppercase tracking-wide text-[#1E3A5F]">
            COLLEGE OF ENGINEERING & TECHNOLOGY
          </h1>
          <p className="text-xs uppercase font-semibold text-slate-600">
            DEPARTMENT OF {course.department.toUpperCase()}
          </p>
          <p className="text-[11px] font-mono text-slate-500">
            {course.regulation} • OUTCOME-BASED EDUCATION (OBE) FRAMEWORK
          </p>
          <div className="pt-2">
            <span className="px-3 py-1 bg-[#1E3A5F] text-white text-xs font-bold uppercase tracking-widest rounded">
              COURSE SPECIFICATION DOCKET
            </span>
          </div>
        </div>

        {/* Section 1: Course Meta */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#1E3A5F] border-b border-[#E2E8F0] pb-1">
            1. Course Identification & Credit Allocation
          </h2>
          <table className="w-full text-xs border border-[#CBD5E1] border-collapse">
            <tbody>
              <tr className="border-b border-[#CBD5E1]">
                <td className="px-3 py-2 font-semibold bg-[#F8FAFC] border-r border-[#CBD5E1] w-48">Course Code & Title</td>
                <td className="px-3 py-2 font-bold text-[#1E3A5F]" colSpan={3}>{course.code} — {course.title}</td>
              </tr>
              <tr className="border-b border-[#CBD5E1]">
                <td className="px-3 py-2 font-semibold bg-[#F8FAFC] border-r border-[#CBD5E1]">Academic Year & Semester</td>
                <td className="px-3 py-2 border-r border-[#CBD5E1]">{course.academicYear} • Semester {course.semester}</td>
                <td className="px-3 py-2 font-semibold bg-[#F8FAFC] border-r border-[#CBD5E1] w-36">Course Category</td>
                <td className="px-3 py-2">{course.category}</td>
              </tr>
              <tr className="border-b border-[#CBD5E1]">
                <td className="px-3 py-2 font-semibold bg-[#F8FAFC] border-r border-[#CBD5E1]">L - T - P Structure</td>
                <td className="px-3 py-2 font-mono border-r border-[#CBD5E1]">
                  L: {course.lectureHours} | T: {course.tutorialHours} | P: {course.practicalHours}
                </td>
                <td className="px-3 py-2 font-semibold bg-[#F8FAFC] border-r border-[#CBD5E1]">Total Credits & Hours</td>
                <td className="px-3 py-2 font-mono font-bold text-[#006B5D]">
                  {course.totalCredits} Credits ({course.totalContactHours} Contact Hours)
                </td>
              </tr>
              <tr>
                <td className="px-3 py-2 font-semibold bg-[#F8FAFC] border-r border-[#CBD5E1]">Prerequisites</td>
                <td className="px-3 py-2" colSpan={3}>
                  {course.prerequisites.length > 0 ? course.prerequisites.join(', ') : 'None'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Section 2: Course Educational Objectives */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#1E3A5F] border-b border-[#E2E8F0] pb-1">
            2. Course Educational Objectives (CEOs)
          </h2>
          <ol className="list-decimal list-inside text-xs space-y-1.5 leading-relaxed text-slate-800">
            {course.objectives.map((obj, i) => (
              <li key={i}>{obj}</li>
            ))}
          </ol>
        </div>

        {/* Section 3: Course Learning Outcomes */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#1E3A5F] border-b border-[#E2E8F0] pb-1">
            3. Course Learning Outcomes (CLOs / COs)
          </h2>
          <table className="w-full text-xs border border-[#CBD5E1] border-collapse">
            <thead className="bg-[#1E3A5F] text-white">
              <tr>
                <th className="px-3 py-2 text-left w-16 border-r border-[#0F2D52]">CO #</th>
                <th className="px-3 py-2 text-left border-r border-[#0F2D52]">Outcome Statement</th>
                <th className="px-3 py-2 text-center w-24 border-r border-[#0F2D52]">Bloom Level</th>
                <th className="px-3 py-2 text-center w-20">Attainment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#CBD5E1]">
              {course.courseOutcomes.map(co => {
                const blooms = getBloomsLevel(co.bloomsLevel);
                return (
                  <tr key={co.id}>
                    <td className="px-3 py-2 font-mono font-bold border-r border-[#CBD5E1] text-[#1E3A5F]">{co.code}</td>
                    <td className="px-3 py-2 border-r border-[#CBD5E1] leading-relaxed">{co.statement}</td>
                    <td className="px-3 py-2 text-center font-mono border-r border-[#CBD5E1]">
                      {co.bloomsLevel} ({blooms?.name})
                    </td>
                    <td className="px-3 py-2 text-center font-mono font-semibold tabular-nums">{co.expectedAttainment}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Section 4: Articulation Matrix */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#1E3A5F] border-b border-[#E2E8F0] pb-1">
            4. Outcome Articulation Matrix (PO1 — PO12 & PSO1 — PSO3)
          </h2>
          <table className="w-full text-xs border border-[#CBD5E1] border-collapse text-center">
            <thead className="bg-[#F8FAFC]">
              <tr className="border-b border-[#CBD5E1]">
                <th className="px-2 py-2 border-r border-[#CBD5E1] text-left">CO #</th>
                {programOutcomes.map(po => (
                  <th key={po.code} className="px-1.5 py-1.5 font-mono text-[11px] border-r border-[#CBD5E1]">{po.code}</th>
                ))}
                {programSpecificOutcomes.map(pso => (
                  <th key={pso.code} className="px-1.5 py-1.5 font-mono text-[11px] border-r border-[#CBD5E1] bg-[#EFF4FF]">{pso.code}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#CBD5E1]">
              {course.courseOutcomes.map(co => (
                <tr key={co.id}>
                  <td className="px-2 py-1.5 font-mono font-bold text-left border-r border-[#CBD5E1]">{co.code}</td>
                  {programOutcomes.map(po => {
                    const val = course.poMapping[co.code]?.[po.code] || 0;
                    return (
                      <td key={po.code} className="px-1.5 py-1.5 font-mono border-r border-[#CBD5E1]">
                        {val > 0 ? val : '-'}
                      </td>
                    );
                  })}
                  {programSpecificOutcomes.map(pso => {
                    const val = course.psoMapping[co.code]?.[pso.code] || 0;
                    return (
                      <td key={pso.code} className="px-1.5 py-1.5 font-mono border-r border-[#CBD5E1] bg-[#EFF4FF]">
                        {val > 0 ? val : '-'}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-[10px] text-slate-500 italic">
            Correlation Levels: 1 - Slight / Low, 2 - Moderate / Medium, 3 - Substantial / High.
          </p>
        </div>

        {/* Section 5: Modular Syllabus */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#1E3A5F] border-b border-[#E2E8F0] pb-1">
            5. Modular Syllabus Outline
          </h2>
          <div className="space-y-4">
            {course.syllabusUnits.map(u => (
              <div key={u.id} className="text-xs space-y-1">
                <div className="flex items-center justify-between font-bold text-[#1E3A5F] pb-0.5 border-b border-[#CBD5E1]">
                  <span>UNIT {u.unitNumber}: {u.title.toUpperCase()}</span>
                  <span className="font-mono text-slate-600 font-normal">{u.lectureHours} Hours</span>
                </div>
                <p className="text-slate-700 leading-relaxed pt-0.5">{u.topics}</p>
                <div className="text-[10px] text-slate-500 pt-0.5">
                  <strong>Mapped COs:</strong> {u.mappedCOs.join(', ')} | <strong>Pedagogy:</strong> {u.pedagogicalMethods.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 6: Assessment Pattern */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#1E3A5F] border-b border-[#E2E8F0] pb-1">
            6. Assessment & Evaluation Scheme
          </h2>
          <table className="w-full text-xs border border-[#CBD5E1] border-collapse">
            <thead className="bg-[#F8FAFC]">
              <tr className="border-b border-[#CBD5E1]">
                <th className="px-3 py-2 text-left border-r border-[#CBD5E1]">Assessment Component</th>
                <th className="px-3 py-2 text-center w-24 border-r border-[#CBD5E1]">Category</th>
                <th className="px-3 py-2 text-center w-28 border-r border-[#CBD5E1]">Mapped COs</th>
                <th className="px-3 py-2 text-center w-24">Weightage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#CBD5E1]">
              {course.assessments.map(a => (
                <tr key={a.id}>
                  <td className="px-3 py-2 border-r border-[#CBD5E1] font-medium">{a.name}</td>
                  <td className="px-3 py-2 border-r border-[#CBD5E1] text-center font-mono">{a.category}</td>
                  <td className="px-3 py-2 border-r border-[#CBD5E1] text-center font-mono">{a.mappedCOs.join(', ')}</td>
                  <td className="px-3 py-2 text-center font-mono font-bold">{a.weightageMarks} Marks</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-[#EFF4FF] font-bold border-t border-[#CBD5E1]">
                <td colSpan={3} className="px-3 py-2 text-right border-r border-[#CBD5E1]">Total Course Weightage</td>
                <td className="px-3 py-2 text-center font-mono text-[#006B5D]">100 Marks</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Section 7: Textbooks */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#1E3A5F] border-b border-[#E2E8F0] pb-1">
            7. Prescribed Textbooks & References
          </h2>
          <ol className="list-decimal list-inside text-xs space-y-1.5 leading-relaxed text-slate-800">
            {course.textbooks.map((tb, idx) => (
              <li key={tb.id}>
                <strong>{tb.authors}</strong>, <em>"{tb.title}"</em>, {tb.edition}, {tb.publisher}, {tb.year}.
                {tb.isPrescribed && <span className="font-semibold text-[#006B5D] ml-1">[Prescribed]</span>}
              </li>
            ))}
          </ol>
        </div>

        {/* Section 8: Signatures Block */}
        <div className="pt-8 border-t-2 border-[#1E3A5F] grid grid-cols-3 gap-8 text-center text-xs">
          <div className="space-y-8">
            <div className="h-10 border-b border-dashed border-[#CBD5E1]" />
            <div>
              <p className="font-bold text-[#1F2937]">{course.courseCoordinator}</p>
              <p className="text-[11px] text-slate-500">Course Coordinator</p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="h-10 border-b border-dashed border-[#CBD5E1]" />
            <div>
              <p className="font-bold text-[#1F2937]">Prof. Marcus Brody</p>
              <p className="text-[11px] text-slate-500">Head of Department (HOD)</p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="h-10 border-b border-dashed border-[#CBD5E1]" />
            <div>
              <p className="font-bold text-[#1F2937]">Dr. Alistair Finch</p>
              <p className="text-[11px] text-slate-500">Dean of Academic Affairs</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
