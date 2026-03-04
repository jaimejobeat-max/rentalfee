/**
 * LAYER STUDIOS 견적 산출기 — UI 인터랙션 v2
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

// ─── DOM 참조 ────────────────────────────────────────────
const els = {
    studioBtns: document.querySelectorAll('.studio-btn'),
    typeBtns: document.querySelectorAll('#type-toggle .toggle-btn'),
    timeBtns: document.querySelectorAll('#time-dayhalf .toggle-btn'),
    personnelSlider: document.getElementById('personnel'),
    personnelBadge: document.getElementById('personnel-badge'),
    hoursSlider: document.getElementById('hours'),
    hoursBadge: document.getElementById('hours-badge'),
    extraSlider: document.getElementById('extraHours'),
    extraBadge: document.getElementById('extra-badge'),
    partGrid: document.getElementById('part-grid'),
    sectionType: document.getElementById('section-type'),
    dividerType: document.getElementById('divider-type'),
    sectionOptions: document.getElementById('section-options'),
    dividerExtra: document.getElementById('divider-extra'),
    sectionExtra: document.getElementById('section-extra'),
    timeDayHalf: document.getElementById('time-dayhalf'),
    timeHourly: document.getElementById('time-hourly'),
    resultNumber: document.getElementById('result-number'),
    resultDetail: document.getElementById('result-detail'),
    resultStudioTag: document.getElementById('result-studio-tag'),
    resultCard: document.getElementById('result-card'),
    optionChecks: document.querySelectorAll('.option-check'),
    optionCards: document.querySelectorAll('.option-card'),
    greenhousePrice: document.getElementById('greenhouse-price'),
    backgardenPrice: document.getElementById('backgarden-price')
};

// ─── 슬라이더 채우기 ──────────────────────────────────────
function updateSliderFill(slider) {
    const min = +slider.min, max = +slider.max, val = +slider.value;
    const pct = ((val - min) / (max - min)) * 100;
    slider.style.background =
        `linear-gradient(to right, var(--slider-track) ${pct}%, var(--border) ${pct}%)`;
}

// ─── 상태 판별 헬퍼 ──────────────────────────────────────
function isHongdaeSmall() { return state.studio === 'HONGDAE' && state.personnel <= 15; }
function isHongdaeLargeOk() { return state.studio === 'HONGDAE' && state.personnel > 15 && state.part === 'A+B+D'; }
function isHongdaeLargeWarn() { return state.studio === 'HONGDAE' && state.personnel > 15 && state.part !== 'A+B+D'; }

// ─── 파트 렌더링 ──────────────────────────────────────────
function renderParts(studio) {
    els.partGrid.innerHTML = '';
    const partKeys = Object.keys(LAYER_MASTER_ENGINE.studios[studio].parts);

    if (studio === 'HONGDAE') {
        HONGDAE_GROUPS.forEach(group => {
            const lbl = document.createElement('div');
            lbl.className = 'part-group-label';
            lbl.textContent = group.label;
            els.partGrid.appendChild(lbl);
            group.parts.forEach(p => {
                if (partKeys.includes(p)) els.partGrid.appendChild(makePartBtn(p));
            });
        });
    } else {
        partKeys.forEach(p => els.partGrid.appendChild(makePartBtn(p)));
    }

    // 현재 선택된 파트가 없으면 첫 번째로 초기화
    if (!partKeys.includes(state.part)) state.part = partKeys[0];
    updatePartBtnStates();
}

function makePartBtn(partKey) {
    const btn = document.createElement('button');
    btn.className = 'part-btn';
    btn.dataset.part = partKey;
    btn.textContent = partKey;
    btn.addEventListener('click', () => {
        state.part = partKey;
        updatePartBtnStates();
        updateUIMode();
        computeAndDisplay();
    });
    return btn;
}

// 선택 하이라이트 + 인원 제한에 따른 비활성 표시를 동시에 처리
function updatePartBtnStates() {
    const rules = PART_RESTRICTIONS[state.studio];
    els.partGrid.querySelectorAll('.part-btn').forEach(btn => {
        const key = btn.dataset.part;
        btn.classList.toggle('selected', key === state.part);
        const restricted = rules ? !!rules(state.personnel, key) : false;
        btn.classList.toggle('disabled', restricted && key !== state.part);
    });
}

// ─── UI 모드 업데이트 ─────────────────────────────────────
function updateUIMode() {
    const isHD = state.studio === 'HONGDAE';

    // 촬영 종류: 홍대 숨김
    els.sectionType.style.display = isHD ? 'none' : '';
    els.dividerType.style.display = isHD ? 'none' : '';

    if (isHD) {
        if (isHongdaeSmall()) {
            // 시간 슬라이더 표시
            els.timeDayHalf.style.display = 'none';
            els.timeHourly.style.display = '';
            els.sectionExtra.style.display = 'none';
            els.dividerExtra.style.display = 'none';
        } else if (isHongdaeLargeOk()) {
            // Day / Half 표시
            els.timeDayHalf.style.display = '';
            els.timeHourly.style.display = 'none';
            els.sectionExtra.style.display = '';
            els.dividerExtra.style.display = '';
        } else {
            // 인원 초과 경고 상태 → 시간 컨트롤 숨김
            els.timeDayHalf.style.display = 'none';
            els.timeHourly.style.display = 'none';
            els.sectionExtra.style.display = 'none';
            els.dividerExtra.style.display = 'none';
        }

        // 홍대 옵션 표시
        els.sectionOptions.style.display = '';
        if (isHongdaeSmall()) {
            els.greenhousePrice.textContent = '+5만원/h';
            els.backgardenPrice.textContent = '+5만원/h';
        } else {
            const fee = state.personnel <= 30 ? 30 : 60;
            els.greenhousePrice.textContent = `+${fee}만원`;
            els.backgardenPrice.textContent = `+${fee}만원`;
        }
    } else {
        els.timeDayHalf.style.display = '';
        els.timeHourly.style.display = 'none';
        els.sectionExtra.style.display = '';
        els.dividerExtra.style.display = '';
        els.sectionOptions.style.display = 'none';
        // 옵션 초기화
        els.optionChecks.forEach(c => { c.checked = false; });
        els.optionCards.forEach(c => c.classList.remove('checked'));
        state.options = [];
    }
}

function computeAndDisplay() {
    els.resultStudioTag.textContent = studioNames[state.studio];

    // 1. UI-level 인원 제한 체크 (엔진 호출 전)
    const rules = PART_RESTRICTIONS[state.studio];
    const uiRestriction = rules ? rules(state.personnel, state.part) : null;
    if (uiRestriction) {
        els.resultNumber.textContent = '—';
        els.resultDetail.textContent = '⚠ ' + uiRestriction;
        els.resultCard.classList.add('result-error');
        els.resultNumber.classList.remove('update-anim');
        void els.resultNumber.offsetWidth;
        els.resultNumber.classList.add('update-anim');
        setTimeout(() => els.resultNumber.classList.remove('update-anim'), 400);
        return;
    }

    // 2. 엔진 계산
    const result = LAYER_MASTER_ENGINE.calculate({
        studio: state.studio,
        part: state.part,
        type: state.type,
        time: state.time,
        personnel: state.personnel,
        hours: state.hours,
        extraHours: state.extraHours,
        options: state.options
    });

    const isError = typeof result === 'string';
    if (isError) {
        els.resultNumber.textContent = '—';
        els.resultDetail.textContent = '⚠ ' + result;
        els.resultCard.classList.add('result-error');
    } else {
        const formatted = Number.isInteger(result) ? result.toLocaleString() : result.toFixed(1);
        els.resultNumber.textContent = formatted;
        els.resultCard.classList.remove('result-error');

        let detail = '';
        if (isHongdaeSmall()) {
            detail = `시간제 · ${state.hours}h · ${state.personnel}명 · ${state.part}`;
        } else {
            const timeLabel = state.time === 'day' ? 'Day(9h)' : 'Half(4h)';
            const typeLabel = state.studio !== 'HONGDAE'
                ? (state.type === 'photo' ? '사진' : '영상') + ' · ' : '';
            detail = `${typeLabel}${timeLabel} · ${state.personnel}명 · ${state.part}`;
            if (state.extraHours > 0) detail += ` · 연장 ${state.extraHours}h`;
            if (state.options.length > 0) detail += ` · 옵션 포함`;
        }
        els.resultDetail.textContent = detail;
    }

    // 숫자 애니메이션
    els.resultNumber.classList.remove('update-anim');
    void els.resultNumber.offsetWidth;
    els.resultNumber.classList.add('update-anim');
    setTimeout(() => els.resultNumber.classList.remove('update-anim'), 400);
}


// ─── 이벤트 바인딩 ───────────────────────────────────────

// 지점
els.studioBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        els.studioBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        state.studio = btn.dataset.studio;
        renderParts(state.studio);
        updateUIMode();
        computeAndDisplay();
    });
});

// 촬영 종류
els.typeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        els.typeBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        state.type = btn.dataset.value;
        computeAndDisplay();
    });
});

// Day / Half
els.timeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        els.timeBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        state.time = btn.dataset.value;
        computeAndDisplay();
    });
});

// 인원 슬라이더
els.personnelSlider.addEventListener('input', () => {
    const val = +els.personnelSlider.value;
    state.personnel = val;
    els.personnelBadge.textContent = `${val}명`;
    updateSliderFill(els.personnelSlider);
    updatePartBtnStates(); // 인원 변경 시 파트 제한 상태 갱신
    updateUIMode();
    computeAndDisplay();
});

// 시간 슬라이더 (홍대 소규모)
els.hoursSlider.addEventListener('input', () => {
    const val = +els.hoursSlider.value;
    state.hours = val;
    els.hoursBadge.textContent = `${val}시간`;
    updateSliderFill(els.hoursSlider);
    computeAndDisplay();
});

// 연장 슬라이더
els.extraSlider.addEventListener('input', () => {
    const val = +els.extraSlider.value;
    state.extraHours = val;
    els.extraBadge.textContent = `${val}시간`;
    updateSliderFill(els.extraSlider);
    computeAndDisplay();
});

// 옵션
els.optionChecks.forEach((check, i) => {
    check.addEventListener('change', () => {
        const card = els.optionCards[i];
        if (check.checked) {
            card.classList.add('checked');
            if (!state.options.includes(check.value)) state.options.push(check.value);
        } else {
            card.classList.remove('checked');
            state.options = state.options.filter(o => o !== check.value);
        }
        computeAndDisplay();
    });
});

// ─── 초기화 ──────────────────────────────────────────────
updateSliderFill(els.personnelSlider);
updateSliderFill(els.hoursSlider);
updateSliderFill(els.extraSlider);
renderParts(state.studio);
updateUIMode();
computeAndDisplay();
