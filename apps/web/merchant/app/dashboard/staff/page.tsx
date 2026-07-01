'use client';

import React, { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import { useStore } from '../../store/useStore';
import InviteStaffDialog from '../../components/InviteStaffDialog';

interface StaffMember {
  merchant_id: number;
  user_id: number;
  role: string;
  status: string;
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
  };
}

interface PendingInvitation {
  id: number;
  merchant_id: number;
  email: string;
  role: string;
  status: string;
  created_at: string;
  expire_at: string;
  token: string;
}

export default function StaffPage() {
  const currentStore = useStore((state) => state.currentStore);
  const [searchQuery, setSearchQuery] = useState('');
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [pendingInvitations, setPendingInvitations] = useState<PendingInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [editingMember, setEditingMember] = useState<StaffMember | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [newRole, setNewRole] = useState('');

  const fetchStaff = async () => {
    if (!currentStore?.id) return;
    setLoading(true);
    setError(null);

    try {
      const [staffResponse, invitationsResponse] = await Promise.all([
        apiClient.get('/merchant-members', { params: { merchantId: currentStore.id } }),
        apiClient.get('/merchant-invitations', { params: { merchantId: currentStore.id } })
      ]);
      setStaff(staffResponse.data);
      setPendingInvitations(invitationsResponse.data.filter((inv: PendingInvitation) => inv.status === 'pending'));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load staff');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, [currentStore]);

  const getStaffName = (member: StaffMember) => {
    if (member.user) {
      return `${member.user.first_name || ''} ${member.user.last_name || ''}`.trim() || member.user.email;
    }
    return 'Unknown';
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'pending':
        return 'bg-green-500/20 text-green-500';
      case 'inactive':
        return 'bg-gray-500/20 text-gray-500';
      default:
        return 'bg-gray-500/20 text-gray-500';
    }
  };

  const handleCancelInvitation = async (invitationId: number) => {
    if (!currentStore?.id) return;
    try {
      await apiClient.patch(`/merchant-invitations/${invitationId}/cancel`, {}, {
        params: { merchantId: currentStore.id }
      });
      fetchStaff();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to cancel invitation';
      setError(errorMessage);
      alert(errorMessage);
    }
  };

  const handleResendInvitation = async (invitationId: number) => {
    if (!currentStore?.id) return;
    try {
      await apiClient.post(`/merchant-invitations/${invitationId}/resend`, {}, {
        params: { merchantId: currentStore.id }
      });
      alert('Invitation resent successfully');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to resend invitation';
      setError(errorMessage);
      alert(errorMessage);
    }
  };

  const handleCopyLink = async (token: string) => {
    const link = `${window.location.origin}/invite/${token}`;
    await navigator.clipboard.writeText(link);
    alert('Link copied to clipboard');
  };

  const handleDeleteStaff = async (member: StaffMember) => {
    if (!currentStore?.id) return;
    
    const confirmed = window.confirm(`Are you sure you want to remove ${getStaffName(member)} from the staff?`);
    if (!confirmed) return;

    try {
      await apiClient.delete(`/merchant-members/${member.user_id}`, {
        params: { merchantId: currentStore.id }
      });
      fetchStaff();
      alert('Staff member removed successfully');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to remove staff member';
      setError(errorMessage);
      alert(errorMessage);
    }
  };

  const handleEditStaff = (member: StaffMember) => {
    setEditingMember(member);
    setNewRole(member.role);
    setShowEditDialog(true);
  };

  const handleUpdateRole = async () => {
    if (!editingMember || !currentStore?.id) return;

    try {
      await apiClient.patch(`/merchant-members/${editingMember.user_id}/role`, 
        { role: newRole },
        { params: { merchantId: currentStore.id } }
      );
      fetchStaff();
      setShowEditDialog(false);
      setEditingMember(null);
      alert('Role updated successfully');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update role';
      setError(errorMessage);
      alert(errorMessage);
    }
  };

  const handleToggleStatus = async (member: StaffMember) => {
    if (!currentStore?.id) return;

    const newStatus = member.status === 'active' ? 'inactive' : 'active';
    const confirmed = window.confirm(
      `Are you sure you want to set ${getStaffName(member)} to ${newStatus} in this store? ${newStatus === 'inactive' ? 'They will not be able to access this store.' : ''}`
    );
    
    if (!confirmed) return;

    try {
      await apiClient.patch(`/merchant-members/${member.user_id}/status`, 
        { status: newStatus },
        { params: { merchantId: currentStore.id } }
      );
      fetchStaff();
      alert(`Staff member ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update status';
      setError(errorMessage);
      alert(errorMessage);
    }
  };

  const canEditOrDelete = (member: StaffMember) => {
    if (!currentStore) return false;
    
    // Get current user ID from localStorage
    const userStr = localStorage.getItem('user');
    const currentUser = userStr ? JSON.parse(userStr) : null;
    const currentUserId = currentUser?.id;

    // Owner/co-owner can edit/delete anyone except themselves (case-insensitive)
    if (currentStore.role.toLowerCase() === 'owner' || currentStore.role.toLowerCase() === 'co-owner') {
      return member.user_id !== currentUserId;
    }
    
    // Manager can edit/delete non-owners (case-insensitive)
    if (currentStore.role.toLowerCase() === 'manager') {
      return member.role.toLowerCase() !== 'owner' && member.role.toLowerCase() !== 'co-owner';
    }
    
    // Cashier cannot edit/delete
    return false;
  };

  const canChangeStatus = (member: StaffMember) => {
    if (!currentStore) return false;
    
    // Get current user ID from localStorage
    const userStr = localStorage.getItem('user');
    const currentUser = userStr ? JSON.parse(userStr) : null;
    const currentUserId = currentUser?.id;

    // Owner/co-owner can change status of anyone except themselves
    if (currentStore.role.toLowerCase() === 'owner' || currentStore.role.toLowerCase() === 'co-owner') {
      return member.user_id !== currentUserId;
    }
    
    // Manager can change status of non-owners
    if (currentStore.role.toLowerCase() === 'manager') {
      return member.role.toLowerCase() !== 'owner' && member.role.toLowerCase() !== 'co-owner';
    }
    
    // Cashier cannot change status
    return false;
  };

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: '#22c55e' }}>
          Staff
        </h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search staff..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 px-4 py-3 rounded-lg border-2 bg-[#1a1a1a] text-[#22c55e] placeholder-gray-500 focus:outline-none focus:border-[#22c55e] transition-colors"
              style={{ borderColor: '#333' }}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <button 
            onClick={() => setShowInviteDialog(true)}
            className="px-4 sm:px-6 py-3 rounded-lg font-medium bg-[#22c55e] text-[#1a1a1a] hover:bg-[#16a34a] transition-colors text-sm sm:text-base"
          >
            Invite Staff
          </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-[#222] rounded-xl border border-[#333] overflow-hidden">
          <div className="p-4 border-b border-[#333] flex gap-4">
            <div className="h-4 w-32 bg-[#333] rounded animate-pulse"></div>
            <div className="h-4 w-32 bg-[#333] rounded animate-pulse"></div>
            <div className="h-4 w-20 bg-[#333] rounded animate-pulse"></div>
            <div className="h-4 w-20 bg-[#333] rounded animate-pulse"></div>
            <div className="h-4 w-24 bg-[#333] rounded animate-pulse"></div>
          </div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4 border-b border-[#333] flex gap-4">
              <div className="h-4 w-32 bg-[#333] rounded animate-pulse"></div>
              <div className="h-4 w-40 bg-[#333] rounded animate-pulse"></div>
              <div className="h-4 w-20 bg-[#333] rounded animate-pulse"></div>
              <div className="h-4 w-20 bg-[#333] rounded animate-pulse"></div>
              <div className="flex gap-2">
                <div className="h-8 w-8 bg-[#333] rounded animate-pulse"></div>
                <div className="h-8 w-8 bg-[#333] rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {staff.length === 0 ? (
            <div className="bg-[#222] rounded-xl border border-[#333] p-12 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mx-auto mb-4"
                style={{ color: '#333' }}
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <h3 className="text-lg sm:text-xl font-semibold mb-2" style={{ color: '#9ca3af' }}>
                No staff yet
              </h3>
              <p className="mb-6 text-sm sm:text-base" style={{ color: '#666' }}>
                Invite team members to help manage your store.
              </p>
              <button 
                onClick={() => setShowInviteDialog(true)}
                className="px-4 sm:px-6 py-3 rounded-lg font-medium bg-[#22c55e] text-[#1a1a1a] hover:bg-[#16a34a] transition-colors text-sm sm:text-base"
              >
                Invite Staff
              </button>
            </div>
          ) : (
            <>
              {/* Pending Invitations Section */}
              {pendingInvitations.length > 0 && (
                <div className="bg-[#222] rounded-xl border border-[#333] overflow-hidden mb-6">
                  <div className="p-4 border-b border-[#333]">
                    <h3 className="text-lg font-semibold" style={{ color: '#22c55e' }}>Pending Invitations</h3>
                  </div>
                  <div className="divide-y divide-[#333]">
                    {pendingInvitations.map((invitation) => (
                      <div key={invitation.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="font-medium text-sm sm:text-base" style={{ color: '#22c55e' }}>{invitation.email}</div>
                          <div className="text-sm" style={{ color: '#9ca3af' }}>{invitation.role}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invitation.status)}`}>
                              {invitation.status}
                            </span>
                            <span className="text-xs" style={{ color: '#666' }}>
                              Expires: {new Date(invitation.expire_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleResendInvitation(invitation.id)}
                            className="px-3 py-2 rounded-lg text-sm font-medium border border-[#444] bg-[#1a1a1a] text-gray-300 hover:bg-[#2a2a2a] hover:text-white transition-colors"
                          >
                            Resend
                          </button>
                          <button 
                            onClick={() => handleCopyLink(invitation.token || '')}
                            className="px-3 py-2 rounded-lg text-sm font-medium border border-[#444] bg-[#1a1a1a] text-gray-300 hover:bg-[#2a2a2a] hover:text-white transition-colors"
                          >
                            Copy Link
                          </button>
                          <button 
                            onClick={() => handleCancelInvitation(invitation.id)}
                            className="px-3 py-2 rounded-lg text-sm font-medium border border-red-500/50 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Active Staff Section */}
              <div className="bg-[#222] rounded-xl border border-[#333] overflow-hidden responsive-table">
                <div className="p-4 border-b border-[#333]">
                  <h3 className="text-lg font-semibold" style={{ color: '#22c55e' }}>Active Staff</h3>
                </div>
                <table className="w-full">
                <thead>
                  <tr className="border-b border-[#333]">
                    <th className="text-left p-3 sm:p-4 font-medium text-sm sm:text-base" style={{ color: '#9ca3af' }}>Staff Member</th>
                    <th className="text-left p-3 sm:p-4 font-medium text-sm sm:text-base hidden sm:table-cell" style={{ color: '#9ca3af' }}>Email</th>
                    <th className="text-left p-3 sm:p-4 font-medium text-sm sm:text-base" style={{ color: '#9ca3af' }}>Role</th>
                    <th className="text-left p-3 sm:p-4 font-medium text-sm sm:text-base" style={{ color: '#9ca3af' }}>Status</th>
                    <th className="text-left p-3 sm:p-4 font-medium text-sm sm:text-base" style={{ color: '#9ca3af' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {staff.map((member) => (
                    <tr key={`${member.merchant_id}-${member.user_id}`} className="border-b border-[#333] hover:bg-[#333] transition-colors">
                      <td className="p-3 sm:p-4 font-medium text-sm sm:text-base" style={{ color: '#22c55e' }}>{getStaffName(member)}</td>
                      <td className="p-3 sm:p-4 text-sm sm:text-base hidden sm:table-cell" style={{ color: '#9ca3af' }}>{member.user?.email || 'N/A'}</td>
                      <td className="p-3 sm:p-4 text-sm sm:text-base" style={{ color: '#9ca3af' }}>{member.role}</td>
                      <td className="p-3 sm:p-4">
                        <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status || 'inactive')}`}>
                          {member.status || 'Inactive'}
                        </span>
                      </td>
                      <td className="p-3 sm:p-4">
                        <div className="flex gap-2">
                          {canEditOrDelete(member) && (
                            <>
                              <button 
                                onClick={() => handleEditStaff(member)}
                                className="p-2 rounded hover:bg-[#444] transition-colors" 
                                style={{ color: '#22c55e' }}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                              </button>
                              <button 
                                onClick={() => handleDeleteStaff(member)}
                                className="p-2 rounded hover:bg-[#444] transition-colors" 
                                style={{ color: '#ef4444' }}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="3 6 5 6 21 6"></polyline>
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                              </button>
                            </>
                          )}
                          {canChangeStatus(member) && (
                            <button 
                              onClick={() => handleToggleStatus(member)}
                              className="p-2 rounded hover:bg-[#444] transition-colors" 
                              style={{ color: member.status === 'active' ? '#f59e0b' : '#22c55e' }}
                              title={member.status === 'active' ? 'Deactivate' : 'Activate'}
                            >
                              {member.status === 'active' ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                </svg>
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                </table>
              </div>
            </>
          )}
        </>
      )}

      <InviteStaffDialog
        show={showInviteDialog}
        onClose={() => setShowInviteDialog(false)}
        onSuccess={fetchStaff}
        merchantId={currentStore?.id || 0}
      />

      {/* Edit Role Dialog */}
      {showEditDialog && editingMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#222] rounded-xl border border-[#333] p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4" style={{ color: '#22c55e' }}>
              Edit Staff Role
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" style={{ color: '#9ca3af' }}>
                Staff Member
              </label>
              <div className="px-4 py-3 rounded-lg bg-[#333]" style={{ color: '#22c55e' }}>
                {getStaffName(editingMember)}
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2" style={{ color: '#9ca3af' }}>
                Role
              </label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-[#1a1a1a] border-2 focus:outline-none focus:border-[#22c55e] transition-colors"
                style={{ borderColor: '#333', color: '#22c55e' }}
              >
                <option value="owner">Owner</option>
                <option value="manager">Manager</option>
                <option value="cashier">Cashier</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowEditDialog(false);
                  setEditingMember(null);
                }}
                className="flex-1 px-4 py-3 rounded-lg font-medium border border-[#444] bg-[#1a1a1a] text-gray-300 hover:bg-[#2a2a2a] hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateRole}
                className="flex-1 px-4 py-3 rounded-lg font-medium bg-[#22c55e] text-[#1a1a1a] hover:bg-[#16a34a] transition-colors"
              >
                Update Role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
