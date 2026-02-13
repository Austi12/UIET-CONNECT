import { useAuthStore } from '../store/authStore';
import { DoorOpen, Search, FolderKanban, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageContainer, SectionHeader, Card, CardContent } from '../components/ui';

const Dashboard = () => {
  const { user } = useAuthStore();

  const cards = [
    {
      title: 'Classrooms',
      description: 'View available classrooms in real-time',
      icon: DoorOpen,
      link: '/classrooms',
      gradient: 'from-neutral-900 to-neutral-800',
    },
    {
      title: 'Lost & Found',
      description: 'AI-powered lost item matching',
      icon: Search,
      link: '/lost-found',
      gradient: 'from-neutral-900 to-neutral-800',
    },
    {
      title: 'Projects',
      description: 'Showcase your student projects',
      icon: FolderKanban,
      link: '/projects',
      gradient: 'from-neutral-900 to-neutral-800',
    },
    {
      title: 'Events',
      description: 'Register for campus events',
      icon: Calendar,
      link: '/events',
      gradient: 'from-neutral-900 to-neutral-800',
    },
  ];

  return (
    <PageContainer>
      {/* Welcome Section */}
      <Card className="mb-8 glass">
        <CardContent className="py-8">
          <h1 className="text-3xl font-bold text-white mb-3">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-neutral-400">
            {user?.department && user?.year 
              ? `${user.department} - Year ${user.year}`
              : 'UIET Connect Dashboard'}
          </p>
        </CardContent>
      </Card>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              to={card.link}
              className="group"
            >
              <Card hover className={`h-full bg-gradient-to-br ${card.gradient}`}>
                <CardContent className="py-8">
                  <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-200">
                    <Icon className="text-black" size={28} />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-white transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-sm text-neutral-400 group-hover:text-neutral-300 transition-colors">
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Recent Activity Section */}
      <Card>
        <CardContent>
          <SectionHeader
            title="Recent Activity"
            subtitle="Your latest interactions"
          />
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-neutral-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <p className="text-neutral-500">No recent activity to display</p>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
};

export default Dashboard;
