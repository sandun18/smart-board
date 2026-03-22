import React from 'react';
import { useNavigate } from 'react-router-dom';
import UserFilters from '../../components/admin/users/UserFilters';
import UserTable from '../../components/admin/users/UserTable';
import UserModal from '../../components/admin/users/UserModal';
import Toast from '../../components/admin/common/Toast';
import { useUsers } from '../../hooks/admin/useUsers';
import AdminService from '../../api/admin/AdminService';

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
        users, stats, loading, error, searchTerm, setSearchTerm, roleFilter, setRoleFilter,
        statusFilter, setStatusFilter, selectedUser, setSelectedUser,
        toast, showToast, fetchUsers, resetFilters, removeUser,
        totalItems, totalPages, currentPage, setCurrentPage, pageSize, setPageSize
    } = useUsers();

    const handleVerifyOwner = async (userId, isApproved) => {
        try {
            await AdminService.verifyOwner(userId, isApproved, isApproved ? "Owner approved by admin" : "Owner rejected by admin");
            showToast(`User ${isApproved ? 'verified' : 'rejected'} successfully`, 'success');
            fetchUsers();
            setSelectedUser(null);
        } catch (error) {
            console.error('Verification error:', error);
            showToast(`Failed to update user verification: ${error.response?.data?.message || error.message}`, 'error');
        }
    };

    const [deleteTarget, setDeleteTarget] = React.useState(null);
    const [deleting, setDeleting] = React.useState(false);

    const handleDeleteUser = (id) => {
        setDeleteTarget(id);
    };

    const confirmDeleteUser = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            await AdminService.deleteUser(deleteTarget);
            removeUser(deleteTarget);
            showToast('User deleted successfully', 'success');
            fetchUsers();
        } catch (err) {
            console.error('Delete user failed', err);
            showToast(err.response?.data?.message || 'Failed to delete user', 'error');
        } finally {
            setDeleting(false);
            setDeleteTarget(null);
        }
    };

    const cancelDelete = () => setDeleteTarget(null);

    return (
            <div className="relative">
                {toast && <Toast message={toast.message} type={toast.type} />}

                {/* Delete Confirmation Modal */}
                {deleteTarget && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                        <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-red-alert/10 text-red-alert flex items-center justify-center text-2xl">
                                    <i className="fas fa-trash-alt"></i>
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-lg font-bold text-text-dark">Delete User</h4>
                                    <p className="text-sm text-text-muted mt-2">Are you sure you want to permanently delete this user? This action cannot be undone.</p>
                                </div>
                            </div>
                            <div className="mt-6 flex gap-3 justify-end">
                                <button onClick={cancelDelete} className="px-4 py-2 rounded-lg bg-gray-100 text-text-dark font-bold">Cancel</button>
                                <button onClick={confirmDeleteUser} disabled={deleting} className="px-4 py-2 rounded-lg bg-red-alert text-white font-bold">
                                    {deleting ? 'Deleting...' : 'Yes, Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

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
                ) : error ? (
                    <div className="flex flex-col items-center justify-center p-20 bg-white rounded-[25px] shadow-sm border-2 border-error">
                        <div className="text-4xl text-error mb-4">⚠️</div>
                        <p className="text-error font-bold text-center mb-2">{error}</p>
                        <p className="text-text-muted text-sm text-center mb-4">Check browser console for more details</p>
                        <button 
                            onClick={() => fetchUsers()}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-accent transition-colors"
                        >
                            Retry Loading
                        </button>
                    </div>
                ) : (
                    <UserTable 
                        users={users} 
                        onView={setSelectedUser} 
                        onDelete={handleDeleteUser} 
                    />
                )}

                {!loading && !error && totalItems > 0 && (
                    <div className="mt-4 bg-white rounded-[18px] px-4 py-3 shadow-sm border border-gray-100 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-sm text-text-muted font-medium">
                            Showing {(currentPage - 1) * pageSize + 1}
                            {' '}-{' '}
                            {Math.min(currentPage * pageSize, totalItems)} of {totalItems} users
                        </div>

                        <div className="flex items-center gap-3">
                            <select
                                value={pageSize}
                                onChange={(e) => setPageSize(Number(e.target.value))}
                                className="px-3 py-2 bg-background-light rounded-lg text-sm outline-none"
                                aria-label="Users per page"
                            >
                                <option value={5}>5 / page</option>
                                <option value={10}>10 / page</option>
                                <option value={20}>20 / page</option>
                                <option value={50}>50 / page</option>
                            </select>

                            <button
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                disabled={currentPage <= 1}
                                className="px-3 py-2 rounded-lg border border-gray-200 text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Prev
                            </button>
                            <span className="text-sm font-bold text-text-dark min-w-[90px] text-center">
                                Page {currentPage} / {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                disabled={currentPage >= totalPages}
                                className="px-3 py-2 rounded-lg border border-gray-200 text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    </div>
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
