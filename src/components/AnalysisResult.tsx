import React, { useState } from 'react';
import { WasteAnalysisResult } from '../types';
import { CheckCircle2, AlertTriangle, Building2, Sparkles, Share2, Save, ArrowLeft, Leaf, Layers, ShieldAlert, Check } from 'lucide-react';

interface AnalysisResultProps {
  result: WasteAnalysisResult;
  onSaveToHistory: (result: WasteAnalysisResult) => void;
  onResetScan: () => void;
  isSaved?: boolean;
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({
  result,
  onSaveToHistory,
  onResetScan,
  isSaved = false,
}) => {
  const [checkedSteps, setCheckedSteps] = useState<boolean[]>(
    new Array(result.steps.length).fill(false)
  );
  const [savedSuccess, setSavedSuccess] = useState(isSaved);
  const [copied, setCopied] = useState(false);

  const toggleStep = (index: number) => {
    const updated = [...checkedSteps];
    updated[index] = !updated[index];
    setCheckedSteps(updated);
  };

  const handleSave = () => {
    onSaveToHistory(result);
    setSavedSuccess(true);
  };

  const handleShare = () => {
    const text = `[학교 EcoSort AI 분석 결과]\n물품명: ${result.itemName}\n재활용 점수: ${result.recyclabilityScore}점\n분리배출 핵심 요약: ${result.summary}\n#학교EcoSort #그린캠퍼스 #분리수거`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY':
        return <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-extrabold rounded-md">쉬움 (EASY)</span>;
      case 'MEDIUM':
        return <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-extrabold rounded-md">보통 (MEDIUM)</span>;
      case 'HARD':
        return <span className="px-2.5 py-1 bg-rose-100 text-rose-800 text-xs font-extrabold rounded-md">주의 필요 (HARD)</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={onResetScan}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>다른 물품 스캔하기</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? '복사 완료!' : '결과 공유'}</span>
          </button>

          <button
            onClick={handleSave}
            disabled={savedSuccess}
            className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
              savedSuccess
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
            }`}
          >
            {savedSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{savedSuccess ? '기록에 저장됨' : '나의 에코 기록에 저장'}</span>
          </button>
        </div>
      </div>

      {/* Main Analysis Card Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              {result.imageUrl && (
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-800 border-2 border-slate-700 shrink-0">
                  <img src={result.imageUrl} alt={result.itemName} className="w-full h-full object-cover" />
                </div>
              )}
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-emerald-500 text-slate-950 font-black text-xs rounded-full uppercase tracking-wider">
                    {result.category}
                  </span>
                  {getDifficultyBadge(result.difficulty)}
                </div>
                <h2 className="text-2xl font-extrabold text-white tracking-tight">
                  {result.itemName}
                </h2>
                <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                  {result.summary}
                </p>
              </div>
            </div>

            {/* Recyclability Meter & CO2 metrics */}
            <div className="bg-slate-800/90 border border-slate-700 p-4 rounded-xl flex items-center justify-around gap-6 shrink-0 min-w-64">
              <div className="text-center">
                <span className="text-xs text-slate-400 block font-semibold mb-1">재활용 성공율</span>
                <span className="text-3xl font-black text-emerald-400">{result.recyclabilityScore}%</span>
              </div>
              <div className="h-8 w-px bg-slate-700" />
              <div className="text-center">
                <span className="text-xs text-slate-400 block font-semibold mb-1">절감 탄소</span>
                <div className="flex items-center justify-center gap-1 text-teal-300">
                  <Leaf className="w-4 h-4" />
                  <span className="text-xl font-bold">{result.co2SavedGrams}g</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Component Materials Breakdown Table */}
        <div className="p-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Layers className="w-5 h-5 text-emerald-600" />
              <h3 className="text-lg font-bold text-slate-900">
                부위별 상세 재질 분해 & 배출 수거함
              </h3>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-extrabold">
                  <tr>
                    <th className="py-3 px-4">구성 부위</th>
                    <th className="py-3 px-4">추정 소재</th>
                    <th className="py-3 px-4">배출 수거함</th>
                    <th className="py-3 px-4">부위별 배출 요령</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {result.components.map((comp, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {comp.partName}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        <span className="inline-block px-2 py-0.5 bg-slate-100 border border-slate-200 rounded-md font-mono text-xs">
                          {comp.material}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold rounded-md text-xs">
                          {comp.disposalCategory}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        {comp.instructions}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Interactive Step-by-Step Action Checklist */}
          <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h4 className="font-extrabold text-slate-900 text-base">
                  실천 단계별 체크리스트 (직접 분리배출 해보세요)
                </h4>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                {checkedSteps.filter(Boolean).length} / {result.steps.length} 완료
              </span>
            </div>

            <div className="space-y-2">
              {result.steps.map((step, idx) => (
                <div
                  key={idx}
                  onClick={() => toggleStep(idx)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center gap-3 ${
                    checkedSteps[idx]
                      ? 'bg-emerald-100/80 border-emerald-300 text-emerald-900 line-through opacity-80'
                      : 'bg-white border-slate-200 hover:border-emerald-300 text-slate-800'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold ${
                    checkedSteps[idx] ? 'bg-emerald-600 text-white' : 'border-2 border-slate-300 text-transparent'
                  }`}>
                    ✓
                  </div>
                  <span className="text-sm font-semibold">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* School Notice & Warning Box Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* School Notice Box */}
            {result.schoolNotice && (
              <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-4 text-blue-900 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-sm text-blue-800">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <span>우리학교 맞춤 분리수거 안내</span>
                </div>
                <p className="text-xs leading-relaxed text-blue-900/90">
                  {result.schoolNotice}
                </p>
              </div>
            )}

            {/* Frequent Mistake Warning Box */}
            {result.frequentMistake && (
              <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 text-amber-900 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-sm text-amber-800">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  <span>학생들이 흔히 하는 오해/실수</span>
                </div>
                <p className="text-xs leading-relaxed text-amber-900/90">
                  {result.frequentMistake}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
