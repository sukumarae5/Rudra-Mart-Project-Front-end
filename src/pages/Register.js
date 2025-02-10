import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { Link, useNavigate } from 'react-router-dom';
import sideImage from '../../src/assets/images/cart.jpg';

const Register = () => {
  const Navigater = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',  
    password: '',
    role: '',
  });

  const [error, setError] = useState(''); // To track errors
  const [loading, setLoading] = useState(false); // To show loading state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true

    // Password validation: must contain at least one uppercase letter
    if (!/[A-Z]/.test(formData.password)) {
      setLoading(false);
      alert('Password must contain at least one uppercase letter');
      return; // Stop the submission process if validation fails
    }if (formData.role !== 'customer' && formData.role !== 'admin') {
      alert('Role must be either "customer" or "admin"');
      return;
    }
    

    try {
      const newUser = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        phone_number: formData.phoneNumber, 
      };

      console.log('User data being sent to the API:', newUser); 

      const response = await fetch(
        'http://192.168.1.12:3000/api/users/register',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newUser),
        }
      );

      setLoading(false); // Set loading state to false after the request

      const data = await response.json(); // Parse the JSON response

      if (!response.ok) {
        // If the response is not OK (error from the server)
        console.log('Error response:', data); // Log the error response from the API
        setError(data.message || 'Failed to create account'); // Set the error message in state
        alert(`Error: ${data.message || 'Failed to create account'}`); // Display the error message in an alert
        return;
      }

      // If registration is successful, show the success message returned from the API
      alert(`Success: ${data.message || 'User registered successfully'}`);
      Navigater('/login'); // Redirect to login page
    } catch (error) {
      setLoading(false); // Set loading state to false in case of error
      console.error('Error during registration:', error);

      // Display error message in an alert if a network or other error occurs
      setError(error.message || 'Registration failed, please try again later'); // Set error state
      alert(`Error: ${error.message || 'Registration failed, please try again later'}`);
    }
  };

  const handleGoogleSignUp = () => {
    console.log('Google Sign Up clicked');
    // Google Sign Up implementation (e.g., Firebase or OAuth)
  };

  return (
    <div className="container py-5">
      <div className="row align-items-center">
        <div className="col-md-6 text-center">
          <img
            src={sideImage}  // Corrected image reference
            alt="Sign Up"
            className="img-fluid rounded"
            style={{ maxHeight: '650px' }}
          />
        </div>
        <div className="col-md-6 d-flex justify-content-center">
          <div style={{ maxWidth: '400px' }}>
            <h2 className="fw-bold mb-4">Create an Account</h2>
            <p className="text-muted mb-4">Enter your details below</p>

            <form onSubmit={handleSubmit}>
              {[ 
                { type: 'text', name: 'name', placeholder: 'Name' },
                { type: 'email', name: 'email', placeholder: 'Email' },
                { type: 'text', name: 'phoneNumber', placeholder: 'Phone Number' },
                { type: 'password', name: 'password', placeholder: 'Password' },
                { type: 'text', name: 'role', placeholder: 'Role must be either customer or admin' },
              ].map((input, index) => (
                <input
                  key={index}
                  type={input.type}
                  name={input.name}
                  placeholder={input.placeholder}
                  value={formData[input.name]}
                  onChange={handleChange}
                  className="w-full p-3 border-b border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                  required
                  aria-label={input.placeholder}
                />
              ))}

              {error && <p className="text-danger">{error}</p>} {/* Display error message */}

              <button
                type="submit"
                className="w-full py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 focus:outline-none"
                disabled={loading} // Disable button when loading
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <button
              onClick={handleGoogleSignUp}
              className="w-full d-flex align-items-center justify-content-center mt-3 py-2 px-4 border border-gray-300 rounded-lg"
            >
              <FcGoogle className="me-2" size={20} />
              Sign Up with Google
            </button>

            <p className="text-muted mt-4">
              Already have an account?{' '}
              <Link to="/login" className="text-black">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
