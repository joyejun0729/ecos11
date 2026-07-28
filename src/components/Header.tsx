import React from 'react';
import { Recycle, MapPin, MessageSquareText, BarChart3, BookOpen, MessageSquarePlus, Sparkles, Leaf } from 'lucide-react';

interface HeaderProps {
  activeTab: 'scan' | 'map' | 'chat' | 'dashboard' | 'guide' | 'board';
  setActiveTab: (tab: 'scan' | 'map' | 'chat' | 'dashboard' | 'guide' | 'board') => void;
  scanCount: number;
  totalCo2SavedGrams: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  scanCount,
  totalCo2SavedGrams,
}) => {
  const totalCo2Kg = (totalCo2SavedGrams / 1000).toFixed(2);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & School Title */}
          <div 
            onClick={() => setActiveTab('scan')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Recycle className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-slate-900 tracking-tight">
                  학교 EcoSort <span className="text-emerald-600 font-bold text-sm">AI</span>
                </span>
                <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
                  그린캠퍼스
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                스마트 카메라 재질 분석 & 맞춤 분리배출 도우미
              </p>
            </div>
          </div>

          {/* Quick Eco Stats Header Widget */}
          <div className="hidden md:flex items-center gap-4 bg-emerald-50/80 px-3.5 py-1.5 rounded-full border border-emerald-100">
            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-900">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>실천 스캔 <strong className="text-emerald-700 font-bold">{scanCount}회</strong></span>
            </div>
            <div className="h-3 w-px bg-emerald-200" />
            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-900">
              <Leaf className="w-4 h-4 text-teal-600" />
              <span>절감 CO₂e <strong className="text-teal-700 font-bold">{totalCo2Kg}kg</strong></span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-2 scrollbar-none border-t border-slate-100 pt-1">
          <button
            onClick={() => setActiveTab('scan')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'scan'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            <Recycle className="w-4 h-4" />
            <span>AI 제품 스캔</span>
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'map'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>학교 수거함 지도</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'chat'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            <MessageSquareText className="w-4 h-4" />
            <span>AI 분리수거 Q&A</span>
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>에코 리포트</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'guide'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>배출 가이드</span>
          </button>

          <button
            onClick={() => setActiveTab('board')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'board'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>게시판</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
