# CLAUDE.md - 路框 SaaS 项目指南

> **重要**：本项目为中文项目，请始终使用**简体中文**回答问题和编写注释。

## 🖥️ 运行环境

- **操作系统**：Windows 10/11
- **Shell**：PowerShell（注意与 Linux/macOS 的命令差异）
- **Node.js**：18+ 版本
- **包管理器**：npm

## 🎯 项目概述

**AI道路智能巡检养护平台** (Lukuang SaaS) 是一个高保真的政府级 GIS 系统原型。项目模拟无人驾驶巡检车采集道路病害数据，实现从"被动修补"到"智慧预养"的道路养护管理升级。

### 核心业务模块
- **驾驶舱 (Dashboard)**：数字城市总览、实时监控
- **AI 巡检 (AI Inspection)**：巡检地图、AI识别驾驶舱、实时视频
- **病害管理 (Disease Mgmt)**：病害台账、工单管理
- **资产盘点 (Asset Inventory)**：道路设施资产管理
- **统计分析 (Analytics)**：病害报表、养护绩效

## 🛠 技术栈

| 类别 | 技术 | 说明 |
|------|------|------|
| **框架** | React 19 + Vite 7 | 函数式组件 + Hooks |
| **样式** | Tailwind CSS 3.4 | 深色侧边栏 + 浅色内容区布局 |
| **图标** | Lucide React | 统一图标库 |
| **图表** | Recharts | 数据可视化 |
| **地图** | 高德地图 Loca 2.0 | GIS 可视化引擎 |
| **日期** | date-fns | 日期处理 |

## ⚡ 常用命令

```powershell
# 安装依赖
npm install

# 启动开发服务器 (默认 http://localhost:5173)
npm run dev

# 生产构建 (输出到 dist/ 目录)
npm run build

# 代码检查
npm run lint

# 预览生产版本
npm run preview

# GeoJSON 数据处理（坐标转换 + 抽稀）
node scripts/process_geojson.js
```

### Windows 命令注意事项
- 路径分隔符使用 `\` 或 `/`（Node.js 支持两者）
- 环境变量使用 `$env:VAR_NAME` 而非 `$VAR_NAME`
- 如需查找文件，使用 `Get-ChildItem -Recurse` 代替 `find`

## 📁 项目结构

```
lukuang-saas/
├── src/
│   ├── App.jsx           # 主入口，路由与布局管理
│   ├── MockData.js       # 模拟数据（病害、资产、巡检记录）
│   ├── components/       # 可复用组件
│   ├── views/            # 页面视图
│   │   ├── DigitalCityView.jsx      # 数字城市大屏
│   │   ├── AIInspectionCockpitView.jsx  # AI巡检驾驶舱
│   │   ├── InspectionMapView.jsx    # 巡检地图
│   │   └── ...
│   └── data/
│       └── cachedRoadPaths.json  # 预处理的杭州道路数据
├── scripts/
│   └── process_geojson.js  # GeoJSON 数据处理脚本
├── 开发指南.md             # 详细的开发需求文档
├── AI—智能巡检车功能亮点介绍.md  # 产品功能说明
└── 项目计划书.md           # 项目规划文档
```

## 🎨 设计规范

### 配色方案
- **侧边栏/Header**：深邃蓝黑 `#0f172a` (Slate-900)
- **内容区背景**：灰白 `#f1f5f9` (Slate-100)
- **卡片**：纯白 `#ffffff` + 细微阴影
- **主操作按钮**：科技蓝 `#3b82f6` (Blue-500)
- **告警/病害**：告警橙 `#f97316` (Orange-500)

### 布局规范
- 左侧固定侧边栏：260px
- 顶部通栏：64px
- 内容区域：动态填充

## 📝 编码规范

1. **组件风格**：使用函数式组件 + React Hooks
2. **样式方案**：全部使用 Tailwind CSS classes，避免额外 CSS 文件
3. **数据模拟**：所有数据使用 `MockData.js` 中的仿真数据
4. **地名真实性**：模拟数据使用杭州真实地名（如：湖滨中路、延安路等）
5. **中文界面**：所有界面文字、按钮、提示信息使用中文

## 🔧 开发工作流

1. **探索**：使用 `grep` 或浏览文件定位相关代码
2. **计划**：简要列出修改步骤
3. **执行**：
   - 进行代码修改
   - 立即运行 `npm run dev` 验证
   - 如有错误，分析并修复，最多重试 3 次
4. **检查**：确保无调试代码残留

## 📋 常见任务指引

### 添加新页面
1. 在 `src/views/` 创建新的 `.jsx` 文件
2. 在 `App.jsx` 中添加路由和侧边栏菜单项
3. 如需模拟数据，在 `MockData.js` 中添加

### 修改地图功能
- 地图组件使用高德 Loca 2.0 引擎
- 相关视图：`DigitalCityView.jsx`、`InspectionMapView.jsx`
- 道路数据来源：`src/data/cachedRoadPaths.json`

### 修改病害/巡检数据
- 所有模拟数据集中在 `MockData.js`
- 数据结构包括：病害记录、资产列表、巡检任务等

## � 注意事项

- **禁止删除**：未经确认不要删除任何文件
- **忽略目录**：不要读取 `node_modules`、`.git`
- **大文件警告**：`hangzhouv2.geojson` 约 20MB，避免直接读取
- **地图 Key**：高德地图 API 已配置，无需额外设置

## 📚 渐进式文档引用

当需要更详细的信息时，请主动阅读以下文档：
- `开发指南.md` - 查阅完整的 UI/UX 设计规范和功能需求
- `AI—智能巡检车功能亮点介绍.md` - 了解产品功能和业务逻辑
- `巡检页面V2.md` - AI巡检驾驶舱的详细设计文档
- `项目计划书.md` - 项目整体规划和里程碑