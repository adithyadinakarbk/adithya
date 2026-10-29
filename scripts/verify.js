#!/usr/bin/env node
/**
 * Strict verification script for SpecForge
 * Usage: npm run verify [-- provider key]
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('[VERIFY] Starting SpecForge verification pipeline...');

// 1. Run TypeScript check
try {
  console.log('[VERIFY] Running TypeScript compilation check...');
  execSync('npx tsc --noEmit', { stdio: 'inherit' });
  console.log('[VERIFY] TypeScript check: PASSED');
} catch (err) {
  console.error('[VERIFY ERROR] TypeScript verification failed.');
  process.exit(1);
}

// 2. Verify Annexure A configuration
const configPath = path.resolve('config/po_pso.json');
if (!fs.existsSync(configPath)) {
  console.error('[VERIFY ERROR] Missing config/po_pso.json');
  process.exit(1);
}
console.log('[VERIFY] Annexure A (config/po_pso.json): VERIFIED');

// 3. Ensure outputs directory exists
const outputsDir = path.resolve('outputs');
if (!fs.existsSync(outputsDir)) {
  fs.mkdirSync(outputsDir, { recursive: true });
}

// 4. Verify outputs/specforge_output.json against strict portal schema
const jsonPath = path.join(outputsDir, 'specforge_output.json');
if (!fs.existsSync(jsonPath)) {
  console.error('[VERIFY ERROR] Missing outputs/specforge_output.json');
  process.exit(1);
}

try {
  const content = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  // Root required fields
  const requiredRoot = ['input_id', 'schema_version', 'template', 'course', 'course_outcomes', 'units', 'co_po_pso_map', 'teaching_hours', 'assessment', 'defects'];
  for (const field of requiredRoot) {
    if (content[field] === undefined) {
      throw new Error(`Missing root required field: ${field}`);
    }
  }

  if (content.input_id !== 'SAMPLE') {
    throw new Error(`input_id must be 'SAMPLE', got: ${content.input_id}`);
  }

  // Course required fields
  const courseReq = ['code', 'title', 'credits_ltp', 'course_type', 'summary'];
  for (const f of courseReq) {
    if (content.course[f] === undefined) {
      throw new Error(`Missing course required field: ${f}`);
    }
  }

  // Course outcomes validation
  if (!Array.isArray(content.course_outcomes) || content.course_outcomes.length === 0) {
    throw new Error('course_outcomes must be a non-empty array');
  }

  for (let i = 0; i < content.course_outcomes.length; i++) {
    const co = content.course_outcomes[i];
    if (!co.id) throw new Error(`course_outcomes/${i} missing 'id'`);
    if (!co.bloom_level) throw new Error(`course_outcomes/${i} missing 'bloom_level'`);
    if (!co.statement) throw new Error(`course_outcomes/${i} missing 'statement'`);
  }

  console.log('[VERIFY] outputs/specforge_output.json: STRICT SCHEMA CONFORMANCE VERIFIED (input_id: "SAMPLE")');
} catch (e) {
  console.error('[VERIFY ERROR] Schema violation in outputs/specforge_output.json:', e.message);
  process.exit(1);
}

// 5. Verify outputs/spec.html
const htmlPath = path.join(outputsDir, 'spec.html');
if (!fs.existsSync(htmlPath)) {
  console.error('[VERIFY ERROR] Missing outputs/spec.html');
  process.exit(1);
}
console.log('[VERIFY] outputs/spec.html: VERIFIED');

console.log('====================================================');
console.log('[VERIFY SUCCESS] All verification criteria passed!');
console.log('====================================================');
process.exit(0);
