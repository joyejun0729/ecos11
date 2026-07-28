import { WasteAnalysisResult, BinLocation, QuizQuestion, EcoBadge } from '../types';

export const PRESET_ITEMS: WasteAnalysisResult[] = [
  {
    id: 'preset-1',
    itemName: '500ml 투명 생수 페트병',
    summary: '라벨 비닐을 제거하고 착착 압축하여 투명 페트병 전용 수거함에 분리배출합니다.',
    category: 'PET',
    difficulty: 'EASY',
    recyclabilityScore: 95,
    co2SavedGrams: 42,
    components: [
      {
        partName: '페트병 본체',
        material: '투명 PET',
        disposalCategory: 'PET',
        instructions: '내용물을 비우고 물로 헹군 후 찌그러뜨려 투명페트 전용함에 배출',
        recycable: true,
      },
      {
        partName: '비닐 라벨',
        material: '비닐류 (PP/PE)',
        disposalCategory: 'VINYL',
        instructions: '절취선을 따라 떼어내어 비닐류 수거함에 배출',
        recycable: true,
      },
      {
        partName: '뚜껑 및 링',
        material: '플라스틱 (HDPE)',
        disposalCategory: 'PLASTIC',
        instructions: '닫아서 배출하거나 플라스틱류에 배출 (페트병과 재질 다름)',
        recycable: true,
      },
    ],
    steps: [
      '1. 페트병 안의 물/음료 내용물을 모두 비우고 수돗물로 가볍게 헹굽니다.',
      '2. 겉면에 부착된 비닐 라벨을 절취선대로 깔끔하게 떼어 비닐류에 넣습니다.',
      '3. 발로 밟거나 손으로 압축하여 부피를 줄입니다.',
      '4. 뚜껑을 살짝 닫거나 따로 플라스틱 수거함에 넣고, 본체는 "투명 페트병" 전용함에 배출합니다.'
    ],
    schoolNotice: '🏫 학교 매점 및 급식실 입구에 "투명 페트병 전용 수거함"이 별도 설치되어 있습니다. 유색 플라스틱과 섞이지 않게 주의해 주세요!',
    frequentMistake: '⚠️ 라벨 비닐을 떼지 않고 배출하면 재활용 공정에서 등급이 낮아져 재활용이 불가능해집니다.',
    imageUrl: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=600&auto=format&fit=crop&q=80',
    scannedAt: new Date().toISOString(),
  },
  {
    id: 'preset-2',
    itemName: '봉지 과자 (비닐 포장재)',
    summary: '과자 부스러기를 깨끗이 비우고 딱지 접기 없이 넓게 펴서 비닐류에 배출합니다.',
    category: 'VINYL',
    difficulty: 'EASY',
    recyclabilityScore: 80,
    co2SavedGrams: 18,
    components: [
      {
        partName: '과자 봉지',
        material: '복합재질 비닐 (OTHER)',
        disposalCategory: 'VINYL',
        instructions: '음식물 가루를 털어내고 비닐류 수거함에 평평하게 배출',
        recycable: true,
      }
    ],
    steps: [
      '1. 과자 부스러기와 잔여물 내용물을 깨끗하게 털어냅니다.',
      '2. 봉지에 기름이나 양념이 묻어있다면 헹구거나 휴지로 깨끗이 닦아냅니다.',
      '3. ⚠️ 과자 봉지를 부피를 줄인다고 딱지 모양으로 묶지 말고, 평평하게 펼치거나 차곡차곡 접어 배출합니다.'
    ],
    schoolNotice: '🏫 매점 앞 비닐류 전용함에 배출해 주세요. 이물질이 심하게 오염된 비닐은 종량제(일반) 쓰레기로 버려야 합니다.',
    frequentMistake: '⚠️ 비닐을 삼각 딱지로 접어서 버리면 풍력 선별기에서 중량이 올라가 재활용품 선별이 실패합니다!',
    imageUrl: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=600&auto=format&fit=crop&q=80',
    scannedAt: new Date().toISOString(),
  },
  {
    id: 'preset-3',
    itemName: '학교 급식 우유팩 (종이팩 200ml)',
    summary: '내용물을 비우고 물로 씻은 뒤 펼쳐서 바짝 말려 종이팩 전용함에 배출합니다.',
    category: 'CARTON',
    difficulty: 'MEDIUM',
    recyclabilityScore: 90,
    co2SavedGrams: 30,
    components: [
      {
        partName: '우유 종이팩',
        material: '살균팩 (고급 펄프)',
        disposalCategory: 'CARTON',
        instructions: '세척 후 펼쳐서 건조 뒤 종이팩 수거함 배출 (일반 폐지와 구분)',
        recycable: true,
      },
      {
        partName: '빨대 및 비닐 포장',
        material: '플라스틱/비닐',
        disposalCategory: 'GENERAL',
        instructions: '빨대는 일반쓰레기, 겉비닐은 비닐류에 분리',
        recycable: false,
      }
    ],
    steps: [
      '1. 우유를 남김없이 마십니다.',
      '2. 우유팩 상단을 펼치고 물로 내부를 깨끗이 씻어냅니다.',
      '3. 가위나 손으로 가르고 바짝 말려 악취를 방지합니다.',
      '4. 일반 폐지 박스가 아닌 "종이팩 전용 수거함" 또는 교실 우유팩 수거함에 차곡차곡 쌓아 배출합니다.'
    ],
    schoolNotice: '🏫 종이팩은 최고급 수입 펄프로 만들어져 휴지나 고급 화장지로 100% 재활용됩니다! 일반 박스 종이와 섞지 마세요.',
    frequentMistake: '⚠️ 씻지 않고 찌그러뜨려버리면 우유 잔여물이 부패하여 냄새가 나고 곰팡이가 생겨 재활용할 수 없게 됩니다.',
    imageUrl: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=600&auto=format&fit=crop&q=80',
    scannedAt: new Date().toISOString(),
  },
  {
    id: 'preset-4',
    itemName: '카페 아이스 음료 플라스틱 컵 (슬리브 + 빨대)',
    summary: '음료와 얼음을 씻어내고 컵과 뚜껑은 플라스틱, 컵홀더는 종이, 빨대는 일반쓰레기로 3단 분리!',
    category: 'PLASTIC',
    difficulty: 'HARD',
    recyclabilityScore: 70,
    co2SavedGrams: 25,
    components: [
      {
        partName: '투명 컵 & 뚜껑',
        material: 'PET / PP 플라스틱',
        disposalCategory: 'PLASTIC',
        instructions: '얼음과 음료 버린 후 세척하여 플라스틱 수거함 배출',
        recycable: true,
      },
      {
        partName: '종이 컵홀더 (슬리브)',
        material: '골판지 종이',
        disposalCategory: 'PAPER',
        instructions: '종이류 수거함 배출',
        recycable: true,
      },
      {
        partName: '플라스틱 빨대',
        material: '소형 플라스틱',
        disposalCategory: 'GENERAL',
        instructions: '크기가 너무 작아 선별 불가능하므로 일반쓰레기(종량제) 배출',
        recycable: false,
      }
    ],
    steps: [
      '1. 얼음과 남은 음료는 세면대나 잔반통에 전부 비웁니다.',
      '2. 종이 컵홀더(슬리브)를 벗겨 종이류 수거함으로 보냅니다.',
      '3. 플라스틱 빨대는 크기가 너무 작아 자동 선별기에서 분류되지 않으므로 종량제 봉투에 버립니다.',
      '4. 컵 본체와 뚜껑을 물로 헹군 뒤 플라스틱류 수거함에 겹쳐서 넣습니다.'
    ],
    schoolNotice: '🏫 등교길이나 쉬는시간 매점/카페 테이크아웃 컵 배출 시, 꼭 얼음과 남은 음료를 비우고 버려주세요!',
    frequentMistake: '⚠️ 얼음이 남아있는 채로 분리수거통에 던져 넣으면 주변 폐지와 박스가 젖어 전체가 재활용 불가 처리됩니다.',
    imageUrl: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=600&auto=format&fit=crop&q=80',
    scannedAt: new Date().toISOString(),
  },
  {
    id: 'preset-5',
    itemName: '육개장 컵라면 용기 (스티로폼 용기)',
    summary: '음식물 양념을 씻어내되, 빨간 국물 자국이 안 지워지면 일반쓰레기로 버립니다.',
    category: 'GENERAL',
    difficulty: 'MEDIUM',
    recyclabilityScore: 30,
    co2SavedGrams: 10,
    components: [
      {
        partName: '뚜껑 은박지/종이',
        material: '복합 재질',
        disposalCategory: 'GENERAL',
        instructions: '일반쓰레기 종량제 봉투 배출',
        recycable: false,
      },
      {
        partName: '스티로폼 용기',
        material: '발포스티렌(PSP)',
        disposalCategory: 'GENERAL',
        instructions: '국물 얼룩이 착색된 스티로폼은 재활용 불가 -> 일반쓰레기 배출',
        recycable: false,
      }
    ],
    steps: [
      '1. 라면 국물과 건더기 잔반을 완전히 비웁니다.',
      '2. 물로 깨끗이 세척한 뒤 햇빛에 말려봅니다.',
      '3. 💡 착색 없이 흰색 스티로폼 상태가 유지되면 스티로폼 수거함에 배출 가능!',
      '4. ❌ 빨간 국물 착색이 그대로 남아있다면 스티로폼으로 재활용할 수 없으므로 종량제 봉투(일반쓰레기)로 배출합니다.'
    ],
    schoolNotice: '🏫 학교 동아리실이나 교실에서 야식/간식으로 먹은 컵라면 용기는 국물이 찌들어 일반쓰레기로 분류되는 경우가 많습니다.',
    frequentMistake: '⚠️ 빨간 국물이 묻은 스티로폼 용기를 그냥 스티로폼 수거함에 넣으면 다른 깨끗한 스티로폼까지 오염시킵니다.',
    imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80',
    scannedAt: new Date().toISOString(),
  },
  {
    id: 'preset-6',
    itemName: '다 쓴 과학실 AA 건전지',
    summary: '일반쓰레기에 버리면 환경오염 유발! 학교 전용 폐건전지 수거함에 넣으세요.',
    category: 'EWASTE',
    difficulty: 'EASY',
    recyclabilityScore: 100,
    co2SavedGrams: 60,
    components: [
      {
        partName: '알칼라인 건전지',
        material: '망간/아연/중금속',
        disposalCategory: 'EWASTE',
        instructions: '폐건전지 전용 수거함 배출 (철/아연 유용한 자원 추출)',
        recycable: true,
      }
    ],
    steps: [
      '1. 건전지 누액이나 중금속 유출을 방지하기 위해 물기 없이 보관합니다.',
      '2. 일반 종량제 봉투나 플라스틱함에 절대 넣지 마세요 (매립 시 토양/수질 오염 원인).',
      '3. 본관 1층 안내데스크 옆 또는 과학실 앞 "폐건전지 전용 수거함"에 넣습니다.'
    ],
    schoolNotice: '🏫 과학실, 행정실, 교실 리모컨의 폐건전지는 모아서 폐건전지 수거함에 배출하면 새 건전지나 휴지로 교환되는 캠페인이 열립니다.',
    frequentMistake: '⚠️ 건전지를 일반쓰레기로 버리면 쓰레기 incinerator(소각장) 및 매립지에서 화재 폭발 및 중금속 유출 오염이 발생합니다.',
    imageUrl: 'https://images.unsplash.com/photo-1619725002198-6a689b72f41d?w=600&auto=format&fit=crop&q=80',
    scannedAt: new Date().toISOString(),
  }
];

export const SCHOOL_BIN_LOCATIONS: BinLocation[] = [
  {
    id: 'bin-1',
    name: '본관 1층 분리수거 중앙 센터',
    building: '본관 (Main Building)',
    floor: '1층 중앙 현관 옆',
    categories: ['PET', 'PLASTIC', 'VINYL', 'PAPER', 'CARTON', 'CAN', 'GLASS', 'EWASTE'],
    description: '교내에서 가장 큰 중앙 분리수거 구역. 전 품목 분리배출 가능.',
    tips: '폐건전지함과 폐형광등 수거함이 함께 배치되어 있습니다.',
    iconName: 'Building2',
    coordinates: { x: 50, y: 75 }
  },
  {
    id: 'bin-2',
    name: '급식실 및 학생 매점 입구',
    building: '학생회관 / 급식동',
    floor: '1층 입구 출입문',
    categories: ['PET', 'PLASTIC', 'VINYL', 'CAN', 'FOOD'],
    description: '식음료 쓰레기 집중 배출 구역.',
    tips: '투명 페트병 전용 수거통과 음료 잔반 처리 세면대가 설치되어 있습니다.',
    iconName: 'Utensils',
    coordinates: { x: 25, y: 40 }
  },
  {
    id: 'bin-3',
    name: '도서관 및 자기주도학습실',
    building: '학술정보관',
    floor: '2층 로비',
    categories: ['PAPER', 'GENERAL', 'PET'],
    description: '이면지, 시험지, 프린트물, 공부용 음료 페트병 배출 구역.',
    tips: '스태플러 심이 박힌 종이는 심을 제거하고 배출해 주세요.',
    iconName: 'BookOpen',
    coordinates: { x: 75, y: 30 }
  },
  {
    id: 'bin-4',
    name: '과학실 및 실습동',
    building: '창의실습관',
    floor: '1층 복도',
    categories: ['EWASTE', 'GLASS', 'CAN', 'GENERAL'],
    description: '실험 도구, 시약병(세척필), 폐건전지 수거 구역.',
    tips: '깨진 유리는 신문지에 싸서 안전하게 일반쓰레기(안전 마포대)로 버려야 합니다.',
    iconName: 'FlaskConical',
    coordinates: { x: 80, y: 65 }
  },
  {
    id: 'bin-5',
    name: '체육관 및 운동장 스탠드',
    building: '체육관 (Gymnasium)',
    floor: '1층 스탠드 옆',
    categories: ['PET', 'CAN', 'GENERAL'],
    description: '체육시간 및 체육대회 후 음료캔 및 스포츠 이온음료 페트병 수거 구역.',
    tips: '캔은 압축 발판을 사용하여 찌그러뜨려 넣어주세요!',
    iconName: 'Trophy',
    coordinates: { x: 20, y: 80 }
  }
];

export const DAILY_QUIZZES: QuizQuestion[] = [
  {
    id: 'q1',
    question: '택배 상자나 택배 포장재를 버릴 때 재활용율을 높이기 위해 가장 먼저 해야 할 일은?',
    options: [
      '상자를 작게 갈갈이 찢어서 버린다',
      '테이프, 운송장 스티커, 스태플러 심을 깔끔히 제거한다',
      '물에 적셔 단단하게 뭉친다',
      '다른 플라스틱을 상자 안에 가득 담아 버린다'
    ],
    correctAnswerIndex: 1,
    explanation: '택배 박스에 붙어있는 비닐 테이프와 운송장 스티커는 종이 재활용 공정에서 펄프 해일을 방해하는 주요 오염 원인입니다. 반드시 제거 후 배출해야 합니다.',
    category: 'PAPER'
  },
  {
    id: 'q2',
    question: '학교 매점에서 사먹은 투명 생수 페트병 배출 방법으로 올바른 것은?',
    options: [
      '라벨 비닐을 떼지 않고 뚜껑만 버린다',
      '라벨 비닐을 떼어내고, 내용물을 비운 뒤 찌그러뜨려 투명페트병 전용함에 버린다',
      '유색 플라스틱 수거함에 함께 섞어 버린다',
      '과자 부스러기를 페트병 안에 집어넣고 버린다'
    ],
    correctAnswerIndex: 1,
    explanation: '투명 페트병은 고품질 의류용 섬유 원사로 재활용되므로, 라벨 제거와 유색 플라스틱과의 분리가 필수적입니다.',
    category: 'PET'
  },
  {
    id: 'q3',
    question: '다음 중 "일반쓰레기(종량제 봉투)"로 버려야 하는 물품은?',
    options: [
      '깨끗이 씻은 우유팩',
      '스프링을 제거한 노트 내지 종이',
      '양념과 기름이 찌들어 안 닦이는 컵라면 스티로폼 용기',
      '알루미늄 음료수 캔'
    ],
    correctAnswerIndex: 2,
    explanation: '음식물 기름때나 국물이 깊게 스며든 스티로폼 용기는 세척되지 않으면 스티로폼으로 재활용할 수 없어 종량제 봉투에 버려야 합니다.',
    category: 'GENERAL'
  }
];

export const ECO_BADGES: EcoBadge[] = [
  {
    id: 'b1',
    title: '분리배출 새싹',
    description: '첫 번째 쓰레기 제품을 스캔하고 분리배출 가이드를 확인했습니다.',
    icon: 'Sprout',
    requiredScans: 1
  },
  {
    id: 'b2',
    title: '라벨 떼기 달인',
    description: '총 5회 이상 분리배출 스캔 및 환경 활동을 기록했습니다.',
    icon: 'CheckCircle2',
    requiredScans: 5
  },
  {
    id: 'b3',
    title: '그린 캠퍼스 리더',
    description: '총 10회 이상 분리수거를 실천하여 300g 이상의 탄소 배출을 줄였습니다.',
    icon: 'Award',
    requiredScans: 10
  },
  {
    id: 'b4',
    title: '제로 웨이스트 마스터',
    description: '총 20회 이상 스캔 및 학교 수거함 위치를 완벽 숙지했습니다.',
    icon: 'Crown',
    requiredScans: 20
  }
];

export const RECYCLING_CHEATSHEET = [
  {
    category: 'PET (투명 페트병)',
    color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    badgeColor: 'bg-emerald-600 text-white',
    items: ['생수병', '투명 탄산음료병'],
    rule: '비우기 ➔ 라벨 떼기 ➔ 찌그러뜨리기 ➔ 투명페트 전용함 배출'
  },
  {
    category: 'PLASTIC (일반 플라스틱)',
    color: 'bg-blue-50 text-blue-800 border-blue-200',
    badgeColor: 'bg-blue-600 text-white',
    items: ['유색 음료병', '샴푸/세제 용기', '바나나우유 용기', '밀폐용기'],
    rule: '내용물 세척 ➔ 다른 재질(스티커, 스프링) 제거 ➔ 플라스틱함 배출'
  },
  {
    category: 'VINYL (비닐류)',
    color: 'bg-purple-50 text-purple-800 border-purple-200',
    badgeColor: 'bg-purple-600 text-white',
    items: ['과자 봉지', '라면 봉지', '에어캡(뽁뽁이)', '일회용 비닐봉투'],
    rule: '이물질 털기 ➔ 딱지 접기 금지! (펼치거나 바짝 접기) ➔ 비닐류 배출'
  },
  {
    category: 'PAPER / CARTON (종이 / 종이팩)',
    color: 'bg-amber-50 text-amber-800 border-amber-200',
    badgeColor: 'bg-amber-600 text-white',
    items: ['우유팩(살균팩)', '두유팩(멸균팩)', '박스', '프린트 종이'],
    rule: '종이팩은 세척·건조 후 종이팩 전용함! 일반 상자는 테이프 제거 후 접어서 배출'
  },
  {
    category: 'CAN / GLASS (캔 / 유리병)',
    color: 'bg-cyan-50 text-cyan-800 border-cyan-200',
    badgeColor: 'bg-cyan-600 text-white',
    items: ['탄산캔', '통조림캔', '유리 음료병', '잼 병'],
    rule: '내용물 헹구기 ➔ 플라스틱 뚜껑 분리 ➔ 캔은 찌그러뜨리기, 유리는 깨지지 않게 배출'
  },
  {
    category: 'GENERAL (일반쓰레기 / 종량제)',
    color: 'bg-stone-50 text-stone-800 border-stone-200',
    badgeColor: 'bg-stone-600 text-white',
    items: ['빨대', '영수증(감열지)', '기름 묻은 종이/스티로폼', '깨진 유리', '부러진 팬'],
    rule: '재활용 불가 품목은 종량제 봉투로 배출'
  }
];
