import { subDays, format } from 'date-fns';

// ============ 桥梁基础数据（含完整专业参数）============

// 杭州钱塘江沿线真实桥梁列表（坐标为高德地图 GCJ-02 坐标）
export const MOCK_BRIDGES = [
    {
        id: 'BRG-001', name: '复兴大桥', type: '斜拉桥', length: 1376, lanes: 6, buildYear: 2003,
        coord: [120.1737, 30.2216],
        healthScore: 82,
        // === 专业档案参数 ===
        bridgeCode: 'QJ-330100-001',
        managementUnit: '杭州市城市基础设施发展中心',
        designLoad: '公路-Ⅰ级',
        seismicIntensity: '6度（0.05g）',
        mainSpan: 256, width: 33.5, height: 65.7, spanCount: 5, pierCount: 4,
        superstructureMaterial: 'C50预应力混凝土+钢箱梁',
        substructureMaterial: 'C40钢筋混凝土',
        deckPavement: 'SMA-13改性沥青',
        bci: 78.5, techGrade: 2,
        crossType: '跨江', constructionUnit: '浙江省交通工程集团',
        lastInspectionDate: '2026-03-05', openDate: '2003-10-16',
        sensors: { windSpeed: 4.5, stringTension: 1205, strain: 0.15, vibration: 0.8, deflection: 2.3, tiltAngle: 0.05, freqShift: 0.12, chlorideConc: 0.18 },
    },
    {
        id: 'BRG-002', name: '钱塘江大桥', type: '双层钢桁架桥', length: 1453, lanes: 4, buildYear: 1937,
        coord: [120.1395, 30.2132],
        healthScore: 68,
        bridgeCode: 'QJ-330100-002',
        managementUnit: '中国铁路上海局集团', designLoad: '公路-Ⅱ级 / 铁路中-活载',
        seismicIntensity: '6度（0.05g）',
        mainSpan: 67, width: 6.1, height: 18, spanCount: 16, pierCount: 15,
        superstructureMaterial: '铆接钢桁架',
        substructureMaterial: '钢筋混凝土沉井基础',
        deckPavement: '正交异性钢桥面板',
        bci: 62.3, techGrade: 3,
        crossType: '跨江（公铁两用）', constructionUnit: '茅以升主持设计',
        lastInspectionDate: '2026-02-20', openDate: '1937-09-26',
        sensors: { windSpeed: 5.2, stringTension: null, strain: 0.22, vibration: 1.2, deflection: 4.1, tiltAngle: 0.12, freqShift: 0.35, chlorideConc: 0.45 },
    },
    {
        id: 'BRG-003', name: '之江大桥', type: '中承式拱桥', length: 1724, lanes: 6, buildYear: 2012,
        coord: [120.0865, 30.1980],
        healthScore: 91,
        bridgeCode: 'QJ-330100-003',
        managementUnit: '杭州市城市基础设施发展中心', designLoad: '公路-Ⅰ级',
        seismicIntensity: '6度（0.05g）',
        mainSpan: 190, width: 37.5, height: 52, spanCount: 5, pierCount: 4,
        superstructureMaterial: 'Q345qD钢管混凝土拱肋',
        substructureMaterial: 'C40钢筋混凝土',
        deckPavement: 'SBS改性沥青',
        bci: 89.2, techGrade: 1,
        crossType: '跨江', constructionUnit: '中铁大桥局集团',
        lastInspectionDate: '2026-03-10', openDate: '2012-12-28',
        sensors: { windSpeed: 3.8, stringTension: null, strain: 0.08, vibration: 0.5, deflection: 1.1, tiltAngle: 0.02, freqShift: 0.05, chlorideConc: 0.08 },
    },
    {
        id: 'BRG-004', name: '西兴大桥', type: '独塔斜拉桥', length: 1855, lanes: 8, buildYear: 2007,
        coord: [120.2055, 30.2185],
        healthScore: 76,
        bridgeCode: 'QJ-330100-004',
        managementUnit: '杭州市城市基础设施发展中心', designLoad: '公路-Ⅰ级',
        seismicIntensity: '6度（0.05g）',
        mainSpan: 210, width: 42.5, height: 118, spanCount: 6, pierCount: 5,
        superstructureMaterial: 'C60预应力混凝土箱梁',
        substructureMaterial: 'C50钢筋混凝土',
        deckPavement: 'SMA-13改性沥青',
        bci: 71.8, techGrade: 2,
        crossType: '跨江', constructionUnit: '浙江省交通工程建设集团',
        lastInspectionDate: '2026-03-01', openDate: '2007-10-01',
        sensors: { windSpeed: 6.1, stringTension: 1180, strain: 0.18, vibration: 0.9, deflection: 3.5, tiltAngle: 0.08, freqShift: 0.22, chlorideConc: 0.28 },
    },
    {
        id: 'BRG-005', name: '九堡大桥', type: '中承式拱桥', length: 1855, lanes: 6, buildYear: 2012,
        coord: [120.2830, 30.2580],
        healthScore: 88,
        bridgeCode: 'QJ-330100-005',
        managementUnit: '杭州市城市基础设施发展中心', designLoad: '公路-Ⅰ级',
        seismicIntensity: '6度（0.05g）',
        mainSpan: 210, width: 33, height: 45, spanCount: 5, pierCount: 4,
        superstructureMaterial: 'Q345qD钢管混凝土拱肋',
        substructureMaterial: 'C40钢筋混凝土',
        deckPavement: 'SMA-13改性沥青',
        bci: 84.6, techGrade: 1,
        crossType: '跨江', constructionUnit: '中铁大桥局集团',
        lastInspectionDate: '2026-03-08', openDate: '2012-07-01',
        sensors: { windSpeed: 4.2, stringTension: null, strain: 0.11, vibration: 0.6, deflection: 1.8, tiltAngle: 0.03, freqShift: 0.08, chlorideConc: 0.12 },
    },
    {
        id: 'BRG-006', name: '庆春桥', type: '连续梁桥', length: 1200, lanes: 6, buildYear: 2004,
        coord: [120.1870, 30.2500],
        healthScore: 85,
        bridgeCode: 'QJ-330100-006',
        managementUnit: '杭州市城市基础设施发展中心', designLoad: '公路-Ⅰ级',
        seismicIntensity: '6度（0.05g）',
        mainSpan: 138, width: 36, height: 12, spanCount: 8, pierCount: 7,
        superstructureMaterial: 'C50预应力混凝土箱梁',
        substructureMaterial: 'C40钢筋混凝土',
        deckPavement: 'SMA-13改性沥青',
        bci: 82.1, techGrade: 2,
        crossType: '跨江', constructionUnit: '浙江省交通工程建设集团',
        lastInspectionDate: '2026-02-28', openDate: '2004-09-28',
        sensors: { windSpeed: 3.6, stringTension: null, strain: 0.10, vibration: 0.55, deflection: 2.0, tiltAngle: 0.04, freqShift: 0.09, chlorideConc: 0.15 },
    },
    {
        id: 'BRG-007', name: '彭埠大桥', type: '系杆拱桥', length: 1580, lanes: 6, buildYear: 2011,
        coord: [120.2490, 30.2460],
        healthScore: 90,
        bridgeCode: 'QJ-330100-007',
        managementUnit: '杭州市城市基础设施发展中心', designLoad: '公路-Ⅰ级',
        seismicIntensity: '6度（0.05g）',
        mainSpan: 160, width: 35, height: 38, spanCount: 6, pierCount: 5,
        superstructureMaterial: 'Q345qD钢管混凝土拱肋',
        substructureMaterial: 'C40钢筋混凝土',
        deckPavement: 'SBS改性沥青',
        bci: 87.3, techGrade: 1,
        crossType: '跨江', constructionUnit: '中铁大桥局集团',
        lastInspectionDate: '2026-03-12', openDate: '2011-10-01',
        sensors: { windSpeed: 3.9, stringTension: null, strain: 0.09, vibration: 0.45, deflection: 1.4, tiltAngle: 0.02, freqShift: 0.06, chlorideConc: 0.10 },
    },
    {
        id: 'BRG-008', name: '望江路过江隧道', type: '盾构隧道', length: 2690, lanes: 4, buildYear: 2018,
        coord: [120.1935, 30.2320],
        healthScore: 95,
        bridgeCode: 'QJ-330100-008',
        managementUnit: '杭州市城市基础设施发展中心', designLoad: '公路-Ⅰ级',
        seismicIntensity: '6度（0.10g）',
        mainSpan: null, width: 15.2, height: null, spanCount: null, pierCount: null,
        superstructureMaterial: 'C60预制管片',
        substructureMaterial: '盾构管片+复合地层',
        deckPavement: 'C40混凝土路面',
        bci: 93.5, techGrade: 1,
        crossType: '过江隧道', constructionUnit: '中铁十四局集团',
        lastInspectionDate: '2026-03-15', openDate: '2018-12-08',
        sensors: { windSpeed: 0.3, stringTension: null, strain: 0.04, vibration: 0.2, deflection: 0.5, tiltAngle: 0.01, freqShift: 0.02, chlorideConc: 0.06 },
    },
];

// 桥梁结构部件（依据 JTG/T H21 标准分类）
const BRIDGE_COMPONENTS = ['桥面铺装', '主梁', '桥墩', '桥台', '桥塔', '拉索/吊杆', '伸缩缝装置', '防撞护栏', '支座', '梁底', '翼缘板', '盖梁'];

// 病害类型定义（依据《公路桥梁技术状况评定标准》JTG/T H21）
export const DISEASE_TYPES = [
    { code: 'D-101', name: '横向裂缝',   color: '#ef4444', icon: '🔴', enName: 'Transverse Crack',           category: '裂缝类' },
    { code: 'D-102', name: '纵向裂缝',   color: '#dc2626', icon: '🔻', enName: 'Longitudinal Crack',         category: '裂缝类' },
    { code: 'D-103', name: '网状裂缝',   color: '#b91c1c', icon: '🟥', enName: 'Mesh/Map Crack',              category: '裂缝类' },
    { code: 'D-201', name: '蜂窝麻面',   color: '#f97316', icon: '🟠', enName: 'Honeycombing',                category: '表面缺损' },
    { code: 'D-202', name: '混凝土剥落', color: '#ea580c', icon: '🟧', enName: 'Concrete Spalling',           category: '表面缺损' },
    { code: 'D-301', name: '露筋锈蚀',   color: '#a855f7', icon: '🟣', enName: 'Exposed Rebar & Corrosion',   category: '钢筋病害' },
    { code: 'D-401', name: '支座病害',   color: '#eab308', icon: '🟡', enName: 'Bearing Defect',              category: '附属设施' },
    { code: 'D-402', name: '伸缩缝损伤', color: '#14b8a6', icon: '🟢', enName: 'Expansion Joint Damage',      category: '附属设施' },
    { code: 'D-501', name: '渗水泛碱',   color: '#3b82f6', icon: '🔵', enName: 'Seepage & Efflorescence',     category: '耐久性病害' },
];

// ============ 工具函数 ============

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomFloat = (min, max, decimals = 2) => parseFloat((min + Math.random() * (max - min)).toFixed(decimals));

// 生成归一化多边形掩膜坐标 (模拟像素级分割)
const generatePolygonMask = (cx, cy, sizeX, sizeY, points = 8) => {
    const polygon = [];
    for (let i = 0; i < points; i++) {
        const angle = (i / points) * Math.PI * 2;
        const rx = sizeX * (0.4 + Math.random() * 0.6);
        const ry = sizeY * (0.4 + Math.random() * 0.6);
        polygon.push([
            parseFloat((cx + rx * Math.cos(angle)).toFixed(4)),
            parseFloat((cy + ry * Math.sin(angle)).toFixed(4))
        ]);
    }
    return polygon;
};

// ============ 无人机机队 ============

export const MOCK_UAV_FLEET = [
    {
        id: 'UAV-001', name: '天鹰01号', model: 'DJI Matrice 350 RTK',
        status: 'flying', mode: '环绕巡检',
        position: [120.1740, 30.2220], altitude: 35,
        battery: 72, speed: 5.2, heading: 225,
        gimbalAngle: -45, temperature: 18,
        currentBridge: '复兴大桥',
        trajectory: [
            [120.1730, 30.2225], [120.1735, 30.2222],
            [120.1738, 30.2218], [120.1740, 30.2220],
        ],
        signal: { strength: 95, latency: 18 },
        camera: { resolution: '8K', fps: 30, zoom: 10 }
    },
    {
        id: 'UAV-002', name: '天鹰02号', model: 'DJI Matrice 350 RTK',
        status: 'flying', mode: '底部巡检',
        position: [120.1400, 30.2138], altitude: 15,
        battery: 88, speed: 3.5, heading: 90,
        gimbalAngle: -90, temperature: 17,
        currentBridge: '钱塘江大桥',
        trajectory: [
            [120.1388, 30.2140], [120.1392, 30.2138],
            [120.1395, 30.2136], [120.1400, 30.2138],
        ],
        signal: { strength: 88, latency: 22 },
        camera: { resolution: '4K', fps: 60, zoom: 20 }
    },
    {
        id: 'UAV-003', name: '天鹰03号', model: 'DJI Mavic 3 Enterprise',
        status: 'standby', mode: '待命',
        position: [120.1870, 30.2500], altitude: 0,
        battery: 100, speed: 0, heading: 0,
        gimbalAngle: 0, temperature: 20,
        currentBridge: '基地停机坪',
        trajectory: [],
        signal: { strength: 100, latency: 0 },
        camera: { resolution: '4K', fps: 30, zoom: 28 }
    },
    {
        id: 'UAV-004', name: '天鹰04号', model: 'DJI Matrice 350 RTK',
        status: 'returning', mode: '返航中',
        position: [120.2060, 30.2190], altitude: 50,
        battery: 25, speed: 12.0, heading: 315,
        gimbalAngle: 0, temperature: 19,
        currentBridge: '西兴大桥',
        trajectory: [
            [120.2050, 30.2182], [120.2055, 30.2185],
            [120.2058, 30.2188], [120.2060, 30.2190],
        ],
        signal: { strength: 78, latency: 35 },
        camera: { resolution: '8K', fps: 30, zoom: 10 }
    },
];

// ============ 桥梁病害数据（含多边形掩膜 + 量化字段）============

export const generateBridgeDiseases = () => {
    return Array.from({ length: 50 }).map((_, i) => {
        const typeObj = getRandomItem(DISEASE_TYPES);
        const bridge = getRandomItem(MOCK_BRIDGES);
        const severity = getRandomItem(['轻度', '中度', '重度']);
        const component = getRandomItem(BRIDGE_COMPONENTS);

        // 生成量化数据（依据 JTG/T H21 标准量化指标）
        let quantification = {};
        const widthGrade = (w) => w < 0.15 ? 'A级(≤0.15mm)' : w < 0.25 ? 'B级(0.15~0.25mm)' : w < 0.50 ? 'C级(0.25~0.50mm)' : 'D级(>0.50mm)';
        switch (typeObj.name) {
            case '横向裂缝': {
                const w = getRandomFloat(0.08, 2.0, 2);
                quantification = {
                    length_m: getRandomFloat(0.3, 6.0),
                    max_width_mm: w,
                    width_grade: widthGrade(w),
                    depth_mm: getRandomFloat(2, 20, 1),
                    orientation: '垂直于行车方向',
                };
                break;
            }
            case '纵向裂缝': {
                const w = getRandomFloat(0.05, 1.5, 2);
                quantification = {
                    length_m: getRandomFloat(0.5, 8.0),
                    max_width_mm: w,
                    width_grade: widthGrade(w),
                    depth_mm: getRandomFloat(2, 25, 1),
                    orientation: '平行于行车方向',
                };
                break;
            }
            case '网状裂缝':
                quantification = {
                    area_m2: getRandomFloat(0.1, 4.0),
                    max_width_mm: getRandomFloat(0.05, 0.8, 2),
                    density: getRandomItem(['稀疏', '中等', '密集']),
                    pattern: '龟裂/地图状开裂',
                };
                break;
            case '蜂窝麻面':
                quantification = {
                    area_m2: getRandomFloat(0.02, 1.5),
                    max_depth_mm: getRandomFloat(3, 20, 1),
                    grade: getRandomItem(['Ⅰ级(轻微)', 'Ⅱ级(中等)', 'Ⅲ级(严重)']),
                    aggregate_exposed: getRandomItem([true, false]),
                };
                break;
            case '混凝土剥落':
                quantification = {
                    area_m2: getRandomFloat(0.01, 2.5),
                    depth_mm: getRandomFloat(5, 60, 0),
                    rebar_exposed: getRandomItem([true, false]),
                    edge_condition: getRandomItem(['边缘松散', '边缘密实', '持续发展']),
                };
                break;
            case '露筋锈蚀':
                quantification = {
                    length_m: getRandomFloat(0.2, 2.0),
                    exposed_count: getRandomInt(1, 8),
                    corrosion_rate: getRandomFloat(5, 45, 0) + '%',
                    section_loss: getRandomFloat(0, 15, 1) + '%',
                    protection_layer_mm: getRandomFloat(0, 8, 1),
                };
                break;
            case '支座病害':
                quantification = {
                    defect_type: getRandomItem(['老化开裂', '剪切变形', '脱空', '位移超限', '不均匀受压']),
                    displacement_mm: getRandomFloat(0, 35, 1),
                    bearing_type: getRandomItem(['板式橡胶支座', '盆式支座', '球型支座']),
                };
                break;
            case '伸缩缝损伤':
                quantification = {
                    defect_type: getRandomItem(['橡胶条老化', '锚固区破损', '止水带失效', '型钢焊缝开裂', '高低差超限']),
                    gap_diff_mm: getRandomFloat(2, 25, 1),
                    joint_type: getRandomItem(['模数式伸缩缝', '梳齿板式伸缩缝', '橡胶伸缩缝']),
                };
                break;
            case '渗水泛碱':
                quantification = {
                    area_m2: getRandomFloat(0.1, 6.0),
                    moisture_level: getRandomItem(['轻微渗湿', '明显水渍', '挂流滴水']),
                    efflorescence: getRandomItem(['无', '少量白色析出', '大面积白色结晶']),
                    carbonation_depth_mm: getRandomFloat(2, 18, 1),
                };
                break;
        }

        // 专业养护建议映射
        const adviceMap = {
            '横向裂缝': '建议采用环氧树脂灌缝或表面封闭处理，定期监测缝宽发展',
            '纵向裂缝': '建议压力注浆修复，排查受力状态变化原因',
            '网状裂缝': '建议碳纤维布加固或喷涂防护涂层，防止进一步碳化',
            '蜂窝麻面': '建议凿除松散部分后用高强砂浆修补找平',
            '混凝土剥落': '建议凿除松散混凝土，采用聚合物砂浆或喷射混凝土修补',
            '露筋锈蚀': '须立即凿除松散混凝土，除锈后涂刷阻锈剂，聚合物砂浆修复保护层',
            '支座病害': '建议顶升更换病害支座，检查墩台垫石状态',
            '伸缩缝损伤': '建议更换损伤部件，检查锚固系统及止水带完整性',
            '渗水泛碱': '建议排查防水层完整性，疏通泄水孔，必要时重做桥面防水',
        };

        return {
            id: `BRG-2026${String(3).padStart(2, '0')}-${String(i + 1).padStart(3, '0')}`,
            diseaseCode: typeObj.code,
            bridgeId: bridge.id,
            bridgeName: bridge.name,
            component,
            type: typeObj.name,
            category: typeObj.category,
            color: typeObj.color,
            severity,
            confidence: getRandomFloat(0.82, 0.99),
            quantification,
            coord: [
                bridge.coord[0] + getRandomFloat(-0.003, 0.003),
                bridge.coord[1] + getRandomFloat(-0.002, 0.002),
            ],
            time: format(subDays(new Date(), getRandomInt(0, 14)), 'yyyy-MM-dd HH:mm:ss'),
            status: getRandomItem(['待处理', '待处理', '已上报', '维修中', '已修复']),
            advice: adviceMap[typeObj.name] || '建议安排专项检查并制定养护方案',
            imageUrl: ['横向裂缝','纵向裂缝','网状裂缝'].includes(typeObj.name) ? '/mock-bridges/image_01.jpg' :
                      ['混凝土剥落','露筋锈蚀'].includes(typeObj.name) ? '/mock-bridges/image_02.jpg' :
                      typeObj.name === '蜂窝麻面' ? '/mock-bridges/image_03.jpg' :
                      ['支座病害','伸缩缝损伤'].includes(typeObj.name) ? '/mock-bridges/image_04.jpg' :
                      '/mock-bridges/image_05.jpg',
        };
    });
};

export const MOCK_BRIDGE_DISEASES = generateBridgeDiseases();

// ============ AI巡检检测数据（含多边形掩膜 —— 比赛核心）============

export const AI_BRIDGE_INSPECTION_DATA = {
    inspectionId: 'UAV-TASK-001',
    bridgeName: '杭州复兴大桥',
    uavId: 'UAV-001',
    timestamp: '2026-03-08 14:00:00',
    videoMeta: { width: 1920, height: 1080, duration: 30.0 },
    frames: [
        {
            time: 2.5,
            imageUrl: '/mock-bridges/image_01.jpg',
            environment: { lighting: 'Good', weather: 'Clear', altitude: 35 },
            diseases: [
                {
                    id: 'BRG-202603-001',
                    diseaseCode: 'D-101',
                    type: '横向裂缝',
                    category: '裂缝类',
                    severity: '重度',
                    confidence: 0.98,
                    component: '桥面铺装',
                    mask_polygon: generatePolygonMask(0.45, 0.52, 0.12, 0.04, 10),
                    bbox: [0.33, 0.48, 0.24, 0.08],
                    quantification: { length_m: 1.25, max_width_mm: 5.2, width_grade: 'D级(>0.50mm)', depth_mm: 8, orientation: '垂直于行车方向' },
                    advice: '建议采用环氧树脂灌缝处理，裂缝宽度超限需安排专项修复',
                    location: '复兴大桥 北塔桥面 S3',
                    coords: [120.1852, 30.2305],
                    time: '14:02:30',
                },
            ]
        },
        {
            time: 6.8,
            imageUrl: '/mock-bridges/image_02.jpg',
            environment: { lighting: 'Good', weather: 'Clear', altitude: 20 },
            diseases: [
                {
                    id: 'BRG-202603-002',
                    diseaseCode: 'D-202',
                    type: '混凝土剥落',
                    category: '表面缺损',
                    severity: '中度',
                    confidence: 0.94,
                    component: '桥墩',
                    mask_polygon: generatePolygonMask(0.60, 0.55, 0.08, 0.10, 7),
                    bbox: [0.52, 0.45, 0.16, 0.20],
                    quantification: { area_m2: 0.35, depth_mm: 25, rebar_exposed: false, edge_condition: '边缘松散' },
                    advice: '凿除松散混凝土后采用聚合物砂浆修补，监测周边区域发展趋势',
                    location: '复兴大桥 2#桥墩 东侧',
                    coords: [120.1848, 30.2298],
                    time: '14:06:48',
                },
            ]
        },
        {
            time: 12.3,
            imageUrl: '/mock-bridges/image_03.jpg',
            environment: { lighting: 'Shadow', weather: 'Cloudy', altitude: 10 },
            diseases: [
                {
                    id: 'BRG-202603-003',
                    diseaseCode: 'D-301',
                    type: '露筋锈蚀',
                    category: '钢筋病害',
                    severity: '重度',
                    confidence: 0.96,
                    component: '梁底',
                    mask_polygon: generatePolygonMask(0.38, 0.58, 0.06, 0.15, 6),
                    bbox: [0.32, 0.43, 0.12, 0.30],
                    quantification: { length_m: 0.8, exposed_count: 3, corrosion_rate: '25%', section_loss: '8.2%', protection_layer_mm: 0 },
                    advice: '须立即凿除松散混凝土，除锈后涂刷阻锈剂，聚合物砂浆修复保护层',
                    location: '复兴大桥 3#梁底 中段',
                    coords: [120.1845, 30.2292],
                    time: '14:12:18',
                },
            ]
        },
        {
            time: 17.5,
            imageUrl: '/mock-bridges/image_04.jpg',
            environment: { lighting: 'Good', weather: 'Clear', altitude: 30 },
            diseases: [
                {
                    id: 'BRG-202603-004',
                    diseaseCode: 'D-401',
                    type: '支座病害',
                    category: '附属设施',
                    severity: '中度',
                    confidence: 0.91,
                    component: '支座',
                    mask_polygon: generatePolygonMask(0.50, 0.35, 0.04, 0.20, 8),
                    bbox: [0.46, 0.15, 0.08, 0.40],
                    quantification: { defect_type: '剪切变形', displacement_mm: 18.5, bearing_type: '板式橡胶支座' },
                    advice: '建议顶升更换病害支座，检查墩台垫石状态',
                    location: '复兴大桥 北塔3#支座',
                    coords: [120.1855, 30.2308],
                    time: '14:17:30',
                },
            ]
        },
        {
            time: 22.0,
            imageUrl: '/mock-bridges/image_05.jpg',
            environment: { lighting: 'Good', weather: 'Clear', altitude: 25 },
            diseases: [
                {
                    id: 'BRG-202603-005',
                    diseaseCode: 'D-501',
                    type: '渗水泛碱',
                    category: '耐久性病害',
                    severity: '轻度',
                    confidence: 0.88,
                    component: '桥墩',
                    mask_polygon: generatePolygonMask(0.55, 0.60, 0.10, 0.08, 9),
                    bbox: [0.45, 0.52, 0.20, 0.16],
                    quantification: { area_m2: 1.2, moisture_level: '明显水渍', efflorescence: '少量白色析出', carbonation_depth_mm: 8.5 },
                    advice: '建议排查防水层完整性，疏通泄水孔，必要时重做桥面防水',
                    location: '复兴大桥 5#桥墩 底部',
                    coords: [120.1842, 30.2285],
                    time: '14:22:00',
                },
            ]
        },
        {
            time: 26.5,
            imageUrl: '/mock-bridges/image_06.jpg',
            environment: { lighting: 'Poor', weather: 'Light Rain', altitude: 15 },
            diseases: [
                {
                    id: 'BRG-202603-006',
                    diseaseCode: 'D-102',
                    type: '纵向裂缝',
                    category: '裂缝类',
                    severity: '轻度',
                    confidence: 0.85,
                    component: '防撞护栏',
                    mask_polygon: generatePolygonMask(0.30, 0.45, 0.15, 0.03, 6),
                    bbox: [0.15, 0.42, 0.30, 0.06],
                    quantification: { length_m: 2.8, max_width_mm: 0.15, width_grade: 'A级(≤0.15mm)', depth_mm: 3, orientation: '平行于行车方向' },
                    advice: '裂缝宽度处于观察范围内，建议定期监测并表面封闭处理',
                    location: '复兴大桥 南侧护栏 K0+850',
                    coords: [120.1838, 30.2278],
                    time: '14:26:30',
                },
            ]
        },
        {
            time: 31.0,
            imageUrl: '/mock-bridges/image_07.jpg',
            environment: { lighting: 'Good', weather: 'Clear', altitude: 40 },
            diseases: [
                {
                    id: 'BRG-202603-007',
                    diseaseCode: 'D-103',
                    type: '网状裂缝',
                    category: '裂缝类',
                    severity: '中度',
                    confidence: 0.92,
                    component: '桥面铺装',
                    mask_polygon: generatePolygonMask(0.65, 0.30, 0.08, 0.05, 8),
                    bbox: [0.57, 0.25, 0.16, 0.10],
                    quantification: { area_m2: 0.6, max_width_mm: 0.35, density: '中等', pattern: '龟裂/地图状开裂' },
                    advice: '建议碳纤维布加固或喷涂防护涂层，防止进一步碳化侵蚀',
                    location: '复兴大桥 南塔桥面 S5',
                    coords: [120.1856, 30.2312],
                    time: '14:30:15',
                },
                {
                    id: 'BRG-202603-008',
                    diseaseCode: 'D-402',
                    type: '伸缩缝损伤',
                    category: '附属设施',
                    severity: '轻度',
                    confidence: 0.89,
                    component: '伸缩缝装置',
                    mask_polygon: generatePolygonMask(0.70, 0.35, 0.12, 0.06, 7),
                    bbox: [0.58, 0.29, 0.24, 0.12],
                    quantification: { defect_type: '橡胶条老化', gap_diff_mm: 5.2, joint_type: '模数式伸缩缝' },
                    advice: '建议更换老化橡胶条，检查锚固及止水带完整性',
                    location: '复兴大桥 南塔桥面 伸缩缝J2',
                    coords: [120.1857, 30.2313],
                    time: '14:30:16',
                }
            ]
        },
        {
            time: 36.5,
            imageUrl: '/mock-bridges/image_08.jpg',
            environment: { lighting: 'Shadow', weather: 'Cloudy', altitude: 22 },
            diseases: [
                {
                    id: 'BRG-202603-009',
                    diseaseCode: 'D-201',
                    type: '蜂窝麻面',
                    category: '表面缺损',
                    severity: '重度',
                    confidence: 0.97,
                    component: '盖梁',
                    mask_polygon: generatePolygonMask(0.40, 0.70, 0.15, 0.12, 10),
                    bbox: [0.25, 0.58, 0.30, 0.24],
                    quantification: { area_m2: 1.5, max_depth_mm: 35, grade: 'Ⅲ级(严重)', aggregate_exposed: true },
                    advice: '严重蜂窝麻面，须凿除松散部分后用高强砂浆修补找平，检查内部密实度',
                    location: '复兴大桥 4#桥墩 支座垫石上方盖梁',
                    coords: [120.1843, 30.2288],
                    time: '14:35:45',
                }
            ]
        }
    ]
};

// 获取所有检测项的扁平化列表
export const getAllBridgeDetections = () => {
    const detections = [];
    AI_BRIDGE_INSPECTION_DATA.frames.forEach(frame => {
        frame.diseases.forEach(det => {
            detections.push({
                ...det,
                frameTime: frame.time,
                virtualSecond: frame.time,
            });
        });
    });
    return detections;
};

// ============ Dashboard 统计数据 ============

export const DASHBOARD_STATS = [
    { label: '今日巡检架次', value: '12', trend: '+3', type: 'positive' },
    { label: '发现病害总数', value: MOCK_BRIDGE_DISEASES.length.toString(), trend: '+8', type: 'negative' },
    { label: '待处理工单', value: String(MOCK_BRIDGE_DISEASES.filter(d => d.status === '待处理').length), trend: '-5', type: 'positive' },
    { label: '桥梁健康指数', value: '83.2', trend: '良', type: 'neutral' },
];

// ============ 巡检任务 ============

export const MOCK_BRIDGE_INSPECTIONS = [
    { id: 'INS-001', bridgeName: '复兴大桥', uav: 'UAV-001', status: 'executing', startTime: '14:00', progress: 65, diseases: 4 },
    { id: 'INS-002', bridgeName: '钱塘江大桥', uav: 'UAV-002', status: 'executing', startTime: '13:30', progress: 82, diseases: 6 },
    { id: 'INS-003', bridgeName: '之江大桥', uav: 'UAV-003', status: 'pending', startTime: '-', progress: 0, diseases: 0 },
    { id: 'INS-004', bridgeName: '西兴大桥', uav: 'UAV-004', status: 'completed', startTime: '10:00', progress: 100, diseases: 3 },
    { id: 'INS-005', bridgeName: '九堡大桥', uav: 'UAV-003', status: 'pending', startTime: '-', progress: 0, diseases: 0 },
];

// ============ 工单数据 ============

export const MOCK_BRIDGE_WORK_ORDERS = [
    {
        id: 'WO-20260308-01', sourceType: 'disease', diseaseId: 'BRG-202603-001',
        targetName: '横向裂缝(D-101)', bridge: '复兴大桥', component: '桥面铺装',
        desc: '北塔桥面S3区域重度横向裂缝环氧树脂灌缝修复', type: '裂缝灌缝修复',
        status: 'pending', priority: 'High', assignedTo: '桥梁维修一队',
        createTime: '2026-03-08 14:30', deadline: '2026-03-10'
    },
    {
        id: 'WO-20260307-02', sourceType: 'disease', diseaseId: 'BRG-202603-003',
        targetName: '露筋锈蚀(D-301)', bridge: '复兴大桥', component: '梁底',
        desc: '3#梁底露筋锈蚀紧急修复——除锈、涂阻锈剂、聚合物砂浆恢复保护层', type: '结构修复加固',
        status: 'processing', priority: 'High', assignedTo: '桥梁维修一队',
        createTime: '2026-03-07 16:20', deadline: '2026-03-09'
    },
    {
        id: 'WO-20260306-03', sourceType: 'disease', diseaseId: 'BRG-202603-004',
        targetName: '支座病害(D-401)', bridge: '复兴大桥', component: '支座',
        desc: '北塔3#板式橡胶支座剪切变形，顶升更换', type: '支座更换',
        status: 'completed', priority: 'Medium', assignedTo: '桥梁维修一队',
        createTime: '2026-03-06 09:00', deadline: '2026-03-12'
    },
    {
        id: 'WO-20260305-04', sourceType: 'disease', diseaseId: 'BRG-202603-002',
        targetName: '混凝土剥落(D-202)', bridge: '钱塘江大桥', component: '桥墩',
        desc: '2#桥墩东侧混凝土剥落——凿除松散部分，聚合物砂浆修补', type: '混凝土修补',
        status: 'pending', priority: 'Medium', assignedTo: '桥梁维修二队',
        createTime: '2026-03-05 11:00', deadline: '2026-03-11'
    },
    {
        id: 'WO-20260304-05', sourceType: 'disease', diseaseId: 'BRG-202603-005',
        targetName: '渗水泛碱(D-501)', bridge: '复兴大桥', component: '桥墩',
        desc: '5#桥墩底部渗水泛碱——排查防水层、疏通泄水孔', type: '防水修缮',
        status: 'completed', priority: 'Low', assignedTo: '排水维护组',
        createTime: '2026-03-04 08:30', deadline: '2026-03-08'
    },
];

// ============ 巡检任务详情 (用于数字孪生) ============

export const MOCK_TASKS = [
    { id: 'TASK-001', vehicle: '天鹰01号', type: '全量结构巡检', area: '复兴大桥全段', status: 'executing', progress: 65, battery: 72, speed: 18, mileageToday: 42, temperature: 18, issues: 4, startTime: '14:00', position: [120.1740, 30.2220] },
    { id: 'TASK-002', vehicle: '天鹰02号', type: '桥墩底部精细巡检', area: '钱塘江大桥 A2-B4', status: 'executing', progress: 82, battery: 58, speed: 12, mileageToday: 35, temperature: 19, issues: 6, startTime: '13:30', position: [120.1400, 30.2138] },
    { id: 'TASK-003', vehicle: '天鹰03号', type: '应力传感器校准巡检', area: '庆春桥', status: 'pending', progress: 0, battery: 100, speed: 0, mileageToday: 12, temperature: 20, issues: 0, startTime: '-', position: [120.1870, 30.2500] },
    { id: 'TASK-004', vehicle: '天鹰04号', type: '路面裂缝自动识别任务', area: '西兴大桥', status: 'completed', progress: 100, battery: 25, speed: 45, mileageToday: 88, temperature: 22, issues: 3, startTime: '10:00', position: [120.2060, 30.2190] },
];
