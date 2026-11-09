import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ArrowRightCircle, ArrowLeftCircle, CheckCircle2 } from 'lucide-react';
import { TaskItem, TaskStatus, TaskPriority } from '../../types';

const DEFAULT_TASKS: TaskItem[] = [
  { id: '1', title: 'Implement Cloud SQL relational migrations', category: 'Backend', status: 'backlog', priority: 'high', estimateHours: 8 },
  { id: '2', title: 'OAuth token refresh client-side worker', category: 'Security', status: 'backlog', priority: 'medium', estimateHours: 4 },
  { id: '3', title: 'Design high-density data grid with keyboard nav', category: 'Frontend', status: 'in_progress', priority: 'urgent', estimateHours: 12 },
  { id: '4', title: 'Web Audio synthesizer waveform pipeline', category: 'Audio API', status: 'review', priority: 'medium', estimateHours: 6 },
  { id: '5', title: 'Vite bundling optimization & code splitting', category: 'DevOps', status: 'done', priority: 'low', estimateHours: 3 },
];

const COLUMNS: { id: TaskStatus; label: string }[] = [
  { id: 'backlog', label: 'Backlog' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'review', label: 'In Review' },
  { id: 'done', label: 'Shipped' },
];

export const KanbanDemo: React.FC = () => {
  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    const saved = localStorage.getItem('demo_kanban_tasks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_TASKS;
      }
    }
    return DEFAULT_TASKS;
  });

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('Frontend');
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>('medium');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  useEffect(() => {
    localStorage.setItem('demo_kanban_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    const item: TaskItem = {
      id: Date.now().toString(),
      title: newTaskTitle.trim(),
      category: newTaskCategory,
      status: 'backlog',
      priority: newTaskPriority,
      estimateHours: 4,
    };
    setTasks((prev) => [item, ...prev]);
    setNewTaskTitle('');
  };

  const moveTask = (id: string, direction: 'next' | 'prev') => {
    const order: TaskStatus[] = ['backlog', 'in_progress', 'review', 'done'];
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const currentIdx = order.indexOf(t.status);
        const newIdx = direction === 'next' ? Math.min(order.length - 1, currentIdx + 1) : Math.max(0, currentIdx - 1);
        return { ...t, status: order[newIdx] };
      })
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const resetDefaultTasks = () => {
    setTasks(DEFAULT_TASKS);
  };

  const filteredTasks = tasks.filter((t) => filterPriority === 'all' || t.priority === filterPriority);

  return (
    <div className="space-y-6">
      {/* Create Task Form */}
      <form onSubmit={addTask} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <input
          type="text"
          placeholder="New task title..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <select
          value={newTaskCategory}
          onChange={(e) => setNewTaskCategory(e.target.value)}
          className="px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
        >
          <option value="Frontend">Frontend</option>
          <option value="Backend">Backend</option>
          <option value="Security">Security</option>
          <option value="DevOps">DevOps</option>
          <option value="Architecture">Architecture</option>
        </select>
        <select
          value={newTaskPriority}
          onChange={(e) => setNewTaskPriority(e.target.value as TaskPriority)}
          className="px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
        >
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <button
          type="submit"
          className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Task</span>
        </button>
      </form>

      {/* Filter and Reset Bar */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-500 dark:text-slate-400 font-medium">Filter Priority:</span>
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-lg">
            {['all', 'urgent', 'high', 'medium', 'low'].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setFilterPriority(p)}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors cursor-pointer capitalize ${
                  filterPriority === p
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={resetDefaultTasks}
          className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 text-xs underline cursor-pointer"
        >
          Reset Demo Defaults
        </button>
      </div>

      {/* Kanban Board 4 Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {COLUMNS.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.id);
          return (
            <div
              key={col.id}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 p-3 flex flex-col min-h-[300px]"
            >
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200">
                <span>{col.label}</span>
                <span className="font-mono text-slate-400 tabular-nums">{colTasks.length}</span>
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto">
                {colTasks.length === 0 ? (
                  <div className="h-24 flex items-center justify-center border border-dashed border-slate-200 dark:border-slate-800 rounded-lg text-slate-400 text-xs">
                    No tasks
                  </div>
                ) : (
                  colTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-medium text-slate-900 dark:text-white line-clamp-2">
                          {task.title}
                        </span>
                        <button
                          type="button"
                          onClick={() => deleteTask(task.id)}
                          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity p-0.5 cursor-pointer"
                          aria-label="Delete task"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Clean Unboxed Metadata without candy pills */}
                      <div className="flex items-center gap-1.5 mt-2.5 text-[11px] text-slate-500 dark:text-slate-400">
                        <span>{task.category}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">{task.estimateHours}h</span>
                        <span aria-hidden="true">·</span>
                        <span className="capitalize font-medium text-slate-700 dark:text-slate-300">{task.priority}</span>
                      </div>

                      {/* Move Controls */}
                      <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-slate-100 dark:border-slate-800/80">
                        {col.id !== 'backlog' ? (
                          <button
                            type="button"
                            onClick={() => moveTask(task.id, 'prev')}
                            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors p-0.5 cursor-pointer flex items-center gap-1 text-[11px]"
                            title="Move back"
                          >
                            <ArrowLeftCircle className="w-3.5 h-3.5" />
                            <span>Prev</span>
                          </button>
                        ) : (
                          <span />
                        )}

                        {col.id !== 'done' ? (
                          <button
                            type="button"
                            onClick={() => moveTask(task.id, 'next')}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors p-0.5 cursor-pointer flex items-center gap-1 text-[11px] font-medium"
                            title="Move next"
                          >
                            <span>Advance</span>
                            <ArrowRightCircle className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <span className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Shipped</span>
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
