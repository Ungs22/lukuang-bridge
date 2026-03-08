# 路框 SaaS (Lukuang SaaS) - 项目说明

## ️ GeoData 数据转换工具说明

本项目包含一个专门用于处理地理空间数据的脚本工具，位于 `scripts/process_geojson.js`。即使面对数万条道路数据，也能保证前端页面的极致流畅。

### 1. 工具作用
该脚本主要用于将原始的地理信息数据（OpenStreetMap）转换为前端可视化组件（DigitalCityView）所需的优化数据格式。核心功能如下：

*   **🌐 坐标系纠偏 (WGS84 -> GCJ-02)**
    *   将国际通用的 WGS84 坐标系转换为高德地图/国内通用的 GCJ-02（火星坐标系），解决地图叠加时的偏移问题。
*   **📐 几何抽稀 (Geometry Simplification)**
    *   内置 **Douglas-Peucker (道格拉斯-普克)** 算法。
    *   对复杂的道路折线进行智能降维，剔除视觉上不可见的冗余节点。
    *   **效果**：在不改变道路形状的前提下，减少 40%-60% 的渲染顶点，极大降低显卡负载，实现丝滑的缩放和漫游体验。
*   **🏥 模拟数据生成 (Mock Data Generation)**
    *   自动为每条道路生成模拟的生命体征数据：**RQI (道路路面行驶质量指数)**。
    *   按照加权概率分配状态：优秀 (60%)、良好 (25%)、中度 (10%)、严重 (5%)，用于演示交通健康度热力图。

### 2. 使用方法

确保您的开发环境中已安装 Node.js。

1.  将原始 GeoJSON 文件（例如 `hangzhouv2.geojson`）放置在项目根目录。
2.  如果不使用默认文件名，请修改 `scripts/process_geojson.js` 中的 `INPUT_FILE` 常量。
3.  在终端执行以下命令：

```bash
node "scripts/process_geojson.js"
```

### 3. 输入输出说明

| 类型 | 文件路径 | 描述 |
| :--- | :--- | :--- |
| **输入 (Input)** | `./hangzhouv2.geojson` | 原始 OpenStreetMap 导出的 GeoJSON 格式道路数据。 |
| **输出 (Output)** | `./src/data/cachedRoadPaths.json` | 处理后的 JSON 文件，包含转换后的坐标、健康分和简化后的几何路径。直接被前端组件引用。 |

### 4. 前端应用

生成的 `cachedRoadPaths.json` 数据被 `src/views/DigitalCityView.jsx` 组件使用。该页面采用 **高德 Loca 2.0 数据可视化引擎** 进行渲染，结合对 `LineLayer` (线条层) 和 `LabelsLayer` (标注层) 的 LOD (多细节层次) 控制，实现了高性能的数字城市大屏展示。
