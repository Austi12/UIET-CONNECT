import { useAuthStore } from '../store/authStore';
import { PageContainer, SectionHeader, Card, CardContent, Button } from '../components/ui';
import { User, Mail, Building, GraduationCap, Phone } from 'lucide-react';

const Profile = () => {
  const { user } = useAuthStore();

  return (
    <PageContainer>
      <SectionHeader
        title="Profile"
        subtitle="Manage your account settings"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardContent className="text-center">
            <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4">
              <User size={48} className="text-black" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">{user?.name}</h2>
            <p className="text-neutral-400 text-sm mb-4">{user?.role}</p>
            <Button variant="secondary" className="w-full">
              Edit Profile
            </Button>
          </CardContent>
        </Card>

        {/* Details Card */}
        <Card className="lg:col-span-2">
          <CardContent>
            <h3 className="text-lg font-semibold text-white mb-6">Account Information</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-neutral-800 rounded-xl border border-neutral-700">
                <div className="w-10 h-10 bg-neutral-700 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail size={20} className="text-neutral-300" />
                </div>
                <div>
                  <p className="text-sm text-neutral-400 mb-1">Email Address</p>
                  <p className="text-white font-medium">{user?.email}</p>
                </div>
              </div>

              {user?.department && (
                <div className="flex items-start gap-4 p-4 bg-neutral-800 rounded-xl border border-neutral-700">
                  <div className="w-10 h-10 bg-neutral-700 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Building size={20} className="text-neutral-300" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-400 mb-1">Department</p>
                    <p className="text-white font-medium">{user.department}</p>
                  </div>
                </div>
              )}

              {user?.year && (
                <div className="flex items-start gap-4 p-4 bg-neutral-800 rounded-xl border border-neutral-700">
                  <div className="w-10 h-10 bg-neutral-700 rounded-xl flex items-center justify-center flex-shrink-0">
                    <GraduationCap size={20} className="text-neutral-300" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-400 mb-1">Year</p>
                    <p className="text-white font-medium">{user.year}</p>
                  </div>
                </div>
              )}

              {user?.phoneNumber && (
                <div className="flex items-start gap-4 p-4 bg-neutral-800 rounded-xl border border-neutral-700">
                  <div className="w-10 h-10 bg-neutral-700 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone size={20} className="text-neutral-300" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-400 mb-1">Phone Number</p>
                    <p className="text-white font-medium">{user.phoneNumber}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default Profile;
