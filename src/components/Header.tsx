/**
 * @license
 * Academic Precision OBE System
 * Top Navigation Header with Role Switcher, Course Selector, Dark Mode, and Reference Trigger
 */

import React from 'react';
import { CourseSpecification, UserRole } from '../types.ts';
import { RolePermissions } from '../permissions.ts';
import { 
  GraduationCap, 
  ShieldCheck, 
  BookOpen, 
  Settings as SettingsIcon, 
  Printer, 
  ChevronDown, 
  Sun, 
  Moon,
  Sparkles,
  Zap
} from 'lucide-react';

interface HeaderProps {
  courses: CourseSpecification[];
  selectedCourseId: string;
  onSelectCourse: (id: string) => void;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  permissions: RolePermissions;
  onOpenAnnexure: () => void;
  onOpenSettings: () => void;
  onOpenPrint: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  courses,
  selectedCourseId,
  onSelectCourse,
  currentRole,
  onRoleChange,
  permissions,
  onOpenAnnexure,
  onOpenSettings,
  onOpenPrint,
  isDarkMode,
  onToggleDarkMode
}) => {
  const activeCourse = courses.find(c => c.id === selectedCourseId) || courses[0];

  return (
    <header className="bg-[#1E3A5F] text-white border-b border-[#0F2D52] sticky top-0 z-40 select-none shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand & Identity with Futuristic Hologram Badge */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded bg-gradient-to-tr from-[#0F9D8A] to-[#1E3A5F] border border-[#80F3DD]/40 flex items-center justify-center text-[#80F3DD] shadow-sm relative group cursor-pointer">
            <GraduationCap className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#80F3DD] rounded-full animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                ACADEMIC PRECISION
              </span>
              <span className="px-1.5 py-0.2 bg-gradient-to-r from-[#0F9D8A] to-[#06B6D4] text-white text-[10px] font-bold tracking-wider uppercase rounded shadow-xs">
                NEURAL OBE
              </span>
            </div>
            <p className="text-[11px] text-[#ADC8F5] leading-tight flex items-center gap-1">
              <span>Curriculum Specification & Accreditation Matrix</span>
            </p>
          </div>
        </div>

        {/* Center: Course Selector */}
        <div className="flex items-center gap-2 max-w-md w-full">
          <div className="relative w-full">
            <label htmlFor="course-select" className="sr-only">Select Course Specification</label>
            <select
              id="course-select"
              value={selectedCourseId}
              onChange={e => onSelectCourse(e.target.value)}
              className="w-full bg-[#0F2D52] hover:bg-[#143764] text-white text-xs font-semibold py-2 pl-3 pr-8 rounded border border-[#2D486D] focus:outline-none focus:border-[#80F3DD] focus:ring-1 focus:ring-[#80F3DD] transition-all appearance-none cursor-pointer"
            >
              {courses.map(course => (
                <option key={course.id} value={course.id} className="bg-[#1E3A5F] text-white">
                  {course.code} — {course.title} ({course.semester} Sem • {course.totalCredits} Credits)
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-[#ADC8F5] absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* Right Section: Tools, Reference Drawer, Role Switcher */}
        <div className="flex items-center gap-2.5 shrink-0">
          
          {/* Reference Drawer (Annexure A) */}
          <button
            type="button"
            onClick={onOpenAnnexure}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0F2D52] hover:bg-[#163D6C] text-[#D5E3FF] hover:text-white border border-[#2D486D] rounded text-xs font-medium transition-colors"
            title="Open Annexure A: Program Outcomes (PO1-PO12), PSOs & Bloom's Taxonomy"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#80F3DD]" />
            <span className="hidden md:inline">Annexure A</span>
            <span className="px-1 py-0.2 bg-[#1E3A5F] text-[10px] font-mono text-[#80F3DD] rounded border border-[#2D486D]">
              PO/PSO
            </span>
          </button>

          {/* AI Settings Trigger */}
          <button
            type="button"
            onClick={onOpenSettings}
            className="p-2 bg-[#0F2D52] hover:bg-[#163D6C] text-[#ADC8F5] hover:text-white border border-[#2D486D] rounded text-xs transition-colors"
            title="AI Curriculum Intelligence & Header Transmission Settings"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>

          {/* Dark / Light Cyber Mode Toggle */}
          <button
            type="button"
            onClick={onToggleDarkMode}
            className="p-2 bg-[#0F2D52] hover:bg-[#163D6C] text-[#80F3DD] border border-[#2D486D] rounded text-xs transition-colors"
            title={isDarkMode ? 'Switch to Academic Light Theme' : 'Switch to Cyber-Dean Dark Theme'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#80F3DD]" />}
          </button>

          {/* Print / Export */}
          <button
            type="button"
            onClick={onOpenPrint}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#0F2D52] hover:bg-[#163D6C] text-[#ADC8F5] hover:text-white border border-[#2D486D] rounded text-xs transition-colors"
            title="Print or Export Official Course Specification"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>

          {/* Role Switcher */}
          <div className="flex items-center pl-2 border-l border-[#2D486D]">
            <div className="flex flex-col items-end mr-2">
              <span className="text-[10px] text-[#ADC8F5] uppercase tracking-wider font-semibold">Active Role</span>
              <div className="relative">
                <label htmlFor="role-select" className="sr-only">Switch User Role</label>
                <select
                  id="role-select"
                  value={currentRole}
                  onChange={e => onRoleChange(e.target.value as UserRole)}
                  className="bg-[#2D486D] text-white text-xs font-semibold py-1 pl-2 pr-6 rounded border border-[#80F3DD]/40 focus:outline-none focus:border-[#80F3DD] appearance-none cursor-pointer"
                >
                  <option value="faculty" className="bg-[#1E3A5F]">Faculty Coordinator</option>
                  <option value="hod" className="bg-[#1E3A5F]">Department Chair (HOD)</option>
                  <option value="auditor" className="bg-[#1E3A5F]">Accreditation Auditor</option>
                  <option value="dean" className="bg-[#1E3A5F]">Dean of Academics</option>
                </select>
                <ChevronDown className="w-3 h-3 text-[#ADC8F5] absolute right-1.5 top-2 pointer-events-none" />
              </div>
            </div>

            {/* Permission Indicator */}
            <div
              className="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-medium border shadow-xs"
              style={{
                backgroundColor: currentRole === 'auditor' ? '#2A1B4E' : '#0E3A33',
                borderColor: currentRole === 'auditor' ? '#7C3AED' : '#0F9D8A',
                color: currentRole === 'auditor' ? '#DDD6FE' : '#A7F3D0'
              }}
              title={permissions.canEditOutcomes ? 'Full Authoring & Modification Privileges' : 'Read-only Evaluation & Accreditation Audit Mode'}
            >
              <ShieldCheck className="w-3 h-3" />
              <span>{permissions.roleBadgeText}</span>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
};
