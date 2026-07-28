import React, { useState } from 'react';
import { BinLocation, CategoryType } from '../types';
import { SCHOOL_BIN_LOCATIONS } from '../data/mockData';
import { MapPin, Building2, Utensils, BookOpen, FlaskConical, Trophy, Filter, CheckCircle, Info, Plus } from 'lucide-react';

interface CampusBinMapProps {
  onSelectCategoryFilter?: (cat: CategoryType) => void;
}

export const CampusBinMap: React.FC<CampusBinMapProps> = () => {
  const [selectedBin, setSelectedBin] = useState<BinLocation>(SCHOOL_BIN_LOCATIONS[0]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'ALL'>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBinName, setNewBinName] = useState('');
  const [newBinFloor, setNewBinFloor] = useState('');

  const categories: { label: string; value: CategoryType | 'ALL' }[] = [
    { label: '전체 수거함', value: 'ALL' },
    { label: '투명페트병', value: 'PET' },
    { label: '일반플라스틱', value: 'PLASTIC' },
    { label: '비닐류', value: 'VINYL' },
    { label: '종이/우유팩', value: 'CARTON' },
    { label: '캔/금속류', value: 'CAN' },
    { label: '폐건전지/전자', value: 'EWASTE' },
    { label: '음식물', value: 'FOOD' },
  ];

  const filteredBins = SCHOOL_BIN_LOCATIONS.filter((bin) => {
    if (selectedCategory === 'ALL') return true;
    return bin.categories.includes(selectedCategory as CategoryType);
  });

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Building2': return <Building2 className="w-5 h-5 text-emerald-600" />;
      case 'Utensils': return <Utensils className="w-5 h-5 text-amber-600" />;
      case 'BookOpen': return <BookOpen className="w-5 h-5 text-blue-600" />;
      case 'FlaskConical': return <FlaskConical className="w-5 h-5 text-purple-600" />;
      case 'Trophy': return <Trophy className="w-5 h-5 text-rose-600" />;
      default: return <MapPin className="w-5 h-5 text-emerald-600" />;
    }
  };

  const handleAddBin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newBinName) {
      alert(`"${newBinName}" 수거함 제보가 학생회 및 시설관리실에 전달되었습니다.`);
      setShowAddModal(false);
      setNewBinName('');
      setNewBinFloor('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Introduction */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border-2 border-emerald-50 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2.5 bg-emerald-100 text-emerald-800 rounded-2xl">
              <MapPin className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-extrabold text-slate-900">우리학교 캠퍼스 분리수거함 위치 지도</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            학교 건물별 수거함 수용 재질 및 특수 쓰레기(폐건전지, 우유팩) 수거 구역 위치를 확인하세요.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-2xl transition-colors shrink-0 shadow-md shadow-emerald-200 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>신규 수거함 제보하기</span>
        </button>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-bold text-slate-500 flex items-center gap-1 shrink-0 mr-1">
          <Filter className="w-3.5 h-3.5" /> 필터:
        </span>
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value)}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === cat.value
                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-200'
                : 'bg-white text-slate-700 border border-emerald-100 hover:bg-emerald-50/50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Stylized Campus Map (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden border-4 border-white shadow-xl flex flex-col justify-between min-h-[420px]">
          {/* Map Grid Background pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:32px_32px] opacity-40 pointer-events-none" />

          {/* Map Header Overlay */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="px-3 py-1 bg-slate-800/90 text-emerald-400 border border-slate-700 rounded-full text-xs font-extrabold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              스마트 그린캠퍼스 맵
            </span>
            <span className="text-xs text-slate-400 font-mono">총 {filteredBins.length}개 구역 표시 중</span>
          </div>

          {/* Map Pins Container */}
          <div className="relative z-10 my-8 h-64 w-full border border-dashed border-slate-700 rounded-xl bg-slate-950/60 p-4">
            {/* School Campus Building Mock Blocks */}
            <div className="absolute top-4 left-6 bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-md text-[10px] text-slate-400 font-bold">
              🏫 본관 동
            </div>
            <div className="absolute top-4 right-6 bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-md text-[10px] text-slate-400 font-bold">
              📚 학술정보관
            </div>
            <div className="absolute bottom-4 left-6 bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-md text-[10px] text-slate-400 font-bold">
              🍱 학생회관 / 급식실
            </div>
            <div className="absolute bottom-4 right-6 bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-md text-[10px] text-slate-400 font-bold">
              🏃 체육관 / 운동장
            </div>

            {/* Interactive Location Pins */}
            {filteredBins.map((bin) => {
              const isSelected = selectedBin.id === bin.id;
              return (
                <button
                  key={bin.id}
                  onClick={() => setSelectedBin(bin)}
                  style={{ left: `${bin.coordinates.x}%`, top: `${bin.coordinates.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 group z-20 cursor-pointer transition-all ${
                    isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                  }`}
                >
                  <div className={`p-2.5 rounded-full shadow-lg border-2 transition-colors flex items-center justify-center ${
                    isSelected
                      ? 'bg-emerald-500 text-slate-950 border-white ring-4 ring-emerald-500/30'
                      : 'bg-slate-800 text-emerald-400 border-emerald-500 hover:bg-emerald-600 hover:text-white'
                  }`}>
                    {getIcon(bin.iconName)}
                  </div>
                  <span className="absolute left-1/2 -translate-x-1/2 mt-1 px-2 py-0.5 bg-slate-950/90 text-white text-[10px] font-bold rounded-md whitespace-nowrap shadow-md pointer-events-none opacity-90 group-hover:opacity-100">
                    {bin.name.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>

          <p className="relative z-10 text-xs text-slate-400 text-center">
            💡 지도의 핀을 클릭하면 해당 수거함의 분리배출 규칙을 확인할 수 있습니다.
          </p>
        </div>

        {/* Selected Bin Detail Info Panel (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border-2 border-emerald-50 p-6 shadow-sm space-y-5">
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 mb-1">
              {getIcon(selectedBin.iconName)}
              <span>{selectedBin.building} · {selectedBin.floor}</span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">
              {selectedBin.name}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {selectedBin.description}
            </p>
          </div>

          {/* Accepted Categories */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 mb-2">수용 가능 분리배출 품목</h4>
            <div className="flex flex-wrap gap-1.5">
              {selectedBin.categories.map((cat) => (
                <span
                  key={cat}
                  className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-lg"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>

          {/* Special Tips for this Bin */}
          <div className="bg-amber-50/80 border border-amber-200 p-4 rounded-xl space-y-1 text-amber-900">
            <div className="flex items-center gap-1.5 font-bold text-xs text-amber-800">
              <Info className="w-4 h-4 text-amber-600" />
              <span>수거함 이용 꿀팁</span>
            </div>
            <p className="text-xs leading-relaxed text-amber-900/90">
              {selectedBin.tips}
            </p>
          </div>

          {/* List of all bins for quick selection */}
          <div className="pt-2">
            <h4 className="text-xs font-bold text-slate-700 mb-2">전체 수거함 목록 ({SCHOOL_BIN_LOCATIONS.length})</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {SCHOOL_BIN_LOCATIONS.map((bin) => (
                <div
                  key={bin.id}
                  onClick={() => setSelectedBin(bin)}
                  className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                    selectedBin.id === bin.id
                      ? 'bg-emerald-50 border-emerald-400 font-bold text-emerald-900'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <span className="truncate">{bin.name}</span>
                  {selectedBin.id === bin.id && <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Bin Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">학교 수거함 제보 / 위치 추가</h3>
            <form onSubmit={handleAddBin} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">수거함 위치/건물명</label>
                <input
                  type="text"
                  required
                  value={newBinName}
                  onChange={(e) => setNewBinName(e.target.value)}
                  placeholder="예: 신관 3층 복도 동편 수거함"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">층수 및 상세 위치</label>
                <input
                  type="text"
                  value={newBinFloor}
                  onChange={(e) => setNewBinFloor(e.target.value)}
                  placeholder="예: 3층 자판기 옆"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm outline-none focus:border-emerald-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                  제보 제출
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
