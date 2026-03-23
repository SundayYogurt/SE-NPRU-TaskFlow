import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Edit2, AlertCircle, Clock, CheckCircle, Search, BarChart2 } from 'lucide-react';
import useTaskStore from '../stores/taskStore';
import TaskModal from '../components/TaskModal';

const Dashboard = () => {
  const { tasks, isLoading, error, fetchTasks, addTask, deleteTask, updateTask } = useTaskStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchTasks({ search: searchQuery, status: statusFilter, priority: priorityFilter });
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, statusFilter, priorityFilter, fetchTasks]);

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter(t => t.status === 'done').length;
  const inProgressTasks = tasks.filter(t => t.status === 'inprogress').length;

  const handleCreateTask = async (taskData) => {
    await addTask(taskData);
    setIsModalOpen(false);
  };

  const handleUpdateTask = async (taskData) => {
    if (editingTask) {
      await updateTask(editingTask._id, taskData);
      setIsModalOpen(false);
      setEditingTask(null);
    }
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const closeModals = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const toggleTaskStatus = async (task) => {
    const newStatus = task.status === 'done' ? 'todo' : 'done';
    await updateTask(task._id, { status: newStatus });
  };

  return (
    <>
    <div className="animate-fade-in-up">
      <div className="mac-window" style={{ display: 'flex', flexDirection: 'column', minHeight: '80vh', marginBottom: '32px' }}>
        <div className="mac-header" style={{ position: 'sticky', top: 0, zIndex: 10 }}>
          <span className="mac-dot close"></span>
          <span className="mac-dot minimize"></span>
          <span className="mac-dot maximize"></span>
        </div>
        
        <div style={{ padding: '32px', flex: 1, background: '#F8F9FA' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <div>
              <h1 style={{ fontSize: '2rem', margin: 0, color: '#202124' }}>My Tasks</h1>
              <p style={{ color: '#5F6368' }}>You have {tasks.length} task{tasks.length !== 1 && 's'} remaining.</p>
            </div>
            <button onClick={() => setIsModalOpen(true)} className="btn btn-google">
              <Plus size={18} /> New Task
            </button>
          </div>

      {/* Statistics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="glass" style={{ padding: '24px', borderLeft: '4px solid var(--primary)' }}>
          <h3 style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}><BarChart2 size={16} /> Total Tasks</h3>
          <p style={{ margin: '8px 0 0 0', fontSize: '2rem', fontWeight: 'bold', color: '#202124' }}>{totalTasks}</p>
        </div>
        <div className="glass" style={{ padding: '24px', borderLeft: '4px solid var(--warning)' }}>
          <h3 style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>In Progress</h3>
          <p style={{ margin: '8px 0 0 0', fontSize: '2rem', fontWeight: 'bold', color: '#202124' }}>{inProgressTasks}</p>
        </div>
        <div className="glass" style={{ padding: '24px', borderLeft: '4px solid var(--success)' }}>
          <h3 style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Completed</h3>
          <p style={{ margin: '8px 0 0 0', fontSize: '2rem', fontWeight: 'bold', color: '#202124' }}>{doneTasks}</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass" style={{ padding: '16px', marginBottom: '32px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: '1 1 300px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', top: '14px', left: '16px', color: '#5F6368' }} />
          <input 
            type="text" 
            placeholder="Search tasks by title..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="google-input" 
            style={{ paddingLeft: '44px', marginBottom: 0, background: '#fff' }}
          />
        </div>
        <select className="google-input" style={{ flex: '1 1 150px', marginBottom: 0, background: '#fff' }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="todo">To Do</option>
          <option value="inprogress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <select className="google-input" style={{ flex: '1 1 150px', marginBottom: 0, background: '#fff' }} value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
          <AlertCircle size={20} /> {error}
        </div>
      )}

      {isLoading && tasks.length === 0 ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
          <div className="spinner" style={{ width: '40px', height: '40px' }} />
        </div>
      ) : tasks.length === 0 ? (
        <div className="glass" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <CheckCircle size={48} style={{ opacity: 0.5, marginBottom: '16px' }} />
          <h3>No tasks found</h3>
          <p>You're all caught up! Enjoy your free time or add a new task.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {tasks.map(task => (
            <div key={task._id} className="glass-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                <button 
                  onClick={() => toggleTaskStatus(task)}
                  style={{
                    width: '24px', height: '24px', borderRadius: '50%',
                    border: `2px solid ${task.status === 'done' ? 'var(--success)' : 'var(--text-muted)'}`,
                    background: task.status === 'done' ? 'var(--success)' : 'transparent',
                    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s'
                  }}
                >
                  {task.status === 'done' && <CheckCircle size={14} />}
                </button>
                
                <div style={{ flex: 1, cursor: 'pointer' }}>
                  <Link to={`/tasks/${task._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', textDecoration: task.status === 'done' ? 'line-through' : 'none', opacity: task.status === 'done' ? 0.6 : 1, transition: 'all 0.2s' }}>
                      {task.title}
                    </h3>
                  </Link>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '8px', alignItems: 'center' }}>
                    <span className={`badge badge-${task.status}`}>{task.status === 'inprogress' ? 'in progress' : task.status}</span>
                    <span className={`badge badge-priority-${task.priority}`}>{task.priority}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => openEditModal(task)} className="btn btn-outline" style={{ padding: '8px' }}>
                  <Edit2 size={16} />
                </button>
                <button onClick={() => deleteTask(task._id)} className="btn btn-danger" style={{ padding: '8px' }}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
        </div>
      </div>
    </div>

      <TaskModal 
        isOpen={isModalOpen} 
        onClose={closeModals} 
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask} 
        initialData={editingTask}
        isLoading={isLoading}
      />
    </>
  );
};

export default Dashboard;
