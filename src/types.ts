/**
 * @license
 * Academic Precision OBE System
 * Domain Types for Curriculum Specification and Accreditation
 */

export type UserRole = 'faculty' | 'hod' | 'auditor' | 'dean';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  designation: string;
  department: string;
}

export interface ProgramOutcome {
  id: string;
  code: string;
  title: string;
  shortName: string;
  description: string;
  category: string;
  targetAttainment: number;
}

export interface ProgramSpecificOutcome {
  id: string;
  code: string;
  title: string;
  shortName: string;
  description: string;
  department: string;
  targetAttainment: number;
}

export interface BloomsLevel {
  level: string;
  name: string;
  cognitiveDomain: string;
  description: string;
  actionVerbs: string[];
  color: string;
  badgeBg: string;
}

export interface CorrelationScaleItem {
  level: number;
  symbol: string;
  label: string;
  description: string;
}

export interface AnnexureAData {
  annexure: string;
  version: string;
  institution: string;
  programOutcomes: ProgramOutcome[];
  programSpecificOutcomes: ProgramSpecificOutcome[];
  bloomsLevels: BloomsLevel[];
  correlationScale: CorrelationScaleItem[];
}

export interface CourseOutcome {
  id: string;
  code: string; // e.g. CO1, CO2
  statement: string;
  bloomsLevel: string; // e.g. L2, L3
  actionVerb: string;
  expectedAttainment: number; // percentage, e.g. 75
}

export interface SyllabusUnit {
  id: string;
  unitNumber: number;
  title: string;
  lectureHours: number;
  topics: string;
  pedagogicalMethods: string[];
  mappedCOs: string[];
}

export interface AssessmentComponent {
  id: string;
  category: 'CIE' | 'SEE';
  name: string;
  weightageMarks: number;
  mappedCOs: string[];
  bloomsFocus: string[];
}

export interface Textbook {
  id: string;
  authors: string;
  title: string;
  edition: string;
  publisher: string;
  year: string;
  isbn?: string;
  isPrescribed: boolean;
}

export type ApprovalStatus = 'draft' | 'submitted' | 'under_review' | 'approved' | 'revision_requested';

export interface WorkflowComment {
  id: string;
  author: string;
  role: UserRole;
  date: string;
  message: string;
  statusChange?: ApprovalStatus;
}

export interface CourseSpecification {
  id: string;
  code: string;
  title: string;
  department: string;
  academicYear: string;
  semester: string;
  regulation: string;
  category: string;
  lectureHours: number;
  tutorialHours: number;
  practicalHours: number;
  totalCredits: number;
  totalContactHours: number;
  prerequisites: string[];
  courseCoordinator: string;
  objectives: string[];
  courseOutcomes: CourseOutcome[];
  poMapping: Record<string, Record<string, number>>; // [coCode][poCode] => 0, 1, 2, 3
  psoMapping: Record<string, Record<string, number>>; // [coCode][psoCode] => 0, 1, 2, 3
  mappingJustifications: Record<string, string>; // "CO1-PO1": "description"
  syllabusUnits: SyllabusUnit[];
  assessments: AssessmentComponent[];
  textbooks: Textbook[];
  approvalStatus: ApprovalStatus;
  version: string;
  lastUpdated: string;
  workflowComments: WorkflowComment[];
}
