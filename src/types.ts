export type CategoryType = 
  | 'PET'          // 투명 페트병
  | 'PLASTIC'      // 일반 플라스틱 (PP, PE, PS 등)
  | 'VINYL'        // 비닐류
  | 'PAPER'        // 일반 종이 / 박스
  | 'CARTON'       // 종이팩 (우유팩, 두유팩)
  | 'CAN'          // 캔/금속류
  | 'GLASS'        // 유리병
  | 'STATIONERY'   // 학용품/문구류
  | 'EWASTE'       // 폐건전지/소형가전
  | 'GENERAL'      // 종량제 (일반쓰레기)
  | 'FOOD';        // 음식물 쓰레기

export type DifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD';

export interface MaterialComponent {
  partName: string; // e.g. "본체(용기)", "라벨", "뚜껑", "빨대"
  material: string; // e.g. "투명 PET", "비닐(PP)", "플라스틱(PP)"
  disposalCategory: CategoryType;
  instructions: string; // e.g. "내용물 세척 후 페트병 전용함에 배출"
  recycable: boolean;
}

export interface WasteAnalysisResult {
  id: string;
  itemName: string;
  summary: string;
  category: CategoryType;
  difficulty: DifficultyLevel;
  recyclabilityScore: number; // 0 ~ 100
  co2SavedGrams: number;
  components: MaterialComponent[];
  steps: string[];
  schoolNotice?: string;
  frequentMistake?: string;
  imageUrl?: string;
  scannedAt: string;
}

export interface BinLocation {
  id: string;
  name: string;
  floor: string;
  building: string;
  categories: CategoryType[];
  description: string;
  tips: string;
  iconName: string;
  coordinates: { x: number; y: number }; // percentage position for school map
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  category: CategoryType;
}

export interface EcoBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  requiredScans: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}
