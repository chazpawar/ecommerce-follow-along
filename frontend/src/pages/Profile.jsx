import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AlertCircle, PlusCircle, Trash2 } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      
      if (!userId || !token) {
        setError('Please login to view your profile');
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/users/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setUser(response.data.data);
      setLoading(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Error fetching user data');
      setLoading(false);
    }
  };

  const handleAddressDelete = async (addressId) => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/users/${userId}/address/${addressId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Refresh user data
      await fetchUserData();
    } catch (error) {
      setError(error.response?.data?.message || 'Error deleting address');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-6">
            {user?.profilePicture ? (
              <img
                src={`${import.meta.env.VITE_API_URL}${user.profilePicture}`}
                alt="Profile"
                className="h-24 w-24 rounded-full object-cover"
              />
            ) : (
              <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-2xl text-gray-500">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <h1 className="text-2xl font-semibold">{user?.name}</h1>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Addresses Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Addresses</h2>
            <button
              onClick={() => navigate('/add-address')}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
            >
              <PlusCircle className="h-5 w-5" />
              <span>Add Address</span>
            </button>
          </div>

          {/* Address List */}
          {user?.addresses?.length > 0 ? (
            <div className="space-y-4">
              {user.addresses.map((address) => (
                <div
                  key={address._id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between">
                    <div>
                      <p>{address.street}</p>
                      <p>{`${address.city}, ${address.state} ${address.zipCode}`}</p>
                      <p>{address.country}</p>
                      {address.isDefault && (
                        <span className="inline-block mt-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                          Default Address
                        </span>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAddressDelete(address._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No addresses found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;