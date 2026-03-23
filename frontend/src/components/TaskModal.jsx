import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const TaskModal = ({ isOpen, onClose, onSubmit, initialData = null, isLoading = false }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [status, setStatus] = useState('todo'); // Add status explicitly for editing

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setPriority(initialData.priority || 'medium');
      setStatus(initialData.status || 'todo');
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setStatus('todo');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    // Pass everything back to parent
    onSubmit({ title, description, priority, status });
  };

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, background: 'rgba(0,0,0,0.5)',backdropFilter: 'blur(4px)' }}>
      <div className="glass animate-scale-in" style={{ width: 'calc(100% - 32px)', maxWidth: '500px', padding: '32px', position: 'relative', borderRadius: '16px', maxHeight: '90vh', overflowY: 'auto' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '8px', display: 'flex' }}>
          <X size={24} />
        </button>
        
        <h2 style={{ marginBottom: '20px', fontSize: '1.5rem' }}>{initialData ? 'Edit Task' : 'Create New Task'}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Task Title</label>
            <input type="text" className="input-field" value={title} onChange={e => setTitle(e.target.value)} required placeholder="E.g. Finish React project" />
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea className="input-field" rows={3} value={description} onChange={e => setDescription(e.target.value)} placeholder="Add some details..." />
          </div>
          
          <div style={{ display: 'flex', gap: '16px' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Priority</label>
              <select className="input-field" value={priority} onChange={e => setPriority(e.target.value)}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            {initialData && (
              <div className="form-group" style={{ flex: 1 }}>
                <label>Status</label>
                <select className="input-field" value={status} onChange={e => setStatus(e.target.value)}>
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
            )}
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isLoading || !title.trim()}>
              {isLoading ? <div className="spinner"><span></span></div> : 'Save Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
