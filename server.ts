import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

// Body parser
app.use(express.json({ limit: '20mb' }));

// Gemini AI client lazily created or checked
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('⚠️ GEMINI_API_KEY is not configured in process.env. Using fallback rules or error handling.');
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Healthcheck API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// AI Waste Analysis Route (Multimodal image/text -> structured JSON)
app.post('/api/analyze-item', async (req, res) => {
  try {
    const { imageBase64, mimeType, textQuery } = req.body;

    if (!imageBase64 && !textQuery) {
      return res.status(400).json({ error: '이미지 데이터 또는 텍스트 검색어를 입력해주세요.' });
    }

    const ai = getGeminiClient();

    if (!ai) {
      return res.status(500).json({
        error: 'Gemini API 키가 설정되지 않았습니다. AI 분석을 실행하려면 process.env.GEMINI_API_KEY가 필요합니다.',
      });
    }

    const contentsParts: any[] = [];

    if (imageBase64) {
      // Clean base64 prefix if included
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      contentsParts.push({
        inlineData: {
          mimeType: mimeType || 'image/jpeg',
          data: cleanBase64,
        },
      });
    }

    const userPrompt = textQuery 
      ? `이 제품/쓰레기는 "${textQuery}"입니다. 이 물품의 재질을 분석하고 한국 환경부 및 학교 분리수거 지침에 맞춰 정확한 분리배출 방법과 주의사항을 안내해주세요.`
      : '첨부된 이미지 속 제품/쓰레기를 분석하여 한국 환경부 및 학교 분리수거 지침에 맞춰 재질별 분리배출 방법과 단계별 지침을 JSON으로 반환해주세요.';

    contentsParts.push({ text: userPrompt });

    const systemInstruction = `
너는 대한민국 학교 및 일상생활 분리수거 전문가 AI "학교 EcoSort"야.
사용자가 촬영하거나 입력한 쓰레기/제품에 대해 대한민국 환경부 분리배출 지침과 학교 수거함(급식실, 교실, 본관 등) 특성을 반영하여 정교하게 분석해줘.

필수 요구 사항:
1. itemName: 물품의 명확한 한글 이름 (예: "투명 생수 페트병 500ml", "포카칩 비닐봉지", "카페 테이크아웃 플라스틱 컵")
2. summary: 핵심 분리배출 가이드 요약 (1~2문장)
3. category: "PET", "PLASTIC", "VINYL", "PAPER", "CARTON", "CAN", "GLASS", "STATIONERY", "EWASTE", "GENERAL", "FOOD" 중 하나
4. difficulty: 분리배출 난이도 ("EASY", "MEDIUM", "HARD")
5. recyclabilityScore: 재활용 가능성 점수 (0 ~ 100)
6. co2SavedGrams: 분리배출 성공 시 절감되는 예상 탄소량 (g CO2e, 약 10~100 사이 숫자로 추정)
7. components: 부위별 재질 분해 목록. 각 부위마다:
   - partName (예: "페트병 본체", "비닐 라벨", "뚜껑", "빨대")
   - material (예: "투명 PET", "PP 비닐", "HDPE 플라스틱", "골판지", "일반쓰레기")
   - disposalCategory (위의 category 중 하나)
   - instructions (해당 부위의 상세 배출 요령)
   - recycable (재활용 가능 여부 boolean)
8. steps: 순서대로 실천해야 하는 단계별 행동 지침 3~5개
9. schoolNotice: 학교 수거함(급식실, 교실, 매점 등) 위치 관련 특화 팁
10. frequentMistake: 학생들이 흔히 하는 실수나 주의사항 (예: 딱지 접어 버리기, 국물 오염 등)
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: { parts: contentsParts },
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            itemName: { type: Type.STRING },
            summary: { type: Type.STRING },
            category: { 
              type: Type.STRING,
              description: 'PET, PLASTIC, VINYL, PAPER, CARTON, CAN, GLASS, STATIONERY, EWASTE, GENERAL, FOOD' 
            },
            difficulty: { type: Type.STRING, description: 'EASY, MEDIUM, HARD' },
            recyclabilityScore: { type: Type.NUMBER },
            co2SavedGrams: { type: Type.NUMBER },
            components: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  partName: { type: Type.STRING },
                  material: { type: Type.STRING },
                  disposalCategory: { type: Type.STRING },
                  instructions: { type: Type.STRING },
                  recycable: { type: Type.BOOLEAN },
                },
                required: ['partName', 'material', 'disposalCategory', 'instructions', 'recycable'],
              },
            },
            steps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            schoolNotice: { type: Type.STRING },
            frequentMistake: { type: Type.STRING },
          },
          required: ['itemName', 'summary', 'category', 'difficulty', 'recyclabilityScore', 'co2SavedGrams', 'components', 'steps', 'schoolNotice', 'frequentMistake'],
        },
      },
    });

    const responseText = response.text || '';
    const parsedData = JSON.parse(responseText);

    const result = {
      id: `scan-${Date.now()}`,
      ...parsedData,
      imageUrl: imageBase64 ? (imageBase64.startsWith('data:') ? imageBase64 : `data:${mimeType || 'image/jpeg'};base64,${imageBase64}`) : undefined,
      scannedAt: new Date().toISOString(),
    };

    return res.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Error analyzing item with Gemini:', error);
    return res.status(500).json({
      error: error.message || 'AI 분석 중 오류가 발생했습니다. 다시 시도해 주세요.',
    });
  }
});

// AI Q&A Assistant Route
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: '질문 내용을 입력해주세요.' });
    }

    const ai = getGeminiClient();

    if (!ai) {
      return res.status(500).json({
        error: 'Gemini API 키가 필요합니다.',
      });
    }

    const chatHistoryPrompt = (history || [])
      .map((h: any) => `${h.sender === 'user' ? '학생' : 'EcoSort AI'}: ${h.text}`)
      .join('\n');

    const fullPrompt = `
이전 대화:
${chatHistoryPrompt}

학생 질문: "${message}"

친절하고 전문적인 학교 분리수거 도우미로서, 학생이 궁금해하는 쓰레기 분리배출 방법, 학교 수거함 규칙, 환경 상식에 대해 명확하고 친근한 어조로 답변해줘. 3~5줄 내외로 가독성 높게 이모지를 사용하며 간결하게 답변해줘.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: fullPrompt,
      config: {
        systemInstruction: '너는 대한민국 학교 분리수거 친절한 멘토 AI "EcoSort"야. 학생들에게 유익하고 친근하게 분리배출법을 가르쳐줘.',
      },
    });

    return res.json({ success: true, text: response.text || '죄송합니다. 답변을 생성하지 못했습니다.' });
  } catch (error: any) {
    console.error('Error in EcoChat:', error);
    return res.status(500).json({
      error: error.message || '답변 처리 중 오류가 발생했습니다.',
    });
  }
});

// Explicit API 404 handler to ensure /api/* calls always return JSON instead of HTML SPA index.html
app.all('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: `요청하신 API 경로 (${req.originalUrl})를 찾을 수 없습니다.`,
  });
});

async function startServer() {
  // Setup Vite development server or static serving for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌱 School EcoSort AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
