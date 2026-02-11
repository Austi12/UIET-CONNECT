import { useState, useEffect } from 'react';
import apiClient from '../services/api';
import { useAuthStore } from '../store/authStore';

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
    // Auto-refresh every 30 seconds
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'FREE':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'OCCUPIED':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'RESERVED':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const buildings = [...new Set(classrooms.map((c) => c.building))];
  const floors = [...new Set(classrooms.map((c) => c.floor))];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading classrooms...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Classroom Availability</h1>
        <p className="text-gray-600">Real-time classroom status tracker</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Building</label>
            <select
              value={filter.building}
              onChange={(e) => setFilter({ ...filter, building: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Buildings</option>
              {buildings.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Floor</label>
            <select
              value={filter.floor}
              onChange={(e) => setFilter({ ...filter, floor: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Floors</option>
              {floors.map((f) => (
                <option key={f} value={f}>
                  Floor {f}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filter.status}
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Status</option>
              <option value="FREE">Free</option>
              <option value="OCCUPIED">Occupied</option>
              <option value="RESERVED">Reserved</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => setFilter({ building: '', floor: '', status: '' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Classrooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classrooms.map((classroom) => (
          <div
            key={classroom.id}
            className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 cursor-pointer"
            onClick={() => setSelectedClassroom(classroom)}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{classroom.name}</h3>
                <p className="text-sm text-gray-600">
                  {classroom.building} - Floor {classroom.floor}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                  classroom.status
                )}`}
              >
                {classroom.status}
              </span>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <p>Capacity: {classroom.capacity} students</p>
              {classroom.features.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {classroom.features.slice(0, 3).map((feature) => (
                    <span
                      key={feature}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                    >
                      {feature}
                    </span>
                  ))}
                  {classroom.features.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      +{classroom.features.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {classrooms.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-600">No classrooms found matching your filters</p>
        </div>
      )}

      {/* Classroom Detail Modal */}
      {selectedClassroom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedClassroom.name}</h3>
                <p className="text-sm text-gray-600">
                  {selectedClassroom.building} - Floor {selectedClassroom.floor}
                </p>
              </div>
              <button
                onClick={() => setSelectedClassroom(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <span
                  className={`inline-block px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(
                    selectedClassroom.status
                  )}`}
                >
                  {selectedClassroom.status}
                </span>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Capacity</p>
                <p className="text-gray-600">{selectedClassroom.capacity} students</p>
              </div>

              {selectedClassroom.features.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Features</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedClassroom.features.map((feature) => (
                      <span
                        key={feature}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {(user?.role === 'ADMIN' || user?.role === 'TEACHER') && (
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-3">Update Status</p>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => updateClassroomStatus(selectedClassroom.id, 'FREE')}
                      className="px-3 py-2 bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors text-sm font-medium"
                    >
                      Free
                    </button>
                    <button
                      onClick={() => updateClassroomStatus(selectedClassroom.id, 'OCCUPIED')}
                      className="px-3 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors text-sm font-medium"
                    >
                      Occupied
                    </button>
                    <button
                      onClick={() => updateClassroomStatus(selectedClassroom.id, 'RESERVED')}
                      className="px-3 py-2 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 transition-colors text-sm font-medium"
                    >
                      Reserved
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Classrooms;
