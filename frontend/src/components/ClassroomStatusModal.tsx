import { useState, useEffect } from 'react';

interface Classroom {
  id: string;
  name: string;
  building: string;
  floor: number;
  status: 'FREE' | 'OCCUPIED' | 'RESERVED';
}

interface ClassroomStatusModalProps {
  classroom: Classroom;
  actionType: 'FREE' | 'OCCUPIED';
  onConfirm: (
    classroomId: string,
    status: 'FREE' | 'OCCUPIED',
    reason?: string
  ) => void;
  onClose: () => void;
}

export function ClassroomStatusModal({
  classroom,
  actionType,
  onConfirm,
  onClose,
}: ClassroomStatusModalProps) {
  const [reason, setReason] = useState('');

  const isSameStatus = classroom.status === actionType;

  const handleSubmit = () => {
    if (isSameStatus) return;
    onConfirm(classroom.id, actionType, reason || undefined);
  };

  // Close on Escape
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

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-black border border-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4">
          Mark as {actionType === 'FREE' ? 'Free' : 'Occupied'}
        </h2>

        <div className="mb-6">
          <p className="text-gray-400 mb-2">Classroom:</p>
          <p className="text-xl font-semibold">
            {classroom.name} — {classroom.building}, Floor {classroom.floor}
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Reason (Optional)
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter reason for status change..."
            className="w-full px-4 py-3 bg-black border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-white transition-colors resize-none"
            rows={3}
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-600 rounded-lg font-medium transition-all duration-200 hover:border-white"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={isSameStatus}
            className="flex-1 px-4 py-3 bg-white text-black rounded-lg font-medium transition-all duration-200 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
