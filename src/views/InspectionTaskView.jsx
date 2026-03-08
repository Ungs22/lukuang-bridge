import React, { useState, useEffect } from 'react';
import {
    Calendar, Clock, MapPin, Play, CheckCircle2, MoreVertical, Plus,
    Trash2, Eye, Truck, AlertCircle
} from 'lucide-react';
import clsx from 'clsx';
import { MOCK_TASKS } from '../MockData';
import { Card, Badge } from '../components/UIComponents';
import potholeImg from '../assets/pothole_mock.jpg';

const InspectionTaskView = () => {
    const [tasks, setTasks] = useState([]);
    const [filterStatus, setFilterStatus] = useState('all'); // all, pending, executing, completed
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [detailTask, setDetailTask] = useState(null);

    // Form State
    const [newTask, setNewTask] = useState({ type: '日常网格巡逻', area: '', vehicle: '自动调度' });

    useEffect(() => {
        setTasks(MOCK_TASKS);
    }, []);

    // --- Actions ---

    const handleCreateTask = () => {
        const t = {
            id: `T2025${Math.floor(Math.random() * 10000)}`,
            ...newTask,
            status: 'pending',
            progress: 0,
            startTime: '-',
            issues: 0,
            vehicle: newTask.vehicle === '自动调度' ? 'XC-Pending' : newTask.vehicle
        };
        setTasks([t, ...tasks]);
        setIsCreateModalOpen(false);
        setNewTask({ type: '日常网格巡逻', area: '', vehicle: '自动调度' }); // Reset
    };

    const handleDeleteTask = (id) => {
        if (confirm('确认删除该任务吗？')) {
            setTasks(tasks.filter(t => t.id !== id));
        }
    };

    const handleUpdateStatus = (id, newStatus) => {
        setTasks(tasks.map(t => {
            if (t.id === id) {
                return {
                    ...t,
                    status: newStatus,
                    startTime: newStatus === 'executing' ? new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : t.startTime,
                    progress: newStatus === 'completed' ? 100 : t.progress
                };
            }
            return t;
        }));
    };

    // --- Helpers ---

    const getStatusColor = (status) => {
        switch (status) {
            case 'executing': return 'bg-blue-100 text-blue-700';
            case 'completed': return 'bg-green-100 text-green-700';
            case 'pending': return 'bg-orange-100 text-orange-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'executing': return '执行中';
            case 'completed': return '已完成';
            case 'pending': return '待执行';
            default: return status;
        }
    };

    const filteredTasks = filterStatus === 'all' ? tasks : tasks.filter(t => t.status === filterStatus);

    const stats = {
        executing: tasks.filter(t => t.status === 'executing').length,
        pending: tasks.filter(t => t.status === 'pending').length,
        completed: tasks.filter(t => t.status === 'completed').length,
    };

    return (
        <div className="p-6 space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">巡检任务管理</h2>
                    <p className="text-slate-500 text-sm mt-1">全周期管理网格巡逻与应急核查任务</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 active:scale-95 flex items-center font-medium transition-all"
                >
                    <Plus size={18} className="mr-2" />
                    新建任务
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="flex items-center justify-between border-l-4 border-l-blue-500">
                    <div>
                        <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">执行中</div>
                        <div className="text-2xl font-bold text-slate-800 mt-1">{stats.executing}</div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-full text-blue-600"><Play size={24} /></div>
                </Card>
                <Card className="flex items-center justify-between border-l-4 border-l-orange-500">
                    <div>
                        <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">待执行</div>
                        <div className="text-2xl font-bold text-slate-800 mt-1">{stats.pending}</div>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-full text-orange-600"><Clock size={24} /></div>
                </Card>
                <Card className="flex items-center justify-between border-l-4 border-l-green-500">
                    <div>
                        <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">已完成</div>
                        <div className="text-2xl font-bold text-slate-800 mt-1">{stats.completed}</div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-full text-green-600"><CheckCircle2 size={24} /></div>
                </Card>
            </div>

            {/* Filter Tabs */}
            <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg w-fit">
                {['all', 'executing', 'pending', 'completed'].map(status => (
                    <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={clsx(
                            "px-4 py-1.5 text-sm font-medium rounded-md transition-all",
                            filterStatus === status ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
                        )}
                    >
                        {status === 'all' ? '全部' : getStatusLabel(status)}
                    </button>
                ))}
            </div>

            {/* Task List */}
            <div className="grid gap-4">
                {filteredTasks.length === 0 && (
                    <div className="text-center py-10 text-slate-400">暂无相关任务</div>
                )}
                {filteredTasks.map(task => (
                    <div key={task.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all group grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                        {/* Left Info */}
                        <div className="flex items-start gap-4 md:col-span-6">
                            <div className={clsx("p-3 rounded-xl shrink-0", task.type.includes('应急') ? "bg-red-50 text-red-500" : "bg-blue-50 text-blue-500")}>
                                <div className="font-bold text-xs text-center leading-tight">
                                    {task.type.includes('应急') ? '应急' : '日常'}
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-bold text-slate-800 text-lg">{task.area}</h3>
                                    <span className={clsx("px-2 py-0.5 rounded text-[10px] font-bold uppercase", getStatusColor(task.status))}>
                                        {getStatusLabel(task.status)}
                                    </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                                    <span className="flex items-center"><span className="font-mono bg-slate-100 px-1 rounded mr-1 text-xs">ID</span> {task.id}</span>
                                    <span className="flex items-center"><Truck size={14} className="mr-1" /> {task.vehicle}</span>
                                    <span className="flex items-center"><Clock size={14} className="mr-1" /> {task.startTime}</span>
                                </div>
                            </div>
                        </div>

                        {/* Middle Progress */}
                        <div className="min-w-[150px] flex flex-col justify-center md:col-span-3">
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-slate-400">任务进度</span>
                                <span className={clsx("font-bold", task.status === 'pending' ? "text-slate-400" : "text-blue-600")}>
                                    {task.status === 'pending' ? '待启动' : `${task.progress}%`}
                                </span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-500 transition-all duration-500"
                                    style={{ width: task.status === 'pending' ? '0%' : `${task.progress}%` }}
                                ></div>
                            </div>
                            <div className="mt-1 text-xs h-4 flex items-center text-orange-600">
                                {task.issues > 0 && (
                                    <>
                                        <AlertCircle size={10} className="mr-1" />
                                        <span>发现 {task.issues} 处病害</span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-2 justify-self-end md:col-span-3">
                            {task.status === 'pending' && (
                                <button
                                    onClick={() => handleUpdateStatus(task.id, 'executing')}
                                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors flex items-center"
                                >
                                    <Play size={14} className="mr-1" /> 开始
                                </button>
                            )}
                            {task.status === 'executing' && (
                                <button
                                    onClick={() => handleUpdateStatus(task.id, 'completed')}
                                    className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors flex items-center"
                                >
                                    <CheckCircle2 size={14} className="mr-1" /> 完成
                                </button>
                            )}
                            <button
                                onClick={() => setDetailTask(task)}
                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="查看详情"
                            >
                                <Eye size={18} />
                            </button>
                            <button
                                onClick={() => handleDeleteTask(task.id)}
                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="删除任务"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create Task Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-slate-800">新建巡检任务</h3>
                            <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600">×</button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">任务类型</label>
                                <select
                                    className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    value={newTask.type}
                                    onChange={(e) => setNewTask({ ...newTask, type: e.target.value })}
                                >
                                    <option value="日常网格巡逻">日常网格巡逻</option>
                                    <option value="应急点对点核查">应急点对点核查</option>
                                    <option value="专项设施排查">专项设施排查</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">巡检区域/路线</label>
                                <input
                                    type="text"
                                    className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="例如：莫干山路 K0-K5"
                                    value={newTask.area}
                                    onChange={(e) => setNewTask({ ...newTask, area: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">指派车辆</label>
                                <select
                                    className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={newTask.vehicle}
                                    onChange={(e) => setNewTask({ ...newTask, vehicle: e.target.value })}
                                >
                                    <option value="自动调度">自动调度</option>
                                    <option value="XC-001 (无人)">XC-001 (无人)</option>
                                    <option value="XC-002 (有人)">XC-002 (有人)</option>
                                    <option value="XC-003 (无人)">XC-003 (无人)</option>
                                </select>
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 rounded-b-xl">
                            <button onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors">取消</button>
                            <button
                                onClick={handleCreateTask}
                                disabled={!newTask.area}
                                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                立即分派
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Task Detail Modal */}
            {detailTask && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
                        <div className="h-32 bg-slate-800 p-6 flex flex-col justify-end text-white relative">
                            <div className="absolute top-4 right-4 text-white/50 hover:text-white cursor-pointer" onClick={() => setDetailTask(null)}>×</div>
                            <h2 className="text-2xl font-bold">{detailTask.id}</h2>
                            <p className="opacity-80">{detailTask.type} | {detailTask.area}</p>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="p-3 bg-slate-50 rounded-lg">
                                    <div className="text-xs text-slate-500">车辆状态</div>
                                    <div className="font-bold text-slate-800">{detailTask.status === 'executing' ? '🟢 巡检中' : '⚪️ 待机/完成'}</div>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-lg">
                                    <div className="text-xs text-slate-500">发现病害</div>
                                    <div className="font-bold text-orange-600">{detailTask.issues} 处</div>
                                </div>
                            </div>

                            <h4 className="font-bold text-slate-700 mb-3 text-sm">任务日志</h4>
                            <div className="space-y-6 pl-2 border-l-2 border-slate-100 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {detailTask.status === 'pending' && <p className="text-sm text-slate-400 pl-4">任务尚未开始...</p>}
                                {(detailTask.status === 'executing' || detailTask.status === 'completed') && (
                                    <>
                                        {/* Start Event */}
                                        <div className="relative pl-6">
                                            <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-white shadow-sm"></div>
                                            <div className="text-xs text-slate-400 font-mono mb-0.5">09:00:00</div>
                                            <div className="text-sm text-slate-700">车辆 XC-001 启动任务，驶入 {detailTask.area}</div>
                                        </div>

                                        {/* Detection Event 1 */}
                                        <div className="relative pl-6">
                                            <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-orange-500 ring-4 ring-white shadow-sm"></div>
                                            <div className="text-xs text-slate-400 font-mono mb-0.5">09:01:23</div>
                                            <div className="text-sm text-slate-700 font-bold mb-2">
                                                智能识别到 <span className="text-orange-600">网状裂缝</span> (置信度 92%)
                                            </div>
                                            <div className="relative group rounded-lg overflow-hidden border border-slate-200 w-40 cursor-pointer hover:shadow-md transition-all">
                                                <img src={potholeImg} alt="Crack Detection" className="w-full h-24 object-cover" />
                                                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] p-1 px-2">
                                                    K2+100 左侧车道
                                                </div>
                                            </div>
                                        </div>

                                        {/* Detection Event 2 */}
                                        <div className="relative pl-6">
                                            <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-red-500 ring-4 ring-white shadow-sm"></div>
                                            <div className="text-xs text-slate-400 font-mono mb-0.5">09:27:15</div>
                                            <div className="text-sm text-slate-700 font-bold mb-2">
                                                智能识别到 <span className="text-red-600">严重坑槽</span> (置信度 98%)
                                            </div>
                                            <div className="relative group rounded-lg overflow-hidden border border-slate-200 w-40 cursor-pointer hover:shadow-md transition-all">
                                                <img src={potholeImg} alt="Pothole Detection" className="w-full h-24 object-cover filter hue-rotate-15 contrast-125" />
                                                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] p-1 px-2">
                                                    K5+320 右侧车道
                                                </div>
                                            </div>
                                        </div>

                                        {/* Complete Event */}
                                        {detailTask.status === 'completed' && (
                                            <div className="relative pl-6">
                                                <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-green-500 ring-4 ring-white shadow-sm"></div>
                                                <div className="text-xs text-slate-400 font-mono mb-0.5">10:30:00</div>
                                                <div className="text-sm text-slate-700">任务完成，车辆自动返航，生成报告 R-20250617-01</div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                            <button onClick={() => setDetailTask(null)} className="px-4 py-2 border border-slate-300 bg-white rounded-lg hover:bg-slate-50 text-sm font-medium">关闭</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InspectionTaskView;
