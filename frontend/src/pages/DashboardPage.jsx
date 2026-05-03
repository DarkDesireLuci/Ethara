import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import { Activity, FolderKanban, CheckCircle2, Clock } from 'lucide-react';
import './DashboardPage.css';

export default function DashboardPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await api.get('/projects');
        setProjects(data.projects.slice(0, 4)); // Only show top 4 recently updated
      } catch (error) {
        console.error('Failed to fetch projects', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const stats = [
    { label: 'Active Projects', value: projects.length, icon: <FolderKanban size={24} />, color: 'var(--accent)' },
    { label: 'Tasks Completed', value: '12', icon: <CheckCircle2 size={24} />, color: 'var(--color-success)' },
    { label: 'Upcoming Deadlines', value: '3', icon: <Clock size={24} />, color: 'var(--color-warning)' },
    { label: 'Team Activity', value: 'High', icon: <Activity size={24} />, color: 'var(--color-info)' },
  ];

  return (
    <div className="dashboard animate-fade-in">
      <header className="dashboard-header">
        <div>
          <h1>Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span></h1>
          <p>Here's what's happening with your projects today.</p>
        </div>
        <Link to="/projects" className="btn btn-primary">View All Projects</Link>
      </header>

      <div className="stats-grid stagger">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card card">
            <div className="stat-icon" style={{ color: stat.color, background: `${stat.color}15` }}>
              {stat.icon}
            </div>
            <div className="stat-info">
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-content">
        <section className="recent-projects">
          <div className="section-header">
            <h2>Recent Projects</h2>
          </div>
          
          {loading ? (
            <div className="loading-state">Loading projects...</div>
          ) : projects.length > 0 ? (
            <div className="projects-grid stagger">
              {projects.map(project => (
                <Link to={`/projects/${project.id}`} key={project.id} className="project-card card">
                  <div className="project-card-header">
                    <h3>{project.name}</h3>
                    <span className="badge badge-medium">{project._count.tasks} Tasks</span>
                  </div>
                  {project.description && <p className="project-desc">{project.description}</p>}
                  <div className="project-meta">
                    <span className="meta-item">Updated {new Date(project.updatedAt).toLocaleDateString()}</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty-state card">
              <FolderKanban size={48} className="empty-icon" />
              <h3>No projects yet</h3>
              <p>Get started by creating your first project.</p>
              <Link to="/projects" className="btn btn-primary mt-4">Create Project</Link>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
