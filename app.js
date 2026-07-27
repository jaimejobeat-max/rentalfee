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
            return '41인 이상은 AB+B카페 / AB+카페만 이용 가능합니다';
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
}

// ─── 이벤트 ─────────────────────────────────────────────
document.addEventListener('click', e => {
    // 견적서 열고 닫기 (모바일)
    if (e.target.closest('#peek')) { toggleDock(); return; }
    if (e.target.id === 'dock-scrim') { toggleDock(false); return; }

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
renderParts();
render();
