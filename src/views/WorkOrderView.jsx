import React, { useState, useEffect } from 'react';
import {
    Search, Filter, Plus, Clock,
    AlertCircle, CheckCircle2, User, FileText, ChevronRight
} from 'lucide-react';
import { MOCK_BRIDGE_WORK_ORDERS } from '../MockData';
import { Card } from '../components/UIComponents';
import clsx from 'clsx';

const WorkOrderView = ({ initialTarget = null, sourceType = 'disease' }) => {
    const [statusFilter, setStatusFilter] = useState('all');
    const [orders, setOrders] = useState(MOCK_BRIDGE_WORK_ORDERS);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(!!initialTarget);
    const [newOrder, setNewOrder] = useState({
        targetId: '',
        sourceType: 'disease', // 'disease' or 'asset'
        targetName: '',
        type: '道路维修',
        priority: 'Medium',
        assignedTo: '养护一队',
        deadline: '',
        description: ''
    });

    // Reset when initialTarget changes
    useEffect(() => {
        if (initialTarget) {
            setIsCreateModalOpen(true);
            const isAsset = sourceType === 'asset';
            const targetId = isAsset ? (initialTarget.code || initialTarget.id) : initialTarget.code;
            const targetName = isAsset ? initialTarget.type : initialTarget.type;

            setNewOrder(prev => ({
                ...prev,
                targetId: targetId,
                sourceType: sourceType,
                targetName: targetName,
                type: isAsset ? '设施维护' : '道路维修',
                description: isAsset
                    ? `对 ${initialTarget.road} ${initialTarget.section} 的 ${initialTarget.type} 进行维护`
                    : `针对 ${initialTarget.type} (${initialTarget.area}m²) 进行维修`
            }));
        }
    }, [initialTarget, sourceType]);

    const handleCreateOrder = () => {
        const order = {
            id: `WO-2025${Math.floor(Math.random() * 10000)}`,
            diseaseId: newOrder.targetId, // Use diseaseId as general target ID field for compatibility or new field
            targetId: newOrder.targetId,
            sourceType: newOrder.sourceType,
            targetName: newOrder.targetName,
            type: newOrder.type,
            priority: newOrder.priority,
            assignedTo: newOrder.assignedTo,
            deadline: newOrder.deadline,
            description: newOrder.description,
            status: 'pending',
            createTime: new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(/\//g, '-'),
        };
        setOrders([order, ...orders]);
        setIsCreateModalOpen(false);
        // Reset form
        setNewOrder({ targetId: '', sourceType: 'disease', targetName: '', type: '道路维修', priority: 'Medium', assignedTo: '养护一队', deadline: '', description: '' });
    };

    // Derived state for stats
    const stats = {
        total: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        processing: orders.filter(o => o.status === 'processing').length,
        completed: orders.filter(o => o.status === 'completed').length,
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'pending': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'processing': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'completed': return 'bg-green-100 text-green-700 border-green-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'pending': return '待处理';
            case 'processing': return '处理中';
            case 'completed': return '已完工';
            default: return status;
        }
    };

    const getPriorityColor = (p) => {
        switch (p) {
            case 'High': return 'text-red-500';
            case 'Medium': return 'text-orange-500';
            case 'Low': return 'text-green-500';
            default: return 'text-slate-500';
        }
    };

    const filteredOrders = statusFilter === 'all'
        ? orders
        : orders.filter(o => o.status === statusFilter);

    return (
        <div className="p-6 space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">工单管理</h2>
                    <p className="text-slate-500 text-sm mt-1">病害维修与设施养护任务全流程跟踪</p>
                </div>
                <button
                    onClick={() => {
                        setNewOrder(prev => ({ ...prev, sourceType: 'disease', type: '道路维修' })); // Default
                        setIsCreateModalOpen(true);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 active:scale-95 flex items-center font-medium transition-all"
                >
                    <Plus size={18} className="mr-2" />
                    创建工单
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="flex items-center space-x-4 border-l-4 border-l-blue-500">
                    <div className="p-3 bg-blue-50 rounded-full text-blue-600"><FileText size={24} /></div>
                    <div>
                        <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">总工单</div>
                        <div className="text-2xl font-bold text-slate-800">{stats.total}</div>
                    </div>
                </Card>
                <Card className="flex items-center space-x-4 border-l-4 border-l-orange-500">
                    <div className="p-3 bg-orange-50 rounded-full text-orange-600"><AlertCircle size={24} /></div>
                    <div>
                        <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">待处理</div>
                        <div className="text-2xl font-bold text-slate-800">{stats.pending}</div>
                    </div>
                </Card>
                <Card className="flex items-center space-x-4 border-l-4 border-l-indigo-500">
                    <div className="p-3 bg-indigo-50 rounded-full text-indigo-600"><Clock size={24} /></div>
                    <div>
                        <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">处理中</div>
                        <div className="text-2xl font-bold text-slate-800">{stats.processing}</div>
                    </div>
                </Card>
                <Card className="flex items-center space-x-4 border-l-4 border-l-green-500">
                    <div className="p-3 bg-green-50 rounded-full text-green-600"><CheckCircle2 size={24} /></div>
                    <div>
                        <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">已完工</div>
                        <div className="text-2xl font-bold text-slate-800">{stats.completed}</div>
                    </div>
                </Card>
            </div>

            {/* Filter & Search */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center space-x-1 p-1 bg-slate-100 rounded-lg">
                    {['all', 'pending', 'processing', 'completed'].map(status => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={clsx(
                                "px-4 py-1.5 text-sm font-medium rounded-md transition-all",
                                statusFilter === status ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
                            )}
                        >
                            {status === 'all' ? '全部' : getStatusLabel(status)}
                        </button>
                    ))}
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                        type="text"
                        placeholder="搜索工单号/关联ID..."
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                </div>
            </div>

            {/* Order List */}
            <div className="grid gap-4">
                {filteredOrders.map(order => (
                    <div key={order.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-center justify-between gap-4 group">

                        {/* ID & Basic Info */}
                        <div className="flex items-center gap-4 min-w-[250px]">
                            <div className={clsx("w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shadow-sm shrink-0",
                                order.sourceType === 'asset' ? "bg-cyan-100 text-cyan-600" :
                                    order.type.includes('维修') ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600"
                            )}>
                                {order.sourceType === 'asset' ? '资' : (order.type ? order.type[0] : '工')}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-slate-800">{order.id}</h3>
                                    <span className={clsx("px-2 py-0.5 rounded text-[10px] uppercase border", getStatusStyle(order.status))}>
                                        {getStatusLabel(order.status)}
                                    </span>
                                </div>
                                <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                                    <span className={clsx("px-1.5 py-0.5 rounded", order.sourceType === 'asset' ? "bg-cyan-50 text-cyan-700" : "bg-purple-50 text-purple-700")}>
                                        {order.sourceType === 'asset' ? '关联资产' : '关联病害'}: {order.diseaseId || order.targetId}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm w-full">
                            <div className="space-y-1">
                                <div className="text-slate-400 text-xs">维护对象</div>
                                <div className="font-medium text-slate-700">{order.targetName || '-'}</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-slate-400 text-xs">处理班组</div>
                                <div className="font-medium text-slate-700 flex items-center gap-1">
                                    <User size={14} /> {order.assignedTo}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-slate-400 text-xs">优先级</div>
                                <div className={clsx("font-bold flex items-center gap-1", getPriorityColor(order.priority))}>
                                    <div className={clsx("w-2 h-2 rounded-full", order.priority === 'High' ? 'bg-red-500' : order.priority === 'Medium' ? 'bg-orange-500' : 'bg-green-500')}></div>
                                    {order.priority}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-slate-400 text-xs">截止日期</div>
                                <div className="text-slate-600 font-medium">{order.deadline}</div>
                            </div>
                        </div>

                        {/* Actions */}
                        <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                            <ChevronRight />
                        </button>
                    </div>
                ))}
            </div>

            {/* Create Order Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-slate-800">新建工单</h3>
                            <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600">×</button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">来源类型</label>
                                    <select
                                        className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none bg-slate-50"
                                        value={newOrder.sourceType}
                                        disabled={!!initialTarget} // Disable changing source if initiated from context
                                        onChange={(e) => setNewOrder({ ...newOrder, sourceType: e.target.value })}
                                    >
                                        <option value="disease">病害维修</option>
                                        <option value="asset">资产/设施维护</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">关联ID</label>
                                    <input
                                        type="text"
                                        className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        value={newOrder.targetId}
                                        readOnly={!!initialTarget}
                                        onChange={(e) => setNewOrder({ ...newOrder, targetId: e.target.value })}
                                        placeholder="输入编号"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">工单类型</label>
                                    <select
                                        className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={newOrder.type}
                                        onChange={(e) => setNewOrder({ ...newOrder, type: e.target.value })}
                                    >
                                        {newOrder.sourceType === 'disease' ? (
                                            <>
                                                <option value="道路维修">道路维修</option>
                                                <option value="坑槽修补">坑槽修补</option>
                                                <option value="裂缝灌缝">裂缝灌缝</option>
                                            </>
                                        ) : (
                                            <>
                                                <option value="设施维护">设施维护</option>
                                                <option value="设施更换">设施更换</option>
                                                <option value="清洗保养">清洗保养</option>
                                            </>
                                        )}
                                        <option value="绿化修剪">绿化修剪</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">优先级</label>
                                    <select
                                        className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={newOrder.priority}
                                        onChange={(e) => setNewOrder({ ...newOrder, priority: e.target.value })}
                                    >
                                        <option value="High">高 (High)</option>
                                        <option value="Medium">中 (Medium)</option>
                                        <option value="Low">低 (Low)</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">指派班组</label>
                                <select
                                    className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={newOrder.assignedTo}
                                    onChange={(e) => setNewOrder({ ...newOrder, assignedTo: e.target.value })}
                                >
                                    <option value="养护一队">养护一队</option>
                                    <option value="养护二队">养护二队</option>
                                    <option value="绿化组">绿化组</option>
                                    <option value="设施科">设施科</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">截止日期</label>
                                <input
                                    type="date"
                                    className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={newOrder.deadline}
                                    onChange={(e) => setNewOrder({ ...newOrder, deadline: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">任务描述</label>
                                <textarea
                                    className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none"
                                    value={newOrder.description}
                                    onChange={(e) => setNewOrder({ ...newOrder, description: e.target.value })}
                                    placeholder="请输入详细的维修要求..."
                                />
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 rounded-b-xl">
                            <button onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors">取消</button>
                            <button
                                onClick={handleCreateOrder}
                                disabled={!newOrder.targetId || !newOrder.deadline}
                                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                立即生成
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorkOrderView;
