import { WasteAnalysisResult } from '../types';
import { PRESET_ITEMS } from '../data/mockData';

// Helper for safely handling API responses (validates JSON vs HTML 404/500 fallback pages)
async function safeJsonFetch(res: Response): Promise<any> {
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    try {
      return await res.json();
    } catch (parseErr) {
      throw new Error(`응답 데이터 형식이 올바르지 않습니다. (상태 코드: ${res.status})`);
    }
  }
  // Handle non-JSON HTML/text responses (e.g. SPA fallback HTML or server 404/500 error)
  const text = await res.text();
  console.warn(`Non-JSON server response [Status: ${res.status}]:`, text.slice(0, 100));
  throw new Error(`서버 응답 오류 (상태 코드: ${res.status}). 올바른 API 응답이 아닙니다.`);
}

export async function checkServerStatus(): Promise<{ hasGeminiKey: boolean }> {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) return { hasGeminiKey: false };
    const data = await safeJsonFetch(res);
    return { hasGeminiKey: Boolean(data.hasGeminiKey) };
  } catch (err) {
    console.warn('Failed to check server status:', err);
    return { hasGeminiKey: false };
  }
}

export async function analyzeItemWithAI(
  imageBase64?: string,
  mimeType?: string,
  textQuery?: string
): Promise<WasteAnalysisResult> {
  try {
    const res = await fetch('/api/analyze-item', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageBase64, mimeType, textQuery }),
    });

    const data = await safeJsonFetch(res);

    if (!res.ok || !data.success) {
      throw new Error(data?.error || 'AI 분석 서버 요청에 실패했습니다.');
    }

    return data.data as WasteAnalysisResult;
  } catch (err: any) {
    console.warn('API analysis error, attempting fallback preset match:', err?.message || err);

    // Fallback logic if API key is missing or server error occurs
    if (textQuery) {
      const matched = PRESET_ITEMS.find((item) =>
        item.itemName.toLowerCase().includes(textQuery.toLowerCase()) ||
        item.summary.toLowerCase().includes(textQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(textQuery.toLowerCase())
      );
      if (matched) {
        return {
          ...matched,
          id: `fallback-${Date.now()}`,
          scannedAt: new Date().toISOString(),
        };
      }
    }

    // Default fallback PET item with notice
    const defaultPreset = PRESET_ITEMS[0];
    return {
      ...defaultPreset,
      id: `fallback-${Date.now()}`,
      itemName: textQuery || defaultPreset.itemName,
      schoolNotice: `💡 ${err.message || 'AI 분석 연결 안내'}. 기본 오프라인 데이터베이스 결과를 표시합니다.`,
      scannedAt: new Date().toISOString(),
    };
  }
}

export async function askEcoChat(message: string, history: any[]): Promise<string> {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, history }),
    });

    const data = await safeJsonFetch(res);

    if (!res.ok || !data.success) {
      throw new Error(data?.error || '답변 생성 실패');
    }

    return data.text;
  } catch (err: any) {
    // Smart offline fallback response
    if (message.includes('우유') || message.includes('종이팩')) {
      return '🥛 종이팩(우유팩, 두유팩)은 내부를 물로 깨끗이 헹군 후 펼쳐서 말린 뒤, 일반 박스 종이가 아닌 "종이팩 전용함"에 배출해야 최고급 휴지로 재활용됩니다!';
    }
    if (message.includes('과자') || message.includes('비닐')) {
      return '🍪 과자 봉지 같은 비닐류는 내용물 부스러기를 비우고 평평하게 접거나 펼쳐서 비닐류 수거함에 버립니다. 딱지로 묶어서 버리면 풍력 선별기에서 떨어져 재활용할 수 없으니 절대 딱지 접지 마세요!';
    }
    if (message.includes('컵라면') || message.includes('국물')) {
      return '🍜 컵라면 스티로폼 용기는 라면 국물이 찌들어 씻기지 않는 경우 재활용이 불가능하여 일반쓰레기(종량제)로 배출해야 합니다.';
    }
    return `🌱 질문해주셔서 감사합니다! "${message}" 관련 분리배출은 내용물을 비우고 헹군 뒤 이물질을 제거하여 해당 재질(플라스틱/비닐/종이/캔) 수거함에 배출하는 것이 기본 원칙입니다.`;
  }
}
