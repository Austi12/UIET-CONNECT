import { useAuthStore } from '../store/authStore';
import { DoorOpen, Search, FolderKanban, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuthStore();

  const cards = [
    {
      title: 'Classrooms',
      description: 'View available classrooms in real-time',
      icon: DoorOpen,
      link: '/classrooms',
      color: 'bg-blue-500',
    },
    {
      title: 'Lost & Found',
      description: 'AI-powered lost item matching',
      icon: Search,
      link: '/lost-found',
      color: 'bg-purple-500',
    },
    {
      title: 'Projects',
      description: 'Showcase your student projects',
      icon: FolderKanban,
      link: '/projects',
      color: 'bg-green-500',
    },
    {
      title: 'Events',
      description: 'Register for campus events',
      icon: Calendar,
      link: '/events',
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600">
          {user?.department && user?.year 
            ? `${user.department} - Year ${user.year}`
            : 'UIET Connect Dashboard'}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              to={card.link}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
            >
              <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center mb-4`}>
                <Icon className="text-white" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {card.title}
              </h3>
              <p className="text-sm text-gray-600">{card.description}</p>
            </Link>
          );
        })}
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
        <div className="text-center py-8 text-gray-500">
          <p>No recent activity to display</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
