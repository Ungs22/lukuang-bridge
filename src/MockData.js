import { subDays, format } from 'date-fns';

// ============ 桥梁基础数据 ============

// 杭州真实桥梁列表
export const MOCK_BRIDGES = [
    { id: 'BRG-001', name: '复兴大桥', type: '斜拉桥', length: 1376, lanes: 6, buildYear: 2003, coord: [120.1850, 30.2300], healthScore: 82, sensors: { windSpeed: 4.5, stringTension: 1205, strain: 0.15, vibration: 0.8 } },
    { id: 'BRG-002', name: '钱塘江大桥', type: '双层桥', length: 1453, lanes: 4, buildYear: 1937, coord: [120.1580, 30.2250], healthScore: 68, sensors: { windSpeed: 5.2, stringTension: null, strain: 0.22, vibration: 1.2 } },
    { id: 'BRG-003', name: '之江大桥', type: '拱桥', length: 1724, lanes: 6, buildYear: 2012, coord: [120.0980, 30.2020], healthScore: 91, sensors: { windSpeed: 3.8, stringTension: null, strain: 0.08, vibration: 0.5 } },
    { id: 'BRG-004', name: '西兴大桥', type: '斜拉桥', length: 1855, lanes: 8, buildYear: 2007, coord: [120.2150, 30.2180], healthScore: 76, sensors: { windSpeed: 6.1, stringTension: 1180, strain: 0.18, vibration: 0.9 } },
    { id: 'BRG-005', name: '九堡大桥', type: '连续梁桥', length: 1855, lanes: 6, buildYear: 2012, coord: [120.2780, 30.2650], healthScore: 88, sensors: { windSpeed: 4.2, stringTension: null, strain: 0.11, vibration: 0.6 } },
    { id: 'BRG-006', name: '庆春路过江隧道', type: '隧道', length: 4180, lanes: 4, buildYear: 2010, coord: [120.1980, 30.2400], healthScore: 93, sensors: { windSpeed: 0.5, stringTension: null, strain: 0.05, vibration: 0.3 } },
];

// 桥梁结构部件
const BRIDGE_COMPONENTS = ['桥面板', '桥墩', '桥塔', '拉索', '伸缩缝', '防撞护栏', '支座', '梁底'];

// 病害类型定义（比赛核心）
export const DISEASE_TYPES = [
    { name: '混凝土裂缝', color: '#ef4444', icon: '🔴', enName: 'Concrete Crack' },
    { name: '剥落/掉块', color: '#f97316', icon: '🟠', enName: 'Spalling' },
    { name: '钢筋裸露', color: '#dc2626', icon: '🔻', enName: 'Exposed Rebar' },
    { name: '钢结构锈蚀', color: '#a855f7', icon: '🟣', enName: 'Steel Corrosion' },
    { name: '泛碱/渗水', color: '#3b82f6', icon: '🔵', enName: 'Efflorescence/Seepage' },
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
        position: [120.1860, 30.2305], altitude: 35,
        battery: 72, speed: 5.2, heading: 225,
        gimbalAngle: -45, temperature: 18,
        currentBridge: '复兴大桥',
        trajectory: [
            [120.1840, 30.2310], [120.1850, 30.2308],
            [120.1855, 30.2305], [120.1860, 30.2305],
        ],
        signal: { strength: 95, latency: 18 },
        camera: { resolution: '8K', fps: 30, zoom: 10 }
    },
    {
        id: 'UAV-002', name: '天鹰02号', model: 'DJI Matrice 350 RTK',
        status: 'flying', mode: '底部巡检',
        position: [120.1590, 30.2255], altitude: 15,
        battery: 88, speed: 3.5, heading: 90,
        gimbalAngle: -90, temperature: 17,
        currentBridge: '钱塘江大桥',
        trajectory: [
            [120.1570, 30.2258], [120.1575, 30.2256],
            [120.1580, 30.2255], [120.1590, 30.2255],
        ],
        signal: { strength: 88, latency: 22 },
        camera: { resolution: '4K', fps: 60, zoom: 20 }
    },
    {
        id: 'UAV-003', name: '天鹰03号', model: 'DJI Mavic 3 Enterprise',
        status: 'standby', mode: '待命',
        position: [120.2000, 30.2500], altitude: 0,
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
        position: [120.2160, 30.2190], altitude: 50,
        battery: 25, speed: 12.0, heading: 315,
        gimbalAngle: 0, temperature: 19,
        currentBridge: '西兴大桥',
        trajectory: [
            [120.2150, 30.2180], [120.2155, 30.2185],
            [120.2158, 30.2188], [120.2160, 30.2190],
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

        // 生成量化数据（比赛核心得分点）
        let quantification = {};
        switch (typeObj.name) {
            case '混凝土裂缝':
                quantification = {
                    length_m: getRandomFloat(0.1, 3.5),
                    max_width_mm: getRandomFloat(0.2, 8.0, 1),
                    depth_mm: getRandomFloat(1, 15, 1),
                };
                break;
            case '剥落/掉块':
                quantification = {
                    area_m2: getRandomFloat(0.01, 2.0),
                    depth_mm: getRandomFloat(5, 50, 0),
                };
                break;
            case '钢筋裸露':
                quantification = {
                    length_m: getRandomFloat(0.2, 1.5),
                    exposed_count: getRandomInt(1, 6),
                    corrosion_rate: getRandomFloat(0, 40, 0) + '%',
                };
                break;
            case '钢结构锈蚀':
                quantification = {
                    area_m2: getRandomFloat(0.05, 3.0),
                    rust_grade: getRandomItem(['A级', 'B级', 'C级', 'D级']),
                };
                break;
            case '泛碱/渗水':
                quantification = {
                    area_m2: getRandomFloat(0.1, 5.0),
                    moisture_level: getRandomItem(['轻微', '中等', '严重']),
                };
                break;
        }

        return {
            id: `BRG-2026${String(3).padStart(2, '0')}-${String(i + 1).padStart(3, '0')}`,
            bridgeId: bridge.id,
            bridgeName: bridge.name,
            component,
            type: typeObj.name,
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
            advice: typeObj.name === '混凝土裂缝' ? '建议注浆修复' :
                    typeObj.name === '剥落/掉块' ? '建议局部修补' :
                    typeObj.name === '钢筋裸露' ? '立即修复，防止结构性损伤' :
                    typeObj.name === '钢结构锈蚀' ? '除锈并涂刷防腐涂料' : '做好排水疏导，密封处理',
            imageUrl: typeObj.name === '混凝土裂缝' ? '/mock-bridges/image_01.jpg' :
                      typeObj.name === '钢筋裸露' || typeObj.name === '剥落/掉块' ? '/mock-bridges/image_02.jpg' :
                      typeObj.name === '钢结构锈蚀' ? '/mock-bridges/image_03.jpg' :
                      '/mock-bridges/image_04.jpg',
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
                    type: '混凝土裂缝',
                    severity: '重度',
                    confidence: 0.98,
                    component: '桥面板',
                    mask_polygon: generatePolygonMask(0.45, 0.52, 0.12, 0.04, 10),
                    bbox: [0.33, 0.48, 0.24, 0.08],
                    quantification: { length_m: 1.25, max_width_mm: 5.2, depth_mm: 8 },
                    advice: '建议重点关注并安排注浆修复',
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
                    type: '剥落/掉块',
                    severity: '中度',
                    confidence: 0.94,
                    component: '桥墩',
                    mask_polygon: generatePolygonMask(0.60, 0.55, 0.08, 0.10, 7),
                    bbox: [0.52, 0.45, 0.16, 0.20],
                    quantification: { area_m2: 0.35, depth_mm: 25 },
                    advice: '局部修补，防止扩大',
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
                    type: '钢筋裸露',
                    severity: '重度',
                    confidence: 0.96,
                    component: '梁底',
                    mask_polygon: generatePolygonMask(0.38, 0.58, 0.06, 0.15, 6),
                    bbox: [0.32, 0.43, 0.12, 0.30],
                    quantification: { length_m: 0.8, exposed_count: 3, corrosion_rate: '25%' },
                    advice: '立即修复，防止结构性损伤',
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
                    type: '钢结构锈蚀',
                    severity: '中度',
                    confidence: 0.91,
                    component: '拉索',
                    mask_polygon: generatePolygonMask(0.50, 0.35, 0.04, 0.20, 8),
                    bbox: [0.46, 0.15, 0.08, 0.40],
                    quantification: { area_m2: 0.45, rust_grade: 'C级' },
                    advice: '除锈并涂刷防腐涂料',
                    location: '复兴大桥 北塔S12拉索',
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
                    type: '泛碱/渗水',
                    severity: '轻度',
                    confidence: 0.88,
                    component: '桥墩',
                    mask_polygon: generatePolygonMask(0.55, 0.60, 0.10, 0.08, 9),
                    bbox: [0.45, 0.52, 0.20, 0.16],
                    quantification: { area_m2: 1.2, moisture_level: '中等' },
                    advice: '加强排水，密封处理',
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
                    type: '混凝土裂缝',
                    severity: '轻度',
                    confidence: 0.85,
                    component: '防撞护栏',
                    mask_polygon: generatePolygonMask(0.30, 0.45, 0.15, 0.03, 6),
                    bbox: [0.15, 0.42, 0.30, 0.06],
                    quantification: { length_m: 2.8, max_width_mm: 1.5, depth_mm: 3 },
                    advice: '监测观察，暂不处理',
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
                    type: '混凝土裂缝',
                    severity: '中度',
                    confidence: 0.92,
                    component: '桥面板',
                    mask_polygon: generatePolygonMask(0.65, 0.30, 0.08, 0.05, 8),
                    bbox: [0.57, 0.25, 0.16, 0.10],
                    quantification: { length_m: 1.5, max_width_mm: 3.2, depth_mm: 5 },
                    advice: '定期观测，考虑表面封闭',
                    location: '复兴大桥 南塔桥面 S5',
                    coords: [120.1856, 30.2312],
                    time: '14:30:15',
                },
                {
                    id: 'BRG-202603-008',
                    type: '泛碱/渗水',
                    severity: '轻度',
                    confidence: 0.89,
                    component: '桥面板',
                    mask_polygon: generatePolygonMask(0.70, 0.35, 0.12, 0.06, 7),
                    bbox: [0.58, 0.29, 0.24, 0.12],
                    quantification: { area_m2: 0.8, moisture_level: '轻微' },
                    advice: '检查桥面排水孔是否堵塞',
                    location: '复兴大桥 南塔桥面 S5',
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
                    type: '剥落/掉块',
                    severity: '重度',
                    confidence: 0.97,
                    component: '桥面板',
                    mask_polygon: generatePolygonMask(0.40, 0.70, 0.15, 0.12, 10),
                    bbox: [0.25, 0.58, 0.30, 0.24],
                    quantification: { area_m2: 1.5, depth_mm: 65 },
                    advice: '大面积剥落，需紧急修补',
                    location: '复兴大桥 4#桥墩 支座垫石上方',
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
        targetName: '混凝土裂缝', bridge: '复兴大桥', component: '桥面板',
        desc: '北塔桥面S3区域重度裂缝修复', type: '注浆修复',
        status: 'pending', priority: 'High', assignedTo: '桥梁维修一队',
        createTime: '2026-03-08 14:30', deadline: '2026-03-10'
    },
    {
        id: 'WO-20260307-02', sourceType: 'disease', diseaseId: 'BRG-202603-003',
        targetName: '钢筋裸露', bridge: '复兴大桥', component: '梁底',
        desc: '3#梁底钢筋裸露紧急修复', type: '结构加固',
        status: 'processing', priority: 'High', assignedTo: '桥梁维修一队',
        createTime: '2026-03-07 16:20', deadline: '2026-03-09'
    },
    {
        id: 'WO-20260306-03', sourceType: 'disease', diseaseId: 'BRG-202603-004',
        targetName: '钢结构锈蚀', bridge: '复兴大桥', component: '拉索',
        desc: '北塔S12拉索除锈防腐处理', type: '防腐处理',
        status: 'completed', priority: 'Medium', assignedTo: '钢结构维护组',
        createTime: '2026-03-06 09:00', deadline: '2026-03-12'
    },
    {
        id: 'WO-20260305-04', sourceType: 'disease', diseaseId: 'BRG-202603-002',
        targetName: '剥落/掉块', bridge: '钱塘江大桥', component: '桥墩',
        desc: '2#桥墩东侧混凝土剥落修补', type: '局部修补',
        status: 'pending', priority: 'Medium', assignedTo: '桥梁维修二队',
        createTime: '2026-03-05 11:00', deadline: '2026-03-11'
    },
    {
        id: 'WO-20260304-05', sourceType: 'disease', diseaseId: 'BRG-202603-005',
        targetName: '泛碱/渗水', bridge: '复兴大桥', component: '桥墩',
        desc: '5#桥墩底部排水系统修缮', type: '排水修缮',
        status: 'completed', priority: 'Low', assignedTo: '排水维护组',
        createTime: '2026-03-04 08:30', deadline: '2026-03-08'
    },
];

// ============ 巡检任务详情 (用于数字孪生) ============

export const MOCK_TASKS = [
    { id: 'TASK-001', vehicle: '天鹰01号', type: '全量结构巡检', area: '复兴大桥全段', status: 'executing', progress: 65, battery: 72, speed: 18, mileageToday: 42, temperature: 18, issues: 4, startTime: '14:00', position: [120.1860, 30.2305] },
    { id: 'TASK-002', vehicle: '天鹰02号', type: '桥墩底部精细巡检', area: '钱塘江大桥 A2-B4', status: 'executing', progress: 82, battery: 58, speed: 12, mileageToday: 35, temperature: 19, issues: 6, startTime: '13:30', position: [120.1590, 30.2255] },
    { id: 'TASK-003', vehicle: '天鹰03号', type: '应力传感器校准巡检', area: '之江大桥西侧', status: 'pending', progress: 0, battery: 100, speed: 0, mileageToday: 12, temperature: 20, issues: 0, startTime: '-', position: [120.2000, 30.2500] },
    { id: 'TASK-004', vehicle: '天鹰04号', type: '路面裂缝自动识别任务', area: '西兴大桥', status: 'completed', progress: 100, battery: 25, speed: 45, mileageToday: 88, temperature: 22, issues: 3, startTime: '10:00', position: [120.2160, 30.2190] },
];
