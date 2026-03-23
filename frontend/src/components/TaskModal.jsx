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
      <div className="mac-window animate-scale-in" style={{ width: 'calc(100% - 32px)', maxWidth: '500px', position: 'relative', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
        {/* macOS Header */}
        <div className="mac-header" style={{ position: 'sticky', top: 0, zIndex: 10 }}>
          <span className="mac-dot close" onClick={onClose} style={{ cursor: 'pointer' }} title="Close"></span>
          <span className="mac-dot minimize"></span>
          <span className="mac-dot maximize"></span>
        </div>
        
        <div style={{ padding: '32px', overflowY: 'auto' }}>
          <h2 style={{ marginBottom: '24px', fontSize: '1.5rem', color: '#202124', fontWeight: '500' }}>{initialData ? 'Edit Task' : 'Create New Task'}</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="google-input-group">
              <input type="text" className="google-input" placeholder=" " value={title} onChange={e => setTitle(e.target.value)} required />
              <label className="google-label">Task Title</label>
            </div>
            
            <div className="google-input-group">
              <textarea className="google-input" rows={3} placeholder=" " value={description} onChange={e => setDescription(e.target.value)} />
              <label className="google-label">Description (optional)</label>
            </div>
            
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '0.8rem', color: '#5F6368', marginLeft: '4px', marginBottom: '8px', display: 'block', fontWeight: 500 }}>Priority</label>
                <select className="google-input" style={{ padding: '12px 16px' }} value={priority} onChange={e => setPriority(e.target.value)}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              
              {initialData && (
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.8rem', color: '#5F6368', marginLeft: '4px', marginBottom: '8px', display: 'block', fontWeight: 500 }}>Status</label>
                  <select className="google-input" style={{ padding: '12px 16px' }} value={status} onChange={e => setStatus(e.target.value)}>
                    <option value="todo">To Do</option>
                    <option value="inprogress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
              )}
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
              <button type="button" className="btn btn-outline" onClick={onClose} style={{ borderRadius: '24px', padding: '10px 20px', border: '1px solid #DADCE0', color: '#5F6368', background: 'transparent' }}>Cancel</button>
              <button type="submit" className="btn btn-google" disabled={isLoading || !title.trim()}>
                {isLoading ? <div className="spinner"><span></span></div> : 'Save Task'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
