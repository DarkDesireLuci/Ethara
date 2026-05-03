import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import Modal from '../components/Modal';
import TaskCard from '../components/TaskCard';
import { Plus, Users, Settings, ArrowLeft, AlertCircle } from 'lucide-react';
import './ProjectPage.css';

const COLUMNS = ['To Do', 'In Progress', 'Done'];

export default function ProjectPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Task Modal state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskPriority, setTaskPriority] = useState('Medium');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [creating, setCreating] = useState(false);
  const [taskError, setTaskError] = useState('');

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const [projectRes, tasksRes] = await Promise.all([
          api.get(`/projects/${id}`),
          api.get(`/tasks/project/${id}`)
        ]);
        setProject(projectRes.project);
        setTasks(tasksRes.tasks);
      } catch (err) {
        console.error('Failed to fetch project data', err);
        setError(err.message || 'Failed to load project');
      } finally {
        setLoading(false);
      }
    };
    fetchProjectData();
  }, [id]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setTaskError('');
    setCreating(true);
    try {
      const data = await api.post('/tasks', {
        title: taskTitle,
        description: taskDesc,
        priority: taskPriority,
        dueDate: taskDueDate || null,
        projectId: id
      });
      setTasks([...tasks, data.task]);
      setIsTaskModalOpen(false);
      // Reset form
      setTaskTitle('');
      setTaskDesc('');
      setTaskPriority('Medium');
      setTaskDueDate('');
    } catch (err) {
      console.error('Failed to create task', err);
      setTaskError(err.message || 'Failed to create task');
    } finally {
      setCreating(false);
    }
  };

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('taskId', taskId);
    e.currentTarget.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '1';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, status) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (!taskId) return;

    const task = tasks.find(t => t.id === taskId);
    if (!task || task.status === status) return;

    // Optimistic UI update
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, status } : t
    ));

    try {
      await api.patch(`/tasks/${taskId}/status`, { status });
    } catch (err) {
      console.error('Failed to update task status', err);
      // Revert on error
      const tasksRes = await api.get(`/tasks/project/${id}`);
      setTasks(tasksRes.tasks);
    }
  };

  if (loading) return <div className="loading-state">Loading project...</div>;
  if (error) return (
    <div className="empty-state card">
      <AlertCircle size={48} className="empty-icon" style={{ color: 'var(--color-danger)' }} />
      <h3>Error loading project</h3>
      <p>{error}</p>
      <button className="btn btn-primary mt-4" onClick={() => navigate('/projects')}>
        Back to Projects
      </button>
    </div>
  );
  if (!project) return (
    <div className="empty-state card">
      <h3>Project not found</h3>
      <button className="btn btn-primary mt-4" onClick={() => navigate('/projects')}>
        Back to Projects
      </button>
    </div>
  );

  const isAdmin = project.members.some(m => m.userId === user?.id && m.role === 'Admin');

  return (
    <div className="project-page animate-fade-in">
      <header className="project-header">
        <div className="project-title-area">
          <div className="project-title-row">
            <button className="btn-icon btn-ghost" onClick={() => navigate('/projects')} title="Back to projects">
              <ArrowLeft size={20} />
            </button>
            <h1>{project.name}</h1>
          </div>
          <div className="project-actions">
            <div className="members-avatars">
              {project.members.slice(0, 3).map(m => (
                <div key={m.userId} className="member-avatar" title={m.user.name}>
                  {m.user.name.charAt(0).toUpperCase()}
                </div>
              ))}
              {project.members.length > 3 && (
                <div className="member-avatar more">+{project.members.length - 3}</div>
              )}
            </div>
            {isAdmin && (
              <button className="btn-icon btn-secondary" title="Project Settings">
                <Settings size={18} />
              </button>
            )}
            <button className="btn btn-primary" onClick={() => setIsTaskModalOpen(true)}>
              <Plus size={18} />
              <span>New Task</span>
            </button>
          </div>
        </div>
        {project.description && <p className="project-description">{project.description}</p>}
      </header>

      <div className="kanban-board">
        {COLUMNS.map(columnStatus => {
          const columnTasks = tasks.filter(t => t.status === columnStatus);
          return (
            <div 
              key={columnStatus} 
              className="kanban-column"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, columnStatus)}
            >
              <div className="column-header">
                <h3>{columnStatus}</h3>
                <span className="task-count">{columnTasks.length}</span>
              </div>
              <div className="column-content">
                {columnTasks.length === 0 ? (
                  <div className="empty-column">
                    <p>No tasks</p>
                  </div>
                ) : (
                  columnTasks.map(task => (
                    <div 
                      key={task.id} 
                      draggable 
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      onDragEnd={handleDragEnd}
                      className="draggable-task"
                    >
                      <TaskCard task={task} onClick={() => {}} />
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Modal isOpen={isTaskModalOpen} onClose={() => {
        setIsTaskModalOpen(false);
        setTaskError('');
      }} title="Create New Task">
        {taskError && (
          <div className="auth-error" style={{ marginBottom: '1rem' }}>
            <AlertCircle size={16} />
            <span>{taskError}</span>
          </div>
        )}
        <form onSubmit={handleCreateTask}>
          <div className="input-group">
            <label htmlFor="taskTitle">Task Title</label>
            <input 
              id="taskTitle" 
              type="text" 
              className="input" 
              value={taskTitle} 
              onChange={e => setTaskTitle(e.target.value)} 
              required 
              placeholder="Enter task title"
            />
          </div>
          <div className="input-group">
            <label htmlFor="taskDesc">Description</label>
            <textarea 
              id="taskDesc" 
              className="textarea" 
              value={taskDesc} 
              onChange={e => setTaskDesc(e.target.value)}
              placeholder="Add task description (optional)"
            />
          </div>
          <div className="input-row">
            <div className="input-group" style={{ flex: 1 }}>
              <label htmlFor="taskPriority">Priority</label>
              <select id="taskPriority" className="select" value={taskPriority} onChange={e => setTaskPriority(e.target.value)}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div className="input-group" style={{ flex: 1 }}>
              <label htmlFor="taskDueDate">Due Date</label>
              <input 
                id="taskDueDate" 
                type="date" 
                className="input" 
                value={taskDueDate} 
                onChange={e => setTaskDueDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={() => setIsTaskModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={creating}>
              {creating ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
