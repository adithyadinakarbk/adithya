/**
 * @license
 * Academic Precision OBE System
 * Role-Based Access Control and Permission Checks
 */

import { UserRole, ApprovalStatus } from './types.ts';

export interface RolePermissions {
  canEditDetails: boolean;
  canEditOutcomes: boolean;
  canEditMatrix: boolean;
  canEditSyllabus: boolean;
  canEditAssessments: boolean;
  canUseAI: boolean;
  canSubmitForReview: boolean;
  canApproveOrReject: boolean;
  canLockCourse: boolean;
  canExportOfficial: boolean;
  roleBadgeText: string;
  roleBadgeColor: string;
}

export function getRolePermissions(role: UserRole, status: ApprovalStatus): RolePermissions {
  const isLocked = status === 'approved';

  switch (role) {
    case 'faculty':
      return {
        canEditDetails: !isLocked,
        canEditOutcomes: !isLocked,
        canEditMatrix: !isLocked,
        canEditSyllabus: !isLocked,
        canEditAssessments: !isLocked,
        canUseAI: !isLocked,
        canSubmitForReview: status === 'draft' || status === 'revision_requested',
        canApproveOrReject: false,
        canLockCourse: false,
        canExportOfficial: true,
        roleBadgeText: 'Author & Coordinator',
        roleBadgeColor: '#1E3A5F'
      };

    case 'hod':
      return {
        canEditDetails: true,
        canEditOutcomes: true,
        canEditMatrix: true,
        canEditSyllabus: true,
        canEditAssessments: true,
        canUseAI: true,
        canSubmitForReview: false,
        canApproveOrReject: status === 'submitted' || status === 'under_review',
        canLockCourse: true,
        canExportOfficial: true,
        roleBadgeText: 'Department Chair / HOD',
        roleBadgeColor: '#0F9D8A'
      };

    case 'auditor':
      return {
        canEditDetails: false,
        canEditOutcomes: false,
        canEditMatrix: false,
        canEditSyllabus: false,
        canEditAssessments: false,
        canUseAI: false,
        canSubmitForReview: false,
        canApproveOrReject: false,
        canLockCourse: false,
        canExportOfficial: true,
        roleBadgeText: 'Accreditation Auditor',
        roleBadgeColor: '#7C3AED'
      };

    case 'dean':
      return {
        canEditDetails: true,
        canEditOutcomes: true,
        canEditMatrix: true,
        canEditSyllabus: true,
        canEditAssessments: true,
        canUseAI: true,
        canSubmitForReview: false,
        canApproveOrReject: true,
        canLockCourse: true,
        canExportOfficial: true,
        roleBadgeText: 'Dean of Academics',
        roleBadgeColor: '#022448'
      };
  }
}
