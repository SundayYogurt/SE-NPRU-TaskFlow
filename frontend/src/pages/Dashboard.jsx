import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Edit2, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import useTaskStore from '../stores/taskStore';
import TaskModal from '../components/TaskModal';

const Dashboard = () => {
  const { tasks, isLoading, error, fetchTasks, addTask, deleteTask, updateTask } = useTaskStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', margin: 0 }}>My Tasks</h1>
          <p style={{ color: 'var(--text-muted)' }}>You have {tasks.length} task{tasks.length !== 1 && 's'} remaining.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
          <Plus size={18} /> New Task
        </button>
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
                    <span className={`badge badge-${task.status}`}>{task.status.replace('-', ' ')}</span>
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
