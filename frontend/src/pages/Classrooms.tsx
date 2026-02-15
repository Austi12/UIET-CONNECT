import { useState, useEffect } from 'react';
import apiClient from '../services/api';
import { useAuthStore } from '../store/authStore';
import {
  PageContainer,
  SectionHeader,
  Card,
  CardContent,
  Select,
  Button,
  LoadingPage,
} from '../components/ui';
import { X } from 'lucide-react';

interface Classroom {
  id: string;
  name: string;
  building: string;
  floor: number;
  capacity: number;
  status: 'FREE' | 'OCCUPIED' | 'RESERVED';
  features: string[];
  updatedAt?: string;
}

const Classrooms = () => {
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN';

  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState({
    building: '',
    floor: '',
    status: '',
  });

  const [selectedClassroom, setSelectedClassroom] =
    useState<Classroom | null>(null);

  const [reason, setReason] = useState('');
  const [newStatus, setNewStatus] = useState<
    'FREE' | 'OCCUPIED' | 'RESERVED'
  >('FREE');

  // =============================
  // Fetch Classrooms
  // =============================
  const fetchClassrooms = async () => {
    try {
      const params = new URLSearchParams();

      if (filter.building) params.append('building', filter.building);
      if (filter.floor) params.append('floor', filter.floor);
      if (filter.status) params.append('status', filter.status);

      const response = await apiClient.get(
        `/classrooms?${params.toString()}`
      );

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

  // =============================
  // Status Update (Admin Only)
  // =============================
  const handleStatusUpdate = async () => {
    if (!selectedClassroom) return;

    try {
      await apiClient.patch(
        `/classrooms/${selectedClassroom.id}/status`,
        {
          status: newStatus,
          reason: reason || `Updated by ${user?.name}`,
        }
      );

      // Optimistic update
      setClassrooms((prev) =>
        prev.map((c) =>
          c.id === selectedClassroom.id
            ? { ...c, status: newStatus, updatedAt: new Date().toISOString() }
            : c
        )
      );

      setSelectedClassroom(null);
      setReason('');
    } catch (error) {
      console.error('Failed to update classroom:', error);
    }
  };

  // =============================
  // Status Badge
  // =============================
  const getStatusBadge = (status: string) => {
    return (
      <span
        className={`px-3 py-1 text-xs font-medium rounded-lg border ${
          status === 'FREE'
            ? 'border-white text-white'
            : status === 'OCCUPIED'
            ? 'bg-white text-black'
            : 'border-gray-500 text-gray-400'
        }`}
      >
        {status}
      </span>
    );
  };

  const buildings = [...new Set(classrooms.map((c) => c.building))];
  const floors = [...new Set(classrooms.map((c) => c.floor))];

  if (loading) return <LoadingPage />;

  return (
    <PageContainer>
      <SectionHeader
        title="Classroom Availability"
        subtitle="Real-time classroom status tracker"
      />

      {/* =============================
          FILTERS
      ============================= */}
      <Card className="mb-8">
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select
              label="Building"
              value={filter.building}
              onChange={(e) =>
                setFilter({ ...filter, building: e.target.value })
              }
            >
              <option value="">All Buildings</option>
              {buildings.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </Select>

            <Select
              label="Floor"
              value={filter.floor}
              onChange={(e) =>
                setFilter({ ...filter, floor: e.target.value })
              }
            >
              <option value="">All Floors</option>
              {floors.map((f) => (
                <option key={f} value={f}>
                  Floor {f}
                </option>
              ))}
            </Select>

            <Select
              label="Status"
              value={filter.status}
              onChange={(e) =>
                setFilter({ ...filter, status: e.target.value })
              }
            >
              <option value="">All Status</option>
              <option value="FREE">Free</option>
              <option value="OCCUPIED">Occupied</option>
              <option value="RESERVED">Reserved</option>
            </Select>

            <div className="flex items-end">
              <Button
                variant="secondary"
                onClick={() =>
                  setFilter({ building: '', floor: '', status: '' })
                }
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* =============================
          CLASSROOM GRID
      ============================= */}
      {classrooms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classrooms.map((classroom) => (
            <Card
              key={classroom.id}
              hover
              className="transition-all duration-200 hover:scale-[1.02]"
              onClick={() => setSelectedClassroom(classroom)}
            >
              <CardContent>
                <div className="flex justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {classroom.name}
                    </h3>
                    <p className="text-neutral-400 text-sm">
                      {classroom.building} • Floor {classroom.floor}
                    </p>
                  </div>
                  {getStatusBadge(classroom.status)}
                </div>

                <p className="text-sm text-neutral-400 mb-3">
                  Capacity:{' '}
                  <span className="text-white">
                    {classroom.capacity} students
                  </span>
                </p>

                {classroom.features?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {classroom.features.slice(0, 3).map((feature) => (
                      <span
                        key={feature}
                        className="px-2 py-1 border border-gray-600 text-gray-300 text-xs rounded-lg"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent>
            <div className="text-center py-12 text-neutral-400">
              No classrooms found matching your filters
            </div>
          </CardContent>
        </Card>
      )}

      {/* =============================
          MODAL
      ============================= */}
      {selectedClassroom && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full">
            <CardContent>
              <div className="flex justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {selectedClassroom.name}
                  </h3>
                  <p className="text-neutral-400 text-sm">
                    {selectedClassroom.building} • Floor{' '}
                    {selectedClassroom.floor}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedClassroom(null)}
                  className="text-neutral-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mb-4">
                <p className="text-sm text-neutral-400 mb-2">
                  Current Status
                </p>
                {getStatusBadge(selectedClassroom.status)}
              </div>

              {isAdmin && (
                <>
                  <div className="space-y-3 mt-6">
                    <Select
                      label="Change Status"
                      value={newStatus}
                      onChange={(e) =>
                        setNewStatus(
                          e.target.value as
                            | 'FREE'
                            | 'OCCUPIED'
                            | 'RESERVED'
                        )
                      }
                    >
                      <option value="FREE">Free</option>
                      <option value="OCCUPIED">Occupied</option>
                      <option value="RESERVED">Reserved</option>
                    </Select>

                    <textarea
                      placeholder="Reason (optional)"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-full bg-black border border-gray-700 text-white p-3 rounded-lg text-sm"
                    />

                    <Button
                      variant="primary"
                      onClick={handleStatusUpdate}
                      className="w-full"
                    >
                      Confirm Update
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </PageContainer>
  );
};

export default Classrooms;

