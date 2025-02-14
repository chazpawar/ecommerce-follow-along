import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      localStorage.setItem('userEmail', email);
      
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      
      navigate('/');
    } catch (error) {
      setErrors({ submit: 'Failed to sign in. Please check your credentials.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="w-full md:w-1/2 p-8 md:p-12 flex items-center justify-center">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          {/* Logo */}
          <div className="flex justify-center mb-8 animate-bounce-in">
            <svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>

          {/* Header */}
          <div className="text-center animate-slide-up">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome back</h1>
            <p className="text-gray-600">Please enter your details to sign in</p>
          </div>

          {errors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 flex items-center space-x-2 animate-shake">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span>{errors.submit}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="transform transition duration-200 hover:translate-y-[-2px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) {
                      setErrors({ ...errors, email: '' });
                    }
                  }}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg transition-all duration-200
                    ${errors.email 
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                  placeholder="Enter your email"
                  required
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 animate-fade-in">{errors.email}</p>
              )}
            </div>

            <div className="transform transition duration-200 hover:translate-y-[-2px]">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) {
                      setErrors({ ...errors, password: '' });
                    }
                  }}
                  className={`block w-full pl-10 pr-10 py-3 border rounded-lg transition-all duration-200
                    ${errors.password 
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center transition-transform duration-200 hover:scale-110"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600 animate-fade-in">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-all duration-200"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>Sign in</span>
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-3 hover:bg-gray-50 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google logo"
              className="w-5 h-5"
            />
            Sign in with Google
          </button>

          <p className="text-center text-gray-600">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
            >
              Sign up for free
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden md:block md:w-1/2 transform transition-transform duration-700 translate-x-0">
        <div className="h-full w-full bg-cover bg-center relative">
          <img 
            src="https://www.home-designing.com/wp-content/uploads/2016/02/black-and-white-luxurious-kitchen.jpg"
            alt="Luxury Kitchen"
            className="w-full h-full object-cover absolute inset-0"
          />
          <div className="h-full w-full bg-black bg-opacity-50 flex items-center justify-center p-12 relative z-10">
            <div className="text-white text-center animate-fade-in">
              <h2 className="text-4xl font-bold mb-4">Welcome to Our Platform</h2>
              <p className="text-lg text-gray-200">
                Discover amazing products and services tailored just for you
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;