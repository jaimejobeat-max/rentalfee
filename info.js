/**
 * LAYER STUDIOS 지점별 안내 — 주소 · 오시는 길 · 주차 · 유료 주차장 · 발전차 · 전력
 * 출처: 카고(rentalfee.cargo.site)의 지점별 Information 페이지. 홍대는 plusjun.com/hd_info.html.
 * 요금과 무관한 안내문만 담는다. 문구를 고칠 때는 ko / en 을 함께 고친다.
 *
 * 유료 주차장의 이름·주소는 지도 검색에 그대로 쓰도록 영어 화면에서도 한국어로 둔다.
 */
const LAYER_INFO = (() => {
    // 여러 지점이 같이 쓰는 문장
    const CAR = {
        ko: '*스튜디오 내부로 차량 진입이 필요하신 경우 사전 문의 부탁드립니다.',
        en: '*Please ask in advance if a vehicle needs to enter the studio.',
    };
    const OVER = {
        ko: '*주차 가능 대수 초과 시 근처 유료 주차장을 이용해 주시기 바랍니다.',
        en: '*If you need more spaces than listed, please use a paid car park nearby.',
    };
    const GEN = {
        ko: [
            '고출력 장비 사용이 많은 경우 별도의 발전 차량 섭외가 필요하실 수 있어 진행에 참고 부탁드립니다.',
            '발전차 진입 시 반드시 사전 현장 답사를 통해 주차 및 이동 동선을 확인하여 주시기 바랍니다.',
            '(3.5톤, 발전차, 이동식 발전기, 고출력 조명장비 등 특수장비 동반 시)',
        ],
        en: [
            'If you use a lot of high-output equipment, you may need to hire a separate generator truck.',
            'If a generator truck is coming, please visit the site beforehand to check parking and the route.',
            '(When bringing special equipment such as a 3.5-ton truck, generator truck, portable generator or high-output lighting)',
        ],
    };
    const HOURS = {
        kt: { ko: '평일 9-19시 / 토요일 9-15시 운영 / 공휴일 무료 개방', en: 'Weekdays 9:00–19:00 / Saturdays 9:00–15:00 / free on public holidays' },
        day: { ko: '전일 7-22시 운영', en: 'Daily 7:00–22:00' },
        all: { ko: '24시간 운영', en: 'Open 24 hours' },
    };
    const perHour = won => ({ ko: `1시간 당 ${won.toLocaleString()}원`, en: `₩${won.toLocaleString()} per hour` });

    // 성수동 26 · 27 은 같은 건물이라 주차 안내가 같다
    const SEONGSU_26_27 = {
        access: {
            ko: ['지하철 2호선 성수역 2번 출구 도보 10분', CAR.ko],
            en: ['10 min walk from Seongsu Station (Line 2), Exit 2', CAR.en],
        },
        parking: {
            ko: ['대관 시 : 2대', OVER.ko, '**주차는 지점 앞 점포 전용 구역에 2대까지 가능합니다. (점포 18-25-27 / 18-25-06)'],
            en: ['Per rental: 2 cars', OVER.en, '**Up to 2 cars can park in the shop-only bays in front of the studio (bays 18-25-27 / 18-25-06).'],
        },
        paid: [
            { name: 'KT 성수분국 노상공영주차장', dist: '175m', addr: '서울 성동구 성수동2가 280-50', note: HOURS.kt },
            { name: '성수 우림e비즈센터', dist: '184m', addr: '서울 성동구 성수동2가 280-21', note: HOURS.day },
            { name: '하이파킹 우리W타워', dist: '137m', addr: '서울 성동구 성수동2가 277-28', note: HOURS.day },
            { name: '아이에스 biz타워', dist: '715m', addr: '서울 성동구 성수동2가 289-319', note: HOURS.all },
        ],
    };

    return {
        HANNAM: {
            pdf: 'https://drive.google.com/file/d/1qDUFtPRi3uvDhX1C-vQZpkRIZRIIIfXb/view',
            address: ['서울 용산구 한남동 743-27 (이태원로45길 64)', '743-27, Hannam-dong, Yongsan-gu, Seoul'],
            access: {
                ko: ['지하철 한강진역 도보 5분 / 이태원역 도보 10분 거리 위치', CAR.ko],
                en: ['5 min walk from Hangangjin Station / 10 min walk from Itaewon Station', CAR.en],
            },
            parking: {
                ko: ['1F + 2F : 2대', '한 층만 대관 시 : 각 1대', OVER.ko],
                en: ['1F + 2F: 2 cars', 'Single floor: 1 car each', OVER.en],
            },
            paid: [
                { name: '한남동공영주차장', dist: '467m', addr: '서울 용산구 한남동 685-46', note: perHour(3000) },
                { name: '한강진역공영주차장', dist: '504m', addr: '서울 용산구 한남동 728-27', note: perHour(4800) },
            ],
            generator: {
                ko: [GEN.ko[0], '전체 대관 시 발전 차량 2대 진입 가능하며 사전 현장 답사를 통해 주차 및 이동 동선을 확인하여 주시기 바랍니다.', GEN.ko[2]],
                en: [GEN.en[0], 'When renting the whole house, two generator trucks can enter. Please visit the site beforehand to check parking and the route.', GEN.en[2]],
            },
            power: { total: 50, usable: 40, approx: true, lines: ['1F + 2F - 40kW'] },
        },
        LAYER7: {
            pdf: 'https://drive.google.com/file/d/1lq81u6J3gAhTI4Y5dcVIfsJgyr3RYcYd/view',
            address: ['서울 용산구 갈월동 7-7 (한강대로98가길 7)', '7 Hangang-daero 98ga-gil, Yongsan-gu, Seoul'],
            access: {
                ko: ['지하철 4호선 숙대입구역 2번 출구 도보 10분 거리 위치', CAR.ko],
                en: ["10 min walk from Sookmyung Women's Univ. Station (Line 4), Exit 2", CAR.en],
            },
            parking: {
                ko: [
                    '*차고지는 높이 상 스타렉스 차종 정도까지 진입 가능한 점 참고 부탁드립니다.',
                    '*지점 옆 교회 측 야외주차장이 섭외되어 있습니다. 해당 주차장에 2대까지 더 주차 가능합니다. (단 금, 토요일은 불가)',
                    OVER.ko,
                ],
                en: [
                    '*The garage height allows vehicles up to about the size of a Hyundai Starex van.',
                    '*An outdoor lot at the church next door is arranged for us. Up to 2 more cars can park there (not on Fridays and Saturdays).',
                    OVER.en,
                ],
            },
            paid: [
                { name: '대승주차장', dist: '229m', addr: '서울 용산구 한강대로 346' },
                { name: '갑을민영주차장', dist: '301m', addr: '서울 용산구 한강대로 350' },
                { name: '트윈시티 남산 주차장', dist: '481m', addr: '서울 용산구 한강대로 366' },
                { name: 'GS타임즈 KDB생명타워 주차장', dist: '528m', addr: '서울 용산구 한강대로 372' },
            ],
            generator: GEN,
            power: { total: 159, usable: 70, approx: false, lines: ['Part A - 40kW', 'Part BC - 10kW', 'Cafe - 10kW'] },
        },
        LAYER20: {
            pdf: 'https://drive.google.com/file/d/15iO3Jm5s0MaLqR4gUo3mwdL-jn_XgVqt/view',
            address: ['서울 용산구 원효로1가 129-20 (원효로 236)', '129-20, Wonhyo-ro 1-ga, Youngsan-gu, Seoul'],
            access: {
                ko: ['지하철 삼각지역 / 효창공원역 / 남영역 각각 도보 10분 거리 위치', CAR.ko],
                en: ['10 min walk from Samgakji, Hyochang Park or Namyeong Station', CAR.en],
            },
            parking: {
                ko: ['전체 대관 시 : 6대', '1파트 대관 시 : 3대', OVER.ko],
                en: ['Whole building: 6 cars', 'One part: 3 cars', OVER.en],
            },
            paid: [
                { name: '용산등기소공영주차장', dist: '361m', addr: '서울 용산구 문배동 12-1', note: perHour(3000) },
                { name: '하이파킹 디아뜨센트럴 민영 주차장', dist: '320m', addr: '서울 용산구 원효로1가 112-4', note: perHour(3000) },
                { name: '청파동1마을공원공영주차장', dist: '577m', addr: '서울 용산구 청파동3가 118-102', note: perHour(1800) },
            ],
            generator: GEN,
            power: { total: 149, usable: 70, approx: true, lines: ['1F - 30kW', '2F - 30kW', '3F - 10kW'] },
        },
        LAYER11: {
            pdf: 'https://drive.google.com/file/d/1BXdy29a1nP_0ezjsKkl1p7WitIoNYda6/view',
            address: ['서울 마포구 신수동 93-4 (광성로 41-11)', '41-11, Gwangseong-ro, Mapo-gu, Seoul'],
            access: {
                ko: ['지하철 서강대역 도보 2분, 대흥역 도보 5분 / 신촌역, 광흥창역 도보 10분 거리 위치', CAR.ko],
                en: ['2 min walk from Sogang Univ. Station, 5 min from Daeheung Station / 10 min from Sinchon or Gwangheungchang Station', CAR.en],
            },
            parking: {
                ko: ['Layer 11 지점은 지점 주차 공간이 마련되어 있지 않아 주변 주차장 이용을 부탁드립니다.'],
                en: ['Layer 11 has no on-site parking. Please use a car park nearby.'],
            },
            paid: [
                { name: '신수 노외 공영주차장', dist: '70m', addr: '서울 마포구 신수동 88-1' },
                { name: '구프라자 주차장', dist: '250m', addr: '서울 마포구 신수동 63-14' },
                { name: '거구장 민영 주차장', dist: '240m', addr: '서울 마포구 신수동 63-8' },
                { name: '서강 민영 주차장', dist: '357m', addr: '서울 마포구 노고산동 117-2' },
            ],
            generator: GEN,
            power: { total: 149, usable: 65, approx: true, lines: ['Part AB - 55kW', 'Cafe - 10kW'] },
        },
        LAYER27: {
            pdf: 'https://drive.google.com/file/d/1tkS2_iwYvhKP14xaNtRf4B5LOum5qR7c/view',
            address: ['서울 성동구 성수동2가 279-2 (아차산로11가길 26)', '26, Achasan-ro 11ga-gil, Seongdong-gu, Seoul'],
            ...SEONGSU_26_27,
            generator: GEN,
            power: { total: 120, usable: 90, approx: true, lines: ['Part A + Office - 90kW'] },
        },
        LAYER26: {
            pdf: 'https://drive.google.com/file/d/1OzreFNAE5ywX3u449UwXix-PV41J6D_O/view',
            address: ['서울 성동구 성수동2가 279-2 (아차산로11가길 26)', '26, Achasan-ro 11ga-gil, Seongdong-gu, Seoul'],
            ...SEONGSU_26_27,
            generator: GEN,
            power: { total: 100, usable: null, approx: false, lines: ['Part AB - 60kW', 'Spare - 40kW'] },
        },
        LAYER41: {
            pdf: 'https://drive.google.com/file/d/1T4C38E1e2JJD7oLHgj_PlI38gS9noQns/view',
            address: ['서울 성동구 성수동2가 277-4 (아차산로9길 41)', '41, Achasan-ro 9-gil, Seongdong-gu, Seoul'],
            access: {
                ko: ['지하철 2호선 성수역 2번 출구 도보 6분', CAR.ko],
                en: ['6 min walk from Seongsu Station (Line 2), Exit 2', CAR.en],
            },
            parking: {
                ko: [
                    '전체 대관 시 : 5대', '1층 대관 시 : 3대', '3층 대관 시 : 2대', OVER.ko,
                    '**주차는 스튜디오 건물에 붙여 1대, 1층 셔터문을 열어 안으로 승용차 2대 가능합니다. 그 외 200m 밖에 저희의 야외 지정 주차장 3칸이 있습니다. (광나루로 6길 15 / 지정1, 2, 3)',
                ],
                en: [
                    'Whole building: 5 cars', '1F: 3 cars', '3F: 2 cars', OVER.en,
                    '**1 car beside the building and 2 passenger cars inside through the 1F shutter door. We also have 3 reserved outdoor bays about 200m away (광나루로 6길 15 / bays 1, 2, 3).',
                ],
            },
            paid: [
                { name: 'KT 성수분국 노상공영주차장', dist: '252m', addr: '서울 성동구 성수동2가 280-50', note: HOURS.kt },
                { name: '성수에이팩센터', dist: '422m', addr: '서울 성동구 성수동2가 289-5', note: HOURS.all },
                { name: '아이에스 biz타워', dist: '419m', addr: '서울 성동구 성수동2가 289-319', note: HOURS.all },
            ],
            generator: GEN,
            power: { total: 159, usable: 99, approx: true, lines: ['1, 2, 3F - 70kW', 'Spare - 29kW'] },
        },
        HONGDAE: {
            pdf: null,
            address: ['서울 마포구 성산동 46-1 (월드컵북로15길 23)', '46-1, Sungsan-dong, Mapo-gu, Seoul'],
            access: {
                ko: [
                    '홍대입구역 1번 출구 - 버스(7016 / 7711 / 7737) 탑승 - 성산2교 정류장 하차',
                    '횡단보도를 건너 좌측 방향 현대 오일뱅크 주유소까지 70m 직진 - 주유소 우측 골목으로 진입하여 90m 직진',
                    '삼거리 좌측 검은색 대문이 있는 하얀색 2층 주택',
                ],
                en: [
                    'Hongik Univ. Station, Exit 1 - take bus 7016 / 7711 / 7737 - get off at Seongsan 2-gyo',
                    'Cross at the crosswalk, go left 70m to the Hyundai Oilbank gas station, then take the alley on its right for 90m',
                    'White two-storey house with a black gate, on the left at the three-way junction',
                ],
            },
            parking: {
                ko: ['스튜디오 차고지에 팀당 1대 가능하며, 추가 차량은 인근 주차장 이용 부탁드립니다.'],
                en: ['1 car per team in the studio garage. Please use a nearby car park for additional cars.'],
            },
            paid: [
                { name: 'CS타워 지하주차장', dist: null, addr: '서울 마포구 성산동 56-3' },
                { name: '마포중앙도서관', dist: null, addr: '서울 마포구 성산로 128', note: { ko: '02-3153-5800', en: '02-3153-5800' } },
            ],
            generator: { ko: GEN.ko.slice(0, 2), en: GEN.en.slice(0, 2) },
            power: null,
        },
    };
})();
