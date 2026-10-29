/**
 * @license
 * Academic Precision OBE System
 * Annexure A Reference Drawer (Loads strictly from config/po_pso.json)
 */

import React, { useState } from 'react';
import { annexureData, programOutcomes, programSpecificOutcomes, bloomsLevels, correlationScale } from '../annexureA.ts';
import { X, BookOpen, Layers, Award, Target, HelpCircle, Search, ExternalLink } from 'lucide-react';

interface AnnexureDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'po' | 'pso' | 'blooms' | 'scale';
}

export const AnnexureDrawer: React.FC<AnnexureDrawerProps> = ({
  isOpen,
  onClose,
  initialTab = 'po'
}) => {
  const [activeTab, setActiveTab] = useState<'po' | 'pso' | 'blooms' | 'scale'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredPOs = programOutcomes.filter(po => 
    po.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    po.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    po.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPSOs = programSpecificOutcomes.filter(pso =>
    pso.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pso.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pso.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBlooms = bloomsLevels.filter(b =>
    b.level.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.actionVerbs.some(v => v.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#022448]/30 backdrop-blur-xs">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Slide-out Drawer */}
      <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col z-10 border-l border-[#CBD5E1] animate-in slide-in-from-right duration-200">
        
        {/* Drawer Header */}
        <div className="px-6 py-4 bg-[#1E3A5F] text-white flex items-center justify-between border-b border-[#0F2D52]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#2D486D] flex items-center justify-center text-[#80F3DD]">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold font-heading tracking-tight">{annexureData.annexure}</h2>
                <span className="text-[10px] font-mono bg-[#2D486D] text-[#80F3DD] px-1.5 py-0.5 rounded">
                  v{annexureData.version}
                </span>
              </div>
              <p className="text-xs text-[#ADC8F5]">{annexureData.institution}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-300 hover:text-white hover:bg-[#2D486D] transition-colors"
            title="Close Drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Strip */}
        <div className="flex border-b border-[#E2E8F0] bg-[#F8FAFC] px-6 pt-2 gap-1 text-xs font-medium">
          <button
            onClick={() => setActiveTab('po')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'po'
                ? 'border-[#0F9D8A] text-[#1E3A5F] font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Target className="w-3.5 h-3.5 text-[#0F9D8A]" />
            Program Outcomes (PO1-PO12)
          </button>
          <button
            onClick={() => setActiveTab('pso')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'pso'
                ? 'border-[#0F9D8A] text-[#1E3A5F] font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-[#0F9D8A]" />
            PSOs (PSO1-PSO3)
          </button>
          <button
            onClick={() => setActiveTab('blooms')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'blooms'
                ? 'border-[#0F9D8A] text-[#1E3A5F] font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-[#0F9D8A]" />
            Bloom's Levels (L1-L6)
          </button>
          <button
            onClick={() => setActiveTab('scale')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === 'scale'
                ? 'border-[#0F9D8A] text-[#1E3A5F] font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#0F9D8A]" />
            Correlation Scale
          </button>
        </div>

        {/* Search bar inside drawer */}
        <div className="px-6 py-2.5 bg-white border-b border-[#E2E8F0]">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search statements, action verbs, cognitive levels..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded focus:bg-white focus:outline-none focus:border-[#0F9D8A]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 text-xs"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          
          {/* TAB 1: POs */}
          {activeTab === 'po' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 pb-1 border-b border-[#E2E8F0]">
                <span>Showing {filteredPOs.length} Program Outcomes (Graduate Attributes)</span>
                <span>Source: config/po_pso.json</span>
              </div>
              {filteredPOs.map(po => (
                <div key={po.id} className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded hover:border-[#CBD5E1] transition-colors">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-[#1E3A5F] text-white font-mono text-xs font-bold rounded">
                        {po.code}
                      </span>
                      <h4 className="text-sm font-semibold text-[#1F2937] font-heading">{po.title}</h4>
                    </div>
                    <span className="text-[11px] font-medium text-slate-500 bg-white border border-[#E2E8F0] px-2 py-0.5 rounded">
                      {po.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed mt-1">
                    {po.description}
                  </p>
                  <div className="mt-2.5 pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-[11px] text-slate-500">
                    <span>Short Label: <strong className="text-slate-700">{po.shortName}</strong></span>
                    <span>Target Attainment: <strong className="font-mono text-[#006B5D]">{po.targetAttainment.toFixed(1)} / 3.0</strong></span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: PSOs */}
          {activeTab === 'pso' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 pb-1 border-b border-[#E2E8F0]">
                <span>Showing {filteredPSOs.length} Program Specific Outcomes</span>
                <span>Source: config/po_pso.json</span>
              </div>
              {filteredPSOs.map(pso => (
                <div key={pso.id} className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded hover:border-[#CBD5E1] transition-colors">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-[#0F9D8A] text-white font-mono text-xs font-bold rounded">
                        {pso.code}
                      </span>
                      <h4 className="text-sm font-semibold text-[#1F2937] font-heading">{pso.title}</h4>
                    </div>
                    <span className="text-[11px] font-medium text-slate-500 bg-white border border-[#E2E8F0] px-2 py-0.5 rounded">
                      {pso.department}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed mt-1">
                    {pso.description}
                  </p>
                  <div className="mt-2.5 pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-[11px] text-slate-500">
                    <span>Short Label: <strong className="text-slate-700">{pso.shortName}</strong></span>
                    <span>Target Attainment: <strong className="font-mono text-[#006B5D]">{pso.targetAttainment.toFixed(1)} / 3.0</strong></span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: Bloom's Levels */}
          {activeTab === 'blooms' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 pb-1 border-b border-[#E2E8F0]">
                <span>Revised Bloom's Taxonomy Cognitive Hierarchy (L1 - L6)</span>
                <span>Source: config/po_pso.json</span>
              </div>
              {filteredBlooms.map(b => (
                <div key={b.level} className="p-4 bg-white border border-[#E2E8F0] rounded hover:shadow-xs transition-shadow">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="px-2 py-0.5 font-mono text-xs font-bold rounded text-white"
                        style={{ backgroundColor: b.color }}
                      >
                        {b.level}
                      </span>
                      <h4 className="text-sm font-bold text-[#1F2937] font-heading">{b.name}</h4>
                    </div>
                    <span className="text-xs font-medium text-slate-600">
                      {b.cognitiveDomain}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                    {b.description}
                  </p>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                      Accreditation Action Verbs:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {b.actionVerbs.map(verb => (
                        <span
                          key={verb}
                          className="px-2 py-0.5 text-xs bg-[#F1F5F9] border border-[#CBD5E1] text-[#1E3A5F] rounded"
                        >
                          {verb}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: Correlation Scale */}
          {activeTab === 'scale' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 pb-1 border-b border-[#E2E8F0]">
                <span>NBA / ABET Articulation Correlation Matrix Scale</span>
                <span>Source: config/po_pso.json</span>
              </div>
              <div className="border border-[#CBD5E1] rounded overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#1E3A5F] text-white">
                    <tr>
                      <th className="px-3 py-2 font-semibold">Value</th>
                      <th className="px-3 py-2 font-semibold">Intensity</th>
                      <th className="px-3 py-2 font-semibold">Accreditation Definition & Weight</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0]">
                    {correlationScale.map(scale => (
                      <tr key={scale.level} className="hover:bg-[#F8FAFC]">
                        <td className="px-3 py-2.5 font-mono font-bold text-center w-16">
                          <span className={`inline-block px-2 py-0.5 rounded text-xs ${
                            scale.level === 3 ? 'bg-[#0F9D8A] text-white' :
                            scale.level === 2 ? 'bg-[#D5E3FF] text-[#1E3A5F]' :
                            scale.level === 1 ? 'bg-[#F1F5F9] text-slate-700' :
                            'text-slate-400'
                          }`}>
                            {scale.symbol}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 font-semibold text-[#1F2937] whitespace-nowrap">
                          {scale.label}
                        </td>
                        <td className="px-3 py-2.5 text-slate-600 leading-relaxed">
                          {scale.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#F8FAFC] border-t border-[#CBD5E1] flex items-center justify-between text-xs text-slate-500">
          <span>Official OBE Reference for Course Specification</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-[#1E3A5F] text-white rounded text-xs font-medium hover:bg-[#152A45]"
          >
            Dismiss Drawer
          </button>
        </div>

      </div>
    </div>
  );
};
