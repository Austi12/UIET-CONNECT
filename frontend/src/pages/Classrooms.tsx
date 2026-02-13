import { useState, useEffect } from 'react';
import apiClient from '../services/api';
import { useAuthStore } from '../store/authStore';
import { PageContainer, SectionHeader, Card, CardContent, Badge, Select, Button, LoadingPage } from '../components/ui';
import { X } from 'lucide-react';

interface Classroom {
  id: string;
  name: string;
  building: string;
  floor: number;
  capacity: number;
  status: 'FREE' | 'OCCUPIED' | 'RESERVED';
  features: string[];
}

const Classrooms = () => {
  const { user } = useAuthStore();
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ building: '', floor: '', status: '' });
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(null);

  const fetchClassrooms = async () => {
    try {
      const params = new URLSearchParams();
      if (filter.building) params.append('building', filter.building);
      if (filter.floor) params.append('floor', filter.floor);
      if (filter.status) params.append('status', filter.status);

      const response = await apiClient.get(`/classrooms?${params}`);
      setClassrooms(response.data.data.classrooms);
    } catch (error) {
      console.error('Failed to fetch classrooms:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassrooms();
    const interval = setInterval(fetchClassrooms, 30000);
    return () => clearInterval(interval);
  }, [filter]);

  const updateClassroomStatus = async (classroomId: string, newStatus: string) => {
    try {
      await apiClient.patch(`/classrooms/${classroomId}/status`, {
        status: newStatus,
        reason: `Updated by ${user?.name}`,
      });
      fetchClassrooms();
      setSelectedClassroom(null);
    } catch (error) {
      console.error('Failed to update classroom:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'FREE':
        return <Badge variant="success">{status}</Badge>;
      case 'OCCUPIED':
        return <Badge variant="danger">{status}</Badge>;
      case 'RESERVED':
        return <Badge variant="warning">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const buildings = [...new Set(classrooms.map((c) => c.building))];
  const floors = [...new Set(classrooms.map((c) => c.floor))];

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <PageContainer>
      <SectionHeader
        title="Classroom Availability"
        subtitle="Real-time classroom status tracker"
      />

      {/* Filters */}
      <Card className="mb-8">
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select
              label="Building"
              value={filter.building}
              onChange={(e) => setFilter({ ...filter, building: e.target.value })}
            >
              <option value="">All Buildings</option>
              {buildings.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </Select>

            <Select
              label="Floor"
              value={filter.floor}
              onChange={(e) => setFilter({ ...filter, floor: e.target.value })}
            >
              <option value="">All Floors</option>
              {floors.map((f) => (
                <option key={f} value={f}>Floor {f}</option>
              ))}
            </Select>

            <Select
              label="Status"
              value={filter.status}
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            >
              <option value="">All Status</option>
              <option value="FREE">Free</option>
              <option value="OCCUPIED">Occupied</option>
              <option value="RESERVED">Reserved</option>
            </Select>

            <div className="flex items-end">
              <Button
                onClick={() => setFilter({ building: '', floor: '', status: '' })}
                variant="ghost"
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Classrooms Grid */}
      {classrooms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classrooms.map((classroom) => (
            <Card
              key={classroom.id}
              hover
              className="cursor-pointer"
              onClick={() => setSelectedClassroom(classroom)}
            >
              <CardContent>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {classroom.name}
                    </h3>
                    <p className="text-sm text-neutral-400">
                      {classroom.building} • Floor {classroom.floor}
                    </p>
                  </div>
                  {getStatusBadge(classroom.status)}
                </div>

                <div className="space-y-2 mb-4">
                  <p className="text-sm text-neutral-400">
                    Capacity: <span className="text-white">{classroom.capacity} students</span>
                  </p>
                </div>

                {classroom.features.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {classroom.features.slice(0, 3).map((feature) => (
                      <span
                        key={feature}
                        className="px-2 py-1 bg-neutral-800 border border-neutral-700 text-neutral-300 rounded-lg text-xs"
                      >
                        {feature}
                      </span>
                    ))}
                    {classroom.features.length > 3 && (
                      <span className="px-2 py-1 bg-neutral-800 border border-neutral-700 text-neutral-300 rounded-lg text-xs">
                        +{classroom.features.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent>
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-neutral-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="text-neutral-400">No classrooms found matching your filters</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Classroom Detail Modal */}
      {selectedClassroom && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <Card className="max-w-md w-full glass">
            <CardContent>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {selectedClassroom.name}
                  </h3>
                  <p className="text-neutral-400">
                    {selectedClassroom.building} • Floor {selectedClassroom.floor}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedClassroom(null)}
                  className="p-2 hover:bg-neutral-800 rounded-xl transition-colors"
                >
                  <X size={20} className="text-neutral-400" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-sm text-neutral-400 mb-2">Current Status</p>
                  {getStatusBadge(selectedClassroom.status)}
                </div>

                <div>
                  <p className="text-sm text-neutral-400 mb-2">Capacity</p>
                  <p className="text-white font-medium">{selectedClassroom.capacity} students</p>
                </div>

                {selectedClassroom.features.length > 0 && (
                  <div>
                    <p className="text-sm text-neutral-400 mb-3">Features</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedClassroom.features.map((feature) => (
                        <span
                          key={feature}
                          className="px-3 py-1.5 bg-neutral-800 border border-neutral-700 text-neutral-200 rounded-xl text-sm"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {(user?.role === 'ADMIN' || user?.role === 'TEACHER') && (
                  <div className="pt-6 border-t border-neutral-800">
                    <p className="text-sm text-neutral-400 mb-4">Update Status</p>
                    <div className="grid grid-cols-3 gap-3">
                      <Button
                        onClick={() => updateClassroomStatus(selectedClassroom.id, 'FREE')}
                        variant={selectedClassroom.status === 'FREE' ? 'primary' : 'secondary'}
                        size="sm"
                        className="w-full"
                      >
                        Free
                      </Button>
                      <Button
                        onClick={() => updateClassroomStatus(selectedClassroom.id, 'OCCUPIED')}
                        variant={selectedClassroom.status === 'OCCUPIED' ? 'primary' : 'secondary'}
                        size="sm"
                        className="w-full"
                      >
                        Occupied
                      </Button>
                      <Button
                        onClick={() => updateClassroomStatus(selectedClassroom.id, 'RESERVED')}
                        variant={selectedClassroom.status === 'RESERVED' ? 'primary' : 'secondary'}
                        size="sm"
                        className="w-full"
                      >
                        Reserved
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </PageContainer>
  );
};

export default Classrooms;
