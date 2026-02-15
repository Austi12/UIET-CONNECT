import { useState, useEffect } from 'react';
import apiClient from '../services/api';
import { PageContainer, SectionHeader, Card, CardContent, Badge, Button, LoadingPage } from '../components/ui';
import { Check, X, Shield, User } from 'lucide-react';

interface UserData {
    id: string;
    email: string;
    name: string;
    role: string;
    department: string;
    isApproved: boolean;
    isActive: boolean;
    createdAt: string;
}

const UserManagement = () => {
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const response = await apiClient.get('/users');
            setUsers(response.data.data.users);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleApprove = async (id: string) => {
        try {
            await apiClient.patch(`/users/${id}/approve`);
            fetchUsers();
        } catch (error) {
            console.error('Failed to approve user:', error);
        }
    };

    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            await apiClient.patch(`/users/${id}/status`, { isActive: !currentStatus });
            fetchUsers();
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    if (loading) return <LoadingPage />;

    return (
        <PageContainer>
            <SectionHeader
                title="User Management"
                subtitle="Approve and manage campus accounts"
            />

            <Card>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-neutral-800">
                                    <th className="pb-4 pt-2 font-medium text-neutral-400">User</th>
                                    <th className="pb-4 pt-2 font-medium text-neutral-400">Department</th>
                                    <th className="pb-4 pt-2 font-medium text-neutral-400">Status</th>
                                    <th className="pb-4 pt-2 font-medium text-neutral-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-800">
                                {users.map((user) => (
                                    <tr key={user.id} className="group">
                                        <td className="py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-neutral-800 rounded-xl flex items-center justify-center">
                                                    {user.role === 'ADMIN' ? (
                                                        <Shield size={20} className="text-white" />
                                                    ) : (
                                                        <User size={20} className="text-neutral-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-white">{user.name}</p>
                                                    <p className="text-xs text-neutral-500">{user.email} • {user.role}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 text-neutral-300">
                                            {user.department || 'N/A'}
                                        </td>
                                        <td className="py-4">
                                            <div className="flex gap-2">
                                                {!user.isApproved && (
                                                    <Badge variant="warning">Pending Approval</Badge>
                                                )}
                                                {user.isActive ? (
                                                    <Badge variant="success">Active</Badge>
                                                ) : (
                                                    <Badge variant="danger">Deactivated</Badge>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                {!user.isApproved && (
                                                    <Button
                                                        size="sm"
                                                        variant="primary"
                                                        onClick={() => handleApprove(user.id)}
                                                        className="bg-green-600 hover:bg-green-500 border-none px-3"
                                                    >
                                                        <Check size={16} />
                                                    </Button>
                                                )}
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    onClick={() => handleToggleStatus(user.id, user.isActive)}
                                                    className="px-3"
                                                >
                                                    {user.isActive ? <X size={16} /> : <Check size={16} />}
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </PageContainer>
    );
};

export default UserManagement;
