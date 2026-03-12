import React, { useState, useEffect } from 'react';
import {
    Calendar, Clock, MapPin, Play, CheckCircle2, Navigation, Plus,
    Trash2, Eye, AlertCircle, PlaneTakeoff, Navigation2, FileText
} from 'lucide-react';
import clsx from 'clsx';
import { MOCK_BRIDGE_INSPECTIONS } from '../MockData';
import { Card } from '../components/UIComponents';

const InspectionTaskView = ({ onNavigate }) => {
    const [tasks, setTasks] = useState([]);
    const [filterStatus, setFilterStatus] = useState('all'); 
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [detailTask, setDetailTask] = useState(null);

    // Form State
    const [newTask, setNewTask] = useState({ route: '主航线自动规划', bridge: '', uav: '自动调度系统' });

    useEffect(() => {
        setTasks(MOCK_BRIDGE_INSPECTIONS);
    }, []);

    // --- Actions ---

    const handleCreateTask = () => {
        const t = {
            id: `INS-2026-${Math.floor(Math.random() * 10000)}`,
            bridgeName: newTask.bridge || '未指定桥梁',
            uav: newTask.uav === '自动调度系统' ? 'UAV-Pending' : newTask.uav,
            status: 'pending',
            progress: 0,
            startTime: '-',
            diseases: 0
        };
        setTasks([t, ...tasks]);
        setIsCreateModalOpen(false);
        setNewTask({ route: '主航线自动规划', bridge: '', uav: '自动调度系统' });
    };

    const handleDeleteTask = (id) => {
        if (window.confirm('确认取消并删除该无人机航线任务吗？')) {
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
            case 'executing': return 'bg-cyan-100 text-cyan-700 border-cyan-300';
            case 'completed': return 'bg-emerald-100 text-emerald-700 border-emerald-300';
            case 'pending': return 'bg-orange-100 text-orange-700 border-orange-300';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'executing': return '飞行巡检中';
            case 'completed': return '航线已完成';
            case 'pending': return '航线待机中';
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
        <div className="p-6 space-y-6 animate-in fade-in duration-500 bg-slate-50 min-h-[calc(100vh-64px)] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">无人机航线与任务排期系统</h2>
                    <p className="text-slate-500 text-sm mt-1">智能规划低空巡检路由，全自动分派桥梁表观检测任务</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 flex items-center font-bold transition-all"
                >
                    <Plus size={18} className="mr-2" />
                    新建巡检架次
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="flex items-center justify-between border-l-4 border-l-cyan-500 hover:shadow-lg transition">
                    <div>
                        <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">执行中架次 (Executing)</div>
                        <div className="flex items-end">
                            <span className="text-3xl font-black text-slate-800 mr-2">{stats.executing}</span>
                            <span className="text-sm font-bold text-slate-400 mb-1">架空载</span>
                        </div>
                    </div>
                    <div className="p-4 bg-cyan-50 rounded-2xl text-cyan-500 border border-cyan-100"><PlaneTakeoff size={28} /></div>
                </Card>
                <Card className="flex items-center justify-between border-l-4 border-l-orange-500 hover:shadow-lg transition">
                    <div>
                        <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">待执行指令 (Pending)</div>
                        <div className="flex items-end">
                            <span className="text-3xl font-black text-slate-800 mr-2">{stats.pending}</span>
                            <span className="text-sm font-bold text-slate-400 mb-1">条</span>
                        </div>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-2xl text-orange-500 border border-orange-100"><Clock size={28} /></div>
                </Card>
                <Card className="flex items-center justify-between border-l-4 border-l-emerald-500 hover:shadow-lg transition">
                    <div>
                        <div className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">今日完成 (Completed)</div>
                        <div className="flex items-end">
                            <span className="text-3xl font-black text-slate-800 mr-2">{stats.completed}</span>
                            <span className="text-sm font-bold text-slate-400 mb-1">次巡检</span>
                        </div>
                    </div>
                    <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-500 border border-emerald-100"><CheckCircle2 size={28} /></div>
                </Card>
            </div>

            {/* Filter Tabs */}
            <div className="flex space-x-2 bg-white p-1.5 border border-slate-200 shadow-sm rounded-xl w-fit">
                {['all', 'executing', 'pending', 'completed'].map(status => (
                    <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={clsx(
                            "px-5 py-2 text-sm font-bold rounded-lg transition-all",
                            filterStatus === status ? "bg-slate-800 text-white shadow-md" : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                        )}
                    >
                        {status === 'all' ? '全部视角' : getStatusLabel(status)}
                    </button>
                ))}
            </div>

            {/* Task List */}
            <div className="grid gap-5">
                {filteredTasks.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400">
                        <Navigation2 size={40} className="text-slate-300 mb-3" />
                        <span className="font-medium">所选分类下当前没有任何巡检架次部署</span>
                    </div>
                )}
                {filteredTasks.map(task => (
                    <div key={task.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 grid grid-cols-1 md:grid-cols-12 gap-6 items-center group relative overflow-hidden">
                        
                        {/* Status Bar Decorator */}
                        <div className={clsx("absolute top-0 left-0 w-1.5 h-full", 
                            task.status === 'executing' ? "bg-cyan-500" : 
                            task.status === 'pending' ? "bg-orange-400" : "bg-emerald-500"
                        )}></div>

                        {/* Left Info */}
                        <div className="flex items-start gap-4 md:col-span-4 pl-3">
                            <div className={clsx("p-3.5 rounded-xl shrink-0 flex items-center justify-center border", 
                                task.status === 'executing' ? "bg-cyan-50 text-cyan-600 border-cyan-100" : 
                                task.status === 'pending' ? "bg-orange-50 text-orange-500 border-orange-100" : "bg-emerald-50 text-emerald-500 border-emerald-100"
                            )}>
                                {task.status === 'executing' ? <PlaneTakeoff size={24} className="animate-pulse" /> :
                                 task.status === 'pending' ? <Clock size={24} /> : <CheckCircle2 size={24} />}
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1.5">
                                    <h3 className="font-bold text-slate-800 text-lg">{task.bridgeName}</h3>
                                    <span className={clsx("px-2.5 py-0.5 rounded border text-[10px] font-bold uppercase", getStatusColor(task.status))}>
                                        {getStatusLabel(task.status)}
                                    </span>
                                </div>
                                <div className="flex flex-col text-sm text-slate-500 font-mono space-y-0.5">
                                    <span className="flex items-center"><Navigation size={12} className="mr-1.5 text-slate-400" />架次 {task.id}</span>
                                    <span className="flex items-center"><MapPin size={12} className="mr-1.5 text-slate-400" />指派飞行器 {task.uav}</span>
                                </div>
                            </div>
                        </div>

                        {/* Middle Progress */}
                        <div className="flex flex-col justify-center md:col-span-5 px-4 border-x border-slate-100">
                            <div className="flex justify-between text-xs mb-2">
                                <span className="font-bold text-slate-500 uppercase tracking-widest">AI 视网膜扫描进度</span>
                                <span className={clsx("font-bold", task.status === 'pending' ? "text-slate-400" : task.status === 'completed' ? "text-emerald-600" : "text-cyan-600")}>
                                    {task.status === 'pending' ? '等待起飞许可' : `${task.progress}%`}
                                </span>
                            </div>
                            <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                <div
                                    className={clsx("h-full transition-all duration-1000 ease-out", 
                                        task.status === 'completed' ? "bg-emerald-500" : "bg-gradient-to-r from-cyan-500 to-blue-500"
                                    )}
                                    style={{ width: task.status === 'pending' ? '0%' : `${task.progress}%` }}
                                ></div>
                            </div>
                            <div className="mt-2 text-xs flex items-center justify-between">
                                <span className="text-slate-400 font-mono"><Clock size={10} className="inline mr-1" /> 起飞: {task.startTime}</span>
                                {task.diseases > 0 && (
                                    <span className="font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded flex items-center shadow-sm border border-rose-100">
                                        <AlertCircle size={10} className="mr-1" />
                                        拦截到 {task.diseases} 处表观缺陷
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-3 justify-end md:col-span-3">
                            {task.status === 'pending' && (
                                <button
                                    onClick={() => handleUpdateStatus(task.id, 'executing')}
                                    className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm rounded-xl transition-all shadow hover:shadow-lg flex items-center"
                                >
                                    <PlaneTakeoff size={16} className="mr-2" /> 准许起飞
                                </button>
                            )}
                            {task.status === 'executing' && (
                                <button
                                    onClick={() => handleUpdateStatus(task.id, 'completed')}
                                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-cyan-200 flex items-center"
                                >
                                    <CheckCircle2 size={16} className="mr-2" /> 航线归队
                                </button>
                            )}
                            <button
                                onClick={() => setDetailTask(task)}
                                className="p-2.5 bg-slate-50 text-slate-500 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 rounded-xl transition-all shadow-sm" title="飞行日志"
                            >
                                <Eye size={18} />
                            </button>
                            {task.status !== 'executing' && <button
                                onClick={() => handleDeleteTask(task.id)}
                                className="p-2.5 bg-slate-50 text-slate-500 hover:text-red-600 hover:bg-red-50 border border-slate-200 rounded-xl transition-all shadow-sm" title="销毁航线"
                            >
                                <Trash2 size={18} />
                            </button>}
                        </div>
                    </div>
                ))}
            </div>

            {/* Create Task Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-5 bg-gradient-to-r from-slate-800 to-slate-900 flex justify-between items-center text-white">
                            <h3 className="text-xl font-bold flex items-center"><Navigation2 size={24} className="mr-2 text-blue-400" />发布出勤排期</h3>
                            <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-white transition"><Trash2 size={20} /></button>
                        </div>
                        <div className="p-6 space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">目标载体(桥梁)</label>
                                <input
                                    type="text"
                                    className="w-full border-2 border-slate-200 rounded-xl p-3 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all font-bold text-slate-800"
                                    placeholder="例如：复兴大桥、钱塘江大桥"
                                    value={newTask.bridge}
                                    onChange={(e) => setNewTask({ ...newTask, bridge: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">航线策略</label>
                                <select
                                    className="w-full border-2 border-slate-200 rounded-xl p-3 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all font-bold text-slate-700"
                                    value={newTask.route}
                                    onChange={(e) => setNewTask({ ...newTask, route: e.target.value })}
                                >
                                    <option value="主航线自动规划">高空全览主航线 (主梁+索塔扫描)</option>
                                    <option value="桥墩水下环绕">低空桥墩水下环绕 (近抵特写)</option>
                                    <option value="精细化网格扫描">桥面精细化网格切片扫描</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">指派飞控矩阵</label>
                                <select
                                    className="w-full border-2 border-slate-200 rounded-xl p-3 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all font-bold text-slate-700"
                                    value={newTask.uav}
                                    onChange={(e) => setNewTask({ ...newTask, uav: e.target.value })}
                                >
                                    <option value="自动调度系统">系统池内最优自动派发</option>
                                    <option value="天鹰01号 (搭载高精套件)">天鹰01号 (旗舰机型 - 激光建模)</option>
                                    <option value="天鹰02号 (红外挂载)">天鹰02号 (红外感知 - 夜间作业)</option>
                                    <option value="潜龙水下机器人">潜龙一号 (水下桥基探测)</option>
                                </select>
                            </div>
                        </div>
                        <div className="px-6 py-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                            <button onClick={() => setIsCreateModalOpen(false)} className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 font-bold rounded-xl transition-all shadow-sm hover:shadow">取消</button>
                            <button
                                onClick={handleCreateTask}
                                disabled={!newTask.bridge}
                                className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-md shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center"
                            >
                                <Play size={16} className="mr-2" />
                                生成导航矩阵指令
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Task Detail Modal */}
            {detailTask && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="h-32 bg-slate-900 bg-opacity-90 bg-[url('https://images.unsplash.com/photo-1596708779836-3ecde9dfd4a7?q=80&w=600')] bg-cover bg-center bg-blend-multiply p-6 flex flex-col justify-end text-white relative">
                            <div className="absolute top-4 right-4 text-white/50 hover:text-white cursor-pointer font-bold text-xl" onClick={() => setDetailTask(null)}>×</div>
                            <h2 className="text-2xl font-black font-mono tracking-wider">{detailTask.id}</h2>
                            <p className="opacity-90 font-medium text-sm flex items-center mt-1"><MapPin size={14} className="mr-1" /> {detailTask.bridgeName} 指派阵列</p>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl shadow-sm">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">作业状态</div>
                                    <div className="font-bold text-slate-800 flex items-center">
                                        {detailTask.status === 'executing' ? <><span className="w-2 h-2 bg-cyan-500 rounded-full mr-2 animate-ping"></span> 全景扫描中</> : '待响应/已完毕'}
                                    </div>
                                </div>
                                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl shadow-sm">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">AI 提图拦截量</div>
                                    <div className={clsx("font-bold text-lg", detailTask.diseases > 0 ? "text-rose-600" : "text-slate-800")}>{detailTask.diseases} 枚异常</div>
                                </div>
                            </div>

                            <h4 className="font-bold text-slate-800 mb-4 flex items-center text-sm border-b border-slate-100 pb-2">
                                <FileText size={16} className="mr-2 text-blue-500" />
                                飞行器数据链溯源
                            </h4>
                            <div className="space-y-6 pl-3 border-l-2 border-slate-200 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar pb-6 relative">
                                {detailTask.status === 'pending' && <p className="text-sm text-slate-400 font-medium absolute top-4 left-6">地面站未发令，等待飞控解除锁定...</p>}
                                {(detailTask.status === 'executing' || detailTask.status === 'completed') && (
                                    <>
                                        <div className="relative pl-6">
                                            <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-blue-500 ring-4 ring-white shadow text-white flex items-center justify-center"></div>
                                            <div className="text-[10px] text-slate-400 font-mono font-bold mb-1 tracking-wider">{detailTask.startTime || '14:00'} · T+00s</div>
                                            <div className="text-sm font-bold text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                                UAV 离架升空，切换为「{detailTask.bridgeName} 主索塔三维环绕建模模式」
                                            </div>
                                        </div>

                                        {detailTask.diseases > 0 && (
                                            <div className="relative pl-6">
                                                <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-rose-500 ring-4 ring-white shadow text-white flex items-center justify-center"></div>
                                                <div className="text-[10px] text-slate-400 font-mono font-bold mb-1 tracking-wider">T+18M23S · AI 中断注入</div>
                                                <div className="text-sm font-bold text-slate-700 mb-2">
                                                    计算机视觉模块判定: <span className="text-rose-600">重度混凝土深裂可见钢筋面</span>
                                                </div>
                                                <div className="bg-slate-900 rounded-xl p-2.5 overflow-hidden border-2 border-rose-500/30">
                                                    <div className="text-rose-400 text-xs font-mono mb-2 flex justify-between">
                                                        <span>ATTENTION: CONF 99.1%</span>
                                                        <span>POS: +52m 高程</span>
                                                    </div>
                                                    <div className="w-full h-24 bg-slate-800 flex items-center justify-center border border-slate-700 rounded-lg group overflow-hidden relative">
                                                        <img src="/mock-bridges/image_01.jpg" alt="crack" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition duration-500 filter sepia-[0.3] hover:sepia-0" />
                                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black to-transparent h-12"></div>
                                                        <span className="absolute bottom-2 left-2 text-[10px] text-white font-mono bg-black/60 px-2 rounded">LOC: 北塔二段腹板</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {detailTask.status === 'completed' && (
                                            <div className="relative pl-6">
                                                <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-emerald-500 ring-4 ring-white shadow text-white flex items-center justify-center"></div>
                                                <div className="text-[10px] text-slate-400 font-mono font-bold mb-1 tracking-wider">T+45M00S · 行程完结</div>
                                                <div className="text-sm font-bold text-slate-700 bg-emerald-50/50 p-3 rounded-lg border border-emerald-100 text-emerald-800">
                                                    全节点断点恢复扫描完成，航线回收成功，归档报告《{detailTask.bridgeName}-BIM测绘摘要》
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InspectionTaskView;
