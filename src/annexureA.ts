/**
 * @license
 * Academic Precision OBE System
 * Loads Annexure A (PO, PSO, Bloom's levels, Correlation scale) exclusively from config/po_pso.json
 */

import poPsoJson from '../config/po_pso.json';
import { AnnexureAData, BloomsLevel, ProgramOutcome, ProgramSpecificOutcome, CorrelationScaleItem } from './types.ts';

export const annexureData: AnnexureAData = poPsoJson as AnnexureAData;

export const programOutcomes: ProgramOutcome[] = annexureData.programOutcomes;
export const programSpecificOutcomes: ProgramSpecificOutcome[] = annexureData.programSpecificOutcomes;
export const bloomsLevels: BloomsLevel[] = annexureData.bloomsLevels;
export const correlationScale: CorrelationScaleItem[] = annexureData.correlationScale;

export function getPO(code: string): ProgramOutcome | undefined {
  return programOutcomes.find(p => p.code === code || p.id === code);
}

export function getPSO(code: string): ProgramSpecificOutcome | undefined {
  return programSpecificOutcomes.find(p => p.code === code || p.id === code);
}

export function getBloomsLevel(level: string): BloomsLevel | undefined {
  return bloomsLevels.find(b => b.level === level);
}

export function getCorrelationInfo(level: number): CorrelationScaleItem | undefined {
  return correlationScale.find(c => c.level === level);
}
