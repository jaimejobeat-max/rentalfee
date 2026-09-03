/**
 * LAYER STUDIOS 전 지점 파트별 통합 견적 엔진
 * 반영 지점: 한남, 7, 20, 11, 27, 26, 41, 홍대
 *
 * bands  : 요금표의 인원 구간. 요금표 화면의 열 머리와 셀 강조에 쓴다.
 * sheet  : 요금표 메타 — 제목, 개정일, 원본 이미지(도면 포함), 파트 표기, 행사 12h 요금.
 *          행사 요금은 계산기에서 다루지 않고 요금표에만 표시한다.
 */
const LAYER_MASTER_ENGINE = {
    studios: {
        'HANNAM': {
            // 인원 구간 [최소, 최대] — 요금표 열과 1:1 대응 (getN과 같은 구간)
            bands: [[1, 10], [11, 20], [21, 30], [31, 40], [41, 80]],
            sheet: { title: 'HANNAM RENTAL FEE', version: '2025.02.26', image: 'sheets/hannam.jpg', labels: { 'ALL': 'ALL (1+2F)' }, event: [['ALL (1+2F)', 1000]] },
            getN: (p) => Math.min(Math.ceil(p / 10) - 1, 4),
            parts: {
                '1F': { photo: { day: [120, 150, 200, null, null], half: [100, 120, 200, null, null] }, video: { day: [200, 250, 300, null, null], half: [150, 200, 250, null, null] } },
                '2F': { photo: { day: [120, 150, 180, null, null], half: [100, 120, 150, null, null] }, video: { day: [150, 200, 250, null, null], half: [100, 150, 200, null, null] } },
                'ALL': { photo: { day: [200, 280, 350, 500, 600], half: [150, 200, 250, 300, 400] }, video: { day: [300, 400, 500, 600, 700], half: [200, 250, 300, 400, 500] } }
            }
        },
        'LAYER7': {
            // 인원 구간 [최소, 최대] — 요금표 열과 1:1 대응 (getN과 같은 구간)
            bands: [[1, 10], [11, 20], [21, 30], [31, 80]],
            sheet: { title: 'LAYER7 RENTAL FEE', version: '2023.08.17', image: 'sheets/layer7.jpg', labels: { 'C': 'C (+가든)' }, event: [['ABC (ALL)', 1000]] },
            getN: (p) => Math.min(Math.ceil(p / 10) - 1, 3),
            parts: {
                'A': { photo: { day: [180, 250, null, null], half: [100, 150, null, null] }, video: { day: [200, 300, null, null], half: [150, 200, null, null] } },
                'AB': { photo: { day: [220, 300, null, null], half: [150, 200, null, null] }, video: { day: [250, 330, null, null], half: [180, 270, null, null] } },
                'AC': { photo: { day: [230, 330, null, null], half: [180, 220, null, null] }, video: { day: [300, 360, null, null], half: [220, 300, null, null] } },
                'BC': { photo: { day: [180, 230, null, null], half: [120, 150, null, null] }, video: { day: [200, 250, null, null], half: [150, 200, null, null] } },
                'ABC': { photo: { day: [300, 350, 400, 500], half: [200, 250, 300, 400] }, video: { day: [400, 450, 500, 600], half: [300, 350, 400, 500] } },
                'C': { photo: { day: [80, null, null, null], half: [60, null, null, null] }, video: { day: [100, null, null, null], half: [80, null, null, null] } }
            }
        },
        'LAYER20': {
            // 인원 구간 [최소, 최대] — 요금표 열과 1:1 대응 (getN과 같은 구간)
            bands: [[1, 10], [11, 20], [21, 30], [31, 80]],
            sheet: { title: 'LAYER20 RENTAL FEE', version: '2023.09.11', image: 'sheets/layer20.jpg', labels: { 'ALL': 'ALL (1+2+3F)' }, event: [['1F', 1300], ['1+2F', 1600], ['ALL (1+2+3F)', 1800]] },
            getN: (p) => Math.min(Math.ceil(p / 10) - 1, 3),
            parts: {
                '1F': { photo: { day: [200, 250, 450, 650], half: [150, 200, 300, 450] }, video: { day: [300, 400, 600, 900], half: [200, 300, 450, 650] } },
                '2F': { photo: { day: [200, 250, 450, 650], half: [150, 200, 300, 450] }, video: { day: [300, 400, 600, 900], half: [200, 300, 450, 650] } },
                '3F': { photo: { day: [150, 200, 300, 500], half: [120, 150, 250, 300] }, video: { day: [200, 300, 500, null], half: [150, 180, 350, null] } },
                '1+2F': { photo: { day: [350, 450, 650, 850], half: [250, 320, 450, 550] }, video: { day: [450, 650, 900, 1100], half: [300, 450, 650, 750] } },
                '2+3F': { photo: { day: [350, 450, 650, 850], half: [250, 320, 450, 550] }, video: { day: [450, 650, 900, 1100], half: [300, 450, 650, 750] } },
                'ALL': { photo: { day: [450, 600, 800, 1000], half: [300, 400, 600, 700] }, video: { day: [550, 850, 1100, 1300], half: [400, 650, 800, 900] } }
            }
        },
        'LAYER11': {
            // 인원 구간 [최소, 최대] — 요금표 열과 1:1 대응 (getN과 같은 구간)
            bands: [[1, 10], [11, 20], [21, 30], [31, 40], [41, 80]],
            sheet: { title: 'LAYER11 RENTAL FEE', version: '2023.08.17', image: 'sheets/layer11.jpg', labels: {}, event: [['A+B', 1300], ['A+B+카페', 1800]] },
            getN: (p) => Math.min(Math.ceil(p / 10) - 1, 4),
            parts: {
                'A': { photo: { day: [150, 200, 300, 400, null], half: [100, 150, 200, 300, null] }, video: { day: [250, 350, 500, 600, null], half: [150, 200, 300, 400, null] } },
                'B': { photo: { day: [200, 300, 350, 500, null], half: [150, 200, 250, 350, null] }, video: { day: [300, 400, 600, 700, null], half: [200, 300, 400, 500, null] } },
                // 견적표의 'AB/B+CAFE' 한 행이 A+B와 B+카페 두 구성을 함께 가리킨다 — 요금이 같아 같은 값을 쓴다
                'A+B': { photo: { day: [300, 400, 500, 600, 750], half: [250, 300, 350, 400, 500] }, video: { day: [400, 500, 700, 900, 1000], half: [350, 400, 500, 600, 700] } },
                'B+카페': { photo: { day: [300, 400, 500, 600, 750], half: [250, 300, 350, 400, 500] }, video: { day: [400, 500, 700, 900, 1000], half: [350, 400, 500, 600, 700] } },
                'A+B+카페': { photo: { day: [450, 550, 650, 700, 900], half: [350, 400, 450, 500, 600] }, video: { day: [550, 650, 800, 1000, 1200], half: [400, 500, 600, 700, 800] } }
            }
        },
        'LAYER27': {
            // 인원 구간 [최소, 최대] — 요금표 열과 1:1 대응 (getN과 같은 구간)
            bands: [[1, 10], [11, 20], [21, 30], [31, 80]],
            sheet: { title: 'LAYER27 RENTAL FEE', version: '2024.05.22', image: 'sheets/layer27.jpg', labels: { 'A': 'A (1F+철제난간)', 'ALL': 'ALL (2F오피스 포함)' }, event: [['A (1F+철제난간)', 700], ['ALL (2F오피스 포함)', 1000]] },
            getN: (p) => Math.min(Math.ceil(p / 10) - 1, 3),
            parts: {
                'A': { photo: { day: [150, 200, 250, 400], half: [120, 150, 200, 400] }, video: { day: [200, 250, 350, 600], half: [150, 200, 300, 500] } },
                'ALL': { photo: { day: [250, 300, 350, 400], half: [200, 250, 300, 400] }, video: { day: [300, 350, 500, 600], half: [250, 300, 400, 500] } }
            }
        },
        'LAYER26': {
            // 인원 구간 [최소, 최대] — 요금표 열과 1:1 대응 (getN과 같은 구간)
            bands: [[1, 10], [11, 20], [21, 30], [31, 80]],
            sheet: { title: 'LAYER26 RENTAL FEE', version: '2024.05.22', image: 'sheets/layer26.jpg', labels: { 'A': 'A (1F)', 'AB': 'AB (1+2F)' }, event: [['AB (1+2F)', 700]] },
            getN: (p) => Math.min(Math.ceil(p / 10) - 1, 3),
            parts: {
                'A': { photo: { day: [150, 200, 250, 400], half: [120, 150, 200, 300] }, video: { day: [200, 250, 350, 550], half: [150, 200, 300, 450] } },
                'AB': { photo: { day: [180, 230, 280, 400], half: [150, 180, 250, 300] }, video: { day: [250, 300, 400, 550], half: [200, 250, 350, 450] } }
            }
        },
        'LAYER41': {
            // 인원 구간 [최소, 최대] — 요금표 열과 1:1 대응 (getN과 같은 구간)
            bands: [[1, 10], [11, 15], [16, 20], [21, 30], [31, 80]],
            sheet: { title: 'LAYER41 RENTAL FEE', version: '2023.08.17', image: 'sheets/layer41.jpg', labels: { 'A': 'A (1F)', 'AB': 'AB (1+2F)', 'ABC': 'ABC (1+2+3F)', 'C': 'C (3F)', 'AC': 'AC (1+3F)' }, event: [['AB (1+2F)', 1300], ['ABC (1+2+3F)', 1800]] },
            getN: (p) => p <= 10 ? 0 : p <= 15 ? 1 : p <= 20 ? 2 : p <= 30 ? 3 : 4,
            parts: {
                'A': { photo: { day: [200, 250, 300, 400, 500], half: [120, 180, 230, 300, 350] }, video: { day: [250, 300, 400, 500, 700], half: [150, 250, 300, 400, 500] } },
                'AB': { photo: { day: [230, 280, 350, 450, 600], half: [150, 200, 250, 350, 450] }, video: { day: [280, 350, 450, 550, 800], half: [200, 280, 350, 500, 600] } },
                'ABC': { photo: { day: [350, 400, 500, 650, 800], half: [200, 300, 350, 450, 600] }, video: { day: [400, 500, 700, 850, 1200], half: [250, 350, 450, 700, 900] } },
                'C': { photo: { day: [150, 230, 280, 350, null], half: [100, 150, 200, 250, null] }, video: { day: [200, 250, 330, 430, null], half: [120, 180, 250, 330, null] } },
                'AC': { photo: { day: [300, 350, 450, 550, 650], half: [180, 250, 300, 400, 500] }, video: { day: [350, 450, 600, 750, 950], half: [230, 300, 400, 600, 750] } }
            }
        },
        'HONGDAE': {
            // 시간제(15인 이하) / 전관(16인 이상) 인원 구간 — getN_small / getN_large와 같은 구간
            bands_small: [[1, 4], [5, 5], [6, 6], [7, 7], [8, 10], [11, 15]],
            bands_large: [[16, 20], [21, 30], [31, 40], [41, 80]],
            sheet: { title: 'HONGDAE RENTAL FEE', version: null, image: null, labels: {}, event: [] },
            getN_small: (p) => p <= 4 ? 0 : p <= 5 ? 1 : p <= 6 ? 2 : p <= 7 ? 3 : p <= 10 ? 4 : 5,
            getN_large: (p) => p <= 20 ? 0 : p <= 30 ? 1 : p <= 40 ? 2 : 3,
            parts: {
                'A': { hourly: [6, 6.5, 7, 7.5, 0, 0] },
                'B': { hourly: [6, 6.5, 7, 7.5, 0, 0] },
                'D': { hourly: [6, 6.5, 7, 7.5, 0, 0] },
                'A+B': { hourly: [12, 12, 12, 12, 15, 20] },
                'B+D': { hourly: [12, 12, 12, 12, 15, 20] },
                'A+B+D': {
                    hourly: [18, 18, 18, 18, 18, 25],
                    fixed: { day: [250, 300, 400, 500], half: [150, 200, 300, 400] }
                }
            }
        }
    },

    calculate: function ({ studio, part, type, time, personnel, hours = 1, extraHours = 0, options = [] }) {
        const sData = this.studios[studio];
        if (!sData) return 0;

        // 1. 홍대 소규모 (15인 이하) 시간제
        if (studio === 'HONGDAE' && personnel <= 15) {
            const n = sData.getN_small(personnel);
            const rate = sData.parts[part].hourly[n] || 0;
            if (rate === 0) return '인원 초과 · 복합 파트를 선택해주세요';
            let base = rate * hours;
            // 옵션: 각각 +5만원/h
            const optCount = [options.includes('GREENHOUSE'), options.includes('BACKGARDEN')].filter(Boolean).length;
            base += 5 * hours * optCount;
            return base;
        }

        // 2. 홍대 대규모: A+B+D 전관만 가능
        if (studio === 'HONGDAE' && personnel > 15) {
            if (part !== 'A+B+D') return '16명 이상은 A+B+D (전관)만 이용 가능합니다';
            const n = sData.getN_large(personnel);
            const basePrice = sData.parts['A+B+D'].fixed[time][n];
            const dayPriceRef = sData.parts['A+B+D'].fixed['day'][n];
            const optCount = [options.includes('GREENHOUSE'), options.includes('BACKGARDEN')].filter(Boolean).length;
            const optionFee = optCount > 0 ? (personnel <= 30 ? 30 : 60) * optCount : 0;
            const extraFee = (dayPriceRef * 0.1) * extraHours;
            return basePrice + optionFee + extraFee;
        }

        // 3. 일반 지점
        const n = sData.getN(personnel);
        const cat = type.toLowerCase();
        const price = sData.parts[part][cat][time][n];
        if (price === null) return '인원 초과 · 더 넓은 파트를 선택해주세요';

        const dayPriceRef = sData.parts[part][cat]['day'][n];
        const extraFee = (dayPriceRef * 0.1) * extraHours;
        return price + extraFee;
    }
};
