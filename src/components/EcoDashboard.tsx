import React, { useState } from 'react';
import { WasteAnalysisResult, EcoBadge } from '../types';
import { DAILY_QUIZZES, ECO_BADGES } from '../data/mockData';
import { Leaf, Award, History, Trash2, HelpCircle, Check, X, Sparkles, Sprout, Crown, CheckCircle2 } from 'lucide-react';

interface EcoDashboardProps {
  scanHistory: WasteAnalysisResult[];
  onClearHistory: () => void;
  onSelectHistoryItem: (item: WasteAnalysisResult) => void;
}

export const EcoDashboard: React.FC<EcoDashboardProps> = ({
  scanHistory,
  onClearHistory,
  onSelectHistoryItem,
}) => {
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const totalCo2Grams = scanHistory.reduce((acc, curr) => acc + (curr.co2SavedGrams || 30), 0);
  const totalCo2Kg = (totalCo2Grams / 1000).toFixed(2);
  const treesSaved = (totalCo2Grams / 500).toFixed(1); // Rough estimate: 500g CO2 = ~0.1 tree month

  const currentQuiz = DAILY_QUIZZES[currentQuizIdx];

  const handleOptionSelect = (idx: number) => {
    if (quizSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    setQuizSubmitted(true);
    if (selectedOption === currentQuiz.correctAnswerIndex) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const handleNextQuiz = () => {
    setSelectedOption(null);
    setQuizSubmitted(false);
    setCurrentQuizIdx((prev) => (prev + 1) % DAILY_QUIZZES.length);
  };

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sprout': return <Sprout className="w-6 h-6 text-emerald-600" />;
      case 'CheckCircle2': return <CheckCircle2 className="w-6 h-6 text-teal-600" />;
      case 'Award': return <Award className="w-6 h-6 text-amber-600" />;
      case 'Crown': return <Crown className="w-6 h-6 text-purple-600" />;
      default: return <Award className="w-6 h-6 text-emerald-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Carbon Reduction Impact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-emerald-600 rounded-[32px] p-6 text-white shadow-xl shadow-emerald-200/50 flex items-center justify-between">
          <div>
            <span className="text-xs font-black text-emerald-200 uppercase tracking-wider block mb-1">
              실천 분리수거 스캔
            </span>
            <span className="text-4xl font-black">{scanHistory.length}회</span>
            <p className="text-xs text-emerald-100 mt-1.5 font-medium">캠퍼스 올바른 배출 실천 기록</p>
          </div>
          <div className="w-14 h-14 bg-white/10 backdrop-blur-xs rounded-2xl flex items-center justify-center text-white border border-white/10">
            <Sparkles className="w-7 h-7 text-yellow-300" />
          </div>
        </div>

        <div className="bg-teal-700 rounded-[32px] p-6 text-white shadow-xl shadow-teal-200/50 flex items-center justify-between">
          <div>
            <span className="text-xs font-black text-teal-200 uppercase tracking-wider block mb-1">
              절감 이산화탄소 (CO₂e)
            </span>
            <span className="text-4xl font-black">{totalCo2Kg} kg</span>
            <p className="text-xs text-teal-100 mt-1.5 font-medium">누적 탄소 배출 방지량</p>
          </div>
          <div className="w-14 h-14 bg-white/10 backdrop-blur-xs rounded-2xl flex items-center justify-center text-white border border-white/10">
            <Leaf className="w-7 h-7 text-emerald-300" />
          </div>
        </div>

        <div className="bg-amber-600 rounded-[32px] p-6 text-white shadow-xl shadow-amber-200/50 flex items-center justify-between">
          <div>
            <span className="text-xs font-black text-amber-200 uppercase tracking-wider block mb-1">
              소나무 식재 기여 효과
            </span>
            <span className="text-4xl font-black">약 {treesSaved} 그루</span>
            <p className="text-xs text-amber-100 mt-1.5 font-medium">탄소 흡수 소나무 상당 환산</p>
          </div>
          <div className="w-14 h-14 bg-white/10 backdrop-blur-xs rounded-2xl flex items-center justify-center text-white border border-white/10">
            <Sprout className="w-7 h-7 text-amber-200" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Daily Eco Quiz Section (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl border-2 border-emerald-50 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-emerald-600" />
              <h3 className="font-extrabold text-slate-900 text-lg">
                오늘의 분리배출 퀴즈
              </h3>
            </div>
            <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
              맞춘 퀴즈: {quizScore}개
            </span>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-bold text-slate-800 leading-relaxed">
              Q{currentQuizIdx + 1}. {currentQuiz.question}
            </p>

            <div className="space-y-2">
              {currentQuiz.options.map((opt, idx) => {
                let btnStyle = 'bg-slate-50 border-slate-200 hover:border-emerald-300 text-slate-700';
                if (selectedOption === idx) {
                  btnStyle = 'bg-emerald-50 border-emerald-500 font-bold text-emerald-900';
                }
                if (quizSubmitted) {
                  if (idx === currentQuiz.correctAnswerIndex) {
                    btnStyle = 'bg-emerald-100 border-emerald-500 font-bold text-emerald-900';
                  } else if (selectedOption === idx) {
                    btnStyle = 'bg-rose-100 border-rose-300 text-rose-900';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleOptionSelect(idx)}
                    className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition-all cursor-pointer ${btnStyle}`}
                  >
                    <span className="font-bold mr-2">{idx + 1}.</span> {opt}
                  </button>
                );
              })}
            </div>

            {!quizSubmitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedOption === null}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                정답 제출하기
              </button>
            ) : (
              <div className="space-y-3 pt-2">
                <div className={`p-3 rounded-xl text-xs leading-relaxed ${
                  selectedOption === currentQuiz.correctAnswerIndex
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                    : 'bg-amber-50 border border-amber-200 text-amber-900'
                }`}>
                  <p className="font-bold mb-1">
                    {selectedOption === currentQuiz.correctAnswerIndex ? '🎉 정답입니다!' : '💡 아쉽네요! 해설을 확인하세요:'}
                  </p>
                  <p>{currentQuiz.explanation}</p>
                </div>

                <button
                  onClick={handleNextQuiz}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  다음 퀴즈 도전하기
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Badges & Achievements Grid (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl border-2 border-emerald-50 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <h3 className="font-extrabold text-slate-900 text-lg">
                에코 실천 배지
              </h3>
            </div>
            <span className="text-xs text-slate-500">스캔 횟수 달성 시 잠금해제</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {ECO_BADGES.map((badge) => {
              const isUnlocked = scanHistory.length >= badge.requiredScans;
              return (
                <div
                  key={badge.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isUnlocked
                      ? 'bg-emerald-50/60 border-emerald-200 shadow-2xs'
                      : 'bg-slate-50 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl shrink-0 ${
                      isUnlocked ? 'bg-white shadow-2xs' : 'bg-slate-200'
                    }`}>
                      {getBadgeIcon(badge.icon)}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">
                        {badge.title}
                      </h4>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                        {badge.description}
                      </p>
                      <span className={`inline-block mt-1 text-[10px] font-extrabold ${
                        isUnlocked ? 'text-emerald-700' : 'text-slate-400'
                      }`}>
                        {isUnlocked ? '✓ 획득 완료' : `🔒 필요 스캔 ${badge.requiredScans}회`}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Scan History Log List */}
      <div className="bg-white rounded-3xl border-2 border-emerald-50 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-600" />
            <h3 className="font-extrabold text-slate-900 text-lg">
              나의 분리배출 스캔 기록 ({scanHistory.length})
            </h3>
          </div>

          {scanHistory.length > 0 && (
            <button
              onClick={onClearHistory}
              className="text-xs text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>기록 전체 삭제</span>
            </button>
          )}
        </div>

        {scanHistory.length === 0 ? (
          <div className="p-8 text-center text-slate-400 space-y-2">
            <p className="text-sm font-medium">아직 스캔한 쓰레기 기록이 없습니다.</p>
            <p className="text-xs text-slate-500">제품 스캔 탭에서 쓰레기 사진을 찍고 분리배출을 시작해 보세요!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {scanHistory.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectHistoryItem(item)}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-500 bg-white hover:bg-emerald-50/30 transition-all cursor-pointer flex items-center justify-between group shadow-2xs"
              >
                <div className="flex items-center gap-3 truncate">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.itemName} className="w-12 h-12 rounded-lg object-cover bg-slate-100 shrink-0" />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-emerald-100 text-emerald-800 font-extrabold text-xs flex items-center justify-center shrink-0">
                      {item.category}
                    </div>
                  )}
                  <div className="truncate">
                    <h4 className="font-bold text-xs text-slate-900 truncate group-hover:text-emerald-700">
                      {item.itemName}
                    </h4>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      {new Date(item.scannedAt).toLocaleDateString()} · {item.co2SavedGrams}g CO₂ 절감
                    </span>
                  </div>
                </div>

                <span className="text-xs font-bold text-emerald-600 shrink-0 ml-2 group-hover:underline">
                  보기
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
