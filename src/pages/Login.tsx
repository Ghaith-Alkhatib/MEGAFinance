import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock } from 'lucide-react';
import logo from '../images/MEGALogolight.png';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated, error: authError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    try {
      console.log('Submitting login with:', { email, password });
      const success = await login(email, password);
      
      if (success) {
        navigate('/');
      } else {
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#3f3f3f] p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-[#3CD2F9] p-6 flex flex-col items-center">
          <div className="rounded-full bg-white p-3 mb-3">
           <img src={logo} alt="MEGA Logo" className="w-8 h-8" />
           </div>
            <h1 className="text-2xl font-bold text-white">MEGAverse Platform</h1>
            <p className="text-white/80 mt-1">Sign in to access your dashboard</p>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#3CD2F9] focus:border-[#3CD2F9]"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#3CD2F9] focus:border-[#3CD2F9]"
                  placeholder="Enter your password"
                />
              </div>
            </div>
            
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-[#3f3f3f] hover:bg-[#2f2f2f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3CD2F9] transition-colors duration-200"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
            
            {/* Test credentials for development */}
            <div className="mt-4 p-3 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-600 font-medium">Test Credentials:</p>
              <p className="text-xs text-gray-500">Email: admin@example.com</p>
              <p className="text-xs text-gray-500">Password: password123</p>
              <p className="text-xs text-gray-400 mt-1 italic">
                (These are example credentials. Use actual credentials provided by your administrator.)
              </p>
            </div>
          </form>
          
          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-600">
              © 2025 MEGAverse Platform. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;