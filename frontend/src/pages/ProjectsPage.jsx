import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import Modal from '../components/Modal';
import { Plus, Search, FolderKanban } from 'lucide-react';
import './DashboardPage.css'; // Reuse dashboard styles for projects grid

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // New project form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const fetchProjects = async () => {
    try {
      const data = await api.get('/projects');
      setProjects(data.projects);
    } catch (err) {
      console.error('Failed to fetch projects', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError('');

    try {
      const data = await api.post('/projects', { name, description });
      setProjects([data.project, ...projects]);
      setIsModalOpen(false);
      setName('');
      setDescription('');
    } catch (err) {
      setError(err.message || 'Failed to create project');
    } finally {
      setCreating(false);
    }
  };

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="projects-page animate-fade-in">
      <header className="page-header flex-between mb-8">
        <div>
          <h1>Projects</h1>
          <p>Manage all your team's projects</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} />
          <span>New Project</span>
        </button>
      </header>

      <div className="controls-bar mb-6">
        <div className="input-group search-bar" style={{ maxWidth: '400px' }}>
          <div className="input-icon-wrapper">
            <Search className="input-icon" size={18} />
            <input
              type="text"
              className="input with-icon"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">Loading projects...</div>
      ) : filteredProjects.length > 0 ? (
        <div className="projects-grid stagger">
          {filteredProjects.map(project => (
            <Link to={`/projects/${project.id}`} key={project.id} className="project-card card">
              <div className="project-card-header">
                <h3>{project.name}</h3>
                <span className="badge badge-medium">{project._count?.tasks || 0} Tasks</span>
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
          <h3>No projects found</h3>
          {searchQuery ? (
            <p>No projects match your search query.</p>
          ) : (
            <p>You don't have any projects yet.</p>
          )}
          {!searchQuery && (
            <button className="btn btn-primary mt-4" onClick={() => setIsModalOpen(true)}>
              Create Project
            </button>
          )}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Project">
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleCreateProject}>
          <div className="input-group">
            <label htmlFor="projectName">Project Name</label>
            <input
              id="projectName"
              type="text"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="projectDesc">Description (Optional)</label>
            <textarea
              id="projectDesc"
              className="textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={creating}>
              {creating ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
