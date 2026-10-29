/**
 * @license
 * Academic Precision OBE System
 * Course Specification Overview & Metadata Screen
 */

import React, { useState } from 'react';
import { CourseSpecification, UserRole } from '../types.ts';
import { RolePermissions } from '../permissions.ts';
import { 
  BookText, 
  Clock, 
  Award, 
  Layers, 
  Send, 
  CheckCircle, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  MessageSquare,
  FileCheck2,
  Calendar,
  Building
} from 'lucide-react';

interface OverviewScreenProps {
  course: CourseSpecification;
  onUpdateCourse: (updated: CourseSpecification) => void;
  currentRole: UserRole;
  permissions: RolePermissions;
}

export const OverviewScreen: React.FC<OverviewScreenProps> = ({
  course,
  onUpdateCourse,
  currentRole,
  permissions
}) => {
  const [newObjective, setNewObjective] = useState('');
  const [newPrereq, setNewPrereq] = useState('');
  const [commentText, setCommentText] = useState('');

  const handleFieldChange = (field: keyof CourseSpecification, val: any) => {
    onUpdateCourse({
      ...course,
      [field]: val,
      lastUpdated: new Date().toISOString().split('T')[0]
    });
  };

  const handleCreditsChange = (type: 'lectureHours' | 'tutorialHours' | 'practicalHours', val: number) => {
    const lecture = type === 'lectureHours' ? val : course.lectureHours;
    const tutorial = type === 'tutorialHours' ? val : course.tutorialHours;
    const practical = type === 'practicalHours' ? val : course.practicalHours;
    // Standard autonomous credit formula: L + T + (P/2)
    const totalCredits = lecture + tutorial + Math.floor(practical / 2);
    const totalContactHours = (lecture + tutorial + practical) * 15; // 15 week instructional semester

    onUpdateCourse({
      ...course,
      [type]: val,
      totalCredits,
      totalContactHours,
      lastUpdated: new Date().toISOString().split('T')[0]
    });
  };

  const handleAddObjective = () => {
    if (!newObjective.trim()) return;
    onUpdateCourse({
      ...course,
      objectives: [...course.objectives, newObjective.trim()],
      lastUpdated: new Date().toISOString().split('T')[0]
    });
    setNewObjective('');
  };

  const handleRemoveObjective = (idx: number) => {
    const updated = [...course.objectives];
    updated.splice(idx, 1);
    onUpdateCourse({
      ...course,
      objectives: updated,
      lastUpdated: new Date().toISOString().split('T')[0]
    });
  };

  const handleAddPrereq = () => {
    if (!newPrereq.trim()) return;
    onUpdateCourse({
      ...course,
      prerequisites: [...course.prerequisites, newPrereq.trim()],
      lastUpdated: new Date().toISOString().split('T')[0]
    });
    setNewPrereq('');
  };

  const handleRemovePrereq = (idx: number) => {
    const updated = [...course.prerequisites];
    updated.splice(idx, 1);
    onUpdateCourse({
      ...course,
      prerequisites: updated,
      lastUpdated: new Date().toISOString().split('T')[0]
    });
  };

  const handleWorkflowAction = (newStatus: CourseSpecification['approvalStatus'], message: string) => {
    const newComment = {
      id: `wc_${Date.now()}`,
      author: currentRole === 'faculty' ? course.courseCoordinator : currentRole === 'hod' ? 'Prof. Marcus Brody (HOD)' : 'Board of Studies Dean',
      role: currentRole,
      date: new Date().toISOString().split('T')[0],
      message,
      statusChange: newStatus
    };

    onUpdateCourse({
      ...course,
      approvalStatus: newStatus,
      workflowComments: [...course.workflowComments, newComment],
      lastUpdated: new Date().toISOString().split('T')[0]
    });
    setCommentText('');
  };

  const steps = [
    { key: 'draft', label: 'Faculty Draft' },
    { key: 'submitted', label: 'Faculty Submitted' },
    { key: 'under_review', label: 'HOD / BoS Review' },
    { key: 'approved', label: 'Accreditation Approved' }
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'draft': return 0;
      case 'submitted': return 1;
      case 'under_review': return 2;
      case 'approved': return 3;
      case 'revision_requested': return 1;
      default: return 0;
    }
  };

  const currentStepIdx = getStepIndex(course.approvalStatus);

  return (
    <div className="space-y-6">
      
      {/* Top Specification Header Card */}
      <div className="bg-white border border-[#CBD5E1] rounded-lg p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E2E8F0]">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 bg-[#1E3A5F] text-white font-mono text-sm font-bold rounded">
                {course.code}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 bg-[#EFF4FF] text-[#1E3A5F] border border-[#CBD5E1] rounded">
                {course.regulation}
              </span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${
                course.approvalStatus === 'approved' ? 'bg-[#DCFCE7] border-[#86EFAC] text-[#15803D]' :
                course.approvalStatus === 'under_review' ? 'bg-[#FEF3C7] border-[#FCD34D] text-[#B45309]' :
                course.approvalStatus === 'revision_requested' ? 'bg-[#FEE2E2] border-[#FCA5A5] text-[#B91C1C]' :
                'bg-[#F1F5F9] border-[#CBD5E1] text-[#1E3A5F]'
              }`}>
                Status: {course.approvalStatus.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            
            {permissions.canEditDetails ? (
              <input
                type="text"
                value={course.title}
                onChange={e => handleFieldChange('title', e.target.value)}
                className="text-xl font-bold font-heading text-[#1F2937] tracking-tight w-full max-w-xl border-b border-transparent hover:border-[#CBD5E1] focus:border-[#0F9D8A] focus:outline-none"
              />
            ) : (
              <h1 className="text-xl font-bold font-heading text-[#1F2937] tracking-tight">
                {course.title}
              </h1>
            )}
            
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                {course.department}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                AY {course.academicYear} (Semester {course.semester})
              </span>
              <span>•</span>
              <span>Version: <strong className="font-mono text-slate-700">{course.version}</strong></span>
            </p>
          </div>

          {/* Quick Workflow Action */}
          <div className="flex items-center gap-2 self-start md:self-center shrink-0">
            {permissions.canSubmitForReview && (
              <button
                type="button"
                onClick={() => handleWorkflowAction('submitted', 'Course specification draft submitted for department chair review.')}
                className="px-3.5 py-2 bg-[#0F9D8A] hover:bg-[#0B8070] text-white rounded text-xs font-medium flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                Submit to Chair
              </button>
            )}

            {permissions.canApproveOrReject && (
              <>
                <button
                  type="button"
                  onClick={() => handleWorkflowAction('revision_requested', 'Revisions requested in CLO articulation mapping.')}
                  className="px-3 py-2 border border-[#DC2626] text-[#DC2626] hover:bg-[#FEE2E2] rounded text-xs font-medium transition-colors"
                >
                  Request Revision
                </button>
                <button
                  type="button"
                  onClick={() => handleWorkflowAction('approved', 'Accreditation board sign-off complete. Specification locked for BoS publication.')}
                  className="px-3.5 py-2 bg-[#1E3A5F] hover:bg-[#152A45] text-white rounded text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-[#80F3DD]" />
                  Approve Specification
                </button>
              </>
            )}
          </div>
        </div>

        {/* Accreditation Progress Stepper */}
        <div className="pt-6">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-3 left-0 right-0 h-0.5 bg-[#E2E8F0] -z-0" />
            {steps.map((st, i) => {
              const isCompleted = i < currentStepIdx || course.approvalStatus === 'approved';
              const isCurrent = i === currentStepIdx && course.approvalStatus !== 'approved';
              return (
                <div key={st.key} className="relative z-10 flex flex-col items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isCompleted 
                      ? 'bg-[#1E3A5F] text-white' 
                      : isCurrent 
                      ? 'border-2 border-[#0F9D8A] bg-white text-[#0F9D8A]' 
                      : 'border border-[#CBD5E1] bg-white text-slate-400'
                  }`}>
                    {isCompleted ? '✓' : i + 1}
                  </div>
                  <span className={`text-[11px] font-semibold mt-1.5 ${
                    isCurrent ? 'text-[#0F9D8A]' : isCompleted ? 'text-[#1E3A5F]' : 'text-slate-400'
                  }`}>
                    {st.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid: Credit Distribution & General Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Credit Breakdown Card */}
        <div className="bg-white border border-[#CBD5E1] rounded-lg p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#1E3A5F]" />
                <h3 className="text-sm font-semibold text-[#1F2937] font-heading">
                  Credit & Hours Distribution
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-500">Autonomous R22</span>
            </div>

            <div className="grid grid-cols-4 gap-2 pt-4 text-center">
              <div className="p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded">
                <span className="block text-[11px] font-semibold text-slate-500 uppercase">L (Lecture)</span>
                {permissions.canEditDetails ? (
                  <input
                    type="number"
                    min="0"
                    max="6"
                    value={course.lectureHours}
                    onChange={e => handleCreditsChange('lectureHours', parseInt(e.target.value) || 0)}
                    className="w-12 mx-auto text-lg font-bold text-[#1E3A5F] text-center bg-transparent border-b border-[#CBD5E1] focus:border-[#0F9D8A] tabular-nums"
                  />
                ) : (
                  <span className="text-lg font-bold text-[#1E3A5F] tabular-nums">{course.lectureHours}</span>
                )}
                <span className="text-[10px] text-slate-400 block mt-0.5">hrs/wk</span>
              </div>

              <div className="p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded">
                <span className="block text-[11px] font-semibold text-slate-500 uppercase">T (Tutorial)</span>
                {permissions.canEditDetails ? (
                  <input
                    type="number"
                    min="0"
                    max="4"
                    value={course.tutorialHours}
                    onChange={e => handleCreditsChange('tutorialHours', parseInt(e.target.value) || 0)}
                    className="w-12 mx-auto text-lg font-bold text-[#1E3A5F] text-center bg-transparent border-b border-[#CBD5E1] focus:border-[#0F9D8A] tabular-nums"
                  />
                ) : (
                  <span className="text-lg font-bold text-[#1E3A5F] tabular-nums">{course.tutorialHours}</span>
                )}
                <span className="text-[10px] text-slate-400 block mt-0.5">hrs/wk</span>
              </div>

              <div className="p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded">
                <span className="block text-[11px] font-semibold text-slate-500 uppercase">P (Practical)</span>
                {permissions.canEditDetails ? (
                  <input
                    type="number"
                    min="0"
                    max="6"
                    value={course.practicalHours}
                    onChange={e => handleCreditsChange('practicalHours', parseInt(e.target.value) || 0)}
                    className="w-12 mx-auto text-lg font-bold text-[#1E3A5F] text-center bg-transparent border-b border-[#CBD5E1] focus:border-[#0F9D8A] tabular-nums"
                  />
                ) : (
                  <span className="text-lg font-bold text-[#1E3A5F] tabular-nums">{course.practicalHours}</span>
                )}
                <span className="text-[10px] text-slate-400 block mt-0.5">hrs/wk</span>
              </div>

              <div className="p-2.5 bg-[#EFF4FF] border border-[#CBD5E1] rounded">
                <span className="block text-[11px] font-bold text-[#1E3A5F] uppercase">C (Credits)</span>
                <span className="text-xl font-bold text-[#0F9D8A] tabular-nums">{course.totalCredits}</span>
                <span className="text-[10px] text-[#1E3A5F] block mt-0.5 font-medium">Credits</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs">
            <span className="text-slate-600">Total Instructional Contact Hours:</span>
            <span className="font-mono font-bold text-[#1E3A5F] text-sm tabular-nums">
              {course.totalContactHours} Hours
            </span>
          </div>
        </div>

        {/* Prerequisites Card */}
        <div className="bg-white border border-[#CBD5E1] rounded-lg p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#1E3A5F]" />
                <h3 className="text-sm font-semibold text-[#1F2937] font-heading">
                  Curricular Prerequisites
                </h3>
              </div>
              <span className="text-[11px] text-slate-500">{course.prerequisites.length} Required</span>
            </div>

            <div className="pt-3 flex flex-wrap gap-2">
              {course.prerequisites.map((req, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#F1F5F9] border border-[#CBD5E1] text-[#1E3A5F] text-xs font-medium rounded"
                >
                  {req}
                  {permissions.canEditDetails && (
                    <button
                      type="button"
                      onClick={() => handleRemovePrereq(idx)}
                      className="text-slate-400 hover:text-red-600"
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
              {course.prerequisites.length === 0 && (
                <p className="text-xs text-slate-400 italic">No formal prerequisite registered.</p>
              )}
            </div>
          </div>

          {permissions.canEditDetails && (
            <div className="mt-3 pt-3 border-t border-[#E2E8F0] flex gap-2">
              <input
                type="text"
                value={newPrereq}
                onChange={e => setNewPrereq(e.target.value)}
                placeholder="e.g. CS201 Data Structures"
                className="flex-1 text-xs px-2.5 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded focus:bg-white focus:outline-none focus:border-[#0F9D8A]"
              />
              <button
                type="button"
                onClick={handleAddPrereq}
                className="px-2.5 py-1.5 bg-[#1E3A5F] text-white text-xs rounded hover:bg-[#152A45]"
              >
                Add
              </button>
            </div>
          )}
        </div>

        {/* Course Coordinator & Accreditation Card */}
        <div className="bg-white border border-[#CBD5E1] rounded-lg p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-[#1E3A5F]" />
                <h3 className="text-sm font-semibold text-[#1F2937] font-heading">
                  Course Administration
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-500">Tier-1 BoS</span>
            </div>

            <div className="pt-3 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
                <span className="text-slate-500">Course Coordinator:</span>
                <span className="font-semibold text-[#1F2937]">{course.courseCoordinator}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
                <span className="text-slate-500">Department:</span>
                <span className="font-medium text-[#1F2937]">{course.department}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
                <span className="text-slate-500">Course Category:</span>
                <span className="font-medium text-[#1E3A5F]">{course.category}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
                <span className="text-slate-500">Last Modified Date:</span>
                <span className="font-mono text-slate-600">{course.lastUpdated}</span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-[#E2E8F0]">
            <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 block text-center font-medium">
              ✓ Complies with NBA Criterion 2 & 3 Course Guidelines
            </span>
          </div>
        </div>

      </div>

      {/* Course Objectives */}
      <div className="bg-white border border-[#CBD5E1] rounded-lg p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
          <div>
            <h3 className="text-base font-bold text-[#1F2937] font-heading">
              Course Educational Objectives (CEOs)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              High-level institutional intent stating what the instructional staff seeks to impart through the semester.
            </p>
          </div>
          <span className="text-xs font-mono font-semibold px-2 py-0.5 bg-[#F1F5F9] border border-[#CBD5E1] text-[#1E3A5F] rounded">
            {course.objectives.length} Objectives Defined
          </span>
        </div>

        <div className="pt-4 space-y-3">
          {course.objectives.map((obj, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded group hover:border-[#CBD5E1] transition-colors">
              <span className="px-2 py-0.5 bg-[#1E3A5F] text-white text-xs font-mono font-bold rounded shrink-0">
                CEO {idx + 1}
              </span>
              <p className="text-xs text-slate-700 leading-relaxed flex-1 pt-0.5">
                {obj}
              </p>
              {permissions.canEditDetails && (
                <button
                  type="button"
                  onClick={() => handleRemoveObjective(idx)}
                  className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-600 transition-opacity p-1"
                  title="Remove Objective"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}

          {permissions.canEditDetails && (
            <div className="pt-2 flex gap-2">
              <input
                type="text"
                value={newObjective}
                onChange={e => setNewObjective(e.target.value)}
                placeholder="To articulate algorithmic bounds and formulate computational optimization strategies..."
                className="flex-1 text-xs px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded focus:bg-white focus:outline-none focus:border-[#0F9D8A]"
              />
              <button
                type="button"
                onClick={handleAddObjective}
                className="px-4 py-2 bg-[#1E3A5F] hover:bg-[#152A45] text-white text-xs font-medium rounded flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Add CEO
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Review Comments & BoS Sign-off History */}
      <div className="bg-white border border-[#CBD5E1] rounded-lg p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#1E3A5F]" />
            <h3 className="text-base font-bold text-[#1F2937] font-heading">
              Curricular Review Log & BoS Workflow Notes
            </h3>
          </div>
          <span className="text-xs text-slate-500">{course.workflowComments.length} Audited Entries</span>
        </div>

        <div className="pt-4 space-y-3">
          {course.workflowComments.map(c => (
            <div key={c.id} className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[#1F2937] flex items-center gap-1.5">
                  {c.author}
                  <span className="text-[10px] px-1.5 py-0.2 bg-white border border-[#CBD5E1] text-[#1E3A5F] rounded uppercase">
                    {c.role}
                  </span>
                </span>
                <span className="text-[11px] font-mono text-slate-400">{c.date}</span>
              </div>
              <p className="text-slate-700 leading-relaxed pt-0.5">{c.message}</p>
            </div>
          ))}

          {/* Add reviewer comment if in HOD/Auditor role */}
          {(currentRole === 'hod' || currentRole === 'dean' || currentRole === 'auditor') && (
            <div className="pt-2 flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder="Enter audit review observation or recommendation..."
                className="flex-1 text-xs px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded focus:bg-white focus:outline-none focus:border-[#0F9D8A]"
              />
              <button
                type="button"
                onClick={() => {
                  if (!commentText.trim()) return;
                  handleWorkflowAction(course.approvalStatus, commentText.trim());
                }}
                className="px-4 py-2 bg-[#0F9D8A] hover:bg-[#0B8070] text-white text-xs font-medium rounded"
              >
                Post Review Note
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
