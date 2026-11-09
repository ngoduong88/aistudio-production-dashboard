import React, { useState } from 'react';
import {
  FolderKanban,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  MoreVertical,
  User,
  ArrowRight
} from 'lucide-react';

interface KanbanTask {
  id: string;
  title: string;
  line: string;
  assignee: string;
  priority: 'urgent' | 'high' | 'medium';
  status: 'backlog' | 'in_progress' | 'review' | 'done';
}

export const CelestialKanbanPage: React.FC = () => {
  const [tasks, setTasks] = useState<KanbanTask[]>([
    { id: 'K-101', title: 'Replace SMT-02 vacuum suction nozzle #4', line: 'SMT-02', assignee: 'Le Van H.', priority: 'urgent', status: 'in_progress' },
    { id: 'K-102', title: 'Recalibrate Koh Young 3D SPI height zero-point', line: 'SMT-01', assignee: 'Tran Minh K.', priority: 'high', status: 'review' },
    { id: 'K-103', title: 'Reflow oven oxygen analyzer N2 filter swap', line: 'SMT-01', assignee: 'Pham Duc T.', priority: 'medium', status: 'backlog' },
    { id: 'K-104', title: 'Clean solder dross from wave solder pot', line: 'DIP-01', assignee: 'Doan Van B.', priority: 'medium', status: 'done' },
    { id: 'K-105', title: 'Update AOI inspection algorithm for 0201 passives', line: 'SMT-02', assignee: 'Vision Team', priority: 'high', status: 'in_progress' },
    { id: 'K-106', title: 'Inspect ESD grounding point wrist-strap continuity', line: 'ASSY-01', assignee: 'Safety Officer', priority: 'medium', status: 'done' },
  ]);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const moveTask = (taskId: string, newStatus: KanbanTask['status']) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: KanbanTask = {
      id: `K-${Math.floor(100 + Math.random() * 900)}`,
      title: newTaskTitle.trim(),
      line: 'SMT-01',
      assignee: 'Duty Engineer',
      priority: 'high',
      status: 'backlog',
    };

    setTasks(prev => [newTask, ...prev]);
    setNewTaskTitle('');
    setShowAddModal(false);
  };

  const columns: { key: KanbanTask['status']; title: string; color: string }[] = [
    { key: 'backlog', title: 'Backlog / Scheduled', color: 'border-slate-600' },
    { key: 'in_progress', title: 'In Progress (Active Work)', color: 'border-blue-500' },
    { key: 'review', title: 'Engineering Review / Validation', color: 'border-amber-500' },
    { key: 'done', title: 'Completed / Signed Off', color: 'border-emerald-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#242735]">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Shop-Floor Kaizen & Maintenance Kanban</span>
            <span className="px-2 py-0.5 text-[10px] font-mono bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-sm">
              5S / TPM
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Continuous improvement tasks, autonomous maintenance, tooling changes, and line sign-offs.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="px-3 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Kaizen Task</span>
        </button>
      </div>

      {/* Kanban Board 4 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {columns.map(col => {
          const colTasks = tasks.filter(t => t.status === col.key);

          return (
            <div key={col.key} className="bg-[#181a22] border border-[#242735] rounded-xl p-4 shadow-lg flex flex-col justify-between min-h-[500px]">
              <div>
                <div className={`flex items-center justify-between pb-3 border-b-2 ${col.color} mb-3`}>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">{col.title}</h3>
                  <span className="w-5 h-5 rounded-full bg-[#13151b] text-slate-300 text-[10px] font-mono flex items-center justify-center font-bold">
                    {colTasks.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {colTasks.map(task => (
                    <div
                      key={task.id}
                      className="p-3 bg-[#13151b] border border-[#242735] hover:border-slate-600 rounded-lg space-y-2 transition-all shadow-xs"
                    >
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-mono text-blue-400 font-bold">{task.id}</span>
                        <span className={`px-1.5 py-0.5 rounded uppercase font-semibold ${
                          task.priority === 'urgent'
                            ? 'bg-[#e11d48]/20 text-[#e11d48]'
                            : task.priority === 'high'
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-slate-700 text-slate-300'
                        }`}>
                          {task.priority}
                        </span>
                      </div>

                      <h4 className="text-xs font-semibold text-white leading-snug">{task.title}</h4>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-[#242735]">
                        <span className="font-mono text-slate-300 font-medium">{task.line}</span>
                        <span className="truncate max-w-[100px]">{task.assignee}</span>
                      </div>

                      {/* Move to next stage button */}
                      <div className="pt-1 flex items-center justify-end gap-1">
                        {col.key !== 'done' && (
                          <button
                            type="button"
                            onClick={() => {
                              const nextStatus: KanbanTask['status'] =
                                col.key === 'backlog' ? 'in_progress' : col.key === 'in_progress' ? 'review' : 'done';
                              moveTask(task.id, nextStatus);
                            }}
                            className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer font-medium"
                          >
                            <span>Move Next</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#181a22] border border-[#242735] rounded-xl p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-white">Create New Kaizen / Maintenance Task</h3>
            <form onSubmit={handleAddTask} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-medium block mb-1">Task Title / Action Item</label>
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Clean reflow oven exhaust duct filter"
                  className="w-full bg-[#13151b] border border-[#242735] rounded-md px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-md cursor-pointer"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
