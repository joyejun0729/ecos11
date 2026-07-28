import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Search, RefreshCw, Sparkles, Check, Image as ImageIcon, Zap, AlertCircle } from 'lucide-react';
import { PRESET_ITEMS } from '../data/mockData';
import { WasteAnalysisResult } from '../types';

interface CameraScannerProps {
  onAnalyze: (imageBase64?: string, mimeType?: string, textQuery?: string) => Promise<void>;
  onSelectPreset: (preset: WasteAnalysisResult) => void;
  isAnalyzing: boolean;
}

export const CameraScanner: React.FC<CameraScannerProps> = ({
  onAnalyze,
  onSelectPreset,
  isAnalyzing,
}) => {
  const [activeMode, setActiveMode] = useState<'camera' | 'upload' | 'search'>('camera');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Start Camera Stream with fallback
  const startCamera = async () => {
    setCameraError(null);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('사용 중인 브라우저에서 카메라 기능이 지원되지 않습니다. [사진 업로드] 기능을 이용해 보세요.');
      setCameraActive(false);
      return;
    }

    try {
      let stream: MediaStream;
      try {
        // Try rear camera first
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        });
      } catch (envErr: any) {
        // Fallback to any default camera (e.g. desktop webcam)
        console.warn('FacingMode environment failed, trying fallback default video stream:', envErr);
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
      }

      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch((playErr) => console.warn('Video play prevented:', playErr));
      }
      setCameraActive(true);
    } catch (err: any) {
      console.warn('Camera access error:', err);
      let errorMsg = '카메라 장치를 연결할 수 없습니다.';
      if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errorMsg = '연결된 카메라 장치를 찾을 수 없습니다 (PC 웹캠 미연결 등). [사진 업로드] 탭을 이용해 보세요.';
      } else if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMsg = '카메라 접근 권한이 차단되었습니다. 브라우저 설정에서 권한을 허용하시거나 [사진 업로드]를 이용해 보세요.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        errorMsg = '다른 프로그램에서 카메라를 이미 사용 중입니다. 다른 앱을 종료하거나 [사진 업로드]를 이용해 보세요.';
      }
      setCameraError(errorMsg);
      setCameraActive(false);
    }
  };

  // Stop Camera Stream
  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    if (activeMode === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [activeMode]);

  // Capture Photo from Camera Canvas
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setSelectedImage(dataUrl);
      stopCamera();
      onAnalyze(dataUrl, 'image/jpeg');
    }
  };

  // Handle Image File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const resultUrl = event.target?.result as string;
        setSelectedImage(resultUrl);
        onAnalyze(resultUrl, file.type);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Text Search Submit
  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onAnalyze(undefined, undefined, searchQuery.trim());
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner introduction */}
      <div className="bg-emerald-600 rounded-[32px] p-6 sm:p-8 text-white shadow-xl shadow-emerald-200/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/80 border border-emerald-400/50 rounded-full text-xs font-bold text-white mb-3">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>Gemini AI 멀티모달 스캐너</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
            제품을 촬영하거나 검색하여<br />정확한 분리배출법을 확인하세요!
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed font-medium">
            페트병 라벨 제거, 우유팩 세척, 과자 봉지 딱지 금지 등 학교 분리수거장에서 혼동하기 쉬운 분리배출 지침과 맞춤 수거함 위치를 AI가 1초만에 분석합니다.
          </p>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex bg-emerald-100/60 p-1.5 rounded-2xl border border-emerald-200/80 gap-1.5 shadow-2xs">
        <button
          onClick={() => setActiveMode('camera')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeMode === 'camera'
              ? 'bg-white text-emerald-800 shadow-sm border border-emerald-200'
              : 'text-emerald-900/70 hover:text-emerald-950'
          }`}
        >
          <Camera className="w-4 h-4 text-emerald-600" />
          <span>카메라 촬영</span>
        </button>

        <button
          onClick={() => setActiveMode('upload')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeMode === 'upload'
              ? 'bg-white text-emerald-800 shadow-sm border border-emerald-200'
              : 'text-emerald-900/70 hover:text-emerald-950'
          }`}
        >
          <Upload className="w-4 h-4 text-emerald-600" />
          <span>사진 업로드</span>
        </button>

        <button
          onClick={() => setActiveMode('search')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeMode === 'search'
              ? 'bg-white text-emerald-800 shadow-sm border border-emerald-200'
              : 'text-emerald-900/70 hover:text-emerald-950'
          }`}
        >
          <Search className="w-4 h-4 text-emerald-600" />
          <span>제품명 검색</span>
        </button>
      </div>

      {/* Main Scanner Container */}
      <div className="bg-white rounded-3xl border-2 border-emerald-100/80 p-5 sm:p-7 shadow-xl shadow-emerald-900/5">
        {/* Hidden Canvas for Frame Grab */}
        <canvas ref={canvasRef} className="hidden" />

        {/* 1. Camera Mode */}
        {activeMode === 'camera' && (
          <div className="space-y-4">
            <div className="relative aspect-video sm:aspect-4/3 max-h-96 w-full bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center border border-slate-800">
              {cameraActive ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {/* Scanning Animation Laser Line */}
                  <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] animate-scan pointer-events-none" />
                  
                  {/* Target Frame Guidance Box */}
                  <div className="absolute inset-12 border-2 border-dashed border-emerald-400/60 rounded-xl pointer-events-none flex items-center justify-center">
                    <span className="text-xs text-emerald-200 bg-slate-900/80 px-3 py-1 rounded-full backdrop-blur-xs font-medium">
                      쓰레기/제품을 사각형 안에 맞추세요
                    </span>
                  </div>
                </>
              ) : (
                <div className="p-6 text-center text-slate-400 max-w-sm">
                  {cameraError ? (
                    <div className="space-y-3">
                      <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
                      <p className="text-xs text-slate-300 leading-relaxed">{cameraError}</p>
                      <div className="flex items-center justify-center gap-2 pt-1">
                        <button
                          onClick={startCamera}
                          className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-1.5 border border-slate-700 cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>재연결</span>
                        </button>
                        <button
                          onClick={() => setActiveMode('upload')}
                          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-1.5 shadow-md shadow-emerald-950/50 cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>사진 업로드로 전환</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Camera className="w-12 h-12 text-slate-500 mx-auto animate-pulse" />
                      <p className="text-sm">카메라 권한을 확인하고 켜는 중입니다...</p>
                    </div>
                  )}
                </div>
              )}

              {/* Analyzing Loader Overlay */}
              {isAnalyzing && (
                <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center text-white z-20 space-y-4">
                  <div className="w-14 h-14 border-4 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin" />
                  <div className="text-center">
                    <p className="font-bold text-lg text-emerald-300">Gemini AI 재질 분석 중...</p>
                    <p className="text-xs text-slate-300 mt-1">제품의 소재, 부위별 분리 요령 및 수거함 안내를 생성하고 있습니다.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Camera Control Action */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={capturePhoto}
                disabled={!cameraActive || isAnalyzing}
                className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-base active:scale-95 cursor-pointer"
              >
                <Camera className="w-5 h-5" />
                <span>사진 촬영 및 AI 분석하기</span>
              </button>
            </div>
          </div>
        )}

        {/* 2. Photo Upload Mode */}
        {activeMode === 'upload' && (
          <div className="space-y-4">
            <label className="block w-full border-2 border-dashed border-emerald-200 hover:border-emerald-500 bg-emerald-50/40 hover:bg-emerald-50 rounded-xl p-8 text-center cursor-pointer transition-all">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isAnalyzing}
              />
              <div className="max-w-xs mx-auto space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-base">제품 사진 업로드하기</p>
                  <p className="text-xs text-slate-500 mt-1">
                    클릭하여 이미지 파일 선택 (JPG, PNG, WEBP)
                  </p>
                </div>
                <span className="inline-block px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-lg shadow-xs">
                  파일 선택
                </span>
              </div>
            </label>

            {selectedImage && (
              <div className="relative rounded-xl overflow-hidden max-h-64 bg-slate-100 border border-slate-200 flex items-center justify-center">
                <img src={selectedImage} alt="선택한 이미지" className="object-contain max-h-64" />
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center text-white">
                    <div className="text-center space-y-2">
                      <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
                      <p className="font-bold text-sm">업로드된 사진 분석 중...</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 3. Text Search Mode */}
        {activeMode === 'search' && (
          <form onSubmit={handleTextSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-800">
                분리배출 방법이 궁금한 물품명을 입력하세요
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="예: 삼다수, 우유팩, 과자봉지, 테이크아웃 컵, 깨진 유리"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all text-sm font-medium"
                    disabled={isAnalyzing}
                  />
                </div>
                <button
                  type="submit"
                  disabled={!searchQuery.trim() || isAnalyzing}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>분석하기</span>
                </button>
              </div>
            </div>

            {/* Quick Keyword Chips */}
            <div className="pt-2">
              <p className="text-xs font-semibold text-slate-500 mb-2">자주 찾는 학교 쓰레기 검색어:</p>
              <div className="flex flex-wrap gap-2">
                {['삼다수 페트병', '포카칩 과자봉지', '학교 우유팩', '아이스 테이크아웃 컵', '컵라면 용기', '폐건전지'].map((keyword) => (
                  <button
                    key={keyword}
                    type="button"
                    onClick={() => {
                      setSearchQuery(keyword);
                      onAnalyze(undefined, undefined, keyword);
                    }}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 rounded-lg text-xs font-medium border border-slate-200 transition-colors"
                  >
                    #{keyword}
                  </button>
                ))}
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Preset Item Quick Test Driver */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            <h3 className="font-extrabold text-slate-900 text-lg">
              빠른 체험용 대표 샘플 쓰레기
            </h3>
          </div>
          <span className="text-xs text-slate-500">1클릭 즉시 분석 체험</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {PRESET_ITEMS.map((preset) => (
            <div
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              className="group bg-white rounded-xl border border-slate-200 hover:border-emerald-500 p-3 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="aspect-square rounded-lg overflow-hidden bg-slate-100 mb-2.5 relative">
                  <img
                    src={preset.imageUrl}
                    alt={preset.itemName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-slate-900/80 text-white text-[10px] font-extrabold rounded-xs">
                    {preset.category}
                  </span>
                </div>
                <h4 className="font-bold text-xs text-slate-900 line-clamp-2 leading-tight group-hover:text-emerald-700">
                  {preset.itemName}
                </h4>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                <span>{preset.components.length}개 부위</span>
                <span className="text-emerald-600 font-bold group-hover:underline flex items-center gap-0.5">
                  선택 <Check className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
