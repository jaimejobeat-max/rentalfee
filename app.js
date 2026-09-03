/**
 * LAYER STUDIOS 견적 산출기 — UI (RECEIPT)
 * 계산은 전부 engine.js에 맡기고, 여기서는 상태·표시만 다룬다.
 */

// ─── 홍대 파트 그룹 정의 ──────────────────────────────────
const HONGDAE_GROUPS = [
    { label: '단독 룸 (최대 7명 · 시간제)', parts: ['A', 'B', 'D'] },
    { label: '복합 룸 (최대 15명 · 시간제)', parts: ['A+B', 'B+D'] },
    { label: '전체 공간 (16명+ 가능)', parts: ['A+B+D'] },
];

// ─── 파트별 인원 제한 규칙 ────────────────────────────────
// 반환값: null(정상) 또는 경고 문자열(인원 초과)
const PART_RESTRICTIONS = {
    HANNAM: (p, part) => {
        if (p >= 31 && part !== 'ALL') return '31인 이상은 ALL 파트만 이용 가능합니다';
        return null;
    },
    LAYER7: (p, part) => {
        if (p >= 20 && part !== 'ABC') return '20인 이상은 ABC 파트만 이용 가능합니다';
        if (p >= 15 && ['A', 'BC'].includes(part)) return '15인 이상 해당 파트 이용 불가합니다';
        if (p > 10 && part === 'C') return '10인 초과 시 C 파트 이용 불가합니다';
        return null;
    },
    LAYER20: (p, part) => {
        if (p >= 31 && part === '3F') return '31인 이상 3F 대관 불가합니다';
        return null;
    },
    LAYER11: (p, part) => {
        if (p >= 41 && ['A', 'B'].includes(part))
            return '41인 이상은 A+B / B+카페 / A+B+카페만 이용 가능합니다';
        return null;
    },
    LAYER27: (p, part) => {
        if (p >= 31 && part !== 'ALL') return '31인 이상은 ALL 파트만 이용 가능합니다';
        return null;
    },
    LAYER26: (p, part) => {
        if (p >= 31 && part !== 'AB') return '31인 이상은 AB 파트만 이용 가능합니다';
        return null;
    },
    LAYER41: (p, part) => {
        if (p >= 40 && !['AB', 'ABC'].includes(part))
            return '40인 이상은 AB / ABC 파트만 이용 가능합니다';
        return null;
    },
    HONGDAE: (p, part) => {
        if (p >= 8 && ['A', 'B', 'D'].includes(part))
            return '8인 이상은 복합 파트를 선택해주세요 (A+B / B+D / A+B+D)';
        return null;
    },
};

// ─── 상태 ───────────────────────────────────────────────
const state = {
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

const studioNames = {
    HANNAM: '한남', LAYER7: '레이어 7', LAYER20: '레이어 20',
    LAYER11: '레이어 11', LAYER27: '레이어 27', LAYER26: '레이어 26',
    LAYER41: '레이어 41', HONGDAE: '홍대'
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
const won = n => fmt(n) + '만원';

// ─── 파트 버튼 ───────────────────────────────────────────
function renderParts() {
    const keys = partsOf(state.studio);
    els.optsPart.innerHTML = '';

    const addBtn = key => {
        const b = document.createElement('button');
        b.dataset.set = 'part';
        b.dataset.v = key;
        b.textContent = key;
        els.optsPart.appendChild(b);
    };

    if (isHongdae()) {
        HONGDAE_GROUPS.forEach(g => {
            const label = document.createElement('div');
            label.className = 'grp';
            label.textContent = g.label;
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

        const fee = small ? '+5만원/h' : `+${state.personnel <= 30 ? 30 : 60}만원`;
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
const optionNames = { GREENHOUSE: '그린하우스', BACKGARDEN: '백가든' };

function li(k, v, charge) {
    // 금액 줄은 점선 리더로 좌우를 잇는다
    return `<div class="li${charge ? ' li-charge' : ''}">
    <span${charge ? ' data-dots="' + '·'.repeat(40) + '"' : ''}>${k}</span><span>${v}</span></div>`;
}

function paint() {
    const r = compute();
    const hd = isHongdae(), small = isHongdaeSmall();

    // 행 머리의 현재값
    els.vStudio.textContent = studioNames[state.studio];
    els.vPart.textContent = state.part;
    els.vType.textContent = state.type === 'photo' ? '사진' : '영상';
    els.vTime.textContent = small ? `${state.hours}시간` : (state.time === 'day' ? 'Day 9h' : 'Half 4h');
    els.vPersonnel.textContent = `${state.personnel}명`;
    els.vExtra.textContent = `${state.extraHours}시간`;

    els.rcMeta.textContent = `QUOTATION · NO. ${state.studio}-${state.part}-${state.personnel}P`;

    // 사양
    let spec = li('지점', studioNames[state.studio]) + li('파트', state.part);
    if (!hd) spec += li('종류', state.type === 'photo' ? '사진' : '영상');
    spec += li('인원', `${state.personnel}명`);
    spec += li('시간', small ? `${state.hours}시간 (시간제)` : (state.time === 'day' ? 'Day 9시간' : 'Half 4시간'));
    els.rcSpec.innerHTML = spec;

    if (r.err) {
        els.rcCharges.innerHTML = li('상태', '산출 불가');
        els.rcTotal.innerHTML = '';
        els.rcStamp.className = 'rc-stamp void';
        els.rcStamp.textContent = r.err;
        els.peek.classList.add('err');
        els.peekV.textContent = '산출 불가';
        els.peekCue.textContent = '사유';
        return;
    }

    // 금액
    let charges = '';
    if (r.base === undefined) {
        charges = li('합계', won(r.total), true);
    } else {
        charges = li('기본 요금', won(r.base), true);
        if (r.extraFee > 0) charges += li(`연장 ${state.extraHours}시간`, '+' + won(r.extraFee), true);
        if (r.optionFee > 0) {
            const names = state.options.map(o => optionNames[o]).join(' · ');
            charges += li(`옵션 ${names}`, '+' + won(r.optionFee), true);
        }
    }
    els.rcCharges.innerHTML = charges;
    els.rcTotal.innerHTML = `<div class="rc-total">
    <span class="rc-total-k">TOTAL</span><span class="rc-total-v">${won(r.total)}</span></div>`;
    els.rcStamp.className = 'rc-stamp';
    els.rcStamp.textContent = '참 고 용 · 확 정 아 님';

    els.peek.classList.remove('err');
    els.peekV.textContent = won(r.total);
    els.peekCue.textContent = '견적서';
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
function bandLabel([lo, hi], i, bands) {
    if (i === 0 && lo === 1) return `~${hi}인`;
    if (i === bands.length - 1 && hi >= PERSONNEL_MAX) return `${lo}인~`;
    return lo === hi ? `${lo}인` : `${lo}~${hi}인`;
}
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
        return `<tr><th class="${rowHit ? 'hit' : ''}">${esc(r.label)}</th>${tds}</tr>`;
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
    <p class="sh-key"><i></i>현재 선택 · 칸을 누르면 견적에 반영됩니다</p>`;
}

// 주석 여러 개 — 항목 단위로만 줄바꿈된다
const notes = (...items) => `<p class="note sh-notes">${items.map(t => `<span>${t}</span>`).join('')}</p>`;
const SHEET_FOOT = notes('*전시 및 장기 대관 시 할인 적용 별도 협의', '*상세 협의 시 일부 견적이 변경될 수 있습니다.');

function eventTable(meta) {
    const rows = meta.event.map(([k, v]) => `<tr><th>${esc(k)}</th><td>${fmt(v)}</td></tr>`).join('');
    return `<div class="sh-wrap"><table class="sh-t sh-t-event"><tbody>${rows}</tbody></table></div>
    <p class="note">일정 및 세부 문의는 <b>contact@plusjun.com</b> 메일로 부탁드립니다.</p>`;
}

function imageBlock(meta) {
    return `<a class="sh-img" href="${meta.image}" target="_blank" rel="noopener">
        <img src="${meta.image}" loading="lazy" alt="${esc(meta.title)} 원본 요금표 (도면 포함)">
    </a>
    <p class="note">이미지를 누르면 크게 볼 수 있습니다.</p>`;
}

// 공통 꼬리: 행사 · 도면. 구역 번호는 앞 구역 수에 이어 붙인다.
// 꼬리 주석(전시·장기 대관, 변경 가능)은 행사 구역에 붙이고, 행사가 없는 지점은 따로 둔다.
function sheetTail(meta, n) {
    let out = '';
    if (meta.event.length) out += section(pad(n++), 'Event 12h · 행사', '단위 만 원', eventTable(meta) + SHEET_FOOT);
    else out += `<div class="row">${SHEET_FOOT}</div>`;
    if (meta.image) out += section(pad(n++), 'Floor plan · 도면 · 원본 요금표', null, imageBlock(meta));
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
            name: type === 'photo' ? '사진' : '영상',
            attrs: ` data-type="${type}"`,
            hit: (state.type === type && state.time === time) ? { row: state.part, col: n } : null,
            values: key => sd.parts[key][type][time],
        }));
        // 넓은 화면: 원본처럼 사진 | 영상 한 표. 좁은 화면: 둘을 세로로 쌓아 가로 스크롤을 없앤다.
        const merged = `<div class="sh-desk">${table(bands, rows, groups, ` data-time="${time}"`)}</div>`;
        const split = `<div class="sh-mob">${groups.map(g => table(bands, rows, [g], ` data-time="${time}"`)).join('')}</div>`;
        return merged + split
            + notes('*추가 시간 당 렌탈 비용의 10% (Day견적으로 적용)', '*가구 촬영 혹은 차량 내부 진입 시 별도 금액 협의');
    };

    return sheetHead(meta)
        + section('02', 'Day 9h · 사진 / 영상', '단위 만 원', block('day'))
        + section('03', 'Half 4h · 사진 / 영상', '단위 만 원', block('half'))
        + sheetTail(meta, 4);
}

function renderSheetHongdae(sd, meta) {
    const small = state.personnel <= 15;
    const nS = bandIndex(sd.bands_small, state.personnel);
    const nL = bandIndex(sd.bands_large, state.personnel);

    // 시간제 (15인 이하) — 파트별 시간당 요금
    const hourlyRows = Object.keys(sd.parts).map(key => ({ key, label: key }));
    const hourly = table(sd.bands_small, hourlyRows, [{
        name: '시간당',
        hit: small ? { row: state.part, col: nS } : null,
        values: key => sd.parts[key].hourly,
    }], ' data-mode="hourly"')
        + notes('*단독 룸(A·B·D)은 최대 7명', '*8인 이상은 복합 파트(A+B / B+D / A+B+D)', '*그린하우스·백가든 옵션 각 +5만원/시간');

    // 전관 (16인 이상) — A+B+D 고정 요금
    const fixed = sd.parts['A+B+D'].fixed;
    const fixedRows = [{ key: 'day', label: 'Day 9h' }, { key: 'half', label: 'Half 4h' }];
    const large = table(sd.bands_large, fixedRows, [{
        name: 'A+B+D',
        hit: (!small && state.part === 'A+B+D') ? { row: state.time, col: nL } : null,
        values: key => fixed[key],
    }], ' data-mode="fixed"')
        + notes('*추가 시간 당 Day 요금의 10%', '*그린하우스·백가든 옵션 각 +30만원(30인 이하) / +60만원(31인 이상)');

    return sheetHead(meta)
        + section('02', '시간제 · 15인 이하', '단위 만 원 / 시간', hourly)
        + section('03', '전관 A+B+D · 16인 이상', '단위 만 원', large)
        + sheetTail(meta, 4);
}

function renderSheet() {
    const sd = LAYER_MASTER_ENGINE.studios[state.studio];
    els.vStudioSheet.textContent = studioNames[state.studio];
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
    document.querySelectorAll('.mh-nav button').forEach(b => {
        const on = b.dataset.view === view;
        b.classList.toggle('on', on);
        b.setAttribute('aria-pressed', String(on));
    });
    // 공유용 주소: #sheet 로 열면 요금표부터 보인다
    history.replaceState(null, '', sheet ? '#sheet' : location.pathname + location.search);
    render();
    window.scrollTo({ top: 0 });
}

// ─── 이벤트 ─────────────────────────────────────────────
document.addEventListener('click', e => {
    // 견적서 열고 닫기 (모바일)
    if (e.target.closest('#peek')) { toggleDock(); return; }
    if (e.target.id === 'dock-scrim') { toggleDock(false); return; }

    const nav = e.target.closest('.mh-nav button');
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

function toggleDock(force) {
    const open = force === undefined ? !els.dock.classList.contains('open') : force;
    els.dock.classList.toggle('open', open);
    els.dockScrim.classList.toggle('on', open);
    els.peek.setAttribute('aria-expanded', String(open));
}

// ─── 초기화 ─────────────────────────────────────────────
// 요금표 화면의 지점 버튼. data-set="studio" 라 계산기 버튼과 같은 핸들러·동기화를 탄다.
els.optsStudioSheet.innerHTML = Object.entries(studioNames)
    .map(([k, v]) => `<button data-set="studio" data-v="${k}">${v}</button>`).join('');

renderParts();
render();
if (location.hash === '#sheet') setView('sheet');
