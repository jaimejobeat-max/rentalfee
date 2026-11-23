/**
 * LAYER STUDIOS 견적 산출기 — UI
 * 계산은 전부 engine.js에 맡기고, 여기서는 상태·표시만 다룬다.
 */

// ─── 언어 ───────────────────────────────────────────────
// 화면 문구는 전부 여기서 나온다. 요금 데이터(engine.js)는 언어와 무관하다.
const I18N = {
    ko: {
        title: 'LAYER STUDIOS — 견적 산출기',
        lang_btn: 'English', lang_btn_s: 'EN',
        // 메뉴 — '안내'만으로는 주차 정보가 있는 줄 모른다. '견적 산출'을 줄여 생긴 자리에 '주차'를 넣었다
        nav_calc: '견적', nav_sheet: '요금표', nav_info: '주차·안내',
        info_link: n => `${n} 주차 · 오시는 길`,
        info_title: 'Information', info_pdf: '기본 안내 (PDF)', info_fee: '요금표 보기',
        info_g1: n => `${n} 오시는 길 · 주차`, info_g2: '전력 · 발전차 안내',
        info_h: { address: '주소', access: '찾아오시는 길', parking: '주차 가능 대수', paid: '유료 주차장', generator: '발전차', power: '전력' },
        info_power: (t, u, approx) => `총 전력 ${t}kW` + (u ? ` / 가용 전력 ${approx ? '약 ' : ''}${u}kW` : ''),
        info_paid_note: '', copy: '복사', copied: '복사됨',
        note_part: '가구 촬영 혹은 차량 내부 진입 시 별도 금액 협의',
        type_photo: '사진', type_video: '영상',
        note_extra: '연장료 = 풀데이 기본요금의 10% / 시간',
        tag_hongdae: '홍대 전용', opt_greenhouse: '그린하우스', opt_backgarden: '백가든',
        cap_max: n => `~${n}명`, cap_min: n => `${n}명~`,
        vat: 'VAT 별도', vat_s: 'VAT 별도',
        rc_foot: '모든 금액은 부가세(VAT 10%) 별도입니다.<br>본 견적은 참고용이며 실제 요금과 다를 수 있습니다.<br>정확한 금액은 지점에 문의하세요.',
        chat: '채널톡 문의', chat_close: '채널톡 닫기',
        peek_cue: '견적서', peek_why: '사유', peek_close: '닫기', na: '산출 불가',
        rc_title: '견적서', rc_copy: '견적 복사',
        // 가견적서
        doc_open: '가견적서 만들기', doc_title: 'Estimate', doc_sub: n => `${n} 가견적서`, doc_base: (s, p) => `${s} ${p} 대관`, doc_qty: '수량 × 단가', doc_spec: '대관 내용', doc_print: '인쇄', doc_pdf: 'PDF 미리보기', doc_making: 'PDF 만드는 중…',
        prev_title: 'PDF 미리보기', prev_back: '← 수정하기', prev_note: '이 모양 그대로 저장됩니다', prev_save: '다운로드', prev_saved: '저장했습니다', doc_close: '닫기',
        doc_date: '견적일', doc_to: '수신', doc_to_ph: '회사명 / 성함', doc_to_suffix: '귀하',
        doc_shoot: '촬영 예정일', doc_shoot_ph: '예: 2026.12.03', doc_from: '공급자', doc_studio: '지점', doc_addr: '주소', doc_contact: '문의',
        doc_item: '항목', doc_detail: '내용', doc_amount: '금액 (원)', doc_rental: '대관료',
        doc_supply: '공급가액', doc_vat: '부가세 (10%)', doc_sum: '합계 (원)',
        doc_memo: '비고', doc_memo_ph: '요청 사항이 있으면 적어 주세요', doc_notes: '안내.',
        doc_disclaimer: '본 문서는 가견적서이며 확정 견적이 아닙니다. 실제 요금은 상세 협의 후 달라질 수 있습니다.',
        doc_won: n => Math.round(n).toLocaleString('ko-KR'),
        doc_file: (studio, date, to) => `LAYER STUDIOS 가견적서 ${studio} ${date}${to ? ' ' + to : ''}`,
        rc_text_head: d => `[LAYER STUDIOS 견적] ${d}`, rc_text_foot: '※ 참고용 견적이며 실제 요금과 다를 수 있습니다.',
        studio: { HANNAM: '한남', LAYER7: '레이어 7', LAYER20: '레이어 20', LAYER11: '레이어 11',
                  LAYER27: '레이어 27', LAYER26: '레이어 26', LAYER41: '레이어 41', HONGDAE: '홍대' },
        hongdae_groups: ['단독 룸 (최대 7명 · 시간제)', '복합 룸 (최대 15명 · 시간제)', '전체 공간 (16명+ 가능)'],
        restrict: {
            hannam: '31명 이상은 ALL 파트만 이용 가능합니다',
            l7_abc: '20명 이상은 ABC 파트만 이용 가능합니다', l7_15: '15명 이상 해당 파트 이용 불가합니다', l7_c: '10명 초과 시 C 파트 이용 불가합니다',
            l20: '31명 이상 3F 대관 불가합니다',
            l11: '41명 이상은 A+B / B+카페 / A+B+카페만 이용 가능합니다',
            l27: '31명 이상은 ALL 파트만 이용 가능합니다', l26: '31명 이상은 AB 파트만 이용 가능합니다',
            l41: '40명 이상은 AB / ABC 파트만 이용 가능합니다',
            hongdae: '8명 이상은 복합 파트를 선택해주세요 (A+B / B+D / A+B+D)',
        },
        hours: h => `${h}시간`, people: p => `${p}명`, day9: 'Day 9시간', half4: 'Half 4시간', per_h: '/시간',
        // 왼쪽 행 머리 — 견적서의 항목 이름과 같은 말을 쓴다
        row_studio: '지점', row_part: '파트', row_type: '종류', row_personnel: '인원', row_time: '시간', row_extra: '연장', row_options: '옵션',
        spec_studio: '지점', spec_part: '파트', spec_type: '종류', spec_people: '인원', spec_time: '시간',
        spec_hourly: h => `${h}시간 (시간제)`, spec_day: 'Day 9시간', spec_half: 'Half 4시간',
        status: '상태', sum: '합계', base: '기본 요금', overtime: h => `연장 ${h}시간`, options: n => `옵션 ${n}`,
        won: n => `${fmt(n)}만원`,
        // 요금표
        sh_key: '현재 선택 · 칸을 누르면 견적에 반영됩니다',
        sec_day: 'Day 9시간 · 사진 / 영상', sec_half: 'Half 4시간 · 사진 / 영상', sec_event: 'Event 12시간 · 행사',
        sec_plan: 'Floor plan · 도면 · 원본 요금표', sec_hourly: '시간제 · 15명 이하', sec_whole: '전관 A+B+D · 16명 이상',
        unit: '단위 만원', unit_h: '단위 만원 / 시간', g_photo: '사진', g_video: '영상', g_hourly: '시간당',
        n_over: '*추가 시간 당 렌탈 비용의 10% (Day견적으로 적용)', n_furn: '*가구 촬영 혹은 차량 내부 진입 시 별도 금액 협의',
        n_exh: '*전시 및 장기 대관 시 할인 적용 별도 협의', n_change: '*상세 협의 시 일부 견적이 변경될 수 있습니다.',
        n_contact: '일정 및 세부 문의는 <b>contact@plusjun.com</b> 메일로 부탁드립니다.',
        n_image: '이미지를 누르면 크게 볼 수 있습니다.', img_alt: '원본 요금표 (도면 포함)',
        n_h_single: '*단독 룸(A·B·D)은 최대 7명', n_h_combo: '*8명 이상은 복합 파트(A+B / B+D / A+B+D)',
        n_h_bg: '*A 파트는 백가든 이용이 포함된 요금입니다', n_h_opt: '*그린하우스 옵션 +4만원/시간', n_h_over: '*추가 시간 당 Day 요금의 10%',
        n_h_opt2: '*그린하우스·백가든 옵션 각 +30만원(16~30명) / +50만원(31명 이상) · 시간 무관 정액',
        band: ([lo, hi], i, n) => (i === 0 && lo === 1) ? `~${hi}명` : (i === n - 1 && hi >= PERSONNEL_MAX) ? `${lo}명~` : lo === hi ? `${lo}명` : `${lo}~${hi}명`,
        partName: k => k,
    },
    en: {
        title: 'LAYER STUDIOS — Rental Quote',
        lang_btn: '한국어', lang_btn_s: 'KO',
        nav_calc: 'Quote', nav_sheet: 'Rates', nav_info: 'Visit',   // 'Access'·'Parking'은 좁은 폰 헤더에 안 들어간다
        info_link: n => `${n} parking & directions`,
        info_title: 'Information', info_pdf: 'Main Information (PDF)', info_fee: 'View rates',
        info_g1: n => `${n} — directions & parking`, info_g2: 'Power & generator truck',
        info_h: { address: 'Address', access: 'Getting here', parking: 'Parking', paid: 'Paid parking nearby', generator: 'Generator truck', power: 'Power' },
        info_power: (t, u, approx) => `Total ${t}kW` + (u ? ` / usable ${approx ? 'approx. ' : ''}${u}kW` : ''),
        info_paid_note: '*Names and addresses are kept in Korean so you can paste them into a map app.', copy: 'Copy', copied: 'Copied',
        note_part: 'Furniture shoots or vehicle access are priced separately',
        type_photo: 'Photo', type_video: 'Video',
        note_extra: 'Overtime = 10% of the full-day base rate per hour',
        tag_hongdae: 'Hongdae only', opt_greenhouse: 'Greenhouse', opt_backgarden: 'Back garden',
        cap_max: n => `up to ${n}`, cap_min: n => `${n}+`,
        vat: 'VAT excluded', vat_s: '+VAT',   // 하단 바는 좁아서 짧게
        rc_foot: 'All prices exclude VAT (10%).<br>This quote is for reference and may differ from the actual fee.<br>Contact the studio for an exact price.',
        chat: 'Chat with us', chat_close: 'Close chat',
        peek_cue: 'Quote', peek_why: 'Why', peek_close: 'Close', na: 'Unavailable',
        rc_title: 'Quotation', rc_copy: 'Copy quote',
        doc_open: 'Create provisional quote', doc_title: 'Estimate', doc_sub: n => `${n}, provisional quote`, doc_base: (s, p) => `${s} ${p} rental`, doc_qty: 'Quantity × rate', doc_spec: 'Booking details', doc_print: 'Print', doc_pdf: 'Preview PDF', doc_making: 'Creating PDF…',
        prev_title: 'PDF preview', prev_back: '← Edit', prev_note: 'Saved exactly as shown', prev_save: 'Download', prev_saved: 'Saved', doc_close: 'Close',
        doc_date: 'Date', doc_to: 'To', doc_to_ph: 'Company / Name', doc_to_suffix: '',
        doc_shoot: 'Shoot date', doc_shoot_ph: 'e.g. 2026.12.03', doc_from: 'From', doc_studio: 'Studio', doc_addr: 'Address', doc_contact: 'Contact',
        doc_item: 'Item', doc_detail: 'Details', doc_amount: 'Amount KRW', doc_rental: 'Rental fee',
        doc_supply: 'Subtotal', doc_vat: 'VAT (10%)', doc_sum: 'Total KRW',
        doc_memo: 'Notes', doc_memo_ph: 'Add any requests here', doc_notes: 'Terms.',
        doc_disclaimer: 'This is a provisional quotation, not a confirmed quote. The actual fee may change after detailed consultation.',
        doc_won: n => Math.round(n).toLocaleString('en-US'),
        doc_file: (studio, date, to) => `LAYER STUDIOS Estimate ${studio} ${date}${to ? ' ' + to : ''}`,
        rc_text_head: d => `[LAYER STUDIOS quote] ${d}`, rc_text_foot: '* For reference only; the actual fee may differ.',
        studio: { HANNAM: 'Hannam', LAYER7: 'Layer 7', LAYER20: 'Layer 20', LAYER11: 'Layer 11',
                  LAYER27: 'Layer 27', LAYER26: 'Layer 26', LAYER41: 'Layer 41', HONGDAE: 'Hongdae' },
        hongdae_groups: ['Single room (up to 7 · hourly)', 'Combined rooms (up to 15 · hourly)', 'Whole space (16+)'],
        restrict: {
            hannam: 'Groups of 31 or more can only book ALL',
            l7_abc: 'Groups of 20 or more can only book ABC', l7_15: 'Not available for 15 or more', l7_c: 'C is not available for more than 10',
            l20: '3F is not available for 31 or more',
            l11: 'Groups of 41 or more can only book A+B, B+CAFE or A+B+CAFE',
            l27: 'Groups of 31 or more can only book ALL', l26: 'Groups of 31 or more can only book AB',
            l41: 'Groups of 40 or more can only book AB or ABC',
            hongdae: 'For 8 or more, choose a combined part (A+B / B+D / A+B+D)',
        },
        hours: h => `${h}h`, people: p => `${p} ppl`, day9: 'Day 9h', half4: 'Half 4h', per_h: '/h',
        row_studio: 'Studio', row_part: 'Part', row_type: 'Type', row_personnel: 'Personnel', row_time: 'Time', row_extra: 'Extra', row_options: 'Options',
        spec_studio: 'Studio', spec_part: 'Part', spec_type: 'Type', spec_people: 'People', spec_time: 'Time',
        spec_hourly: h => `${h}h (hourly)`, spec_day: 'Day 9h', spec_half: 'Half 4h',
        status: 'Status', sum: 'Total', base: 'Base rate', overtime: h => `Overtime ${h}h`, options: n => `Options ${n}`,
        won: n => `₩${Math.round(n * 10000).toLocaleString('en-US')}`,
        sh_key: 'Current selection · tap a cell to apply it to the quote',
        sec_day: 'Day 9h · Photo / Video', sec_half: 'Half 4h · Photo / Video', sec_event: 'Event 12h',
        sec_plan: 'Floor plan · Original rate sheet', sec_hourly: 'Hourly · up to 15 people', sec_whole: 'Whole space A+B+D · 16 or more',
        unit: 'Unit ₩10,000', unit_h: 'Unit ₩10,000 / hour', g_photo: 'Photo', g_video: 'Video', g_hourly: 'Hourly',
        n_over: '*Overtime: 10% of the rental fee per hour (based on the Day rate)', n_furn: '*Furniture shoots or vehicle access are priced separately',
        n_exh: '*Discounts for exhibitions and long-term rentals are negotiated separately', n_change: '*Quotes may change after detailed consultation.',
        n_contact: 'For scheduling and details, email <b>contact@plusjun.com</b>.',
        n_image: 'Tap the image to view it full size.', img_alt: 'original rate sheet (with floor plan)',
        n_h_single: '*Single rooms (A·B·D): up to 7 people', n_h_combo: '*8 or more: combined parts (A+B / B+D / A+B+D)',
        n_h_bg: '*Part A includes use of the back garden', n_h_opt: '*Greenhouse option: +₩40,000 per hour', n_h_over: '*Overtime: 10% of the Day rate per hour',
        n_h_opt2: '*Greenhouse / Back garden option: +₩300,000 (16–30) / +₩500,000 (31 or more) each, flat regardless of hours',
        band: ([lo, hi], i, n) => (i === 0 && lo === 1) ? `≤${hi}` : (i === n - 1 && hi >= PERSONNEL_MAX) ? `${lo}+` : lo === hi ? `${lo}` : `${lo}–${hi}`,
        // 엔진의 파트 이름에 섞인 한국어를 영어로
        partName: k => k.replace('백가든', 'Back Garden').replace('카페', 'CAFE').replace('+가든', '+Garden').replace('1F+철제난간', '1F + railing').replace('2F오피스 포함', 'incl. 2F office'),
    },
};
const t = k => I18N[state.lang][k];
const studioName = k => t('studio')[k];
const partName = k => t('partName')(k);

// ─── 홍대 파트 그룹 정의 ──────────────────────────────────
const HONGDAE_GROUPS = [
    { parts: ['A+백가든', 'B', 'D'] },
    { parts: ['A+B', 'B+D'] },
    { parts: ['A+B+D'] },
];

// ─── 파트별 인원 제한 규칙 ────────────────────────────────
// 반환값: null(정상) 또는 경고 문자열(인원 초과)
const PART_RESTRICTIONS = {
    HANNAM: (p, part) => {
        if (p >= 31 && part !== 'ALL') return t('restrict').hannam;
        return null;
    },
    LAYER7: (p, part) => {
        if (p >= 20 && part !== 'ABC') return t('restrict').l7_abc;
        if (p >= 15 && ['A', 'BC'].includes(part)) return t('restrict').l7_15;
        if (p > 10 && part === 'C') return t('restrict').l7_c;
        return null;
    },
    LAYER20: (p, part) => {
        if (p >= 31 && part === '3F') return t('restrict').l20;
        return null;
    },
    LAYER11: (p, part) => {
        if (p >= 41 && ['A', 'B'].includes(part))
            return t('restrict').l11;
        return null;
    },
    LAYER27: (p, part) => {
        if (p >= 31 && part !== 'ALL') return t('restrict').l27;
        return null;
    },
    LAYER26: (p, part) => {
        if (p >= 31 && part !== 'AB') return t('restrict').l26;
        return null;
    },
    LAYER41: (p, part) => {
        if (p >= 40 && !['AB', 'ABC'].includes(part))
            return t('restrict').l41;
        return null;
    },
    HONGDAE: (p, part) => {
        if (p >= 8 && ['A+백가든', 'B', 'D'].includes(part))
            return t('restrict').hongdae;
        return null;
    },
};

// ─── 상태 ───────────────────────────────────────────────
const state = {
    lang: 'ko',            // 'ko' | 'en'
    view: 'calc',          // 'calc' | 'sheet'
    studio: 'HANNAM',
    part: '1F',
    type: 'photo',
    time: 'day',
    personnel: 10,
    hours: 1,
    extraHours: 0,
    options: []
};

const els = {
    optsPart: document.getElementById('opts-part'),
    rowType: document.getElementById('row-type'),
    rowTime: document.getElementById('row-time'),
    rowExtra: document.getElementById('row-extra'),
    rowOptions: document.getElementById('row-options'),
    timeDayHalf: document.getElementById('time-dayhalf'),
    timeHourly: document.getElementById('time-hourly'),
    vStudio: document.getElementById('v-studio'),
    vPart: document.getElementById('v-part'),
    vType: document.getElementById('v-type'),
    vTime: document.getElementById('v-time'),
    vPersonnel: document.getElementById('v-personnel'),
    vExtra: document.getElementById('v-extra'),
    priceGreenhouse: document.getElementById('p-greenhouse'),
    priceBackgarden: document.getElementById('p-backgarden'),
    optBackgarden: document.querySelector('button[data-opt="BACKGARDEN"]'),
    infoLink: document.getElementById('info-link'),
    rcMeta: document.getElementById('rc-meta'),
    rcCopy: document.getElementById('rc-copy'),
    docOpen: document.getElementById('doc-open'),
    doc: document.getElementById('doc'),
    docPage: document.getElementById('doc-page'),
    docFit: document.getElementById('doc-fit'),
    docForm: document.getElementById('doc-form'),
    pdfPrev: document.getElementById('pdf-prev'),
    pdfPrevBody: document.getElementById('pdf-prev-body'),
    rcSpec: document.getElementById('rc-spec'),
    rcCharges: document.getElementById('rc-charges'),
    rcTotal: document.getElementById('rc-total'),
    rcStamp: document.getElementById('rc-stamp'),
    peek: document.getElementById('peek'),
    peekV: document.getElementById('peek-v'),
    peekCue: document.getElementById('peek-cue'),
    dock: document.getElementById('dock'),
    dockScrim: document.getElementById('dock-scrim'),
    controls: document.querySelector('.controls'),
    sheet: document.getElementById('sheet-view'),
    sheetBody: document.getElementById('sheet-body'),
    vStudioSheet: document.getElementById('v-studio-sheet'),
    optsStudioSheet: document.getElementById('opts-studio-sheet'),
    info: document.getElementById('info-view'),
    infoBody: document.getElementById('info-body'),
    vStudioInfo: document.getElementById('v-studio-info'),
    optsStudioInfo: document.getElementById('opts-studio-info'),
    workbench: document.querySelector('.workbench'),
};

// ─── 상태 판별 헬퍼 ──────────────────────────────────────
const isHongdae = () => state.studio === 'HONGDAE';
const isHongdaeSmall = () => isHongdae() && state.personnel <= 15;
const partsOf = studio => Object.keys(LAYER_MASTER_ENGINE.studios[studio].parts);

function restrictionFor(part, personnel = state.personnel) {
    const rules = PART_RESTRICTIONS[state.studio];
    return rules ? rules(personnel, part) : null;
}

// 그 인원으로 이 파트를 빌릴 수 있는가 — 인원 제한 규칙과 엔진(요금 없는 칸)을 함께 본다
function partFits(part, personnel = state.personnel) {
    return !restrictionFor(part, personnel) && typeof calcAt({ part, personnel }) === 'number';
}

// 파트가 받는 인원 범위 [최소, 최대]. 받을 수 있는 인원이 없으면 null
function partRange(part) {
    let lo = 0, hi = 0;
    for (let p = 1; p <= PERSONNEL_MAX; p++) {
        if (!partFits(part, p)) continue;
        if (!lo) lo = p;
        hi = p;
    }
    return lo ? [lo, hi] : null;
}

// 지점에 들어설 때. 홍대는 소규모 시간제 대관이 대부분이라, 다른 지점에서 넘어오면
// 인원을 4명(단독 룸의 가장 낮은 요금 구간)에서 시작한다. 홍대 안에서 다시 누를 때는 건드리지 않는다
const HONGDAE_START_PERSONNEL = 4;
function enterStudio(studio) {
    if (studio === 'HONGDAE' && state.studio !== 'HONGDAE') {
        state.personnel = HONGDAE_START_PERSONNEL;
        document.getElementById('rng-personnel').value = state.personnel;
    }
    state.studio = studio;
}

// 지점을 바꿨을 때: 지금 파트가 그 지점에 없거나 현재 인원을 못 받으면, 받을 수 있는 첫 파트로 옮긴다
function pickPart() {
    const keys = partsOf(state.studio);
    if (keys.includes(state.part) && partFits(state.part)) return;
    state.part = keys.find(k => partFits(k)) || (keys.includes(state.part) ? state.part : keys[0]);
}

// ─── 계산 ───────────────────────────────────────────────
// 엔진을 세 번 호출해 그 차분으로 항목별 금액을 얻는다.
// 요금 공식을 UI에 중복 구현하지 않기 위한 방법 — 엔진이 유일한 진실이다.
function calcAt(overrides) {
    return LAYER_MASTER_ENGINE.calculate({
        studio: state.studio, part: state.part, type: state.type, time: state.time,
        personnel: state.personnel, hours: state.hours,
        extraHours: state.extraHours, options: state.options,
        ...overrides
    });
}

function compute() {
    const warn = restrictionFor(state.part);
    if (warn) return { err: warn };

    const total = calcAt({});
    if (typeof total === 'string') return { err: total };

    const base = calcAt({ extraHours: 0, options: [] });
    const withExtra = calcAt({ options: [] });
    // 기본 요금 산출이 실패하면 항목 분해는 포기하고 합계만 보여준다
    if (typeof base === 'string' || typeof withExtra === 'string') return { total };

    return {
        total,
        base,
        extraFee: withExtra - base,
        optionFee: total - withExtra
    };
}

const fmt = n => Number.isInteger(n) ? n.toLocaleString() : n.toFixed(1);
const won = n => t('won')(n);

// ─── 파트 버튼 ───────────────────────────────────────────
function renderParts() {
    const keys = partsOf(state.studio);
    els.optsPart.innerHTML = '';

    const addBtn = key => {
        const b = document.createElement('button');
        b.dataset.set = 'part';
        b.dataset.v = key;
        b.innerHTML = `<span class="pt-n">${esc(partName(key))}</span><span class="pt-cap"></span>`;
        els.optsPart.appendChild(b);
    };

    if (isHongdae()) {
        HONGDAE_GROUPS.forEach((g, i) => {
            const label = document.createElement('div');
            label.className = 'grp';
            label.textContent = t('hongdae_groups')[i];
            els.optsPart.appendChild(label);
            g.parts.filter(p => keys.includes(p)).forEach(addBtn);
        });
    } else {
        keys.forEach(addBtn);
    }

    if (!keys.includes(state.part)) state.part = keys[0];
    syncPartStates();
}

// 선택 표시 + 인원 제한에 걸린 파트 비활성화
function syncPartStates() {
    els.optsPart.querySelectorAll('button').forEach(b => {
        const key = b.dataset.v;
        b.classList.toggle('on', key === state.part);
        b.disabled = !partFits(key) && key !== state.part;
        // 못 고르는 파트에는 받을 수 있는 인원을 적는다: 지금 인원이 많으면 '~7명', 적으면 '16명~'
        const range = b.disabled && partRange(key);
        b.querySelector('.pt-cap').textContent = !range ? ''
            : state.personnel > range[1] ? t('cap_max')(range[1]) : t('cap_min')(range[0]);
    });
}

function syncToggles() {
    document.querySelectorAll('.opts button[data-set]').forEach(b => {
        const { set, v } = b.dataset;
        if (set === 'part') return; // 파트는 syncPartStates가 담당
        b.classList.toggle('on', state[set] === v);
    });
    document.querySelectorAll('.opts button[data-opt]').forEach(b => {
        b.classList.toggle('on', state.options.includes(b.dataset.opt));
    });
}

// ─── 지점별로 달라지는 UI 구성 ────────────────────────────
function syncMode() {
    const hd = isHongdae();

    // 홍대는 사진/영상 구분이 없다
    els.rowType.hidden = hd;

    if (hd) {
        const small = isHongdaeSmall();
        // 소규모는 시간제, 그 외는 Day/Half
        els.timeDayHalf.hidden = small;
        els.timeHourly.hidden = !small;
        els.rowExtra.hidden = small;
        els.rowOptions.hidden = false;

        // 시간제: 그린하우스만 +4만원/h (백가든은 A 요금에 포함). 전관: 둘 다 정액 30 / 50만원
        const fee = small ? `+${won(4)}${t('per_h')}` : `+${won(state.personnel <= 30 ? 30 : 50)}`;
        els.priceGreenhouse.textContent = fee;
        els.priceBackgarden.textContent = fee;
        els.optBackgarden.hidden = small;
        if (small && state.options.includes('BACKGARDEN')) state.options = state.options.filter(o => o !== 'BACKGARDEN');
    } else {
        els.timeDayHalf.hidden = false;
        els.timeHourly.hidden = true;
        els.rowExtra.hidden = false;
        els.rowOptions.hidden = true;
        if (state.options.length) state.options = [];
    }

    // 넓은 화면의 2열 격자: 지점·파트 다음 행들을 둘씩 짝짓는다. 하나가 남으면 두 칸을 다 쓰게 한다.
    const shown = [...els.controls.querySelectorAll('.row')].filter(r => !r.hidden);
    // 숨은 행이 있어도 번호가 건너뛰지 않게, 보이는 행만 차례로 매긴다
    shown.forEach((r, i) => { const n = r.querySelector('.row-n'); if (n) n.textContent = String(i + 1).padStart(2, '0'); });
    const paired = shown.slice(2);
    paired.forEach((r, i) => r.classList.toggle('row-wide', paired.length % 2 === 1 && i === paired.length - 1));
}

// ─── 슬라이더 눈금 ───────────────────────────────────────
// 인원 슬라이더: 요금이 바뀌는 구간의 끝(10·20·30명…)에 눈금을 찍는다. 지점마다 구간이 다르다.
function renderTicks() {
    const sd = LAYER_MASTER_ENGINE.studios[state.studio];
    const bands = sd.bands || [...sd.bands_small, ...sd.bands_large];
    const box = document.getElementById('ticks-personnel');
    const key = state.studio;
    if (box.dataset.key === key) return;
    box.dataset.key = key;
    // 촘촘한 구간(홍대 4·5·6·7명)은 눈금만 찍고, 숫자는 10명부터 5명 단위에만 적는다
    box.innerHTML = bands.map(([, hi]) => hi).filter(hi => hi < PERSONNEL_MAX).map(hi =>
        `<i style="--f:${(hi - 1) / (PERSONNEL_MAX - 1)}">${hi >= 10 && hi % 5 === 0 ? `<b>${hi}</b>` : ''}</i>`).join('');
}

// 슬라이더 양 끝 표기 — 현재 언어의 단위로 (1명 … 80명, 0시간 … 6시간)
function renderScales() {
    const set = (id, a, b) => { const [x, y] = document.getElementById(id).children; x.textContent = a; y.textContent = b; };
    set('scale-personnel', t('people')(1), t('people')(PERSONNEL_MAX));
    set('scale-hours', t('hours')(1), t('hours')(12));
    set('scale-extra', t('hours')(0), t('hours')(6));
}

// ─── 견적서 ─────────────────────────────────────────────
const optionName = o => t(o === 'BACKGARDEN' ? 'opt_backgarden' : 'opt_greenhouse');

function li(k, v, charge) {
    // 금액 줄은 점선 리더로 좌우를 잇는다. 넓은 견적서에서도 금액까지 닿도록 넉넉히 찍고, 넘치는 만큼은 잘린다.
    return `<div class="li${charge ? ' li-charge' : ''}">
    <span${charge ? ' data-dots="' + '·'.repeat(240) + '"' : ''}>${k}</span><span>${v}</span></div>`;
}

function paint() {
    const r = compute();
    const hd = isHongdae(), small = isHongdaeSmall();

    // 행 머리의 현재값
    const typeName = t(state.type === 'photo' ? 'type_photo' : 'type_video');
    els.vStudio.textContent = studioName(state.studio);
    // 지점 목록 아래의 링크 — 고른 지점의 주차·오시는 길(안내 화면)로 간다
    els.infoLink.textContent = `${t('info_link')(studioName(state.studio))} →`;
    els.infoLink.href = `/${STUDIO_SLUGS[state.studio]}/info`;
    els.vPart.textContent = partName(state.part);
    els.vType.textContent = typeName;
    els.vTime.textContent = small ? t('hours')(state.hours) : t(state.time === 'day' ? 'day9' : 'half4');
    els.vPersonnel.textContent = t('people')(state.personnel);
    els.vExtra.textContent = t('hours')(state.extraHours);

    // 견적서 머리: 상호 · 견적일. 캡처해 보냈을 때 언제 낸 견적인지 남는다
    const today = quoteDate();
    els.rcMeta.textContent = `LAYER STUDIOS · ${today}`;

    // 사양 — 화면에 그리는 줄을 '견적 복사'용 글자로도 모은다
    const text = [t('rc_text_head')(today)];
    // 가견적서가 쓰는 같은 내용: 사양 [이름, 값] · 금액 [이름, 만원]
    lastQuote = { date: today, spec: [], charges: [], total: null };
    const row = (k, v, charge, amount, kind) => {
        text.push(`${k}: ${v}`);
        if (charge) lastQuote.charges.push([k, amount, kind]); else lastQuote.spec.push([k, v]);
        return li(k, v, charge);
    };
    let spec = row(t('spec_studio'), studioName(state.studio)) + row(t('spec_part'), partName(state.part));
    if (!hd) spec += row(t('spec_type'), typeName);
    spec += row(t('spec_people'), t('people')(state.personnel));
    spec += row(t('spec_time'), small ? t('spec_hourly')(state.hours) : t(state.time === 'day' ? 'spec_day' : 'spec_half'));
    els.rcSpec.innerHTML = spec;

    if (r.err) {
        els.rcCharges.innerHTML = li(t('status'), t('na'));
        els.rcTotal.innerHTML = '';
        els.rcStamp.className = 'rc-stamp';
        els.rcStamp.textContent = r.err;
        els.peek.classList.add('err');
        els.peekV.textContent = t('na');
        els.rcCopy.hidden = true;
        els.docOpen.hidden = true;
        syncPeekCue();
        return;
    }

    // 금액
    let charges = '';
    if (r.base === undefined) {
        charges = li(t('sum'), won(r.total), true);
        lastQuote.charges.push([t('sum'), r.total, 'base']);
    } else {
        charges = row(t('base'), won(r.base), true, r.base, 'base');
        if (r.extraFee > 0) charges += row(t('overtime')(state.extraHours), '+' + won(r.extraFee), true, r.extraFee, 'extra');
        if (r.optionFee > 0) {
            const names = state.options.map(optionName).join(' · ');
            charges += row(t('options')(names), '+' + won(r.optionFee), true, r.optionFee, 'option');
        }
    }
    lastQuote.total = r.total;
    els.docOpen.hidden = false;
    text.push(`${t('sum')}: ${won(r.total)} (${t('vat')})`, t('rc_text_foot'));
    els.rcCopy.dataset.copy = text.join('\n');
    els.rcCopy.hidden = false;
    els.rcCharges.innerHTML = charges;
    els.rcTotal.innerHTML = `<div class="rc-total">
    <span class="rc-total-k">${t('sum')}</span><span class="rc-total-v">${won(r.total)}<span class="rc-vat">(${t('vat')})</span></span></div>`;
    els.rcStamp.className = 'rc-stamp';
    els.rcStamp.textContent = '';

    els.peek.classList.remove('err');
    els.peekV.innerHTML = `${won(r.total)}<span class="peek-vat">(${t('vat_s')})</span>`;
    syncPeekCue();
}

// 손잡이 오른쪽 글자: 펼쳐져 있으면 '닫기', 접혀 있으면 '견적서'(산출 불가일 때는 '사유')
function syncPeekCue() {
    const open = els.dock.classList.contains('open');
    els.peekCue.textContent = t(open ? 'peek_close' : els.peek.classList.contains('err') ? 'peek_why' : 'peek_cue');
}

// ═══════════════════════════════════════════════════════
// 가견적서 — 지금 견적을 A4 한 장 문서로. 서버 없이 브라우저 인쇄(PDF로 저장)로 내보낸다.
// 고객이 직접 뽑는 문서라 사업자 정보·직인·계좌는 넣지 않는다.
// ═══════════════════════════════════════════════════════
let lastQuote = null;
const docForm = { to: '', shoot: '', memo: '' };   // 닫았다 열어도 입력이 남게

function renderDoc() {
    const q = lastQuote;
    if (!q || q.total === null) return;
    const W = t('doc_won'), hd = isHongdae();
    const supply = Math.round(q.total * 10000), vat = Math.round(supply * 0.1);
    const address = LAYER_INFO[state.studio].address[state.lang === 'en' ? 1 : 0];
    // 항목 | 수량 × 단가 | 금액. 시간으로 매기는 줄(시간제·연장)은 시간 × 시간당 단가로 적는다
    const small = isHongdaeSmall();
    const items = q.charges.map(([k, amt, kind]) => {
        const hours = kind === 'extra' ? state.extraHours : (small ? state.hours : 0);
        const count = hours || (kind === 'option' ? state.options.length : 1);
        const name = kind === 'base' ? t('doc_base')(studioName(state.studio), partName(state.part)) : k;
        return `<tr><td>${esc(name)}</td><td>${hours ? t('hours')(hours) : count} × ${W(amt * 10000 / count)}</td><td class="num">${W(amt * 10000)}</td></tr>`;
    }).join('');
    // 안내문 — 요금표에 적힌 것과 같은 문장
    const strip = x => x.replace(/^\*/, '');
    const notes = (hd ? (isHongdaeSmall() ? [t('n_furn'), t('n_change')] : [t('n_h_over'), t('n_furn'), t('n_change')])
        : [t('n_over'), t('n_furn'), t('n_exh'), t('n_change')]).map(strip);
    const field = (key, ph, tag = 'input') => tag === 'input'
        ? `<input data-doc="${key}" value="${esc(docForm[key])}" placeholder="${esc(ph)}" autocomplete="off">`
        : `<textarea data-doc="${key}" rows="1" placeholder="${esc(ph)}">${esc(docForm[key])}</textarea>`;

    // 구성: 왼쪽 위 상호·부제 | 오른쪽 위 정보 블록 → 큰 제목 → 항목 표와 합계 → 대관 내용 → 맨 아래 안내 문단
    els.docPage.innerHTML = `
    <header class="dc-top">
        <div class="dc-id"><img src="logo.png" alt="LAYER STUDIOS"><span>${esc(t('doc_sub')(studioName(state.studio)))}</span></div>
        <dl class="dc-meta">
            <div><dt>${t('doc_from')}</dt><dd>LAYER STUDIOS ${esc(studioName(state.studio))}<br>contact@plusjun.com<br>${esc(address)}</dd></div>
            <div><dt>${t('doc_to')}</dt><dd class="dc-to">${field('to', t('doc_to_ph'))}<span>${t('doc_to_suffix')}</span></dd></div>
            <div class="dc-dates">
                <div><dt>${t('doc_date')}</dt><dd>${q.date}</dd></div>
                <div data-opt-field="shoot"><dt>${t('doc_shoot')}</dt><dd>${field('shoot', t('doc_shoot_ph'))}</dd></div>
            </div>
        </dl>
    </header>
    <h1 class="dc-title">${t('doc_title')}</h1>
    <table class="dc-items">
        <thead><tr><th>${t('doc_item')}</th><th>${t('doc_qty')}</th><th class="num">${t('doc_amount')}</th></tr></thead>
        <tbody>${items}</tbody>
    </table>
    <div class="dc-sum">
        <div><span>${t('doc_supply')}</span><span>${W(supply)}</span></div>
        <div><span>${t('doc_vat')}</span><span>${W(vat)}</span></div>
        <div class="dc-total"><span>${t('doc_sum')}</span><span>${W(supply + vat)}</span></div>
    </div>
    <section class="dc-spec">
        <h2>${t('doc_spec')}</h2>
        <dl>
            ${q.spec.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}
            <div data-opt-field="memo"><dt>${t('doc_memo')}</dt><dd>${field('memo', t('doc_memo_ph'), 'textarea')}</dd></div>
        </dl>
    </section>
    <footer class="dc-foot">
        <p><b>${t('doc_notes')}</b> ${notes.map(n => esc(n.replace(/\.$/, ''))).join(' / ')}. ${t('doc_disclaimer')}</p>
        <div><span>contact@plusjun.com</span><span>LAYER STUDIOS, ${esc(studioName(state.studio))}</span></div>
    </footer>`;
    // 좁은 화면용 입력 칸에도 같은 값과 안내 글자를 넣는다
    const ph = { to: 'doc_to_ph', shoot: 'doc_shoot_ph', memo: 'doc_memo_ph' };
    els.docForm.querySelectorAll('[data-doc]').forEach(f => { f.value = docForm[f.dataset.doc]; f.placeholder = t(ph[f.dataset.doc]); });
    syncDocEmpty();
}

// 종이는 A4 폭(794px)으로 고정해 짜고, 화면이 그보다 좁으면 통째로 축소한다.
// 휴대폰에서도 줄·열이 A4와 똑같이 맞고, 보이는 그대로 인쇄된다.
const DOC_W = 794;

// 비고는 적는 만큼 늘어난다 — 인쇄에서 잘리지 않게. 안 보이는 칸(넓은 화면의 위쪽 입력 칸)은
// 높이를 잴 수 없어 0이 되므로 건너뛰고, 보이게 될 때(fitDoc) 다시 잰다
function growMemo() {
    els.doc.querySelectorAll('textarea[data-doc]').forEach(o => {
        if (!o.offsetParent) return;
        o.style.height = 'auto';
        o.style.height = o.scrollHeight + 'px';
    });
}

function fitDoc() {
    if (els.doc.hidden) return;
    // 종이 좌우 끝을 위쪽 띠·입력 칸의 여백(거터)과 같은 선에 둔다
    const gutter = parseFloat(getComputedStyle(els.doc).getPropertyValue('--gutter')) || 20;
    const s = Math.min(1, (els.doc.clientWidth - gutter * 2) / DOC_W);
    els.doc.classList.toggle('is-fit', s < 1);
    growMemo();
    els.docFit.style.setProperty('--s', s);
    els.docFit.style.width = DOC_W * s + 'px';
    els.docFit.style.height = els.docPage.offsetHeight * s + 'px';
}
window.addEventListener('resize', fitDoc);

// 비워 둔 선택 항목(촬영 예정일·비고)은 인쇄에서 빠진다
function syncDocEmpty() {
    els.docPage.querySelectorAll('[data-opt-field]').forEach(el => {
        el.classList.toggle('is-empty', !docForm[el.dataset.optField].trim());
    });
    els.docPage.querySelector('.dc-to').classList.toggle('is-empty', !docForm.to.trim());
}

function toggleDoc(open) {
    if (!open) closePdfPreview();
    if (open) renderDoc();
    els.doc.hidden = !open;
    document.body.classList.toggle('doc-open', open);
    if (open) { els.doc.scrollTop = 0; fitDoc(); }
}

// 인쇄하는 동안 문서 제목을 가견적서 이름으로 바꾼다 — 'PDF로 저장'의 기본 파일 이름이 되고,
// 혹시 머리글이 찍히는 브라우저에서도 '견적 산출기' 대신 이 이름이 나온다. 인쇄가 끝나면 되돌린다
function docFileName() {
    const to = docForm.to.trim().replace(/[\\/:*?"<>|]/g, '');
    return t('doc_file')(studioName(state.studio), lastQuote.date, to);
}
let titleBeforePrint = null;
window.addEventListener('beforeprint', () => {
    if (els.doc.hidden || !lastQuote) return;
    titleBeforePrint = document.title;
    document.title = docFileName();
});
window.addEventListener('afterprint', () => {
    if (titleBeforePrint !== null) document.title = titleBeforePrint;
    titleBeforePrint = null;
});

// ─── PDF 다운로드 ────────────────────────────────────────
// 종이(#doc-page)를 그림으로 떠서(html2canvas) A4 PDF 한 장에 붙인다(jsPDF). 인쇄 창을 거치지 않아
// 브라우저의 머리글·바닥글이 없고, 사파리·아이폰·크롬 어디서나 같은 파일이 나온다.
// 대신 PDF 안의 글자는 그림이라 선택·검색이 안 된다. 두 도구는 처음 누를 때만 불러온다.
const PDF_LIBS = [
    ['https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
        'sha512-BNaRQnYJYiPSqHHDb58B0yaPfCu+Wgds8Gp/gU33kqBtgNS4tSPHuGibyoeqMV/TJlSKda6FXzoEyYGjTe+vXA=='],
    ['https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
        'sha512-qZvrmS2ekKPF2mSznTQsxqPgnpkI4DNTlrdUmTzrDgektczlKNRRhy5X5AAOnx5S09ydFYWWNSfcEqDTTHgtNA=='],
];
let pdfLibs = null;
function loadPdfLibs() {
    if (!pdfLibs) {
        pdfLibs = Promise.all(PDF_LIBS.map(([src, sri]) => new Promise((ok, fail) => {
            const el = document.createElement('script');
            el.src = src; el.integrity = sri; el.crossOrigin = 'anonymous';
            el.onload = ok; el.onerror = fail;
            document.head.appendChild(el);
        }))).catch(err => { pdfLibs = null; throw err; });
    }
    return pdfLibs;
}

// 종이를 PDF에 붙일 그림으로 뜬다. 3배로 떠서 인쇄해도 선명하게 (A4 794px → 2382px ≈ 290dpi)
async function renderPdfCanvas() {
    await loadPdfLibs();
    await document.fonts.ready;
    return window.html2canvas(els.docPage, {
        scale: 3,
        backgroundColor: '#ffffff',
        logging: false,
        onclone: doc => {
            const page = doc.getElementById('doc-page');
            page.classList.add('pdf-render');
            // 입력 칸은 적힌 글자로 바꾼다 (밑줄·안내 글자 없이)
            page.querySelectorAll('[data-doc]').forEach(f => {
                const v = doc.createElement('span');
                v.className = 'pdf-val';
                v.textContent = f.value;
                f.replaceWith(v);
            });
            // 화면 축소(휴대폰)·덮개 없이 종이만 남긴다
            doc.body.className = '';
            doc.body.replaceChildren(page);
        },
    });
}

// PDF 미리보기 — 실제로 저장될 그림을 그대로 띄운다. 확인하고 '다운로드'를 누르면 그 그림으로 PDF를 만든다
let pdfCanvas = null;
async function openPdfPreview(btn) {
    if (btn.disabled || !lastQuote) return;
    btn.disabled = true;
    btn.textContent = t('doc_making');
    try {
        pdfCanvas = await renderPdfCanvas();
        // 화면에는 캔버스 대신 이미지로 띄운다 — 브라우저가 이미지는 곱게 줄여 휴대폰에서도 작은 글씨가 깨지지 않는다
        const blob = await new Promise(ok => pdfCanvas.toBlob(ok, 'image/png'));
        const img = new Image();
        img.alt = t('prev_title');
        img.src = URL.createObjectURL(blob);
        els.pdfPrevBody.replaceChildren(img);
        els.pdfPrev.setAttribute('aria-label', t('prev_title'));
        els.pdfPrev.hidden = false;
        els.pdfPrev.scrollTop = 0;
        document.getElementById('pdf-save').focus();
    } catch (err) {
        // 도구를 못 불러오면(차단·오프라인) 인쇄 창으로 대신한다
        window.print();
    } finally {
        btn.disabled = false;
        btn.textContent = t('doc_pdf');
    }
}

function closePdfPreview() {
    els.pdfPrev.hidden = true;
    const img = els.pdfPrevBody.querySelector('img');
    if (img) URL.revokeObjectURL(img.src);
    els.pdfPrevBody.replaceChildren();
    pdfCanvas = null;
}

function savePdf(btn) {
    if (!pdfCanvas) return;
    const pdf = new window.jspdf.jsPDF({ unit: 'mm', format: 'a4', compress: true });
    // 종이는 A4 비율이지만, 비고가 길어 넘치면 한 장에 들어오게 줄인다
    let w = 210, h = pdfCanvas.height * w / pdfCanvas.width;
    if (h > 297) { w = w * 297 / h; h = 297; }
    pdf.addImage(pdfCanvas, 'PNG', (210 - w) / 2, 0, w, h, undefined, 'FAST');
    pdf.setProperties({ title: docFileName() });
    pdf.save(docFileName() + '.pdf');
    btn.textContent = t('prev_saved');
    clearTimeout(btn._t);
    btn._t = setTimeout(() => { btn.textContent = t('prev_save'); }, 1600);
}

// 오늘 날짜 2026.11.18
function quoteDate() {
    const d = new Date(), z = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}.${z(d.getMonth() + 1)}.${z(d.getDate())}`;
}

function render() {
    renderTicks();
    syncMode();
    syncToggles();
    syncPartStates();
    paint();
    if (state.view === 'sheet') renderSheet();
    if (state.view === 'info') renderInfo();
}

// ═══════════════════════════════════════════════════════
// 요금표 — 엔진 데이터로 그린다. 이미지 요금표와 같은 구성.
// 현재 계산기 선택과 일치하는 칸을 강조하고, 칸을 누르면 그 조건을 계산기에 넣는다.
// ═══════════════════════════════════════════════════════
const esc = str => String(str).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// [최소, 최대] → '~10인' / '11~20인' / '41인~' (슬라이더 최대까지 열린 구간)
const PERSONNEL_MAX = 80;
const bandLabel = (b, i, bands) => t('band')(b, i, bands.length);
const bandIndex = (bands, p) => bands.findIndex(([lo, hi]) => p >= lo && p <= hi);
const cell = v => (v === null || v === 0) ? '<span class="sh-na">–</span>' : fmt(v);

// 한 장의 표. 원본 요금표처럼 그룹(사진 | 영상)을 한 표에 나란히 둔다.
//   rows   : [{key, label}]
//   groups : [{name, attrs, hit: {row, col} | null, values: rowKey → number[]}]
function table(bands, rows, groups, attrs) {
    const gHead = groups.map(g => `<th class="sh-g" colspan="${bands.length}">${g.name}</th>`).join('');
    // 두 번째 그룹의 첫 칸에는 sh-sep — 그룹 사이 세로 실선
    const sep = (gi, i) => (gi > 0 && i === 0) ? ' sh-sep' : '';
    const bHead = groups.map((g, gi) => bands.map((b, i) =>
        `<th class="${g.hit && g.hit.col === i ? 'hit' : ''}${sep(gi, i)}">${bandLabel(b, i, bands)}</th>`).join('')).join('');
    const body = rows.map(r => {
        const rowHit = groups.some(g => g.hit && g.hit.row === r.key);
        const tds = groups.map((g, gi) => g.values(r.key).map((v, i) => {
            const dead = v === null || v === 0;
            // 요금이 없는 칸은 선택 중이어도 강조하지 않는다 (견적서가 이미 산출 불가를 알린다)
            const on = !dead && g.hit && g.hit.row === r.key && g.hit.col === i;
            const data = dead ? '' : ` data-row="${esc(r.key)}" data-col="${i}"${g.attrs || ''}`;
            return `<td class="${on ? 'hit' : ''}${dead ? ' dead' : ''}${sep(gi, i)}"${data}>${cell(v)}</td>`;
        }).join('')).join('');
        return `<tr><th class="${rowHit ? 'hit' : ''}">${esc(partName(r.label))}</th>${tds}</tr>`;
    }).join('');
    return `<div class="sh-wrap"><table class="sh-t sh-g${groups.length}"${attrs || ''}>
    <thead><tr><th class="sh-corner" rowspan="2"></th>${gHead}</tr><tr>${bHead}</tr></thead>
    <tbody>${body}</tbody></table></div>`;
}

// 요금표의 한 구역 — 계산기의 행과 같은 어법 (번호 · 제목 · 오른쪽 태그)
function section(n, label, tag, body) {
    const t = tag ? `<em class="tag">${tag}</em>` : '';
    return `<div class="row"><div class="row-h"><span class="row-n">${n}</span>${label}${t}</div>${body}</div>`;
}

// 화면 제목 — 'HANNAM RENTAL FEE'를 지점 이름과 나머지 두 덩이로 나눈다.
// 넓은 화면에서는 한 줄, 좁은 화면에서는 두 줄로 크게 쌓인다 (CSS)
function titleHtml(title) {
    const m = String(title).match(/^(.*?)\s+(RENTAL FEE|INFORMATION)$/);
    return m ? `<span>${esc(m[1])}</span> <span>${m[2]}</span>` : esc(title);
}

function sheetHead(meta) {
    const ver = meta.version ? `<span class="sh-ver">${meta.version} ver.</span>` : '';
    return `<div class="sh-head"><h2 class="sh-title">${titleHtml(meta.title)}</h2>${ver}</div>
    <p class="sh-key"><i></i>${t('sh_key')}</p>`;
}

// 주석 여러 개 — 항목 단위로만 줄바꿈된다
const notes = (...items) => `<p class="note sh-notes">${items.map(t => `<span>${t}</span>`).join('')}</p>`;
const sheetFoot = () => notes(t('n_exh'), t('n_change'));

function eventTable(meta) {
    const rows = meta.event.map(([k, v]) => `<tr><th>${esc(partName(k))}</th><td>${fmt(v)}</td></tr>`).join('');
    return `<div class="sh-wrap"><table class="sh-t sh-t-event"><tbody>${rows}</tbody></table></div>
    <p class="note">${t('n_contact')}</p>`;
}

function imageBlock(meta) {
    return `<a class="sh-img" href="${meta.image}" target="_blank" rel="noopener">
        <img src="${meta.image}" loading="lazy" alt="${esc(meta.title)} ${t('img_alt')}">
    </a>
    <p class="note">${t('n_image')}</p>`;
}

// 공통 꼬리: 행사 · 도면. 구역 번호는 앞 구역 수에 이어 붙인다.
// 꼬리 주석(전시·장기 대관, 변경 가능)은 행사 구역에 붙이고, 행사가 없는 지점은 따로 둔다.
function sheetTail(meta, n) {
    let out = '';
    if (meta.event.length) out += section(pad(n++), t('sec_event'), t('unit'), eventTable(meta) + sheetFoot());
    else out += `<div class="row">${sheetFoot()}</div>`;
    if (meta.image) out += section(pad(n++), t('sec_plan'), null, imageBlock(meta));
    return out;
}
const pad = n => String(n).padStart(2, '0');

function renderSheetGeneral(sd, meta) {
    const bands = sd.bands;
    const n = bandIndex(bands, state.personnel);
    const label = key => meta.labels[key] || key;
    const rows = Object.keys(sd.parts).map(key => ({ key, label: label(key) }));

    const block = time => {
        const groups = ['photo', 'video'].map(type => ({
            name: t(type === 'photo' ? 'g_photo' : 'g_video'),
            attrs: ` data-type="${type}"`,
            hit: (state.type === type && state.time === time) ? { row: state.part, col: n } : null,
            values: key => sd.parts[key][type][time],
        }));
        // 넓은 화면: 원본처럼 사진 | 영상 한 표. 좁은 화면: 둘을 세로로 쌓아 가로 스크롤을 없앤다.
        const merged = `<div class="sh-desk">${table(bands, rows, groups, ` data-time="${time}"`)}</div>`;
        const split = `<div class="sh-mob">${groups.map(g => table(bands, rows, [g], ` data-time="${time}"`)).join('')}</div>`;
        return merged + split
            + notes(t('n_over'), t('n_furn'));
    };

    return sheetHead(meta)
        + section('02', t('sec_day'), t('unit'), block('day'))
        + section('03', t('sec_half'), t('unit'), block('half'))
        + sheetTail(meta, 4);
}

function renderSheetHongdae(sd, meta) {
    const small = state.personnel <= 15;
    const nS = bandIndex(sd.bands_small, state.personnel);
    const nL = bandIndex(sd.bands_large, state.personnel);

    // 시간제 (15인 이하) — 파트별 시간당 요금
    const hourlyRows = Object.keys(sd.parts).map(key => ({ key, label: key }));
    const hourly = table(sd.bands_small, hourlyRows, [{
        name: t('g_hourly'),
        hit: small ? { row: state.part, col: nS } : null,
        values: key => sd.parts[key].hourly,
    }], ' data-mode="hourly"')
        + notes(t('n_h_single'), t('n_h_combo'), t('n_h_bg'), t('n_h_opt'));

    // 전관 (16인 이상) — A+B+D 고정 요금
    const fixed = sd.parts['A+B+D'].fixed;
    const fixedRows = [{ key: 'day', label: 'Day 9h' }, { key: 'half', label: 'Half 4h' }];
    const large = table(sd.bands_large, fixedRows, [{
        name: 'A+B+D',
        hit: (!small && state.part === 'A+B+D') ? { row: state.time, col: nL } : null,
        values: key => fixed[key],
    }], ' data-mode="fixed"')
        + notes(t('n_h_over'), t('n_h_opt2'));

    return sheetHead(meta)
        + section('02', t('sec_hourly'), t('unit_h'), hourly)
        + section('03', t('sec_whole'), t('unit'), large)
        + sheetTail(meta, 4);
}

function renderSheet() {
    const sd = LAYER_MASTER_ENGINE.studios[state.studio];
    els.vStudioSheet.textContent = studioName(state.studio);
    els.sheetBody.innerHTML = isHongdae() ? renderSheetHongdae(sd, sd.sheet) : renderSheetGeneral(sd, sd.sheet);
}

// 요금표 칸 클릭 → 계산기 상태로. 인원이 그 구간 밖이면 구간의 최소 인원으로 맞춘다.
function applySheetCell(td) {
    const t = td.closest('table');
    const sd = LAYER_MASTER_ENGINE.studios[state.studio];
    const col = +td.dataset.col, row = td.dataset.row;
    const snap = bands => {
        const [lo, hi] = bands[col];
        if (state.personnel < lo || state.personnel > hi) state.personnel = lo;
        document.getElementById('rng-personnel').value = state.personnel;
    };

    if (t.dataset.mode === 'hourly') {
        state.part = row; snap(sd.bands_small);
    } else if (t.dataset.mode === 'fixed') {
        state.part = 'A+B+D'; state.time = row; snap(sd.bands_large);
    } else {
        state.part = row; state.type = td.dataset.type; state.time = t.dataset.time; snap(sd.bands);
    }
    render();
}

// ═══════════════════════════════════════════════════════
// 안내 — info.js 의 지점별 안내문을 구역으로 그린다
// ═══════════════════════════════════════════════════════
function renderInfo() {
    // 기존 홈페이지의 지점 안내(Guide) 시트를 따른다:
    // 작은 제목 + 굵은 선, 묶음 제목, 그 아래 검정 라벨 · 회색 본문이 연회색 실선으로 나뉘는 한 단 목록.
    const info = LAYER_INFO[state.studio];
    const L = state.lang, H = t('info_h');
    els.vStudioInfo.textContent = studioName(state.studio);

    const copyBtn = text => `<button class="copy" data-copy="${esc(text)}">${t('copy')}</button>`;
    const lines = arr => arr.map(l => `<p>${esc(l)}</p>`).join('');
    const item = (key, body) =>
        `<div class="gd-item" data-k="${key}"><h4>${H[key]}</h4><div class="gd-b">${body}</div></div>`;

    const [addrKo, addrEn] = info.address;
    const address = (L === 'en' ? [addrEn, addrKo] : [addrKo, addrEn])
        .map(a => `<p><span>${esc(a)}</span>${copyBtn(a)}</p>`).join('');

    // 유료 주차장: 데스크톱은 한 줄, 모바일은 이름 / 주소+복사 / 비고 세 줄로 나뉜다 (CSS)
    const paid = info.paid.map(p => {
        const tail = [p.dist, p.note && p.note[L]].filter(Boolean).map(esc).join(' / ');
        // 복사 버튼은 모바일에서 주소 줄 끝에, 데스크톱에서는 전체 줄 끝에 온다 (CSS 로 자리를 바꾼다)
        return `<p class="pk"><span class="pk-n">${esc(p.name)}</span><span class="pk-s"> : </span><span class="pk-a">${esc(p.addr)}<span class="pk-c">${copyBtn(p.addr)}</span></span>${tail ? `<span class="pk-s"> / </span><span class="pk-t">${tail}</span>` : ''}<span class="pk-c2">${copyBtn(p.addr)}</span></p>`;
    }).join('') + (t('info_paid_note') ? `<p>${t('info_paid_note')}</p>` : '');

    const g1 = item('address', address) + item('access', lines(info.access[L]))
        + item('parking', lines(info.parking[L])) + item('paid', paid);
    const g2 = item('generator', lines(info.generator[L]))
        + (info.power ? item('power', lines([t('info_power')(info.power.total, info.power.usable, info.power.approx), ...info.power.lines])) : '');

    const pdf = info.pdf ? `<a href="${info.pdf}" target="_blank" rel="noopener">${t('info_pdf')} ↗</a>` : '';
    // 요금표와 같은 짜임: 큰 제목(HANNAM INFORMATION) + 오른쪽 링크, 그 아래 번호 붙은 구역
    const title = LAYER_MASTER_ENGINE.studios[state.studio].sheet.title.replace(/RENTAL FEE$/, 'INFORMATION');
    els.infoBody.innerHTML = `<div class="sh-head"><h2 class="sh-title">${titleHtml(title)}</h2>
        <span class="info-links">${pdf}<a href="/${STUDIO_SLUGS[state.studio]}" data-goto="sheet">${t('info_fee')} →</a></span></div>`
        + section('02', esc(t('info_g1')(studioName(state.studio))), '', `<div class="gd-list">${g1}</div>`)
        + section('03', esc(t('info_g2')), '', `<div class="gd-list">${g2}</div>`);
}

// ─── 주소 ───────────────────────────────────────────────
// 요금표는 지점마다 고유 주소를 가진다: /hannam, /layer7 … (홈페이지에서 링크용)
// 안내는 그 아래 /info: /hannam/info, /layer7/info …
// 계산기 화면은 루트(/)다. ?lang= 은 그대로 따라간다.
const STUDIO_SLUGS = {
    HANNAM: 'hannam', LAYER7: 'layer7', LAYER20: 'layer20', LAYER11: 'layer11',
    LAYER27: 'layer27', LAYER26: 'layer26', LAYER41: 'layer41', HONGDAE: 'hongdae',
};
const studioFromSlug = slug => Object.keys(STUDIO_SLUGS).find(k => STUDIO_SLUGS[k] === slug) || null;

function syncUrl() {
    const slug = '/' + STUDIO_SLUGS[state.studio];
    const path = state.view === 'sheet' ? slug : state.view === 'info' ? slug + '/info' : '/';
    history.replaceState(null, '', path + location.search);
}

function setView(view) {
    state.view = view;
    const sheet = view === 'sheet', info = view === 'info';
    els.controls.hidden = view !== 'calc';
    els.sheet.hidden = !sheet;
    els.info.hidden = !info;
    // 안내 화면에는 견적서가 필요 없다 — 숨기고 본문이 폭을 다 쓴다
    els.workbench.classList.toggle('is-info', info);
    els.dock.hidden = info;
    if (info) toggleDock(false);
    document.querySelectorAll('.mh-nav button[data-view]').forEach(b => {
        const on = b.dataset.view === view;
        b.classList.toggle('on', on);
        b.setAttribute('aria-pressed', String(on));
    });
    // 공유용 주소: #sheet 로 열면 요금표부터 보인다
    syncUrl();
    render();
    window.scrollTo({ top: 0 });
}

// ─── 이벤트 ─────────────────────────────────────────────
document.addEventListener('click', e => {
    // 견적서 열고 닫기 (모바일)
    if (e.target.closest('#peek')) { toggleDock(); return; }
    if (e.target.id === 'dock-scrim') { toggleDock(false); return; }

    if (e.target.closest('#doc-open')) { toggleDoc(true); return; }
    if (e.target.closest('[data-doc-close]')) { toggleDoc(false); return; }
    if (e.target.closest('[data-doc-print]')) { window.print(); return; }   // 제목은 beforeprint에서
    const pdfBtn = e.target.closest('[data-doc-pdf]');
    if (pdfBtn) { openPdfPreview(pdfBtn); return; }
    if (e.target.closest('[data-prev-close]')) { closePdfPreview(); return; }
    const saveBtn = e.target.closest('[data-pdf-save]');
    if (saveBtn) { savePdf(saveBtn); return; }

    const cp = e.target.closest('button.copy');
    if (cp) { copyText(cp.dataset.copy, cp); return; }

    const go = e.target.closest('a[data-goto]');
    if (go) {
        e.preventDefault();
        setView(go.dataset.goto);
        // 견적 화면 중간에서 넘어온 경우 새 화면의 맨 위부터 보이게
        window.scrollTo(0, 0);
        return;
    }

    if (e.target.closest('[data-lang-toggle]')) { setLang(state.lang === 'ko' ? 'en' : 'ko'); return; }

    const nav = e.target.closest('.mh-nav button[data-view]');
    if (nav) { setView(nav.dataset.view); return; }

    const td = e.target.closest('.sh-t td[data-row]');
    if (td) { applySheetCell(td); return; }

    const opt = e.target.closest('button[data-opt]');
    if (opt) {
        const v = opt.dataset.opt;
        state.options = state.options.includes(v)
            ? state.options.filter(o => o !== v)
            : [...state.options, v];
        render();
        return;
    }

    const btn = e.target.closest('.opts button[data-set]');
    if (!btn || btn.disabled) return;
    const { set, v } = btn.dataset;
    if (set === 'studio') {
        enterStudio(v);
        pickPart();
        renderParts();
        if (state.view !== 'calc') syncUrl();
    } else {
        state[set] = v;
    }
    render();
});

document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    // 미리보기가 떠 있으면 미리보기만 닫고 가견적서로 돌아간다
    if (!els.pdfPrev.hidden) closePdfPreview();
    else if (!els.doc.hidden) toggleDoc(false);
});

document.addEventListener('input', e => {
    const f = e.target.closest('[data-doc]');
    if (f) {
        docForm[f.dataset.doc] = f.value;
        // 같은 항목의 다른 칸(위쪽 입력 칸 ↔ 종이)에도 옮긴다. 비고 높이는 fitDoc → growMemo가 맞춘다
        els.doc.querySelectorAll(`[data-doc="${f.dataset.doc}"]`).forEach(o => { if (o !== f) o.value = f.value; });
        syncDocEmpty();
        fitDoc();
        return;
    }
    const r = e.target.closest('input[data-rng]');
    if (!r) return;
    state[r.dataset.rng] = +r.value;
    render();
});

// 정적 문구(data-i18n)와 지점 버튼 이름을 현재 언어로 바꾼다
function applyLang() {
    document.documentElement.lang = state.lang;
    document.title = t('title');
    document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-html]').forEach(el => { el.innerHTML = t(el.dataset.i18nHtml); });
    document.querySelectorAll('button[data-set="studio"]').forEach(b => { b.textContent = studioName(b.dataset.v); });
    // 언어 전환은 KR / EN 두 글자로 — 지금 언어가 검정, 누르면 반대 언어로 바뀐다
    const langBtn = document.getElementById('lang-btn');
    const ko = state.lang === 'ko';
    langBtn.innerHTML = `<span class="${ko ? 'on' : ''}">KR</span><i>/</i><span class="${ko ? '' : 'on'}">EN</span>`;
    langBtn.setAttribute('aria-label', t('lang_btn'));
    const cb = document.getElementById('chat-btn');
    cb.setAttribute('aria-label', t(cb.classList.contains('is-open') ? 'chat_close' : 'chat'));
    renderScales();
}

function setLang(lang) {
    state.lang = lang;
    try { localStorage.setItem('lang', lang); } catch (e) { /* 사생활 보호 모드 등 */ }
    const u = new URL(location.href);
    if (lang === 'en') u.searchParams.set('lang', 'en'); else u.searchParams.delete('lang');
    history.replaceState(null, '', u.pathname + u.search);
    syncUrl();
    applyLang();
    renderParts();
    render();
    if (window.ChannelIO) window.ChannelIO('updateUser', { language: lang });
}

// 주소 복사. 클립보드 API 가 막힌 환경(구형 브라우저, http)은 textarea 로 대신한다.
function copyText(text, btn) {
    const done = () => {
        btn.textContent = t('copied');
        btn.classList.add('done');
        clearTimeout(btn._t);
        btn._t = setTimeout(() => { btn.textContent = t(btn.dataset.i18n || 'copy'); btn.classList.remove('done'); }, 1600);
    };
    const fallback = () => {
        const ta = document.createElement('textarea');
        ta.value = text; ta.setAttribute('readonly', '');
        ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
        document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); done(); } catch (e) { /* 복사 불가 */ }
        ta.remove();
    };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, fallback);
    else fallback();
}

function toggleDock(force) {
    const open = force === undefined ? !els.dock.classList.contains('open') : force;
    els.dock.classList.toggle('open', open);
    els.dockScrim.classList.toggle('on', open);
    els.peek.setAttribute('aria-expanded', String(open));
    syncPeekCue();
}

// ─── 초기화 ─────────────────────────────────────────────
// 요금표 화면의 지점 버튼. data-set="studio" 라 계산기 버튼과 같은 핸들러·동기화를 탄다.
els.optsStudioSheet.innerHTML = els.optsStudioInfo.innerHTML = Object.keys(I18N.ko.studio)
    .map(k => `<button data-set="studio" data-v="${k}"></button>`).join('');

// 언어: 주소의 ?lang=en > 저장된 선택 > 한국어
let saved = null;
try { saved = localStorage.getItem('lang'); } catch (e) { /* 무시 */ }
const param = new URLSearchParams(location.search).get('lang');
state.lang = (param === 'en' || param === 'ko') ? param : (saved === 'en' ? 'en' : 'ko');
applyLang();

renderParts();
render();
const [seg0, seg1] = location.pathname.replace(/^\/|\/$/g, '').toLowerCase().split('/');
const slugStudio = studioFromSlug(seg0);
if (slugStudio) {
    enterStudio(slugStudio);
    state.part = partsOf(slugStudio)[0];
    pickPart();
    renderParts();
    setView(seg1 === 'info' ? 'info' : 'sheet');
} else if (location.hash === '#sheet') {
    setView('sheet');
}

// ─── 채널톡 ─────────────────────────────────────────────
// 메인 사이트(plusjun.com)와 같은 채널로 연결한다. 채널톡 기본 버튼은 휴대폰에서
// 하단 견적 바와 겹치므로 숨기고, 이 사이트 모양의 버튼(#chat-btn)을 바 위에 띄운다.
// 채널톡을 불러오지 못하면(차단·오프라인) 버튼은 숨은 채로 남는다.
(function () {
    const w = window;
    if (w.ChannelIO) return;
    const ch = function () { ch.c(arguments); };
    ch.q = []; ch.c = function (args) { ch.q.push(args); };
    w.ChannelIO = ch;
    function load() {
        if (w.ChannelIOInitialized) return;
        w.ChannelIOInitialized = true;
        const s = document.createElement('script');
        s.async = true;
        s.src = 'https://cdn.channel.io/plugin/ch-plugin-web.js';
        document.head.appendChild(s);
    }
    if (document.readyState === 'complete') load();
    else w.addEventListener('load', load);
})();

const chatBtn = document.getElementById('chat-btn');
let chatOpen = false;
window.ChannelIO('boot', {
    pluginKey: 'f9f11a62-2c12-4602-9199-e92a77d4354c',
    hideChannelButtonOnBoot: true,
    language: state.lang,
}, function (error) {
    if (!error) chatBtn.hidden = false;
});
// 메인 사이트처럼 버튼 하나로 열고 닫는다. 열려 있는 동안은 검정 바탕에 X
chatBtn.addEventListener('click', function () {
    window.ChannelIO(chatOpen ? 'hideMessenger' : 'showMessenger');
});
function syncChat(open) {
    chatOpen = open;
    chatBtn.classList.toggle('is-open', open);
    chatBtn.setAttribute('aria-label', open ? t('chat_close') : t('chat'));
}
window.ChannelIO('onShowMessenger', function () { syncChat(true); });
window.ChannelIO('onHideMessenger', function () { syncChat(false); });
// 안 읽은 답장 수를 배지로
window.ChannelIO('onBadgeChanged', function (unread) {
    chatBtn.classList.toggle('has-unread', unread > 0);
    chatBtn.querySelector('.chat-badge').textContent = unread > 9 ? '9+' : String(unread);
});
