import React from 'react';
import { useNavigate } from 'react-router-dom';
import UserFilters from '../../components/admin/users/UserFilters';
import UserTable from '../../components/admin/users/UserTable';
import UserModal from '../../components/admin/users/UserModal';
import Toast from '../../components/admin/common/Toast';
import { useUsers } from '../../hooks/admin/useUsers';
import AdminService from '../../api/admin/AdminService';

// Reusable StatCard Component (Defined outside to keep main component clean)
const StatCard = ({ label, value, color, icon }) => (
    <div className={`bg-white p-3 lg:p-4 rounded-[20px] shadow-sm border-l-4 border-${color} flex items-center gap-3 lg:gap-4 flex-1 min-w-[140px]`}>
        <div className={`hidden sm:flex p-2 lg:p-3 bg-${color}/10 rounded-full text-${color}`}>
            <i className={`fas ${icon} text-sm lg:text-xl`}></i>
        </div>
        <div>
            <span className="block text-[10px] text-text-muted uppercase font-bold tracking-wider">{label}</span>
            <span className="text-lg lg:text-xl font-bold text-text-dark">{value}</span>
        </div>
    </div>
);

const AdminUsers = () => {
    const navigate = useNavigate();
    const { 
        users, stats, loading, searchTerm, setSearchTerm, roleFilter, setRoleFilter,
        statusFilter, setStatusFilter, selectedUser, setSelectedUser,
        toast, showToast, fetchUsers, resetFilters 
    } = useUsers();

    // Debug log
    React.useEffect(() => {
        console.log('📊 AdminUsers Component - Data Status:', {
            loading,
            userCount: users.length,
            stats,
            users: users.slice(0, 3) // Show first 3 for debugging
        });
    }, [users, loading, stats]);

    // HANDLER: Verify Owner (Connects to Spring Boot AdminController)
    const handleVerifyOwner = async (userId, isApproved) => {
        try {
            // Matches UserVerificationDTO.java { approved: boolean, reason: string }
            await AdminService.verifyOwner(userId, isApproved, "Admin verified via dashboard");
            showToast(`User ${isApproved ? 'verified' : 'rejected'} successfully`);
            fetchUsers(); // Re-fetch from Spring Boot
            setSelectedUser(null);
        } catch (error) {
            showToast('Failed to update user verification', 'error');
        }
    };

    const handleDeleteUser = (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            showToast('Delete functionality is handled via main User Service', 'info');
        }
    };

    return (
            <div className="relative">
                {toast && <Toast message={toast.message} type={toast.type} />}

                {/* QUICK STATS BAR */}
                <div className="grid grid-cols-2 lg:flex lg:flex-wrap gap-3 lg:gap-4 mb-6 lg:mb-8">
                    <StatCard label="Total Users" value={stats.total} color="primary" icon="fa-users" />
                    <StatCard label="Students" value={stats.students} color="success" icon="fa-graduation-cap" />
                    <StatCard label="Owners" value={stats.owners} color="warning" icon="fa-home" />
                    <StatCard label="Admins" value={stats.admins} color="info" icon="fa-user-shield" />
                </div>

                <UserFilters 
                    searchTerm={searchTerm} setSearchTerm={setSearchTerm}
                    roleFilter={roleFilter} setRoleFilter={setRoleFilter}
                    statusFilter={statusFilter} setStatusFilter={setStatusFilter}
                    onReset={resetFilters}
                />

                {loading ? (
                    <div className="flex flex-col items-center justify-center p-20 bg-white rounded-[25px] shadow-sm">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        <p className="mt-4 text-text-muted font-medium">Fetching from Spring Boot...</p>
                    </div>
                ) : (
                    <UserTable 
                        users={users} 
                        onView={setSelectedUser} 
                        onDelete={handleDeleteUser} 
                    />
                )}

                {selectedUser && (
                    <UserModal 
                        user={selectedUser} 
                        onClose={() => setSelectedUser(null)} 
                        onDelete={handleDeleteUser}
                        onVerify={handleVerifyOwner} 
                    />
                )}
            </div>
    );
};

export default AdminUsers;