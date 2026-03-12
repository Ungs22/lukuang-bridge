import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard, Camera, AlertTriangle, Box, BarChart3, Map as MapIcon, Settings,
  Bell, User, Maximize, Search, RotateCcw, Filter, ChevronDown, ChevronRight, ChevronLeft, Menu, LogOut,
  MoreHorizontal, Plane, Activity
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell, PieChart, Pie
} from 'recharts';
import clsx from 'clsx';
import { DASHBOARD_STATS, MOCK_BRIDGES, MOCK_BRIDGE_DISEASES, MOCK_UAV_FLEET, MOCK_BRIDGE_WORK_ORDERS, MOCK_BRIDGE_INSPECTIONS } from './MockData';
import { Calendar, Clock, MapPin, Play, CheckCircle2, Plus, FileText, ClipboardList } from 'lucide-react';
import CityMapView from './views/CityMapView';
import WorkOrderView from './views/WorkOrderView';
import DiseaseLedgerView from './views/DiseaseLedgerView';
import AIInspectionCockpitView from './views/AIInspectionCockpitView';
import InspectionTaskView from './views/InspectionTaskView';
import AssetStatsView from './views/AssetStatsView';
import DiseaseReviewView from './views/DiseaseReviewView';
import DigitalCityView from './views/DigitalCityView';
import RoadRoutesView from './views/RoadRoutesView';
import AnalyticsView from './views/AnalyticsView';
import { Card } from './components/UIComponents';

// --- Sidebar & Navigation ---

const MENU_ITEMS = [
  { id: 'dashboard', label: '控制中枢', icon: LayoutDashboard },
  {
    id: 'inspection', label: '无人机巡检', icon: Plane,
    children: [
      { id: 'ai-cockpit', label: 'AI检测工作台' },
      { id: 'inspection-task', label: '航线调度系统' },
      { id: 'bridge-network', label: '全息桥网总览' },
      { id: 'inspection-map', label: '数字孪生地图' },
    ]
  },
  {
    id: 'disease', label: '病害及资产管理', icon: AlertTriangle,
    children: [
      { id: 'bridge-assets', label: '桥梁资产台账' },
      { id: 'disease-list', label: '结构体系台账' },
      { id: 'disease-review', label: 'AI人工复核中心' },
      { id: 'work-orders', label: '维修处置工单' },
    ]
  },
  { id: 'health-stats', label: '健康评估大屏', icon: Activity },
  { id: 'maintenance-analytics', label: '养护效能分析', icon: BarChart3 },
  { id: 'settings', label: '系统网络设置', icon: Settings },
];

const SidebarItem = ({ item, activeId, onNavigate, expandedItems, toggleExpand, isCollapsed, expandSidebar }) => {
  const Icon = item.icon;
  const hasChildren = item.children && item.children.length > 0;
  const isExpanded = expandedItems.includes(item.id);
  const isActive = activeId === item.id || (hasChildren && item.children.some(c => c.id === activeId));

  return (
    <div className="mb-1 relative group/item">
      <div
        className={clsx(
          "flex items-center py-3 cursor-pointer transition-colors duration-200",
          isCollapsed ? "justify-center px-2" : "px-4",
          isActive ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"
        )}
        onClick={() => {
          if (isCollapsed && hasChildren) {
            expandSidebar();
            toggleExpand(item.id);
            return;
          }

          if (hasChildren) {
            toggleExpand(item.id);
          } else {
            onNavigate(item.id);
          }
        }}
        title={isCollapsed ? item.label : ''}
      >
        <Icon size={20} className={clsx("flex-shrink-0", !isCollapsed && "mr-3")} />

        {!isCollapsed && (
          <>
            <span className="flex-1 text-[15px] font-medium transition-all duration-200 truncate">{item.label}</span>
            {hasChildren && (
              isExpanded ? <ChevronDown size={18} className="text-slate-400" /> : <ChevronRight size={18} className="text-slate-400" />
            )}
          </>
        )}
      </div>

      {/* Children */}
      {hasChildren && isExpanded && !isCollapsed && (
        <div className="bg-slate-950/30 my-1 space-y-0.5">
          {item.children.map(child => (
            <div
              key={child.id}
              className={clsx(
                "pl-12 py-2.5 text-sm cursor-pointer transition-all duration-200 rounded-r-full mr-4 border-l-2",
                activeId === child.id
                  ? "border-blue-500 bg-blue-500/10 text-blue-400 font-medium"
                  : "border-transparent text-slate-500 hover:text-slate-300 hover:border-slate-700"
              )}
              onClick={() => onNavigate(child.id)}
            >
              {child.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- Views ---

const DashboardView = ({ onNavigate }) => {
  const trendData = [
    { name: '00:00', count: 0 }, { name: '06:00', count: 1 },
    { name: '08:00', count: 3 }, { name: '10:00', count: 5 },
    { name: '12:00', count: 4 }, { name: '14:00', count: 6 },
    { name: '16:00', count: 3 }, { name: '18:00', count: 1 }
  ];

  const typeData = [
    { name: '混凝土裂缝', value: MOCK_BRIDGE_DISEASES.filter(d => d.type === '混凝土裂缝').length },
    { name: '剥落/掉块', value: MOCK_BRIDGE_DISEASES.filter(d => d.type === '剥落/掉块').length },
    { name: '钢筋裸露', value: MOCK_BRIDGE_DISEASES.filter(d => d.type === '钢筋裸露').length },
    { name: '钢结构锈蚀', value: MOCK_BRIDGE_DISEASES.filter(d => d.type === '钢结构锈蚀').length },
    { name: '泛碱/渗水', value: MOCK_BRIDGE_DISEASES.filter(d => d.type === '泛碱/渗水').length },
  ];

  const severityData = [
    { name: '严重', value: MOCK_BRIDGE_DISEASES.filter(d => d.severity === '重度').length },
    { name: '中度', value: MOCK_BRIDGE_DISEASES.filter(d => d.severity === '中度').length },
    { name: '轻度', value: MOCK_BRIDGE_DISEASES.filter(d => d.severity === '轻度').length },
  ];
  const SEVERITY_COLORS_LIST = ['#ef4444', '#f97316', '#eab308'];

  const inspectionStats = {
    total: MOCK_BRIDGE_INSPECTIONS.length,
    completed: MOCK_BRIDGE_INSPECTIONS.filter(t => t.status === 'completed').length,
    executing: MOCK_BRIDGE_INSPECTIONS.filter(t => t.status === 'executing').length,
    pending: MOCK_BRIDGE_INSPECTIONS.filter(t => t.status === 'pending').length,
  };

  const orderStats = {
    total: MOCK_BRIDGE_WORK_ORDERS.length,
    completed: MOCK_BRIDGE_WORK_ORDERS.filter(o => o.status === 'completed').length,
    processing: MOCK_BRIDGE_WORK_ORDERS.filter(o => o.status === 'processing').length,
    pending: MOCK_BRIDGE_WORK_ORDERS.filter(o => o.status === 'pending').length,
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">无人机桥梁巡检驾驶舱</h2>
        <div className="text-sm text-slate-500 flex items-center bg-white px-3 py-1 rounded-md shadow-sm border border-slate-200">
          <Clock size={16} className="mr-2 text-cyan-500" />
          上次更新: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {DASHBOARD_STATS.map((stat, idx) => (
          <Card key={idx} className="flex flex-col justify-between h-32 relative overflow-hidden group hover:shadow-lg transition-shadow duration-300">
            <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              {idx === 0 ? <Plane size={64} /> : idx === 1 ? <AlertTriangle size={64} /> : idx === 2 ? <ClipboardList size={64} /> : <BarChart3 size={64} />}
            </div>
            <div className="text-slate-500 text-sm font-medium">{stat.label}</div>
            <div className="flex items-end justify-between z-10">
              <div className="text-3xl font-bold text-slate-800">{stat.value}</div>
              <div className={clsx(
                "text-sm font-bold flex items-center px-2 py-1 rounded",
                stat.type === 'positive' ? 'bg-green-50 text-green-600' :
                  stat.type === 'negative' ? 'bg-red-50 text-red-600' : 'bg-cyan-50 text-cyan-600'
              )}>
                {stat.trend}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center">
              <BarChart3 size={20} className="mr-2 text-cyan-500" />
              无人机巡检病害发现趋势
            </h3>
            <div className="flex space-x-2 bg-slate-100 p-1 rounded-lg">
              <button className="px-3 py-1 text-xs bg-white text-cyan-600 shadow-sm rounded font-medium">今天</button>
              <button className="px-3 py-1 text-xs text-slate-500 hover:text-slate-700 rounded font-medium">本周</button>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="count" stroke="#06b6d4" fillOpacity={1} fill="url(#colorCount)" strokeWidth={2} name="发现病害数" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center">
            <AlertTriangle size={20} className="mr-2 text-orange-500" />
            病害严重程度占比
          </h3>
          <div className="h-64 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={severityData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={SEVERITY_COLORS_LIST[index % SEVERITY_COLORS_LIST.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none mb-4">
              <div className="text-2xl font-bold text-slate-800">{MOCK_BRIDGE_DISEASES.length}</div>
              <div className="text-xs text-slate-500">总数</div>
            </div>
          </div>
          <div className="flex justify-between mt-2 px-2 text-sm text-slate-600">
            {severityData.map((s, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className={clsx("font-bold", i === 0 ? "text-red-500" : i === 1 ? "text-orange-500" : "text-yellow-500")}>{s.value}</span>
                <span className="text-xs">{s.name}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        <Card className="flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
            <Calendar size={20} className="mr-2 text-indigo-500" />
            今日巡检任务
          </h3>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-indigo-50 p-2.5 rounded-lg border border-indigo-100 flex flex-col items-center">
              <div className="text-indigo-600 text-[10px] font-semibold mb-1">执行中</div>
              <div className="text-xl font-bold text-indigo-900">{inspectionStats.executing}</div>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex flex-col items-center">
              <div className="text-slate-500 text-[10px] font-semibold mb-1">待执行</div>
              <div className="text-xl font-bold text-slate-700">{inspectionStats.pending}</div>
            </div>
            <div className="bg-green-50 p-2.5 rounded-lg border border-green-100 flex flex-col items-center">
              <div className="text-green-600 text-[10px] font-semibold mb-1">已完成</div>
              <div className="text-xl font-bold text-green-900">{inspectionStats.completed}</div>
            </div>
          </div>
          <div className="space-y-3 flex-1 overflow-auto pr-1 custom-scrollbar">
            {MOCK_BRIDGE_INSPECTIONS.map(task => (
              <div key={task.id} className="flex justify-between items-center bg-slate-50 p-2 rounded border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => onNavigate('ai-cockpit')}>
                <div>
                  <div className="text-sm font-medium text-slate-700">{task.bridgeName}</div>
                  <div className="text-xs text-slate-500">{task.uav} · 发现{task.diseases}处病害</div>
                </div>
                <span className={clsx("text-xs px-2 py-1 rounded",
                  task.status === 'completed' ? "bg-green-100 text-green-700" :
                  task.status === 'executing' ? "bg-indigo-100 text-indigo-700" : "bg-slate-200 text-slate-600")}>
                  {task.status === 'completed' ? '已完成' : task.status === 'executing' ? '执行中' : '待执行'}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center justify-between">
            <div className="flex items-center">
              <ClipboardList size={20} className="mr-2 text-teal-500" />
              维修工单概况
            </div>
            <button className="text-xs text-slate-400 hover:text-cyan-500" onClick={() => onNavigate('work-orders')}>查看更多</button>
          </h3>
          <div className="flex space-x-3 mb-4">
            <div className="flex-1 bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-xl p-3 flex flex-col items-center">
              <div className="text-xs text-slate-500 mb-1">待处理</div>
              <div className="font-bold text-slate-800 text-xl">{orderStats.pending}</div>
            </div>
            <div className="flex-1 bg-gradient-to-br from-cyan-50 to-cyan-100 border border-cyan-200 rounded-xl p-3 flex flex-col items-center">
              <div className="text-xs text-cyan-600 mb-1">处理中</div>
              <div className="font-bold text-cyan-700 text-xl">{orderStats.processing}</div>
            </div>
            <div className="flex-1 bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-3 flex flex-col items-center">
              <div className="text-xs text-green-600 mb-1">已闭环</div>
              <div className="font-bold text-green-700 text-xl">{orderStats.completed}</div>
            </div>
          </div>
          <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar">
            {MOCK_BRIDGE_WORK_ORDERS.slice(0, 3).map(order => (
              <div key={order.id} className="group flex flex-col p-3 bg-white rounded-lg border border-slate-100 hover:border-cyan-300 hover:shadow-md transition-all cursor-pointer"
                onClick={() => onNavigate('work-orders')}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-2">
                    <span className={clsx("px-2 py-0.5 text-[10px] font-bold rounded border",
                      order.priority === 'High' ? "bg-red-50 text-red-600 border-red-100" :
                      order.priority === 'Medium' ? "bg-orange-50 text-orange-600 border-orange-100" :
                      "bg-cyan-50 text-cyan-600 border-cyan-100")}>
                      {order.priority === 'High' ? '紧急' : order.priority === 'Medium' ? '普通' : '低'}
                    </span>
                    <span className="font-bold text-slate-800 text-sm truncate">{order.bridge}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{order.createTime.split(' ')[0]}</span>
                </div>
                <div className="text-xs text-slate-600 mb-2 pl-1 line-clamp-1 border-l-2 border-slate-200">{order.desc}</div>
                <div className="flex justify-between items-center text-[10px] text-slate-500">
                  <span className="bg-slate-100 px-1.5 py-0.5 rounded">{order.type}</span>
                  <span className={clsx("font-bold", order.status === 'completed' ? "text-green-600" : order.status === 'processing' ? "text-cyan-600" : "text-slate-400")}>
                    {order.status === 'completed' ? '已完成' : order.status === 'processing' ? '处理中' : '待接单'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center">
            <Box size={20} className="mr-2 text-purple-600" />
            桥梁病害类型分布
          </h3>
          <div className="space-y-4 mb-6 flex-1">
            {typeData.map((item, index) => {
              const colors = [
                { bg: 'bg-red-500', bgLight: 'bg-red-50', text: 'text-red-600' },
                { bg: 'bg-orange-500', bgLight: 'bg-orange-50', text: 'text-orange-600' },
                { bg: 'bg-rose-600', bgLight: 'bg-rose-50', text: 'text-rose-600' },
                { bg: 'bg-purple-500', bgLight: 'bg-purple-50', text: 'text-purple-600' },
                { bg: 'bg-blue-500', bgLight: 'bg-blue-50', text: 'text-blue-600' },
              ][index % 5];
              const maxVal = Math.max(...typeData.map(d => d.value)) * 1.25;
              const percent = (item.value / maxVal) * 100;
              return (
                <div key={index} className="flex items-center group">
                  <div className={clsx("w-8 h-8 rounded-lg flex items-center justify-center mr-3", colors.bgLight)}>
                    <div className={clsx("text-xs font-bold", colors.text)}>{index + 1}</div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-sm font-bold text-slate-700">{item.name}</span>
                      <span className="text-sm font-bold text-slate-800">{item.value} <span className="text-xs text-slate-400 font-normal">处</span></span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={clsx("h-full rounded-full transition-all duration-500", colors.bg)} style={{ width: `${percent}%` }}></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-auto pt-4 border-t border-slate-100">
            <div className="p-2.5 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg border border-cyan-100/50 flex items-start">
              <span className="text-lg mr-2 leading-none">🔍</span>
              <div className="text-xs text-cyan-800 leading-relaxed">
                <span className="font-bold">AI 分析建议:</span> 混凝土裂缝为当前最高频病害，建议对 <span className="font-medium underline decoration-cyan-300">复兴大桥</span> 桥面板区域安排专项深度巡检。
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom Alerts & Sensor Data Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center">
              <Bell size={20} className="mr-2 text-red-500" />
              最新桥梁告警
            </h3>
            <button className="text-cyan-500 text-sm hover:underline" onClick={() => onNavigate('disease-list')}>查看全部</button>
          </div>
          <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-1">
            {[
              { id: 1, title: '复兴大桥 北塔桥面发现重度混凝土裂缝', time: '14:02:30', reporter: '天鹰01号 (UAV-001)', type: 'AI自动识别', level: '严重', status: '待处理' },
              { id: 2, title: '钱塘江大桥 2#桥墩发现钢筋裸露', time: '13:45:12', reporter: '天鹰02号 (UAV-002)', type: 'AI自动识别', level: '紧急', status: '待处理' },
              { id: 3, title: '西兴大桥 拉索区域检测到钢结构锈蚀', time: '11:30:00', reporter: '天鹰04号 (UAV-004)', type: 'AI自动识别', level: '一般', status: '已上报' }
            ].map(alert => (
              <div key={alert.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100 hover:bg-slate-100 hover:border-cyan-200 transition-all cursor-pointer group shadow-sm"
                onClick={() => onNavigate('disease-list')}>
                <div className="flex items-center space-x-3">
                  <div className={clsx("p-2 rounded-lg transition-colors",
                    alert.level === '严重' || alert.level === '紧急' ? "bg-red-100 text-red-600 group-hover:bg-red-200" : "bg-orange-100 text-orange-600 group-hover:bg-orange-200")}>
                    <AlertTriangle size={18} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-800">{alert.title}</div>
                    <div className="text-xs text-slate-500 flex items-center mt-0.5"><Clock size={12} className="mr-1" /> 2026-03-08 {alert.time}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right hidden sm:block">
                    <div className="text-xs font-semibold text-slate-700">{alert.type}</div>
                    <div className="text-xs text-slate-500">{alert.reporter}</div>
                  </div>
                  <span className={clsx("text-xs px-2 py-1 rounded border",
                    alert.status === '待处理' ? "bg-red-100 text-red-600 border-red-200" : "bg-orange-100 text-orange-600 border-orange-200")}>{alert.status}</span>
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-cyan-500 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Structural Health Monitoring Component */}
        <Card className="flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
            <Activity size={20} className="mr-2 text-green-500" />
            结构健康实时传感
          </h3>
          <div className="flex-1 flex flex-col justify-between space-y-3">
            <div className="p-3 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute right-0 top-0 pt-2 pr-2 opacity-10"><Activity size={40} /></div>
                <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">复兴大桥 - 阵风风速</span>
                    <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold">正常</span>
                </div>
                <div className="flex items-end mb-2">
                    <span className="text-2xl font-extrabold text-slate-800 font-mono">4.5</span>
                    <span className="text-xs text-slate-500 ml-1 mb-1 font-medium">m/s</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: '30%' }}></div>
                </div>
            </div>
            
            <div className="p-3 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute right-0 top-0 pt-2 pr-2 opacity-10"><Activity size={40} /></div>
                <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">主跨中段 - 应变力</span>
                    <span className="text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded font-bold">波动</span>
                </div>
                <div className="flex items-end mb-2">
                    <span className="text-2xl font-extrabold text-slate-800 font-mono">0.15</span>
                    <span className="text-xs text-slate-500 ml-1 mb-1 font-medium">με</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full" style={{ width: '65%' }}></div>
                </div>
            </div>

            <div className="p-3 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute right-0 top-0 pt-2 pr-2 opacity-10"><Activity size={40} /></div>
                <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">北塔 S12 - 索力偏差</span>
                    <span className="text-[10px] bg-cyan-100 text-cyan-700 px-1.5 py-0.5 rounded font-bold">极佳</span>
                </div>
                <div className="flex items-end mb-2">
                    <span className="text-2xl font-extrabold text-slate-800 font-mono">+1.2</span>
                    <span className="text-xs text-slate-500 ml-1 mb-1 font-medium">%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-500 rounded-full" style={{ width: '25%' }}></div>
                </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

// --- Main Layout ---

function App() {
  const [routeState, setRouteState] = useState({ id: 'dashboard', params: {} });
  const [expandedItems, setExpandedItems] = useState(['inspection']);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const navigateTo = (id, params = {}) => {
    setRouteState({ id, params });
  };

  const toggleExpand = (id) => {
    setExpandedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const renderContent = () => {
    switch (routeState.id) {
      case 'dashboard': return <DashboardView onNavigate={navigateTo} />;
      case 'inspection-map': return <CityMapView defaultMode="inspection" onNavigate={navigateTo} />;
      case 'ai-cockpit': return <AIInspectionCockpitView onNavigate={navigateTo} />;
      case 'inspection-task': return <InspectionTaskView onNavigate={navigateTo} />;
      case 'disease-list': return <DiseaseLedgerView onNavigate={navigateTo} />;
      case 'disease-review': return <DiseaseReviewView onNavigate={navigateTo} />;
      case 'bridge-network': return <DigitalCityView onNavigate={navigateTo} />;
      case 'bridge-assets': return <RoadRoutesView onNavigate={navigateTo} />;
      case 'maintenance-analytics': return <AnalyticsView onNavigate={navigateTo} />;
      case 'work-orders': {
          const target = routeState.params?.initialTarget || routeState.params?.initialDisease;
          return <WorkOrderView initialTarget={target} sourceType={routeState.params?.sourceType || 'disease'} />;
      }
      case 'health-stats': return <AssetStatsView onNavigate={navigateTo} />;
      default: return <DashboardView onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside
        className={clsx(
          "bg-slate-900 flex-shrink-0 flex flex-col transition-all duration-300 relative",
          isSidebarCollapsed ? "w-20" : "w-64"
        )}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center overflow-hidden">
            <div className="w-8 h-8 bg-cyan-600 rounded flex-shrink-0 flex items-center justify-center mr-3">
              <Plane className="text-white" size={20} />
            </div>
            {!isSidebarCollapsed && (
              <span className="text-white font-bold text-lg tracking-tight whitespace-nowrap">桥视·智检</span>
            )}
          </div>

          {!isSidebarCollapsed && (
            <button
              onClick={() => setIsSidebarCollapsed(true)}
              className="text-slate-500 hover:text-white transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
          )}
        </div>

        {isSidebarCollapsed && (
          <button
            onClick={() => setIsSidebarCollapsed(false)}
            className="h-8 w-full flex items-center justify-center text-slate-500 hover:text-white hover:bg-slate-800 transition-colors my-2"
          >
            <ChevronRight size={18} />
          </button>
        )}

        <div className="flex-1 overflow-y-auto py-4 custom-scrollbar overflow-x-hidden">
          {MENU_ITEMS.map(item => (
            <SidebarItem
              key={item.id}
              item={item}
              activeId={routeState.id}
              onNavigate={navigateTo}
              expandedItems={expandedItems}
              toggleExpand={toggleExpand}
              isCollapsed={isSidebarCollapsed}
              expandSidebar={() => setIsSidebarCollapsed(false)}
            />
          ))}
        </div>

        <div className="p-4 border-t border-slate-800">
          <div className={clsx("flex items-center text-slate-400 text-sm", isSidebarCollapsed && "justify-center")}>
            <div className="w-8 h-8 rounded-full bg-slate-700 flex-shrink-0 flex items-center justify-center mr-3">
              <User size={16} />
            </div>
            {!isSidebarCollapsed && (
              <div className="flex-1 overflow-hidden">
                <div className="text-white font-medium truncate">管理员</div>
                <div className="text-xs truncate">admin@bridge.gov.cn</div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-slate-900 shadow-sm z-10 flex items-center justify-between px-6 border-b border-slate-800 text-white">
          <div className="flex items-center">
            <button className="mr-4 lg:hidden text-slate-400 hover:text-white">
              <Menu size={24} />
            </button>
            <h1 className="text-lg font-medium text-slate-200">低空无人机桥梁病害智能检测平台</h1>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-slate-900"></span>
            </button>
            <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors">
              <Maximize size={20} />
            </button>
            <div className="h-6 w-px bg-slate-700 mx-2"></div>
            <button className="flex items-center text-slate-400 hover:text-white transition-colors">
              <LogOut size={18} className="mr-2" />
              <span className="text-sm">退出</span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto bg-slate-100 relative">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;
