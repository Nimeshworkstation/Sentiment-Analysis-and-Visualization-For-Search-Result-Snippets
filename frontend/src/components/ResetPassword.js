import React, { useState, useEffect } from 'react';
import { resetpassword } from '../services/auth';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function ResetPassword() {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [formData, setFormData] = useState({
    email: ' ', // Define newPasswordAgain in the initial state
  });

  const { email } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await resetpassword(email);
      navigate('/reset-password-activate/');
    } catch (error) {
      // Handle password reset request failure
    }
  };

  useEffect(() => {
    // Check if the user is already authenticated
    if (isAuthenticated) {
      // Redirect to the home page if authenticated
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="container mt-2">
      <div className="row justify-content-center">
        <div className="col-md-6 bg-dark bg-gradient text-white p-4 rounded">
          <h3 className="text-center bg-primary bg-gradient btn-blockl text-light btn-block  p-2">Reset Your Password</h3>
          <form onSubmit={(e) => onSubmit(e)}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Enter your Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={email}
                required
                onChange={onChange}
              />
            </div>
       <div className="row">
          <div className="d-grid gap-2 col-6 mx-auto">
            <button type="submit" className="btn btn-danger rounded-pill btn-block">
              Reset Password
            </button>
          </div>
          <div className="d-grid gap-2 col-6 mx-auto">
            <Link className="btn btn-success text-white btn-block rounded-pill" to="/">
              Go Back
            </Link>
          </div>
        </div>
          </form>
        </div>
      </div>
    </div>
  );
}
