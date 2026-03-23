import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Clock, AlertCircle } from 'lucide-react';
import api from '../api/axios';

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTaskDetail = async () => {
      try {
        const response = await api.get(`/tasks/${id}`);
        setTask(response.data.task);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch task');
        setLoading(false);
      }
    };

    fetchTaskDetail();
  }, [id]);

  if (loading) {
    return <div className="spinner" style={{ margin: '100px auto', width: '40px', height: '40px' }} />;
  }

  if (error || !task) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <AlertCircle size={48} color="var(--danger)" style={{ marginBottom: '16px' }} />
        <h1>Task Not Found</h1>
        <p style={{ color: 'var(--text-muted)' }}>{error}</p>
        <button onClick={() => navigate('/')} className="btn btn-primary" style={{ marginTop: '20px' }}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', textDecoration: 'none', marginBottom: '24px' }}>
        <ArrowLeft size={18} /> Back to Dashboard
      </Link>

      <div className="glass" style={{ padding: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '2.5rem', margin: 0, color: 'var(--text-color)' }}>{task.title}</h1>
          <div style={{ display: 'flex', gap: '12px' }}>
            <span className={`badge badge-${task.status}`}>{task.status.replace('-', ' ')}</span>
            <span className={`badge badge-priority-${task.priority}`}>{task.priority}</span>
          </div>
        </div>

        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '24px', borderRadius: '12px', minHeight: '150px', marginBottom: '32px' }}>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: task.description ? 'var(--text-color)' : 'var(--text-muted)', margin: 0 }}>
            {task.description || "No description provided."}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          <Clock size={16} />
          <span>Last updated: {new Date(task.updatedAt).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
