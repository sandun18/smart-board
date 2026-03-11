import React from 'react';

const UserTable = ({ users, onView, onDelete }) => {
    // Show empty state
    if (!users || users.length === 0) {
        return (
            <div className="bg-card-bg rounded-large shadow-custom overflow-hidden">
                <div className="flex flex-col items-center justify-center p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <i className="fas fa-users text-2xl text-gray-400"></i>
                    </div>
                    <h3 className="text-lg font-bold text-text-dark mb-2">No Users Found</h3>
                    <p className="text-text-muted mb-4">
                        No users match your current filters or the backend connection failed.
                    </p>
                    <p className="text-xs text-gray-400">
                        Check browser console (F12) for error details
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-card-bg rounded-large shadow-custom overflow-hidden">
            {/* DESKTOP TABLE VIEW */}
            <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="p-5 font-bold text-text-muted">User</th>
                            <th className="p-5 font-bold text-text-muted">Role</th>
                            <th className="p-5 font-bold text-text-muted">Status</th>
                            <th className="p-5 font-bold text-text-muted">Joined</th>
                            <th className="p-5 font-bold text-text-muted text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="border-b border-gray-50 hover:bg-background-light/30 transition-colors">
                                <td className="p-5">
                                    <div className="flex items-center gap-3">
                                        <img src={user.avatar} className="w-10 h-10 rounded-full object-cover" alt="" />
                                        <div>
                                            <div className="font-bold text-text-dark">{user.name}</div>
                                            <div className="text-xs text-text-muted">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-5 capitalize">{user.role}</td>
                                <td className="p-5">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                        user.status === 'active' ? 'bg-success/10 text-success' : 'bg-red-alert/10 text-red-alert'
                                    }`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="p-5 text-sm text-text-muted">{user.registrationDate}</td>
                                <td className="p-5 text-right space-x-2">
                                    <button onClick={() => onView(user)} className="p-2 text-info hover:bg-info/10 rounded-lg">
                                        <i className="fas fa-eye"></i>
                                    </button>
                                    <button onClick={() => onDelete(user.id)} className="p-2 text-red-alert hover:bg-red-alert/10 rounded-lg">
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* MOBILE CARD VIEW */}
            <div className="lg:hidden divide-y divide-gray-100">
                {users.map(user => (
                    <div key={user.id} className="p-4 flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <img src={user.avatar} className="w-12 h-12 rounded-full object-cover border-2 border-accent/20" alt="" />
                                <div>
                                    <div className="font-bold text-text-dark">{user.name}</div>
                                    <div className="text-[11px] text-text-muted">{user.email}</div>
                                </div>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                                user.status === 'active' ? 'bg-success/10 text-success' : 'bg-red-alert/10 text-red-alert'
                            }`}>
                                {user.status}
                            </span>
                        </div>
                        
                        <div className="flex justify-between items-center bg-background-light/50 p-3 rounded-xl">
                            <div className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
                                Role: <span className="text-text-dark">{user.role}</span>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => onView(user)} className="w-9 h-9 flex items-center justify-center bg-white text-info rounded-full shadow-sm">
                                    <i className="fas fa-eye"></i>
                                </button>
                                <button onClick={() => onDelete(user.id)} className="w-9 h-9 flex items-center justify-center bg-white text-red-alert rounded-full shadow-sm">
                                    <i className="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserTable;