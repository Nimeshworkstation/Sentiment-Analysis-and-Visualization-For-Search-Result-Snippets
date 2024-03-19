import React, { useState, useEffect } from 'react';
import { useNavigate ,Link} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { usersignup, checkEmail } from '../services/auth';
import { accountCreated } from '../app/authSlice';

export default function Signup() {
  const isAuthenticated = useSelector((state)=>state.auth.isAuthenticated)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [emailExists, setEmailExists] = useState(false);
  const [validPassword, setValidPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    re_password: '',
  });
  const { name, email, password, re_password } = formData;

  // State to track focus on the re_password field
  const [rePasswordFocused, setRePasswordFocused] = useState(false);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Check email existence when email field loses focus
  const checkEmailExists = async () => {
    if (email) {
      try {
        const response = await checkEmail(email);
        const user_email = response.data.email;

        if (user_email) {
          setEmailExists(true);
        } else {
          setEmailExists(false);
        }
      } catch (error) {
        console.error('Error checking email existence:', error);
      }
    }
  };

  const isValidPassword = () => {
    if (rePasswordFocused && password !== re_password) {
      setValidPassword(true);
    } else {
      setValidPassword(false);
    }
  };

  useEffect(() => {
    checkEmailExists();
  }, [email]);

  useEffect(() => {
    isValidPassword();
  }, [password, re_password, rePasswordFocused]);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (password === re_password) {
      try {
        const response = await usersignup(formData);
        dispatch(accountCreated());
        navigate('/activate');
        console.log(response);
      } catch (error) {
        // Handle signup failure
      }
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
        <h3 className="text-center bg-primary bg-gradient btn-block text-light btn-block  p-1">Create an Account </h3>
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label htmlFor="Name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id=""
            name="name"
            value={name}
            required
            onChange={onChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="Email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className={`form-control ${emailExists ? 'is-invalid' : ''}`}
            id="email"
            aria-describedby="emailHelp"
            name="email"
            value={email}
            required
            onChange={onChange}
            onBlur={checkEmailExists}
          />
          {emailExists && (
            <div className="invalid-feedback">
              This email is already registered. Please use a different email.
            </div>
          )}
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
            onChange={onChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            className={`form-control ${validPassword ? 'is-invalid' : ''}`}
            id="confirmPassword"
            name="re_password"
            value={re_password}
            required
            onChange={onChange}
            onFocus={() => setRePasswordFocused(true)}
            onBlur={() => setRePasswordFocused(false)}
          />
          {validPassword && (
            <div className="invalid-feedback">
              Password and Confirm Password don't match!
            </div>
          )}
        </div>
        <div className="row">
          <div className="d-grid gap-2 col-6 mx-auto">
            <button type="submit" className="btn btn-danger rounded-pill btn-block">
              Sign Up
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
