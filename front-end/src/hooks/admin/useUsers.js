import { useState, useMemo, useEffect, useCallback } from 'react';
import AdminService from '../../api/admin/AdminService';

export const useUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedUser, setSelectedUser] = useState(null);
    const [toast, setToast] = useState(null);
    const [error, setError] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const formatJoinedDate = (value) => {
        if (!value) return 'N/A';

        if (Array.isArray(value) && value.length >= 3) {
            const [year, month, day, hour = 0, minute = 0, second = 0] = value;
            const parsed = new Date(year, month - 1, day, hour, minute, second);
            return Number.isNaN(parsed.getTime())
                ? 'N/A'
                : parsed.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        }

        const parsed = new Date(value);
        if (!Number.isNaN(parsed.getTime())) {
            return parsed.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
        }

        return typeof value === 'string' ? value : 'N/A';
    };

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            const data = await AdminService.getAllUsers();

            if (!data || !Array.isArray(data)) {
                setError('Invalid data format from backend - expected array');
                setUsers([]);
                showToast('Invalid data format from backend', 'error');
                return;
            }
            
            if (data.length === 0) {
                setError('No users found in database');
            }
            
            // Keep UI model stable even if backend field names vary by role/user type.
            const mappedUsers = data.map(u => {
                const registrationDate = formatJoinedDate(
                    u.createdAt || u.joinedDate || u.created_date || null
                );
                
                return {
                    ...u,
                    name: u.fullName || u.name || 'Unknown',
                    status: (u.role === 'OWNER' && !u.verifiedOwner) ? 'pending' : 'active',
                    avatar: u.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.fullName || u.name || 'User')}&background=random`,
                    registrationDate: registrationDate
                };
            });

            setUsers(mappedUsers);
        } catch (error) {
            console.error('Failed to fetch users', error);
            setError(`Connection failed: ${error.response?.status === 401 ? 'Unauthorized - Please login again' : error.response?.status === 403 ? 'Forbidden - Admin access required' : error.message}`);
            showToast(`Connection to backend failed: ${error.message}`, 'error');
            setUsers([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const stats = useMemo(() => {
        return {
            total: users.length,
            students: users.filter(u => u.role === 'STUDENT').length,
            owners: users.filter(u => u.role === 'OWNER').length,
            admins: users.filter(u => u.role === 'ADMIN').length
        };
    }, [users]);

    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                user.email.toLowerCase().includes(searchTerm.toLowerCase());
            
            const filterRoleUpper = roleFilter === 'all' ? 'all' : roleFilter.toUpperCase();
            const matchesRole = filterRoleUpper === 'all' || user.role === filterRoleUpper;
            
            const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
            
            return matchesSearch && matchesRole && matchesStatus;
        });
    }, [users, searchTerm, roleFilter, statusFilter]);

    return {
        users: filteredUsers,
        loading,
        error,
        stats,
        searchTerm, setSearchTerm,
        roleFilter, setRoleFilter,
        statusFilter, setStatusFilter,
        selectedUser, setSelectedUser,
        toast, fetchUsers, showToast,
        resetFilters: () => { 
            setSearchTerm(''); 
            setRoleFilter('all');
            setStatusFilter('all');
        },
        removeUser: (id) => setUsers(prev => prev.filter(u => u.id !== id))
    };
};