// components/Login.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div className="min-h-screen flex">
      <div className="w-1/2 p-12">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
          <p className="text-gray-600 mb-8">Please enter your details</p>
          
          <button className="w-full mb-4 flex items-center justify-center border rounded-lg py-3 px-4 space-x-2">
            <img src="/google-icon.png" alt="" className="w-5 h-5" />
            <span>Sign in with Google</span>
          </button>
          
          <div className="flex items-center my-8">
            <div className="flex-1 border-t"></div>
            <span className="px-4 text-gray-500">or</span>
            <div className="flex-1 border-t"></div>
          </div>
          
          <form>
            <div className="mb-4">
              <label className="block text-sm mb-2">Email address</label>
              <input type="email" className="w-full p-3 border rounded-lg" />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm mb-2">Password</label>
              <input type="password" className="w-full p-3 border rounded-lg" />
            </div>
            
            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                Remember for 30 days
              </label>
              <Link to="/forgot-password" className="text-blue-600">Forgot password</Link>
            </div>
            
            <button className="w-full bg-black text-white py-3 rounded-lg mb-4">
              Sign in
            </button>
            
            <p className="text-center text-gray-600">
              Don't have an account? <Link to="/signup" className="text-blue-600">Sign up</Link>
            </p>
          </form>
        </div>
      </div>
      <div className="w-1/2 bg-gray-100"></div>
    </div>
  );
};

export default Login;