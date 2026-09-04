/**
 * LAYER STUDIOS 견적 산출기 — UI
 * 계산은 전부 engine.js에 맡기고, 여기서는 상태·표시만 다룬다.
 */

// ─── 언어 ───────────────────────────────────────────────
// 화면 문구는 전부 여기서 나온다. 요금 데이터(engine.js)는 언어와 무관하다.
const I18N = {
    ko: {
        title: 'LAYER STUDIOS — 견적 산출기',
        lang_btn: 'English',
        nav_calc: '견적 산출', nav_sheet: '요금표',
        note_part: '가구 촬영 혹은 차량 내부 진입 시 별도 금액 협의',
        type_photo: '사진', type_video: '영상',
        note_extra: '연장료 = 풀데이 기본요금의 10% / 시간',
        tag_hongdae: '홍대 전용', opt_greenhouse: '그린하우스', opt_backgarden: '백가든',
        rc_foot: '본 견적은 참고용이며 실제 요금과 다를 수 있습니다.<br>정확한 금액은 지점에 문의하세요.',
        peek_cue: '견적서', peek_why: '사유', na: '산출 불가',
        studio: { HANNAM: '한남', LAYER7: '레이어 7', LAYER20: '레이어 20', LAYER11: '레이어 11',
                  LAYER27: '레이어 27', LAYER26: '레이어 26', LAYER41: '레이어 41', HONGDAE: '홍대' },
        hongdae_groups: ['단독 룸 (최대 7명 · 시간제)', '복합 룸 (최대 15명 · 시간제)', '전체 공간 (16명+ 가능)'],
        restrict: {
            hannam: '31인 이상은 ALL 파트만 이용 가능합니다',
            l7_abc: '20인 이상은 ABC 파트만 이용 가능합니다', l7_15: '15인 이상 해당 파트 이용 불가합니다', l7_c: '10인 초과 시 C 파트 이용 불가합니다',
            l20: '31인 이상 3F 대관 불가합니다',
            l11: '41인 이상은 A+B / B+카페 / A+B+카페만 이용 가능합니다',
            l27: '31인 이상은 ALL 파트만 이용 가능합니다', l26: '31인 이상은 AB 파트만 이용 가능합니다',
            l41: '40인 이상은 AB / ABC 파트만 이용 가능합니다',
            hongdae: '8인 이상은 복합 파트를 선택해주세요 (A+B / B+D / A+B+D)',
        },
        hours: h => `${h}시간`, people: p => `${p}명`, day9: 'Day 9h', half4: 'Half 4h',
        spec_studio: '지점', spec_part: '파트', spec_type: '종류', spec_people: '인원', spec_time: '시간',
        spec_hourly: h => `${h}시간 (시간제)`, spec_day: 'Day · 9시간', spec_half: 'Half · 4시간',
        status: '상태', sum: '합계', base: '기본 요금', overtime: h => `연장 ${h}시간`, options: n => `옵션 ${n}`,
        won: n => `${fmt(n)}만원`,
        // 요금표
        sh_key: '현재 선택 · 칸을 누르면 견적에 반영됩니다',
        sec_day: 'Day 9h · 사진 / 영상', sec_half: 'Half 4h · 사진 / 영상', sec_event: 'Event 12h · 행사',
        sec_plan: 'Floor plan · 도면 · 원본 요금표', sec_hourly: '시간제 · 15인 이하', sec_whole: '전관 A+B+D · 16인 이상',
        unit: '단위 만 원', unit_h: '단위 만 원 / 시간', g_photo: '사진', g_video: '영상', g_hourly: '시간당',
        n_over: '*추가 시간 당 렌탈 비용의 10% (Day견적으로 적용)', n_furn: '*가구 촬영 혹은 차량 내부 진입 시 별도 금액 협의',
        n_exh: '*전시 및 장기 대관 시 할인 적용 별도 협의', n_change: '*상세 협의 시 일부 견적이 변경될 수 있습니다.',
        n_contact: '일정 및 세부 문의는 <b>contact@plusjun.com</b> 메일로 부탁드립니다.',
        n_image: '이미지를 누르면 크게 볼 수 있습니다.', img_alt: '원본 요금표 (도면 포함)',
        n_h_single: '*단독 룸(A·B·D)은 최대 7명', n_h_combo: '*8인 이상은 복합 파트(A+B / B+D / A+B+D)',
        n_h_opt: '*그린하우스·백가든 옵션 각 +5만원/시간', n_h_over: '*추가 시간 당 Day 요금의 10%',
        n_h_opt2: '*그린하우스·백가든 옵션 각 +30만원(30인 이하) / +60만원(31인 이상)',
        band: ([lo, hi], i, n) => (i === 0 && lo === 1) ? `~${hi}인` : (i === n - 1 && hi >= PERSONNEL_MAX) ? `${lo}인~` : lo === hi ? `${lo}인` : `${lo}~${hi}인`,
        partName: k => k,
    },
    en: {
        title: 'LAYER STUDIOS — Rental Quote',
        lang_btn: '한국어',
        nav_calc: 'Quote', nav_sheet: 'Rates',
        note_part: 'Furniture shoots or vehicle access are priced separately',
        type_photo: 'Photo', type_video: 'Video',
        note_extra: 'Overtime = 10% of the full-day base rate per hour',
        tag_hongdae: 'Hongdae only', opt_greenhouse: 'Greenhouse', opt_backgarden: 'Back garden',
        rc_foot: 'This quote is for reference and may differ from the actual fee.<br>Contact the studio for an exact price.',
        peek_cue: 'Quote', peek_why: 'Why', na: 'Unavailable',
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
        hours: h => `${h}h`, people: p => `${p} ppl`, day9: 'Day 9h', half4: 'Half 4h',
        spec_studio: 'Studio', spec_part: 'Part', spec_type: 'Type', spec_people: 'People', spec_time: 'Time',
        spec_hourly: h => `${h}h (hourly)`, spec_day: 'Day · 9h', spec_half: 'Half · 4h',
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
        n_h_opt: '*Greenhouse / Back garden option: +₩50,000 per hour each', n_h_over: '*Overtime: 10% of the Day rate per hour',
        n_h_opt2: '*Greenhouse / Back garden option: +₩300,000 (up to 30) / +₩600,000 (31 or more) each',
        band: ([lo, hi], i, n) => (i === 0 && lo === 1) ? `≤${hi}` : (i === n - 1 && hi >= PERSONNEL_MAX) ? `${lo}+` : lo === hi ? `${lo}` : `${lo}–${hi}`,
        // 엔진의 파트 이름에 섞인 한국어를 영어로
        partName: k => k.replace('카페', 'CAFE').replace('+가든', '+Garden').replace('1F+철제난간', '1F + railing').replace('2F오피스 포함', 'incl. 2F office'),
    },
};
const t = k => I18N[state.lang][k];
const studioName = k => t('studio')[k];
const partName = k => t('partName')(k);

// ─── 홍대 파트 그룹 정의 ──────────────────────────────────
const HONGDAE_GROUPS = [
    { parts: ['A', 'B', 'D'] },
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
        if (p >= 8 && ['A', 'B', 'D'].includes(part))
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
    rcMeta: document.getElementById('rc-meta'),
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
};

// ─── 상태 판별 헬퍼 ──────────────────────────────────────
const isHongdae = () => state.studio === 'HONGDAE';
const isHongdaeSmall = () => isHongdae() && state.personnel <= 15;
const partsOf = studio => Object.keys(LAYER_MASTER_ENGINE.studios[studio].parts);

function restrictionFor(part) {
    const rules = PART_RESTRICTIONS[state.studio];
    return rules ? rules(state.personnel, part) : null;
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
        b.textContent = partName(key);
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
        b.disabled = !!restrictionFor(key) && key !== state.part;
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

        const fee = small ? `+${won(5)}/h` : `+${won(state.personnel <= 30 ? 30 : 60)}`;
        els.priceGreenhouse.textContent = fee;
        els.priceBackgarden.textContent = fee;
    } else {
        els.timeDayHalf.hidden = false;
        els.timeHourly.hidden = true;
        els.rowExtra.hidden = false;
        els.rowOptions.hidden = true;
        if (state.options.length) state.options = [];
    }
}

// ─── 견적서 ─────────────────────────────────────────────
const optionName = o => t(o === 'GREENHOUSE' ? 'opt_greenhouse' : 'opt_backgarden');

function li(k, v, charge) {
    // 금액 줄은 점선 리더로 좌우를 잇는다
    return `<div class="li${charge ? ' li-charge' : ''}">
    <span${charge ? ' data-dots="' + '·'.repeat(40) + '"' : ''}>${k}</span><span>${v}</span></div>`;
}

function paint() {
    const r = compute();
    const hd = isHongdae(), small = isHongdaeSmall();

    // 행 머리의 현재값
    const typeName = t(state.type === 'photo' ? 'type_photo' : 'type_video');
    els.vStudio.textContent = studioName(state.studio);
    els.vPart.textContent = partName(state.part);
    els.vType.textContent = typeName;
    els.vTime.textContent = small ? t('hours')(state.hours) : t(state.time === 'day' ? 'day9' : 'half4');
    // 슬라이더 끝(80명)은 눈금 표기와 맞춰 MAX로 보여준다. 견적서에는 실제 인원을 적는다.
    els.vPersonnel.textContent = state.personnel >= PERSONNEL_MAX ? 'MAX' : t('people')(state.personnel);
    els.vExtra.textContent = t('hours')(state.extraHours);

    els.rcMeta.textContent = `QUOTATION · NO. ${state.studio}-${state.part}-${state.personnel}P`;

    // 사양
    let spec = li(t('spec_studio'), studioName(state.studio)) + li(t('spec_part'), partName(state.part));
    if (!hd) spec += li(t('spec_type'), typeName);
    spec += li(t('spec_people'), t('people')(state.personnel));
    spec += li(t('spec_time'), small ? t('spec_hourly')(state.hours) : t(state.time === 'day' ? 'spec_day' : 'spec_half'));
    els.rcSpec.innerHTML = spec;

    if (r.err) {
        els.rcCharges.innerHTML = li(t('status'), t('na'));
        els.rcTotal.innerHTML = '';
        els.rcStamp.className = 'rc-stamp';
        els.rcStamp.textContent = r.err;
        els.peek.classList.add('err');
        els.peekV.textContent = t('na');
        els.peekCue.textContent = t('peek_why');
        return;
    }

    // 금액
    let charges = '';
    if (r.base === undefined) {
        charges = li(t('sum'), won(r.total), true);
    } else {
        charges = li(t('base'), won(r.base), true);
        if (r.extraFee > 0) charges += li(t('overtime')(state.extraHours), '+' + won(r.extraFee), true);
        if (r.optionFee > 0) {
            const names = state.options.map(optionName).join(' · ');
            charges += li(t('options')(names), '+' + won(r.optionFee), true);
        }
    }
    els.rcCharges.innerHTML = charges;
    els.rcTotal.innerHTML = `<div class="rc-total">
    <span class="rc-total-k">TOTAL</span><span class="rc-total-v">${won(r.total)}</span></div>`;
    els.rcStamp.className = 'rc-stamp';
    els.rcStamp.textContent = '';

    els.peek.classList.remove('err');
    els.peekV.textContent = won(r.total);
    els.peekCue.textContent = t('peek_cue');
}

function render() {
    syncMode();
    syncToggles();
    syncPartStates();
    paint();
    if (state.view === 'sheet') renderSheet();
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

function sheetHead(meta) {
    const ver = meta.version ? `<span class="sh-ver">${meta.version} ver.</span>` : '';
    return `<div class="sh-head"><h2 class="sh-title">${esc(meta.title)}</h2>${ver}</div>
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
        + notes(t('n_h_single'), t('n_h_combo'), t('n_h_opt'));

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

function setView(view) {
    state.view = view;
    const sheet = view === 'sheet';
    els.controls.hidden = sheet;
    els.sheet.hidden = !sheet;
    document.querySelectorAll('.mh-nav button[data-view]').forEach(b => {
        const on = b.dataset.view === view;
        b.classList.toggle('on', on);
        b.setAttribute('aria-pressed', String(on));
    });
    // 공유용 주소: #sheet 로 열면 요금표부터 보인다
    history.replaceState(null, '', location.pathname + location.search + (sheet ? '#sheet' : ''));
    render();
    window.scrollTo({ top: 0 });
}

// ─── 이벤트 ─────────────────────────────────────────────
document.addEventListener('click', e => {
    // 견적서 열고 닫기 (모바일)
    if (e.target.closest('#peek')) { toggleDock(); return; }
    if (e.target.id === 'dock-scrim') { toggleDock(false); return; }

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
        state.studio = v;
        if (!partsOf(v).includes(state.part)) state.part = partsOf(v)[0];
        renderParts();
    } else {
        state[set] = v;
    }
    render();
});

document.addEventListener('input', e => {
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
    document.getElementById('lang-btn').textContent = t('lang_btn');
}

function setLang(lang) {
    state.lang = lang;
    try { localStorage.setItem('lang', lang); } catch (e) { /* 사생활 보호 모드 등 */ }
    const u = new URL(location.href);
    if (lang === 'en') u.searchParams.set('lang', 'en'); else u.searchParams.delete('lang');
    history.replaceState(null, '', u.pathname + u.search + u.hash);
    applyLang();
    renderParts();
    render();
}

function toggleDock(force) {
    const open = force === undefined ? !els.dock.classList.contains('open') : force;
    els.dock.classList.toggle('open', open);
    els.dockScrim.classList.toggle('on', open);
    els.peek.setAttribute('aria-expanded', String(open));
}

// ─── 초기화 ─────────────────────────────────────────────
// 요금표 화면의 지점 버튼. data-set="studio" 라 계산기 버튼과 같은 핸들러·동기화를 탄다.
els.optsStudioSheet.innerHTML = Object.keys(I18N.ko.studio)
    .map(k => `<button data-set="studio" data-v="${k}"></button>`).join('');

// 언어: 주소의 ?lang=en > 저장된 선택 > 한국어
let saved = null;
try { saved = localStorage.getItem('lang'); } catch (e) { /* 무시 */ }
const param = new URLSearchParams(location.search).get('lang');
state.lang = (param === 'en' || param === 'ko') ? param : (saved === 'en' ? 'en' : 'ko');
applyLang();

renderParts();
render();
if (location.hash === '#sheet') setView('sheet');
