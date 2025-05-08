import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UserSetNewpasswordpage = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const forgetuser = JSON.parse(localStorage.getItem('forgetuser'));
  const userId = forgetuser?.id;

  useEffect(() => {
    if (!userId) {
      setError('User ID not found. Please restart the password reset process.');
    }
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) return;

    // Basic validation
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password should be at least 6 characters');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch(
        `http://${process.env.REACT_APP_IP_ADDRESS}/api/users/updatepassword/${userId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ password: newPassword }),
        }
      );
console.log(response)
      const data =  response.json();
console.log(data.response)
      if (response.ok) {
        alert('Password updated successfully!');
        setLoading(false);
        navigate('/login');
      } else {
        setError(data.message || 'Failed to update password');
        setLoading(false);
      }
    } catch (err) {
      console.error('Request failed:', err);
      setError('Something went wrong while updating the password');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">Set New Password</h2>

        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

        <div className="mb-4">
          <label className="block mb-1 text-sm font-medium">New Password</label>
          <input
            type="password"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 text-sm font-medium">Confirm Password</label>
          <input
            type="password"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full text-white py-2 rounded transition ${
            loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {loading ? 'Updating...' : 'Set Password'}
        </button>
      </form>
    </div>
  );
};

export default UserSetNewpasswordpage;
