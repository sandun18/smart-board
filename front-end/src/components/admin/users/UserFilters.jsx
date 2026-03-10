import React from 'react';

const UserFilters = ({ searchTerm, setSearchTerm, roleFilter, setRoleFilter, statusFilter, setStatusFilter, onReset }) => {
    return (
        <div className="bg-card-bg p-4 lg:p-6 rounded-large shadow-custom mb-6 lg:mb-8">
            <div className="flex flex-col lg:flex-row lg:items-end gap-4">
                {/* Search Bar */}
                <div className="flex-1">
                    <label className="block text-xs lg:text-sm font-bold text-text-muted mb-2">Search Users</label>
                    <div className="relative">
                        <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                        <input 
                            type="text"
                            placeholder="Search by name..."
                            className="w-full pl-11 pr-4 py-2.5 lg:py-3 bg-background-light rounded-[15px] text-sm focus:ring-2 focus:ring-accent outline-none transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Filters Row */}
                <div className="flex gap-3">
                    <div className="flex-1 lg:w-40">
                        <label className="block text-xs lg:text-sm font-bold text-text-muted mb-2">Role</label>
                        <select 
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="w-full px-3 py-2.5 lg:py-3 bg-background-light rounded-[15px] text-sm outline-none appearance-none"
                        >
                            <option value="all">All Roles</option>
                            <option value="student">Student</option>
                            <option value="owner">Owner</option>
                        </select>
                    </div>
                    
                    <button 
                        onClick={onReset}
                        className="self-end px-6 py-2.5 lg:py-3 text-accent font-bold hover:bg-accent/10 rounded-[15px] transition-colors text-sm"
                    >
                        Reset
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserFilters;