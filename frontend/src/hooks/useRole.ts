import { useAuthStore } from '../store/authStore';

export const useRole = () => {
  const { user } = useAuthStore();
  
  const isAdmin = user?.role === 'ADMIN';
  const isStudent = user?.role === 'STUDENT';
  
  return {
    isAdmin,
    isStudent,
    role: user?.role,
  };
};

export const checkIsAdmin = (userRole?: string) => {
  return userRole === 'ADMIN';
};