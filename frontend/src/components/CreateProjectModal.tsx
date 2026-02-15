import { useState, useEffect } from 'react';

interface CreateProjectData {
  title: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
}

interface CreateProjectModalProps {
  onSubmit: (data: CreateProjectData) => void;
  onClose: () => void;
}

export function CreateProjectModal({ onSubmit, onClose }: CreateProjectModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    techStack: '',
    githubUrl: '',
    liveUrl: '',
  });

  const [submitting, setSubmitting] = useState(false);

  // Close on ESC + lock scroll
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const isValid = () => {
    return (
      formData.title.trim().length > 0 &&
      formData.description.trim().length > 0 &&
      formData.techStack.trim().length > 0
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid()) return;

    setSubmitting(true);

    const techStackArray = formData.techStack
      .split(',')
      .map((tech) => tech.trim())
      .filter((tech) => tech.length > 0);

    const payload: CreateProjectData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      techStack: techStackArray,
      githubUrl: formData.githubUrl.trim() || undefined,
      liveUrl: formData.liveUrl.trim() || undefined,
    };

    await onSubmit(payload);
    setSubmitting(false);
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-black border border-white rounded-xl p-8 max-w-2xl w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-3xl font-bold mb-6 border-b border-white pb-4">
          Create New Project
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Project Title *
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter project title"
              className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Description *
            </label>
            <textarea
              name="description"
              required
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your project"
              rows={4}
              className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors resize-none"
            />
          </div>

          {/* Tech Stack */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Tech Stack *
            </label>
            <input
              type="text"
              name="techStack"
              required
              value={formData.techStack}
              onChange={handleChange}
              placeholder="React, TypeScript, Node.js"
              className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
            />
            <p className="text-xs text-gray-500 mt-1">
              Separate technologies with commas
            </p>
          </div>

          {/* GitHub */}
          <div>
            <label className="block text-sm font-medium mb-2">
              GitHub URL
            </label>
            <input
              type="url"
              name="githubUrl"
              value={formData.githubUrl}
              onChange={handleChange}
              placeholder="https://github.com/username/repo"
              className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
            />
          </div>

          {/* Live URL */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Live URL
            </label>
            <input
              type="url"
              name="liveUrl"
              value={formData.liveUrl}
              onChange={handleChange}
              placeholder="https://yourproject.com"
              className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-600 rounded-lg font-medium transition-all duration-200 hover:border-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!isValid() || submitting}
              className="flex-1 px-6 py-3 bg-white text-black rounded-lg font-medium transition-all duration-200 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {submitting ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
