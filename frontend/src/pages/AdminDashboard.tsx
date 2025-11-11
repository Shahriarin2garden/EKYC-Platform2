import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

interface KycApplication {
  _id: string;
  name: string;
  email: string;
  address?: string;
  nid?: string;
  occupation?: string;
  status: string;
  submittedAt: string;
  aiSummary?: string;
}

interface Statistics {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  under_review: number;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [kycApplications, setKycApplications] = useState<KycApplication[]>([]);
  const [statistics, setStatistics] = useState<Statistics>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    under_review: 0,
  });
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState('Admin');

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin');
      return;
    }

    // Get admin name
    const name = localStorage.getItem('adminName');
    if (name) {
      setAdminName(name);
    }

    // Fetch data
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch KYC applications
      const kycResponse = await axios.get('http://localhost:5000/api/kyc', { headers });
      if (kycResponse.data.success) {
        setKycApplications(kycResponse.data.data.kyc || []);
      }

      // Fetch statistics
      const statsResponse = await axios.get('http://localhost:5000/api/kyc/statistics', { headers });
      if (statsResponse.data.success) {
        setStatistics(statsResponse.data.data || {});
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminEmail');
    localStorage.removeItem('adminName');
    navigate('/admin');
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `http://localhost:5000/api/kyc/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        // Refresh data
        fetchData();
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-300';
      case 'rejected':
        return 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-300';
      case 'under_review':
        return 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border border-yellow-300';
      default:
        return 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border border-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50">
        <div className="text-center animate-fade-in-up">
          <div className="relative inline-flex items-center justify-center mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-2xl opacity-30 animate-pulse-slow"></div>
            <div className="relative w-20 h-20 border-4 border-transparent border-t-blue-600 border-r-purple-600 rounded-full animate-spin"></div>
          </div>
          <p className="text-lg font-bold gradient-text">Loading dashboard...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50">
      {/* Decorative background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Header */}
      <header className="relative glass border-b border-gray-200/50 shadow-soft animate-fade-in-down">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-extrabold gradient-text mb-2">Admin Dashboard</h1>
              <p className="text-base text-gray-600 font-medium">Welcome back, <span className="text-blue-600">{adminName}</span>! 👋</p>
            </div>
            <button
              onClick={handleLogout}
              className="group flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl hover:from-red-600 hover:to-rose-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 font-semibold"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {/* Total Applications */}
          <div className="glass rounded-2xl shadow-soft p-6 border transform transition-all duration-300 hover:scale-105 hover:shadow-lg card-hover animate-fade-in-up">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-600 uppercase tracking-wide mb-2">Total</p>
                <p className="text-4xl font-extrabold gradient-text">{statistics.total}</p>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500 rounded-2xl blur-lg opacity-30"></div>
                <div className="relative w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3 font-medium">Applications received</p>
          </div>

          {/* Pending */}
          <div className="glass rounded-2xl shadow-soft p-6 border transform transition-all duration-300 hover:scale-105 hover:shadow-lg card-hover animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-600 uppercase tracking-wide mb-2">Pending</p>
                <p className="text-4xl font-extrabold text-yellow-600">{statistics.pending}</p>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-500 rounded-2xl blur-lg opacity-30"></div>
                <div className="relative w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3 font-medium">Awaiting review</p>
          </div>

          {/* Approved */}
          <div className="glass rounded-2xl shadow-soft p-6 border transform transition-all duration-300 hover:scale-105 hover:shadow-lg card-hover animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-600 uppercase tracking-wide mb-2">Approved</p>
                <p className="text-4xl font-extrabold text-green-600">{statistics.approved}</p>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-green-500 rounded-2xl blur-lg opacity-30"></div>
                <div className="relative w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3 font-medium">Successfully verified</p>
          </div>

          {/* Rejected */}
          <div className="glass rounded-2xl shadow-soft p-6 border transform transition-all duration-300 hover:scale-105 hover:shadow-lg card-hover animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-600 uppercase tracking-wide mb-2">Rejected</p>
                <p className="text-4xl font-extrabold text-red-600">{statistics.rejected}</p>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-red-500 rounded-2xl blur-lg opacity-30"></div>
                <div className="relative w-14 h-14 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3 font-medium">Failed verification</p>
          </div>
        </div>

        {/* KYC Applications Table */}
        <div className="glass rounded-2xl shadow-soft overflow-hidden border animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="px-8 py-6 border-b border-gray-200/50 bg-gradient-to-r from-blue-50/50 to-purple-50/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-extrabold text-gray-900">KYC Applications</h2>
              </div>
              <span className="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 text-sm font-bold text-gray-700 shadow-sm">
                {kycApplications.length} Total
              </span>
            </div>
          </div>
          <div className="overflow-x-auto">
            {kycApplications.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                  <svg className="h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-base font-semibold text-gray-600">No KYC applications yet</p>
                <p className="text-sm text-gray-500 mt-1">Applications will appear here once submitted</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200/50">
                <thead className="bg-gradient-to-r from-gray-50/80 to-gray-100/80 backdrop-blur-sm">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">NID</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Submitted</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white/50 backdrop-blur-sm divide-y divide-gray-200/50">
                  {kycApplications.map((app, index) => (
                    <tr key={app._id} className="hover:bg-blue-50/50 transition-colors duration-200 animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md mr-3">
                            {app.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-gray-900">{app.name}</div>
                            {app.occupation && <div className="text-xs text-gray-500 font-medium">{app.occupation}</div>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700 font-medium">{app.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700 font-medium">{app.nid || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1.5 inline-flex text-xs leading-5 font-bold rounded-xl shadow-sm ${getStatusBadgeColor(app.status)}`}>
                          {app.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600 font-medium">
                          {new Date(app.submittedAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateStatus(app._id, 'approved')}
                            className="w-9 h-9 bg-green-500 hover:bg-green-600 text-white rounded-xl flex items-center justify-center transition-all duration-200 transform hover:scale-110 shadow-md hover:shadow-lg"
                            title="Approve"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => updateStatus(app._id, 'rejected')}
                            className="w-9 h-9 bg-red-500 hover:bg-red-600 text-white rounded-xl flex items-center justify-center transition-all duration-200 transform hover:scale-110 shadow-md hover:shadow-lg"
                            title="Reject"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                          <button
                            onClick={() => updateStatus(app._id, 'under_review')}
                            className="w-9 h-9 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl flex items-center justify-center transition-all duration-200 transform hover:scale-110 shadow-md hover:shadow-lg"
                            title="Under Review"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Back to Home Link */}
        <div className="mt-10 text-center animate-fade-in">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-300 shadow-soft hover:shadow-md font-semibold text-gray-700 hover:text-blue-600 group"
          >
            <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to KYC Form</span>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
