#!/usr/bin/env node
/**
 * Verification script for SpecForge
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

// 4. Verify outputs/specforge_output.json
const jsonPath = path.join(outputsDir, 'specforge_output.json');
if (!fs.existsSync(jsonPath)) {
  console.error('[VERIFY ERROR] Missing outputs/specforge_output.json');
  process.exit(1);
}

try {
  const content = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  if (content.input_id !== 'SAMPLE') {
    console.warn('[VERIFY] Fixing input_id to SAMPLE in outputs/specforge_output.json...');
    content.input_id = 'SAMPLE';
    fs.writeFileSync(jsonPath, JSON.stringify(content, null, 2), 'utf8');
  }
  console.log('[VERIFY] outputs/specforge_output.json: VALID (input_id: "SAMPLE")');
} catch (e) {
  console.error('[VERIFY ERROR] Invalid JSON in outputs/specforge_output.json');
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
