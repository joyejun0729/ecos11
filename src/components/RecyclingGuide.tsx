import React, { useState } from 'react';
import { RECYCLING_CHEATSHEET } from '../data/mockData';
import { BookOpen, Search, AlertCircle, CheckCircle2 } from 'lucide-react';

export const RecyclingGuide: React.FC = () => {
  const [filterQuery, setFilterQuery] = useState('');

  const filteredGuides = RECYCLING_CHEATSHEET.filter((guide) => {
    if (!filterQuery.trim()) return true;
    const q = filterQuery.toLowerCase();
    return (
      guide.category.toLowerCase().includes(q) ||
      guide.rule.toLowerCase().includes(q) ||
      guide.items.some((item) => item.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title Header */}
      <div className="bg-white p-6 rounded-3xl border-2 border-emerald-50 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2.5 bg-emerald-100 text-emerald-800 rounded-2xl">
              <BookOpen className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-extrabold text-slate-900">환경부 지침 재질별 분리배출 요약</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            학교 및 일상 속 주요 쓰레기 6대 재질 분류 및 배출 4대 원칙 (비우기, 헹구기, 분리하기, 섞지않기)
          </p>
        </div>

        {/* Search Filter */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="품목 검색 (예: 우유팩, 과자)"
            className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-emerald-200 rounded-2xl text-xs outline-none focus:border-emerald-500 focus:bg-white"
          />
        </div>
      </div>

      {/* 4 Core Principles Box */}
      <div className="bg-emerald-600 text-white rounded-3xl p-6 shadow-xl shadow-emerald-200/50">
        <h3 className="font-extrabold text-lg mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-300" />
          분리배출 핵심 4대 원칙 (Clear, Clean, Separate, No-Mix)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10">
            <span className="text-emerald-300 font-extrabold text-sm block mb-0.5">1. 비운다</span>
            <span className="text-xs text-emerald-100">용기 안 내용물 완전히 제거</span>
          </div>
          <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10">
            <span className="text-emerald-300 font-extrabold text-sm block mb-0.5">2. 헹군다</span>
            <span className="text-xs text-emerald-100">이물질 및 음식물 씻기</span>
          </div>
          <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10">
            <span className="text-emerald-300 font-extrabold text-sm block mb-0.5">3. 분리한다</span>
            <span className="text-xs text-emerald-100">라벨, 뚜껑 등 다른 재질 제거</span>
          </div>
          <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10">
            <span className="text-emerald-300 font-extrabold text-sm block mb-0.5">4. 섞지 않는다</span>
            <span className="text-xs text-emerald-100">종류별 수거함에 정확히 넣기</span>
          </div>
        </div>
      </div>

      {/* Cheatsheet Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredGuides.map((guide, idx) => (
          <div
            key={idx}
            className={`rounded-2xl p-5 border shadow-2xs space-y-3 ${guide.color}`}
          >
            <div className="flex items-center justify-between">
              <span className={`px-3 py-1 font-extrabold text-xs rounded-full ${guide.badgeColor}`}>
                {guide.category}
              </span>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-600">대표 품목:</p>
              <div className="flex flex-wrap gap-1.5">
                {guide.items.map((item, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-white/80 border border-slate-200/80 rounded-md text-xs font-medium text-slate-800"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/60">
              <p className="text-xs font-bold text-slate-800">배출 가이드:</p>
              <p className="text-xs font-semibold mt-0.5 leading-relaxed">
                {guide.rule}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
