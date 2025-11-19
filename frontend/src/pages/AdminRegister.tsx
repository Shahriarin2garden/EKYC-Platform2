import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { adminApi } from '../services/api';
import { AdminRegistrationData } from '../types';

const AdminRegister: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<AdminRegistrationData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const response = await adminApi.register(formData);

      if (response.data.success) {
        if (response.data.data?.token) {
          localStorage.setItem('token', response.data.data.token);
          localStorage.setItem('adminEmail', formData.email);
          localStorage.setItem('adminName', formData.name);
        }

        setSuccess('Registration successful! Redirecting...');
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 1500);
      } else {
        setError(response.data.message || 'Registration failed');
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed. Email might already be registered.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 animate-fade-in-up">
        {/* Header */}
        <div className="text-center">
          <div className="relative inline-flex items-center justify-center mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur-2xl opacity-30 animate-pulse-slow"></div>
            <div className="relative h-20 w-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300 animate-gradient">
              <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
          </div>
          <h2 className="text-4xl font-extrabold gradient-text mb-3">Create Admin Account</h2>
          <p className="text-base text-gray-600">Join the admin team and manage KYC applications</p>
        </div>

        {/* Form Card */}
        <div className="glass rounded-3xl shadow-2xl p-8 border animate-scale-in">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div className="group">
                <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-3 transition-colors group-focus-within:text-blue-600">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <input 
                    id="name" 
                    name="name" 
                    type="text" 
                    required 
                    value={formData.name} 
                    onChange={handleChange} 
                    className="appearance-none rounded-2xl relative block w-full pl-12 pr-5 py-4 border-2 border-gray-200 bg-gray-50/50 placeholder-gray-400 text-gray-900 font-medium focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:bg-blue-50/50 transition-all duration-300 hover:border-gray-300" 
                    placeholder="John Doe" 
                  />
                </div>
              </div>

              <div className="group">
                <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-3 transition-colors group-focus-within:text-blue-600">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input 
                    id="email" 
                    name="email" 
                    type="email" 
                    required 
                    value={formData.email} 
                    onChange={handleChange} 
                    className="appearance-none rounded-2xl relative block w-full pl-12 pr-5 py-4 border-2 border-gray-200 bg-gray-50/50 placeholder-gray-400 text-gray-900 font-medium focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:bg-blue-50/50 transition-all duration-300 hover:border-gray-300" 
                    placeholder="admin@example.com" 
                  />
                </div>
              </div>

              <div className="group">
                <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-3 transition-colors group-focus-within:text-blue-600">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input 
                    id="password" 
                    name="password" 
                    type="password" 
                    required 
                    value={formData.password} 
                    onChange={handleChange} 
                    className="appearance-none rounded-2xl relative block w-full pl-12 pr-5 py-4 border-2 border-gray-200 bg-gray-50/50 placeholder-gray-400 text-gray-900 font-medium focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:bg-blue-50/50 transition-all duration-300 hover:border-gray-300" 
                    placeholder="Minimum 8 characters" 
                  />
                </div>
                <p className="mt-2 text-xs text-gray-500 flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Use a strong password with letters, numbers, and symbols
                </p>
              </div>

              <div className="group">
                <label htmlFor="confirmPassword" className="block text-sm font-bold text-gray-700 mb-3 transition-colors group-focus-within:text-blue-600">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <input 
                    id="confirmPassword" 
                    name="confirmPassword" 
                    type="password" 
                    required 
                    value={formData.confirmPassword} 
                    onChange={handleChange} 
                    className="appearance-none rounded-2xl relative block w-full pl-12 pr-5 py-4 border-2 border-gray-200 bg-gray-50/50 placeholder-gray-400 text-gray-900 font-medium focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:bg-blue-50/50 transition-all duration-300 hover:border-gray-300" 
                    placeholder="Re-enter your password" 
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-2xl bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-300 p-4 animate-shake">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm font-semibold text-red-800">{error}</p>
                </div>
              </div>
            )}

            {success && (
              <div className="rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 p-4 animate-bounce-subtle">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm font-semibold text-green-800">{success}</p>
                </div>
              </div>
            )}

            <div className="relative group/btn">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl blur-lg opacity-50 group-hover/btn:opacity-75 transition duration-300"></div>
              <button 
                type="submit" 
                disabled={isSubmitting} 
                className="relative w-full flex justify-center items-center py-4 px-6 border border-transparent text-base font-bold rounded-2xl text-white btn-gradient disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-xl animate-gradient"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 mr-2 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Admin Account
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </div>

            <div className="text-center space-y-3 pt-4">
              <p className="text-sm text-gray-600">
                Already have an account? <Link to="/admin" className="font-bold text-blue-600 hover:text-purple-600 transition-colors">Sign in here</Link>
              </p>
              <p className="text-sm text-gray-500">
                <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors flex items-center justify-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to KYC Form
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;
