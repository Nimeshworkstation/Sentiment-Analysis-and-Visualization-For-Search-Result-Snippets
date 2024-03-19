import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userlogin } from '../services/auth';
import Cookies from 'js-cookie';
import { useSelector, useDispatch } from 'react-redux';
import { setToken } from '../app/authSlice';

export default function Login() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const { email, password } = formData;
  const navigate = useNavigate();
  const csrftoken = Cookies.get('csrftoken');

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const loginData = { email, password };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await userlogin(loginData);
      localStorage.setItem('access', response.data.access);
      localStorage.setItem('refresh', response.data.refresh);
      dispatch(
        setToken({
          accessToken: response.data.access,
          refreshToken: response.data.refresh,
        })
      );

      navigate('/dashboard');
    } catch (error) {
      setError('Invalid email or password');
      setFormData({
        email: '',
        password: '',
      });
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
<div className="container mt-2">
  <div className="row justify-content-center">
    <div className="col-md-6 bg-dark bg-gradient text-white p-4 rounded">
      <h3 className="text-center bg-primary bg-gradient btn-block text-light btn-block  p-1">Have an Account? </h3>
      <form onSubmit={(e) => onSubmit(e)}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={email}
            required
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={password}
            required
            onChange={(e) => onChange(e)}
          />
        </div>
        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="rememberMe"
            name="rememberMe"
            onChange={(e) => onChange(e)}
          />
          <label className="form-check-label" htmlFor="rememberMe">
            Remember Me
          </label>
        </div>
        {error && <p className="text-danger mt-2">{error}</p>}
        <div className="row">
          <div className="d-grid gap-2 col-6 mx-auto">
            <button type="submit" className="btn btn-success rounded-pill  btn-block">
              Login
            </button>
          </div>
          <div className="d-grid gap-2 col-6 mx-auto">
            <Link className="btn btn-danger text-white btn-block rounded-pill" to="/reset-password">
              Forgot Password
            </Link>
          </div>
        </div>
      </form>
    </div>
  </div>
</div>


  );
}
