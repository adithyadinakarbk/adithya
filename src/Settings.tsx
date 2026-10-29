/**
 * @license
 * Academic Precision OBE System
 * AI Settings Management Panel (Restyled strictly with Academic Precision design rules)
 */

import React, { useState, useEffect } from 'react';
import { AISettings, loadSettings, saveSettings, executeAIRequest } from './api.ts';
import { Key, ShieldAlert, Cpu, Check, AlertCircle, RefreshCw, Eye, EyeOff, X } from 'lucide-react';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: (settings: AISettings) => void;
}

export const Settings: React.FC<SettingsProps> = ({ isOpen, onClose, onSaved }) => {
  const [settings, setSettings] = useState<AISettings>(loadSettings());
  const [showKey, setShowKey] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setSettings(loadSettings());
      setIsSaved(false);
      setTestStatus('idle');
      setTestMessage('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveSettings(settings);
    setIsSaved(true);
    if (onSaved) onSaved(settings);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleTestConnection = async () => {
    setTestStatus('testing');
    setTestMessage('Initiating test payload with x-llm headers...');
    try {
      saveSettings(settings);
      const res = await executeAIRequest({
        task: 'generate_clos',
        courseCode: 'TEST101',
        courseTitle: 'OBE Diagnostic Probe'
      });
      if (res && res.clos && res.clos.length > 0) {
        setTestStatus('success');
        setTestMessage(`Connection verified. Engine generated ${res.clos.length} diagnostic outcomes successfully.`);
      } else {
        setTestStatus('error');
        setTestMessage('Provider responded but returned an unparseable response structure.');
      }
    } catch (err: any) {
      setTestStatus('error');
      setTestMessage(err.message || 'Failed to verify AI provider connection.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#022448]/40 backdrop-blur-xs p-4">
      <div className="w-full max-w-xl bg-white border border-[#CBD5E1] rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#1E3A5F] text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#2D486D] flex items-center justify-center text-[#80F3DD]">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold font-heading tracking-tight">AI Curriculum Intelligence Configuration</h2>
              <p className="text-xs text-[#ADC8F5]">Configure OBE generation models & transmission credentials</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="text-slate-300 hover:text-white p-1 rounded hover:bg-[#2D486D] transition-colors"
            title="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security Notice Banner */}
        <div className="px-6 py-3 bg-[#EFF4FF] border-b border-[#CBD5E1] flex items-start gap-3">
          <ShieldAlert className="w-4 h-4 text-[#1E3A5F] shrink-0 mt-0.5" />
          <p className="text-xs text-[#1F2937] leading-relaxed">
            <strong className="font-semibold text-[#1E3A5F]">Client-side security enforcement:</strong> API keys are strictly retained in your local browser sandbox. All AI calls transmit standard <code className="px-1 py-0.5 bg-white border border-[#CBD5E1] rounded text-[11px] font-mono text-[#006B5D]">x-llm-provider</code>, <code className="px-1 py-0.5 bg-white border border-[#CBD5E1] rounded text-[11px] font-mono text-[#006B5D]">x-llm-key</code>, and <code className="px-1 py-0.5 bg-white border border-[#CBD5E1] rounded text-[11px] font-mono text-[#006B5D]">x-llm-model</code> headers. No keys are ever written to files, commits, or server logs.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          
          {/* Provider Selection */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider">
              LLM Provider
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['gemini', 'openai', 'custom'] as const).map(p => (
                <button
                  type="button"
                  key={p}
                  onClick={() => {
                    const defaultModel = p === 'gemini' ? 'gemini-2.5-flash' : p === 'openai' ? 'gpt-4o-mini' : 'local-llm';
                    setSettings({ ...settings, provider: p, model: defaultModel });
                  }}
                  className={`px-3 py-2 text-xs font-medium rounded border transition-colors flex items-center justify-center gap-1.5 ${
                    settings.provider === p 
                      ? 'bg-[#1E3A5F] text-white border-[#1E3A5F]' 
                      : 'bg-white text-[#1F2937] border-[#CBD5E1] hover:bg-[#F8FAFC]'
                  }`}
                >
                  {p === 'gemini' && 'Google Gemini'}
                  {p === 'openai' && 'OpenAI'}
                  {p === 'custom' && 'Custom / Self-Hosted'}
                </button>
              ))}
            </div>
          </div>

          {/* Model Specification */}
          <div className="space-y-1.5">
            <label htmlFor="model-select" className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider">
              Model Descriptor
            </label>
            {settings.provider === 'gemini' ? (
              <select
                id="model-select"
                value={settings.model}
                onChange={e => setSettings({ ...settings, model: e.target.value })}
                className="w-full h-9 px-3 text-xs bg-white border border-[#CBD5E1] rounded focus:border-[#0F9D8A] focus:outline-none focus:ring-1 focus:ring-[#0F9D8A]"
              >
                <option value="gemini-2.5-flash">gemini-2.5-flash (Fast & Accurate Syllabus Synthesis)</option>
                <option value="gemini-2.5-pro">gemini-2.5-pro (Deep Accreditation & Complex OBE Mapping)</option>
                <option value="gemini-2.0-flash">gemini-2.0-flash (General Purpose)</option>
              </select>
            ) : settings.provider === 'openai' ? (
              <select
                id="model-select"
                value={settings.model}
                onChange={e => setSettings({ ...settings, model: e.target.value })}
                className="w-full h-9 px-3 text-xs bg-white border border-[#CBD5E1] rounded focus:border-[#0F9D8A] focus:outline-none focus:ring-1 focus:ring-[#0F9D8A]"
              >
                <option value="gpt-4o-mini">gpt-4o-mini</option>
                <option value="gpt-4o">gpt-4o</option>
                <option value="o3-mini">o3-mini</option>
              </select>
            ) : (
              <input
                id="model-select"
                type="text"
                value={settings.model}
                onChange={e => setSettings({ ...settings, model: e.target.value })}
                placeholder="e.g. meta-llama/Llama-3-70b-instruct"
                className="w-full h-9 px-3 text-xs bg-white border border-[#CBD5E1] rounded focus:border-[#0F9D8A] focus:outline-none focus:ring-1 focus:ring-[#0F9D8A]"
              />
            )}
          </div>

          {/* API Key */}
          <div className="space-y-1.5">
            <label htmlFor="api-key-input" className="block text-xs font-semibold text-[#1F2937] uppercase tracking-wider flex items-center justify-between">
              <span>API Secret Key</span>
              <span className="text-[11px] font-normal text-slate-500 lowercase">(transmitted via x-llm-key header)</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Key className="w-3.5 h-3.5" />
              </div>
              <input
                id="api-key-input"
                type={showKey ? 'text' : 'password'}
                value={settings.apiKey}
                onChange={e => setSettings({ ...settings, apiKey: e.target.value })}
                placeholder={settings.provider === 'gemini' ? 'AIzaSy...' : 'sk-...'}
                className="w-full h-9 pl-9 pr-10 text-xs font-mono bg-white border border-[#CBD5E1] rounded focus:border-[#0F9D8A] focus:outline-none focus:ring-1 focus:ring-[#0F9D8A]"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                title={showKey ? 'Hide key' : 'Show key'}
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Leave blank to evaluate with built-in heuristic NBA OBE rule verification.
            </p>
          </div>

          {/* Temperature Slider */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between items-center">
              <label htmlFor="temp-slider" className="text-xs font-semibold text-[#1F2937] uppercase tracking-wider">
                Sampling Temperature: <span className="font-mono text-[#006B5D]">{settings.temperature.toFixed(2)}</span>
              </label>
              <span className="text-[11px] text-slate-500">Low = Deterministic & Rule-Rigid</span>
            </div>
            <input
              id="temp-slider"
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.temperature}
              onChange={e => setSettings({ ...settings, temperature: parseFloat(e.target.value) })}
              className="w-full accent-[#0F9D8A] cursor-pointer"
            />
          </div>

          {/* Test Status Feedback */}
          {testStatus !== 'idle' && (
            <div className={`p-3 rounded text-xs flex items-start gap-2 border ${
              testStatus === 'testing' ? 'bg-blue-50 border-blue-200 text-blue-800' :
              testStatus === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
              'bg-red-50 border-red-200 text-red-800'
            }`}>
              {testStatus === 'testing' && <RefreshCw className="w-4 h-4 shrink-0 animate-spin text-blue-600" />}
              {testStatus === 'success' && <Check className="w-4 h-4 shrink-0 text-emerald-600" />}
              {testStatus === 'error' && <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />}
              <span className="leading-tight">{testMessage}</span>
            </div>
          )}

          {/* Modal Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testStatus === 'testing'}
              className="px-3 py-1.5 text-xs border border-[#1E3A5F] text-[#1E3A5F] hover:bg-[#F1F5F9] rounded font-medium flex items-center gap-1.5 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testStatus === 'testing' ? 'animate-spin' : ''}`} />
              Verify Transmission
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 rounded font-medium"
              >
                Dismiss
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs bg-[#1E3A5F] hover:bg-[#152A45] active:bg-[#0F1D30] text-white rounded font-medium flex items-center gap-1.5 transition-colors"
              >
                {isSaved ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#80F3DD]" />
                    Saved!
                  </>
                ) : (
                  'Commit Settings'
                )}
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};
