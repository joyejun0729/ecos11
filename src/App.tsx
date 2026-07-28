import React, { useState, useEffect } from 'react';
import { WasteAnalysisResult } from './types';
import { analyzeItemWithAI } from './services/apiService';
import { PRESET_ITEMS } from './data/mockData';
import { Header } from './components/Header';
import { CameraScanner } from './components/CameraScanner';
import { AnalysisResult } from './components/AnalysisResult';
import { CampusBinMap } from './components/CampusBinMap';
import { EcoChat } from './components/EcoChat';
import { EcoDashboard } from './components/EcoDashboard';
import { RecyclingGuide } from './components/RecyclingGuide';
import { CommunityBoard } from './components/CommunityBoard';

export default function App() {
  const [activeTab, setActiveTab] = useState<'scan' | 'map' | 'chat' | 'dashboard' | 'guide' | 'board'>('scan');
  const [currentResult, setCurrentResult] = useState<WasteAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanHistory, setScanHistory] = useState<WasteAnalysisResult[]>(() => {
    try {
      const saved = localStorage.getItem('ecosort_scan_history');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load scan history from localStorage:', e);
    }
    // Default initial scan history with 2 sample items
    return [PRESET_ITEMS[0], PRESET_ITEMS[1]];
  });

  // Save scan history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ecosort_scan_history', JSON.stringify(scanHistory));
    } catch (e) {
      console.warn('Failed to save history to localStorage:', e);
    }
  }, [scanHistory]);

  const handleAnalyze = async (imageBase64?: string, mimeType?: string, textQuery?: string) => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeItemWithAI(imageBase64, mimeType, textQuery);
      setCurrentResult(result);
      setScanHistory((prev) => [result, ...prev.filter((item) => item.id !== result.id)]);
    } catch (err: any) {
      console.error('Analysis failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectPreset = (preset: WasteAnalysisResult) => {
    setCurrentResult(preset);
    setScanHistory((prev) => [preset, ...prev.filter((item) => item.id !== preset.id)]);
  };

  const handleSaveToHistory = (result: WasteAnalysisResult) => {
    setScanHistory((prev) => [result, ...prev.filter((item) => item.id !== result.id)]);
  };

  const handleClearHistory = () => {
    setScanHistory([]);
    try {
      localStorage.removeItem('ecosort_scan_history');
    } catch (e) {
      console.warn('Error clearing localStorage:', e);
    }
  };

  const totalCo2SavedGrams = scanHistory.reduce((acc, curr) => acc + (curr.co2SavedGrams || 30), 0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col antialiased">
      {/* App Header & Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        scanCount={scanHistory.length}
        totalCo2SavedGrams={totalCo2SavedGrams}
      />

      {/* Main Content View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'scan' && (
          <div>
            {currentResult ? (
              <AnalysisResult
                result={currentResult}
                onSaveToHistory={handleSaveToHistory}
                onResetScan={() => setCurrentResult(null)}
                isSaved={scanHistory.some((item) => item.id === currentResult.id)}
              />
            ) : (
              <CameraScanner
                onAnalyze={handleAnalyze}
                onSelectPreset={handleSelectPreset}
                isAnalyzing={isAnalyzing}
              />
            )}
          </div>
        )}

        {activeTab === 'map' && <CampusBinMap />}

        {activeTab === 'chat' && <EcoChat />}

        {activeTab === 'dashboard' && (
          <EcoDashboard
            scanHistory={scanHistory}
            onClearHistory={handleClearHistory}
            onSelectHistoryItem={(item) => {
              setCurrentResult(item);
              setActiveTab('scan');
            }}
          />
        )}

        {activeTab === 'guide' && <RecyclingGuide />}

        {activeTab === 'board' && <CommunityBoard />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-medium">
            🌱 <strong>학교 EcoSort AI</strong> — 그린캠퍼스 올바른 분리수거 실천 프로젝트
          </p>
          <p className="text-slate-400">
            Powered by Google Gemini 3.6 Flash & React Full-Stack
          </p>
        </div>
      </footer>
    </div>
  );
}
