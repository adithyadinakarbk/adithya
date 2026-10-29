/**
 * @license
 * Academic Precision OBE System
 * Main Application Shell with Interactive Telemetry, Neural Co-Pilot & Confetti
 */

import React, { useState, useEffect } from 'react';
import { CourseSpecification, UserRole } from './types.ts';
import { INITIAL_COURSES } from './mockData.ts';
import { getRolePermissions } from './permissions.ts';
import { Header } from './components/Header.tsx';
import { OverviewScreen } from './components/OverviewScreen.tsx';
import { OutcomesScreen } from './components/OutcomesScreen.tsx';
import { MatrixScreen } from './components/MatrixScreen.tsx';
import { SyllabusScreen } from './components/SyllabusScreen.tsx';
import { AssessmentScreen } from './components/AssessmentScreen.tsx';
import { AccreditationScreen } from './components/AccreditationScreen.tsx';
import { ExportScreen } from './components/ExportScreen.tsx';
import { InteractiveVisualizer } from './components/InteractiveVisualizer.tsx';
import { AICoPilotDock } from './components/AICoPilotDock.tsx';
import { ConfettiCanvas } from './components/ConfettiCanvas.tsx';
import { AnnexureDrawer } from './components/AnnexureDrawer.tsx';
import { Settings } from './Settings.tsx';
import { motion, AnimatePresence } from 'motion/react';

import { 
  BookText, 
  Target, 
  Table, 
  Layers, 
  FileCheck2, 
  ShieldCheck, 
  Printer, 
  Zap,
  Check
} from 'lucide-react';

const STORAGE_KEY = 'academic_precision_courses_v1';
const THEME_STORAGE_KEY = 'academic_precision_theme_v1';

export default function App() {
  // Load courses with local storage persistence
  const [courses, setCourses] = useState<CourseSpecification[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_COURSES;
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem(THEME_STORAGE_KEY) === 'dark';
    } catch {
      return false;
    }
  });

  const [selectedCourseId, setSelectedCourseId] = useState<string>(() => courses[0]?.id || 'crs_cs401');
  const [currentRole, setCurrentRole] = useState<UserRole>('faculty');
  const [activeTab, setActiveTab] = useState<'overview' | 'outcomes' | 'matrix' | 'syllabus' | 'assessment' | 'accreditation' | 'telemetry' | 'export'>('overview');
  
  // Modals & Drawers
  const [isAnnexureOpen, setIsAnnexureOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // Apply dark mode class to html document element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(THEME_STORAGE_KEY, 'light');
    }
  }, [isDarkMode]);

  // Persist courses to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
    } catch (err) {
      console.error('Failed to persist courses:', err);
    }
  }, [courses]);

  const activeCourse = courses.find(c => c.id === selectedCourseId) || courses[0];
  const permissions = getRolePermissions(currentRole, activeCourse.approvalStatus);

  const handleUpdateActiveCourse = (updated: CourseSpecification) => {
    // Check if status changed to approved
    if (updated.approvalStatus === 'approved' && activeCourse.approvalStatus !== 'approved') {
      setShowConfetti(true);
    }
    setCourses(prev => prev.map(c => c.id === updated.id ? updated : c));
    showToast('Course specification updated');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const navItems = [
    { key: 'overview', label: 'Course Overview', icon: BookText, badge: `${activeCourse.totalCredits} Credits` },
    { key: 'outcomes', label: 'Course Outcomes', icon: Target, badge: `${activeCourse.courseOutcomes.length} COs` },
    { key: 'matrix', label: 'Articulation Matrix', icon: Table, badge: 'PO / PSO' },
    { key: 'syllabus', label: 'Modular Syllabus', icon: Layers, badge: `${activeCourse.totalContactHours}h` },
    { key: 'assessment', label: 'Assessment Scheme', icon: FileCheck2, badge: '100m' },
    { key: 'telemetry', label: 'Cognitive Telemetry', icon: Zap, badge: 'Radar & 3D' },
    { key: 'accreditation', label: 'Compliance Audit', icon: ShieldCheck, badge: activeCourse.approvalStatus.toUpperCase() }
  ] as const;

  return (
    <div className={`min-h-screen bg-[#F5F7FA] dark:bg-[#090E17] text-[#1F2937] dark:text-[#F1F5F9] flex flex-col font-sans transition-colors duration-200 bg-ambient-glow`}>
      
      {/* Top Authoritative Header */}
      <Header
        courses={courses}
        selectedCourseId={selectedCourseId}
        onSelectCourse={setSelectedCourseId}
        currentRole={currentRole}
        onRoleChange={(newRole) => {
          setCurrentRole(newRole);
          showToast(`Switched active role to: ${newRole.toUpperCase()}`);
        }}
        permissions={permissions}
        onOpenAnnexure={() => setIsAnnexureOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenPrint={() => setActiveTab('export')}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Navigation Tabs Bar */}
        {activeTab !== 'export' && (
          <div className="no-print bg-white dark:bg-[#0F172A] border border-[#CBD5E1] dark:border-[#1E293B] rounded-lg p-1.5 shadow-xs flex items-center justify-between gap-1 overflow-x-auto">
            <div className="flex items-center gap-1">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setActiveTab(item.key)}
                    className={`px-3.5 py-2 text-xs font-semibold rounded transition-all flex items-center gap-2 whitespace-nowrap relative ${
                      isActive
                        ? 'bg-[#1E3A5F] text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#80F3DD]' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                      isActive ? 'bg-[#2D486D] text-[#80F3DD]' : 'bg-[#F1F5F9] dark:bg-[#1E293B] text-slate-500'
                    }`}>
                      {item.badge}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTabIndicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0F9D8A] rounded-full"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quick Export Button */}
            <button
              type="button"
              onClick={() => setActiveTab('export')}
              className="px-3.5 py-2 text-xs font-semibold text-[#1E3A5F] dark:text-[#80F3DD] hover:bg-[#EFF4FF] dark:hover:bg-[#1E293B] rounded border border-transparent hover:border-[#ADC8F5] transition-colors flex items-center gap-1.5 shrink-0"
              title="Preview Official Specification Document"
            >
              <Printer className="w-3.5 h-3.5 text-[#0F9D8A]" />
              <span>Document View</span>
            </button>
          </div>
        )}

        {/* Tab Views with Fluid Transitions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            {activeTab === 'overview' && (
              <OverviewScreen
                course={activeCourse}
                onUpdateCourse={handleUpdateActiveCourse}
                currentRole={currentRole}
                permissions={permissions}
              />
            )}

            {activeTab === 'outcomes' && (
              <OutcomesScreen
                course={activeCourse}
                onUpdateCourse={handleUpdateActiveCourse}
                currentRole={currentRole}
                permissions={permissions}
                onOpenAnnexure={() => setIsAnnexureOpen(true)}
              />
            )}

            {activeTab === 'matrix' && (
              <MatrixScreen
                course={activeCourse}
                onUpdateCourse={handleUpdateActiveCourse}
                currentRole={currentRole}
                permissions={permissions}
                onOpenAnnexure={() => setIsAnnexureOpen(true)}
              />
            )}

            {activeTab === 'syllabus' && (
              <SyllabusScreen
                course={activeCourse}
                onUpdateCourse={handleUpdateActiveCourse}
                currentRole={currentRole}
                permissions={permissions}
              />
            )}

            {activeTab === 'assessment' && (
              <AssessmentScreen
                course={activeCourse}
                onUpdateCourse={handleUpdateActiveCourse}
                currentRole={currentRole}
                permissions={permissions}
              />
            )}

            {activeTab === 'telemetry' && (
              <InteractiveVisualizer
                course={activeCourse}
                onSelectCO={(coCode) => {
                  setActiveTab('outcomes');
                }}
              />
            )}

            {activeTab === 'accreditation' && (
              <AccreditationScreen
                course={activeCourse}
                onUpdateCourse={handleUpdateActiveCourse}
                currentRole={currentRole}
                permissions={permissions}
                onOpenPrint={() => setActiveTab('export')}
              />
            )}

            {activeTab === 'export' && (
              <ExportScreen
                course={activeCourse}
                onBack={() => setActiveTab('overview')}
              />
            )}
          </motion.div>
        </AnimatePresence>

      </main>

      {/* Footer */}
      <footer className="no-print bg-white dark:bg-[#0F172A] border-t border-[#E2E8F0] dark:border-[#1E293B] py-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#1E3A5F] dark:text-[#80F3DD]">Academic Precision</span>
            <span>•</span>
            <span>Autonomous OBE Curriculum Architecture</span>
            <span>•</span>
            <span className="font-mono text-[11px] text-[#006B5D]">Annexure A v2025.1</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Active Role: <strong className="text-[#1E3A5F] dark:text-[#80F3DD] uppercase">{currentRole}</strong></span>
            <span>Accreditation Ready: <strong className="text-[#0F9D8A]">NBA Tier-1 / ABET</strong></span>
          </div>
        </div>
      </footer>

      {/* Annexure A Reference Drawer */}
      <AnnexureDrawer
        isOpen={isAnnexureOpen}
        onClose={() => setIsAnnexureOpen(false)}
      />

      {/* AI Settings Panel */}
      <Settings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSaved={() => showToast('AI Settings committed')}
      />

      {/* Floating Neural Curriculum Co-Pilot Dock */}
      <AICoPilotDock
        course={activeCourse}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Confetti Celebration Canvas */}
      <ConfettiCanvas
        active={showConfetti}
        onComplete={() => setShowConfetti(false)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#1E3A5F] text-white px-4 py-2.5 rounded shadow-lg text-xs font-medium flex items-center gap-2 border border-[#2D486D] animate-in fade-in slide-in-from-bottom-2 duration-150">
          <Check className="w-4 h-4 text-[#80F3DD]" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
