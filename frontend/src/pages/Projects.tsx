import { useState, useEffect } from 'react';
import apiClient from '../services/api';
import { useAuthStore } from '../store/authStore';
import {
  PageContainer,
  SectionHeader,
  Card,
  CardContent,
  Button,
} from '../components/ui';
import { CreateProjectModal } from '../components/Createprojectmodal';

interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  likes: number;
  views: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdBy: {
    id: string;
    name: string;
  };
  createdAt: string;
}

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const { user } = useAuthStore();

  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    fetchProjects();
  }, []);

  // =============================
  // FETCH PROJECTS (Safe Extraction)
  // =============================
  const fetchProjects = async () => {
    try {
      const response = await apiClient.get('/projects');

      const raw = response.data;

      const extracted =
        raw?.data?.projects ??
        raw?.data ??
        raw?.projects ??
        raw ??
        [];

      setProjects(Array.isArray(extracted) ? extracted : []);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  // =============================
  // CREATE PROJECT
  // =============================
  const handleCreateProject = async (projectData: any) => {
    try {
      const response = await apiClient.post('/projects', projectData);

      const raw = response.data;

      const newProject =
        raw?.data?.project ??
        raw?.data ??
        raw ??
        null;

      if (newProject) {
        setProjects(prev => [newProject, ...prev]);
      }

      setCreateModalOpen(false);
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  // =============================
  // APPROVE
  // =============================
  const handleApprove = async (projectId: string) => {
    try {
      await apiClient.put(`/projects/${projectId}/approve`);

      setProjects(prev =>
        prev.map(p =>
          p.id === projectId
            ? { ...p, status: 'APPROVED' }
            : p
        )
      );
    } catch (error) {
      console.error('Failed to approve project:', error);
    }
  };

  // =============================
  // REJECT
  // =============================
  const handleReject = async (projectId: string) => {
    try {
      await apiClient.put(`/projects/${projectId}/reject`);

      setProjects(prev =>
        prev.map(p =>
          p.id === projectId
            ? { ...p, status: 'REJECTED' }
            : p
        )
      );
    } catch (error) {
      console.error('Failed to reject project:', error);
    }
  };

  // =============================
  // DELETE
  // =============================
  const handleDelete = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      await apiClient.delete(`/projects/${projectId}`);
      setProjects(prev =>
        prev.filter(p => p.id !== projectId)
      );
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  const canEdit = (project: Project) => {
    return isAdmin || project.createdBy.id === user?.id;
  };

  const safeProjects = Array.isArray(projects) ? projects : [];

  return (
    <PageContainer>
      <SectionHeader
        title="Projects"
        subtitle="Showcase and explore student work"
        action={
          <Button
            onClick={() => setCreateModalOpen(true)}
            variant="primary"
          >
            Create Project
          </Button>
        }
      />

      {loading ? (
        <Card>
          <CardContent>
            <div className="text-center py-16 text-neutral-400">
              Loading projects...
            </div>
          </CardContent>
        </Card>
      ) : safeProjects.length === 0 ? (
        <Card>
          <CardContent>
            <div className="text-center py-16 text-neutral-400">
              No projects yet. Be the first to create one.
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {safeProjects.map(project => (
            <Card key={project.id} hover>
              <CardContent>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-white flex-1">
                    {project.title}
                  </h3>

                  <span
                    className={`px-3 py-1 text-xs rounded-lg border ${
                      project.status === 'APPROVED'
                        ? 'border-white'
                        : project.status === 'PENDING'
                        ? 'border-neutral-500 text-neutral-400'
                        : 'border-neutral-700 text-neutral-500'
                    }`}
                  >
                    {project.status}
                  </span>
                </div>

                <p className="text-neutral-400 text-sm mb-4 line-clamp-3">
                  {project.description}
                </p>

                {Array.isArray(project.techStack) && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.techStack.map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 border border-neutral-600 rounded-lg text-xs"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex gap-4 text-sm text-neutral-400 mb-4">
                  <span>👁 {project.views}</span>
                  <span>❤ {project.likes}</span>
                </div>

                <div className="flex gap-2 text-xs mb-4">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 border border-white rounded-lg hover:bg-white hover:text-black transition"
                    >
                      GitHub
                    </a>
                  )}

                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 border border-white rounded-lg hover:bg-white hover:text-black transition"
                    >
                      Live
                    </a>
                  )}
                </div>

                <p className="text-xs text-neutral-500 mb-4">
                  By {project.createdBy.name} •{' '}
                  {new Date(project.createdAt).toLocaleDateString()}
                </p>

                {isAdmin && project.status === 'PENDING' && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleApprove(project.id)}
                      variant="primary"
                      className="w-full"
                    >
                      Approve
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => handleReject(project.id)}
                      variant="secondary"
                      className="w-full"
                    >
                      Reject
                    </Button>
                  </div>
                )}

                {!isAdmin && canEdit(project) && (
                  <Button
                    size="sm"
                    variant="secondary"
                    className="w-full"
                    onClick={() => handleDelete(project.id)}
                  >
                    Delete
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {createModalOpen && (
        <CreateProjectModal
          onSubmit={handleCreateProject}
          onClose={() => setCreateModalOpen(false)}
        />
      )}
    </PageContainer>
  );
};

export default Projects;
